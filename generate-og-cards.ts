import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';
import { BLOG_ARTICLES } from './src/blogData';

// Ensure rounded cute Japanese font (Zen Maru Gothic) is available to fontconfig/librsvg
try {
  const repoFontsDir = path.join(process.cwd(), 'fonts');
  const userFontsDir = path.join(process.env.HOME || '/root', '.local', 'share', 'fonts');
  if (fs.existsSync(repoFontsDir)) {
    fs.mkdirSync(userFontsDir, { recursive: true });
    for (const file of fs.readdirSync(repoFontsDir)) {
      if (file.endsWith('.ttf') || file.endsWith('.otf')) {
        const dest = path.join(userFontsDir, file);
        if (!fs.existsSync(dest)) {
          fs.copyFileSync(path.join(repoFontsDir, file), dest);
        }
      }
    }
    execSync('fc-cache -f', { stdio: 'ignore' });
  }
} catch {
  // Ignore font cache errors in restricted environments
}

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

// Cute feminine pastel color palettes per category
const CATEGORY_THEMES: Record<
  string,
  {
    accentFrom: string;
    accentTo: string;
    borderOuter: string;
    borderInner: string;
    subBadgeBg: string;
    subBadgeBorder: string;
    subBadgeText: string;
    highlightLine: string;
    markerColor: string;
  }
> = {
  beginner: {
    accentFrom: '#ff6b95',
    accentTo: '#ff8da1',
    borderOuter: '#ff9ebb',
    borderInner: '#ffc2d4',
    subBadgeBg: '#fff0f5',
    subBadgeBorder: '#ff8da1',
    subBadgeText: '#d6336c',
    highlightLine: '#d6336c',
    markerColor: '#ffe0eb',
  },
  salary: {
    accentFrom: '#ff758f',
    accentTo: '#ff9a76',
    borderOuter: '#ffa894',
    borderInner: '#ffd0c4',
    subBadgeBg: '#fff4f0',
    subBadgeBorder: '#ff8a65',
    subBadgeText: '#c93b5b',
    highlightLine: '#c93b5b',
    markerColor: '#ffe8cc',
  },
  security: {
    accentFrom: '#ec6ead',
    accentTo: '#f48fb1',
    borderOuter: '#f48fb1',
    borderInner: '#f8bbd0',
    subBadgeBg: '#fdf2f8',
    subBadgeBorder: '#ec6ead',
    subBadgeText: '#b83280',
    highlightLine: '#b83280',
    markerColor: '#fce7f3',
  },
  lifestyle: {
    accentFrom: '#f06595',
    accentTo: '#cc5de8',
    borderOuter: '#e599f7',
    borderInner: '#f3d9fa',
    subBadgeBg: '#f8f0fc',
    subBadgeBorder: '#da77f2',
    subBadgeText: '#9c36b5',
    highlightLine: '#ad2870',
    markerColor: '#f3d9fa',
  },
  onboarding: {
    accentFrom: '#ff6b8b',
    accentTo: '#ffa07a',
    borderOuter: '#ff9ebb',
    borderInner: '#ffd1dc',
    subBadgeBg: '#fff0f3',
    subBadgeBorder: '#ff85a1',
    subBadgeText: '#c92a62',
    highlightLine: '#c92a62',
    markerColor: '#ffe3ec',
  },
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

  // Wrap rest into 1~3 balanced lines (max ~16 chars per line for big, cute readability)
  const maxLineChars = 16;
  const lines: string[] = [];

  // Break by natural Japanese delimiters if present
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

  return {
    badge,
    mainLines: lines.slice(0, 3),
  };
}

