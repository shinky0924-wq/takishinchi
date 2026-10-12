import { BLOG_ARTICLES as ORIGINAL_BLOG_ARTICLES } from './blogData.original';

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  category: 'beginner' | 'salary' | 'security' | 'lifestyle' | 'onboarding';
  categoryLabel: string;
  publishedAt: string;
  readTime: string;
  summary: string;
  eyeCatch: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content: {
    type: 'p' | 'h2' | 'h3' | 'list' | 'cta' | 'qna';
    text?: string;
    items?: string[];
    question?: string;
    answer?: string;
  }[];
  tags: string[];
}

export const BLOG_CATEGORIES = [
  { id: 'all', label: 'すべて' },
  { id: 'beginner', label: '未経験者向け' },
  { id: 'salary', label: '給与・待遇' },
  { id: 'security', label: '安心・身バレ対策' },
  { id: 'lifestyle', label: '生活・働き方' },
  { id: 'onboarding', label: '面接・お仕事の流れ' }
];

export const BLOG_ARTICLES: BlogArticle[] = ORIGINAL_BLOG_ARTICLES as BlogArticle[];

export function getValidArticleEyeCatch(art: { id?: string | number; slug?: string; category?: string; eyeCatch?: string }): string {
  // If slug matches, prioritize the curated default image
  if (art && art.slug) {
    const slugMatch = BLOG_ARTICLES.find(d => d.slug === art.slug);
    if (slugMatch && slugMatch.eyeCatch) {
      return slugMatch.eyeCatch;
    }
  }

  // If art matches a default article ID, prioritize the curated default image
  if (art && art.id !== undefined) {
    const defaultMatch = BLOG_ARTICLES.find(d => String(d.id) === String(art.id));
    if (defaultMatch && defaultMatch.eyeCatch) {
      return defaultMatch.eyeCatch;
    }
  }

  if (art && art.eyeCatch) {
    const ec = art.eyeCatch.trim();
    if (ec.startsWith('http://') || ec.startsWith('https://') || ec.startsWith('data:') || ec.startsWith('/images/')) {
      return ec;
    }
    const filename = ec.split('/').pop()?.split('?')[0];
    if (filename) {
      return `/images/${filename}`;
    }
  }

  // Find fallback from category
  const categoryMatch = BLOG_ARTICLES.find(d => d.category === art?.category);
  if (categoryMatch && categoryMatch.eyeCatch) {
    return categoryMatch.eyeCatch;
  }

  return '/images/japanese_hero_banner.jpg';
}

const BLOG_DATA_VERSION = '20261012_takishinchi_articles_v10_clean';

export function sanitizeTakiiArticles(articles: BlogArticle[]): BlogArticle[] {
  if (!Array.isArray(articles)) return BLOG_ARTICLES;
  const defaultById = new Map<string, BlogArticle>(
    BLOG_ARTICLES.map(a => [String(a.id), a])
  );

  return articles.map(art => {
    const cleanDefault = defaultById.get(String(art.id));
    if (cleanDefault) {
      const s = JSON.stringify(art);
      if (
        art.title !== cleanDefault.title ||
        s.includes('飛田') ||
        s.includes('tobitashinchi-') ||
        s.includes('天王寺') ||
        s.includes('青春通り') ||
        s.includes('160軒') ||
        s.includes('15分5,000円') ||
        s.includes('10:00〜24:00') ||
        s.includes('12:00〜18:00') ||
        s.includes('13:30') ||
        s.includes('玄関で、おばちゃんと') ||
        s.includes('玄関におばちゃんと') ||
        s.includes('通りから姿が見えない') ||
        s.includes('18歳') ||
        s.includes('高校生不可') ||
        s.includes('10代') ||
        s.includes('全店一斉閉店')
      ) {
        return cleanDefault;
      }
    }
    const jsonStr = JSON.stringify(art)
      .replace(/tobitashinchi-/g, 'takishinchi-')
      .replace(/15分5,000円/g, '30分8,000円')
      .replace(/10:00〜24:00/g, '15:00〜24:00')
      .replace(/全店一斉閉店/g, '閉店')
      .replace(/満18歳以上（高校生不可）/g, '満20歳以上')
      .replace(/18歳（高校生不可）/g, '20歳以上')
      .replace(/18歳未満および高校生/g, '20歳未満の方')
      .replace(/飛田新地料理組合/g, '当店')
      .replace(/滝井新地料理組合/g, '当店')
      .replace(/飛田新地/g, '滝井新地')
      .replace(/飛田ガールズ/g, '滝井ガールズ')
      .replace(/Tobita Girls/g, 'Takii Girls');
    return JSON.parse(jsonStr);
  });
}

export function getStoredArticles(): BlogArticle[] {
  if (typeof window === 'undefined') return BLOG_ARTICLES;
  try {
    if (localStorage.getItem('custom_blog_articles_version') !== BLOG_DATA_VERSION) {
      localStorage.setItem('custom_blog_articles_version', BLOG_DATA_VERSION);
      localStorage.setItem('custom_blog_articles', JSON.stringify(BLOG_ARTICLES));
      return BLOG_ARTICLES;
    }
    const stored = localStorage.getItem('custom_blog_articles');
    if (!stored) {
      return BLOG_ARTICLES;
    }
    const rawArticles = sanitizeTakiiArticles(JSON.parse(stored) as BlogArticle[]);
    if (rawArticles.length === 0) return BLOG_ARTICLES;

    // もし古い画像への参照、または絵文字、正しくない画像パス、古いスラッグがあれば、最新のオリジナル画像や正しいスラッグに自動的に置換する
    const customArticles = rawArticles.map(art => {
      const defaultMatch = BLOG_ARTICLES.find(d => String(d.id) === String(art.id));
      if (defaultMatch) {
        return {
          ...art,
          eyeCatch: defaultMatch.eyeCatch,
          slug: defaultMatch.slug
        };
      }
      return {
        ...art,
        eyeCatch: getValidArticleEyeCatch(art)
      };
    });

    // もしデフォルトの新規記事がローカルストレージに存在しない場合、自動的にマージする
    const customIds = new Set(customArticles.map(a => String(a.id)));
    let hasNewDefault = false;
    const mergedArticles = [...customArticles];
    for (const defaultArt of BLOG_ARTICLES) {
      if (!customIds.has(String(defaultArt.id))) {
        mergedArticles.push(defaultArt);
        hasNewDefault = true;
      }
    }
    if (hasNewDefault || JSON.stringify(rawArticles) !== JSON.stringify(customArticles)) {
      // IDの数値順に並べ替えてソート
      mergedArticles.sort((a, b) => {
        const idA = parseInt(a.id, 10) || 0;
        const idB = parseInt(b.id, 10) || 0;
        return idA - idB;
      });
      localStorage.setItem('custom_blog_articles', JSON.stringify(mergedArticles));
      return mergedArticles;
    }

    return customArticles;
  } catch (e) {
    console.error('Error parsing custom blog articles:', e);
    return BLOG_ARTICLES;
  }
}

export function saveArticles(articles: BlogArticle[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('custom_blog_articles', JSON.stringify(articles));
  } catch (e) {
    console.error('Error saving blog articles to localStorage:', e);
  }
}
