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
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Curated list of clean Japanese indoor & workplace photos directly related to Takii Shinchi
const CLEAN_TAKII_PHOTOS = [
  'col_ryotei_flow_1789107427433.jpg',       // 清潔な和風料亭の個室・お茶席
  'jp_kimono_style_1789467837838.jpg',       // 上品で清潔感のある着物・浴衣姿の女性
  'col_salary_savings_1789107442335.jpg',    // 手渡し給与・お給料袋と貯金
  'col_vanity_trial_1789107497172.jpg',      // ドレッサー・お仕事メイクとヘアセット
  'col_cafe_interview_1789107484817.jpg',    // カフェでのリラックス面談・相談
  'col_studio_room_1789107471455.jpg',       // 清潔で快適なワンルーム寮
  'jp_cast_tatami_1789467727461.jpg',        // 落ち着いた和室での接客イメージ
  'jp_woman_salary_1789467749655.jpg',       // お給料の手渡し受取
  'col_privacy_protect_1789107457068.jpg',   // プライバシー保護・静かな個室空間
  'staff_lounge_support_1789108549559.jpg',  // 温かいスタッフサポートラウンジ
  'jp_confident_smile_1789467788318.jpg',    // 笑顔で安心の女性スタッフ・キャスト
  'jp_two_friends_1789467775509.jpg',        // 仲の良い同僚・ペア応募
  'jp_skincare_glow_1789467940047.jpg',      // 美肌・スキンケアとお手入れ
  'jp_savings_jar_1789468021098.jpg',        // 堅実な貯金と将来の目標
  'jp_cozy_bedroom_1789468035819.jpg',       // 快適な寮生活・リラックスできる部屋
  'jp_ryotei_manner_1789467980075.jpg',      // 料亭の丁寧なおもてなし・お茶
  'ryotei_entrance_lantern_1789108525834.jpg', // 料亭の清潔な玄関の佇まい
  'japanese_cast_woman.jpg',                 // 和装の女性キャスト
  'takii_atmosphere_hero.jpg',               // 滝井新地の落ち着いた情緒
  'japanese_hero_banner.jpg',                // 上品な和風料亭の内観
  'jp_herbal_tea_1789468007366.jpg',         // お仕事後のリフレッシュハーブティー
  'jp_warm_footbath_1789467870650.jpg',      // 足湯・セルフケア
  'jp_bank_finance_1789467925368.jpg',       // 口座管理・安心の資金計画
  'jp_fluffy_pancake_1789467858767.jpg',     // ご褒美カフェスイーツ
  'jp_mother_child_1789467823272.jpg',       // シングルマザー支援・託児サポート
  'jp_hand_mirror_1789467802719.jpg',        // 手鏡と笑顔チェック
];

