import * as fs from 'fs';
import * as path from 'path';
import { BLOG_ARTICLES } from './src/blogData';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryLabel?: string;
  publishedAt?: string;
  readTime?: string;
  summary: string;
  eyeCatch: string;
  tags?: string[];
  content?: {
    type: 'p' | 'h2' | 'h3' | 'list' | 'cta' | 'qna';
    text?: string;
    items?: string[];
    question?: string;
    answer?: string;
  }[];
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function replaceRootInnerHtml(html: string, innerHtml: string): string {
  const rootRegex = /<div id="root">[\s\S]*?<\/div>\s*(?=<script)/i;
  if (rootRegex.test(html)) {
    return html.replace(rootRegex, `<div id="root">\n${innerHtml}\n    </div>\n    `);
  }
  return html.replace('<div id="root"></div>', `<div id="root">${innerHtml}</div>`);
}

function renderArticleStaticHtml(article: BlogArticle, baseDomain: string): string {
  const blocksHtml = (article.content || [])
    .map(block => {
      if (block.type === 'h2') {
        return `<h2>${escapeHtml(block.text || '')}</h2>`;
      }
      if (block.type === 'h3') {
        return `<h3>${escapeHtml(block.text || '')}</h3>`;
      }
      if (block.type === 'list' && Array.isArray(block.items)) {
        const li = block.items.map(item => `<li>${escapeHtml(item)}</li>`).join('\n');
        return `<ul>\n${li}\n</ul>`;
      }
      if (block.type === 'qna') {
        return `<section><h3>Q. ${escapeHtml(block.question || '')}</h3><p>A. ${escapeHtml(block.answer || block.text || '')}</p></section>`;
      }
      if (block.type === 'p' && block.text) {
        return `<p>${escapeHtml(block.text)}</p>`;
      }
      return '';
    })
    .filter(Boolean)
    .join('\n          ');

  return `      <article style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">
        <p><a href="${escapeHtml(baseDomain)}/">滝井ガールズ（滝井新地求人）トップ</a> &gt; <a href="${escapeHtml(baseDomain)}/blog">お仕事コラム一覧</a></p>
        <p><strong>${escapeHtml(article.categoryLabel || 'お仕事コラム')}</strong>｜公開日: ${escapeHtml(article.publishedAt || '2026-10-10')}</p>
        <h1>${escapeHtml(article.title)}</h1>
        <p><strong>${escapeHtml(article.summary)}</strong></p>
        <div>
          ${blocksHtml}
        </div>
        <hr />
        <section>
          <h2>滝井新地で最短本日スタート！1日体験入店・LINE無料相談受付中</h2>
          <p>1日体験入店は「面接＋見学＋1日お仕事＋30分8,000円×本数を雑費ゼロで即日全額手渡し」がすべて1日で完了する安心コースです。まずはLINEでお気軽にご相談ください。</p>
          <p><a href="https://lin.ee/n1e96Gf">公式LINEで今すぐ相談する（https://lin.ee/n1e96Gf）</a></p>
        </section>
      </article>`;
}

function renderBlogListStaticHtml(articles: BlogArticle[], baseDomain: string): string {
  const itemsHtml = articles
    .map(
      a => `          <li>
            <h3><a href="${escapeHtml(baseDomain)}/blog/${escapeHtml(a.slug)}">${escapeHtml(a.title)}</a></h3>
            <p>${escapeHtml(a.summary)}</p>
          </li>`
    )
    .join('\n');

  return `      <main style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">
        <h1>滝井新地で安心デビューするためのお仕事コラム＆完全ガイド｜滝井ガールズ</h1>
        <p>滝井新地で働くうえで知っておきたい給料システム、身バレ対策、仕事内容やお店の雰囲気を徹底解説。お店の玄関から顔が見えない安心環境、30分8,000円＆雑費天引き完全ゼロの全額日払い、優しい仲居さん（おばちゃん）と女性スタッフの親身なサポートなど、未経験から安心して働ける理由をすべて公開します。</p>
        <ul>
${itemsHtml}
        </ul>
      </main>`;
}

