import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { BLOG_ARTICLES, BLOG_CATEGORIES } from '../src/blogData';

const BASE_PROD_URL = 'https://osaka-takiishinchi.pages.dev';
const BASE_PREVIEW_URL = 'https://ais-pre-yqd6msdlb5xpugf5lycd7h-661781278116.asia-northeast1.run.app';

interface ArticleExcelRow {
  'No': number;
  '記事ID': string | number;
  'カテゴリー': string;
  '記事タイトル': string;
  '記事概要 (要約)': string;
  '公開用本番URL': string;
  'プレビューURL': string;
  'スラッグ (URLパス)': string;
  'アイキャッチ画像URL': string;
  'タグ': string;
}

function exportExcel() {
  console.log('📊 Generating Excel file for Takii Shinchi Blog Articles...');

  const rows: ArticleExcelRow[] = BLOG_ARTICLES.map((art, index) => ({
    'No': index + 1,
    '記事ID': art.id,
    'カテゴリー': art.categoryLabel || art.category,
    '記事タイトル': art.title,
    '記事概要 (要約)': art.summary || '',
    '公開用本番URL': `${BASE_PROD_URL}/blog/${art.slug}`,
    'プレビューURL': `${BASE_PREVIEW_URL}/blog/${art.slug}`,
    'スラッグ (URLパス)': `/blog/${art.slug}`,
    'アイキャッチ画像URL': `${BASE_PROD_URL}/images/card_${art.slug}.jpg`,
    'タグ': Array.isArray(art.tags) ? art.tags.join(', ') : ''
  }));

  const wb = XLSX.utils.book_new();

  // Sheet 1: Articles List
  const wsArticles = XLSX.utils.json_to_sheet(rows);

  // Set column widths for readability in Excel
  wsArticles['!cols'] = [
    { wch: 6 },   // No
    { wch: 8 },   // 記事ID
    { wch: 18 },  // カテゴリー
    { wch: 60 },  // 記事タイトル
    { wch: 50 },  // 記事概要
    { wch: 55 },  // 本番URL
    { wch: 85 },  // プレビューURL
    { wch: 35 },  // スラッグ
    { wch: 65 },  // アイキャッチ画像URL
    { wch: 30 },  // タグ
  ];

  XLSX.utils.book_append_sheet(wb, wsArticles, '滝井新地_記事一覧(100件)');

  // Sheet 2: Category Summary
  const categoryCounts = BLOG_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
    const count = BLOG_ARTICLES.filter(a => a.category === cat.id).length;
    return {
      'カテゴリーID': cat.id,
      'カテゴリー名': cat.label,
      '記事数': count,
      'カテゴリーURL': `${BASE_PROD_URL}/blog?cat=${cat.id}`
    };
  });

  const wsCategories = XLSX.utils.json_to_sheet(categoryCounts);
  wsCategories['!cols'] = [
    { wch: 16 },
    { wch: 20 },
    { wch: 10 },
    { wch: 50 }
  ];
  XLSX.utils.book_append_sheet(wb, wsCategories, 'カテゴリー集計');

  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  const distDir = path.join(rootDir, 'dist');

  // Excel filename
  const excelFileName = 'takishinchi_articles_url_list.xlsx';
  const csvFileName = 'takishinchi_articles_url_list.csv';

  // 1. Write to public/
  const publicExcelPath = path.join(publicDir, excelFileName);
  XLSX.writeFile(wb, publicExcelPath);
  console.log(`✅ Saved Excel file to ${publicExcelPath}`);

  // Also write CSV to public/
  const csvContent = XLSX.utils.sheet_to_csv(wsArticles);
  const publicCsvPath = path.join(publicDir, csvFileName);
  fs.writeFileSync(publicCsvPath, '\uFEFF' + csvContent, 'utf-8'); // with UTF-8 BOM for Japanese Excel
  console.log(`✅ Saved CSV file (UTF-8 with BOM) to ${publicCsvPath}`);

  // 2. Also write to dist/ if it exists
  if (fs.existsSync(distDir)) {
    const distExcelPath = path.join(distDir, excelFileName);
    fs.copyFileSync(publicExcelPath, distExcelPath);

    const distCsvPath = path.join(distDir, csvFileName);
    fs.copyFileSync(publicCsvPath, distCsvPath);
    console.log(`✅ Copied Excel and CSV to dist/`);
  }

  // 3. Write to root directory for easy download/access
  const rootExcelPath = path.join(rootDir, excelFileName);
  fs.copyFileSync(publicExcelPath, rootExcelPath);
  console.log(`✅ Saved copy to ${rootExcelPath}`);

  console.log(`🎉 Excel export finished successfully! Total ${rows.length} articles.`);
}

exportExcel();