function selectBackgroundForArticle(article: BlogArticle): string {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  const text = `${article.slug} ${article.title} ${article.category} ${(article.tags || []).join(' ')}`.toLowerCase();

  // 1. 給料・日払い・稼ぎ・手渡し・貯金
  if (text.includes('salary') || text.includes('給料') || text.includes('給与') || text.includes('日払い') || text.includes('手渡し') || text.includes('貯金') || text.includes('稼')) {
    const list = ['col_salary_savings_1789107442335.jpg', 'jp_woman_salary_1789467749655.jpg', 'jp_savings_jar_1789468021098.jpg', 'jp_bank_finance_1789467925368.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }

  // 2. 身バレ防止・顔バレ対策・安心・安全・客層・プライバシー
  if (text.includes('safety') || text.includes('安心') || text.includes('安全') || text.includes('身バレ') || text.includes('顔バレ') || text.includes('privacy') || text.includes('客層')) {
    const list = ['col_privacy_protect_1789107457068.jpg', 'col_ryotei_flow_1789107427433.jpg', 'staff_lounge_support_1789108549559.jpg', 'ryotei_entrance_lantern_1789108525834.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }

  // 3. 面接・体験入店・見学・初めての応募
  if (text.includes('trial') || text.includes('体験') || text.includes('体入') || text.includes('面接') || text.includes('interview') || text.includes('応募')) {
    const list = ['col_cafe_interview_1789107484817.jpg', 'col_vanity_trial_1789107497172.jpg', 'jp_confident_smile_1789467788318.jpg', 'staff_lounge_support_1789108549559.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }

  // 4. 着物・浴衣・和装・メイク・美容
  if (text.includes('kimono') || text.includes('着物') || text.includes('浴衣') || text.includes('和装') || text.includes('メイク') || text.includes('美容') || text.includes('beauty')) {
    const list = ['jp_kimono_style_1789467837838.jpg', 'col_vanity_trial_1789107497172.jpg', 'jp_skincare_glow_1789467940047.jpg', 'jp_cast_tatami_1789467727461.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }

  // 5. マンション寮・一人暮らし・出稼ぎ・住まい
  if (text.includes('dorm') || text.includes('寮') || text.includes('一人暮らし') || text.includes('出稼ぎ') || text.includes('room') || text.includes('住')) {
    const list = ['col_studio_room_1789107471455.jpg', 'jp_cozy_bedroom_1789468035819.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }

  // 6. 友達・ペア・同僚
  if (text.includes('friend') || text.includes('友達') || text.includes('ペア')) {
    const list = ['jp_two_friends_1789467775509.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }

  // 7. シングルマザー・子育て
  if (text.includes('mother') || text.includes('シンママ') || text.includes('子育て')) {
    const list = ['jp_mother_child_1789467823272.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }

  // 8. 仕事内容・未経験・初心者・料亭のシステム
  if (text.includes('beginner') || text.includes('未経験') || text.includes('仕事内容') || text.includes('完全受け身')) {
    const list = ['col_ryotei_flow_1789107427433.jpg', 'jp_kimono_style_1789467837838.jpg', 'jp_cast_tatami_1789467727461.jpg'];
    for (const f of list) if (fs.existsSync(path.join(imagesDir, f))) return f;
  }

  // 9. フォールバック: 記事IDに基づいて清潔な和風写真を決定
  const numId = parseInt(article.id, 10) || 0;
  const picked = CLEAN_TAKII_PHOTOS[numId % CLEAN_TAKII_PHOTOS.length];
  if (fs.existsSync(path.join(imagesDir, picked))) {
    return picked;
  }

  return 'col_ryotei_flow_1789107427433.jpg';
}

// 短くメリハリのあるコピーを抽出（主役のピンク見出し ＋ 小さめの白文字補足）
function getCatchyCopyForArticle(title: string): { mainCopy: string; subCopy: string } {
  let rest = title.trim();
  let badge = '';
  const match = rest.match(/^[【\[](.*?)[】\]]\s*/);
  if (match) {
    badge = match[1].trim();
    rest = rest.replace(/^[【\[].*?[】\]]\s*/, '').trim();
  }

  // Strip emojis, brackets, numbers artifacts
  badge = badge.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}【】\[\]]/gu, '').trim();
  rest = rest.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}【】\[\]]/gu, '').trim();

  // 1. ピンクのメイン見出し（主役: 6〜14文字程度の強力なフレーズ）
  let mainCopy = badge;
  if (!mainCopy || mainCopy.length > 14) {
    const parts = rest.split(/[！!？?、・\s]/).filter(Boolean);
    mainCopy = parts[0] || badge || rest.slice(0, 13);
  }
  if (mainCopy.length > 14) {
    mainCopy = mainCopy.slice(0, 13);
  }

  // 2. 補足コピー（小さめ: 10〜20文字程度の分かりやすい説明）
  let subCopy = '';
  const sentences = rest.split(/[！!？?]/).map(s => s.trim()).filter(Boolean);
  if (sentences.length > 0 && sentences[0] !== mainCopy && sentences[0].length <= 20 && sentences[0].length >= 6) {
    subCopy = sentences[0];
  } else if (sentences.length > 1 && sentences[1].length <= 20 && sentences[1].length >= 6) {
    subCopy = sentences[1];
  } else {
    const cleaned = rest.replace(mainCopy, '').replace(/^[、・！!？?\s]+/, '').trim();
    if (cleaned.length >= 6 && cleaned.length <= 20) {
      subCopy = cleaned;
    } else if (cleaned.length > 20) {
      const chunks = cleaned.split(/[、・\s]/);
      let acc = '';
      for (const c of chunks) {
        if ((acc + c).length <= 18) {
          acc += (acc ? '・' : '') + c;
        } else break;
      }
      subCopy = acc || cleaned.slice(0, 18);
    } else {
      subCopy = rest.slice(0, 18);
    }
  }

  subCopy = subCopy.replace(/[！!？?、・]$/, '').trim();

  return { mainCopy, subCopy };
}

export async function generateOgCardForArticle(article: BlogArticle, outputDir: string): Promise<string> {
  const width = 1200;
  const height = 630;

  // 1. 記事の内容に直結した清潔感のある和風・仕事現場の写真を選定
  const bgFileName = selectBackgroundForArticle(article);
  const baseImagePath = path.join(process.cwd(), 'public', 'images', bgFileName);

  let baseImgBuffer: Buffer;
  try {
    baseImgBuffer = await sharp(baseImagePath)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .modulate({ brightness: 1.05, saturation: 1.08 })
      .toBuffer();
  } catch (e) {
    const fallbackPath = path.join(process.cwd(), 'public', 'images', 'col_ryotei_flow_1789107427433.jpg');
    baseImgBuffer = await sharp(fallbackPath)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .modulate({ brightness: 1.05, saturation: 1.08 })
      .toBuffer();
  }

  // 2. 短縮されたメイン見出し（ピンク主役）と小さめの補足（白文字）
  const { mainCopy, subCopy } = getCatchyCopyForArticle(article.title);
  const escapedMain = escapeXml(mainCopy);
  const escapedSub = escapeXml(subCopy);

  // 3. ピンク見出しを主役として際立たせるサイズ設計
  const mainFontSize = mainCopy.length > 10 ? 46 : 52;
  const pillWidth = Math.min(800, mainCopy.length * (mainFontSize * 1.02) + 40);

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- 左側の暗めグラデーション: 文字の視認性を100%確保しつつ、右側の和風写真を美しく見せる -->
      <linearGradient id="leftVignette" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#080307" stop-opacity="0.95" />
        <stop offset="38%" stop-color="#0e050c" stop-opacity="0.88" />
        <stop offset="56%" stop-color="#120710" stop-opacity="0.65" />
        <stop offset="78%" stop-color="#120710" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#120710" stop-opacity="0.0" />
      </linearGradient>
      <!-- 統一されたブランドロゴのグラデーション -->
      <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ff3366" />
        <stop offset="100%" stop-color="#ff6b8b" />
      </linearGradient>
      <!-- 主役となるピンク見出しのピルグラデーション -->
      <linearGradient id="heroPinkPill" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ff476f" />
        <stop offset="100%" stop-color="#ff7363" />
      </linearGradient>
      <filter id="textShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.92" />
      </filter>
    </defs>

    <!-- 写真オーバーレイ -->
    <rect width="${width}" height="${height}" fill="url(#leftVignette)" />

    <!-- 4. 統一されたロゴ位置 (左上 X=64, Y=48) - 絵文字・数字なしの純粋な「滝井新地」 -->
    <g transform="translate(64, 48)">
      <rect x="0" y="0" width="220" height="54" rx="27" fill="url(#brandGrad)" stroke="#ffffff" stroke-width="2.5" />
      <text x="110" y="38" fill="#ffffff" font-size="32" font-family="'Zen Maru Gothic Black', 'Zen Maru Gothic', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="4">
        滝井新地
      </text>
    </g>

    <!-- 3. ピンクのメイン見出し（主役: 大きく目を引くボックス） -->
    <g transform="translate(64, 160)">
      <rect x="-8" y="0" width="${pillWidth}" height="${mainFontSize + 24}" rx="12" fill="url(#heroPinkPill)" stroke="#ffffff" stroke-width="2" stroke-opacity="0.4" />
      <text x="12" y="${mainFontSize + 6}" fill="#ffffff" font-size="${mainFontSize}" font-family="'Zen Maru Gothic Black', 'Zen Maru Gothic', sans-serif" font-weight="900" letter-spacing="2">
        ${escapedMain}
      </text>
    </g>

    <!-- 2 & 3. 補足コピー（小さめの白文字でメリハリをつける） -->
    <g transform="translate(64, ${160 + mainFontSize + 58})" filter="url(#textShadow)">
      <text x="4" y="28" fill="#ffffff" stroke="#000000" stroke-width="2.5" stroke-opacity="0.4" paint-order="stroke fill" font-size="28" font-family="'Zen Maru Gothic Bold', 'Zen Maru Gothic', sans-serif" font-weight="bold" letter-spacing="1.5">
        ${escapedSub}
      </text>
    </g>
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
  console.log(`🎨 Starting generation of refined editorial thumbnails for ${articles.length} articles...`);

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
      console.log(`✅ Generated ${count} / ${articles.length} refined cards`);
    }
  }

  console.log(`🎉 Finished generating all ${count} refined cards with clean Takii photos, punchy pink headers & clear hierarchy!`);
}

main().catch(console.error);
