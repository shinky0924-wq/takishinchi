import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';
import { BLOG_ARTICLES } from './src/blogData';

// Ensure rounded Japanese font (Zen Maru Gothic) is available to fontconfig/librsvg
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

// Pool of high quality, authentic Japanese photographic backgrounds
const CURATED_BACKGROUND_PHOTOS = [
  'col_street_lanterns_1789107524691.jpg', // Warm lantern street (like the reference sample!)
  'jp_kimono_style_1789467837838.jpg',     // Japanese girl in lovely kimono
  'jp_cast_tatami_1789467727461.jpg',      // Girl in kimono on tatami
  'jp_confident_smile_1789467788318.jpg',  // Smiling confident Japanese young woman
  'col_ryotei_flow_1789107427433.jpg',     // Ryotei interior with warm lanterns
  'col_vanity_trial_1789107497172.jpg',    // Vanity mirror / makeup table
  'jp_two_friends_1789467775509.jpg',      // Two friendly Japanese girls
  'col_salary_savings_1789107442335.jpg',  // Salary & savings envelope
  'jp_savings_jar_1789468021098.jpg',      // Savings jar & cute desk
  'col_cafe_interview_1789107484817.jpg',  // Stylish cafe interview table
  'col_studio_room_1789107471455.jpg',     // Cozy private room / dormitory
  'takii_atmosphere_hero.jpg',             // Atmospheric Takii street
  'jp_skincare_glow_1789467940047.jpg',    // Beauty & skincare hand mirror
  'jp_fluffy_pancake_1789467858767.jpg',   // Cafe fluffy pancakes
  'col_privacy_protect_1789107457068.jpg', // Privacy & discrete support
  'col_planner_shift_1789107555087.jpg',   // Schedule planner & desk
  'jp_bank_finance_1789467925368.jpg',     // Bank & finance management
  'jp_cozy_bedroom_1789468035819.jpg',     // Cozy warm bed & relax
  'jp_herbal_tea_1789468007366.jpg',       // Night herbal tea & relaxation
  'jp_warm_footbath_1789467870650.jpg',    // Warm footbath & self-care
  'jp_bubble_bath_1789467952561.jpg',      // Bath salt & reset care
  'jp_room_flowers_1789467966092.jpg',     // Room interior flowers
  'jp_ryotei_manner_1789467980075.jpg',    // Ryotei tea & manner
  'jp_star_necklace_1789467896476.jpg',    // Star jewelry & motivation
  'jp_mocktail_drink_1789467883709.jpg',   // Non-alcoholic stylish drinks
  'jp_aroma_mist_1789467993508.jpg',       // Aroma diffuser & scent
  'jp_strawberry_cake_1789468061754.jpg',  // Sweets cafe treat
  'jp_overseas_travel_1789468075905.jpg',  // Travel & dream savings
  'jp_woman_salary_1789467749655.jpg',     // Cast receiving cash pay
  'jp_hand_mirror_1789467802719.jpg',      // Mirror & confidence
  'jp_mother_child_1789467823272.jpg',     // Childcare & single mother support
  'japanese_hero_banner.jpg',              // Classic luxury ryotei interior
  'japanese_cast_woman.jpg',               // Elegant Japanese cast portrait
  'ryotei_entrance_lantern_1789108525834.jpg', // Traditional entrance lantern
  'staff_lounge_support_1789108549559.jpg',    // Friendly staff lounge
  'col_merit_choice_1789107511080.jpg',    // Merit choice lantern
  'col_welcome_gift_1783883703745.jpg',    // Welcome bonus gift
  'col_art_11_tobitashinchi-short-.jpg',   // Short term work
  'col_art_12_tobitashinchi-safety.jpg',   // Safety & security
  'col_art_13_tobitashinchi-kimono.jpg',   // Kimono dressing
  'col_art_14_tobitashinchi-double.jpg',   // Double work OL
  'col_art_15_tobitashinchi-mental.jpg',   // Mental support
  'col_art_16_tobitashinchi-search.jpg',   // Search keywords
  'col_art_17_tobitashinchi-one-da.jpg',   // One day flow
  'col_art_18_tobitashinchi-obacha.jpg',   // Obachan support
  'col_art_19_tobitashinchi-kimono.jpg',   // Kimono makeup
  'col_art_20_tobitashinchi-privac.jpg',   // Privacy tips
  'col_art_21_tobitashinchi-age-lo.jpg',   // Age & looks
  'col_art_22_tobitashinchi-safety.jpg',   // Safe security
  'col_art_23_tobitashinchi-weeken.jpg',   // Weekend shift
  'col_art_24_tobitashinchi-trial-.jpg',   // Trial work guide
  'col_art_25_tobitashinchi-mental.jpg',   // Mental care
  'col_art_26_tobitashinchi-popula.jpg',   // Popular cast tips
  'col_art_27_tobitashinchi-beauty.jpg',   // Beauty investment
  'col_art_28_tobitashinchi-studen.jpg',   // Student & youth
  'col_art_29_tobitashinchi-10mill.jpg',   // 10 million yen savings
  'col_art_30_tobitashinchi-friend.jpg',   // Friends recruitment
  'col_art_31_tobitashinchi-tennoj.jpg',   // Tennoji & Kyobashi access
  'col_art_45_tobitashinchi-friend.jpg',   // Pair application
  'col_art_60_commute-access-tenno.jpg',   // Commute access
  'col_art_73_night-relax-sleep-qu.jpg',   // Night sleep quality
  'col_art_93_cozy-blanket-room-in.jpg',   // Cozy blanket & room
  'col_art_95_non-alcoholic-juice-.jpg',   // Non-alcoholic drinks
  'col_art_99_tobitashinchi-bad-sh.jpg',   // Clean salary environment
  'col_art_100_tobitashinchi-single.jpg'   // Single mother support
];

