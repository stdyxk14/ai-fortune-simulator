"use client";

import { useMemo, useState } from "react";

/* =========================
   小さいUI部品
========================= */

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ className = "", children }) {
  return <div className={cn("rounded-[28px] border border-slate-200 bg-white shadow-sm", className)}>{children}</div>;
}

function CardHeader({ className = "", children }) {
  return <div className={cn("p-6 pb-0", className)}>{children}</div>;
}

function CardTitle({ className = "", children }) {
  return <h2 className={cn("text-xl font-semibold text-slate-900", className)}>{children}</h2>;
}

function CardDescription({ className = "", children }) {
  return <p className={cn("mt-1 text-sm leading-6 text-slate-500", className)}>{children}</p>;
}

function CardContent({ className = "", children }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

function Button({
  className = "",
  variant = "default",
  size = "md",
  children,
  ...props
}) {
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-medium transition",
        "focus:outline-none focus:ring-2 focus:ring-sky-200",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Badge({ className = "", children, tone = "dark" }) {
  const tones = {
    dark: "bg-slate-900 text-white",
    light: "bg-white/80 text-slate-700 border border-slate-200",
    sky: "bg-sky-100 text-sky-700",
    green: "bg-emerald-100 text-emerald-700",
    violet: "bg-violet-100 text-violet-700",
    outline: "bg-white text-slate-700 border border-slate-200",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}

function ProgressBar({ value }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-sky-400 transition-all" style={{ width: `${safe}%` }} />
    </div>
  );
}

function MetricCard({ label, value, emphasis = false }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        emphasis ? "border-sky-200 bg-sky-50" : "border-slate-200 bg-white"
      )}
    >
      <div className="mb-2 text-sm text-slate-500">{label}</div>
      <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function SoftInfoCard({ title, text }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="font-semibold text-slate-800">{title}</div>
      <div className="mt-1 text-sm leading-6 text-slate-600">{text}</div>
    </div>
  );
}

function AlertBox({ title, children, tone = "sky" }) {
  const tones = {
    sky: "border-sky-200 bg-sky-50",
    amber: "border-amber-200 bg-amber-50",
    cyan: "border-cyan-200 bg-cyan-50",
  };
  return (
    <div className={cn("rounded-2xl border p-4", tones[tone])}>
      <div className="font-medium text-slate-900">{title}</div>
      <div className="mt-2 text-sm leading-7 text-slate-700">{children}</div>
    </div>
  );
}

function NumberField({ label, value, onChange, step = "1" }) {
  return (
    <label className="space-y-2">
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <input
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-300"
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value || 0))}
      />
    </label>
  );
}

/* =========================
   ペンギン
========================= */

function PenguinAvatar({ size = 84 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="penguin mascot">
      <ellipse cx="60" cy="108" rx="30" ry="8" fill="#E7EDF5" />
      <ellipse cx="60" cy="60" rx="34" ry="42" fill="#24395B" />
      <ellipse cx="61" cy="66" rx="24" ry="30" fill="#FFFFFF" />
      <ellipse cx="48" cy="47" rx="6.2" ry="7.2" fill="#FFFFFF" />
      <ellipse cx="73" cy="47" rx="6.2" ry="7.2" fill="#FFFFFF" />
      <circle cx="48" cy="48" r="2.7" fill="#1A1A1A" />
      <circle cx="73" cy="48" r="2.7" fill="#1A1A1A" />
      <ellipse cx="60" cy="58" rx="8.3" ry="5.6" fill="#F6B733" />
      <path d="M52 57 Q60 66 68 57" fill="#F6B733" />
      <ellipse cx="35" cy="65" rx="7" ry="17" transform="rotate(-18 35 65)" fill="#24395B" />
      <ellipse cx="85" cy="65" rx="7" ry="17" transform="rotate(18 85 65)" fill="#24395B" />
      <ellipse cx="50" cy="94" rx="6" ry="3.5" fill="#F6B733" />
      <ellipse cx="71" cy="94" rx="6" ry="3.5" fill="#F6B733" />
      <circle cx="41" cy="57" r="3" fill="#FFD9D9" opacity="0.55" />
      <circle cx="80" cy="57" r="3" fill="#FFD9D9" opacity="0.55" />
    </svg>
  );
}

function MiniPenguin() {
  return <PenguinAvatar size={34} />;
}

function SpeechBubble({ children }) {
  return (
    <div className="relative rounded-2xl bg-sky-50 p-4 text-sm leading-7 text-slate-700">
      {children}
      <div className="absolute -bottom-2 left-6 h-4 w-4 rotate-45 bg-sky-50" />
    </div>
  );
}

/* =========================
   データ
========================= */

const PLATFORM_META = {
  line: { label: "LINE直販", feeRate: 0.03, avgFrontPrice: 0 },
  coconala: { label: "ココナラ", feeRate: 0.22, avgFrontPrice: 2000 },
  stores: { label: "STORES / BASE", feeRate: 0.08, avgFrontPrice: 2500 },
  mercari: { label: "メルカリ", feeRate: 0.1, avgFrontPrice: 1200 },
};

const START_STATE = {
  followersX: 180,
  followersThreads: 120,
  impressions: 0,
  profileVisits: 0,
  leads: 0,
  lineSubscribers: 0,
  platformOrders: 0,
  platformTrust: 20,
  trust: 50,
  fatigue: 10,
  churnRisk: 35,
  quality: 45,
  educationDepth: 15,
  reviews: 0,
  closeRate: 0.03,
  ltv: 8000,
  frontUnitPrice: 0,
  platformFeeRate: 0,
  directRevenue: 0,
  platformRevenue: 0,
  retainedClients: 0,
  repeatRate: 0.1,
  monthlyCash: 0,
};

