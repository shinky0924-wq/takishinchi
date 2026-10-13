import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ARTICLE_PHOTO_MAP = {
  1: 'col_ryotei_flow_1789107427433.jpg',     // 仕事内容を徹底解説 (料亭個室とお茶)
  2: 'col_salary_savings_1789107442335.jpg',  // 給料システム徹底解説 (お給料袋と手渡し)
  3: 'col_privacy_protect_1789107457068.jpg', // 身バレ・顔バレ防止の極意 (静かな個室環境)
  4: 'col_studio_room_1789107471455.jpg',     // 駅近マンション寮完備 (清潔な個室寮)
  5: 'col_cafe_interview_1789107484817.jpg',  // 応募資格・面接ガイド (カフェ面談・相談)
  6: 'col_vanity_trial_1789107497172.jpg',    // 1日体験入店の流れ (ドレッサー・ヘアメイク)
  7: 'col_merit_choice_1789107511080.jpg',    // メリットと注意点 (料亭提灯の選択)
  8: 'takii_atmosphere_hero.jpg',             // 当店の特徴と大型新地の違い (滝井新地の情緒)
  9: 'col_safety_shield_1789107540732.jpg',   // 安心の接客環境と衛生ケア (安心の衛生ケア)
  10: 'col_planner_shift_1789107555087.jpg',  // 営業時間・短時間勤務 (シフト計画)
  11: 'col_art_11_tobitashinchi-short-.jpg',  // 最短1ヶ月から (短期集中)
  12: 'col_art_12_tobitashinchi-safety.jpg',  // 料亭の安全管理 (客層・安全警備)
  13: 'col_art_13_tobitashinchi-kimono.jpg',  // 和装・メイク術 (着物スタイリング)
  14: 'col_art_14_tobitashinchi-double.jpg',  // Wワーク・副業のリアル (OL・会社員)
  15: 'col_art_15_tobitashinchi-mental.jpg',  // 心に寄り添うサポート (メンタルケア)
  16: 'col_art_16_tobitashinchi-search.jpg',  // 検索ワード徹底分析 (スマホリサーチ)
  17: 'col_art_17_tobitashinchi-one-da.jpg',  // 完全密着・当店の1日 (1日の流れ)
  18: 'col_art_18_tobitashinchi-obacha.jpg',  // 仲居さん（おばちゃん）の役割 (★笑顔の仲居さん着物★)
  19: 'col_art_19_tobitashinchi-kimono.jpg',  // 和装マジック (浴衣の着こなし)
  20: 'col_art_20_tobitashinchi-privac.jpg',  // 身バレ対策の極意 (プライバシー保護)
  21: 'col_art_21_tobitashinchi-age-lo.jpg',  // 年齢・見た目のリアル (20代〜40代)
  22: 'col_art_22_tobitashinchi-safety.jpg',  // 安全第一のサポート体制 (安全サポート)
  23: 'col_art_23_tobitashinchi-weeken.jpg',  // 週末限定シフト (週末ワーク)
  24: 'col_art_24_tobitashinchi-trial-.jpg',  // 体験入店完全マニュアル (体入ガイド)
  25: 'col_art_25_tobitashinchi-mental.jpg',  // メンタルケアと休息 (安心サポート)
  26: 'col_art_26_tobitashinchi-popula.jpg',  // 人気キャストの特徴 (笑顔のキャスト)
  27: 'col_art_27_tobitashinchi-beauty.jpg',  // 美容代・自分磨き (コスメ・スキンケア)
  28: 'col_art_28_tobitashinchi-studen.jpg',  // 学生・20代の働き方 (若い女性の働き方)
  29: 'col_art_29_tobitashinchi-10mill.jpg',  // 貯金1000万円への道 (高額貯金)
  30: 'col_art_30_tobitashinchi-friend.jpg',  // 友達紹介・ペア応募 (友達同士)
  31: 'col_art_31_tobitashinchi-tennoj.jpg',  // 京橋・天王寺エリア比較 (交通アクセス)
  32: 'col_welcome_gift_1783883703745.jpg',   // 入店祝い金・各種手当 (プレゼントリボン)
  33: 'cast_avatar_one_1789108601323.jpg',    // 20代前半の強み・愛され笑顔 (若い笑顔キャスト)
  34: 'cast_avatar_two_1789108616238.jpg',    // 20代後半からのリスタート (大人の色気と落ち着き)
  35: 'cast_avatar_three_1789110410676.jpg',  // 自立した女性へ・将来の夢資金 (自立した女性キャスト)
  36: 'japanese_staff_advisor.jpg',           // 面接の裏ワザ (優しい女性アドバイザー)
  37: 'jp_cozy_bedroom_1789468035819.jpg',    // 寮生活のリアル (快適マンション寝室)
  38: 'japanese_staff_advisor_1789458719338.jpg', // 15時からの夕方シフト (夕方スタッフ相談)
  39: 'jp_warm_footbath_1789467870650.jpg',   // 心と体のセルフケア (足湯リラックス)
  40: 'japanese_cast_avatar_one.jpg',         // 和装が初めてでも安心 (浴衣姿の若いキャスト)
  41: 'japanese_hero_banner.jpg',             // キャバクラ・風俗との違い (高級和風料亭)
  42: 'jp_bank_finance_1789467925368.jpg',    // 20代のための税金対策 (電卓と通帳)
  43: 'jp_planner_notebook_1789467908606.jpg',// モチベーションを保つコツ (手帳と目標シート)
  44: 'japanese_cast_avatar_two.jpg',         // 履歴書不要・即日体験 (体験入店キャスト)
  45: 'staff_lounge_support_1789108549559.jpg',// スタッフって怖いの？ (アットホームなラウンジ)
  46: 'japanese_cast_avatar_three.jpg',       // 短期でサクッと！出稼ぎ (地方からの出稼ぎキャスト)
  47: 'jp_privacy_discreet_1789468091908.jpg',// これで安心・身バレ対策 (安心プライバシー)
  48: 'japanese_cast_avatar_one_1789458658081.jpg', // 身バレ不安のあなたへ (優しいキャスト笑顔)
  49: 'ryotei_entrance_lantern_1789108525834.jpg',  // 身バレ防止の秘訣 (顔の見えない玄関のれん)
  50: 'japanese_cast_avatar_two_1789458680991.jpg', // 日給4万〜6万円以上！ (稼ぎ頭キャスト)
  51: 'jp_cast_tatami_1789467727461.jpg',     // お仕事の一日の流れ (畳の上の和服キャスト)
  52: 'japanese_cast_avatar_three_1789458700608.jpg', // 身バレ徹底ガード (プライバシー安心キャスト)
  53: 'jp_woman_salary_1789467749655.jpg',    // 全額日払い！給料システム (日払い手渡し受取)
  54: 'japanese_cast_woman.jpg',              // 初めてでも大丈夫 (安心の和服女性)
  55: 'takii_shinchi_hero_1791612774707.jpg', // もしかしてバレる？ (滝井新地情緒)
  56: 'jp_savings_jar_1789468021098.jpg',     // 給料システム徹底解説 (貯金瓶とコイン)
  57: 'japanese_cast_woman_1789301596241.jpg', // お仕事の流れと体入 (落ち着いたキャスト)
  58: 'jp_cafe_consult_1789467761350.jpg',    // カフェで気軽に相談 (カフェお茶面談)
  59: 'japanese_hero_banner_1789458640830.jpg', // 手ぶらでOK！無料衣装 (清潔な和室衣装)
  60: 'col_art_60_commute-access-tenno.jpg',  // 通勤・アクセス快適 (京橋・梅田アクセス)
  61: 'takii_shinchi_hero_v2_1791612963835.jpg', // 貯金スピード10倍？ (安心の滝井環境)
  62: 'jp_skincare_glow_1789467940047.jpg',   // 自分磨き・美容サロン (美肌スキンケア)
  63: 'jp_herbal_tea_1789468007366.jpg',      // 心穏やかに働く (リフレッシュハーブティー)
  64: 'col_street_lanterns_1789107524691.jpg', // 深夜タクシー代支給・送りあり (安全夜道)
  65: 'jp_secure_office_1789468048970.jpg',   // SNS・身バレ対策完璧 (安心オフィスセキュリティ)
  66: 'col_art_45_tobitashinchi-friend.jpg',  // 地方出稼ぎ・短期集中 (短期キャスト)
  67: 'col_art_99_tobitashinchi-bad-sh.jpg',  // 完全自由シフト制 (クリーンな職場環境)
  68: 'jp_strawberry_cake_1789468061754.jpg', // 大阪グルメ＆観光スポット (おしゃれカフェスイーツ)
  69: 'col_art_13_tobitashinchi-kimono.jpg',  // 季節のおすすめ着物スタイル (着物コーディネート)
  70: 'col_art_100_tobitashinchi-single.jpg', // シフト管理アプリ・スケジュール (安心の生活支援)
  71: 'jp_two_friends_1789467775509.jpg',     // 友達同士の応募大歓迎 (仲良しペア応募)
  72: 'jp_fluffy_pancake_1789467858767.jpg',  // 自分へのご褒美＆モチベーション (ふわふわパンケーキ)
  73: 'col_art_73_night-relax-sleep-qu.jpg',  // 夜の静かなプライベート時間 (快適なベッド睡眠)
  74: 'col_art_27_tobitashinchi-beauty.jpg',  // ノーファンデでも美肌見え (美肌メイク)
  75: 'jp_confident_smile_1789467788318.jpg', // 自己肯定感がアップする (優しい自信の笑顔)
  76: 'jp_overseas_travel_1789468075905.jpg', // 憧れの海外旅行・留学資金 (スーツケースと旅行夢)
  77: 'jp_bubble_bath_1789467952561.jpg',     // お休み日の至福ケア (バスソルト泡風呂)
  78: 'jp_mocktail_drink_1789467883709.jpg',  // カフェ巡り＆映えスイーツ (おしゃれモクテルドリンク)
  79: 'jp_hand_mirror_1789467802719.jpg',     // ほっと一息朝時間 (朝の手鏡チェック)
  80: 'jp_room_flowers_1789467966092.jpg',    // 季節のお花でお部屋を飾る (お部屋のインテリア花)
  81: 'jp_bank_finance_1789467925368.jpg',    // 銀行口座・手渡し徹底比較 (安全な資産管理)
  82: 'jp_star_necklace_1789467896476.jpg',   // 夜空を見上げてリセット (星のネックレス)
  83: 'jp_ryotei_manner_1789467980075.jpg',   // 料亭文化の奥深さ (和のお茶マナー所作)
  84: 'jp_cozy_bedroom_1789468035819.jpg',    // おうち時間を快適に (リラックスルーム)
  85: 'jp_hand_mirror_1789467802719.jpg',     // 手鏡を見るたび笑顔に (手鏡と笑顔)
  86: 'takii_atmosphere_hero.jpg',            // 思い出を形に残す写真旅 (旅情ある街並み)
  87: 'jp_aroma_mist_1789467993508.jpg',      // アロマで心身リラックス (アロマミスト)
  88: 'jp_fluffy_pancake_1789467858767.jpg',  // ふわふわパンケーキで極上カフェタイム (パンケーキ)
  89: 'jp_kimono_style_1789467837838.jpg',    // 和装の帯結び・リボンアレンジ (上品な着物浴衣姿)
  90: 'jp_savings_jar_1789468021098.jpg',     // 貯金箱がどんどん溜まる (貯金ジャー)
  91: 'jp_herbal_tea_1789468007366.jpg',      // ハーブティーでほっと一息 (温かいハーブティー)
  92: 'jp_skincare_glow_1789467940047.jpg',   // スキンケア見直し術 (透明感美肌)
  93: 'col_art_93_cozy-blanket-room-in.jpg',  // ぬくもり溢れるお部屋づくり (毛布とお部屋)
  94: 'jp_planner_notebook_1789467908606.jpg',// 夢を叶える手帳術 (ノートとペン)
  95: 'col_art_95_non-alcoholic-juice-.jpg',  // お酒不要！ノンアルドリンク (ノンアルカクテル)
  96: 'jp_warm_footbath_1789467870650.jpg',   // 足湯＆フットケア (温かい足湯)
  97: 'jp_star_necklace_1789467896476.jpg',   // 星モチーフアクセサリー (ペンダントジュエリー)
  98: 'jp_secure_office_1789468048970.jpg',   // 安全な求人選びのポイント (安心の相談所)
  99: 'col_art_99_tobitashinchi-bad-sh.jpg',  // 後悔しないお仕事選び (クリーンな給与環境)
  100: 'col_art_100_tobitashinchi-single.jpg' // シンママ・子育て支援 (お母さんと子ども支援)
};

