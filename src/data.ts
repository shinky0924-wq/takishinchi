/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConcernItem, ReasonItem, FAQItem, TestimonialItem, JobFactItem, FlowStep } from './types';

const tobitaCastOne = '/images/japanese_cast_avatar_one.jpg';
const tobitaCastTwo = '/images/japanese_cast_avatar_two.jpg';
const tobitaCastThree = '/images/japanese_cast_avatar_three.jpg';
const takiiHeroBanner = '/src/assets/images/takii_shinchi_hero_v2_1791612963835.jpg';
const tobitaAdvisorAvatar = '/images/japanese_staff_advisor.jpg';

export const LINE_OFFICIAL_URL = 'https://lin.ee/n1e96Gf';

export const HERO_IMAGE_URL = takiiHeroBanner;
export const CONSULTANT_AVATAR_URL = tobitaAdvisorAvatar;

export const CONCERNS: ConcernItem[] = [
  {
    id: 'concern-1',
    iconName: 'Baby',
    title: '未経験でも',
    question: '働ける？'
  },
  {
    id: 'concern-2',
    iconName: 'ShieldAlert',
    title: '落ち着いた',
    question: '客層なの？'
  },
  {
    id: 'concern-3',
    iconName: 'EyeOff',
    title: '顔バレ・身バレ',
    question: 'したくない'
  },
  {
    id: 'concern-4',
    iconName: 'Store',
    title: 'お店の雰囲気は',
    question: '安心できる？'
  },
  {
    id: 'concern-5',
    iconName: 'Coins',
    title: '30分8,000円で',
    question: 'ちゃんと稼げる？'
  }
];

