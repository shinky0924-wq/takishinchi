/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import LucideIcon from './LucideIcon';

export default function AboutTobita() {
  const points = [
    {
      icon: 'Landmark',
      badge: '01. HISTORY & TRUST',
      title: '1. 江戸時代の宿場町から続く歴史ある料亭街',
      desc: '滝井新地は江戸時代の京街道の宿場町に起源を持つ歴史ある料亭街です。長年にわたり地元の常連客に愛され続けている、落ち着いた伝統的なエリアです。'
    },
    {
      icon: 'MapPin',
      badge: '02. LOCATION & ACCESS',
      title: '2. 駅徒歩3分の好立地＆無料送迎サポート',
      desc: '京阪本線「千林駅」「滝井駅」から徒歩約3分、谷町線「千林大宮駅」「太子橋今市駅」からも徒歩圏内。閑静な住宅街にあり人目につきにくく、終電後の無料送迎やタクシー代支給も完備しています。'
    },
    {
      icon: 'Store',
      badge: '03. COMPACT & PRIVATE',
      title: '3. 全9軒ほどのコンパクトで落ち着いた環境',
      desc: '飛田新地や松島新地と比べて全9軒程度とコンパクトで、見物目的の団体客や冷やかし客がいないのが特徴。「店馴染み」の優良な常連様が中心のため、安心して働けます。'
    },
    {
      icon: 'EyeOff',
      badge: '04. NO STREET EXPOSURE',
      title: '4. 玄関から顔が見えない「お店の奥」で顔合わせ',
      desc: '通りから女性の姿が直接見えるスタイルとは異なり、のれんをくぐった「お店の奥」で顔合わせを行います。通行人に顔を見られることがなく、ネットへの写真掲載も一切ないため身バレリスクは極めて低いです。'
    },
    {
      icon: 'Users',
      badge: '05. CAST & CLIENTELE',
      title: '5. 20代〜40代まで幅広い年代の女性が活躍中',
      desc: '働く女性は20代〜40代が中心で、未経験者から落ち着いた大人の女性まで幅広く活躍しています。ベテランの仲居さん（おばちゃん）が入口で客層を厳選するため、穏やかでマナーの良いお客様ばかりです。'
    },
    {
      icon: 'Clock',
      badge: '06. HOURS & SYSTEM',
      title: '6. 30分8,000円・雑費天引き完全0円',
      desc: '営業時間は15:00〜24:00（朝・昼の営業なし）。15分などの超短時間コースはなく30分8,000円〜の明瞭会計で、衣装代やお菓子代などの雑費天引きも完全0円のため、稼いだ全額をその日に持ち帰れます。'
    }
  ];

  const overviewRows = [
    {
      label: '所在地',
      value: '大阪府守口市滝井西町付近（閑静な住宅街エリア）'
    },
    {
      label: '最寄り駅・送迎',
      value: '京阪本線「千林駅」「滝井駅」徒歩約3分 ／ 終電後の無料送迎・タクシー代支給あり'
    },
    {
      label: '営業スタイル',
      value: 'お店の玄関から顔が見えない「お店の奥」での顔合わせ・ネット写真掲載一切なし'
    },
    {
      label: '活躍中の年齢層',
      value: '20代〜40代まで幅広く活躍中 ／ 地元客・常連（店馴染み）の紳士的なお客様が中心'
    },
    {
      label: '営業時間・シフト',
      value: '15:00〜24:00（週1日・1日3時間〜OK ／ 完全自由シフト・ノルマ罰金なし）'
    },
    {
      label: 'お給料システム',
      value: '30分コース 8,000円〜（雑費・天引き完全0円 ／ 毎日全額現金手渡し）'
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden" id="about">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-50/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-100/80 px-3.5 py-1 rounded-full text-secondary font-bold text-xs tracking-wider uppercase mb-3">
            <LucideIcon name="Info" size={13} />
            <span>ABOUT TAKII SHINCHI</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl lg:text-4xl text-on-surface mb-4">
            滝井新地とは？特徴と働きやすさ
          </h2>
          <p className="font-sans text-xs md:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            守口市・滝井にある静かで落ち着いた料亭街「滝井新地」。<br className="hidden sm:inline" />
            お店の玄関から顔が見えない安心環境と、雑費天引き完全0円の全額日払いで、未経験からでも安心して高収入を目指せます。
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-secondary to-rose-300 mx-auto rounded-full mt-4" />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-12">
          {points.map((pt, idx) => (
            <motion.div
              key={pt.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-surface-container-low/70 hover:bg-white p-6 rounded-3xl border border-rose-100/70 hover:border-secondary/30 shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              id={`about-point-${idx + 1}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-300 shadow-xs">
                    <LucideIcon name={pt.icon} size={22} />
                  </div>
                  <span className="text-[10px] font-extrabold tracking-widest text-secondary/70 bg-rose-50/80 px-2.5 py-1 rounded-full">
                    {pt.badge}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base md:text-lg text-on-surface mb-2.5 group-hover:text-secondary transition-colors">
                  {pt.title}
                </h3>
                <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Summary Table */}
        <div className="bg-surface-container-low/60 border border-rose-100 rounded-3xl p-6 md:p-8 mb-10 max-w-4xl mx-auto">
          <h3 className="font-display font-extrabold text-base md:text-xl text-on-surface mb-4 flex items-center gap-2">
            <LucideIcon name="FileText" size={18} className="text-secondary" />
            <span>滝井新地の基本データまとめ</span>
          </h3>
          <div className="divide-y divide-rose-100/80">
            {overviewRows.map((row) => (
              <div key={row.label} className="py-3.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs md:text-sm">
                <span className="sm:w-48 shrink-0 font-bold text-secondary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
                  {row.label}
                </span>
                <span className="text-on-surface font-medium leading-relaxed">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recruitment Banner Note */}
        <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 border border-rose-200/60 rounded-3xl p-6 md:p-8 text-center max-w-3xl mx-auto shadow-xs">
          <span className="inline-block bg-secondary text-white text-[11px] font-black tracking-widest px-3 py-1 rounded-full uppercase mb-2">
            TAKII SHINCHI POINT
          </span>
          <h4 className="font-display font-extrabold text-lg md:text-xl text-on-surface mb-2">
            身バレしにくく、自分のペースで無理なくしっかり稼げる安心環境
          </h4>
          <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
            お店の玄関から顔が見えない安心感と、地元の常連様を中心とした穏やかな客層が最大の魅力です。<br className="hidden sm:inline" />
            衣装代やお菓子代などの雑費天引きは一切なく（完全0円）、30分8,000円のバック給をその日に100%全額日払いでお渡ししています。
          </p>
        </div>
      </div>
    </section>
  );
}