function selectBackgroundForArticle(article: BlogArticle): string {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  const text = `${article.slug} ${article.title} ${article.category} ${(article.tags || []).join(' ')}`.toLowerCase();

  // 1. Direct thematic matches based on content keywords
  if (text.includes('kimono') || text.includes('着物') || text.includes('浴衣') || text.includes('和装')) {
    const list = ['jp_kimono_style_1789467837838.jpg', 'col_art_13_tobitashinchi-kimono.jpg', 'col_art_19_tobitashinchi-kimono.jpg', 'jp_cast_tatami_1789467727461.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }
  if (text.includes('salary') || text.includes('給料') || text.includes('給与') || text.includes('日払い') || text.includes('手渡し') || text.includes('貯金') || text.includes('1000万')) {
    const list = ['col_salary_savings_1789107442335.jpg', 'jp_savings_jar_1789468021098.jpg', 'jp_woman_salary_1789467749655.jpg', 'jp_bank_finance_1789467925368.jpg', 'col_art_29_tobitashinchi-10mill.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }
  if (text.includes('safety') || text.includes('安心') || text.includes('安全') || text.includes('衛生') || text.includes('身バレ') || text.includes('顔バレ') || text.includes('privacy')) {
    const list = ['col_street_lanterns_1789107524691.jpg', 'col_privacy_protect_1789107457068.jpg', 'jp_privacy_discreet_1789468091908.jpg', 'col_art_12_tobitashinchi-safety.jpg', 'col_art_20_tobitashinchi-privac.jpg', 'col_art_22_tobitashinchi-safety.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }
  if (text.includes('trial') || text.includes('体験') || text.includes('体入') || text.includes('面接') || text.includes('interview')) {
    const list = ['col_vanity_trial_1789107497172.jpg', 'col_cafe_interview_1789107484817.jpg', 'col_art_24_tobitashinchi-trial-.jpg', 'staff_lounge_support_1789108549559.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }
  if (text.includes('friend') || text.includes('友達') || text.includes('ペア')) {
    const list = ['jp_two_friends_1789467775509.jpg', 'col_art_30_tobitashinchi-friend.jpg', 'col_art_45_tobitashinchi-friend.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }
  if (text.includes('dorm') || text.includes('寮') || text.includes('一人暮らし') || text.includes('出稼ぎ') || text.includes('room')) {
    const list = ['col_studio_room_1789107471455.jpg', 'jp_cozy_bedroom_1789468035819.jpg', 'col_art_93_cozy-blanket-room-in.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }
  if (text.includes('cafe') || text.includes('カフェ') || text.includes('スイーツ') || text.includes('ご褒美') || text.includes('パンケーキ')) {
    const list = ['jp_fluffy_pancake_1789467858767.jpg', 'jp_strawberry_cake_1789468061754.jpg', 'col_cafe_interview_1789107484817.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }
  if (text.includes('beauty') || text.includes('メイク') || text.includes('美肌') || text.includes('スキンケア') || text.includes('コスメ')) {
    const list = ['jp_skincare_glow_1789467940047.jpg', 'jp_hand_mirror_1789467802719.jpg', 'col_art_27_tobitashinchi-beauty.jpg', 'col_vanity_trial_1789107497172.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }
  if (text.includes('mother') || text.includes('シンママ') || text.includes('託児所') || text.includes('子育て')) {
    const list = ['jp_mother_child_1789467823272.jpg', 'col_art_100_tobitashinchi-single.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }

  // 2. Fallback: select distinct photo based on article numerical ID
  const numId = parseInt(article.id, 10) || 0;
  const picked = CURATED_BACKGROUND_PHOTOS[numId % CURATED_BACKGROUND_PHOTOS.length];
  if (fs.existsSync(path.join(imagesDir, picked))) {
    return picked;
  }

  return 'col_street_lanterns_1789107524691.jpg';
}

// Splits the title completely, preserving 100% of the text without any omission
function splitTitleFull(fullTitle: string): string[] {
  let rest = fullTitle.trim();
  let badge = '';

  const bracketMatch = rest.match(/^[【\[](.*?)[】\]]\s*/);
  if (bracketMatch) {
    badge = bracketMatch[1].trim();
    rest = rest.replace(/^[【\[].*?[】\]]\s*/, '').trim();
  }

  const lines: string[] = [];
  if (badge) {
    lines.push(badge);
  }

  // Target 15-17 characters per line for the remaining content
  const idealChars = rest.length > 28 ? 16 : 14;
  const parts = rest.split(/(?<=[、・！？!?\s])/);
  let cur = '';

  for (const p of parts) {
    if ((cur + p).length <= idealChars) {
      cur += p;
    } else {
      if (cur) lines.push(cur.trim());
      if (p.length > idealChars) {
        for (let i = 0; i < p.length; i += idealChars) {
          const chunk = p.substring(i, i + idealChars);
          if (i + idealChars >= p.length) {
            cur = chunk;
          } else {
            lines.push(chunk);
          }
        }
      } else {
        cur = p;
      }
    }
  }
  if (cur) lines.push(cur.trim());

  // Prevent tiny trailing orphan line
  if (lines.length >= 2 && lines[lines.length - 1].length <= 3) {
    const last = lines.pop();
    lines[lines.length - 1] += last;
  }

  return lines;
}

export async function generateOgCardForArticle(article: BlogArticle, outputDir: string): Promise<string> {
  const width = 1200;
  const height = 630;

  // Resolve unique photographic background for this article
  const bgFileName = selectBackgroundForArticle(article);
  const baseImagePath = path.join(process.cwd(), 'public', 'images', bgFileName);

  // Load and enhance photo background
  let baseImgBuffer: Buffer;
  try {
    baseImgBuffer = await sharp(baseImagePath)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .modulate({ brightness: 1.05, saturation: 1.08 })
      .toBuffer();
  } catch (e) {
    const fallbackPath = path.join(process.cwd(), 'public', 'images', 'col_street_lanterns_1789107524691.jpg');
    baseImgBuffer = await sharp(fallbackPath)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .modulate({ brightness: 1.05, saturation: 1.08 })
      .toBuffer();
  }

  // 100% of title included
  const mainLines = splitTitleFull(article.title);

  // Dynamic font sizing & vertical layout based on line count
  const is4Lines = mainLines.length >= 4;
  const fontSize = is4Lines ? 38 : (mainLines.length === 3 ? 44 : 48);
  const lineStep = is4Lines ? 62 : (mainLines.length === 3 ? 72 : 78);

  const totalHeight = mainLines.length * lineStep;
  const currentY = Math.round(140 + (430 - totalHeight) / 2);

  let headlineElements = '';
  let yPos = currentY;

  mainLines.forEach((line, idx) => {
    const escapedLine = escapeXml(line);
    const textWidthApprox = Math.min(800, line.length * (fontSize * 1.02));

    if (idx === 0) {
      // First line gets the warm coral-peach highlight box
      headlineElements += `
        <g transform="translate(64, ${yPos})">
          <rect x="-10" y="0" width="${textWidthApprox + 28}" height="${fontSize + 20}" rx="10" fill="url(#peachPill)" />
          <text x="4" y="${fontSize + 4}" fill="#ffffff" font-size="${fontSize}" font-family="'Zen Maru Gothic Black', 'Zen Maru Gothic', sans-serif" font-weight="900" letter-spacing="1.5">
            ${escapedLine}
          </text>
        </g>
      `;
    } else {
      // Subsequent lines get large crisp white with subtle dark stroke and drop-shadow
      headlineElements += `
        <g transform="translate(64, ${yPos})" filter="url(#textShadow)">
          <text x="0" y="${fontSize + 8}" fill="#ffffff" stroke="#000000" stroke-width="3" stroke-opacity="0.35" paint-order="stroke fill" font-size="${fontSize}" font-family="'Zen Maru Gothic Black', 'Zen Maru Gothic', sans-serif" font-weight="900" letter-spacing="1.5">
            ${escapedLine}
          </text>
        </g>
      `;
    }
    yPos += lineStep;
  });

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Horizontal vignette: dark on left for 100% text readability, transparent on right to showcase the woman & lanterns -->
      <linearGradient id="leftVignette" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0a0408" stop-opacity="0.95" />
        <stop offset="42%" stop-color="#10060e" stop-opacity="0.90" />
        <stop offset="60%" stop-color="#140812" stop-opacity="0.68" />
        <stop offset="80%" stop-color="#140812" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#140812" stop-opacity="0.0" />
      </linearGradient>
      <!-- Vibrant coral-rose gradient for big prominent 滝井新地 branding badge -->
      <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ff3366" />
        <stop offset="100%" stop-color="#ff6b8b" />
      </linearGradient>
      <!-- Coral-peach gradient for headline highlight box -->
      <linearGradient id="peachPill" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ff6578" />
        <stop offset="100%" stop-color="#ff856c" />
      </linearGradient>
      <filter id="textShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.90" />
      </filter>
    </defs>

    <!-- Photo overlays -->
    <rect width="${width}" height="${height}" fill="url(#leftVignette)" />

    <!-- Top Left: 滝井新地 (BIG & PROMINENT BRANDING) -->
    <g transform="translate(64, 46)">
      <rect x="0" y="0" width="280" height="64" rx="32" fill="url(#brandGrad)" stroke="#ffffff" stroke-width="2.5" />
      <text x="140" y="45" fill="#ffffff" font-size="38" font-family="'Zen Maru Gothic Black', 'Zen Maru Gothic', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="4">
        🌸 滝井新地
      </text>
    </g>

    <!-- ALL Title Lines (100% of title included, strictly 滝井新地 + Title only) -->
    ${headlineElements}
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
  console.log(`🎨 Starting generation of cinematic photo OGP cards for ${articles.length} articles (100% of title included)...`);

  const publicImagesDir = path.join(rootDir, 'public', 'images');
  const srcImagesDir = path.join(rootDir, 'src', 'assets', 'images');
  const distImagesDir = path.join(rootDir, 'dist', 'images');

  fs.mkdirSync(publicImagesDir, { recursive: true });
  fs.mkdirSync(srcImagesDir, { recursive: true });
  if (fs.existsSync(path.join(rootDir, 'dist'))) {
    fs.mkdirSync(distImagesDir, { recursive: true });
  }

  // Generate card for /blog index page
  const blogIndexCardFile = await generateOgCardForArticle(
    {
      id: 'blog-index',
      slug: 'blog_index',
      title: '【お仕事コラム】滝井新地で安心デビュー完全ガイド一覧',
      category: 'beginner',
      summary: '',
      eyeCatch: '',
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
    const srcFile = path.join(publicImagesDir, fileName);
    fs.copyFileSync(srcFile, path.join(srcImagesDir, fileName));
    if (fs.existsSync(distImagesDir)) {
      fs.copyFileSync(srcFile, path.join(distImagesDir, fileName));
    }
    count++;
    if (count % 20 === 0 || count === articles.length) {
      console.log(`✅ Generated ${count} / ${articles.length} cinematic photo cards`);
    }
  }

  console.log(`🎉 Finished generating all ${count} cards with full titles!`);
}

main().catch(console.error);
