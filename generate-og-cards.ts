import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { BLOG_ARTICLES } from './src/blogData';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryLabel?: string;
  summary: string;
  eyeCatch?: string;
  tags?: string[];
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Category themes (Color gradients and badge styles)
const CATEGORY_THEMES: Record<string, { badgeFrom: string; badgeTo: string; border: string; label: string }> = {
  beginner: { badgeFrom: '#f43f5e', badgeTo: '#e11d48', border: '#fda4af', label: '未経験者向け' },
  salary: { badgeFrom: '#f59e0b', badgeTo: '#d97706', border: '#fde68a', label: '給与・稼ぎ方' },
  security: { badgeFrom: '#10b981', badgeTo: '#059669', border: '#a7f3d0', label: '安心・身バレ対策' },
  lifestyle: { badgeFrom: '#8b5cf6', badgeTo: '#7c3aed', border: '#ddd6fe', label: '生活・働き方' },
  onboarding: { badgeFrom: '#0ea5e9', badgeTo: '#0284c7', border: '#bae6fd', label: '面接・体入の流れ' },
};

function splitTitle(fullTitle: string): { badge: string; mainLines: string[] } {
  let badge = '';
  let rest = fullTitle.trim();

  // Extract leading 【...】 bracket if present
  const bracketMatch = rest.match(/^[【\[](.*?)[】\]]\s*/);
  if (bracketMatch) {
    badge = bracketMatch[1].trim();
    rest = rest.replace(/^[【\[].*?[】\]]\s*/, '').trim();
  }

  // Wrap rest into 1~3 lines (approx 16-18 chars per line)
  const maxLineChars = 17;
  const lines: string[] = [];

  // Break by natural delimiters if present (punctuation, spaces, etc.)
  const segments = rest.split(/(?<=[、・！？!?\s])/);
  let currentLine = '';

  for (const seg of segments) {
    if ((currentLine + seg).length <= maxLineChars) {
      currentLine += seg;
    } else {
      if (currentLine) {
        lines.push(currentLine.trim());
        currentLine = '';
      }
      if (seg.length > maxLineChars) {
        // hard split long segments
        for (let i = 0; i < seg.length; i += maxLineChars) {
          const chunk = seg.substring(i, i + maxLineChars);
          if (i + maxLineChars >= seg.length) {
            currentLine = chunk;
          } else {
            lines.push(chunk);
          }
        }
      } else {
        currentLine = seg;
      }
    }
  }
  if (currentLine) {
    lines.push(currentLine.trim());
  }

  // Limit to at most 3 main lines
  return {
    badge,
    mainLines: lines.slice(0, 3),
  };
}

function wrapText(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  const lines: string[] = [];
  for (let i = 0; i < clean.length && lines.length < maxLines; i += maxCharsPerLine) {
    let line = clean.substring(i, i + maxCharsPerLine);
    if (lines.length === maxLines - 1 && clean.length > i + maxCharsPerLine) {
      line = line.substring(0, maxCharsPerLine - 1) + '…';
    }
    lines.push(line);
  }
  return lines;
}