const STAGES = [
  {
    key: "market",
    week: 1,
    title: "① 狙う市場を決める",
    desc: "どの悩み市場に入るかで、反応率・単価・継続率・信頼負荷が変わります。",
    helper: "迷ったら『恋愛（行動判断特化）』がおすすめです。",
    options: [
      {
        label: "恋愛（広め）",
        text: "反応は取りやすいが、広すぎると埋もれやすい。",
        impact: { impressions: 3000, profileVisits: 130, leads: 16, quality: 2, ltv: 1200, trust: 2, fatigue: 1, churnRisk: 2 },
        note: "入口は広いが、差別化しないと価格競争に寄りやすい。",
      },
      {
        label: "恋愛（行動判断特化）",
        text: "『そのLINE送る？』『今動く？』など行動判断支援に寄せる。",
        impact: { impressions: 2600, profileVisits: 160, leads: 22, quality: 8, ltv: 2600, trust: 7, fatigue: 1, churnRisk: -3 },
        note: "初心者におすすめ。入口も作りやすい。",
        recommended: true,
      },
      {
        label: "復縁（深い悩み）",
        text: "ニーズが深く、継続や高単価に強い。",
        impact: { impressions: 2200, profileVisits: 150, leads: 18, quality: 10, ltv: 3400, trust: 4, fatigue: 3, churnRisk: -2 },
        note: "強い市場だが、言葉選びを間違えると重く見られやすい。",
      },
      {
        label: "不倫・複雑愛",
        text: "悩みは明確で売上は立ちやすいが、扱う難易度は高い。",
        impact: { impressions: 2100, profileVisits: 165, leads: 20, quality: 12, ltv: 4200, trust: 1, fatigue: 6, churnRisk: 2 },
        note: "売上は強いが、初心者が真正面から入るにはやや重い。",
      },
    ],
  },
  {
    key: "positioning",
    week: 1,
    title: "② 差別化の切り方を決める",
    desc: "同じ市場でも、切り口で埋もれやすさが変わります。",
    helper: "おすすめは『判断シーンで切る』か『入口は軽く、後ろで深くする』です。",
    options: [
      {
        label: "テーマだけで入る",
        text: "『恋愛占い』『復縁相談』のように広いテーマ名で入る。",
        impact: { impressions: 600, profileVisits: 20, leads: 2, quality: -4, trust: -1, churnRisk: 3 },
        note: "広いが埋もれやすい。",
      },
      {
        label: "判断シーンで切る",
        text: "『そのLINE送る？』『会うべき？』のように行動場面で切る。",
        impact: { impressions: 1400, profileVisits: 75, leads: 8, quality: 6, trust: 5, ltv: 1200, churnRisk: -2 },
        note: "かなりおすすめ。入口が作りやすい。",
        recommended: true,
      },
      {
        label: "感情の詰まりで切る",
        text: "『既読スルーで止まってる』『罪悪感と執着が混ざる』などで切る。",
        impact: { impressions: 1200, profileVisits: 90, leads: 10, quality: 8, trust: 6, ltv: 1800, fatigue: 2, churnRisk: -2 },
        note: "刺さりは強いが、言語化力が必要。",
      },
      {
        label: "入口は軽く、後ろで深くする",
        text: "表では軽い商品名で入り、後ろで深い悩みに接続する。",
        impact: { impressions: 1700, profileVisits: 110, leads: 12, quality: 7, trust: 7, ltv: 2000, churnRisk: -3 },
        note: "怪しく見えにくく、かなり強い設計。",
        recommended: true,
      },
    ],
  },
  {
    key: "channel",
    week: 1,
    title: "③ 集客チャネルを決める",
    desc: "XとThreadsの使い分けで、入口の質と量が変わります。",
    helper: "迷ったら『X×Threads併用』が一番バランスが良いです。",
    options: [
      {
        label: "X集中",
        text: "フックが刺さると強い。波も大きい。",
        impact: { impressions: 4200, profileVisits: 170, leads: 8, quality: 1, trust: 1, fatigue: 2 },
        channel: { x: 42, threads: 0 },
        note: "伸びるときは強いが、安定感はやや低め。",
      },
      {
        label: "Threads集中",
        text: "文脈で読まれやすく、柔らかい入口を作りやすい。",
        impact: { impressions: 2900, profileVisits: 150, leads: 12, quality: 4, trust: 3, fatigue: 1 },
        channel: { x: 0, threads: 35 },
        note: "相談系と相性が良い。",
      },
      {
        label: "X×Threads併用",
        text: "Xで止めて、Threadsで深く読ませる。",
        impact: { impressions: 5200, profileVisits: 260, leads: 18, quality: 8, trust: 6, fatigue: 4 },
        channel: { x: 26, threads: 28 },
        note: "現実的な勝ち筋。おすすめ。",
        recommended: true,
      },
    ],
  },
  {
    key: "front_model",
    week: 2,
    title: "④ 入口は無料？有料？",
    desc: "無料で広く取るか、低単価で最初から買う人を取るかを決めます。",
    helper: "初心者なら『無料フロント→LINE育成』が分かりやすいです。",
    options: [
      {
        label: "無料フロント→LINE育成",
        text: "無料相談や無料企画で見込み客を集め、LINEで育てる。",
        impact: { leads: 22, lineSubscribers: 28, educationDepth: 8, trust: 6, fatigue: 2, churnRisk: -2 },
        note: "母数を取りやすい。後ろで伸ばしやすい。",
        recommended: true,
      },
      {
        label: "低単価商品→販売プラットフォーム起点",
        text: "最初からお金を払う客を取る。客の質は高い。",
        impact: { leads: 8, platformOrders: 7, platformTrust: 12, quality: 8, trust: 3, fatigue: 1, churnRisk: -1 },
        note: "質は良いが入口はやや狭い。",
      },
      {
        label: "無料フロント＋低単価商品併用",
        text: "無料で広く取りつつ、低単価商品でも客を取る。",
        impact: { leads: 18, lineSubscribers: 16, platformOrders: 5, platformTrust: 10, quality: 7, educationDepth: 6, trust: 7, fatigue: 5, churnRisk: -2 },
        note: "強いけど少し複雑。",
      },
    ],
  },
  {
    key: "sales_platform",
    week: 2,
    title: "⑤ 実際の販売チャネルを決める",
    desc: "どこで売るかで、手数料・客層・レビュー資産が変わります。",
    helper: "低単価フロントなら『ココナラ』がかなり使いやすいです。",
    options: [
      {
        label: "SNS→LINE直販型",
        platform: "line",
        text: "X / ThreadsからLINEに流して直販する。",
        impact: { lineSubscribers: 16, educationDepth: 12, closeRate: 0.02, ltv: 2200, trust: 6, fatigue: 2, churnRisk: -3 },
        note: "教育と高単価導線に強い。",
        recommended: true,
      },
      {
        label: "ココナラ低単価フロント",
        platform: "coconala",
        text: "相談文化とレビュー資産を使って低単価商品を売る。",
        impact: { platformOrders: 10, platformTrust: 20, reviews: 8, quality: 4, closeRate: 0.01, ltv: 1200, trust: 5, fatigue: 1, churnRisk: -1 },
        note: "実績を積みやすい。かなり使いやすい。",
        recommended: true,
      },
      {
        label: "STORES / BASEフロント",
        platform: "stores",
        text: "自分の棚を持てる。世界観が作りやすい。",
        impact: { platformOrders: 7, platformTrust: 10, reviews: 3, closeRate: 0.015, ltv: 2200, trust: 4, fatigue: 1, churnRisk: -1 },
        note: "教育済み客には強い。",
      },
      {
        label: "メルカリ低単価導入",
        platform: "mercari",
        text: "入口は広いが、価格感覚が崩れやすい。",
        impact: { platformOrders: 12, platformTrust: 3, reviews: 4, quality: -4, closeRate: -0.002, ltv: -1500, trust: -2, fatigue: 2, churnRisk: 5 },
        note: "売りやすいが、後ろの導線は少し難しい。",
      },
    ],
  },
  {
    key: "front_product",
    week: 2,
    title: "⑥ 最初の商品を決める",
    desc: "無料でも低単価でも、最初の商品体験でその後がかなり変わります。",
    helper: "おすすめは『そのLINE送るか相談』か『決めるの代行屋』です。",
    options: [
      {
        label: "無料鑑定企画",
        text: "王道で反応は取りやすい。",
        impact: { impressions: 1700, profileVisits: 90, leads: 14, lineSubscribers: 12, quality: 2, trust: 4, fatigue: 5, churnRisk: 4 },
        note: "母数は取れるけど、全部答えると終わりやすい。",
      },
      {
        label: "そのLINE送るか相談",
        text: "行動判断で入る。悩みの温度感が高い。",
        impact: { impressions: 1500, profileVisits: 115, leads: 16, lineSubscribers: 10, quality: 8, trust: 8, fatigue: 2, churnRisk: -3 },
        note: "かなり強い入口。",
        recommended: true,
      },
      {
        label: "決めるの代行屋",
        text: "占い感を薄めつつ、冷やかし層も拾いやすい。",
        impact: { impressions: 2200, profileVisits: 140, leads: 18, lineSubscribers: 8, quality: 4, trust: 6, fatigue: 1, churnRisk: -1 },
        note: "入り口を広くしたい時に強い。",
        recommended: true,
      },
      {
        label: "低単価『彼の気持ち診断』",
        text: "販売プラットフォームに置きやすい王道フロント。",
        impact: { platformOrders: 8, quality: 3, closeRate: 0.01, ltv: 900, trust: 2, fatigue: 1, churnRisk: 2 },
        note: "売りやすいけど、後ろの階段が必要。",
      },
      {
        label: "低単価『相手の温度感チェック』",
        text: "行動判断寄りで、次にもつなげやすい。",
        impact: { platformOrders: 7, quality: 8, closeRate: 0.018, ltv: 1700, trust: 5, fatigue: 1, churnRisk: -2 },
        note: "低単価商品の中ではかなり優秀。",
      },
    ],
  },
  {
    key: "content",
    week: 3,
    title: "⑦ 投稿の入口を決める",
    desc: "同じ中身でも、入口の言葉で反応は大きく変わります。",
    helper: "おすすめは『欲望フック→構造回収』か『残酷→救済』です。",
    options: [
      {
        label: "有益だけど重い構造論",
        text: "内容は正しいけど、初見には少し重い。",
        impact: { impressions: 1200, profileVisits: 45, leads: 4, trust: 3, fatigue: 0, churnRisk: 1 },
        note: "深いけど入口が弱くなりやすい。",
      },
      {
        label: "欲望フック→構造回収",
        text: "最初に止めて、後半でちゃんと構造に落とす。",
        impact: { impressions: 3000, profileVisits: 155, leads: 18, quality: 4, trust: 5, fatigue: 1, churnRisk: -1 },
        note: "かなり使いやすい勝ち筋。",
        recommended: true,
      },
      {
        label: "誇大気味の煽り",
        text: "伸びることはあるが、信頼が削れやすい。",
        impact: { impressions: 3600, profileVisits: 170, leads: 14, trust: -10, fatigue: 0, churnRisk: 8 },
        note: "短期は強くても後ろで詰みやすい。",
      },
      {
        label: "残酷→救済の解体新書型",
        text: "痛いところを刺してから、構造で救う。",
        impact: { impressions: 3100, profileVisits: 180, leads: 20, quality: 6, trust: 7, fatigue: 1, churnRisk: -2 },
        note: "権威づけにも強い。",
        recommended: true,
      },
    ],
  },
  {
    key: "education",
    week: 3,
    title: "⑧ 教育のかけ方を決める",
    desc: "無料相談でも初回購入者でも、教育の深さがLTVを大きく変えます。",
    helper: "おすすめは『3通〜5通で迷いを言語化する』です。",
    options: [
      {
        label: "教育なし・すぐ売る",
        text: "スピードは出るが、高単価や継続に弱い。",
        impact: { educationDepth: -8, closeRate: 0.004, ltv: -1800, trust: -4, churnRisk: 5 },
        note: "短期は動いても、後ろが弱くなりやすい。",
      },
      {
        label: "3通〜5通で迷いを言語化する",
        text: "悩み・判断・次の論点を整理してから売る。",
        impact: { educationDepth: 14, lineSubscribers: 8, closeRate: 0.02, ltv: 2800, trust: 8, churnRisk: -4 },
        note: "王道でかなり強い。",
        recommended: true,
      },
      {
        label: "無料で全部教える",
        text: "感謝はされるが、次に売る余地が薄くなる。",
        impact: { educationDepth: 4, closeRate: -0.012, ltv: -1600, trust: 3, fatigue: 6, churnRisk: 4 },
        note: "親切だけど商売としては弱い。",
      },
    ],
  },
  {
    key: "reply",
    week: 4,
    title: "⑨ 最初の返し方を決める",
    desc: "無料相談や初回購入後の返し方で『単発』か『積み上がる』かが分かれます。",
    helper: "おすすめは『結論だけ返して次の論点を残す』です。",
    options: [
      {
        label: "全部答える",
        text: "満足度は高いが、次提案の余地がなくなる。",
        impact: { closeRate: -0.01, ltv: -1400, trust: 4, fatigue: 8, churnRisk: 6 },
        note: "いい人だけど、商売としては弱い。",
      },
      {
        label: "結論だけ返して次の論点を残す",
        text: "信頼を取りつつ、次提案にもつなげる。",
        impact: { profileVisits: 20, leads: 10, lineSubscribers: 10, closeRate: 0.03, ltv: 2600, trust: 8, fatigue: 1, churnRisk: -4 },
        note: "かなり強い返し方。",
        recommended: true,
      },
      {
        label: "テンプレ感の強い返答",
        text: "時短はできるが、価格を上げづらい。",
        impact: { quality: -4, closeRate: -0.008, ltv: -1200, trust: -5, fatigue: -1, churnRisk: 3 },
        note: "量は回るが後ろが弱い。",
      },
    ],
  },
  {
    key: "offer",
    week: 4,
    title: "⑩ 次の商品設計を決める",
    desc: "ここで単発で終わるか、売上の階段ができるかが決まります。",
    helper: "おすすめは『深掘り→継続→別テーマ提案の3段設計』です。",
    options: [
      {
        label: "単発相談だけ売る",
        text: "その場の成約は取れるが、次につながらない。",
        impact: { closeRate: 0.012, ltv: -2200, trust: 1, fatigue: 0, churnRisk: 4 },
        note: "頑張るほど消耗しやすい。",
      },
      {
        label: "深掘り→継続→別テーマ提案の3段設計",
        text: "LTVが伸びやすく、売上が積み上がる。",
        impact: { leads: 8, closeRate: 0.025, ltv: 4200, repeatRate: 0.1, trust: 6, fatigue: 2, churnRisk: -5 },
        note: "かなり理想的な設計。",
        recommended: true,
      },
      {
        label: "いきなり高額だけ売る",
        text: "刺さる人はいるが、多くを取りこぼしやすい。",
        impact: { closeRate: 0.008, ltv: 1800, trust: -4, fatigue: 1, churnRisk: 3 },
        note: "前提の信頼が薄いと厳しい。",
      },
    ],
  },
  {
    key: "crm",
    week: 4,
    title: "⑪ 顧客管理を決める",
    desc: "最後は顧客管理です。ここが雑だと、かなりの機会損失になります。",
    helper: "おすすめは『悩み別・温度感別に分岐』です。",
    options: [
      {
        label: "一括対応",
        text: "楽だが、刺さり方を捨てることになる。",
        impact: { leads: -2, closeRate: -0.01, ltv: -1400, trust: -2, fatigue: -2, churnRisk: 4 },
        note: "ラクだけどかなりもったいない。",
      },
      {
        label: "悩み別・温度感別に分岐",
        text: "運用は少し重いが、継続率と提案精度が上がる。",
        impact: { leads: 8, retainedClients: 6, repeatRate: 0.12, closeRate: 0.02, ltv: 2600, trust: 6, fatigue: 2, churnRisk: -4 },
        note: "LTVを取りにいくならこれ。",
        recommended: true,
      },
      {
        label: "フォローしない",
        text: "その場では楽。後ろの売上はかなり漏れる。",
        impact: { leads: -10, retainedClients: -4, closeRate: -0.015, ltv: -2400, trust: -6, fatigue: -4, churnRisk: 6 },
        note: "単発で終わる典型。",
      },
    ],
  },
];