export async function generateOgCardForArticle(article: BlogArticle, outputDir: string): Promise<string> {
  const width = 1200;
  const height = 630;

  // Resolve base image (clean, consistent warm Japanese aesthetic)
  const defaultImage = path.join(process.cwd(), 'public', 'images', 'japanese_hero_banner.jpg');
  const baseImagePath = defaultImage;

  // Load, slightly blur & brighten base image for a soft, dreamy feminine backdrop
  let baseImgBuffer: Buffer;
  try {
    baseImgBuffer = await sharp(baseImagePath)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .modulate({ brightness: 1.12, saturation: 1.05 })
      .blur(2)
      .toBuffer();
  } catch (e) {
    baseImgBuffer = await sharp(defaultImage)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .modulate({ brightness: 1.12, saturation: 1.05 })
      .blur(2)
      .toBuffer();
  }

  const theme = CATEGORY_THEMES[article.category] || CATEGORY_THEMES['beginner'];

  // Title breakdown (ONLY "滝井新地" + Title)
  const { badge: titleBadge, mainLines } = splitTitle(article.title);
  const escapedTitleBadge = escapeXml(titleBadge);

  // Safe card zone: y = 36 to 544 (leaves bottom 86px clear for X's bottom overlay pill)
  const cardCenterX = 600;
  const hasBadge = Boolean(escapedTitleBadge);
  const fontSize = mainLines.length >= 3 ? 46 : 50;
  const lineStep = mainLines.length >= 3 ? 66 : 72;

  // Compute vertical layout inside card (y from 125 to 510)
  const totalContentHeight = (hasBadge ? 68 : 0) + mainLines.length * lineStep;
  let currentY = Math.round(135 + (370 - totalContentHeight) / 2);

  let titleSvgElements = '';

  if (escapedTitleBadge) {
    const badgeWidth = Math.min(860, Math.max(280, escapedTitleBadge.length * 31 + 64));
    const badgeX = cardCenterX - badgeWidth / 2;
    titleSvgElements += `
      <g transform="translate(0, ${currentY})">
        <rect x="${badgeX}" y="0" width="${badgeWidth}" height="52" rx="26" fill="${theme.subBadgeBg}" stroke="${theme.subBadgeBorder}" stroke-width="2.5" />
        <text x="${cardCenterX}" y="36" fill="${theme.subBadgeText}" font-size="29" font-family="'Zen Maru Gothic', 'Zen Maru Gothic Black', 'IPAPGothic', sans-serif" font-weight="bold" text-anchor="middle" letter-spacing="1.5">
          ♥ ${escapedTitleBadge} ♥
        </text>
      </g>
    `;
    currentY += 74;
  }

  mainLines.forEach((line, idx) => {
    const isLastLine = idx === mainLines.length - 1;
    const textColor = isLastLine ? theme.highlightLine : '#3d1e28';
    const approxTextWidth = Math.min(960, line.length * (fontSize + 2));
    const markerX = cardCenterX - approxTextWidth / 2 - 12;
    const markerWidth = approxTextWidth + 24;

    if (isLastLine) {
      // Cute pastel highlighter underline on the final key line
      titleSvgElements += `
        <rect x="${markerX}" y="${currentY + fontSize - 14}" width="${markerWidth}" height="22" rx="11" fill="${theme.markerColor}" />
      `;
    }

    titleSvgElements += `
      <text x="${cardCenterX}" y="${currentY + fontSize}" fill="${textColor}" stroke="#ffffff" stroke-width="9" stroke-linejoin="round" paint-order="stroke fill" font-size="${fontSize}" font-family="'Zen Maru Gothic Black', 'Zen Maru Gothic', 'IPAPGothic', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="1.5">
        ${escapeXml(line)}
      </text>
    `;
    currentY += lineStep;
  });

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pastelWash" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fff0f5" stop-opacity="0.82" />
        <stop offset="50%" stop-color="#ffe4ec" stop-opacity="0.76" />
        <stop offset="100%" stop-color="#fff5f7" stop-opacity="0.82" />
      </linearGradient>
      <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${theme.accentFrom}" />
        <stop offset="100%" stop-color="${theme.accentTo}" />
      </linearGradient>
      <linearGradient id="cardBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.96" />
        <stop offset="100%" stop-color="#fff9fb" stop-opacity="0.96" />
      </linearGradient>
    </defs>

    <!-- Soft pastel wash over photo -->
    <rect width="${width}" height="${height}" fill="url(#pastelWash)" />

    <!-- Cute decorative bokeh circles -->
    <circle cx="90" cy="80" r="65" fill="#ffb6c8" fill-opacity="0.28" />
    <circle cx="1120" cy="100" r="80" fill="#ffc2d4" fill-opacity="0.30" />
    <circle cx="105" cy="520" r="55" fill="#ffd6e0" fill-opacity="0.35" />
    <circle cx="1100" cy="500" r="70" fill="#ffb6c8" fill-opacity="0.25" />

    <!-- Main Rounded Cream Card (Safe above X bottom overlay) -->
    <rect x="64" y="46" width="1072" height="498" rx="40" fill="#ffccd8" fill-opacity="0.45" />
    <rect x="58" y="40" width="1072" height="498" rx="40" fill="url(#cardBg)" stroke="${theme.borderOuter}" stroke-width="5" />

    <!-- Cute stitched inner frame -->
    <rect x="78" y="60" width="1032" height="458" rx="28" fill="none" stroke="${theme.borderInner}" stroke-width="2.5" stroke-dasharray="10 7" />

    <!-- Corner cute sparkles -->
    <text x="112" y="108" fill="${theme.accentFrom}" font-size="28" font-family="'Zen Maru Gothic', sans-serif">✿</text>
    <text x="1058" y="108" fill="${theme.accentFrom}" font-size="28" font-family="'Zen Maru Gothic', sans-serif">✿</text>
    <text x="112" y="492" fill="${theme.accentTo}" font-size="24" font-family="'Zen Maru Gothic', sans-serif">✧</text>
    <text x="1060" y="492" fill="${theme.accentTo}" font-size="24" font-family="'Zen Maru Gothic', sans-serif">✧</text>

    <!-- Top Ribbon Badge: 滝井新地 -->
    <g transform="translate(${cardCenterX - 135}, 14)">
      <rect x="0" y="4" width="270" height="58" rx="29" fill="#f8a5bc" fill-opacity="0.45" />
      <rect x="0" y="0" width="270" height="58" rx="29" fill="url(#ribbonGrad)" stroke="#ffffff" stroke-width="3.5" />
      <text x="135" y="40" fill="#ffffff" font-size="30" font-family="'Zen Maru Gothic Black', 'Zen Maru Gothic', 'IPAPGothic', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="3">
        ✿ 滝井新地 ✿
      </text>
    </g>

    <!-- Main Title Content (ONLY 滝井新地 + Title) -->
    ${titleSvgElements}
  </svg>
  `;

  const fileName = `card_${article.slug}.jpg`;
  const outPath = path.join(outputDir, fileName);

  await sharp(baseImgBuffer)
    .composite([{ input: Buffer.from(svg) }])
    .jpeg({ quality: 92, mozjpeg: true })
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
