/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import LucideIcon from './LucideIcon';

export default function JobWorkflow() {
  const steps = [
    {
      step: '01',
      time: '出勤・準備',
      title: '出勤・メイク・着替え',
      icon: 'Sparkles',
      image: '/images/col_vanity_trial_1789107497172.jpg',
      imageAlt: '清潔なドレッサーと衣装準備',
      desc: '出勤したら、清潔な個別控室のドレッサーでメイクを整え、清楚なワンピースやドレス、和装などの衣装に着替えます。無料の貸衣装やアメニティを豊富に完備しているため、お仕事帰りや手ぶらでの出勤もOKです。'
    },
    {
      step: '02',
      time: '店内での待機',
      title: 'お店の奥での顔合わせ',
      icon: 'Heart',
      image: '/images/ryotei_entrance_lantern_1789108525834.jpg',
      imageAlt: '料亭の店内・お座敷での待機',
      desc: 'お店の玄関から顔が見えないよう、のれんをくぐった「お店の奥」で待機します。通行人に顔を見られる心配がなく、お客様への声掛けやご案内はベテランの仲居さん（おばちゃん）がすべて優しくサポートします。'
    },
    {
      step: '03',
      time: 'お部屋へのご案内',
      title: 'お部屋への案内・会計',
      icon: 'Coffee',
      image: '/images/col_ryotei_flow_1789107427433.jpg',
      imageAlt: '個室和室・お茶出しセット',
      desc: 'お客様が決まったら清潔な個室和室へご案内します（30分コース）。前払いで料金をお預かりして精算し、無料で用意されているお茶・お菓子・おしぼりセットをお部屋へ運びます。'
    },
    {
      step: '04',
      time: '個室でのサービス',
      title: '接客サービス',
      icon: 'ShieldCheck',
      image: '/images/col_safety_shield_1789107540732.jpg',
      imageAlt: '安心の衛生管理とルール徹底',
      desc: 'シャワー設備はないため、当店が常備しているウェットティッシュや除菌スプレー等で下半身を清潔にし、フェラ、挿入のシンプルなサービスを行います。接客後に女性はシャワーを浴びていただけます。'
    },
    {
      step: '05',
      time: '接客後のお見送り',
      title: 'お見送り・お部屋の整頓',
      icon: 'HandHeart',
      image: '/images/col_welcome_gift_1783883703745.jpg',
      imageAlt: 'お見送りとお部屋の整頓',
      desc: 'お時間になったら身支度を整え、お客様をお見送りします。お部屋を綺麗に整えたら、再び店内奥での待機（ステップ02）に戻ります。'
    },
    {
      step: '06',
      time: 'シフト終了・退勤',
      title: '即日全額日払い精算・帰宅',
      icon: 'Coins',
      image: '/images/col_salary_savings_1789107442335.jpg',
      imageAlt: '全額当日日払い手渡し',
      desc: 'その日のシフトが終了したら退勤です。稼いだお給料（1本30分8,000円）を全額日払い（現金手渡し）で受け取って帰宅できます。ノルマや罰金、衣装代・お菓子代などの雑費天引きは一切なく、稼いだ全額が100%手元に残ります。'
    }
  ];

  return (
    <section className="py-20 bg-rose-50/20 relative overflow-hidden" id="job-content">
      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 bg-rose-100/70 border border-rose-200/80 px-3.5 py-1 rounded-full text-secondary font-bold text-xs tracking-wider uppercase mb-3">
            <LucideIcon name="Briefcase" size={13} />
            <span>DAILY WORKFLOW</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl lg:text-4xl text-on-surface mb-4">
            お仕事内容と1日の流れ
          </h2>
          <p className="font-sans text-xs md:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            特別な技術や講習、難しいプレイテクニックは一切不要です。<br className="hidden sm:inline" />
            ご案内は優しい仲居さん（おばちゃん）がすべてサポートし、接客も完全受け身で終わるシンプルな仕事内容です。
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-secondary to-rose-300 mx-auto rounded-full mt-4" />
        </div>

        {/* 3 Key Points Highlight Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-secondary flex items-center justify-center shrink-0">
              <LucideIcon name="CheckCircle2" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface">特別な技術・講習不要</h4>
              <p className="text-xs text-on-surface-variant">完全受け身のシンプル接客</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-secondary flex items-center justify-center shrink-0">
              <LucideIcon name="CheckCircle2" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface">声掛け・ご案内はおばちゃん</h4>
              <p className="text-xs text-on-surface-variant">未経験でも初日から安心</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-secondary flex items-center justify-center shrink-0">
              <LucideIcon name="CheckCircle2" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface">お店の玄関から顔が見えない</h4>
              <p className="text-xs text-on-surface-variant">お店の奥での顔合わせで身バレ防止</p>
            </div>
          </div>
        </div>

        {/* 1日の流れタイムラインカード */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {steps.map((st, idx) => (
            <motion.div
              key={st.step}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="bg-white rounded-3xl p-5 md:p-6 border border-rose-100 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6"
              id={`workflow-step-${st.step}`}
            >
              {/* Step number badge */}
              <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto shrink-0 gap-2 sm:gap-1">
                <div className="flex items-center gap-3 sm:flex-col sm:gap-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-secondary to-rose-400 text-white flex items-center justify-center font-display font-black text-lg shadow-sm">
                    {st.step}
                  </div>
                  <span className="text-[10px] font-bold text-secondary tracking-wider uppercase">
                    {st.time}
                  </span>
                </div>
                <div className="sm:hidden text-secondary">
                  <LucideIcon name={st.icon} size={20} />
                </div>
              </div>

              {/* Image thumbnail */}
              <div className="w-full sm:w-36 md:w-44 h-36 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-rose-100 shadow-xs relative group/img">
                <img
                  src={st.image}
                  alt={st.imageAlt}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:hidden" />
                <span className="absolute bottom-2 left-2 text-[10px] text-white font-bold sm:hidden px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs">
                  {st.title}
                </span>
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-display font-bold text-base md:text-lg text-on-surface">
                    {st.title}
                  </h3>
                </div>
                <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