const SCENARIOS = {
  coconala: {
    title: "ココナラ現実ルート",
    picks: [
      "恋愛（行動判断特化）",
      "判断シーンで切る",
      "X×Threads併用",
      "低単価商品→販売プラットフォーム起点",
      "ココナラ低単価フロント",
      "低単価『相手の温度感チェック』",
      "残酷→救済の解体新書型",
      "3通〜5通で迷いを言語化する",
      "結論だけ返して次の論点を残す",
      "深掘り→継続→別テーマ提案の3段設計",
      "悩み別・温度感別に分岐",
    ],
    note: "最初の実績作りと低単価フロントの回しやすさを重視したルート。",
  },
  line: {
    title: "LINE直販ルート",
    picks: [
      "恋愛（行動判断特化）",
      "入口は軽く、後ろで深くする",
      "X×Threads併用",
      "無料フロント→LINE育成",
      "SNS→LINE直販型",
      "そのLINE送るか相談",
      "欲望フック→構造回収",
      "3通〜5通で迷いを言語化する",
      "結論だけ返して次の論点を残す",
      "深掘り→継続→別テーマ提案の3段設計",
      "悩み別・温度感別に分岐",
    ],
    note: "教育と高単価導線を中心に回す王道ルート。",
  },
  stores: {
    title: "STORES / BASEルート",
    picks: [
      "恋愛（行動判断特化）",
      "入口は軽く、後ろで深くする",
      "X×Threads併用",
      "無料フロント＋低単価商品併用",
      "STORES / BASEフロント",
      "低単価『相手の温度感チェック』",
      "欲望フック→構造回収",
      "3通〜5通で迷いを言語化する",
      "結論だけ返して次の論点を残す",
      "深掘り→継続→別テーマ提案の3段設計",
      "悩み別・温度感別に分岐",
    ],
    note: "世界観を保ちつつ中単価へ繋げる棚型ルート。",
  },
};