export function injectMetaIntoHtml(baseHtml: string, meta: {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  type?: 'website' | 'article';
  bodyHtml?: string;
}): string {
  let html = baseHtml;
  const escapedTitle = escapeHtml(meta.title);
  const escapedDesc = escapeHtml(meta.description);
  const escapedImage = escapeHtml(meta.imageUrl);
  const escapedUrl = escapeHtml(meta.url);
  const type = meta.type || 'article';

  // 1. Replace <title>
  if (/<title>.*?<\/title>/i.test(html)) {
    html = html.replace(/<title>.*?<\/title>/i, `<title>${escapedTitle}</title>`);
  }

  // 2. Replace meta name="description"
  if (/<meta\s+name="description"\s+content=".*?"\s*\/?>/i.test(html)) {
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${escapedDesc}" />`);
  }

  // 3. Replace canonical link
  if (/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i.test(html)) {
    html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${escapedUrl}" />`);
  }

  // Helper to upsert a meta tag
  const upsertMeta = (propOrName: 'property' | 'name', attrValue: string, content: string) => {
    const regex = new RegExp(`<meta\\s+${propOrName}="${attrValue}"\\s+content=".*?"\\s*\\/?>`, 'i');
    const newTag = `<meta ${propOrName}="${attrValue}" content="${content}" />`;
    if (regex.test(html)) {
      html = html.replace(regex, newTag);
    } else {
      html = html.replace('</head>', `  ${newTag}\n</head>`);
    }
  };

  // Open Graph Tags
  upsertMeta('property', 'og:title', escapedTitle);
  upsertMeta('property', 'og:description', escapedDesc);
  upsertMeta('property', 'og:url', escapedUrl);
  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:site_name', '滝井ガールズ');
  upsertMeta('property', 'og:image', escapedImage);
  upsertMeta('property', 'og:image:secure_url', escapedImage);
  upsertMeta('property', 'og:image:type', 'image/jpeg');
  upsertMeta('property', 'og:image:width', '1200');
  upsertMeta('property', 'og:image:height', '630');

  // Twitter Card Tags
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', escapedTitle);
  upsertMeta('name', 'twitter:description', escapedDesc);
  upsertMeta('name', 'twitter:image', escapedImage);
  upsertMeta('name', 'twitter:image:alt', escapedTitle);
  upsertMeta('name', 'twitter:site', '@takiigirls');

  if (meta.bodyHtml) {
    html = replaceRootInnerHtml(html, meta.bodyHtml);
  }

  return html;
}

export function toAbsoluteImageUrl(imagePath: string, domain = 'https://osaka-takiishinchi.pages.dev'): string {
  if (!imagePath) {
    return `${domain}/images/japanese_hero_banner.jpg`;
  }
  let clean = imagePath.trim();
  if (clean.includes('tobitashinchi-recruit.com') || clean.includes('takishinchi-recruit.com') || clean.includes('takishinchi.pages.dev')) {
    clean = clean.replace(/https?:\/\/(tobitashinchi-recruit\.com|takishinchi-recruit\.com|takishinchi\.pages\.dev)/g, domain);
  }
  let fullUrl = '';
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    fullUrl = clean;
  } else {
    const normalizedPath = clean.startsWith('/') ? clean : `/${clean}`;
    fullUrl = `${domain}${normalizedPath}`;
  }

  if (fullUrl.includes('/images/') && !fullUrl.includes('/images/og_')) {
    fullUrl = fullUrl.replace('/images/', '/images/og_');
  }

  return fullUrl;
}