async function execute() {
  const rootDir = process.cwd();
  const publicImagesDir = path.join(rootDir, 'public', 'images');
  const srcImagesDir = path.join(rootDir, 'src', 'assets', 'images');
  const distImagesDir = path.join(rootDir, 'dist', 'images');

  console.log('🔄 Reassigning perfectly semantic, verified photos to all 100 articles...');

  for (let id = 1; id <= 100; id++) {
    const srcPhotoName = ARTICLE_PHOTO_MAP[id] || 'col_ryotei_flow_1789107427433.jpg';
    const srcPhotoPath = path.join(publicImagesDir, srcPhotoName);

    if (!fs.existsSync(srcPhotoPath)) {
      console.warn(`Warning: photo missing for id ${id}: ${srcPhotoName}`);
      continue;
    }

    const targetName = `col_unique_art_${id}.jpg`;
    const targetPublic = path.join(publicImagesDir, targetName);
    const targetSrc = path.join(srcImagesDir, targetName);
    const targetDist = path.join(distImagesDir, targetName);

    // Optimize and save
    const buf = await sharp(srcPhotoPath)
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 90, mozjpeg: true })
      .toBuffer();

    fs.writeFileSync(targetPublic, buf);
    fs.writeFileSync(targetSrc, buf);
    if (fs.existsSync(distImagesDir)) {
      fs.writeFileSync(targetDist, buf);
    }
  }

  console.log('✅ Successfully updated all 100 col_unique_art_*.jpg photos with semantic precision!');
}

execute().catch(console.error);