/* =========================
   ロジック
========================= */

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatYen(v) {
  return `¥${Number(v || 0).toLocaleString()}`;
}

function calcEconomics(m) {
  const effectiveLeads = Math.max(
    0,
    m.leads + Math.round(m.lineSubscribers * 0.6) + Math.round(m.platformOrders * 0.5)
  );
  const highTicketSales = Math.round(effectiveLeads * Math.max(0.005, m.closeRate));
  const repeatClients = Math.round((highTicketSales + m.platformOrders) * Math.max(0, m.repeatRate));
  const directRevenue = Math.round(highTicketSales * Math.max(1000, m.ltv));
  const repeatRevenue = Math.round(repeatClients * Math.max(3000, Math.round(m.ltv * 0.55)));
  const platformRevenue = Math.round(m.platformOrders * Math.max(500, m.frontUnitPrice || 2000));
  const grossRevenue = directRevenue + repeatRevenue + platformRevenue;
  const platformFee = Math.round(platformRevenue * Math.max(0, m.platformFeeRate));
  const supportCost = Math.round(m.fatigue * 120 + m.platformOrders * 90 + m.lineSubscribers * 40);
  const netRevenue = Math.max(0, grossRevenue - platformFee - supportCost);

  return {
    effectiveLeads,
    highTicketSales,
    repeatClients,
    directRevenue,
    repeatRevenue,
    platformRevenue,
    grossRevenue,
    platformFee,
    supportCost,
    netRevenue,
  };
}

function calcScore(m, eco) {
  return clamp(
    Math.round(
      m.trust * 0.22 +
        m.platformTrust * 0.08 +
        m.quality * 0.2 +
        m.educationDepth * 0.18 +
        m.closeRate * 1000 * 0.12 +
        m.ltv / 1000 * 3.5 +
        eco.netRevenue / 12000 -
        m.fatigue * 0.35 -
        m.churnRisk * 0.45
    ),
    0,
    100
  );
}

function scoreLabel(score) {
  if (score >= 88) return "月利100万がかなり見える";
  if (score >= 72) return "かなり強い";
  if (score >= 55) return "伸び筋あり";
  if (score >= 40) return "改善余地あり";
  return "まだ遠回り気味";
}

function penguinComment(score, finished) {
  if (!finished) return "いまは設計中だよ。迷ったら『おすすめ』から選べば大丈夫🐧";
  if (score >= 88) return "かなり良い設計！この感覚を再現できるようにしよう🐧";
  if (score >= 72) return "かなり強いよ。あと少しで月利100万の像がもっとハッキリする🐧";
  if (score >= 55) return "悪くない！でも教育か階段設計をもう少し強くすると伸びやすいよ🐧";
  if (score >= 40) return "惜しい！入口は悪くないけど、後ろの回収設計が少し弱いかも🐧";
  return "大丈夫、これは失敗じゃなくて訓練だよ。どこが漏れてるか見つけるのが大事🐧";
}

