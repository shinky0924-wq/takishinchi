import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BLOG_CATEGORIES, BlogArticle, getValidArticleEyeCatch } from '../blogData';
import { ArticleCardImage } from './ArticleCardImage';
import { BookOpen, Calendar, Clock, Search, ArrowLeft, Tag, MessageCircle, ChevronRight, ChevronLeft, Sparkles, Send, ShieldCheck, HeartHandshake } from 'lucide-react';

interface BlogSectionProps {
  articles: BlogArticle[];
  selectedSlug: string | null;
  onSelectSlug: (slug: string | null) => void;
  onCtaclick: () => void;
  onInjectedScroll: (message: string) => void;
  onSimulatorClick: () => void;
}

export default function BlogSection({ articles, selectedSlug, onSelectSlug, onCtaclick, onInjectedScroll, onSimulatorClick }: BlogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ARTICLES_PER_PAGE = 9;

  const isLoading = useMemo(() => {
    return !!selectedSlug && articles.length === 0;
  }, [selectedSlug, articles]);

  // Filter & Search articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesSearch = 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE));
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ARTICLES_PER_PAGE;
    return filteredArticles.slice(start, start + ARTICLES_PER_PAGE);
  }, [filteredArticles, currentPage, ARTICLES_PER_PAGE]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const listEl = document.getElementById('blog-list');
    if (listEl) {
      listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentArticle = useMemo(() => {
    if (!selectedSlug) return null;
    return articles.find(a => a.slug === selectedSlug) || null;
  }, [articles, selectedSlug]);

  // Dynamically update document title and OGP/Twitter meta tags based on the active article
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (currentArticle) {
      const pageTitle = `滝井新地 ${currentArticle.title}`;
      document.title = pageTitle;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', currentArticle.summary);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', pageTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', currentArticle.summary);

      const origin = typeof window !== 'undefined' ? (window.location.hostname.includes('localhost') ? 'https://osaka-takiishinchi.pages.dev' : window.location.origin) : 'https://osaka-takiishinchi.pages.dev';
      const fullImageUrl = `${origin}/images/card_${currentArticle.slug}.jpg?v=20261013b`;

      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) ogImage.setAttribute('content', fullImageUrl);

      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', `${origin}/blog/${currentArticle.slug}`);

      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', pageTitle);

      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', currentArticle.summary);

      const twImage = document.querySelector('meta[name="twitter:image"]');
      if (twImage) twImage.setAttribute('content', fullImageUrl);

      const twCard = document.querySelector('meta[name="twitter:card"]');
      if (twCard) twCard.setAttribute('content', 'summary_large_image');
    } else {
      const defaultTitle = '滝井新地求人、滝井新地バイトなら【滝井ガールズ】女の子のためのサイト・高収入募集';
      const defaultDesc = '滝井新地で女の子の求人・お仕事なら「滝井ガールズ」。滝井トップクラスのお店だから未経験でも安心してお仕事をスタートできます。お店の玄関から顔が見えない環境・30分8,000円・雑費天引きゼロ・全額日払い手渡し。24時間いつでもお気軽にご相談ください。';
      document.title = defaultTitle;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', defaultDesc);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', defaultTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', defaultDesc);

      const origin = typeof window !== 'undefined' ? (window.location.hostname.includes('localhost') ? 'https://osaka-takiishinchi.pages.dev' : window.location.origin) : 'https://osaka-takiishinchi.pages.dev';
      const defaultImage = `${origin}/images/japanese_hero_banner.jpg`;

      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) ogImage.setAttribute('content', defaultImage);

      const twImage = document.querySelector('meta[name="twitter:image"]');
      if (twImage) twImage.setAttribute('content', defaultImage);
    }
  }, [currentArticle]);

  // Back to article list
  const handleBackToList = () => {
    onSelectSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (slug: string) => {
    onSelectSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCtaInArticle = (articleTitle: string) => {
    onInjectedScroll(`コラム「${articleTitle}」を読みました。求人について詳しく話を聞きたいです！`);
  };

  // Split leading 【...】 bracket from title for cute, readable display
  const parseDisplayTitle = (rawTitle: string): { subBadge: string | null; mainTitle: string } => {
    const match = rawTitle.trim().match(/^[【\[](.*?)[】\]]\s*(.*)$/);
    if (match && match[2]) {
      return { subBadge: match[1].trim(), mainTitle: match[2].trim() };
    }
    return { subBadge: null, mainTitle: rawTitle };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <AnimatePresence mode="wait">
        {!selectedSlug ? (
          /* ==========================================
             1. ARTICLE LIST VIEW
             ========================================== */
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            id="blog-list"
          >
            {/* Header / Intro */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-rose-100 to-pink-100 text-secondary border border-pink-200/70 shadow-2xs mb-4">
                <Sparkles size={14} className="text-pink-500" />
                <span>女の子のための安心お仕事コラム</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight text-[#3d1e28] leading-snug">
                滝井新地の当店で安心デビューするための<br />
                <span className="text-secondary relative inline-block mt-1">
                  お仕事コラム＆完全ガイド
                  <span className="absolute left-0 bottom-0.5 w-full h-3 bg-pink-200/60 -z-10 rounded-full" />
                </span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-[#6b4c55] leading-loose">
                初めて滝井新地の当店で働く女性が知っておきたい基礎知識から、30分8,000円・雑費天引きゼロの全額日払いシステム、お店の玄関から顔が見えない安心の身バレ対策、実際の1日の流れまでわかりやすく解説します。
              </p>
            </div>

            {/* Controls (Search & Category Filters) */}
            <div className="bg-gradient-to-br from-rose-50/90 via-white to-pink-50/80 rounded-4xl p-6 md:p-7 mb-10 shadow-xs border-2 border-pink-100">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Search Field */}
                <div className="relative w-full md:w-88">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-pink-400">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="気になるキーワードで検索（例：日払い、身バレ）"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-white border-2 border-pink-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-secondary text-sm text-[#3d1e28] transition-all placeholder:text-[#8c6b75]/60"
                  />
                </div>

                {/* Info summary */}
                <div className="text-xs font-sans text-[#6b4c55] bg-white px-4 py-2 rounded-full border border-pink-100 shadow-2xs">
                  全 <span className="font-bold text-secondary font-mono text-sm">{filteredArticles.length}</span> 件のコラム
                </div>
              </div>

              {/* Category Filter Buttons */}
              <div className="flex flex-wrap gap-2.5 mt-5">
                {BLOG_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-secondary to-pink-500 text-white shadow-sm shadow-pink-300/50 scale-102'
                        : 'bg-white hover:bg-rose-50 text-[#5e3a44] border border-pink-100'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            {filteredArticles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8">
                  {paginatedArticles.map((article, idx) => {
                    const { subBadge, mainTitle } = parseDisplayTitle(article.title);
                    return (
                      <motion.article
                        key={article.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
                        onClick={() => handleSelectArticle(article.slug)}
                        className="group flex flex-col bg-white rounded-3xl overflow-hidden border-2 border-pink-100/80 hover:border-pink-300 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                      >
                        {/* Eyecatch Image */}
                        <div className="relative h-52 bg-rose-50/60 flex items-center justify-center overflow-hidden">
                          <ArticleCardImage
                            src={`/images/card_${article.slug}.jpg?v=20261013b`}
                            alt={article.title}
                            category={article.category}
                            categoryLabel={article.categoryLabel}
                            className="w-full h-full"
                          />
                        </div>

                        {/* Meta & Title */}
                        <div className="flex-grow p-6 flex flex-col bg-gradient-to-b from-white to-rose-50/20">
                          <div className="flex items-center justify-between gap-2 text-xs text-[#7a5862] font-sans mb-3">
                            <span className="text-secondary font-bold">
                              ✿ {article.categoryLabel}
                            </span>
                            <span className="flex items-center gap-2 text-[11px]">
                              <span>{(article.publishedAt || '').replace(/-/g, '.')}</span>
                              <span aria-hidden="true">·</span>
                              <span>読了 {article.readTime}</span>
                            </span>
                          </div>

                          {subBadge && (
                            <div className="text-xs font-bold text-pink-600 mb-1">
                              ♥ {subBadge}
                            </div>
                          )}

                          <h3 className="text-base sm:text-lg font-bold text-[#3d1e28] leading-relaxed group-hover:text-secondary transition-colors line-clamp-2">
                            {mainTitle}
                          </h3>

                          <p className="mt-3 text-xs sm:text-sm text-[#6b4c55] line-clamp-3 leading-relaxed">
                            {article.summary}
                          </p>

                          {/* Tags as clean inline text */}
                          {article.tags && article.tags.length > 0 && (
                            <div className="mt-4 text-[11px] text-pink-600/80 leading-relaxed">
                              {article.tags.map((tag, tIdx) => (
                                <span key={tag}>
                                  #{tag}
                                  {tIdx < article.tags.length - 1 ? ' · ' : ''}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Author */}
                          <div className="mt-6 pt-4 border-t border-pink-100/80 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center border border-pink-100">
                                {article.author?.avatar || '👩‍💼'}
                              </span>
                              <div>
                                <p className="text-xs font-bold text-[#3d1e28] leading-none">{article.author?.name || '女性サポートスタッフ'}</p>
                                <p className="text-[10px] text-[#7a5862] mt-1 leading-none">{article.author?.role || '採用・相談窓口担当'}</p>
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-secondary group-hover:translate-x-1 transition-transform">
                              <span>読む</span>
                              <ChevronRight size={15} />
                            </span>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border border-pink-200 bg-white text-[#3d1e28] hover:bg-rose-50 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                      <span>前へ</span>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            type="button"
                            onClick={() => handlePageChange(page)}
                            className={`min-w-10 h-10 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-secondary to-pink-500 text-white shadow-sm shadow-pink-300/50 scale-105'
                                : 'bg-white border border-pink-100 text-[#3d1e28] hover:bg-rose-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-1 text-pink-400 font-bold">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      type="button"
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border border-pink-200 bg-white text-[#3d1e28] hover:bg-rose-50 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>次へ</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-pink-200">
                <Search size={40} className="mx-auto text-pink-300 mb-3" />
                <h3 className="text-lg font-bold text-[#3d1e28]">該当するコラムが見つかりませんでした</h3>
                <p className="text-sm text-[#6b4c55] mt-1">別のキーワードやカテゴリーでお試しください。</p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-secondary to-pink-500 text-white rounded-2xl text-sm font-bold cursor-pointer shadow-xs hover:opacity-95"
                >
                  すべて表示に戻す
                </button>
              </div>
            )}
          </motion.div>
        ) : isLoading ? (
          /* ==========================================
             LOADING STATE
             ========================================== */
          <motion.div
            key="loading-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-12 h-12 border-4 border-rose-100 border-t-secondary rounded-full animate-spin mb-4" />
            <p className="text-[#6b4c55] text-sm font-sans">コラムを読み込んでいます...</p>
          </motion.div>
        ) : !currentArticle ? (
          /* ==========================================
             NOT FOUND STATE
             ========================================== */
          <motion.div
            key="not-found-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="max-w-md mx-auto text-center py-16 px-6 bg-white border-2 border-pink-100 rounded-3xl shadow-md my-12"
          >
            <div className="w-16 h-16 bg-rose-50 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#3d1e28] mb-3">コラムが見つかりませんでした</h2>
            <p className="text-[#6b4c55] text-sm mb-8 leading-relaxed">
              お探しの記事は削除されたか、URLが変更された可能性があります。
            </p>
            <button
              onClick={handleBackToList}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary to-pink-500 text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
              コラム一覧に戻る
            </button>
          </motion.div>
        ) : (
          /* ==========================================
             2. ARTICLE DETAIL VIEW
             ========================================== */
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            {/* Back Navigation */}
            <button
              onClick={handleBackToList}
              className="group mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#5e3a44] hover:text-secondary transition-colors cursor-pointer py-2"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-secondary" />
              <span>お仕事コラム一覧へ戻る</span>
            </button>

            {/* Cute OGP / Eyecatch Card Preview */}
            <div className="rounded-4xl bg-rose-50/50 overflow-hidden shadow-sm border-2 border-pink-100">
              <ArticleCardImage
                src={`/images/card_${currentArticle!.slug}.jpg?v=20261013b`}
                alt={currentArticle!.title}
                category={currentArticle!.category}
                categoryLabel={currentArticle!.categoryLabel}
                className="w-full aspect-[1200/630]"
                isDetailHero={true}
              />
            </div>

            {/* Main Article Card Container */}
            <div className="mt-8 bg-white rounded-4xl p-6 sm:p-8 md:p-11 border-2 border-pink-100/90 shadow-xs">
              {/* Article Header info */}
              <div className="border-b-2 border-dashed border-pink-100 pb-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-[#7a5862] mb-3">
                  <span className="font-bold text-secondary">
                    ✿ {currentArticle!.categoryLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-pink-400" />
                    <span className="font-mono">{(currentArticle!.publishedAt || '').replace(/-/g, '.')}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-pink-400" />
                    読了 <span className="font-mono">{currentArticle!.readTime}</span>
                  </span>
                </div>

                {(() => {
                  const { subBadge, mainTitle } = parseDisplayTitle(currentArticle!.title);
                  return (
                    <>
                      {subBadge && (
                        <div className="text-sm md:text-base font-bold text-pink-600 mb-1.5">
                          ♥ {subBadge} ♥
                        </div>
                      )}
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold leading-relaxed text-[#3d1e28] tracking-tight">
                        {mainTitle}
                      </h1>
                    </>
                  );
                })()}

                {/* Summary Box (この記事のポイント) */}
                {currentArticle!.summary && (
                  <div className="mt-5 p-4 sm:p-5 bg-gradient-to-br from-rose-50/90 to-pink-50/60 rounded-2xl border border-pink-200/80">
                    <div className="text-xs font-bold text-secondary mb-1.5 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-pink-500" />
                      <span>この記事のポイント</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5e3a44] leading-loose">
                      {currentArticle!.summary}
                    </p>
                  </div>
                )}

                {/* Author Card inside detail */}
                <div className="mt-5 flex items-center justify-between p-3.5 bg-rose-50/40 rounded-2xl border border-pink-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-10 h-10 bg-white rounded-full flex items-center justify-center border border-pink-100 shadow-2xs">
                      {currentArticle!.author?.avatar || '👩‍💼'}
                    </span>
                    <div>
                      <div className="text-[11px] text-[#7a5862]">この記事の監修・相談担当</div>
                      <div className="text-xs sm:text-sm font-bold text-[#3d1e28]">{currentArticle!.author?.name || '女性サポートスタッフ'}</div>
                    </div>
                  </div>
                  <div className="text-xs text-secondary font-medium">
                    {currentArticle!.author?.role || '採用・相談窓口担当'}
                  </div>
                </div>
              </div>

              {/* Article Content Render */}
              <div className="mt-8 space-y-6 text-[#3d1e28] text-base md:text-[17px] leading-loose font-sans">
                {(currentArticle!.content || []).map((block, idx) => {
                  switch (block.type) {
                    case 'p':
                      return (
                        <p key={idx} className="whitespace-pre-line text-[#4a2832] leading-loose py-0.5">
                          {block.text}
                        </p>
                      );
                    case 'h2':
                      return (
                        <h2 key={idx} className="text-lg sm:text-xl md:text-2xl font-bold text-[#3d1e28] mt-10 mb-4 pt-4 pb-2.5 border-b-2 border-pink-200 flex items-start gap-2.5">
                          <span className="text-pink-500 shrink-0 mt-0.5">✿</span>
                          <span>{block.text}</span>
                        </h2>
                      );
                    case 'h3':
                      return (
                        <h3 key={idx} className="text-base sm:text-lg md:text-xl font-bold text-[#3d1e28] mt-7 mb-3 bg-gradient-to-r from-rose-50 to-pink-50/50 px-4 py-2.5 rounded-2xl border-l-4 border-pink-400">
                          {block.text}
                        </h3>
                      );
                    case 'list':
                      return (
                        <ul key={idx} className="space-y-3.5 bg-rose-50/50 p-5 sm:p-6 rounded-3xl border border-pink-100 my-6">
                          {block.items?.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-3 text-sm md:text-base">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-pink-400 text-white text-xs font-bold mt-0.5 shrink-0 shadow-2xs">
                                {itemIdx + 1}
                              </span>
                              <span className="text-[#4a2832] leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    case 'qna':
                      return (
                        <div key={idx} className="bg-white rounded-3xl border-2 border-pink-200/80 overflow-hidden my-7 shadow-2xs">
                          <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 text-[#3d1e28] px-5 py-3.5 font-bold flex items-start gap-3 border-b border-pink-100">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold shrink-0 mt-0.5">
                              Q
                            </span>
                            <span className="leading-snug">{block.question}</span>
                          </div>
                          <div className="p-5 text-sm md:text-base text-[#4a2832] leading-loose bg-white flex items-start gap-3">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 text-secondary text-xs font-bold shrink-0 mt-1">
                              A
                            </span>
                            <div>{block.answer || block.text}</div>
                          </div>
                        </div>
                      );
                    case 'cta':
                      return null;
                    default:
                      return null;
                  }
                })}
              </div>

              {/* Article Footer & Navigator */}
              <div className="mt-10 pt-6 border-t-2 border-dashed border-pink-100 flex flex-col md:flex-row justify-between gap-5 items-center">
                <div className="text-xs text-pink-600/90 leading-relaxed">
                  {currentArticle!.tags.map((tag, idx) => (
                    <span key={tag}>
                      #{tag}
                      {idx < currentArticle!.tags.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleBackToList}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-50 hover:bg-rose-100 border border-pink-200 rounded-2xl text-sm font-bold text-[#3d1e28] transition-all cursor-pointer"
                >
                  <ArrowLeft size={15} className="text-secondary" />
                  コラム一覧に戻る
                </button>
              </div>
            </div>

            {/* Cute Feminine CTA Banner block */}
            <div className="mt-10 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50/60 text-[#3d1e28] rounded-4xl p-7 sm:p-9 text-center relative overflow-hidden shadow-sm border-2 border-pink-200">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary mb-2">
                <HeartHandshake size={16} className="text-pink-500" />
                <span>女性スタッフが優しくサポートします</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#3d1e28] mb-3">
                滝井新地の当店で最短本日スタート！1日体験入店随時受付中
              </h3>
              <p className="text-xs sm:text-sm text-[#5e3a44] max-w-xl mx-auto leading-loose mb-6">
                体験入店は「面接＋見学＋1日お仕事＋30分8,000円×本数を雑費ゼロで即日全額手渡し」がすべて1日で完了する安心コースです。質問だけ・見学だけのご相談も大歓迎！まずはLINEでお気軽にお問い合わせください。
              </p>
              <div className="flex justify-center items-center">
                <button
                  onClick={() => handleCtaInArticle(currentArticle!.title)}
                  className="w-full sm:w-auto max-w-md bg-[#06c755] hover:bg-[#05b04b] text-white px-10 py-4 rounded-2xl font-bold text-base shadow-md shadow-[#06c755]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle size={19} />
                  LINEで気軽に質問・相談する
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
