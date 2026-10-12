import siteContentJson from '../data/siteContent.json';

export interface SiteContent {
  hero: {
    tagline: string;
    titleLine1: string;
    titleLine2: string;
    descriptionLine1: string;
    descriptionLine2: string;
    descriptionLine3: string;
    ctaButtonText: string;
    badgeText: string;
  };
  concerns: {
    title: string;
    subtitle: string;
    items: {
      id: string;
      iconName: string;
      title: string;
      question: string;
      answer: string;
    }[];
  };
  reasons: {
    title: string;
    subtitle: string;
    items: {
      number: string;
      iconName: string;
      title: string;
      description: string;
    }[];
  };
  jobs: {
    title: string;
    subtitle: string;
    infoSubtitle: string;
    simulatorTitle: string;
    simulatorDesc: string;
  };
  flow: {
    title: string;
    subtitle: string;
    items: {
      number: string;
      title: string;
    }[];
  };
  faq: {
    title: string;
    sidebarTitle: string;
    sidebarRole: string;
    sidebarMessage: string;
    items: {
      id: string;
      question: string;
      answer: string;
    }[];
  };
  consultation: {
    title: string;
    description: string;
    badgeText: string;
    copySubtitle: string;
    templateText: string;
    copyButtonText: string;
    lineBadgeText: string;
    lineButtonText: string;
    lineSubtitle: string;
    privacyNote: string;
  };
}

export const SITE_CONTENT_VERSION = '20261012_takishinchi_clean_v8';
export const DEFAULT_SITE_CONTENT: SiteContent = siteContentJson as any;

export function sanitizeTakiiSiteContent(raw: any): any {
  if (!raw) return DEFAULT_SITE_CONTENT;
  const rawStr = JSON.stringify(raw);
  // If stored content contains unnatural '当店' insertions or outdated phrases, reset to clean DEFAULT_SITE_CONTENT
  if (
    rawStr.includes('未経験でも当店で') ||
    rawStr.includes('滝井新地の当店で') ||
    rawStr.includes('知識ゼロでも当店で') ||
    rawStr.includes('当店の年齢制限') ||
    rawStr.includes('当店のLINEで') ||
    rawStr.includes('当店で面接') ||
    rawStr.includes('当店によくいただく') ||
    rawStr.includes('仲介') ||
    rawStr.includes('マージン') ||
    rawStr.includes('直営') ||
    rawStr.includes('当グループ') ||
    rawStr.includes('15分5,000円') ||
    rawStr.includes('10:00〜24:00') ||
    rawStr.includes('通りから姿が見えない') ||
    rawStr.includes('18歳') ||
    rawStr.includes('高校生不可') ||
    rawStr.includes('飛田ガールズ')
  ) {
    return DEFAULT_SITE_CONTENT;
  }
  return JSON.parse(rawStr);
}

export function getStoredSiteContent(): SiteContent {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;
  try {
    const currentVer = localStorage.getItem('custom_site_content_version');
    if (currentVer !== SITE_CONTENT_VERSION) {
      localStorage.removeItem('custom_site_content');
      localStorage.setItem('custom_site_content_version', SITE_CONTENT_VERSION);
      return DEFAULT_SITE_CONTENT;
    }

    const stored = localStorage.getItem('custom_site_content');
    if (!stored) {
      return DEFAULT_SITE_CONTENT;
    }
    const customContent = sanitizeTakiiSiteContent(JSON.parse(stored));

    const merged = { ...DEFAULT_SITE_CONTENT };
    
    if (customContent.hero) merged.hero = { ...merged.hero, ...customContent.hero };
    if (customContent.concerns) merged.concerns = { ...merged.concerns, ...customContent.concerns };
    if (customContent.reasons) merged.reasons = { ...merged.reasons, ...customContent.reasons };
    if (customContent.jobs) merged.jobs = { ...merged.jobs, ...customContent.jobs };
    if (customContent.flow) merged.flow = { ...merged.flow, ...customContent.flow };
    if (customContent.faq) merged.faq = { ...merged.faq, ...customContent.faq };
    if (customContent.consultation) merged.consultation = { ...merged.consultation, ...customContent.consultation };
    
    return merged as SiteContent;
  } catch (e) {
    console.error('Error parsing custom site content:', e);
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveSiteContent(content: SiteContent) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('custom_site_content', JSON.stringify(content));
    localStorage.setItem('custom_site_content_version', SITE_CONTENT_VERSION);
  } catch (e) {
    console.error('Error saving site content to localStorage:', e);
  }
}