function applyImpact(prev, option) {
  const next = {
    ...prev,
    followersX: prev.followersX,
    followersThreads: prev.followersThreads,
    impressions: Math.max(0, prev.impressions + (option.impact.impressions || 0)),
    profileVisits: Math.max(0, prev.profileVisits + (option.impact.profileVisits || 0)),
    leads: Math.max(0, prev.leads + (option.impact.leads || 0)),
    lineSubscribers: Math.max(0, prev.lineSubscribers + (option.impact.lineSubscribers || 0)),
    platformOrders: Math.max(0, prev.platformOrders + (option.impact.platformOrders || 0)),
    platformTrust: clamp(prev.platformTrust + (option.impact.platformTrust || 0), 0, 100),
    quality: clamp(prev.quality + (option.impact.quality || 0), 0, 100),
    educationDepth: clamp(prev.educationDepth + (option.impact.educationDepth || 0), 0, 100),
    reviews: Math.max(0, prev.reviews + (option.impact.reviews || 0)),
    closeRate: clamp(prev.closeRate + (option.impact.closeRate || 0), 0.005, 0.35),
    repeatRate: clamp((prev.repeatRate || 0.1) + (option.impact.repeatRate || 0), 0.02, 0.8),
    retainedClients: Math.max(0, prev.retainedClients + (option.impact.retainedClients || 0)),
    ltv: Math.max(800, prev.ltv + (option.impact.ltv || 0)),
    trust: clamp(prev.trust + (option.impact.trust || 0), 0, 100),
    fatigue: clamp(prev.fatigue + (option.impact.fatigue || 0), 0, 100),
    churnRisk: clamp(prev.churnRisk + (option.impact.churnRisk || 0), 0, 100),
    frontUnitPrice: prev.frontUnitPrice,
    platformFeeRate: prev.platformFeeRate,
  };

  if (option.label === "X集中") next.followersX += 42;
  if (option.label === "Threads集中") next.followersThreads += 35;
  if (option.label === "X×Threads併用") {
    next.followersX += 26;
    next.followersThreads += 28;
  }

  if (option.platform) next.platformFeeRate = PLATFORM_META[option.platform].feeRate;

  if (option.label === "SNS→LINE直販型") next.frontUnitPrice = 0;
  if (option.label === "ココナラ低単価フロント") next.frontUnitPrice = 2000;
  if (option.label === "STORES / BASEフロント") next.frontUnitPrice = 2500;
  if (option.label === "メルカリ低単価導入") next.frontUnitPrice = 1200;
  if (option.label === "低単価『彼の気持ち診断』") next.frontUnitPrice = Math.max(next.frontUnitPrice, 2000);
  if (option.label === "低単価『相手の温度感チェック』") next.frontUnitPrice = Math.max(next.frontUnitPrice, 2500);

  const eco = calcEconomics(next);
  next.directRevenue = eco.directRevenue + eco.repeatRevenue;
  next.platformRevenue = eco.platformRevenue;
  next.monthlyCash = eco.netRevenue;

  return next;
}

function buildAnalysis(history, metrics, eco) {
  const labels = history.map((h) => h.label);
  const points = [];
  const lessons = [];
  const warnings = [];

  if (labels.includes("不倫・複雑愛")) {
    points.push("不倫・複雑愛は売上が立ちやすいですが、信頼負荷と疲労も高い市場です。");
    lessons.push("『売れやすい』と『扱いやすい』は別です。真正面より入口を軽くした方が強いです。");
  }
  if (labels.includes("入口は軽く、後ろで深くする")) {
    points.push("入口を軽くしながら、後ろで深い悩みに接続できています。");
  }
  if (labels.includes("判断シーンで切る")) {
    points.push("判断シーンで切れているため、埋もれにくく入口も作りやすいです。");
  }
  if (labels.includes("X×Threads併用")) {
    points.push("Xで止めてThreadsで深く読ませる導線が作れています。");
  }
  if (labels.includes("無料フロント→LINE育成")) {
    points.push("無料で広く拾って、LINEで温度感を上げる王道モデルを取れています。");
  }
  if (labels.includes("ココナラ低単価フロント")) {
    points.push("ココナラの相談文化とレビュー資産をうまく使えています。");
  }
  if (labels.includes("STORES / BASEフロント")) {
    points.push("自分の棚を持つことで世界観と中単価への接続がしやすくなっています。");
  }
  if (labels.includes("そのLINE送るか相談")) {
    points.push("意思決定支援で入れているため、見込み客の質が高いです。");
  }
  if (labels.includes("決めるの代行屋")) {
    points.push("占い感を薄めた入口にできていて、嫌悪感を持つ層も拾いやすいです。");
  }
  if (labels.includes("残酷→救済の解体新書型")) {
    points.push("痛みと救済の両方を見せていて、権威づけにも強い設計です。");
  }
  if (labels.includes("3通〜5通で迷いを言語化する")) {
    points.push("教育の深さが高く、高単価や継続につながりやすい状態です。");
  }
  if (labels.includes("結論だけ返して次の論点を残す")) {
    points.push("信頼を取りつつ、次提案にもつなげられています。");
  }
  if (labels.includes("深掘り→継続→別テーマ提案の3段設計")) {
    points.push("売上の階段を最初から設計できています。");
  }
  if (labels.includes("悩み別・温度感別に分岐")) {
    points.push("顧客管理が丁寧で、LTVを伸ばしやすい状態です。");
  }

  if (labels.includes("誇大気味の煽り")) warnings.push("短期のインプレは取れても、信頼と継続率を削りやすいです。");
  if (labels.includes("全部答える")) warnings.push("無料や初回で価値を出し切ってしまい、有料化の余地が薄くなっています。");
  if (labels.includes("単発相談だけ売る")) warnings.push("その場の売上は出ても、LTVが伸びにくく消耗しやすい設計です。");
  if (labels.includes("メルカリ低単価導入")) warnings.push("入口は広いですが、価格感覚が崩れやすく後ろの導線が弱くなりやすいです。");
  if (labels.includes("フォローしない")) warnings.push("フォロー漏れが大きく、せっかく集めた見込み客を逃しやすいです。");

  if (eco.netRevenue >= 1000000) {
    points.push("このルートは、月利100万超のイメージがかなり具体的に持てる水準です。");
    lessons.push("月利100万は“1発当てる”ではなく、“入口×教育×階段設計×管理”の積み上げです。");
  }

  const summary =
    eco.netRevenue >= 1000000
      ? "かなり強いルートです。集客・教育・販売・継続の流れがうまく噛み合っています。"
      : eco.netRevenue >= 300000
      ? "悪くない設計です。あと少し『教育』か『次提案』を変えると一気に伸びやすいです。"
      : "まだ遠回り気味です。努力量より、入口設計と次提案の組み方を見直す方が早いです。";

  return { points, lessons, warnings, summary };
}

