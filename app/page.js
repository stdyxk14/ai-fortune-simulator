"use client";

import { useMemo, useState } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatYen(value) {
  const amount = Number.isFinite(Number(value)) ? Number(value) : 0;
  return `¥${amount.toLocaleString("ja-JP")}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function calcEconomics(m) {
  const effectiveLeads = Math.max(
    0,
    (m.leads || 0) + Math.round((m.lineSubscribers || 0) * 0.6) + Math.round((m.platformOrders || 0) * 0.5)
  );
  const highTicketSales = Math.round(effectiveLeads * Math.max(0.005, m.closeRate || 0));
  const repeatClients = Math.round((highTicketSales + (m.platformOrders || 0)) * Math.max(0, m.repeatRate || 0));
  const directRevenue = Math.round(highTicketSales * Math.max(1000, m.ltv || 0));
  const repeatRevenue = Math.round(repeatClients * Math.max(3000, Math.round((m.ltv || 0) * 0.55)));
  const platformRevenue = Math.round((m.platformOrders || 0) * Math.max(500, m.frontUnitPrice || 2000));
  const grossRevenue = directRevenue + repeatRevenue + platformRevenue;
  const platformFee = Math.round(platformRevenue * Math.max(0, m.platformFeeRate || 0));
  const supportCost = Math.round((m.fatigue || 0) * 120 + (m.platformOrders || 0) * 90 + (m.lineSubscribers || 0) * 40);
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
      (m.trust || 0) * 0.22 +
        (m.platformTrust || 0) * 0.08 +
        (m.quality || 0) * 0.2 +
        (m.educationDepth || 0) * 0.18 +
        (m.closeRate || 0) * 1000 * 0.12 +
        ((m.ltv || 0) / 1000) * 3.5 +
        (eco.netRevenue || 0) / 12000 -
        (m.fatigue || 0) * 0.35 -
        (m.churnRisk || 0) * 0.45
    ),
    0,
    100
  );
}

function calcGapToOneMillion(metrics, eco) {
  const target = 1000000;
  const gap = Math.max(0, target - (eco.netRevenue || 0));
  return { target, gap };
}

function Card({ className = "", children }) {
  return <div className={cn("rounded-[24px] border border-slate-200 bg-white shadow-sm", className)}>{children}</div>;
}
function CardHeader({ className = "", children }) {
  return <div className={cn("p-5 pb-0", className)}>{children}</div>;
}
function CardTitle({ className = "", children }) {
  return <h2 className={cn("text-lg font-semibold text-slate-900", className)}>{children}</h2>;
}
function CardDescription({ className = "", children }) {
  return <p className={cn("mt-1 text-sm leading-6 text-slate-500", className)}>{children}</p>;
}
function CardContent({ className = "", children }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}
function Button({ className = "", variant = "default", children, ...props }) {
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
function Badge({ className = "", children, tone = "light" }) {
  const tones = {
    light: "border border-slate-200 bg-white text-slate-700",
    sky: "bg-sky-100 text-sky-700",
    green: "bg-emerald-100 text-emerald-700",
    dark: "bg-slate-900 text-white",
    amber: "bg-amber-100 text-amber-700",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)}>{children}</span>;
}
function ProgressBar({ value }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-sky-400 transition-all" style={{ width: `${safe}%` }} />
    </div>
  );
}
function MetricPill({ label, value, emphasis = false }) {
  return (
    <div className={cn("rounded-2xl border px-3 py-2", emphasis ? "border-sky-200 bg-sky-50" : "border-slate-200 bg-white")}>
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
function SoftBox({ title, text }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="font-semibold text-slate-800">{title}</div>
      <div className="mt-1 text-sm leading-6 text-slate-600">{text}</div>
    </div>
  );
}
function NumberField({ label, value, onChange, step = "1" }) {
  return (
    <label className="space-y-2">
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value || 0))}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-300"
      />
    </label>
  );
}

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

const START_STATE = {
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
  repeatRate: 0.1,
};

const PLATFORM_META = {
  line: { label: "LINE直販", feeRate: 0.03 },
  coconala: { label: "ココナラ", feeRate: 0.22 },
  stores: { label: "STORES / BASE", feeRate: 0.08 },
  mercari: { label: "メルカリ", feeRate: 0.1 },
};

const STAGES = [
  {
    key: "market",
    title: "① 狙う市場を決める",
    helper: "どの悩み市場から入るかを決めます。迷ったら『恋愛（行動判断特化）』がおすすめ。",
    options: [
      { label: "恋愛（広め）", text: "広く反応は取れるが、埋もれやすい。", impact: { impressions: 3000, profileVisits: 130, leads: 16, quality: 2, ltv: 1200, trust: 2, fatigue: 1, churnRisk: 2 } },
      { label: "恋愛（行動判断特化）", text: "『そのLINE送る？』『今会う？』など判断支援に寄せる。", impact: { impressions: 2600, profileVisits: 160, leads: 22, quality: 8, ltv: 2600, trust: 7, fatigue: 1, churnRisk: -3 }, recommended: true },
      { label: "復縁（深い悩み）", text: "単価と継続は強いが、重く見られやすい。", impact: { impressions: 2200, profileVisits: 150, leads: 18, quality: 10, ltv: 3400, trust: 4, fatigue: 3, churnRisk: -2 } },
      { label: "不倫・複雑愛", text: "売上は立ちやすいが、扱う難易度は高い。", impact: { impressions: 2100, profileVisits: 165, leads: 20, quality: 12, ltv: 4200, trust: 1, fatigue: 6, churnRisk: 2 } },
    ],
  },
  {
    key: "positioning",
    title: "② 見せ方の切り口を決める",
    helper: "同じ市場でも、どう見せるかで埋もれやすさが変わります。",
    options: [
      { label: "テーマ名で入る", text: "『恋愛占い』『復縁相談』のように広く入る。", impact: { impressions: 600, profileVisits: 20, leads: 2, quality: -4, trust: -1, churnRisk: 3 } },
      { label: "判断シーンで切る", text: "『そのLINE送る？』『会うべき？』で切る。", impact: { impressions: 1400, profileVisits: 75, leads: 8, quality: 6, trust: 5, ltv: 1200, churnRisk: -2 }, recommended: true },
      { label: "感情の詰まりで切る", text: "『既読スルーで止まる』など感情の詰まりで切る。", impact: { impressions: 1200, profileVisits: 90, leads: 10, quality: 8, trust: 6, ltv: 1800, fatigue: 2, churnRisk: -2 } },
      { label: "入口を軽くして後ろで深くする", text: "表では軽い名前で入り、後ろで深い悩みに接続。", impact: { impressions: 1700, profileVisits: 110, leads: 12, quality: 7, trust: 7, ltv: 2000, churnRisk: -3 }, recommended: true },
    ],
  },
  {
    key: "channel",
    title: "③ 集客チャネルを決める",
    helper: "X と Threads をどう使うか決めます。迷ったら『X×Threads併用』。",
    options: [
      { label: "X集中", text: "フックが刺さると強いが、波も大きい。", impact: { impressions: 4200, profileVisits: 170, leads: 8, quality: 1, trust: 1, fatigue: 2 } },
      { label: "Threads集中", text: "文脈で読まれやすく、柔らかい入口向き。", impact: { impressions: 2900, profileVisits: 150, leads: 12, quality: 4, trust: 3, fatigue: 1 } },
      { label: "X×Threads併用", text: "Xで止めて、Threadsで深く読ませる。", impact: { impressions: 5200, profileVisits: 260, leads: 18, quality: 8, trust: 6, fatigue: 4 }, recommended: true },
    ],
  },
  {
    key: "front_model",
    title: "④ フロントの取り方を決める",
    helper: "無料から取るか、最初から低単価で取るかを決めます。",
    options: [
      { label: "無料フロント→LINE育成", text: "無料相談や無料企画で集めて、LINEで育てる。", impact: { leads: 22, lineSubscribers: 28, educationDepth: 8, trust: 6, fatigue: 2, churnRisk: -2 }, recommended: true },
      { label: "低単価商品→販売プラットフォーム起点", text: "最初からお金を払う客を取る。", impact: { leads: 8, platformOrders: 7, platformTrust: 12, quality: 8, trust: 3, fatigue: 1, churnRisk: -1 } },
      { label: "無料フロント＋低単価商品併用", text: "無料と有料の入口を両方持つ。", impact: { leads: 18, lineSubscribers: 16, platformOrders: 5, platformTrust: 10, quality: 7, educationDepth: 6, trust: 7, fatigue: 5, churnRisk: -2 } },
    ],
  },
  {
    key: "sales_platform",
    title: "⑤ 低単価をどこで売るか決める",
    helper: "ココナラ・STORES・LINE直販など、販売の母艦を決めます。",
    options: [
      { label: "LINE直販", platform: "line", text: "X / Threads から LINE に流してそのまま売る。", impact: { lineSubscribers: 16, educationDepth: 12, closeRate: 0.02, ltv: 2200, trust: 6, fatigue: 2, churnRisk: -3 }, recommended: true },
      { label: "ココナラ低単価フロント", platform: "coconala", text: "相談文化とレビュー資産で低単価商品を売る。", impact: { platformOrders: 10, platformTrust: 20, reviews: 8, quality: 4, closeRate: 0.01, ltv: 1200, trust: 5, fatigue: 1, churnRisk: -1 }, recommended: true },
      { label: "STORES / BASEフロント", platform: "stores", text: "自分の棚を持ち、世界観で売る。", impact: { platformOrders: 7, platformTrust: 10, reviews: 3, closeRate: 0.015, ltv: 2200, trust: 4, fatigue: 1, churnRisk: -1 } },
      { label: "メルカリ低単価導入", platform: "mercari", text: "入口は広いが、価格感覚が崩れやすい。", impact: { platformOrders: 12, platformTrust: 3, reviews: 4, quality: -4, closeRate: -0.002, ltv: -1500, trust: -2, fatigue: 2, churnRisk: 5 } },
    ],
  },
  {
    key: "front_product",
    title: "⑥ 入口商品の中身を決める",
    helper: "⑤で選んだ母艦に置く最初の商品、または無料入口の中身を決めます。",
    options: [
      { label: "無料『そのLINE送る？』相談", text: "無料フロント向け。行動判断で温度感の高い客を取る。", impact: { impressions: 1500, profileVisits: 115, leads: 16, lineSubscribers: 10, quality: 8, trust: 8, fatigue: 2, churnRisk: -3 }, recommended: true },
      { label: "無料『決めるの代行屋』", text: "無料フロント向け。占い感を薄めて入口を広げる。", impact: { impressions: 2200, profileVisits: 140, leads: 18, lineSubscribers: 8, quality: 4, trust: 6, fatigue: 1, churnRisk: -1 }, recommended: true },
      { label: "低単価『彼の気持ち診断』", text: "販売プラットフォーム向け。王道だが後ろの階段が必要。", impact: { platformOrders: 8, quality: 3, closeRate: 0.01, ltv: 900, trust: 2, fatigue: 1, churnRisk: 2 } },
      { label: "低単価『相手の温度感チェック』", text: "販売プラットフォーム向け。行動判断寄りで次につなげやすい。", impact: { platformOrders: 7, quality: 8, closeRate: 0.018, ltv: 1700, trust: 5, fatigue: 1, churnRisk: -2 } },
      { label: "低単価『今動くべきか判断』", text: "販売プラットフォーム向け。次の商品提案までつなぎやすい。", impact: { platformOrders: 7, quality: 9, closeRate: 0.02, ltv: 1900, trust: 6, fatigue: 1, churnRisk: -2 } },
    ],
  },
  {
    key: "content",
    title: "⑦ 集客投稿の型を決める",
    helper: "どんな投稿の入口で見込み客を止めるか決めます。",
    options: [
      { label: "有益だけど重い構造論", text: "深いが、初見には少し重い。", impact: { impressions: 1200, profileVisits: 45, leads: 4, trust: 3, fatigue: 0, churnRisk: 1 } },
      { label: "欲望フック→構造回収", text: "最初に止めて、後半でちゃんと構造に落とす。", impact: { impressions: 3000, profileVisits: 155, leads: 18, quality: 4, trust: 5, fatigue: 1, churnRisk: -1 }, recommended: true },
      { label: "残酷→救済", text: "痛いところを刺してから、構造で救う。", impact: { impressions: 3100, profileVisits: 180, leads: 20, quality: 6, trust: 7, fatigue: 1, churnRisk: -2 }, recommended: true },
      { label: "誇大気味の煽り", text: "伸びることはあるが、信頼が削れやすい。", impact: { impressions: 3600, profileVisits: 170, leads: 14, trust: -10, fatigue: 0, churnRisk: 8 } },
    ],
  },
  {
    key: "education",
    title: "⑧ LINE/ステップ導線の育成を決める",
    helper: "LINE登録後や初回購入後に、どう育成するか決めます。",
    options: [
      { label: "教育なし・すぐ売る", text: "すぐ売るが、高単価や継続に弱い。", impact: { educationDepth: -8, closeRate: 0.004, ltv: -1800, trust: -4, churnRisk: 5 } },
      { label: "3〜5通で迷いを言語化する", text: "悩み・判断・次の論点を整理してから売る。", impact: { educationDepth: 14, lineSubscribers: 8, closeRate: 0.02, ltv: 2800, trust: 8, churnRisk: -4 }, recommended: true },
      { label: "無料で全部教える", text: "感謝はされるが、次に売る余地が薄くなる。", impact: { educationDepth: 4, closeRate: -0.012, ltv: -1600, trust: 3, fatigue: 6, churnRisk: 4 } },
    ],
  },
  {
    key: "reply",
    title: "⑨ 無料相談・初回購入後の返し方を決める",
    helper: "最初の接点の返し方で、単発か積み上がるかが分かれます。",
    options: [
      { label: "全部答える", text: "満足度は高いが、次提案の余地がなくなる。", impact: { closeRate: -0.01, ltv: -1400, trust: 4, fatigue: 8, churnRisk: 6 } },
      { label: "結論だけ返して次の論点を残す", text: "信頼を取りつつ、次提案にもつなげる。", impact: { profileVisits: 20, leads: 10, lineSubscribers: 10, closeRate: 0.03, ltv: 2600, trust: 8, fatigue: 1, churnRisk: -4 }, recommended: true },
      { label: "テンプレ感の強い返答", text: "時短はできるが、価格を上げづらい。", impact: { quality: -4, closeRate: -0.008, ltv: -1200, trust: -5, fatigue: -1, churnRisk: 3 } },
    ],
  },
  {
    key: "offer",
    title: "⑩ 次提案の流れを決める",
    helper: "クロスセル/継続/深掘りをどう流すか決めます。",
    options: [
      { label: "単発で終える", text: "その場の売上は取れるが、LTVが伸びない。", impact: { closeRate: 0.012, ltv: -2200, trust: 1, fatigue: 0, churnRisk: 4 } },
      { label: "深掘り鑑定→継続相談へ流す", text: "まず深掘り提案、その後に継続へ接続。", impact: { leads: 8, closeRate: 0.02, ltv: 3200, repeatRate: 0.08, trust: 5, fatigue: 2, churnRisk: -4 }, recommended: true },
      { label: "別テーマ提案まで階段で流す", text: "深掘り→継続→別テーマ提案まで段階で流す。", impact: { leads: 8, closeRate: 0.025, ltv: 4200, repeatRate: 0.1, trust: 6, fatigue: 2, churnRisk: -5 }, recommended: true },
      { label: "いきなり高額だけ売る", text: "刺さる人はいるが、多くを取りこぼしやすい。", impact: { closeRate: 0.008, ltv: 1800, trust: -4, fatigue: 1, churnRisk: 3 } },
    ],
  },
  {
    key: "crm",
    title: "⑪ リストの分け方を決める",
    helper: "顧客管理というより、見込み客をどうクラスター分けするか決めます。",
    options: [
      { label: "一括配信・一括対応", text: "運用は楽だが、刺さり方を捨てる。", impact: { leads: -2, closeRate: -0.01, ltv: -1400, trust: -2, fatigue: -2, churnRisk: 4 } },
      { label: "悩み別に分ける", text: "恋愛/復縁/複雑愛など、悩み別で分ける。", impact: { leads: 6, closeRate: 0.012, ltv: 1600, trust: 4, fatigue: 1, churnRisk: -2 }, recommended: true },
      { label: "温度感別に分ける", text: "今すぐ客/比較客/情報収集中で分ける。", impact: { leads: 6, closeRate: 0.014, ltv: 1800, trust: 4, fatigue: 1, churnRisk: -2 }, recommended: true },
      { label: "悩み別×温度感別に分ける", text: "悩みと温度感の両方でクラスター分けする。", impact: { leads: 8, closeRate: 0.02, ltv: 2600, trust: 6, fatigue: 2, churnRisk: -4 }, recommended: true },
    ],
  },
];

const SCENARIOS = {
  coconala: {
    title: "ココナラ実績づくりルート",
    picks: [
      "恋愛（行動判断特化）",
      "判断シーンで切る",
      "X×Threads併用",
      "低単価商品→販売プラットフォーム起点",
      "ココナラ低単価フロント",
      "低単価『相手の温度感チェック』",
      "残酷→救済",
      "3〜5通で迷いを言語化する",
      "結論だけ返して次の論点を残す",
      "別テーマ提案まで階段で流す",
      "悩み別×温度感別に分ける",
    ],
  },
  line: {
    title: "LINE直販ルート",
    picks: [
      "恋愛（行動判断特化）",
      "入口を軽くして後ろで深くする",
      "X×Threads併用",
      "無料フロント→LINE育成",
      "LINE直販",
      "無料『そのLINE送る？』相談",
      "欲望フック→構造回収",
      "3〜5通で迷いを言語化する",
      "結論だけ返して次の論点を残す",
      "別テーマ提案まで階段で流す",
      "悩み別×温度感別に分ける",
    ],
  },
  stores: {
    title: "STORES / BASEルート",
    picks: [
      "恋愛（行動判断特化）",
      "入口を軽くして後ろで深くする",
      "X×Threads併用",
      "無料フロント＋低単価商品併用",
      "STORES / BASEフロント",
      "低単価『今動くべきか判断』",
      "欲望フック→構造回収",
      "3〜5通で迷いを言語化する",
      "結論だけ返して次の論点を残す",
      "深掘り鑑定→継続相談へ流す",
      "悩み別×温度感別に分ける",
    ],
  },
};

function calcScenarioFromLabels(labels) {
  let current = { ...START_STATE };
  const pickedHistory = [];
  STAGES.forEach((stage) => {
    const option = stage.options.find((o) => labels.includes(o.label)) || stage.options.find((o) => o.recommended) || stage.options[0];
    current = applyImpact(current, option);
    pickedHistory.push({ stage: stage.title, label: option.label, text: option.text });
  });
  const economics = calcEconomics(current);
  const score = calcScore(current, economics);
  return { metrics: current, economics, score, history: pickedHistory };
}

function applyImpact(prev, option) {
  const next = {
    ...prev,
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
    ltv: Math.max(800, prev.ltv + (option.impact.ltv || 0)),
    trust: clamp(prev.trust + (option.impact.trust || 0), 0, 100),
    fatigue: clamp(prev.fatigue + (option.impact.fatigue || 0), 0, 100),
    churnRisk: clamp(prev.churnRisk + (option.impact.churnRisk || 0), 0, 100),
    frontUnitPrice: prev.frontUnitPrice,
    platformFeeRate: prev.platformFeeRate,
  };

  if (option.platform) next.platformFeeRate = PLATFORM_META[option.platform].feeRate;
  if (option.label === "LINE直販") next.frontUnitPrice = 0;
  if (option.label === "ココナラ低単価フロント") next.frontUnitPrice = 2000;
  if (option.label === "STORES / BASEフロント") next.frontUnitPrice = 2500;
  if (option.label === "メルカリ低単価導入") next.frontUnitPrice = 1200;
  if (option.label === "低単価『彼の気持ち診断』") next.frontUnitPrice = Math.max(next.frontUnitPrice, 2000);
  if (option.label === "低単価『相手の温度感チェック』") next.frontUnitPrice = Math.max(next.frontUnitPrice, 2500);
  if (option.label === "低単価『今動くべきか判断』") next.frontUnitPrice = Math.max(next.frontUnitPrice, 2500);

  return next;
}

function buildResult(history, metrics, eco, score) {
  const labels = history.map((h) => h.label);
  const strengths = [];
  const cautions = [];

  if (labels.includes("恋愛（行動判断特化）")) strengths.push("市場を行動判断に寄せられていて、入口の質が高いです。");
  if (labels.includes("判断シーンで切る")) strengths.push("差別化が明確で、埋もれにくい設計です。");
  if (labels.includes("無料フロント→LINE育成")) strengths.push("無料で広く拾って、後ろで育てる流れを作れています。");
  if (labels.includes("ココナラ低単価フロント")) strengths.push("レビュー資産を取りに行けるので、初期の実績形成に向いています。");
  if (labels.includes("3〜5通で迷いを言語化する")) strengths.push("LINEやステップ導線の育成が深く、高単価や継続につながりやすいです。");
  if (labels.includes("別テーマ提案まで階段で流す")) strengths.push("次提案の階段が作れていて、LTVを伸ばしやすいです。");

  if (labels.includes("全部答える")) cautions.push("無料や初回で価値を出し切りやすく、有料化の余地が薄くなります。");
  if (labels.includes("単発で終える")) cautions.push("単発で終わりやすく、LTVが伸びにくいです。");
  if (labels.includes("誇大気味の煽り")) cautions.push("短期の反応は取れても、信頼を削りやすいです。");
  if (labels.includes("メルカリ低単価導入")) cautions.push("価格感覚が崩れやすく、後ろの導線が弱くなりやすいです。");
  if (labels.includes("一括配信・一括対応")) cautions.push("せっかく集めた見込み客に合わせた提案がしにくくなります。");

  let typeLabel = "積み上げ改善型";
  if (score >= 88) typeLabel = "かなり強い積み上げ型";
  else if (score >= 72) typeLabel = "伸びる構造が見えている型";
  else if (score < 40) typeLabel = "遠回りしやすい初期型";

  return { typeLabel, strengths, cautions };
}

function scoreLabel(score) {
  if (score >= 88) return "月利100万がかなり見える";
  if (score >= 72) return "かなり強い";
  if (score >= 55) return "伸び筋あり";
  if (score >= 40) return "改善余地あり";
  return "まだ遠回り気味";
}

function PlannerPanel() {
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
    return { frontRevenue, fee, highTicketSales, highTicketRevenue, repeatRevenue, net };
  }, [inputs]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>売上管理パネル</CardTitle>
        <CardDescription>実数を入れて、月利100万との差を確認できます。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <NumberField label="フロント注文数" value={inputs.frontOrders} onChange={(v) => setInputs((p) => ({ ...p, frontOrders: v }))} />
          <NumberField label="フロント単価" value={inputs.frontPrice} onChange={(v) => setInputs((p) => ({ ...p, frontPrice: v }))} />
          <NumberField label="手数料率" value={inputs.platformFeeRate} step="0.01" onChange={(v) => setInputs((p) => ({ ...p, platformFeeRate: v }))} />
          <NumberField label="LINE登録数" value={inputs.lineCount} onChange={(v) => setInputs((p) => ({ ...p, lineCount: v }))} />
          <NumberField label="高単価CVR" value={inputs.closeRate} step="0.01" onChange={(v) => setInputs((p) => ({ ...p, closeRate: v }))} />
          <NumberField label="高単価単価" value={inputs.highTicketPrice} onChange={(v) => setInputs((p) => ({ ...p, highTicketPrice: v }))} />
          <NumberField label="継続人数" value={inputs.repeatClients} onChange={(v) => setInputs((p) => ({ ...p, repeatClients: v }))} />
          <NumberField label="継続単価" value={inputs.repeatPrice} onChange={(v) => setInputs((p) => ({ ...p, repeatPrice: v }))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MetricPill label="フロント売上" value={formatYen(numbers.frontRevenue)} />
          <MetricPill label="高単価成約数" value={`${numbers.highTicketSales}件`} />
          <MetricPill label="高単価売上" value={formatYen(numbers.highTicketRevenue)} />
          <MetricPill label="継続売上" value={formatYen(numbers.repeatRevenue)} />
          <MetricPill label="手数料" value={formatYen(numbers.fee)} />
          <MetricPill label="月間粗利" value={formatYen(numbers.net)} emphasis />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [metrics, setMetrics] = useState(START_STATE);
  const [history, setHistory] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);

  const finished = step >= STAGES.length;
  const stage = STAGES[Math.min(step, STAGES.length - 1)];
  const economics = useMemo(() => calcEconomics(metrics), [metrics]);
  const score = useMemo(() => calcScore(metrics, economics), [metrics, economics]);
  const gap = useMemo(() => calcGapToOneMillion(metrics, economics), [metrics, economics]);
  const result = useMemo(() => buildResult(history, metrics, economics, score), [history, metrics, economics, score]);
  const scenarios = useMemo(
    () => Object.entries(SCENARIOS).map(([key, sc]) => ({ key, ...sc, ...calcScenarioFromLabels(sc.picks) })),
    []
  );

  const chooseOption = (option) => {
    const nextMetrics = applyImpact(metrics, option);
    setMetrics(nextMetrics);
    setHistory((prev) => [...prev, { stage: stage.title, label: option.label, text: option.text }]);
    setStep((prev) => prev + 1);
  };

  const applyScenario = (labels) => {
    const resultScenario = calcScenarioFromLabels(labels);
    setMetrics(resultScenario.metrics);
    setHistory(resultScenario.history);
    setStep(STAGES.length);
    setStarted(true);
  };

  const goBack = () => {
    if (step <= 0) return;
    const newHistory = history.slice(0, -1);
    let rebuilt = { ...START_STATE };
    newHistory.forEach((item) => {
      const s = STAGES.find((x) => x.title === item.stage);
      const option = s?.options.find((o) => o.label === item.label);
      if (option) rebuilt = applyImpact(rebuilt, option);
    });
    setHistory(newHistory);
    setMetrics(rebuilt);
    setStep((prev) => prev - 1);
  };

  const restart = () => {
    setStarted(false);
    setStep(0);
    setMetrics(START_STATE);
    setHistory([]);
    setShowDetails(false);
    setShowCompare(false);
    setShowPlanner(false);
  };

  const progress = (step / STAGES.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6FBFF] via-white to-[#F5F7FA] pb-28">
      <div className="mx-auto max-w-md px-4 py-4 sm:max-w-lg">
        {!started ? (
          <div className="space-y-4">
            <Card className="border-0 bg-gradient-to-b from-[#DFF4FF] to-[#F3FBFF]">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                  <PenguinAvatar size={72} />
                </div>
                <div className="mb-2 flex justify-center gap-2">
                  <Badge tone="light">スマホ向け</Badge>
                  <Badge tone="light">1問ずつ進む</Badge>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI占い副業<br />シミュレーター</h1>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  売れる構造を選びながら体感する訓練ツールです。0→1だけでなく、月利100万までの距離を 週単位・比較・実数入力 で見られるようにしています。
                </p>
                <div className="mt-5">
                  <Button className="w-full" onClick={() => setStarted(true)}>はじめる</Button>
                </div>
              </CardContent>
            </Card>

            <SoftBox title="STEP 1" text="①〜⑪を1問ずつ選びます。迷ったら『おすすめ』で進めてOKです。" />
            <SoftBox title="STEP 2" text="選ぶたびに、下の固定バーで『月間粗利予想』『見込み客』『LTV』の感覚を掴みます。" />
            <SoftBox title="STEP 3" text="最後に、結果・3ルート比較・売上管理パネルまで見られます。" />

            <footer className="pb-6 pt-2 text-center text-xs text-slate-500">
              <div className="flex flex-col items-center justify-center gap-2">
                <span>© 2026 ペン太 / AI占い副業シミュレーター. All rights reserved.</span>
                <a href="https://x.com/ai_uranai_lab" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900">
                  最新情報はXで
                </a>
              </div>
            </footer>
          </div>
        ) : !finished ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <Badge tone="sky">{step + 1} / {STAGES.length}</Badge>
                  <span className="text-xs text-slate-500">{Math.round(progress)}%</span>
                </div>
                <div className="mt-3"><ProgressBar value={progress} /></div>
                <CardTitle className="mt-4 text-2xl">{stage.title}</CardTitle>
                <CardDescription>{stage.helper}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {stage.options.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => chooseOption(option)}
                    className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-sky-300 hover:bg-sky-50"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <div className="font-semibold text-slate-900">{option.label}</div>
                      {option.recommended && <Badge tone="green">おすすめ</Badge>}
                      {option.platform && <Badge tone="light">{PLATFORM_META[option.platform].label}</Badge>}
                    </div>
                    <div className="text-sm leading-6 text-slate-600">{option.text}</div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={goBack} disabled={step === 0}>戻る</Button>
              <Button variant="ghost" className="flex-1" onClick={restart}>最初から</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="border-0 bg-gradient-to-b from-[#DFF4FF] to-[#F3FBFF]">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                  <PenguinAvatar size={60} />
                </div>
                <Badge tone="sky">診断結果</Badge>
                <h1 className="mt-3 text-2xl font-bold text-slate-900">{result.typeLabel}</h1>
                <p className="mt-2 text-sm leading-7 text-slate-700">{scoreLabel(score)}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <MetricPill label="月間粗利予想" value={formatYen(economics.netRevenue)} emphasis />
              <MetricPill label="月利100万との差" value={formatYen(gap.gap)} />
              <MetricPill label="見込み客" value={`${metrics.leads}人`} />
              <MetricPill label="LTV" value={formatYen(metrics.ltv)} />
            </div>

            <SoftBox title="今回の強み" text={result.strengths[0] || "大きな破綻はありません。入口から継続まで一度最後まで組めています。"} />
            <SoftBox title="いちばんの改善ポイント" text={result.cautions[0] || "次は教育かリストの分け方をさらに丁寧にすると、積み上がりやすくなります。"} />

            <div className="grid grid-cols-3 gap-2">
              <Button className="w-full" onClick={() => setShowDetails((prev) => !prev)}>{showDetails ? "詳細を閉じる" : "詳細"}</Button>
              <Button variant="outline" className="w-full" onClick={() => setShowCompare((prev) => !prev)}>{showCompare ? "比較を閉じる" : "3ルート比較"}</Button>
              <Button variant="outline" className="w-full" onClick={() => setShowPlanner((prev) => !prev)}>{showPlanner ? "管理を閉じる" : "売上管理"}</Button>
            </div>

            {showDetails && (
              <div className="space-y-4">
                <Card>
                  <CardHeader><CardTitle>良かった点</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {(result.strengths.length ? result.strengths : ["今回は大きな特徴が出にくいルートでした。"]).map((item, idx) => (
                      <div key={idx} className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{item}</div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>改善ポイント</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {(result.cautions.length ? result.cautions : ["大きな注意点は少ないです。次は別ルートと比較すると学びが増えます。"]).map((item, idx) => (
                      <div key={idx} className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{item}</div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>選択履歴</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {history.map((item, idx) => (
                      <div key={idx} className="rounded-2xl border border-slate-200 p-4">
                        <div className="text-xs text-slate-500">{item.stage}</div>
                        <div className="mt-1 font-semibold text-slate-900">{item.label}</div>
                        <div className="mt-1 text-sm leading-6 text-slate-600">{item.text}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {showCompare && (
              <Card>
                <CardHeader>
                  <CardTitle>3ルート比較</CardTitle>
                  <CardDescription>ココナラ / LINE / STORES の現実ルートを比較できます。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {scenarios.map((item) => (
                    <div key={item.key} className="rounded-2xl border border-slate-200 p-4">
                      <div className="mb-2 font-semibold text-slate-900">{item.title}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <MetricPill label="粗利" value={formatYen(item.economics.netRevenue)} emphasis />
                        <MetricPill label="LTV" value={formatYen(item.metrics.ltv)} />
                        <MetricPill label="見込み客" value={`${item.metrics.leads}人`} />
                        <MetricPill label="スコア" value={`${item.score}`} />
                      </div>
                      <div className="mt-3">
                        <Button variant="outline" className="w-full" onClick={() => applyScenario(item.picks)}>このルートで再計算</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {showPlanner && <PlannerPanel />}

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={restart}>もう一回やる</Button>
              <Button onClick={() => { setStarted(false); setStep(0); setMetrics(START_STATE); setHistory([]); setShowDetails(false); setShowCompare(false); setShowPlanner(false); }}>
                トップへ戻る
              </Button>
            </div>

            <footer className="pb-2 pt-2 text-center text-xs text-slate-500">
              <div className="flex flex-col items-center justify-center gap-2">
                <span>© 2026 ペン太 / AI占い副業シミュレーター. All rights reserved.</span>
                <a href="https://x.com/ai_uranai_lab" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900">
                  最新情報はXで
                </a>
              </div>
            </footer>
          </div>
        )}
      </div>

      {started && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur">
          <div className="mx-auto grid max-w-md grid-cols-4 gap-2 sm:max-w-lg">
            <MetricPill label="粗利予想" value={formatYen(economics.netRevenue)} emphasis />
            <MetricPill label="見込み客" value={`${metrics.leads}人`} />
            <MetricPill label="LTV" value={formatYen(metrics.ltv)} />
            <MetricPill label="スコア" value={`${score}`} />
          </div>
        </div>
      )}
    </div>
  );
}