export const REASONS: ReasonItem[] = [
  {
    number: '01',
    iconName: 'EyeOff',
    title: 'お店の玄関から顔が見えない',
    description: 'のれんをくぐった店内奥で顔合わせをするため、通行人に顔を見られず安心です。'
  },
  {
    number: '02',
    iconName: 'Award',
    title: '完全未経験から歓迎',
    description: '初心者の方にも女性スタッフが丁寧な事前レクチャーを行い、親身にサポートします。'
  },
  {
    number: '03',
    iconName: 'Users',
    title: '20代〜40代まで活躍中',
    description: '地元客や常連客が多く、20代から落ち着いた30代・40代の女性まで幅広く歓迎。'
  },
  {
    number: '04',
    iconName: 'MessageSquare',
    title: 'LINEで気軽に事前相談',
    description: '応募前に不安なことや疑問点を、24時間いつでもLINEで気軽に質問できます。'
  },
  {
    number: '05',
    iconName: 'Coins',
    title: '30分8,000円・全額日払い',
    description: '雑費や天引きは一切なし。稼いだお給料はその日の退勤時に全額現金手渡し。'
  },
  {
    number: '06',
    iconName: 'HandHeart',
    title: '1日体験入店もOK',
    description: 'まずは1日体験入店でお店の雰囲気を確認でき、その日のうちに全額日払い精算。'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Q. 未経験でも本当に大丈夫ですか？',
    answer: 'A. はい、もちろんです！現在働いている女性の多くが未経験からのスタートです。接客は完全受け身のシンプルな内容で、お客様のご案内もベテランの仲居さん（おばちゃん）がすべてサポートします。'
  },
  {
    id: 'faq-2',
    question: 'Q. 年齢制限はありますか？何歳くらいの女性が働いていますか？',
    answer: 'A. 満20歳以上の女性であればご応募いただけます。滝井新地では20代〜40代まで幅広い年代の女性が中心となって活躍しています。'
  },
  {
    id: 'faq-3',
    question: 'Q. 通りすがりの人に顔を見られたりしませんか？',
    answer: 'A. 飛田新地のように通りから女性の姿が直接見えるスタイルとは異なり、のれんをくぐった「お店の奥」で顔合わせを行います。通行人に顔を見られることがなく、ネットへの写真掲載も一切ないため、身バレ・顔バレのリスクは極めて低いです。'
  },
  {
    id: 'faq-4',
    question: 'Q. お給料はいくらですか？全額日払いですか？',
    answer: 'A. 30分コースで女の子のバック額は8,000円です（15分などの超短時間コースはありません）。稼いだお給料は働いたその日の退勤時に、全額現金手渡しでお持ち帰りいただけます。'
  },
  {
    id: 'faq-5',
    question: 'Q. 衣装代やお菓子代などの天引き（雑費）はありますか？',
    answer: 'A. 雑費・天引きは一切ありません（完全0円）。無料の貸衣装や接客用のお茶・お菓子セットもお店で用意していますので、稼いだお給料がそのまま100%手元に残ります。'
  },
  {
    id: 'faq-6',
    question: 'Q. ノルマや罰金などはありますか？',
    answer: 'A. いいえ、ノルマや罰金・ペナルティなどは一切ありません！自分のペースでストレスなくのびのびと働いていただけます。'
  },
  {
    id: 'faq-7',
    question: 'Q. お酒が飲めなくても働けますか？',
    answer: 'A. はい、お酒が全く飲めなくても問題ありません！お茶やソフトドリンクでお仕事が可能です。お酒が苦手な方も多数活躍されています。'
  },
  {
    id: 'faq-8',
    question: 'Q. 営業時間は何時からですか？短時間やWワークでも働けますか？',
    answer: 'A. 営業時間は15:00〜24:00（朝・昼の営業なし）です。週1日・週末だけ・夕方からの数時間など、昼職・学生・主婦の方のライフスタイルに合わせて無理のないシフトを組んでいただけます。'
  },
  {
    id: 'faq-9',
    question: 'Q. 働くときの服や衣装はどうなりますか？',
    answer: 'A. ワンピースやドレス、着物などの素敵な貸衣装が無料で用意されています。もちろんご自身の働きやすい私服・衣装の持ち込みもOKです。'
  },
  {
    id: 'faq-10',
    question: 'Q. 相談だけで実際に働かなくても大丈夫ですか？',
    answer: 'A. はい、もちろん大歓迎です！ご相談・お問い合わせ段階で無理にお仕事を勧めることは絶対にありません。話を聞いてみて「やっぱりやめておきます」でも全く問題ありませんので、まずはお気軽にご連絡ください。'
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    avatarUrl: tobitaCastOne,
    tag: '未経験から安心スタート',
    age: '24歳',
    status: 'アルバイト',
    quote: '最初は不安でいっぱいでしたが、女性スタッフさんがLINEで優しく説明してくださり安心しました。お店の玄関から顔が見えないうえ、仲居さん（おばちゃん）や常連のお客様が本当に優しくて働きやすいです！'
  },
  {
    id: 'test-2',
    avatarUrl: tobitaCastTwo,
    tag: '天引きゼロで手取り大幅UP',
    age: '27歳',
    status: 'フリーター',
    quote: '他エリアでは雑費が引かれることもあると聞きましたが、こちらは衣装代もお菓子代も天引き完全0円！30分8,000円がそのまま全額その日に手渡しでもらえるので、手元に残る収入が大きく増えました。'
  },
  {
    id: 'test-3',
    avatarUrl: tobitaCastThree,
    tag: '1日体験入店から本入店へ',
    age: '32歳',
    status: 'OL・Wワーク',
    quote: '「自分の年齢でも大丈夫かな…」と迷って相談しましたが、滝井新地は30代・40代の女性もたくさん活躍していると聞いて1日体験入店しました。客層が本当に穏やかで居心地が良く、そのまま本入店を決めました！'
  }
];

export const JOB_FACTS: JobFactItem[] = [
  {
    id: 'fact-1',
    iconName: 'Banknote',
    title: 'バック給',
    highlight: ['30分 8,000円', '全額日払い手渡し']
  },
  {
    id: 'fact-2',
    iconName: 'Sparkles',
    title: 'お店の特徴',
    highlight: ['玄関から顔が見えない', '20代〜40代活躍中']
  },
  {
    id: 'fact-3',
    iconName: 'Clock',
    title: '営業時間',
    highlight: ['15:00〜24:00', '週1日・短時間OK']
  },
  {
    id: 'fact-4',
    iconName: 'Home',
    title: '待遇・サポート',
    highlight: ['雑費・天引き完全0円', '個室寮・送迎あり']
  },
  {
    id: 'fact-5',
    iconName: 'PiggyBank',
    title: '体験入店',
    highlight: ['1日体験入店OK', '即日全額現金支給']
  }
];

export const FLOW_STEPS: FlowStep[] = [
  { number: '01', title: 'LINEで無料相談' },
  { number: '02', title: '面接・お店見学' },
  { number: '03', title: '1日体験入店' },
  { number: '04', title: '即日全額日払い' },
  { number: '05', title: '本入店・お仕事開始' }
];