export async function generateOgCardForArticle(article: BlogArticle, outputDir: string): Promise<string> {
  const width = 1200;
  const height = 630;

  // Resolve base image
  const defaultImage = path.join(process.cwd(), 'public', 'images', 'japanese_hero_banner.jpg');
  let baseImagePath = defaultImage;

  if (article.eyeCatch) {
    const rawPath = article.eyeCatch.replace(/^\//, '');
    const candidate1 = path.join(process.cwd(), 'public', rawPath);
    const candidate2 = path.join(process.cwd(), rawPath);
    if (fs.existsSync(candidate1)) {
      baseImagePath = candidate1;
    } else if (fs.existsSync(candidate2)) {
      baseImagePath = candidate2;
    }
  }

  // Load and resize base image to 1200x630
  let baseImgBuffer: Buffer;
  try {
    baseImgBuffer = await sharp(baseImagePath)
      .resize(width, height, { fit: 'cover', position: 'right' })
      .toBuffer();
  } catch (e) {
    baseImgBuffer = await sharp(defaultImage)
      .resize(width, height, { fit: 'cover', position: 'right' })
      .toBuffer();
  }

  // Theme configuration
  const theme = CATEGORY_THEMES[article.category] || CATEGORY_THEMES['beginner'];

  // Title breakdown
  const { badge: titleBadge, mainLines } = splitTitle(article.title);
  const escapedTitleBadge = escapeXml(titleBadge);

  // Calculate vertical centering in the upper-middle safe zone (avoiding X's bottom title bar overlay)
  const hasBadge = Boolean(escapedTitleBadge);
  const totalLinesHeight = (hasBadge ? 64 : 0) + mainLines.length * 64;
  const startY = Math.max(150, Math.round((520 - totalLinesHeight) / 2));

  // Main title SVG lines (ONLY "滝井新地" + Title)
  let titleSvgLines = '';
  let yOffset = 0;

  if (escapedTitleBadge) {
    titleSvgLines += `
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="${Math.min(760, escapedTitleBadge.length * 28 + 36)}" height="46" rx="8" fill="${theme.badgeFrom}" fill-opacity="0.28" stroke="${theme.badgeFrom}" stroke-width="1.5" />
        <text x="18" y="31" fill="${theme.border}" font-size="24" font-family="'IPAPGothic', 'IPAゴシック', sans-serif" font-weight="bold">
          【${escapedTitleBadge}】
        </text>
      </g>
    `;
    yOffset += 68;
  }

  mainLines.forEach((line, idx) => {
    const isHighlight = idx === mainLines.length - 1;
    const textColor = isHighlight ? theme.border : '#ffffff';
    titleSvgLines += `
      <text x="0" y="${yOffset + 44}" fill="${textColor}" font-size="44" font-family="'IPAPGothic', 'IPAゴシック', sans-serif" font-weight="bold" letter-spacing="1">
        ${escapeXml(line)}
      </text>
    `;
    yOffset += 64;
  });

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="overlayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0a0307" stop-opacity="0.95" />
        <stop offset="55%" stop-color="#140610" stop-opacity="0.90" />
        <stop offset="80%" stop-color="#190714" stop-opacity="0.72" />
        <stop offset="100%" stop-color="#190714" stop-opacity="0.35" />
      </linearGradient>
      <linearGradient id="catGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${theme.badgeFrom}" />
        <stop offset="100%" stop-color="${theme.badgeTo}" />
      </linearGradient>
    </defs>

    <!-- Dark gradient overlay for text readability -->
    <rect width="${width}" height="${height}" fill="url(#overlayGrad)" />

    <!-- Top & Bottom decorative border lines -->
    <rect x="0" y="0" width="${width}" height="6" fill="url(#catGrad)" />
    <rect x="0" y="${height - 6}" width="${width}" height="6" fill="url(#catGrad)" />

    <!-- Top Label: 滝井新地 -->
    <g transform="translate(72, ${startY - 68})">
      <rect x="0" y="0" width="148" height="44" rx="8" fill="url(#catGrad)" />
      <text x="74" y="30" fill="#ffffff" font-size="24" font-family="'IPAPGothic', 'IPAゴシック', sans-serif" font-weight="bold" text-anchor="middle" letter-spacing="2">
        滝井新地
      </text>
    </g>

    <!-- Main Title Group -->
    <g transform="translate(72, ${startY})">
      ${titleSvgLines}
    </g>
  </svg>
  `;

  const fileName = `card_${article.slug}.jpg`;
  const outPath = path.join(outputDir, fileName);

  await sharp(baseImgBuffer)
    .composite([{ input: Buffer.from(svg) }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outPath);

  return fileName;
}

async function main() {
  const rootDir = process.cwd();
  const articles: BlogArticle[] = (BLOG_ARTICLES as BlogArticle[]) || [];
  console.log(`🎨 Starting generation of custom text-inscribed OGP card images for ${articles.length} articles...`);

  const publicImagesDir = path.join(rootDir, 'public', 'images');
  const srcImagesDir = path.join(rootDir, 'src', 'assets', 'images');
  const distImagesDir = path.join(rootDir, 'dist', 'images');

  fs.mkdirSync(publicImagesDir, { recursive: true });
  fs.mkdirSync(srcImagesDir, { recursive: true });
  if (fs.existsSync(path.join(rootDir, 'dist'))) {
    fs.mkdirSync(distImagesDir, { recursive: true });
  }

  // Also generate a clean card for /blog index page
  const blogIndexCardFile = await generateOgCardForArticle(
    {
      id: 'blog-index',
      slug: 'blog_index',
      title: 'お仕事コラム・完全ガイド一覧',
      category: 'beginner',
      summary: '',
      eyeCatch: '/images/col_ryotei_flow_1789107427433.jpg',
    },
    publicImagesDir
  );
  const blogIndexSrc = path.join(publicImagesDir, blogIndexCardFile);
  fs.copyFileSync(blogIndexSrc, path.join(srcImagesDir, blogIndexCardFile));
  if (fs.existsSync(distImagesDir)) {
    fs.copyFileSync(blogIndexSrc, path.join(distImagesDir, blogIndexCardFile));
  }

  let count = 0;
  for (const article of articles) {
    const fileName = await generateOgCardForArticle(article, publicImagesDir);
    // Copy to src/assets/images and dist/images if exists
    const srcFile = path.join(publicImagesDir, fileName);
    fs.copyFileSync(srcFile, path.join(srcImagesDir, fileName));
    if (fs.existsSync(distImagesDir)) {
      fs.copyFileSync(srcFile, path.join(distImagesDir, fileName));
    }
    count++;
    if (count % 20 === 0 || count === articles.length) {
      console.log(`✅ Generated ${count} / ${articles.length} article card images`);
    }
  }

  console.log(`🎉 Finished generating all ${count} article OGP card images with 滝井新地 + Title only!`);
}

main().catch(console.error);