function calcGapToOneMillion(metrics, eco) {
  const target = 1000000;
  const gap = Math.max(0, target - eco.netRevenue);
  const avgHighTicketPerSale = Math.max(15000, metrics.ltv);
  const additionalSalesNeeded = Math.ceil(gap / avgHighTicketPerSale);
  const closeRateNow = Math.max(0.005, metrics.closeRate);
  const extraLeadsNeeded = Math.ceil(additionalSalesNeeded / closeRateNow);
  const ltvNeeded =
    eco.highTicketSales > 0
      ? Math.ceil(gap / eco.highTicketSales + metrics.ltv)
      : Math.ceil(metrics.ltv + gap / 3);

  return { target, gap, additionalSalesNeeded, extraLeadsNeeded, ltvNeeded };
}

function buildWeekSummary(history) {
  const summary = { 1: [], 2: [], 3: [], 4: [] };
  history.forEach((h) => {
    const stage = STAGES.find((s) => s.title === h.stage);
    if (stage) summary[stage.week].push(h.label);
  });
  return summary;
}

function calcScenarioFromLabels(labels) {
  let current = { ...START_STATE, directRevenue: 0, platformRevenue: 0, monthlyCash: 0 };
  const pickedHistory = [];
  STAGES.forEach((stage) => {
    const option =
      stage.options.find((o) => labels.includes(o.label)) ||
      stage.options.find((o) => o.recommended) ||
      stage.options[0];
    current = applyImpact(current, option);
    pickedHistory.push({
      stage: stage.title,
      label: option.label,
      text: option.text,
      note: option.note,
    });
  });
  const economics = calcEconomics(current);
  const score = calcScore(current, economics);
  return { metrics: current, economics, score, history: pickedHistory };
}

/* =========================
   売上管理パネル
========================= */

