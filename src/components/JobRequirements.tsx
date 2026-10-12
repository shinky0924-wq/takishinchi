/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import LucideIcon from './LucideIcon';
import { LINE_OFFICIAL_URL } from '../data';

export default function JobRequirements() {
  const specs = [
    {
      label: '応募資格',
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          <div>
            <span className="font-extrabold text-on-surface text-base">満20歳以上</span>
            <span className="ml-2 text-xs text-gray-500 font-medium">（20代〜30代・40代まで幅広く活躍中）</span>
          </div>
          <p className="text-xs sm:text-sm">
            ・日本国籍または特別永住者の方<br />
            ・<strong className="text-secondary">完全未経験者・ブランクのある方大歓迎</strong>（事前の丁寧なサポートあり）<br />
            ・お酒が飲めなくても全く問題ありません
          </p>
        </div>
      )
    },
    {
      label: '活躍中の年齢層',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          <div className="bg-rose-50/70 border border-rose-200/70 rounded-xl p-3">
            <h4 className="font-bold text-secondary text-xs sm:text-sm mb-1">
              20代〜40代まで幅広い年代の女性が活躍しています
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              滝井新地は古くからの地元客や常連客（店馴染み）が非常に多いのが特徴です。未経験の20代から大人の魅力を活かせる30代・40代まで、愛嬌や丁寧な接客が何より評価され、安定して稼げる環境が整っています。
            </p>
          </div>

          <div className="space-y-2.5">
            {/* 20代 */}
            <div className="bg-surface-container-low/60 border border-rose-100/80 rounded-xl p-3">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                <span className="font-bold text-on-surface text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                  20代の女性（学生・フリーター・OLの方）
                  <span className="text-[11px] font-bold text-secondary bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-full">未経験スタート多数</span>
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                未経験から始める方が最も多い世代です。清楚系・ナチュラルな雰囲気の方が特に人気で、お店の玄関から顔が見えないため身バレを気にせず安心して高収入を得られます。
              </p>
            </div>

            {/* 30代 */}
            <div className="bg-surface-container-low/60 border border-rose-100/80 rounded-xl p-3">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                <span className="font-bold text-on-surface text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
                  30代の女性（Wワーク・副業・お姉さん世代）
                  <span className="text-[11px] font-bold text-pink-600 bg-pink-50 border border-pink-200/80 px-2 py-0.5 rounded-full">リピーターがつきやすい</span>
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                落ち着いた気配りや親しみやすい笑顔が好まれる世代です。優しい常連のお客様が多く、マイペースに安定して高収入を得やすい環境です。
              </p>
            </div>

            {/* 40代 */}
            <div className="bg-surface-container-low/60 border border-rose-100/80 rounded-xl p-3">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                <span className="font-bold text-on-surface text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  40代の女性（主婦・大人のお姉さん世代）
                  <span className="text-[11px] font-medium text-gray-500">（落ち着いた客層で安心）</span>
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                穏やかな常連客層から根強い支持がある世代です。年齢や体型に不安がある方でも、優しい雰囲気や丁寧なおもてなしで幅広く活躍されています。
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      label: '必要書類・持ち物',
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          <div>
            <span className="font-bold text-secondary block">① 本籍地記載の住民票（マイナンバーカード等でコンビニ即日発行可能）</span>
            <p className="text-xs text-gray-500 mt-0.5">
              ※法令順守および年齢確認のため、1日体験入店時でも必ずご持参いただく必要があります。
            </p>
          </div>
          <div>
            <span className="font-bold text-secondary block">② 顔写真付き公的身分証明書</span>
            <p className="text-xs text-gray-500 mt-0.5">
              運転免許証、パスポート、マイナンバーカード等の有効期限内のもの。
            </p>
          </div>
          <div>
            <span className="font-bold text-on-surface block">【体験入店時の持ち物】</span>
            <p className="text-xs text-gray-600 mt-0.5">
              メイク道具、自前の衣装やウィッグ（※可愛い無料の貸衣装やアメニティも完備しています）。
            </p>
          </div>
        </div>
      )
    },
    {
      label: '勤務時間・シフト',
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          <p>
            <strong>15:00〜24:00</strong>（24:00全店一斉閉店 ※朝・昼からの営業はありません）
          </p>
          <p className="text-xs sm:text-sm">
            ・週1日・1日3時間〜の短時間勤務からOK<br />
            ・Wワーク、昼職副業、土日のみ、短期（1日〜1週間）、地方からの出稼ぎ歓迎<br />
            <span className="text-xs text-gray-400">※ご希望の曜日・時間帯に合わせて柔軟にシフト調整可能です。</span>
          </p>
        </div>
      )
    },
    {
      label: '勤務地・アクセス',
      content: (
        <div className="space-y-1.5 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          <p className="font-bold text-on-surface">
            大阪府守口市滝井西町（滝井新地エリア）
          </p>
          <ul className="space-y-1 text-xs text-gray-600">
            <li>・京阪本線「千林駅」「滝井駅」より徒歩約3分（駅チカで通勤ラクラク）</li>
            <li>・大阪メトロ谷町線「千林大宮駅」「太子橋今市駅」より徒歩圏内</li>
          </ul>
        </div>
      )
    },
    {
      label: '給与システム',
      content: (
        <div className="space-y-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          <p>
            <strong className="text-secondary text-sm sm:text-base">完全歩合制（全額日払い・即日手渡し）</strong>
          </p>
          <p className="text-xs text-gray-500">
            ノルマ・罰金・待機カットなし、衣装代やお菓子代などの雑費天引き完全0円。<br />
            ※1本あたりのバック給詳細（30分 8,000円〜）や給料シミュレーターは
            <a href="#salary" className="text-secondary font-bold underline ml-1 hover:text-rose-700">
              お給料・待遇セクション
            </a>
            をご確認ください。
          </p>
        </div>
      )
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-rose-100/60" id="requirements">
      <div className="max-w-[900px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full text-secondary font-bold text-xs tracking-wider uppercase mb-2.5">
            <LucideIcon name="FileCheck" size={13} />
            <span>REQUIREMENTS</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-on-surface mb-3">
            募集要項
          </h2>
          <p className="font-sans text-xs md:text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            滝井新地で働くための応募資格・必要書類・勤務条件の概要です。
          </p>
        </div>

        {/* Clean Spec Table / Card Container */}
        <div className="bg-white rounded-2xl border border-rose-100 shadow-xs overflow-hidden">
          <dl className="divide-y divide-rose-100">
            {specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-1 md:grid-cols-12 p-5 sm:p-6 gap-2 md:gap-6 hover:bg-rose-50/20 transition-colors">
                <dt className="md:col-span-3 font-display font-bold text-sm sm:text-base text-on-surface flex items-start gap-2">
                  <span className="w-1.5 h-4 bg-secondary rounded-full shrink-0 mt-1 inline-block" />
                  <span>{spec.label}</span>
                </dt>
                <dd className="md:col-span-9">
                  {spec.content}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Quick Question / LINE Link */}
        <div className="mt-8 text-center">
          <p className="text-xs sm:text-sm text-on-surface-variant mb-3">
            書類の取得方法やシフトについてなど、ご不明な点はお気軽にLINEでお問い合わせください。
          </p>
          <a
            href={LINE_OFFICIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#06c755] hover:bg-[#05b34c] text-white font-sans font-bold text-xs sm:text-sm py-2.5 px-6 rounded-full shadow-xs hover:shadow-md transition-all"
            id="requirements-line-cta"
          >
            <LucideIcon name="MessageCircle" size={16} className="fill-white text-white" />
            <span>LINEで質問・相談する</span>
          </a>
        </div>

      </div>
    </section>
  );
}