function generateSitemapXml(articles: BlogArticle[], baseDomain: string): string {
  const today = '2026-10-10';
  const urls = [
    `  <url>\n    <loc>${baseDomain}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
    `  <url>\n    <loc>${baseDomain}/blog</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`,
    ...articles
      .filter(a => a.slug)
      .map(
        a =>
          `  <url>\n    <loc>${baseDomain}/blog/${escapeHtml(a.slug)}</loc>\n    <lastmod>${escapeHtml(a.publishedAt || today)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
      )
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

async function main() {
  const rootDir = process.cwd();
  const distDir = path.join(rootDir, 'dist');
  const publicDir = path.join(rootDir, 'public');
  const articlesFile = path.join(rootDir, 'data', 'blogArticles.json');
  const legacyArticlesFile = path.join(rootDir, 'data', 'articles.json');
  const baseDomain = process.env.DEPLOY_DOMAIN || 'https://osaka-takiishinchi.pages.dev';

  const articles: BlogArticle[] = BLOG_ARTICLES as BlogArticle[];
  try {
    fs.writeFileSync(articlesFile, JSON.stringify(articles, null, 2), 'utf-8');
    fs.writeFileSync(legacyArticlesFile, JSON.stringify(articles, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error syncing blogArticles.json:', e);
  }

  // Always keep public/sitemap.xml updated
  if (fs.existsSync(publicDir) && articles.length > 0) {
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), generateSitemapXml(articles, baseDomain), 'utf-8');
  }

  if (!fs.existsSync(distDir)) {
    console.warn('⚠️ dist directory not found. Please run vite build first.');
    return;
  }

  if (articles.length > 0) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), generateSitemapXml(articles, baseDomain), 'utf-8');
  }

  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.warn('⚠️ dist/index.html not found.');
    return;
  }

  const baseHtml = fs.readFileSync(indexPath, 'utf-8');

  // Also inject the column links into dist/index.html so ChatGPT reading "/" sees all article titles & links!
  if (articles.length > 0) {
    const topArticleLinksHtml = articles
      .map(
        a =>
          `            <li><a href="${escapeHtml(baseDomain)}/blog/${escapeHtml(a.slug)}"><strong>${escapeHtml(a.title)}</strong></a> - ${escapeHtml(a.summary)}</li>`
      )
      .join('\n');
    const enhancedIndexHtml = baseHtml.replace(
      '<p><a href="https://osaka-takiishinchi.pages.dev/blog">すべてのコラム記事一覧を見る（/blog）</a></p>',
      `<p><a href="${escapeHtml(baseDomain)}/blog">すべてのコラム記事一覧を見る（/blog）</a></p>\n          <ul>\n${topArticleLinksHtml}\n          </ul>`
    );
    fs.writeFileSync(indexPath, enhancedIndexHtml, 'utf-8');
  }

  console.log(`🚀 Pre-rendering static HTML pages for ${articles.length} articles for ChatGPT / AI / X / OGP (Base Domain: ${baseDomain})...`);

  // 1. Generate /blog/index.html AND /blog.html
  const blogListDir = path.join(distDir, 'blog');
  if (!fs.existsSync(blogListDir)) {
    fs.mkdirSync(blogListDir, { recursive: true });
  }

  const blogListHtml = injectMetaIntoHtml(baseHtml, {
    title: '滝井新地 お仕事コラム一覧',
    description: '滝井新地で安心デビューするためのコラム・完全ガイド一覧。給料システム（30分8,000円・雑費ゼロ）、面接対策、身バレ防止、未経験からの働き方などを詳しく解説しています。',
    imageUrl: `${baseDomain}/images/card_blog_index.jpg?v=3`,
    url: `${baseDomain}/blog`,
    type: 'website',
    bodyHtml: renderBlogListStaticHtml(articles, baseDomain)
  });
  fs.writeFileSync(path.join(blogListDir, 'index.html'), blogListHtml, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'blog.html'), blogListHtml, 'utf-8');

  // 2. Generate each /blog/:slug/index.html AND /blog/:slug.html
  let count = 0;
  for (const article of articles) {
    if (!article.slug) continue;
    const articleDir = path.join(distDir, 'blog', article.slug);
    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }

    const cardRelativePath = `/images/card_${article.slug}.jpg?v=3`;
    const fullImageUrl = fs.existsSync(path.join(process.cwd(), 'public', 'images', `card_${article.slug}.jpg`))
      ? `${baseDomain}${cardRelativePath}`
      : toAbsoluteImageUrl(article.eyeCatch, baseDomain);

    const articleUrl = `${baseDomain}/blog/${article.slug}`;
    const articleTitle = `滝井新地 ${article.title}`;
    const articleDesc = article.summary || `${article.title}についての詳しい解説記事です。`;

    const articleHtml = injectMetaIntoHtml(baseHtml, {
      title: articleTitle,
      description: articleDesc,
      imageUrl: fullImageUrl,
      url: articleUrl,
      type: 'article',
      bodyHtml: renderArticleStaticHtml(article, baseDomain)
    });

    fs.writeFileSync(path.join(articleDir, 'index.html'), articleHtml, 'utf-8');
    fs.writeFileSync(path.join(distDir, 'blog', `${article.slug}.html`), articleHtml, 'utf-8');
    count++;
  }

  console.log(`✅ Successfully generated ${count} article static HTML pages with full body HTML & OGP meta tags in dist/blog/!`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error('Failed to generate article pages:', err);
    process.exit(1);
  });
}