function SalesPlannerPanel() {
  const [inputs, setInputs] = useState({
    frontOrders: 30,
    frontPrice: 2500,
    platformFeeRate: 0.22,
    lineCount: 120,
    closeRate: 0.08,
    highTicketPrice: 30000,
    repeatClients: 12,
    repeatPrice: 12000,
    miscCost: 30000,
  });

  const numbers = useMemo(() => {
    const frontRevenue = inputs.frontOrders * inputs.frontPrice;
    const fee = Math.round(frontRevenue * inputs.platformFeeRate);
    const highTicketSales = Math.round(inputs.lineCount * inputs.closeRate);
    const highTicketRevenue = highTicketSales * inputs.highTicketPrice;
    const repeatRevenue = inputs.repeatClients * inputs.repeatPrice;
    const gross = frontRevenue + highTicketRevenue + repeatRevenue;
    const net = gross - fee - inputs.miscCost;
    return { frontRevenue, fee, highTicketSales, highTicketRevenue, repeatRevenue, gross, net };
  }, [inputs]);

  const onNum = (key, value) => setInputs((prev) => ({ ...prev, [key]: value }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">売上管理パネル</CardTitle>
        <CardDescription>実際の数字を入れて、月利100万までの距離感を確認できます。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <NumberField label="フロント注文数" value={inputs.frontOrders} onChange={(v) => onNum("frontOrders", v)} />
          <NumberField label="フロント単価" value={inputs.frontPrice} onChange={(v) => onNum("frontPrice", v)} />
          <NumberField label="手数料率（小数）" value={inputs.platformFeeRate} step="0.01" onChange={(v) => onNum("platformFeeRate", v)} />
          <NumberField label="LINE登録数" value={inputs.lineCount} onChange={(v) => onNum("lineCount", v)} />
          <NumberField label="高単価CVR（小数）" value={inputs.closeRate} step="0.01" onChange={(v) => onNum("closeRate", v)} />
          <NumberField label="高単価単価" value={inputs.highTicketPrice} onChange={(v) => onNum("highTicketPrice", v)} />
          <NumberField label="継続人数" value={inputs.repeatClients} onChange={(v) => onNum("repeatClients", v)} />
          <NumberField label="継続単価" value={inputs.repeatPrice} onChange={(v) => onNum("repeatPrice", v)} />
          <NumberField label="その他コスト" value={inputs.miscCost} onChange={(v) => onNum("miscCost", v)} />
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <MetricCard label="フロント売上" value={formatYen(numbers.frontRevenue)} />
          <MetricCard label="手数料" value={formatYen(numbers.fee)} />
          <MetricCard label="高単価成約数" value={`${numbers.highTicketSales}件`} />
          <MetricCard label="高単価売上" value={formatYen(numbers.highTicketRevenue)} />
          <MetricCard label="継続売上" value={formatYen(numbers.repeatRevenue)} />
          <MetricCard label="月間粗利" value={formatYen(numbers.net)} emphasis />
        </div>

        <AlertBox title="読み方" tone="sky">
          ここで大事なのは、フロント売上だけで100万を狙うのではなく、
          <span className="font-semibold"> LINE登録 → 高単価 → 継続 </span>
          の3段で組むことです。
        </AlertBox>
      </CardContent>
    </Card>
  );
}

/* =========================
   メイン
========================= */

export default function Page() {
  const [stageIndex, setStageIndex] = useState(0);
  const [metrics, setMetrics] = useState({
    ...START_STATE,
    directRevenue: 0,
    platformRevenue: 0,
    monthlyCash: 0,
  });
  const [history, setHistory] = useState([]);
  const [showGuide, setShowGuide] = useState(true);
  const [mode, setMode] = useState("beginner");
  const [topTab, setTopTab] = useState("simulator");
  const [resultTab, setResultTab] = useState("result");

  const finished = stageIndex >= STAGES.length;
  const stage = STAGES[Math.min(stageIndex, STAGES.length - 1)];
  const economics = useMemo(() => calcEconomics(metrics), [metrics]);
  const score = calcScore(metrics, economics);
  const analysis = useMemo(() => buildAnalysis(history, metrics, economics), [history, metrics, economics]);
  const gap = useMemo(() => calcGapToOneMillion(metrics, economics), [metrics, economics]);
  const weekSummary = useMemo(() => buildWeekSummary(history), [history]);

  const scenarioCards = useMemo(() => {
    return Object.entries(SCENARIOS).map(([key, sc]) => {
      const result = calcScenarioFromLabels(sc.picks);
      return { key, ...sc, ...result };
    });
  }, []);

  const pick = (option) => {
    const nextMetrics = applyImpact(metrics, option);
    setMetrics(nextMetrics);
    setHistory((prev) => [
      ...prev,
      { stage: STAGES[stageIndex].title, label: option.label, text: option.text, note: option.note },
    ]);
    setStageIndex((prev) => prev + 1);
  };

  const reset = () => {
    setMetrics({ ...START_STATE, directRevenue: 0, platformRevenue: 0, monthlyCash: 0 });
    setHistory([]);
    setStageIndex(0);
    setResultTab("result");
  };

  const applyScenario = (labels) => {
    const result = calcScenarioFromLabels(labels);
    setMetrics(result.metrics);
    setHistory(result.history);
    setStageIndex(STAGES.length);
    setTopTab("simulator");
    setResultTab("result");
  };

  const currentStepProgress = (stageIndex / STAGES.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6FBFF] via-white to-[#F5F7FA] p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* header */}
        <div className="grid gap-4 lg:grid-cols-12">
          <Card className="border-0 bg-gradient-to-r from-[#DFF4FF] via-[#EAF8FF] to-[#F3FBFF] lg:col-span-8">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-white p-3 shadow-sm">
                    <PenguinAvatar size={92} />
                  </div>
                  <div className="hidden rounded-2xl bg-white/80 px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm md:block">
                    こんにちは、ペン太です。<br />
                    難しい話を、できるだけやさしく案内するよ。
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="light">週次モード対応</Badge>
                    <Badge tone="light">3ルート比較</Badge>
                    <Badge tone="light">売上管理パネル付き</Badge>
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800 md:text-4xl">
                      AI占い副業シミュレーター
                    </h1>
                    <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-700 md:text-base">
                      これは「読む教材」ではなく、
                      <span className="font-semibold"> 売れる構造を選びながら体感する訓練ツール </span>
                      です。0→1だけでなく、月利100万までの距離を
                      <span className="font-semibold"> 週単位・比較・実数入力 </span>
                      で見られるようにしています。
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button onClick={reset}>最初からはじめる</Button>
                    <Button variant="outline" onClick={() => applyScenario(SCENARIOS.line.picks)}>
                      おすすめルートを試す
                    </Button>
                    <Button variant="ghost" onClick={() => setShowGuide((prev) => !prev)}>
                      {showGuide ? "使い方を閉じる" : "使い方を見る"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle>ペン太のひとこと</CardTitle>
              <CardDescription>今の状態をやさしくひとことで案内します。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MiniPenguin />
                <SpeechBubble>{penguinComment(score, finished)}</SpeechBubble>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MiniStat label="進捗" value={`${Math.min(stageIndex + 1, STAGES.length)} / ${STAGES.length}`} />
                <MiniStat label="総合スコア" value={`${score}/100`} />
                <MiniStat label="月間粗利想定" value={formatYen(economics.netRevenue)} />
                <MiniStat label="判定" value={scoreLabel(score)} />
              </div>

              <div className="h-px w-full bg-slate-200" />

              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-700">表示モード</div>
                <div className="flex gap-2">
                  <Button size="sm" variant={mode === "beginner" ? "default" : "outline"} onClick={() => setMode("beginner")}>
                    初心者モード
                  </Button>
                  <Button size="sm" variant={mode === "pro" ? "default" : "outline"} onClick={() => setMode("pro")}>
                    実務モード
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* guide */}
        {showGuide && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">はじめて使う人へ</CardTitle>
              <CardDescription>この4つを見ると使いやすいです。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-4">
              <SoftInfoCard title="① 選ぶ" text="各ステップで設計をひとつ選びます。迷ったら『おすすめ』から選べばOKです。" />
              <SoftInfoCard title="② 週で見る" text="週1は市場と入口、週2は販売、週3は教育、週4は回収と管理を見るイメージです。" />
              <SoftInfoCard title="③ 比べる" text="3ルート比較で、どのプラットフォームが自分に合うかを見比べられます。" />
              <SoftInfoCard title="④ 打ち込む" text="売上管理パネルで、実際の数字を入れて月利100万までの距離を確認できます。" />
            </CardContent>
          </Card>
        )}

        {/* top tabs */}
        <div className="grid w-full grid-cols-4 gap-2 rounded-2xl bg-white p-2">
          {[
            ["simulator", "シミュレーター"],
            ["weekly", "週次モード"],
            ["compare", "3ルート比較"],
            ["planner", "売上管理"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTopTab(key)}
              className={cn(
                "rounded-xl px-3 py-2 text-sm font-medium transition",
                topTab === key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* simulator tab */}
        {topTab === "simulator" && (
          <div className="space-y-6">
            <div className="grid gap-4 xl:grid-cols-12">
              <Card className="xl:col-span-8">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-2xl">いまの状況</CardTitle>
                      <CardDescription>
                        {mode === "beginner"
                          ? "最初は『見込み客』『教育深度』『月間粗利想定』だけ見ればOKです。"
                          : "集客→教育→成約→継続のどこで伸びているかを構造で見ます。"}
                      </CardDescription>
                    </div>
                    <Badge tone="outline">{finished ? "完了" : `進行中 ${stageIndex + 1}/${STAGES.length}`}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                      <span>進捗</span>
                      <span>{Math.round(currentStepProgress)}%</span>
                    </div>
                    <ProgressBar value={currentStepProgress} />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard label="月間粗利想定" value={formatYen(economics.netRevenue)} emphasis />
                    <MetricCard label="見込み客" value={`${metrics.leads}人`} />
                    <MetricCard label="LINE登録" value={`${metrics.lineSubscribers}人`} />
                    <MetricCard label="プラットフォーム注文" value={`${metrics.platformOrders}件`} />
                    <MetricCard label="高単価成約数" value={`${economics.highTicketSales}件`} />
                    <MetricCard label="継続顧客" value={`${economics.repeatClients}人`} />
                    <MetricCard label="LTV" value={formatYen(metrics.ltv)} />
                    <MetricCard label="レビュー" value={`${metrics.reviews}件`} />
                  </div>

                  <div className="h-px w-full bg-slate-200" />

                  {mode === "beginner" ? (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      <MetricCard label="信頼度" value={`${metrics.trust}/100`} />
                      <MetricCard label="教育深度" value={`${metrics.educationDepth}/100`} />
                      <MetricCard label="月利100万との差額" value={formatYen(gap.gap)} />
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <MetricCard label="信頼度" value={`${metrics.trust}/100`} />
                      <MetricCard label="客層品質" value={`${metrics.quality}/100`} />
                      <MetricCard label="教育深度" value={`${metrics.educationDepth}/100`} />
                      <MetricCard label="離脱リスク" value={`${metrics.churnRisk}/100`} />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="xl:col-span-4">
                <CardHeader>
                  <CardTitle>月利100万までの逆算</CardTitle>
                  <CardDescription>いまの設計から、あとどれくらい必要かを見られます。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <MetricCard label="現在の想定粗利" value={formatYen(economics.netRevenue)} emphasis />
                  <MetricCard label="目標との差額" value={formatYen(gap.gap)} />
                  <MetricCard label="追加の高単価成約目安" value={`${gap.additionalSalesNeeded}件`} />
                  <MetricCard label="追加で必要な見込み客目安" value={`${gap.extraLeadsNeeded}人`} />
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                    {gap.gap <= 0
                      ? "すでに月利100万ラインを超えています。この構造を再現できるかが大事です。"
                      : `あと高単価成約 ${gap.additionalSalesNeeded}件前後、またはLTVを ${formatYen(
                          gap.ltvNeeded
                        )} 前後まで引き上げると、月利100万が現実的になります。`}
                  </div>
                </CardContent>
              </Card>
            </div>

            {analysis.warnings.length > 0 && (
              <Card className="border-0 bg-[#FFF7F2]">
                <CardHeader>
                  <CardTitle>注意ポイント</CardTitle>
                  <CardDescription>いまの設計で、あとで詰まりやすい箇所です。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.warnings.map((warning, idx) => (
                    <div key={idx} className="rounded-2xl border border-[#FFD9BF] bg-white p-4 text-sm leading-7 text-slate-700">
                      {warning}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {!finished ? (
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-2xl">{stage.title}</CardTitle>
                      <CardDescription className="mt-1 text-base">{stage.desc}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge tone="violet">週{stage.week}</Badge>
                      <Badge tone="sky">ステップ {stageIndex + 1}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <AlertBox title="ペン太のガイド" tone="sky">
                    {stage.helper}
                  </AlertBox>

                  <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {stage.options.map((option) => (
                      <button
                        key={option.label}
                        onClick={() => pick(option)}
                        className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
                      >
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <div className="text-lg font-semibold text-slate-800">{option.label}</div>
                          {option.recommended && <Badge tone="green">おすすめ</Badge>}
                          {option.platform && <Badge tone="outline">{PLATFORM_META[option.platform].label}</Badge>}
                        </div>

                        <p className="mb-4 text-sm leading-6 text-slate-600">{option.text}</p>
                        <div className="rounded-2xl bg-slate-50 p-3 text-xs leading-6 text-slate-500">{option.note}</div>
                        <div className="mt-4 text-sm font-medium text-sky-700 opacity-80 group-hover:opacity-100">
                          これを選ぶ →
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="grid w-full grid-cols-4 gap-2 rounded-2xl bg-white p-2">
                  {[
                    ["result", "結果"],
                    ["economics", "収益内訳"],
                    ["history", "選択履歴"],
                    ["lessons", "学び"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setResultTab(key)}
                      className={cn(
                        "rounded-xl px-3 py-2 text-sm font-medium transition",
                        resultTab === key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {resultTab === "result" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">今回の結果</CardTitle>
                      <CardDescription>
                        判定：<span className="font-semibold text-slate-900"> {scoreLabel(score)}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid gap-4 md:grid-cols-4">
                        <MetricCard label="月間粗利想定" value={formatYen(economics.netRevenue)} emphasis />
                        <MetricCard label="見込み客" value={`${metrics.leads}人`} />
                        <MetricCard label="継続顧客" value={`${economics.repeatClients}人`} />
                        <MetricCard label="総合スコア" value={`${score}/100`} />
                      </div>

                      <AlertBox title="総評" tone="cyan">
                        {analysis.summary}
                      </AlertBox>

                      <div className="space-y-3">
                        {analysis.points.map((p, idx) => (
                          <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                            {p}
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button onClick={reset}>もう一回やる</Button>
                        <Button variant="outline" onClick={() => applyScenario(SCENARIOS.line.picks)}>
                          おすすめルートも見る
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {resultTab === "economics" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">収益の内訳</CardTitle>
                      <CardDescription>どこで売上が立っているかを分解して見られます。</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-4">
                        <MetricCard label="プラットフォーム売上" value={formatYen(economics.platformRevenue)} />
                        <MetricCard label="高単価売上" value={formatYen(economics.directRevenue)} />
                        <MetricCard label="継続売上" value={formatYen(economics.repeatRevenue)} />
                        <MetricCard label="月間粗利" value={formatYen(economics.netRevenue)} emphasis />
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <MetricCard label="手数料" value={formatYen(economics.platformFee)} />
                        <MetricCard label="対応コスト" value={formatYen(economics.supportCost)} />
                        <MetricCard label="高単価成約数" value={`${economics.highTicketSales}件`} />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {resultTab === "history" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">選択履歴</CardTitle>
                      <CardDescription>どの選択が今の結果を作ったかを振り返れます。</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      {history.map((item, i) => (
                        <div key={`${item.stage}-${i}`} className="rounded-2xl border border-slate-200 p-4">
                          <div className="text-sm text-slate-500">{item.stage}</div>
                          <div className="mt-1 font-semibold text-slate-800">{item.label}</div>
                          <div className="mt-2 text-sm leading-6 text-slate-600">{item.text}</div>
                          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-6 text-slate-500">
                            {item.note}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {resultTab === "lessons" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">今回の学び</CardTitle>
                      <CardDescription>ここが、このツールのいちばん大事な部分です。</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.lessons.length ? (
                        analysis.lessons.map((lesson, idx) => (
                          <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                            {lesson}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                          今回は大きな特徴が出にくいルートでした。次は『入口商品』か『教育』か『次提案』だけを変えて比べてみてください。
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* weekly tab */}
        {topTab === "weekly" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">週次モード</CardTitle>
              <CardDescription>1周を1か月と見て、週ごとに何を決めているかを見やすくしました。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((week) => (
                <div key={week} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="font-semibold text-slate-800">週{week}</div>
                    <Badge tone="violet">週{week}</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-slate-700">
                    {weekSummary[week].length ? (
                      weekSummary[week].map((item, idx) => (
                        <div key={idx} className="rounded-xl bg-white p-3">
                          {item}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl bg-white p-3 text-slate-500">まだ未選択</div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* compare tab */}
        {topTab === "compare" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">3ルート比較モード</CardTitle>
              <CardDescription>ココナラ / LINE / STORES の現実的な回し方を横並びで比較できます。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 xl:grid-cols-3">
              {scenarioCards.map((card) => (
                <div key={card.key} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-2 text-lg font-semibold text-slate-800">{card.title}</div>
                  <div className="mb-4 text-sm leading-6 text-slate-600">{card.note}</div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                    <MetricCard label="粗利想定" value={formatYen(card.economics.netRevenue)} emphasis />
                    <MetricCard label="総合スコア" value={`${card.score}/100`} />
                    <MetricCard label="見込み客" value={`${card.metrics.leads}人`} />
                    <MetricCard label="継続顧客" value={`${card.economics.repeatClients}人`} />
                  </div>

                  <div className="mt-4">
                    <Button onClick={() => applyScenario(card.picks)}>このルートを再現</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* planner tab */}
       {topTab === "planner" && <SalesPlannerPanel /> }
</div>

<footer className="mx-auto max-w-7xl px-4 pb-8 text-center text-xs text-slate-500 md:px-8">
  <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
    <span>© 2026 ペン太 / AI占い副業シミュレーター. All rights reserved.</span>
    <a
      href="https://x.com/ai_uranai_lab"
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900"
    >
      最新情報はXで
    </a>
  </div>
</footer>

</div>
);
}