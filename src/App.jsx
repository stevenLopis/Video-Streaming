import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   DESIGN TOKENS — DEEP SPACE / AURORA PALETTE
   ───────────────────────────────────────────── */
const F_DISPLAY = "'Cormorant Garamond', 'Playfair Display', 'Didot', serif";
const F_BODY    = "'Sora', 'DM Sans', system-ui, sans-serif";
const F_MONO    = "'JetBrains Mono', 'Fira Code', monospace";
const F_ACCENT  = "'Orbitron', 'Exo 2', sans-serif";

const DARK_THEME = {
  void:          "#00010a",
  abyss:         "#010212",
  deep:          "#030518",
  surface:       "#060a1e",
  card:          "#080d22",
  overlay:       "rgba(0,1,10,0.96)",
  border:        "rgba(255,255,255,0.055)",
  borderGlow:    "rgba(0,210,210,0.38)",
  cyanPale:      "#b2f5f5",
  cyanBright:    "#00e5e5",
  cyan:          "#00c8c8",
  cyanMid:       "#00a0a0",
  cyanDeep:      "#007a7a",
  cyanDust:      "rgba(0,210,210,0.08)",
  violetPale:    "#ddd6fe",
  violetBright:  "#a78bfa",
  violet:        "#7c3aed",
  violetMid:     "#6d28d9",
  violetDeep:    "#4c1d95",
  violetDust:    "rgba(124,58,237,0.09)",
  electric:      "#3b82f6",
  electricGlow:  "rgba(59,130,246,0.4)",
  electricPale:  "#93c5fd",
  emerald:       "#10b981",
  emeraldGlow:   "rgba(16,185,129,0.3)",
  textPrimary:   "#f0f4ff",
  textSecond:    "#a8b8d8",
  textMuted:     "#5a7090",
  textFaint:     "#1e2d4a",
  glowA:         "rgba(0,228,228,0.5)",
  glowB:         "rgba(124,58,237,0.45)",
  glowC:         "rgba(59,130,246,0.35)",
};

const LIGHT_THEME = {
  void:          "#f8fafc",
  abyss:         "#f1f5f9",
  deep:          "#e2e8f0",
  surface:       "#cbd5e1",
  card:          "#ffffff",
  overlay:       "rgba(255,255,255,0.96)",
  border:        "rgba(0,0,0,0.08)",
  borderGlow:    "rgba(0,160,160,0.25)",
  cyanPale:      "#0e7490",
  cyanBright:    "#06b6d4",
  cyan:          "#0891b2",
  cyanMid:       "#0284c7",
  cyanDeep:      "#0369a1",
  cyanDust:      "rgba(6,182,212,0.1)",
  violetPale:    "#7c3aed",
  violetBright:  "#8b5cf6",
  violet:        "#7c3aed",
  violetMid:     "#6d28d9",
  violetDeep:    "#5b21b6",
  violetDust:    "rgba(124,58,237,0.1)",
  electric:      "#2563eb",
  electricGlow:  "rgba(37,99,235,0.3)",
  electricPale:  "#3b82f6",
  emerald:       "#10b981",
  emeraldGlow:   "rgba(16,185,129,0.25)",
  textPrimary:   "#0f172a",
  textSecond:    "#475569",
  textMuted:     "#64748b",
  textFaint:     "#cbd5e1",
  glowA:         "rgba(6,182,212,0.4)",
  glowB:         "rgba(139,92,246,0.35)",
  glowC:         "rgba(37,99,235,0.3)",
};

let C = DARK_THEME;

function applyTheme(isDark) {
  C = isDark ? DARK_THEME : LIGHT_THEME;
  const root = document.documentElement;
  Object.entries(C).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  document.body.style.background = C.void;
  document.body.style.color = C.textPrimary;
}

const injectFonts = () => {
  if (document.getElementById("sf-fonts")) return;
  const l = document.createElement("link");
  l.id = "sf-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Exo+2:wght@300;400;700;900&display=swap";
  document.head.appendChild(l);
};

const GLOBAL_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
html { scroll-behavior: smooth; overscroll-behavior: none; }
body { background: #00010a; color: #f0f4ff; font-family: 'Sora', system-ui, sans-serif; overflow-x: hidden; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: #010212; }
::-webkit-scrollbar-thumb { background: linear-gradient(#00c8c8, #7c3aed); border-radius: 4px; }
::selection { background: rgba(0,200,200,0.22); color: #00e5e5; }

@keyframes shimmerText {
  0%   { background-position: -400% center; }
  100% { background-position:  400% center; }
}
@keyframes breathe {
  0%,100% { transform: scale(1); opacity:0.55; }
  50%      { transform: scale(1.1); opacity:1; }
}
@keyframes float1 {
  0%,100% { transform: translateY(0px) rotate(0deg); }
  33%      { transform: translateY(-12px) rotate(-0.6deg); }
  66%      { transform: translateY(-6px) rotate(0.4deg); }
}
@keyframes float2 {
  0%,100% { transform: translateY(0px) rotate(0deg); }
  40%      { transform: translateY(-9px) rotate(0.5deg); }
  75%      { transform: translateY(-14px) rotate(-0.3deg); }
}
@keyframes float3 {
  0%,100% { transform: translateY(0px) rotate(0deg); }
  25%      { transform: translateY(-7px) rotate(0.8deg); }
  60%      { transform: translateY(-11px) rotate(-0.5deg); }
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes spinR { to { transform: rotate(-360deg); } }
@keyframes fadeSlideUp {
  from { opacity:0; transform: translateY(18px); }
  to   { opacity:1; transform: translateY(0); }
}
@keyframes fadeSlideDown {
  from { opacity:0; transform: translateY(-12px); }
  to   { opacity:1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity:0; transform: scale(0.88); }
  to   { opacity:1; transform: scale(1); }
}
@keyframes flashIcon {
  0%   { opacity:1; transform:translate(-50%,-50%) scale(0.5); }
  40%  { opacity:1; transform:translate(-50%,-50%) scale(1.2); }
  100% { opacity:0; transform:translate(-50%,-50%) scale(1.6); }
}
@keyframes orbitRing {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes counterOrbit {
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
}
@keyframes gradientFlow {
  0%,100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}
@keyframes navLinkIn {
  from { opacity:0; transform: translateY(-8px); }
  to   { opacity:1; transform: translateY(0); }
}
@keyframes glowFlare {
  0%,100% { opacity:0.4; transform: scale(1); }
  50%      { opacity:1; transform: scale(1.18); }
}
@keyframes shimmerBar {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
@keyframes navbarDrop {
  from { opacity:0; transform: translateY(-100%); }
  to   { opacity:1; transform: translateY(0); }
}
@keyframes logoWordReveal {
  0%   { opacity:0; letter-spacing: 0.5em; filter: blur(6px); }
  100% { opacity:1; letter-spacing: 0.08em; filter: blur(0); }
}

/* ── PREMIUM INTRO ANIMATIONS ── */
@keyframes introFadeOut {
  from { opacity:1; pointer-events:all; }
  to   { opacity:0; pointer-events:none; }
}
@keyframes introRevealLine {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes introLetterAssemble {
  0%   { opacity:0; transform: translateY(40px) skewX(-8deg); filter: blur(14px); }
  60%  { filter: blur(0px); }
  100% { opacity:1; transform: translateY(0) skewX(0); }
}
@keyframes introGlitchH {
  0%,90%,100% { clip-path: none; transform: none; }
  91%  { clip-path: inset(20% 0 60% 0); transform: translate(-4px, 0); }
  92%  { clip-path: inset(50% 0 20% 0); transform: translate(4px, 0); }
  93%  { clip-path: inset(10% 0 70% 0); transform: translate(-2px, 0); }
  94%  { clip-path: none; transform: none; }
}
@keyframes introGlitchColor {
  0%,88%,100% { text-shadow: none; }
  89% { text-shadow: -3px 0 #ff0080, 3px 0 #00ffff; }
  90% { text-shadow: 3px 0 #ff0080, -3px 0 #00ffff; }
  91% { text-shadow: none; }
}
@keyframes introPulseRing {
  0%   { transform: scale(0.6); opacity: 0; }
  30%  { opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
}
@keyframes introScanX {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200vw); }
}
@keyframes introScanY {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(200vh); }
}
@keyframes introGridReveal {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes introDataIn {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes introProgressFill {
  from { width: 0%; }
  to   { width: 100%; }
}
@keyframes introFlareBurst {
  0%   { opacity: 0; transform: scale(0); }
  40%  { opacity: 1; }
  100% { opacity: 0; transform: scale(3); }
}
@keyframes introHexSpin {
  0%   { transform: rotate(0deg) scale(0.8); opacity: 0; }
  30%  { opacity: 0.6; }
  70%  { opacity: 0.3; }
  100% { transform: rotate(120deg) scale(1.2); opacity: 0; }
}
@keyframes introCornerIn {
  from { opacity: 0; transform: scale(0.5); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes introSignalPulse {
  0%,100% { opacity: 0.2; }
  50%      { opacity: 1; }
}
@keyframes introBadgeFade {
  from { opacity: 0; transform: translateY(12px) scale(0.9); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes introTaglineReveal {
  from { opacity: 0; letter-spacing: 0.6em; }
  to   { opacity: 1; letter-spacing: 0.5em; }
}
@keyframes introParticleRise {
  0%   { opacity: 0; transform: translateY(0) scale(0.6); }
  15%  { opacity: 1; }
  80%  { opacity: 0.4; }
  100% { opacity: 0; transform: translateY(-100vh) scale(1.4); }
}
@keyframes crtFlicker {
  0%,98%,100% { opacity:1; }
  99%          { opacity:0.88; }
}
@keyframes introWipeOut {
  0%   { clip-path: inset(0 0 0 0); opacity: 1; }
  100% { clip-path: inset(0 0 0 100%); opacity: 0; }
}

.scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.side-panel { scrollbar-width: none; -ms-overflow-style: none; }
.side-panel::-webkit-scrollbar { display: none; }
.prog-track:hover { height: 6px !important; }
.prog-track:hover .prog-thumb { opacity: 1 !important; }
`;

/* ─── VIDEO DATA ─── */
const VIDEO_URLS = [
  "https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4",
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
];
const getUrl = i => VIDEO_URLS[i % VIDEO_URLS.length];

const ALL_VIDEOS = [// Changed videoUrl for id:1 to match the actual URL in VIDEO_URLS
  { id:1, title:"Big Buck Bunny", genre:"Animation", type:"Movie", language:"English", rating:"PG", duration:"9 min", year:2008, description:"A large, soft-hearted bunny exacts sweet revenge on woodland bullies in this beloved open-source classic.", cast:["Blender Foundation"], thumbnail:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg", banner:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg", videoUrl:getUrl(0), categories:["trending","animation","comedy"], featured:true },
  { id:2, title:"Elephant Dream", genre:"Sci-Fi", type:"Short", language:"English", rating:"PG", duration:"11 min", year:2006, description:"Two men navigate a dreamlike mechanical world full of surreal wonder and hidden meaning.", cast:["Blender Foundation"], thumbnail:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Elephants_Dream_s5_both.jpg/800px-Elephants_Dream_s5_both.jpg", banner:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Elephants_Dream_s5_both.jpg/800px-Elephants_Dream_s5_both.jpg", videoUrl:getUrl(1), categories:["trending","originals","sci-fi"] },
  { id:3, title:"Cosmic Frontier", genre:"Sci-Fi", type:"Series", language:"English", rating:"PG-13", duration:"42 min", year:2025, description:"A crew of intergalactic explorers discovers ancient alien civilizations on the edge of known space.", cast:["Zoe Miller","Jake Harrison"], thumbnail:"https://picsum.photos/seed/cosmic99/400/600", banner:"https://picsum.photos/seed/cosmic99/1400/700", videoUrl:getUrl(2), categories:["trending","sci-fi","top-rated","originals"] },
  { id:4, title:"Dark Waters", genre:"Thriller", type:"Movie", language:"English", rating:"R", duration:"118 min", year:2024, description:"A marine biologist uncovers a terrifying secret hidden beneath the ocean floor.", cast:["Emma Stone","Michael Douglas"], thumbnail:"https://picsum.photos/seed/darkwt44/400/600", banner:"https://picsum.photos/seed/darkwt44/1400/700", videoUrl:getUrl(3), categories:["trending","thriller","action"] },
  { id:5, title:"Fallen Empire", genre:"Drama", type:"Movie", language:"English", rating:"PG-13", duration:"135 min", year:2024, description:"A royal family struggles to hold their kingdom through revolution and war.", cast:["Anthony Hopkins","Cate Blanchett"], thumbnail:"https://picsum.photos/seed/empire22/400/600", banner:"https://picsum.photos/seed/empire22/1400/700", videoUrl:getUrl(4), categories:["trending","drama","top-rated"] },
  { id:6, title:"Rapid Response", genre:"Action", type:"Series", language:"English", rating:"TV-14", duration:"45 min", year:2025, description:"Elite emergency rescue team handles the most dangerous missions worldwide.", cast:["Chris Evans","Scarlett Johansson"], thumbnail:"https://picsum.photos/seed/rapid55/400/600", banner:"https://picsum.photos/seed/rapid55/1400/700", videoUrl:getUrl(5), categories:["trending","action","originals","top-rated"] },
  { id:7, title:"Wild Kingdom", genre:"Documentary", type:"Movie", language:"English", rating:"G", duration:"88 min", year:2025, description:"Breathtaking documentary following animal migration across the African savanna.", cast:["David Attenborough (Narrator)"], thumbnail:"https://picsum.photos/seed/wildkng/400/600", banner:"https://picsum.photos/seed/wildkng/1400/700", videoUrl:getUrl(6), categories:["trending","documentary","top-rated"] },
  { id:8, title:"The Last Laugh", genre:"Comedy", type:"Movie", language:"English", rating:"PG-13", duration:"92 min", year:2025, description:"A washed-up comedian gets one last shot at stardom in the most unexpected way.", cast:["Kevin Hart","Tiffany Haddish"], thumbnail:"https://picsum.photos/seed/lastlaugh/400/600", banner:"https://picsum.photos/seed/lastlaugh/1400/700", videoUrl:getUrl(7), categories:["trending","comedy","top-rated"] },
  { id:9, title:"Neon Streets", genre:"Action", type:"Series", language:"English", rating:"TV-MA", duration:"50 min", year:2025, description:"A rogue detective navigates a cyberpunk city where crime and tech collide.", cast:["Keanu Reeves","Zendaya"], thumbnail:"https://picsum.photos/seed/neonst/400/600", banner:"https://picsum.photos/seed/neonst/1400/700", videoUrl:getUrl(0), categories:["trending","action","sci-fi"] },
  { id:10, title:"Storm Chasers", genre:"Documentary", type:"Series", language:"English", rating:"PG", duration:"38 min", year:2025, description:"Brave meteorologists race into the heart of the world's most deadly storms.", cast:["Neil deGrasse Tyson"], thumbnail:"https://picsum.photos/seed/strmch/400/600", banner:"https://picsum.photos/seed/strmch/1400/700", videoUrl:getUrl(1), categories:["trending","documentary"] },
  { id:11, title:"Blade of Destiny", genre:"Action", type:"Movie", language:"English", rating:"PG-13", duration:"127 min", year:2025, description:"A legendary swordsman must reclaim an ancient blade before darkness consumes the realm.", cast:["Vin Diesel","Michelle Yeoh"], thumbnail:"https://picsum.photos/seed/bladedst/400/600", banner:"https://picsum.photos/seed/bladedst/1400/700", videoUrl:getUrl(2), categories:["trending","action"] },
  { id:12, title:"Echo Chamber", genre:"Thriller", type:"Movie", language:"English", rating:"R", duration:"101 min", year:2025, description:"A journalist trapped inside a social media loop discovers the truth is far darker than pixels.", cast:["Viola Davis","Idris Elba"], thumbnail:"https://picsum.photos/seed/echochm/400/600", banner:"https://picsum.photos/seed/echochm/1400/700", videoUrl:getUrl(3), categories:["trending","thriller"] },
  { id:13, title:"Quantum Paradox", genre:"Sci-Fi", type:"Short", language:"English", rating:"PG-13", duration:"18 min", year:2025, description:"A physicist creates a time loop and must escape before reality collapses.", cast:["Tom Holland","Florence Pugh"], thumbnail:"https://picsum.photos/seed/qntmprdx/400/600", banner:"https://picsum.photos/seed/qntmprdx/1400/700", videoUrl:getUrl(4), categories:["trending","sci-fi","originals"] },
  { id:14, title:"Urban Legends", genre:"Documentary", type:"Series", language:"English", rating:"PG", duration:"28 min", year:2025, description:"Investigating world-famous urban legends — separating fact from chilling fiction.", cast:["Morgan Freeman (Narrator)"], thumbnail:"https://picsum.photos/seed/urbleg/400/600", banner:"https://picsum.photos/seed/urbleg/1400/700", videoUrl:getUrl(5), categories:["trending","documentary","originals"] },
  { id:15, title:"Velocity", genre:"Action", type:"Movie", language:"English", rating:"PG-13", duration:"109 min", year:2025, description:"A street racer teams up with Interpol to take down the world's most dangerous smuggling ring.", cast:["Ryan Reynolds"], thumbnail:"https://picsum.photos/seed/vlcty99/400/600", banner:"https://picsum.photos/seed/vlcty99/1400/700", videoUrl:getUrl(6), categories:["trending","action"] },
  { id:16, title:"Split Second", genre:"Thriller", type:"Series", language:"English", rating:"TV-14", duration:"44 min", year:2025, description:"Every episode, a single decision changes everything for one unsuspecting person.", cast:["Adam Driver"], thumbnail:"https://picsum.photos/seed/spltsec/400/600", banner:"https://picsum.photos/seed/spltsec/1400/700", videoUrl:getUrl(7), categories:["trending","thriller"] },
  { id:17, title:"Overture", genre:"Drama", type:"Movie", language:"English", rating:"PG", duration:"112 min", year:2024, description:"A prodigy conductor faces her toughest competition: the ghosts of her own past.", cast:["Cate Blanchett"], thumbnail:"https://picsum.photos/seed/ovrtré/400/600", banner:"https://picsum.photos/seed/ovrtré/1400/700", videoUrl:getUrl(0), categories:["trending","drama"] },
  { id:18, title:"The Grid", genre:"Sci-Fi", type:"Series", language:"English", rating:"TV-MA", duration:"55 min", year:2025, description:"Hackers breach the world's most secure AI system and unlock something terrifying.", cast:["Oscar Isaac","Lupita Nyong'o"], thumbnail:"https://picsum.photos/seed/thegrid/400/600", banner:"https://picsum.photos/seed/thegrid/1400/700", videoUrl:getUrl(1), categories:["trending","sci-fi","originals"] },
  { id:19, title:"Deep Jungle", genre:"Action", type:"Short", language:"English", rating:"PG-13", duration:"16 min", year:2025, description:"Special forces venture deep into the Amazon on a classified rescue mission.", cast:["Dwayne Johnson"], thumbnail:"https://picsum.photos/seed/dpjngle/400/600", banner:"https://picsum.photos/seed/dpjngle/1400/700", videoUrl:getUrl(2), categories:["trending","action"] },
  { id:20, title:"Frequency", genre:"Drama", type:"Movie", language:"English", rating:"PG-13", duration:"98 min", year:2025, description:"A radio signal from 30 years ago connects a grieving son to his long-dead father.", cast:["Denzel Washington"], thumbnail:"https://picsum.photos/seed/freqcy2/400/600", banner:"https://picsum.photos/seed/freqcy2/1400/700", videoUrl:getUrl(3), categories:["trending","drama"] },
  { id:21, title:"For Bigger Blazes", genre:"Action", type:"Movie", language:"English", rating:"PG-13", duration:"15 sec", year:2013, description:"A firefighter battles a massive blaze that threatens to consume an entire city.", cast:["HBO"], thumbnail:"https://picsum.photos/seed/blaze99/400/600", banner:"https://picsum.photos/seed/blaze99/1400/700", videoUrl:getUrl(4), categories:["action","trending"] },
  { id:23, title:"Iron Phoenix", genre:"Action", type:"Movie", language:"English", rating:"PG-13", duration:"124 min", year:2025, description:"A disgraced soldier rises from the ashes to save the world from a rogue AI army.", cast:["Tom Cruise"], thumbnail:"https://picsum.photos/seed/ironph/400/600", banner:"https://picsum.photos/seed/ironph/1400/700", videoUrl:getUrl(0), categories:["action","top-rated"] },
  { id:24, title:"Shadow Protocol", genre:"Action", type:"Series", language:"English", rating:"TV-14", duration:"48 min", year:2025, description:"Black ops agents uncover a conspiracy that reaches the highest levels of government.", cast:["Jason Statham"], thumbnail:"https://picsum.photos/seed/shadpro/400/600", banner:"https://picsum.photos/seed/shadpro/1400/700", videoUrl:getUrl(1), categories:["action","thriller"] },
  { id:25, title:"Warlord", genre:"Action", type:"Movie", language:"English", rating:"R", duration:"131 min", year:2024, description:"A mercenary turned hero faces his deadliest mission behind enemy lines.", cast:["Chris Hemsworth"], thumbnail:"https://picsum.photos/seed/warlord/400/600", banner:"https://picsum.photos/seed/warlord/1400/700", videoUrl:getUrl(5), categories:["action"] },
  { id:26, title:"Overdrive", genre:"Action", type:"Movie", language:"English", rating:"PG-13", duration:"105 min", year:2025, description:"The fastest car heist crew in history takes on their most impossible job yet.", cast:["Vin Diesel","Gal Gadot"], thumbnail:"https://picsum.photos/seed/ovdrv2/400/600", banner:"https://picsum.photos/seed/ovdrv2/1400/700", videoUrl:getUrl(6), categories:["action","trending"] },
  { id:27, title:"Night Siege", genre:"Action", type:"Series", language:"English", rating:"TV-MA", duration:"52 min", year:2025, description:"A city plunged into darkness becomes a battleground between law and chaos.", cast:["Idris Elba"], thumbnail:"https://picsum.photos/seed/nsghe/400/600", banner:"https://picsum.photos/seed/nsghe/1400/700", videoUrl:getUrl(7), categories:["action","thriller","originals"] },
  { id:28, title:"Thunder Dome", genre:"Action", type:"Movie", language:"English", rating:"PG-13", duration:"118 min", year:2024, description:"Five warriors enter a deadly arena. Only one can leave alive.", cast:["Jackie Chan","Michelle Yeoh"], thumbnail:"https://picsum.photos/seed/thdrdom/400/600", banner:"https://picsum.photos/seed/thdrdom/1400/700", videoUrl:getUrl(0), categories:["action"] },
  { id:41, title:"For Bigger Fun", genre:"Comedy", type:"Movie", language:"English", rating:"G", duration:"15 sec", year:2013, description:"A fun-filled adventure that will leave you smiling from ear to ear.", cast:["Google"], thumbnail:"https://picsum.photos/seed/fun999/400/600", banner:"https://picsum.photos/seed/fun999/1400/700", videoUrl:getUrl(4), categories:["comedy","trending","originals"] },
  { id:44, title:"Office Chaos", genre:"Comedy", type:"Series", language:"English", rating:"PG", duration:"24 min", year:2025, description:"The new AI manager at a tech startup creates more chaos than it solves.", cast:["Steve Carell","Mindy Kaling"], thumbnail:"https://picsum.photos/seed/offchs/400/600", banner:"https://picsum.photos/seed/offchs/1400/700", videoUrl:getUrl(2), categories:["comedy","top-rated","originals"] },
  { id:45, title:"Family Mayhem", genre:"Comedy", type:"Movie", language:"English", rating:"PG", duration:"95 min", year:2025, description:"When grandma wins the lottery, five feuding siblings go to hilarious extremes.", cast:["Jack Black","Jennifer Aniston"], thumbnail:"https://picsum.photos/seed/famymhm/400/600", banner:"https://picsum.photos/seed/famymhm/1400/700", videoUrl:getUrl(3), categories:["comedy"] },
  { id:46, title:"Tourist Trap", genre:"Comedy", type:"Movie", language:"English", rating:"PG-13", duration:"88 min", year:2025, description:"An American couple's dream vacation becomes a delightfully disastrous adventure.", cast:["Tina Fey","Amy Poehler"], thumbnail:"https://picsum.photos/seed/tourtrap/400/600", banner:"https://picsum.photos/seed/tourtrap/1400/700", videoUrl:getUrl(5), categories:["comedy","trending"] },
  { id:48, title:"Robot Therapist", genre:"Comedy", type:"Series", language:"English", rating:"PG", duration:"22 min", year:2025, description:"The world's first AI therapist is hilariously terrible at its job.", cast:["Emma Thompson"], thumbnail:"https://picsum.photos/seed/robthp/400/600", banner:"https://picsum.photos/seed/robthp/1400/700", videoUrl:getUrl(6), categories:["comedy","sci-fi","originals"] },
  { id:62, title:"Tears of Steel", genre:"Sci-Fi", type:"Movie", language:"English", rating:"PG-13", duration:"12 min", year:2012, description:"Warriors fight to reclaim Amsterdam from brutal robot invaders.", cast:["Blender Institute"], thumbnail:"https://picsum.photos/seed/tostr99/400/600", banner:"https://picsum.photos/seed/tostr99/1400/700", videoUrl:getUrl(7), categories:["originals","sci-fi","action","top-rated"] },
  { id:63, title:"Deadline", genre:"Thriller", type:"Series", language:"English", rating:"TV-MA", duration:"52 min", year:2025, description:"An investigative journalist races to expose a conspiracy before she becomes the next victim.", cast:["Viola Davis","Idris Elba"], thumbnail:"https://picsum.photos/seed/ddlne99/400/600", banner:"https://picsum.photos/seed/ddlne99/1400/700", videoUrl:getUrl(0), categories:["originals","thriller","action","top-rated"] },
  { id:64, title:"Sovereign", genre:"Drama", type:"Series", language:"English", rating:"TV-MA", duration:"58 min", year:2025, description:"The turbulent story of a dynasty that shaped a nation — from the inside out.", cast:["Olivia Colman","Jonathan Pryce"], thumbnail:"https://picsum.photos/seed/svrn99/400/600", banner:"https://picsum.photos/seed/svrn99/1400/700", videoUrl:getUrl(1), categories:["originals","drama","top-rated"] },
  { id:81, title:"Galactic Outcasts", genre:"Sci-Fi", type:"Series", language:"English", rating:"TV-14", duration:"47 min", year:2025, description:"A band of misfits becomes the universe's unlikeliest heroes.", cast:["Zoe Saldana"], thumbnail:"https://picsum.photos/seed/galout/400/600", banner:"https://picsum.photos/seed/galout/1400/700", videoUrl:getUrl(2), categories:["sci-fi","originals"] },
  { id:82, title:"The Last Colony", genre:"Sci-Fi", type:"Movie", language:"English", rating:"PG-13", duration:"138 min", year:2025, description:"Earth's final colony on Mars fights for survival against an alien fungal plague.", cast:["Matt Damon","Jessica Chastain"], thumbnail:"https://picsum.photos/seed/lstcol/400/600", banner:"https://picsum.photos/seed/lstcol/1400/700", videoUrl:getUrl(3), categories:["sci-fi","top-rated"] },
  { id:101, title:"Morning Light", genre:"Drama", type:"Short", language:"English", rating:"PG", duration:"14 min", year:2025, description:"An elderly woman forms an unlikely friendship with a young homeless teenager.", cast:["Helen Mirren","Timothée Chalamet"], thumbnail:"https://picsum.photos/seed/mrnlght/400/600", banner:"https://picsum.photos/seed/mrnlght/1400/700", videoUrl:getUrl(4), categories:["drama","top-rated"] },
  { id:142, title:"Masterpiece", genre:"Drama", type:"Movie", language:"English", rating:"PG", duration:"132 min", year:2025, description:"A forger of great art discovers his own masterpiece — and it terrifies him.", cast:["Ed Norton"], thumbnail:"https://picsum.photos/seed/mstrpc/400/600", banner:"https://picsum.photos/seed/mstrpc/1400/700", videoUrl:getUrl(5), categories:["top-rated","drama"] },
  { id:150, title:"Everything Everywhere", genre:"Sci-Fi", type:"Movie", language:"English", rating:"R", duration:"139 min", year:2024, description:"A Chinese-American laundromat owner must connect with parallel universe versions of herself to save the world.", cast:["Michelle Yeoh"], thumbnail:"https://picsum.photos/seed/evrywr/400/600", banner:"https://picsum.photos/seed/evrywr/1400/700", videoUrl:getUrl(6), categories:["top-rated","sci-fi","comedy"] },
  { id:151, title:"Sintel: The Search", genre:"Fantasy", type:"Short", language:"English", rating:"PG-13", duration:"52 sec", year:2010, description:"A lone warrior tracks a dragon that stole her friend in this stunning cinematic epic.", cast:["Blender Studio"], thumbnail:"https://picsum.photos/seed/sintel1/400/600", banner:"https://picsum.photos/seed/sintel1/1400/700", videoUrl:getUrl(7), categories:["trending","originals","top-rated"] },
];

const CATEGORIES = [
  { key:"trending",     label:"⚡ Trending Now" },
  { key:"top-rated",   label:"◈ Top Rated" },
  { key:"action",      label:"⬡ Action" },
  { key:"comedy",      label:"◎ Comedy" },
  { key:"originals",   label:"✦ Streamify Originals" },
  { key:"sci-fi",      label:"⊛ Sci-Fi" },
  { key:"drama",       label:"◆ Drama" },
  { key:"documentary", label:"◉ Documentary" },
];

/* ─── HOOKS ─── */
function useWindowSize() {
  const [s, setS] = useState({ w: typeof window !== "undefined" ? window.innerWidth : 1200 });
  const timerRef = useRef();
  useEffect(() => {
    const h = () => { clearTimeout(timerRef.current); timerRef.current = setTimeout(() => setS({ w: window.innerWidth }), 60); };
    window.addEventListener("resize", h);
    return () => { clearTimeout(timerRef.current); window.removeEventListener("resize", h); };
  }, []);
  return s;
}

/* ══════════════════════════════════════════════
   PREMIUM CINEMATIC INTRO — NO BALLOONS
   7 phases: void → grid scan → holo-rings → 
   glitch-assemble → data-readout → flare-burst → wipe-exit
══════════════════════════════════════════════ */
function IntroAnimation({ onDone }) {
  const canvasRef = useRef();
  const [phase, setPhase] = useState(0);
  const [glitchTick, setGlitchTick] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 150),   // grid fades in
      setTimeout(() => setPhase(2), 700),   // holo rings
      setTimeout(() => setPhase(3), 1350),  // letters assemble
      setTimeout(() => setPhase(4), 2400),  // data readout
      setTimeout(() => setPhase(5), 3200),  // flare burst
      setTimeout(() => setPhase(6), 4100),  // wipe out begins
      setTimeout(() => onDone(), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  // Glitch tick for letter animation
  useEffect(() => {
    if (phase < 3) return;
    const iv = setInterval(() => setGlitchTick(t => t + 1), 2800);
    return () => clearInterval(iv);
  }, [phase]);

  /* ── Particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    const onResize = () => { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; };
    window.addEventListener("resize", onResize);

    // Starfield + energy particles
    const stars = Array.from({ length: 280 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.1,
      a: Math.random(), da: (Math.random() - 0.5) * 0.008,
      hue: [185, 195, 210, 270, 240][Math.floor(Math.random() * 5)],
    }));

    // Energy streams — horizontal
    const streams = Array.from({ length: 12 }, (_, i) => ({
      y: (H / 12) * i + Math.random() * 30,
      x: -200 - Math.random() * 400,
      speed: 1.2 + Math.random() * 2.5,
      len: 60 + Math.random() * 160,
      hue: Math.random() > 0.5 ? 185 : 270,
      a: 0.2 + Math.random() * 0.5,
    }));

    let af, frame = 0;
    const draw = () => {
      frame++;
      ctx.fillStyle = "rgba(0,1,10,0.13)";
      ctx.fillRect(0, 0, W, H);

      // Stars
      stars.forEach(s => {
        s.a = Math.max(0.05, Math.min(1, s.a + s.da));
        if (s.a <= 0.05 || s.a >= 1) s.da *= -1;
        ctx.fillStyle = `hsla(${s.hue},80%,75%,${s.a * 0.7})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });

      // Energy streams
      streams.forEach(st => {
        st.x += st.speed;
        if (st.x > W + 300) st.x = -300 - Math.random() * 200;
        const grad = ctx.createLinearGradient(st.x, 0, st.x + st.len, 0);
        grad.addColorStop(0, `hsla(${st.hue},100%,65%,0)`);
        grad.addColorStop(0.4, `hsla(${st.hue},100%,65%,${st.a})`);
        grad.addColorStop(1, `hsla(${st.hue},100%,65%,0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(st.x, st.y); ctx.lineTo(st.x + st.len, st.y); ctx.stroke();
      });

      // Central aurora glow — only once rings appear
      if (frame > 30) {
        const t = frame * 0.012;
        const cx = W / 2, cy = H / 2;
        const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.42);
        rg.addColorStop(0, `rgba(0,200,200,${0.04 + 0.02 * Math.sin(t)})`);
        rg.addColorStop(0.5, `rgba(124,58,237,${0.025 + 0.015 * Math.cos(t * 0.7)})`);
        rg.addColorStop(1, "transparent");
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, W, H);
      }

      af = requestAnimationFrame(draw);
    };
    af = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(af); window.removeEventListener("resize", onResize); };
  }, []);

  const BRAND = "STREAMIFY";
  const LETTER_ACCENT = { 0: "#00e5e5", 6: "#93c5fd", 8: "#a78bfa" };

  // Corner bracket decorations
  const CornerBracket = ({ pos }) => {
    const isTop = pos.includes("top");
    const isLeft = pos.includes("left");
    return (
      <div style={{
        position: "absolute",
        [isTop ? "top" : "bottom"]: 28,
        [isLeft ? "left" : "right"]: 28,
        width: 40, height: 40,
        opacity: phase >= 2 ? 1 : 0,
        transition: "opacity 0.6s ease",
        animation: phase >= 2 ? `introCornerIn 0.5s ${isTop ? "0.1s" : "0.25s"} ease both` : "none",
      }}>
        <div style={{
          position: "absolute",
          top: isTop ? 0 : "auto", bottom: isTop ? "auto" : 0,
          left: isLeft ? 0 : "auto", right: isLeft ? "auto" : 0,
          width: "60%", height: 2,
          background: `linear-gradient(${isLeft ? "to right" : "to left"}, #00c8c8, transparent)`,
          boxShadow: "0 0 8px #00c8c8",
        }} />
        <div style={{
          position: "absolute",
          top: isTop ? 0 : "auto", bottom: isTop ? "auto" : 0,
          left: isLeft ? 0 : "auto", right: isLeft ? "auto" : 0,
          width: 2, height: "60%",
          background: `linear-gradient(${isTop ? "to bottom" : "to top"}, #00c8c8, transparent)`,
          boxShadow: "0 0 8px #00c8c8",
        }} />
      </div>
    );
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#00010a",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, overflow: "hidden",
      animation: phase === 6 ? "introFadeOut 0.9s 0.1s cubic-bezier(0.4,0,1,1) forwards" : "none",
    }}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 1 }} />

      {/* Perspective grid floor */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        opacity: phase >= 1 ? 1 : 0, transition: "opacity 1.2s ease",
        background: `
          radial-gradient(ellipse 120% 60% at 50% 110%,
            rgba(0,200,200,0.06) 0%,
            rgba(124,58,237,0.03) 40%,
            transparent 70%)
        `,
      }}>
        {/* Grid lines - horizontal perspective */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }} viewBox="0 0 1440 900" preserveAspectRatio="none">
          {Array.from({ length: 14 }, (_, i) => {
            const y = 500 + i * 28;
            const spread = i * 60;
            return <line key={i} x1={720 - spread} y1={y} x2={720 + spread} y2={y} stroke="#00c8c8" strokeWidth="0.6" />;
          })}
          {Array.from({ length: 20 }, (_, i) => {
            const x = 220 + i * 52;
            return <line key={i} x1={720} y1={500} x2={x} y2={900} stroke="#00c8c8" strokeWidth="0.4" />;
          })}
        </svg>
      </div>

      {/* Horizontal scan line */}
      {phase >= 1 && (
        <div style={{
          position: "absolute", left: 0, right: 0, height: 1.5, zIndex: 4,
          background: `linear-gradient(to right, transparent 0%, rgba(0,200,200,0.15) 15%, #00e5e5 50%, rgba(0,200,200,0.15) 85%, transparent 100%)`,
          boxShadow: "0 0 24px #00c8c8, 0 0 60px rgba(0,200,200,0.2)",
          animation: "introScanY 2.4s ease-in-out infinite",
          animationDelay: "0.3s",
        }} />
      )}

      {/* Vertical scan line */}
      {phase >= 1 && (
        <div style={{
          position: "absolute", top: 0, bottom: 0, width: 1.5, zIndex: 4,
          background: `linear-gradient(to bottom, transparent, rgba(124,58,237,0.4) 40%, #a78bfa 50%, rgba(124,58,237,0.4) 60%, transparent)`,
          boxShadow: "0 0 20px #7c3aed",
          animation: "introScanX 3.2s ease-in-out infinite",
          animationDelay: "0.8s",
        }} />
      )}

      {/* Holographic rings */}
      {phase >= 2 && [0, 1, 2, 3].map(i => (
        <div key={i} style={{
          position: "absolute", zIndex: 3, borderRadius: "50%",
          width: 340 + i * 130, height: 340 + i * 130,
          border: `1px solid rgba(${i % 2 === 0 ? "0,200,200" : "124,58,237"},${0.15 - i * 0.02})`,
          animation: `${i % 2 === 0 ? "orbitRing" : "counterOrbit"} ${18 + i * 5}s linear infinite`,
          opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.6s ease",
        }}>
          {/* Orbiting node */}
          <div style={{
            position: "absolute",
            top: i === 0 ? -5 : i === 1 ? "auto" : -4,
            bottom: i === 1 ? -5 : "auto",
            left: i === 2 ? "30%" : "50%",
            transform: "translateX(-50%)",
            width: 8 - i, height: 8 - i, borderRadius: "50%",
            background: i % 2 === 0 ? "#00e5e5" : "#a78bfa",
            boxShadow: `0 0 18px ${i % 2 === 0 ? "#00c8c8" : "#7c3aed"}, 0 0 40px ${i % 2 === 0 ? "rgba(0,200,200,0.5)" : "rgba(124,58,237,0.4)"}`,
          }} />
        </div>
      ))}

      {/* Corner brackets */}
      <CornerBracket pos="top-left" />
      <CornerBracket pos="top-right" />
      <CornerBracket pos="bottom-left" />
      <CornerBracket pos="bottom-right" />

      {/* Signal bars — left side */}
      {phase >= 2 && (
        <div style={{
          position: "absolute", left: 40, top: "50%", transform: "translateY(-50%)",
          zIndex: 5, display: "flex", flexDirection: "column", gap: 6,
          opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.6s 0.4s",
        }}>
          {[0.8, 1, 0.6, 0.9, 0.5].map((a, i) => (
            <div key={i} style={{
              width: 24 + i * 4, height: 2,
              background: `rgba(0,200,200,${a})`,
              borderRadius: 2,
              boxShadow: `0 0 6px rgba(0,200,200,${a})`,
              animation: `introSignalPulse ${1.4 + i * 0.2}s ease-in-out ${i * 0.1}s infinite`,
            }} />
          ))}
        </div>
      )}

      {/* Signal bars — right side */}
      {phase >= 2 && (
        <div style={{
          position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)",
          zIndex: 5, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end",
          opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.6s 0.4s",
        }}>
          {[0.5, 0.9, 0.6, 1, 0.7].map((a, i) => (
            <div key={i} style={{
              width: 24 + (4-i) * 4, height: 2,
              background: `rgba(124,58,237,${a})`,
              borderRadius: 2,
              boxShadow: `0 0 6px rgba(124,58,237,${a})`,
              animation: `introSignalPulse ${1.6 + i * 0.18}s ease-in-out ${i * 0.12}s infinite`,
            }} />
          ))}
        </div>
      )}

      {/* Status badge */}
      <div style={{
        position: "absolute", top: "18%", left: "50%", transform: "translateX(-50%)",
        zIndex: 6, whiteSpace: "nowrap",
        opacity: phase >= 2 ? 1 : 0,
        animation: phase >= 2 ? "introBadgeFade 0.6s 0.2s ease both" : "none",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "rgba(0,200,200,0.04)",
          border: "1px solid rgba(0,200,200,0.22)",
          borderRadius: 3, padding: "7px 22px",
          backdropFilter: "blur(16px)",
        }}>
          <div style={{
            width: 5, height: 5, borderRadius: "50%", background: "#00e5e5",
            boxShadow: "0 0 10px #00e5e5",
            animation: "introSignalPulse 1.6s ease-in-out infinite",
          }} />
          <span style={{
            fontFamily: F_ACCENT, fontSize: 7.5, fontWeight: 700,
            letterSpacing: 5.5, color: "#00a0a0", textTransform: "uppercase",
          }}>ULTRA PREMIUM STREAMING</span>
          <div style={{
            width: 5, height: 5, borderRadius: "50%", background: "#a78bfa",
            boxShadow: "0 0 10px #a78bfa",
            animation: "introSignalPulse 1.6s ease-in-out 0.4s infinite",
          }} />
        </div>
      </div>

      {/* Main brand letters — glitch assemble */}
      <div style={{
        position: "relative", zIndex: 6, textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "center",
          gap: 1, marginBottom: 6, position: "relative",
        }}>
          {BRAND.split("").map((ch, i) => (
            <span key={i} style={{
              fontFamily: F_ACCENT,
              fontSize: i === 0 ? "clamp(52px,10vw,128px)" : "clamp(30px,5.8vw,76px)",
              fontWeight: 900,
              color: LETTER_ACCENT[i] || "#f0f4ff",
              display: "inline-block",
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? "translateY(0) skewX(0)" : "translateY(50px) skewX(-8deg)",
              transition: `opacity 0.7s ${0.05 + i * 0.065}s cubic-bezier(0.22,1,0.36,1),
                           transform 0.7s ${0.05 + i * 0.065}s cubic-bezier(0.22,1,0.36,1)`,
              filter: phase >= 3 ? "none" : "blur(10px)",
              textShadow: i === 0
                ? `0 0 40px #00e5e5, 0 0 100px rgba(0,228,228,0.35), 0 2px 0 rgba(0,0,0,0.9)`
                : LETTER_ACCENT[i]
                ? `0 0 28px ${LETTER_ACCENT[i]}, 0 0 70px ${LETTER_ACCENT[i]}44`
                : "0 2px 14px rgba(0,0,0,0.8)",
              animation: phase >= 3 && glitchTick > 0 ? `introGlitchH 0.5s ${i * 0.03}s ease, introGlitchColor 0.5s ${i * 0.03}s ease` : "none",
            }}>{ch}</span>
          ))}

          {/* Glitch ghost layer */}
          {phase >= 3 && (
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 1,
              opacity: 0.12, pointerEvents: "none", transform: "translate(3px, 0)",
              color: "#ff0080", mixBlendMode: "screen",
            }}>
              {BRAND.split("").map((ch, i) => (
                <span key={i} style={{
                  fontFamily: F_ACCENT,
                  fontSize: i === 0 ? "clamp(52px,10vw,128px)" : "clamp(30px,5.8vw,76px)",
                  fontWeight: 900,
                }}>{ch}</span>
              ))}
            </div>
          )}
        </div>

        {/* Animated divider */}
        <div style={{ position: "relative", width: "100%", height: 2, margin: "10px 0 14px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            background: `linear-gradient(to right, transparent, #007a7a, #00c8c8, #00e5e5, #a78bfa, #7c3aed, #00e5e5, #007a7a, transparent)`,
            transform: phase >= 4 ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "center",
            transition: "transform 0.9s 0.1s cubic-bezier(0.22,1,0.36,1)",
            boxShadow: "0 0 18px #00c8c8, 0 0 50px rgba(0,200,200,0.2)",
          }} />
          {phase >= 4 && (
            <div style={{
              position: "absolute", top: 0, left: 0, width: "30%", height: "100%",
              background: "linear-gradient(to right, transparent, rgba(255,255,255,0.95), transparent)",
              animation: "shimmerBar 1.8s ease-in-out infinite",
            }} />
          )}
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: F_DISPLAY, fontStyle: "italic",
          fontSize: "clamp(9px,1.1vw,13px)", letterSpacing: "0.5em",
          color: "transparent", textTransform: "uppercase", margin: "0 0 32px",
          background: `linear-gradient(90deg, #5a7090 0%, #00c8c8 30%, #f0f4ff 50%, #a78bfa 70%, #5a7090 100%)`,
          backgroundSize: "250% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          animation: phase >= 4 ? "shimmerText 4s linear infinite, introTaglineReveal 0.8s 0.2s ease both" : "none",
          opacity: phase >= 4 ? 1 : 0, transition: "opacity 0.5s 0.3s",
        }}>Beyond · Cinema · Redefined</p>

        {/* Data readout row */}
        <div style={{
          display: "flex", gap: 0, alignItems: "center", justifyContent: "center",
          opacity: phase >= 4 ? 1 : 0,
          animation: phase >= 4 ? "introDataIn 0.6s 0.4s ease both" : "none",
          marginBottom: 28,
        }}>
          {[
            { label: "4K ULTRA HD", col: "#00a0a0" },
            { label: "DOLBY ATMOS", col: "#7c3aed" },
            { label: "HDR10+", col: "#3b82f6" },
            { label: "IMAX ENHANCED", col: "#00a0a0" },
          ].map((item, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {i > 0 && (
                <span style={{ margin: "0 14px", width: 1, height: 12, background: "rgba(0,200,200,0.18)", display: "inline-block" }} />
              )}
              <span style={{
                fontFamily: F_ACCENT, fontSize: 7.5, fontWeight: 700,
                letterSpacing: 2.5, color: item.col,
                animation: `introSignalPulse ${2 + i * 0.3}s ease-in-out ${i * 0.15}s infinite`,
              }}>{item.label}</span>
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{
          width: "clamp(180px,26vw,300px)", height: 1.5,
          background: "rgba(0,200,200,0.07)", borderRadius: 2,
          overflow: "hidden", position: "relative",
          opacity: phase >= 4 ? 1 : 0, transition: "opacity 0.4s 0.5s",
        }}>
          <div style={{
            height: "100%",
            background: `linear-gradient(to right, #00c8c8, #a78bfa, #3b82f6)`,
            animation: phase >= 4 ? "introProgressFill 1.8s 0.5s cubic-bezier(0.4,0,0.2,1) both" : "none",
            boxShadow: "0 0 10px #00c8c8",
          }} />
          <div style={{
            position: "absolute", top: 0, left: 0, width: "30%", height: "100%",
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)",
            animation: phase >= 4 ? "shimmerBar 1.2s ease-in-out 0.7s infinite" : "none",
          }} />
        </div>

        {/* Dot indicators */}
        <div style={{
          marginTop: 16, display: "flex", gap: 8, justifyContent: "center",
          opacity: phase >= 4 ? 1 : 0, transition: "opacity 0.4s 0.7s",
        }}>
          {["#4c1d95","#6d28d9","#00e5e5","#6d28d9","#4c1d95"].map((col, i) => (
            <div key={i} style={{
              width: i === 2 ? 22 : 5, height: 5,
              background: i === 2 ? `linear-gradient(to right, #00c8c8, #7c3aed)` : col,
              borderRadius: 3,
              boxShadow: i === 2 ? "0 0 12px #00c8c8" : "none",
              opacity: i === 2 ? 1 : 0.35,
            }} />
          ))}
        </div>
      </div>

      {/* Flare burst on phase 5 */}
      {phase >= 5 && (
        <>
          <div style={{
            position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, rgba(0,228,228,0.12) 0%, rgba(124,58,237,0.06) 35%, transparent 70%)",
            animation: "introPulseRing 1.2s ease-out forwards",
          }} />
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              position: "absolute", left: "50%", top: "50%",
              transform: "translate(-50%,-50%)",
              width: 200 + i * 150, height: 200 + i * 150,
              borderRadius: "50%",
              border: `1px solid rgba(${i % 2 === 0 ? "0,228,228" : "124,58,237"},${0.4 - i * 0.08})`,
              animation: `introPulseRing ${0.9 + i * 0.25}s ${i * 0.1}s ease-out forwards`,
              pointerEvents: "none", zIndex: 7,
            }} />
          ))}
        </>
      )}

      {/* Bottom system info */}
      {phase >= 4 && (
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          zIndex: 6, display: "flex", gap: 32, alignItems: "center",
          opacity: 0, animation: "introDataIn 0.6s 0.8s ease forwards",
          whiteSpace: "nowrap",
        }}>
          {["SYS READY", "STREAM INIT", "AUTH OK"].map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: i === 0 ? "#00e5e5" : i === 1 ? "#a78bfa" : "#3b82f6",
                boxShadow: `0 0 8px ${i === 0 ? "#00e5e5" : i === 1 ? "#a78bfa" : "#3b82f6"}`,
                animation: `introSignalPulse ${1.4 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
              }} />
              <span style={{
                fontFamily: F_MONO, fontSize: 8.5, fontWeight: 500,
                color: "#1e2d4a", letterSpacing: 2,
              }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   CYAN SHIMMER TEXT
══════════════════════════════════════════════ */
function GoldText({ children, style = {} }) {
  return (
    <span style={{
      background: `linear-gradient(95deg,
        ${C.cyanDeep} 0%,
        ${C.cyan} 25%,
        ${C.cyanBright} 50%,
        ${C.cyanPale} 65%,
        ${C.violetBright} 85%,
        ${C.cyan} 100%)`,
      backgroundSize: "300% auto",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      animation: "shimmerText 5s linear infinite",
      display: "inline-block",
      ...style,
    }}>{children}</span>
  );
}

/* ══════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════ */
function Navbar({ page, setPage, searchQuery, setSearchQuery, watchlist }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [navReady, setNavReady] = useState(false);
  const { w } = useWindowSize();

  useEffect(() => {
    setTimeout(() => setNavReady(true), 200);
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navLinks = [
    { label: "Home", key: "home" },
    { label: "Browse", key: "browse" },
    { label: "Watchlist", key: "watchlist" },
    { label: "Contact", key: "contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      height: 68,
      background: scrolled
        ? "rgba(0,1,14,0.97)"
        : "linear-gradient(to bottom, rgba(0,1,14,0.9) 0%, transparent 100%)",
      backdropFilter: scrolled ? "blur(30px) saturate(200%)" : "none",
      display: "flex", alignItems: "center",
      padding: "0 clamp(16px,4vw,64px)",
      transition: "background 0.5s ease",
      opacity: navReady ? 1 : 0,
      animation: navReady ? "navbarDrop 0.7s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
    }}>
      {scrolled && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(to right, transparent, ${C.cyanDeep}, ${C.cyan}, ${C.violetBright}, ${C.cyan}, ${C.cyanDeep}, transparent)`,
          backgroundSize: "300% auto",
          animation: "gradientFlow 5s ease infinite",
          opacity: 0.6,
        }} />
      )}

      <button onClick={() => setPage("home")} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 4,
        position: "relative", padding: "4px 0",
      }}>
        <div style={{
          position: "absolute", left: -6, top: "50%", transform: "translateY(-50%)",
          width: 48, height: 48, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(0,200,200,0.2) 0%, transparent 70%)`,
          animation: "breathe 3s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <span style={{
          fontFamily: F_ACCENT, fontSize: 26, fontWeight: 900,
          color: C.cyanBright, display: "inline-block",
          textShadow: `0 0 20px ${C.glowA}, 0 0 60px rgba(0,228,228,0.25)`,
          animation: "glowFlare 3s ease-in-out infinite",
          position: "relative", zIndex: 1,
        }}>S</span>
        <span style={{
          fontFamily: F_ACCENT, fontWeight: 700, fontSize: 17,
          letterSpacing: "0.08em", display: "inline-block",
          background: `linear-gradient(135deg, ${C.textPrimary} 0%, ${C.textSecond} 70%, ${C.textMuted} 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          position: "relative", zIndex: 1,
          animation: navReady ? "logoWordReveal 1s 0.3s cubic-bezier(0.22,1,0.36,1) both" : "none",
        }}>TREAMIFY</span>
        <div style={{ marginLeft: 10, display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{
            width: 4, height: 4,
            background: `linear-gradient(135deg, ${C.cyan}, ${C.violetBright})`,
            transform: "rotate(45deg)",
            boxShadow: `0 0 8px ${C.cyan}`,
          }} />
          <span style={{
            fontFamily: F_ACCENT, fontSize: 7, fontWeight: 700,
            color: C.cyanMid, letterSpacing: 2, textTransform: "uppercase", opacity: 0.9,
          }}>PRO</span>
        </div>
      </button>

      <div style={{ flex: 1 }} />

      {w > 768 && (
        <div style={{ display: "flex", gap: 4, alignItems: "center", marginRight: 20 }}>
          {navLinks.map((l, i) => {
            const active = page === l.key;
            return (
              <button key={l.key} onClick={() => setPage(l.key)}
                onMouseEnter={() => setHovered(l.key)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: active ? "rgba(0,200,200,0.07)" : hovered === l.key ? "rgba(255,255,255,0.03)" : "none",
                  border: active ? `1px solid rgba(0,200,200,0.22)` : "1px solid transparent",
                  cursor: "pointer", padding: "8px 18px", borderRadius: 6,
                  fontFamily: F_ACCENT, fontSize: 10, fontWeight: 600,
                  color: active ? C.cyanBright : hovered === l.key ? C.textPrimary : C.textMuted,
                  letterSpacing: 2, textTransform: "uppercase",
                  position: "relative", transition: "all 0.22s",
                  animation: navReady ? `navLinkIn 0.5s ${0.1 + i * 0.08}s cubic-bezier(0.22,1,0.36,1) both` : "none",
                  boxShadow: active ? `0 0 20px rgba(0,200,200,0.08), inset 0 1px 0 rgba(0,200,200,0.06)` : "none",
                }}>
                {active && (
                  <span style={{
                    position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)",
                    width: 20, height: 1.5, borderRadius: 2,
                    background: `linear-gradient(to right, ${C.cyan}, ${C.cyanBright})`,
                    boxShadow: `0 0 8px ${C.cyan}`,
                  }} />
                )}
                {l.label}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {searchOpen ? (
          <div style={{
            display: "flex", alignItems: "center",
            background: "rgba(0,200,200,0.04)",
            border: `1px solid ${C.borderGlow}`,
            borderRadius: 8, overflow: "hidden",
            boxShadow: `0 0 24px rgba(0,200,200,0.1)`,
            animation: "scaleIn 0.2s ease",
          }}>
            <span style={{ padding: "0 12px", color: C.textMuted, fontSize: 16 }}>⌕</span>
            <input autoFocus value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage("search"); }}
              onBlur={() => !searchQuery && setSearchOpen(false)}
              placeholder="Search titles, genres…"
              style={{
                background: "none", border: "none",
                color: C.textPrimary, fontFamily: F_BODY, fontSize: 13,
                width: w > 480 ? 220 : 140, outline: "none", padding: "9px 16px 9px 0",
              }}
            />
          </div>
        ) : (
          <button onClick={() => setSearchOpen(true)} style={{
            background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
            cursor: "pointer", color: C.textMuted, fontSize: 18,
            width: 38, height: 38, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = C.cyanBright; e.currentTarget.style.borderColor = C.borderGlow; e.currentTarget.style.background = "rgba(0,200,200,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
          >⌕</button>
        )}

        <button onClick={() => setPage("watchlist")} style={{
          background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
          cursor: "pointer", color: C.textMuted, width: 38, height: 38, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", transition: "all 0.2s", fontSize: 18,
        }}
          onMouseEnter={e => { e.currentTarget.style.color = C.cyanBright; e.currentTarget.style.borderColor = C.borderGlow; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; }}
        >
          ☆
          {watchlist.length > 0 && (
            <span style={{
              position: "absolute", top: -6, right: -6,
              background: `linear-gradient(135deg, ${C.cyan}, ${C.violetBright})`,
              borderRadius: "50%", width: 18, height: 18,
              fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, color: C.void, fontFamily: F_BODY,
              boxShadow: `0 0 12px ${C.glowA}`,
              border: `1.5px solid ${C.void}`,
            }}>{watchlist.length}</span>
          )}
        </button>

        <button onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))} style={{
          background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
          cursor: "pointer", color: C.textMuted, width: 38, height: 38, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.color = C.cyanBright; e.currentTarget.style.borderColor = C.borderGlow; e.currentTarget.style.background = "rgba(0,200,200,0.06)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        >👤</button>

        {w <= 768 && (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
            cursor: "pointer", color: C.textPrimary, width: 38, height: 38, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>☰</button>
        )}
      </div>

      {menuOpen && w <= 768 && (
        <div style={{
          position: "absolute", top: 68, left: 0, right: 0,
          background: "rgba(0,1,14,0.99)", backdropFilter: "blur(28px)",
          borderBottom: `1px solid ${C.border}`, padding: "8px 24px 20px",
          animation: "fadeSlideDown 0.25s ease",
        }}>
          {navLinks.map((l) => (
            <button key={l.key} onClick={() => { setPage(l.key); setMenuOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 14, background: "none", border: "none",
              cursor: "pointer", fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 20,
              color: page === l.key ? C.cyanBright : C.textMuted,
              textAlign: "left", padding: "14px 0",
              borderBottom: `1px solid ${C.border}`, transition: "color 0.2s", width: "100%",
            }}>{l.label}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ══════════════════════════════════════════════
   VIDEO CARD
══════════════════════════════════════════════ */
function VideoCard({ video, onPlay, onDetail, onWatchlist, isInWatchlist, index = 0 }) {
  const [hov, setHov] = useState(false);
  const [pressed, setPressed] = useState(false);
  const { w } = useWindowSize();
  const cW = w < 480 ? 148 : w < 768 ? 168 : 198;
  const cH = Math.round(cW * 1.47);

  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}
      onTouchStart={() => setHov(true)} onTouchEnd={() => setTimeout(() => setHov(false), 1800)}
      onClick={() => onDetail(video)}
      style={{
        minWidth: cW, width: cW, borderRadius: 12, overflow: "hidden",
        cursor: "pointer", position: "relative", flexShrink: 0, background: C.card,
        transform: pressed ? "scale(0.95)" : hov ? "scale(1.1) translateY(-12px)" : "scale(1)",
        transition: "transform 0.42s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.42s ease",
        boxShadow: hov
          ? `0 32px 80px rgba(0,200,200,0.25), 0 16px 48px rgba(0,0,0,0.9), 0 0 60px rgba(0,200,200,0.08), inset 0 1px 0 rgba(0,200,200,0.1)`
          : `0 8px 32px rgba(0,0,0,0.75)`,
        zIndex: hov ? 10 : 1, willChange: "transform",
      }}
    >
      <div style={{
        position: "absolute", inset: 0, borderRadius: 12, zIndex: 6, pointerEvents: "none",
        border: hov ? `1px solid rgba(0,200,200,0.35)` : `1px solid rgba(255,255,255,0.05)`,
        transition: "border-color 0.3s",
      }} />
      <img src={video.thumbnail} alt={video.title} loading="lazy"
        style={{
          width: "100%", height: cH, objectFit: "cover", display: "block",
          filter: hov ? "brightness(0.65) saturate(1.2)" : "brightness(0.9)",
          transition: "filter 0.4s, transform 0.5s",
          transform: hov ? "scale(1.12)" : "scale(1.02)",
        }}
        onError={e => { e.target.src = `https://picsum.photos/seed/${video.id}x/400/600`; }}
      />
      <div style={{
        position: "absolute", top: 10, right: 10, zIndex: 5,
        background: "rgba(0,1,14,0.85)", backdropFilter: "blur(12px)",
        borderRadius: 4, padding: "3px 8px",
        fontFamily: F_ACCENT, fontSize: 8, fontWeight: 700, color: C.textMuted,
        border: `1px solid ${C.border}`, letterSpacing: 1,
      }}>{video.rating}</div>
      <div style={{
        position: "absolute", top: 10, left: 10, zIndex: 5,
        background: video.type === "Series" ? "rgba(59,130,246,0.18)" : video.type === "Short" ? "rgba(0,200,200,0.18)" : "rgba(124,58,237,0.18)",
        backdropFilter: "blur(12px)", borderRadius: 4, padding: "3px 8px",
        fontFamily: F_ACCENT, fontSize: 8, fontWeight: 700, color: C.textPrimary,
        border: `1px solid ${video.type === "Series" ? "rgba(59,130,246,0.35)" : video.type === "Short" ? "rgba(0,200,200,0.35)" : "rgba(124,58,237,0.35)"}`,
        letterSpacing: 1,
      }}>{video.type.toUpperCase()}</div>
      <div style={{
        position: "absolute", inset: 0,
        background: hov
          ? `linear-gradient(to top, rgba(0,1,14,1) 0%, rgba(0,1,14,0.75) 50%, rgba(0,1,14,0.05) 100%)`
          : `linear-gradient(to top, rgba(0,1,14,0.92) 0%, rgba(0,1,14,0.05) 65%)`,
        transition: "background 0.35s", zIndex: 2,
      }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 12px", zIndex: 4 }}>
        <p style={{
          fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: w < 480 ? 12.5 : 13.5,
          fontWeight: 700, color: C.textPrimary, margin: 0, lineHeight: 1.3,
          transform: hov ? "translateY(-4px)" : "translateY(0)", transition: "transform 0.3s",
        }}>{video.title}</p>
        <p style={{ fontFamily: F_BODY, fontSize: 10, color: C.textMuted, margin: "4px 0 0", opacity: hov ? 1 : 0.6, transition: "opacity 0.3s" }}>{video.year} · {video.genre}</p>
        {hov && (
          <div style={{ display: "flex", gap: 6, marginTop: 10, animation: "fadeSlideUp 0.25s ease" }}>
            <button onClick={e => { e.stopPropagation(); onPlay(video); }} style={{
              flex: 1,
              background: `linear-gradient(135deg, ${C.cyanBright} 0%, ${C.cyan} 100%)`,
              color: C.void, border: "none", borderRadius: 6, padding: "7px 0",
              fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: F_BODY,
              boxShadow: `0 4px 18px ${C.glowA}`, letterSpacing: 0.5,
            }}>▶ Play</button>
            <button onClick={e => { e.stopPropagation(); onWatchlist(video); }} style={{
              width: 34,
              background: isInWatchlist ? `linear-gradient(135deg, ${C.cyan}, ${C.violetBright})` : "rgba(255,255,255,0.07)",
              color: isInWatchlist ? C.void : "#fff",
              border: `1px solid ${isInWatchlist ? C.cyan : C.border}`,
              borderRadius: 6, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
            }}>{isInWatchlist ? "✓" : "+"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CATEGORY ROW
══════════════════════════════════════════════ */
function CategoryRow({ label, videos, onPlay, onDetail, onWatchlist, watchlist }) {
  const ref = useRef();
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const { w } = useWindowSize();
  const scroll = dir => ref.current?.scrollBy({ left: dir * (w < 768 ? 320 : 480), behavior: "smooth" });
  const upd = () => {
    if (!ref.current) return;
    setCanLeft(ref.current.scrollLeft > 0);
    setCanRight(ref.current.scrollLeft + ref.current.offsetWidth < ref.current.scrollWidth - 2);
  };
  if (!videos.length) return null;

  const ArrowBtn = ({ dir, show, onClick }) => show ? (
    <button onClick={onClick} style={{
      position: "absolute", [dir < 0 ? "left" : "right"]: 0, top: "50%",
      transform: "translateY(-50%)", zIndex: 5,
      background: dir < 0
        ? `linear-gradient(to right, rgba(0,1,14,0.99) 55%, transparent)`
        : `linear-gradient(to left, rgba(0,1,14,0.99) 55%, transparent)`,
      border: "none", color: C.textMuted, width: 60, height: 90,
      cursor: "pointer", fontSize: 30, display: "flex", alignItems: "center",
      justifyContent: dir < 0 ? "flex-start" : "flex-end",
      paddingLeft: dir < 0 ? 14 : 0, paddingRight: dir < 0 ? 0 : 14,
      transition: "color 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.color = C.cyanBright}
      onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
    >{dir < 0 ? "‹" : "›"}</button>
  ) : null;

  return (
    <div style={{ marginBottom: 52 }}>
      <div style={{ margin: "0 0 20px clamp(16px,4vw,64px)", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ width: 3, height: 14, background: C.cyanBright, borderRadius: 2, boxShadow: `0 0 8px ${C.cyanBright}` }} />
          <div style={{ width: 3, height: 6, background: C.violetBright, borderRadius: 2, boxShadow: `0 0 6px ${C.violetBright}` }} />
        </div>
        <h2 style={{ fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: "clamp(16px,1.9vw,22px)", fontWeight: 700, color: C.textPrimary, margin: 0 }}>
          <GoldText>{label}</GoldText>
        </h2>
      </div>
      <div style={{ position: "relative" }}>
        <ArrowBtn dir={-1} show={canLeft} onClick={() => scroll(-1)} />
        <div ref={ref} onScroll={upd} className="scrollbar-hide" style={{
          display: "flex", gap: w < 480 ? 10 : 14, overflowX: "auto",
          padding: `18px clamp(16px,4vw,64px)`, WebkitOverflowScrolling: "touch",
        }}>
          {videos.map((v, i) => (
            <VideoCard key={v.id} video={v} index={i} onPlay={onPlay} onDetail={onDetail}
              onWatchlist={onWatchlist} isInWatchlist={watchlist.some(wl => wl.id === v.id)} />
          ))}
        </div>
        <ArrowBtn dir={1} show={canRight} onClick={() => scroll(1)} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   HERO BANNER
══════════════════════════════════════════════ */
function HeroBanner({ video, onPlay, onWatchlist, isInWatchlist }) {
  const [vis, setVis] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const { w } = useWindowSize();
  useEffect(() => { setTimeout(() => setVis(true), 250); }, []);

  return (
    <div style={{ position: "relative", height: "100vh", minHeight: 580, overflow: "hidden" }}>
      <img src={video.banner} alt={video.title}
        onLoad={() => setBgLoaded(true)}
        onError={e => { e.target.src = `https://picsum.photos/seed/${video.id}hero/1600/900`; setBgLoaded(true); }}
        style={{
          width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top",
          opacity: bgLoaded ? 1 : 0, transition: "opacity 1.4s",
          filter: "saturate(1.1) contrast(1.08)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,1,14,0.97) 0%, rgba(0,1,14,0.55) 50%, rgba(0,1,14,0.1) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,1,14,1) 0%, rgba(0,1,14,0.3) 55%, transparent 85%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 25% 65%, rgba(0,200,200,0.06) 0%, transparent 55%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 75% 30%, rgba(124,58,237,0.05) 0%, transparent 50%)" }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.015) 0px, rgba(0,0,0,0.015) 1px, transparent 1px, transparent 3px)",
      }} />

      <div style={{
        position: "absolute", bottom: w > 768 ? "13%" : "8%",
        left: "clamp(20px,4vw,76px)", maxWidth: w < 480 ? "94%" : 600,
        opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(60px)",
        transition: "all 1.1s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <span style={{
            background: `linear-gradient(135deg, ${C.cyanDeep}, ${C.cyan})`,
            color: C.void, padding: "5px 16px", borderRadius: 4,
            fontSize: 8, fontWeight: 800, fontFamily: F_ACCENT,
            letterSpacing: 4, textTransform: "uppercase",
            boxShadow: `0 0 28px ${C.glowA}`,
          }}>✦ FEATURED</span>
          <span style={{
            background: "rgba(255,255,255,0.05)", color: C.textMuted,
            padding: "5px 14px", borderRadius: 4, fontSize: 8,
            fontFamily: F_ACCENT, letterSpacing: 2, backdropFilter: "blur(14px)",
            border: `1px solid ${C.border}`,
          }}>{video.rating}</span>
        </div>

        <h1 style={{
          fontFamily: F_DISPLAY, fontStyle: "italic",
          fontSize: "clamp(28px,5.5vw,72px)", fontWeight: 900,
          margin: "0 0 18px", lineHeight: 1.0, color: C.textPrimary,
          filter: "drop-shadow(0 4px 28px rgba(0,0,0,0.6))",
        }}>{video.title}</h1>

        <div style={{ display: "flex", gap: 0, marginBottom: 22, alignItems: "center", flexWrap: "wrap" }}>
          {[video.year, video.duration, video.genre].map((t, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {i > 0 && <span style={{ margin: "0 10px", color: C.cyanMid, fontSize: 14 }}>·</span>}
              <span style={{ fontFamily: F_BODY, fontSize: 12, color: C.textMuted, fontWeight: 500 }}>{t}</span>
            </span>
          ))}
        </div>

        <p style={{
          fontFamily: F_BODY, fontSize: "clamp(13px,1.2vw,15px)", color: C.textMuted,
          lineHeight: 1.82, marginBottom: 36, maxWidth: 520,
          display: w < 480 ? "-webkit-box" : "block",
          WebkitLineClamp: w < 480 ? 2 : "unset",
          WebkitBoxOrient: "vertical", overflow: w < 480 ? "hidden" : "visible",
        }}>{video.description}</p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button onClick={() => onPlay(video)} style={{
            background: `linear-gradient(135deg, ${C.cyanBright} 0%, ${C.cyan} 55%, ${C.cyanDeep} 100%)`,
            color: C.void, border: "none",
            padding: w < 480 ? "12px 28px" : "15px 44px",
            borderRadius: 8, fontSize: w < 480 ? 13 : 15, fontWeight: 700,
            cursor: "pointer", fontFamily: F_BODY,
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: `0 6px 32px ${C.glowA}, 0 2px 0 rgba(255,255,255,0.06) inset`,
            letterSpacing: 0.5, transition: "all 0.25s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 14px 50px ${C.glowA}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 6px 32px ${C.glowA}`; }}
          >▶&ensp;Play Now</button>

          <button onClick={() => onWatchlist(video)} style={{
            background: "rgba(255,255,255,0.04)", color: C.textPrimary,
            border: `1px solid ${isInWatchlist ? C.cyan : "rgba(255,255,255,0.14)"}`,
            padding: w < 480 ? "12px 22px" : "15px 32px",
            borderRadius: 8, fontSize: w < 480 ? 13 : 15, fontWeight: 500,
            cursor: "pointer", fontFamily: F_DISPLAY, fontStyle: "italic",
            backdropFilter: "blur(20px)", transition: "all 0.25s",
            boxShadow: isInWatchlist ? `0 0 24px rgba(0,200,200,0.15)` : "none",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,200,200,0.07)"; e.currentTarget.style.borderColor = C.cyan; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = isInWatchlist ? C.cyan : "rgba(255,255,255,0.14)"; }}
          >{isInWatchlist ? "✓ In Watchlist" : "＋ Watchlist"}</button>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        opacity: vis ? 0.3 : 0, transition: "opacity 1s 2s", pointerEvents: "none",
      }}>
        <span style={{ fontFamily: F_ACCENT, fontSize: 7, letterSpacing: 4, color: C.textMuted, textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: 1, height: 36, background: `linear-gradient(to bottom, ${C.cyan}, transparent)`, animation: "float2 2.2s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   VIDEO PLAYER
══════════════════════════════════════════════ */
function VideoPlayer({ video, allVideos, onClose }) {
  const videoRef = useRef();
  const containerRef = useRef();
  const progressRef = useRef();
  const hideTimer = useRef();
  const centerTimer = useRef();
  const scrubbingRef = useRef(false);
  const playingRef = useRef(false);
  const settingsRef = useRef();

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [subtitles, setSubtitles] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [quality, setQuality] = useState("Auto");
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCenterIcon, setShowCenterIcon] = useState(null);
  const [showUpNext, setShowUpNext] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(() => allVideos.findIndex(v => v.id === video.id));
  const [currentVideo, setCurrentVideo] = useState(video);
  const [volumeHovered, setVolumeHovered] = useState(false);
  const { w } = useWindowSize();

  const relatedVideos = allVideos.filter(v =>
    v.id !== currentVideo.id &&
    (v.genre === currentVideo.genre || v.categories?.some(c => currentVideo.categories?.includes(c)))
  ).slice(0, 6);

  const seekToPosition = useCallback((clientX) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    if (!rect.width) return;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const dur = videoRef.current.duration;
    if (!dur || isNaN(dur) || dur <= 0) return;
    videoRef.current.currentTime = pct * dur;
    setProgress(pct * 100);
    setCurrentTime(pct * dur);
  }, []);

  useEffect(() => {
    const onMove = e => { if (!scrubbingRef.current) return; const x = e.clientX ?? e.touches?.[0]?.clientX; if (x !== undefined) seekToPosition(x); };
    const onUp = () => { scrubbingRef.current = false; };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true }); window.addEventListener("touchend", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onUp); };
  }, [seekToPosition]);

  useEffect(() => {
    if (!settingsOpen) return;
    const h = e => { if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [settingsOpen]);

  const showControlsTemp = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => { if (playingRef.current) setControlsVisible(false); }, 3500);
  }, []);

  const flashCenter = useCallback(type => {
    setShowCenterIcon(type);
    clearTimeout(centerTimer.current);
    centerTimer.current = setTimeout(() => setShowCenterIcon(null), 700);
  }, []);

  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    const onTimeUpdate = () => { if (scrubbingRef.current) return; const t = v.currentTime, dur = v.duration; setCurrentTime(t); if (dur && !isNaN(dur) && dur > 0) { setProgress(Math.min(100, (t / dur) * 100)); setShowUpNext(t / dur > 0.85); } };
    const onDur = () => { if (v.duration && !isNaN(v.duration) && isFinite(v.duration)) setDuration(v.duration); };
    const onProg = () => { if (v.buffered.length > 0 && v.duration > 0) setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100); };
    const onWait = () => setLoading(true); const onCan = () => setLoading(false);
    const onPlay = () => { setLoading(false); setPlaying(true); playingRef.current = true; };
    const onPause = () => { setPlaying(false); playingRef.current = false; };
    const onEnded = () => { setPlaying(false); playingRef.current = false; handleNext(); };
    v.addEventListener("timeupdate", onTimeUpdate); v.addEventListener("durationchange", onDur); v.addEventListener("loadedmetadata", onDur); v.addEventListener("progress", onProg); v.addEventListener("waiting", onWait); v.addEventListener("canplay", onCan); v.addEventListener("canplaythrough", onCan); v.addEventListener("playing", onPlay); v.addEventListener("pause", onPause); v.addEventListener("ended", onEnded);
    return () => { v.removeEventListener("timeupdate", onTimeUpdate); v.removeEventListener("durationchange", onDur); v.removeEventListener("loadedmetadata", onDur); v.removeEventListener("progress", onProg); v.removeEventListener("waiting", onWait); v.removeEventListener("canplay", onCan); v.removeEventListener("canplaythrough", onCan); v.removeEventListener("playing", onPlay); v.removeEventListener("pause", onPause); v.removeEventListener("ended", onEnded); };
  }, [currentVideo]); // eslint-disable-line

  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    setLoading(true); setProgress(0); setCurrentTime(0); setDuration(0); setBuffered(0); setShowUpNext(false); scrubbingRef.current = false;
    const tryPlay = () => v.play().then(() => { setPlaying(true); playingRef.current = true; setLoading(false); }).catch(() => { setLoading(false); });
    v.addEventListener("canplay", tryPlay, { once: true }); v.load();
    return () => v.removeEventListener("canplay", tryPlay);
  }, [currentVideo]);

  useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = speed; }, [speed]);
  useEffect(() => { if (videoRef.current) { videoRef.current.volume = volume; videoRef.current.muted = muted; } }, [volume, muted]);
  useEffect(() => { const h = () => setFullscreen(!!document.fullscreenElement); document.addEventListener("fullscreenchange", h); return () => document.removeEventListener("fullscreenchange", h); }, []);
  useEffect(() => { setControlsVisible(true); showControlsTemp(); }, []); // eslint-disable-line

  const togglePlay = useCallback(() => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) { v.play().then(() => { setPlaying(true); playingRef.current = true; flashCenter("play"); }).catch(() => {}); }
    else { v.pause(); setPlaying(false); playingRef.current = false; flashCenter("pause"); setControlsVisible(true); }
    showControlsTemp();
  }, [flashCenter, showControlsTemp]);

  const seek = useCallback(s => {
    const v = videoRef.current; if (!v || !v.duration) return;
    v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + s));
    flashCenter(s > 0 ? "forward" : "rewind"); showControlsTemp();
  }, [flashCenter, showControlsTemp]);

  const adjustVolume = useCallback(d => {
    setVolume(prev => { const n = Math.max(0, Math.min(1, prev + d)); if (videoRef.current) videoRef.current.volume = n; if (n > 0) setMuted(false); return n; });
  }, []);

  const toggleMute = useCallback(() => { setMuted(p => { const n = !p; if (videoRef.current) videoRef.current.muted = n; return n; }); }, []);
  const toggleFS = useCallback(() => { if (!document.fullscreenElement) containerRef.current?.requestFullscreen().catch(() => {}); else document.exitFullscreen().catch(() => {}); }, []);

  const switchVideo = useCallback(idx => {
    const v = videoRef.current; if (v) v.pause();
    setPlaying(false); playingRef.current = false; setSettingsOpen(false);
    setCurrentVideoIndex(idx); setCurrentVideo(allVideos[idx]);
  }, [allVideos]);

  const handleNext = useCallback(() => { switchVideo((currentVideoIndex + 1) % allVideos.length); }, [currentVideoIndex, allVideos.length, switchVideo]);
  const handlePrev = useCallback(() => { switchVideo(currentVideoIndex > 0 ? currentVideoIndex - 1 : allVideos.length - 1); }, [currentVideoIndex, allVideos.length, switchVideo]);

  useEffect(() => {
    const handleKey = e => {
      if (e.target.tagName === "INPUT") return;
      switch (e.code) {
        case "Space": e.preventDefault(); togglePlay(); break;
        case "ArrowLeft": e.preventDefault(); seek(-10); break;
        case "ArrowRight": e.preventDefault(); seek(10); break;
        case "ArrowUp": e.preventDefault(); adjustVolume(0.1); break;
        case "ArrowDown": e.preventDefault(); adjustVolume(-0.1); break;
        case "KeyM": toggleMute(); break;
        case "KeyF": toggleFS(); break;
        case "Escape": if (settingsOpen) { setSettingsOpen(false); return; } if (!document.fullscreenElement) onClose(); break;
        default: break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const fmt = s => {
    if (!s || isNaN(s) || s < 0) return "0:00";
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
    if (h > 0) return `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
    return `${m}:${String(sec).padStart(2,"0")}`;
  };

  const SVGIcon = ({ path, size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: "block", flexShrink: 0 }}>
      <path d={path} />
    </svg>
  );

  const ICONS = {
    play: "M8 5v14l11-7z", pause: "M6 19h4V5H6v14zm8-14v14h4V5h-4z",
    prev: "M6 6h2v12H6zm3.5 6l8.5 6V6z", next: "M6 18l8.5-6L6 6zm9-12v12h2V6z",
    volHigh: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
    volMute: "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 7.09 12 9.18V4z",
    fullscreen: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z",
    exitFS: "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z",
    settings: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
  };

  const cBtn = (onClick, children, extraStyle = {}) => (
    <button onClick={e => { e.stopPropagation(); onClick(); }} style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
      color: C.textPrimary, cursor: "pointer", width: 40, height: 40, borderRadius: 8,
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.15s", flexShrink: 0, ...extraStyle,
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,200,200,0.09)"; e.currentTarget.style.borderColor = "rgba(0,200,200,0.28)"; e.currentTarget.style.color = C.cyanBright; }}
      onMouseLeave={e => { e.currentTarget.style.background = extraStyle.background || "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = C.textPrimary; }}
    >
      <span style={{ pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</span>
    </button>
  );

  const nextVideo = allVideos[(currentVideoIndex + 1) % allVideos.length];

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 2000, display: "flex" }}>
      <div ref={containerRef} onMouseMove={showControlsTemp}
        onMouseLeave={() => { if (playingRef.current) setControlsVisible(false); }}
        style={{ position: "relative", flex: 1, background: "#000", cursor: controlsVisible ? "default" : "none", overflow: "hidden" }}
      >
        <video key={currentVideo.id} ref={videoRef} src={currentVideo.videoUrl}
          style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
          preload="auto" playsInline />

        {loading && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, pointerEvents: "none" }}>
            <div style={{ position: "relative", width: 56, height: 56 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid rgba(0,200,200,0.1)`, borderTop: `2px solid ${C.cyanBright}`, animation: "spin 0.8s linear infinite" }} />
              <div style={{ position: "absolute", inset: 6, borderRadius: "50%", border: `2px solid rgba(124,58,237,0.1)`, borderBottom: `2px solid ${C.violetBright}`, animation: "spinR 1.2s linear infinite" }} />
            </div>
          </div>
        )}

        {showCenterIcon && (
          <div style={{ position: "absolute", top: "50%", left: "50%", zIndex: 11, pointerEvents: "none", animation: "flashIcon 0.7s ease forwards" }}>
            <div style={{ padding: "16px 24px", borderRadius: 16, background: "rgba(0,1,14,0.65)", backdropFilter: "blur(24px)", display: "flex", alignItems: "center", justifyContent: "center", color: C.cyanBright, border: `1px solid rgba(0,200,200,0.2)` }}>
              {showCenterIcon === "play" ? <SVGIcon path={ICONS.play} size={44} />
                : showCenterIcon === "pause" ? <SVGIcon path={ICONS.pause} size={44} />
                : showCenterIcon === "rewind" ? <span style={{ fontSize: 22, fontWeight: 700, fontFamily: F_BODY }}>−10s</span>
                : <span style={{ fontSize: 22, fontWeight: 700, fontFamily: F_BODY }}>+10s</span>}
            </div>
          </div>
        )}

        <div onClick={togglePlay} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2, cursor: "pointer" }} />

        {showUpNext && nextVideo && (
          <div style={{ position: "absolute", bottom: 68, right: 24, zIndex: 50, cursor: "pointer" }} onClick={handleNext}>
            <div style={{ background: "rgba(0,1,14,0.95)", backdropFilter: "blur(16px)", borderRadius: 16, padding: 16, border: `1px solid ${C.borderGlow}`, boxShadow: `0 8px 40px rgba(0,0,0,0.8), 0 0 30px rgba(0,200,200,0.05)`, transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <p style={{ fontSize: 9, color: C.cyan, fontWeight: 700, letterSpacing: 3, margin: "0 0 10px", fontFamily: F_ACCENT, textTransform: "uppercase" }}>Up Next</p>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <img src={nextVideo.thumbnail} style={{ width: 60, height: 42, borderRadius: 8, objectFit: "cover" }} onError={e => { e.target.src = `https://picsum.photos/seed/${nextVideo.id}t/400/600`; }} />
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, margin: 0, fontFamily: F_DISPLAY, fontStyle: "italic" }}>{nextVideo.title}</h3>
                  <p style={{ fontSize: 10, color: C.textMuted, margin: "3px 0 6px", fontFamily: F_BODY }}>{nextVideo.year} · {nextVideo.genre}</p>
                  <button style={{ background: `linear-gradient(135deg, ${C.cyan}, ${C.cyanDeep})`, color: C.void, padding: "4px 10px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>▶ Play</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {subtitles && (
          <div style={{ position: "absolute", bottom: 104, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.9)", backdropFilter: "blur(14px)", padding: "8px 30px", borderRadius: 8, fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 16, color: C.textPrimary, maxWidth: "80%", textAlign: "center", zIndex: 9, pointerEvents: "none", border: `1px solid ${C.border}` }}>Subtitles enabled — Streamify Premium</div>
        )}

        <div style={{ position: "absolute", top: 20, left: 20, zIndex: 20, opacity: controlsVisible ? 1 : 0, transition: "opacity 0.3s", pointerEvents: controlsVisible ? "auto" : "none" }}>
          <button onClick={e => { e.stopPropagation(); onClose(); }}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(20px)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 20px", color: C.textPrimary, cursor: "pointer", fontFamily: F_BODY, fontSize: 13, fontWeight: 600, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,200,200,0.08)"; e.currentTarget.style.borderColor = C.borderGlow; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0.7)"; e.currentTarget.style.borderColor = C.border; }}
          >← Back</button>
        </div>

        <div style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)", zIndex: 20, opacity: controlsVisible && w > 600 ? 1 : 0, transition: "opacity 0.3s", pointerEvents: "none", textAlign: "center" }}>
          <p style={{ fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 17, color: C.textPrimary, margin: 0, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", maxWidth: "50vw", textOverflow: "ellipsis" }}>{currentVideo.title}</p>
          <p style={{ fontFamily: F_BODY, fontSize: 11, color: C.textMuted, margin: "3px 0 0" }}>{currentVideoIndex + 1} / {allVideos.length}</p>
        </div>

        {!playing && !loading && !showCenterIcon && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3, pointerEvents: "none" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", background: "rgba(0,1,14,0.65)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, border: `2px solid rgba(0,200,200,0.3)`, color: C.cyanBright, boxShadow: `0 0 50px rgba(0,200,200,0.15)` }}>▶</div>
          </div>
        )}

        {/* Controls */}
        <div onClick={e => e.stopPropagation()} style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(0,1,14,0.99) 0%, rgba(0,1,14,0.55) 60%, transparent)",
          padding: "64px 20px 20px",
          opacity: controlsVisible ? 1 : 0, transition: "opacity 0.35s",
          pointerEvents: controlsVisible ? "auto" : "none", zIndex: 15,
        }}>
          <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: F_MONO, fontSize: 11, color: C.textMuted, minWidth: 40, textAlign: "right" }}>{fmt(currentTime)}</span>
            <div className="prog-track" ref={progressRef}
              style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, position: "relative", cursor: "pointer", transition: "height 0.15s" }}
              onMouseDown={e => { e.preventDefault(); e.stopPropagation(); scrubbingRef.current = true; seekToPosition(e.clientX); }}
              onTouchStart={e => { e.stopPropagation(); scrubbingRef.current = true; seekToPosition(e.touches[0].clientX); }}
              onClick={e => { e.stopPropagation(); seekToPosition(e.clientX); }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${buffered}%`, background: "rgba(255,255,255,0.1)", borderRadius: 4, pointerEvents: "none" }} />
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${Math.min(100, Math.max(0, progress))}%`, background: `linear-gradient(to right, ${C.cyanDeep}, ${C.cyan}, ${C.cyanBright})`, borderRadius: 4, pointerEvents: "none", boxShadow: `0 0 10px ${C.cyan}` }} />
              <div className="prog-thumb" style={{ position: "absolute", top: "50%", left: `${Math.min(100, Math.max(0, progress))}%`, transform: "translate(-50%,-50%)", width: 14, height: 14, background: C.cyanBright, borderRadius: "50%", boxShadow: `0 0 14px ${C.cyan}`, opacity: 0, transition: "opacity 0.2s", pointerEvents: "none" }} />
            </div>
            <span style={{ fontFamily: F_MONO, fontSize: 11, color: C.textMuted, minWidth: 40 }}>{fmt(duration)}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {w > 600 && cBtn(handlePrev, <SVGIcon path={ICONS.prev} />)}
              {cBtn(() => seek(-10), <span style={{ fontSize: 11, fontWeight: 700, fontFamily: F_BODY }}>−10</span>)}
              <button onClick={e => { e.stopPropagation(); togglePlay(); }}
                style={{ background: `linear-gradient(135deg, ${C.cyan} 0%, ${C.cyanDeep} 100%)`, border: "none", color: C.void, cursor: "pointer", width: 50, height: 50, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 24px ${C.glowA}`, flexShrink: 0, transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = `0 8px 32px ${C.glowA}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = `0 4px 24px ${C.glowA}`; }}
                onMouseDown={e => e.stopPropagation()}
              >
                <span style={{ pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {playing ? <SVGIcon path={ICONS.pause} size={24} /> : <SVGIcon path={ICONS.play} size={24} />}
                </span>
              </button>
              {cBtn(() => seek(10), <span style={{ fontSize: 11, fontWeight: 700, fontFamily: F_BODY }}>+10</span>)}
              {w > 600 && cBtn(handleNext, <SVGIcon path={ICONS.next} />)}
              {w > 768 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}
                  onMouseEnter={() => setVolumeHovered(true)}
                  onMouseLeave={() => setVolumeHovered(false)}
                >
                  {cBtn(toggleMute, muted || volume === 0 ? <SVGIcon path={ICONS.volMute} /> : <SVGIcon path={ICONS.volHigh} />)}
                  <div style={{ overflow: "hidden", width: volumeHovered ? 90 : 0, transition: "width 0.2s", display: "flex", alignItems: "center" }}>
                    <input type="range" min={0} max={1} step={0.02} value={muted ? 0 : volume}
                      onChange={e => { const v = parseFloat(e.target.value); setVolume(v); if (videoRef.current) videoRef.current.volume = v; setMuted(v === 0); }}
                      onClick={e => e.stopPropagation()}
                      style={{ width: 80, accentColor: C.cyan, cursor: "pointer" }}
                    />
                  </div>
                  {volumeHovered && <span style={{ fontFamily: F_MONO, fontSize: 10, color: C.textMuted, minWidth: 32 }}>{Math.round((muted ? 0 : volume) * 100)}%</span>}
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 4, position: "relative" }}>
              {w > 600 && (
                <button onClick={e => { e.stopPropagation(); setSubtitles(s => !s); }}
                  style={{ background: subtitles ? "rgba(0,200,200,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${subtitles ? C.borderGlow : "rgba(255,255,255,0.07)"}`, color: subtitles ? C.cyanBright : C.textPrimary, cursor: "pointer", width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontFamily: F_BODY, fontWeight: 700, flexShrink: 0, transition: "all 0.15s" }}>CC</button>
              )}
              <div ref={settingsRef} style={{ position: "relative" }}>
                <button onClick={e => { e.stopPropagation(); setSettingsOpen(o => !o); }}
                  style={{ background: settingsOpen ? "rgba(0,200,200,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${settingsOpen ? C.borderGlow : "rgba(255,255,255,0.07)"}`, color: settingsOpen ? C.cyanBright : C.textPrimary, cursor: "pointer", width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                  <span style={{ pointerEvents: "none", display: "flex", alignItems: "center" }}><SVGIcon path={ICONS.settings} size={18} /></span>
                </button>
                {settingsOpen && (
                  <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 56, right: 0, background: "rgba(2,3,20,0.99)", backdropFilter: "blur(32px)", border: `1px solid ${C.borderGlow}`, borderRadius: 16, padding: 22, width: 248, boxShadow: `0 32px 90px rgba(0,0,0,0.98), 0 0 40px rgba(0,200,200,0.05)`, animation: "fadeSlideUp 0.2s ease", zIndex: 25 }}>
                    <p style={{ fontSize: 9, fontWeight: 700, margin: "0 0 18px", color: C.cyan, letterSpacing: 3, textTransform: "uppercase", fontFamily: F_ACCENT }}>Settings</p>
                    {[
                      { title: "Quality", opts: ["Auto","1080p","720p","480p","360p"], val: quality, set: setQuality },
                      { title: "Speed", opts: [0.5,0.75,1,1.25,1.5,2].map(s => ({ label: `${s}×`, val: s })), val: speed, set: v => { setSpeed(v); if (videoRef.current) videoRef.current.playbackRate = v; } },
                    ].map(grp => (
                      <div key={grp.title} style={{ marginBottom: 18 }}>
                        <p style={{ fontSize: 9, color: C.textMuted, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 2, fontFamily: F_BODY }}>{grp.title}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {grp.opts.map(o => {
                            const isObj = typeof o === "object";
                            const label = isObj ? o.label : o;
                            const val = isObj ? o.val : o;
                            const active = grp.val === val;
                            return (
                              <button key={label} onClick={e => { e.stopPropagation(); grp.set(val); }}
                                style={{ background: active ? `linear-gradient(135deg, ${C.cyan}, ${C.cyanDeep})` : "rgba(255,255,255,0.05)", color: active ? C.void : C.textPrimary, border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 11, cursor: "pointer", fontFamily: F_BODY, fontWeight: active ? 700 : 400, transition: "all 0.15s" }}>{label}</button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    <div>
                      <p style={{ fontSize: 9, color: C.textMuted, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 2, fontFamily: F_BODY }}>Subtitles</p>
                      <button onClick={e => { e.stopPropagation(); setSubtitles(s => !s); }}
                        style={{ background: subtitles ? `linear-gradient(135deg, ${C.cyan}, ${C.cyanDeep})` : "rgba(255,255,255,0.05)", color: subtitles ? C.void : C.textPrimary, border: "none", borderRadius: 6, padding: "5px 18px", fontSize: 11, cursor: "pointer", fontFamily: F_BODY, transition: "all 0.15s" }}>{subtitles ? "ON ✓" : "OFF"}</button>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={e => { e.stopPropagation(); toggleFS(); }}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: C.textPrimary, cursor: "pointer", width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,200,200,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
              ><span style={{ pointerEvents: "none", display: "flex", alignItems: "center" }}>{fullscreen ? <SVGIcon path={ICONS.exitFS} /> : <SVGIcon path={ICONS.fullscreen} />}</span></button>
              <button onClick={e => { e.stopPropagation(); onClose(); }}
                style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)", color: C.violetBright, cursor: "pointer", width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.18)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(124,58,237,0.07)"}
              >✕</button>
            </div>
          </div>
        </div>
      </div>

      {w > 1024 && (
        <div className="side-panel" style={{ width: 288, background: "rgba(2,3,20,0.99)", borderLeft: `1px solid ${C.border}`, overflowY: "auto", flexShrink: 0, padding: "22px 0" }}>
          <div style={{ padding: "0 18px 18px" }}>
            <p style={{ fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 17, fontWeight: 700, color: C.textPrimary, margin: 0 }}>More Like This</p>
            <p style={{ fontFamily: F_BODY, fontSize: 10, color: C.textFaint, margin: "4px 0 0", letterSpacing: 2, textTransform: "uppercase" }}>{currentVideo.genre}</p>
          </div>
          {relatedVideos.map(v => (
            <button key={v.id} onClick={() => { const idx = allVideos.findIndex(a => a.id === v.id); if (idx !== -1) switchVideo(idx); }}
              style={{ display: "flex", gap: 12, padding: "10px 18px", background: v.id === currentVideo.id ? "rgba(0,200,200,0.04)" : "transparent", border: "none", cursor: "pointer", borderLeft: `3px solid ${v.id === currentVideo.id ? C.cyan : "transparent"}`, transition: "all 0.2s", textAlign: "left", width: "100%" }}
              onMouseEnter={e => { if (v.id !== currentVideo.id) e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
              onMouseLeave={e => { if (v.id !== currentVideo.id) e.currentTarget.style.background = "transparent"; }}
            >
              <img src={v.thumbnail} alt={v.title} style={{ width: 74, height: 52, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} onError={e => { e.target.src = `https://picsum.photos/seed/${v.id}s/400/600`; }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 12, fontWeight: 700, color: v.id === currentVideo.id ? C.cyanBright : C.textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</p>
                <p style={{ fontFamily: F_BODY, fontSize: 10, color: C.textMuted, margin: "3px 0 0" }}>{v.year} · {v.duration}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════ */
function HomePage({ onPlay, onDetail, onWatchlist, watchlist }) {
  const featured = ALL_VIDEOS.find(v => v.featured);
  const { w } = useWindowSize();
  return (
    <div style={{ background: C.void, minHeight: "100vh" }}>
      <HeroBanner video={featured} onPlay={onPlay} onWatchlist={onWatchlist} isInWatchlist={watchlist.some(wv => wv.id === featured.id)} />
      <div style={{ marginTop: w < 768 ? -30 : -60, position: "relative", zIndex: 2, paddingTop: 24 }}>
        {CATEGORIES.map(cat => {
          const vids = ALL_VIDEOS.filter(v => v.categories.includes(cat.key));
          return <CategoryRow key={cat.key} label={cat.label} videos={vids} onPlay={onPlay} onDetail={onDetail} onWatchlist={onWatchlist} watchlist={watchlist} />;
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   BROWSE PAGE
══════════════════════════════════════════════ */
function BrowsePage({ onPlay, onDetail, onWatchlist, watchlist }) {
  const [genre, setGenre] = useState("All");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("Default");
  const { w } = useWindowSize();
  const genres = ["All", ...new Set(ALL_VIDEOS.map(v => v.genre))];
  const types = ["All", "Movie", "Series", "Short"];
  let filtered = ALL_VIDEOS.filter(v => (genre === "All" || v.genre === genre) && (type === "All" || v.type === type));
  if (sort === "Year") filtered = [...filtered].sort((a, b) => b.year - a.year);
  if (sort === "Title") filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div style={{ background: C.void, minHeight: "100vh", padding: "90px clamp(16px,4vw,64px) 80px" }}>
      <div style={{ marginBottom: 42 }}>
        <p style={{ fontFamily: F_ACCENT, fontSize: 9, fontWeight: 700, color: C.textMuted, letterSpacing: 5, textTransform: "uppercase", marginBottom: 10 }}>Discover</p>
        <h1 style={{ fontFamily: F_ACCENT, fontSize: w > 768 ? 44 : 30, fontWeight: 900, color: C.textPrimary, margin: "0 0 12px" }}>
          <GoldText>Browse All</GoldText>
        </h1>
        <div style={{ width: 72, height: 2, background: `linear-gradient(to right, ${C.cyan}, ${C.violet}, transparent)`, boxShadow: `0 0 12px ${C.cyan}` }} />
      </div>

      <div style={{ background: "rgba(6,10,30,0.65)", backdropFilter: "blur(20px)", border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 24px", marginBottom: 36, display: "flex", flexDirection: "column", gap: 16 }}>
        {[
          { label: "Genre", opts: genres, val: genre, set: setGenre },
          { label: "Type", opts: types, val: type, set: setType },
          { label: "Sort", opts: ["Default","Year","Title"], val: sort, set: setSort },
        ].map(g => (
          <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <span style={{ fontFamily: F_ACCENT, fontSize: 8, fontWeight: 700, color: C.textMuted, minWidth: 44, textTransform: "uppercase", letterSpacing: 3 }}>{g.label}</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {g.opts.map(o => (
                <button key={o} onClick={() => g.set(o)} style={{
                  background: g.val === o ? `linear-gradient(135deg, ${C.cyanDeep}, ${C.cyan})` : "rgba(255,255,255,0.03)",
                  color: g.val === o ? C.void : C.textMuted,
                  border: `1px solid ${g.val === o ? C.cyan : C.border}`,
                  borderRadius: 100, padding: "5px 18px", fontSize: 11, cursor: "pointer",
                  fontFamily: F_BODY, fontWeight: g.val === o ? 700 : 400, transition: "all 0.2s",
                  boxShadow: g.val === o ? `0 0 18px ${C.glowA}` : "none",
                }}>{o}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: F_BODY, color: C.textFaint, fontSize: 10, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 28 }}>{filtered.length} titles found</p>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${w > 480 ? 188 : 152}px, 1fr))`, gap: w > 480 ? 22 : 12 }}>
        {filtered.map((v, i) => (
          <VideoCard key={v.id} video={v} index={i} onPlay={onPlay} onDetail={onDetail} onWatchlist={onWatchlist} isInWatchlist={watchlist.some(wl => wl.id === v.id)} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   DETAIL PAGE
══════════════════════════════════════════════ */
function DetailPage({ video, onPlay, onWatchlist, isInWatchlist, onDetail }) {
  const related = ALL_VIDEOS.filter(v => v.id !== video.id && (v.genre === video.genre || v.categories.some(c => video.categories.includes(c)))).slice(0, 8);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { w } = useWindowSize();
  return (
    <div style={{ background: C.void, minHeight: "100vh", paddingTop: 70, paddingBottom: 80 }}>
      <div style={{ position: "relative", height: w > 768 ? "62vh" : "42vh", minHeight: 270 }}>
        <img src={video.banner} alt={video.title}
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.target.src = `https://picsum.photos/seed/${video.id}bg/1400/700`; setImgLoaded(true); }}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", opacity: imgLoaded ? 1 : 0, transition: "opacity 0.9s", filter: "saturate(1.1) contrast(1.05)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${C.void} 0%, rgba(0,1,14,0.4) 65%, transparent)` }} />
      </div>

      <div style={{ padding: "0 clamp(20px,4vw,76px)", marginTop: w > 768 ? -160 : -80, position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", gap: "clamp(22px,4vw,50px)", flexDirection: w > 768 ? "row" : "column", alignItems: w > 768 ? "flex-start" : "center", textAlign: w > 768 ? "left" : "center" }}>
          <img src={video.thumbnail} alt={video.title}
            style={{ width: w < 480 ? 158 : 220, height: w < 480 ? 237 : 330, objectFit: "cover", borderRadius: 16, flexShrink: 0, boxShadow: `0 32px 90px rgba(0,0,0,0.9), 0 0 0 1px rgba(0,200,200,0.12), 0 0 60px rgba(0,200,200,0.04)` }}
            onError={e => { e.target.src = `https://picsum.photos/seed/${video.id}th/400/600`; }}
          />
          <div style={{ flex: 1, minWidth: 0, paddingTop: w > 768 ? 100 : 28 }}>
            <h1 style={{ fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: "clamp(24px,4.2vw,56px)", fontWeight: 900, color: C.textPrimary, margin: "0 0 18px", lineHeight: 1.03 }}>{video.title}</h1>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22, justifyContent: w > 768 ? "flex-start" : "center" }}>
              {[video.year, video.duration, video.genre, video.rating, video.type].map((t, i) => (
                <span key={i} style={{ fontFamily: F_BODY, fontSize: 11, fontWeight: 600, color: C.textMuted, padding: "4px 13px", background: "rgba(255,255,255,0.03)", borderRadius: 6, border: `1px solid ${C.border}`, letterSpacing: 0.5 }}>{t}</span>
              ))}
            </div>
            <p style={{ fontFamily: F_BODY, fontSize: 15, color: C.textMuted, lineHeight: 1.82, maxWidth: 590, marginBottom: 30, marginLeft: w > 768 ? 0 : "auto", marginRight: w > 768 ? 0 : "auto" }}>{video.description}</p>
            <p style={{ fontFamily: F_BODY, fontSize: 12, color: C.textFaint, marginBottom: 30 }}>Cast: <span style={{ color: C.textMuted }}>{video.cast.join(", ")}</span></p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: w > 768 ? "flex-start" : "center" }}>
              <button onClick={() => onPlay(video)} style={{ background: `linear-gradient(135deg, ${C.cyanBright}, ${C.cyan})`, color: C.void, border: "none", padding: "13px 42px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: F_BODY, boxShadow: `0 6px 32px ${C.glowA}`, letterSpacing: 0.5, transition: "all 0.22s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >▶ Play Now</button>
              <button onClick={() => onWatchlist(video)} style={{ background: isInWatchlist ? "rgba(0,200,200,0.06)" : "rgba(255,255,255,0.04)", color: C.textPrimary, border: `1px solid ${isInWatchlist ? C.borderGlow : C.border}`, padding: "13px 32px", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: F_DISPLAY, fontStyle: "italic", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.cyan; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = isInWatchlist ? C.borderGlow : C.border; }}
              >{isInWatchlist ? "✓ In Watchlist" : "＋ Watchlist"}</button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 64, paddingBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ width: 3, height: 14, background: C.cyanBright, borderRadius: 2 }} />
                <div style={{ width: 3, height: 6, background: C.violetBright, borderRadius: 2 }} />
              </div>
              <h2 style={{ fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0 }}><GoldText>More Like This</GoldText></h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${w < 480 ? 152 : 188}px, 1fr))`, gap: 20 }}>
              {related.map((v, i) => <VideoCard key={v.id} video={v} index={i} onPlay={onPlay} onDetail={onDetail} onWatchlist={onWatchlist} isInWatchlist={false} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SEARCH PAGE
══════════════════════════════════════════════ */
function SearchPage({ query, onPlay, onDetail, onWatchlist, watchlist }) {
  const results = ALL_VIDEOS.filter(v =>
    v.title.toLowerCase().includes(query.toLowerCase()) ||
    v.genre.toLowerCase().includes(query.toLowerCase()) ||
    v.type.toLowerCase().includes(query.toLowerCase())
  );
  const { w } = useWindowSize();
  return (
    <div style={{ background: C.void, minHeight: "100vh", padding: "104px clamp(16px,4vw,64px) 80px" }}>
      <h1 style={{ fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: w > 768 ? 34 : 26, fontWeight: 900, color: C.textPrimary, marginBottom: 8 }}>Search Results</h1>
      <p style={{ fontFamily: F_BODY, fontSize: 11, color: C.textMuted, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 38 }}>
        {results.length} result{results.length !== 1 ? "s" : ""} for <span style={{ color: C.cyanBright }}>"{query}"</span>
      </p>
      {results.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 100 }}>
          <div style={{ fontSize: 80, marginBottom: 22, opacity: 0.2 }}>🎬</div>
          <p style={{ fontFamily: F_DISPLAY, fontStyle: "italic", color: C.textMuted, fontSize: 22 }}>Nothing found. Try a different title or genre.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${w > 480 ? 188 : 152}px, 1fr))`, gap: 22 }}>
          {results.map((v, i) => <VideoCard key={v.id} video={v} index={i} onPlay={onPlay} onDetail={onDetail} onWatchlist={onWatchlist} isInWatchlist={watchlist.some(wl => wl.id === v.id)} />)}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   WATCHLIST PAGE
══════════════════════════════════════════════ */
function WatchlistPage({ watchlist, onPlay, onDetail, onWatchlist }) {
  const { w } = useWindowSize();
  return (
    <div style={{ background: C.void, minHeight: "100vh", padding: "104px clamp(16px,4vw,64px) 80px" }}>
      <p style={{ fontFamily: F_ACCENT, fontSize: 9, fontWeight: 700, color: C.textMuted, letterSpacing: 5, textTransform: "uppercase", marginBottom: 10 }}>Your Collection</p>
      <h1 style={{ fontFamily: F_ACCENT, fontSize: w > 768 ? 40 : 28, fontWeight: 900, color: C.textPrimary, marginBottom: 10 }}>
        <GoldText>My Watchlist</GoldText>
      </h1>
      <div style={{ width: 72, height: 2, background: `linear-gradient(to right, ${C.cyan}, ${C.violet}, transparent)`, marginBottom: 40, boxShadow: `0 0 12px ${C.cyan}` }} />
      {watchlist.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 100 }}>
          <div style={{ fontSize: 90, marginBottom: 22, opacity: 0.12 }}>☆</div>
          <h2 style={{ fontFamily: F_DISPLAY, fontStyle: "italic", color: C.textMuted, fontSize: w > 768 ? 24 : 20, fontWeight: 400 }}>Your watchlist is empty</h2>
          <p style={{ fontFamily: F_BODY, color: C.textFaint, fontSize: 13, marginTop: 10 }}>Browse titles and add them to watch later</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${w > 480 ? 188 : 152}px, 1fr))`, gap: 22 }}>
          {watchlist.map((v, i) => <VideoCard key={v.id} video={v} index={i} onPlay={onPlay} onDetail={onDetail} onWatchlist={onWatchlist} isInWatchlist={true} />)}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   CONTACT PAGE
══════════════════════════════════════════════ */
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { w } = useWindowSize();

  const faqs = [
    { q: "How do I cancel my subscription?", a: "Go to Account > Membership > Cancel. You can cancel anytime with no fees." },
    { q: "How many screens can I stream on?", a: "Premium plan: 4 screens. Standard: 2 screens. Basic: 1 screen simultaneously." },
    { q: "Is Streamify available on all devices?", a: "Yes — iOS, Android, Smart TVs, PlayStation, Xbox, and all modern browsers." },
    { q: "Can I download content for offline viewing?", a: "Yes. Premium and Standard plans allow up to 25 downloads on mobile devices." },
    { q: "How do I change video quality?", a: "Open any video, press ⚙ in the player, and select your preferred quality." },
  ];

  return (
    <div style={{ background: C.void, minHeight: "100vh", padding: "104px clamp(16px,4vw,64px) 80px" }}>
      <p style={{ fontFamily: F_ACCENT, fontSize: 9, fontWeight: 700, color: C.textMuted, letterSpacing: 5, textTransform: "uppercase", marginBottom: 10 }}>Get in Touch</p>
      <h1 style={{ fontFamily: F_ACCENT, fontSize: w > 768 ? 40 : 28, fontWeight: 900, color: C.textPrimary, marginBottom: 12 }}>
        <GoldText>Contact & Support</GoldText>
      </h1>
      <div style={{ width: 72, height: 2, background: `linear-gradient(to right, ${C.cyan}, ${C.violet}, transparent)`, marginBottom: 16, boxShadow: `0 0 12px ${C.cyan}` }} />
      <p style={{ fontFamily: F_BODY, color: C.textMuted, fontSize: 14, lineHeight: 1.7, marginBottom: 58, maxWidth: 520 }}>We're here to help. Send us a message or browse the frequently asked questions below.</p>

      <div style={{ display: "grid", gridTemplateColumns: w > 900 ? "1fr 1fr" : "1fr", gap: w > 900 ? 70 : 48 }}>
        <div>
          <h2 style={{ fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 26, fontWeight: 700, color: C.textPrimary, marginBottom: 32 }}>Send a Message</h2>
          {sent ? (
            <div style={{ textAlign: "center", padding: 56, background: "rgba(0,200,200,0.03)", border: `1px solid ${C.borderGlow}`, borderRadius: 20 }}>
              <div style={{ fontSize: 56, marginBottom: 16, color: C.cyanBright, animation: "glowFlare 2s ease-in-out infinite" }}>✦</div>
              <p style={{ fontFamily: F_DISPLAY, fontStyle: "italic", color: C.textPrimary, fontSize: 24, fontWeight: 700 }}>Message Sent!</p>
              <p style={{ fontFamily: F_BODY, color: C.textMuted, marginTop: 10 }}>We'll reply within 24 hours.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {[["name","Full Name","text"],["email","Email Address","email"]].map(([k, label, type]) => (
                <div key={k}>
                  <label style={{ fontFamily: F_ACCENT, fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: C.textMuted, display: "block", marginBottom: 9 }}>{label}</label>
                  <input type={type} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.025)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 20px", color: C.textPrimary, fontFamily: F_BODY, fontSize: 14, outline: "none", transition: "border-color 0.25s, box-shadow 0.25s", boxSizing: "border-box" }}
                    onFocus={e => { e.target.style.borderColor = C.borderGlow; e.target.style.boxShadow = `0 0 22px rgba(0,200,200,0.07)`; }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontFamily: F_ACCENT, fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: C.textMuted, display: "block", marginBottom: 9 }}>Message</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5}
                  style={{ width: "100%", background: "rgba(255,255,255,0.025)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 20px", color: C.textPrimary, fontFamily: F_BODY, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", transition: "border-color 0.25s, box-shadow 0.25s" }}
                  onFocus={e => { e.target.style.borderColor = C.borderGlow; e.target.style.boxShadow = `0 0 22px rgba(0,200,200,0.07)`; }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                />
              </div>
              <button onClick={() => {
                if (form.name && form.email && form.message) {
                  const msg = `*New Contact Message from Streamify*\n\n*Name:* ${form.name}\n*Email:* ${form.email}\n*Message:*\n${form.message}`;
                  window.open(`https://wa.me/918431715675?text=${encodeURIComponent(msg)}`, "_blank");
                  setSent(true);
                }
              }} style={{
                background: `linear-gradient(135deg, ${C.cyanBright} 0%, ${C.cyan} 50%, ${C.cyanDeep} 100%)`,
                color: C.void, border: "none", borderRadius: 10, padding: "15px 0",
                fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: F_ACCENT,
                textTransform: "uppercase", letterSpacing: 4,
                boxShadow: `0 6px 32px ${C.glowA}`, transition: "all 0.25s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 48px ${C.glowA}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 6px 32px ${C.glowA}`; }}
              >Send Message ✦</button>
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 26, fontWeight: 700, color: C.textPrimary, marginBottom: 24 }}>Frequently Asked</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {faqs.map((f, i) => (
              <div key={i}
                onMouseEnter={() => setOpenFaq(i)}
                onMouseLeave={() => setOpenFaq(null)}
                style={{ border: `1px solid ${openFaq === i ? C.borderGlow : C.border}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.3s, box-shadow 0.3s", boxShadow: openFaq === i ? `0 0 24px rgba(0,200,200,0.05)` : "none" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", background: openFaq === i ? "rgba(0,200,200,0.03)" : "rgba(255,255,255,0.018)", border: "none", color: C.textPrimary, padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 14, fontWeight: 600, textAlign: "left" }}
                >
                  {f.q}
                  <span style={{ color: C.cyan, fontSize: 14, transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.25s", flexShrink: 0, marginLeft: 12 }}>∨</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "14px 22px 18px", background: "rgba(0,0,0,0.2)", borderTop: `1px solid ${C.border}`, animation: "fadeSlideUp 0.2s ease" }}>
                    <p style={{ fontFamily: F_BODY, fontSize: 14, color: C.textMuted, margin: 0, lineHeight: 1.78 }}>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   AUTH MODAL
══════════════════════════════════════════════ */
function AuthModal({ onClose }) {
  const [mode, setMode] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1500);
  };

  if (success) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,1,10,0.96)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(32px)", animation: "scaleIn 0.3s ease" }}>
        <div style={{ maxWidth: 420, width: "90%", textAlign: "center", padding: "60px 24px" }}>
          <div style={{ fontSize: 72, marginBottom: 24, color: C.cyanBright, animation: "glowFlare 2s ease-in-out infinite" }}>✦</div>
          <h2 style={{ fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 32, fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>
            <GoldText>{mode === "signin" ? "Welcome Back!" : "Account Created!"}</GoldText>
          </h2>
          <p style={{ fontFamily: F_BODY, fontSize: 15, color: C.textMuted, marginBottom: 40, lineHeight: 1.7 }}>
            {mode === "signin" ? "You have successfully signed in. Enjoy unlimited streaming!" : "Your account has been created successfully. Welcome to Streamify!"}
          </p>
          <button onClick={onClose} style={{ background: `linear-gradient(135deg, ${C.cyanBright} 0%, ${C.cyan} 100%)`, color: C.void, border: "none", borderRadius: 10, padding: "16px 48px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F_ACCENT, textTransform: "uppercase", letterSpacing: 4, boxShadow: `0 6px 32px ${C.glowA}` }}>Continue Browsing</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,1,10,0.96)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(32px)", animation: "scaleIn 0.3s ease" }}>
      <button onClick={onClose} style={{ position: "absolute", top: 24, right: 24, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, color: C.textMuted, width: 44, height: 44, borderRadius: 10, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.color = C.cyanBright; e.currentTarget.style.borderColor = C.borderGlow; }}
        onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; }}
      >✕</button>

      <div style={{ maxWidth: 420, width: "90%", padding: "24px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontFamily: F_ACCENT, fontSize: 36, fontWeight: 900, color: C.cyanBright, textShadow: `0 0 20px ${C.glowA}` }}>S</span>
          <h2 style={{ fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 28, fontWeight: 700, color: C.textPrimary, marginTop: 16, marginBottom: 8 }}>
            <GoldText>{mode === "signin" ? "Sign In" : "Create Account"}</GoldText>
          </h2>
          <p style={{ fontFamily: F_BODY, fontSize: 14, color: C.textMuted }}>
            {mode === "signin" ? "Sign in to your Streamify account" : "Create your Streamify account today"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {mode === "signup" && (
            <div>
              <label style={{ fontFamily: F_ACCENT, fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: C.textMuted, display: "block", marginBottom: 9 }}>Full Name</label>
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ width: "100%", background: "rgba(255,255,255,0.025)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 20px", color: C.textPrimary, fontFamily: F_BODY, fontSize: 14, outline: "none", transition: "border-color 0.25s, box-shadow 0.25s", boxSizing: "border-box" }}
                onFocus={e => { e.target.style.borderColor = C.borderGlow; e.target.style.boxShadow = `0 0 22px rgba(0,200,200,0.07)`; }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
              />
            </div>
          )}
          {[["email","Email Address","email"],["password","Password","password"]].map(([k, label, type]) => (
            <div key={k}>
              <label style={{ fontFamily: F_ACCENT, fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: C.textMuted, display: "block", marginBottom: 9 }}>{label}</label>
              <input type={type} required value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                style={{ width: "100%", background: "rgba(255,255,255,0.025)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 20px", color: C.textPrimary, fontFamily: F_BODY, fontSize: 14, outline: "none", transition: "border-color 0.25s, box-shadow 0.25s", boxSizing: "border-box" }}
                onFocus={e => { e.target.style.borderColor = C.borderGlow; e.target.style.boxShadow = `0 0 22px rgba(0,200,200,0.07)`; }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ background: `linear-gradient(135deg, ${C.cyanBright} 0%, ${C.cyan} 100%)`, color: C.void, border: "none", borderRadius: 10, padding: "16px 0", fontSize: 11, fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: F_ACCENT, textTransform: "uppercase", letterSpacing: 4, boxShadow: `0 6px 32px ${C.glowA}`, marginTop: 8, opacity: loading ? 0.6 : 1, transition: "all 0.25s" }}>
            {loading ? "Processing..." : mode === "signin" ? "Sign In →" : "Create Account →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <p style={{ fontFamily: F_BODY, fontSize: 13, color: C.textMuted }}>
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} style={{ background: "none", border: "none", color: C.cyanBright, cursor: "pointer", fontFamily: F_BODY, fontSize: 13, fontWeight: 600 }}>
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════ */
function Footer({ setPage }) {
  return (
    <footer style={{ background: "rgba(0,1,14,0.99)", borderTop: `1px solid ${C.border}`, padding: "60px clamp(16px,4vw,64px) 28px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "15%", width: 500, height: 1, background: `linear-gradient(to right, transparent, ${C.cyanDeep}, ${C.cyan}, ${C.cyanDeep}, transparent)`, boxShadow: `0 0 28px ${C.cyan}`, opacity: 0.35 }} />
      <div style={{ position: "absolute", top: -100, right: -80, width: 300, height: 300, background: `radial-gradient(circle, rgba(0,200,200,0.025) 0%, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -60, width: 250, height: 250, background: `radial-gradient(circle, rgba(124,58,237,0.025) 0%, transparent 60%)`, pointerEvents: "none" }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 44, marginBottom: 52, position: "relative", zIndex: 1 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
            <span style={{ fontFamily: F_ACCENT, fontWeight: 900, fontSize: 24, color: C.cyanBright, textShadow: `0 0 20px ${C.glowA}` }}>S</span>
            <span style={{ fontFamily: F_ACCENT, fontWeight: 700, fontSize: 16, color: C.textPrimary, letterSpacing: "0.08em" }}>treamify</span>
          </div>
          <p style={{ fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 13, color: C.textFaint, lineHeight: 1.75 }}>Premium streaming, redefined. Anywhere. Anytime.</p>
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            {[C.cyanBright, C.cyan, C.violetBright].map((col, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: col, boxShadow: `0 0 8px ${col}`, animation: `glowFlare ${2 + i * 0.4}s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
        </div>

        {[
          { title: "Navigate", links: [["Home","home"],["Browse","browse"],["Watchlist","watchlist"],["Contact","contact"]] },
          { title: "Categories", links: CATEGORIES.slice(0, 4).map(c => [c.label.replace(/^[^\s]+\s*/, ''), "browse"]) },
          { title: "\u00A0", links: CATEGORIES.slice(4).map(c => [c.label.replace(/^[^\s]+\s*/, ''), "browse"]) },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{ fontFamily: F_ACCENT, fontSize: 8, fontWeight: 700, color: C.textFaint, margin: "0 0 18px", textTransform: "uppercase", letterSpacing: 3 }}>{col.title}</h4>
            {col.links.map(([label, pg]) => (
              <button key={label} onClick={() => setPage(pg)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: C.textMuted, fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 13, cursor: "pointer", padding: "5px 0", transition: "all 0.2s", textAlign: "left" }}
                onMouseEnter={e => { e.currentTarget.style.color = C.cyanBright; e.currentTarget.style.paddingLeft = "6px"; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.paddingLeft = "0"; }}
              >{label}</button>
            ))}
          </div>
        ))}

        <div>
          <h4 style={{ fontFamily: F_ACCENT, fontSize: 8, fontWeight: 700, color: C.textFaint, margin: "0 0 18px", textTransform: "uppercase", letterSpacing: 3 }}>Follow Us</h4>
          {[["𝕏","Twitter / X","https://twitter.com"],["▶","YouTube","https://youtube.com"],["📷","Instagram","https://instagram.com"],["f","Facebook","https://facebook.com"]].map(([icon, name, url]) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 13, color: C.textMuted, margin: "8px 0", textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = C.cyanBright; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.transform = "translateX(0)"; }}
            >
              <span style={{ width: 28, height: 28, background: "rgba(255,255,255,0.03)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{icon}</span>
              {name}
            </a>
          ))}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, position: "relative", zIndex: 1 }}>
        <p style={{ fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 11, color: C.textFaint }}>© 2025 Streamify. All rights reserved.</p>
        <div style={{ display: "flex", gap: 6 }}>
          {["Privacy", "Terms", "Cookies"].map((t, i) => (
            <span key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span style={{ color: C.textFaint, fontSize: 10 }}>·</span>}
              <span style={{ fontFamily: F_DISPLAY, fontStyle: "italic", fontSize: 11, color: C.textFaint, cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = C.textMuted}
                onMouseLeave={e => e.currentTarget.style.color = C.textFaint}
              >{t}</span>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════ */
export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [page, setPage] = useState("home");
  const [playingVideo, setPlayingVideo] = useState(null);
  const [detailVideo, setDetailVideo] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    injectFonts();
    const style = document.createElement("style");
    style.id = "sf-global";
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    document.body.style.margin = "0";
    document.body.style.background = C.void;
    document.body.style.overflowX = "hidden";
    document.body.style.transition = "background 0.4s ease, color 0.4s ease";

    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "viewport"; document.head.appendChild(meta); }
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
  }, []);

  const handlePlay = useCallback(v => { setPlayingVideo(v); setDetailVideo(null); }, []);
  const handleDetail = useCallback(v => { setDetailVideo(v); setPage("detail"); window.scrollTo(0, 0); }, []);
  const handleWatchlist = useCallback(v => {
    setWatchlist(prev => prev.some(w => w.id === v.id) ? prev.filter(w => w.id !== v.id) : [...prev, v]);
  }, []);
  const handleSetPage = p => {
    setPage(p); setDetailVideo(null);
    if (p !== "search") setSearchQuery("");
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handleOpenAuth = () => setAuthModalOpen(true);
    window.addEventListener('openAuthModal', handleOpenAuth);
    return () => window.removeEventListener('openAuthModal', handleOpenAuth);
  }, []);

  if (!introDone) return <IntroAnimation onDone={() => setIntroDone(true)} />;

  const renderPage = () => {
    if (detailVideo && page === "detail") {
      return <DetailPage video={detailVideo} onPlay={handlePlay} onWatchlist={handleWatchlist}
        isInWatchlist={watchlist.some(w => w.id === detailVideo.id)} onDetail={handleDetail} />;
    }
    switch (page) {
      case "home":      return <HomePage onPlay={handlePlay} onDetail={handleDetail} onWatchlist={handleWatchlist} watchlist={watchlist} />;
      case "browse":    return <BrowsePage onPlay={handlePlay} onDetail={handleDetail} onWatchlist={handleWatchlist} watchlist={watchlist} />;
      case "watchlist": return <WatchlistPage watchlist={watchlist} onPlay={handlePlay} onDetail={handleDetail} onWatchlist={handleWatchlist} />;
      case "search":    return <SearchPage query={searchQuery} onPlay={handlePlay} onDetail={handleDetail} onWatchlist={handleWatchlist} watchlist={watchlist} />;
      case "contact":   return <ContactPage />;
      default:          return <HomePage onPlay={handlePlay} onDetail={handleDetail} onWatchlist={handleWatchlist} watchlist={watchlist} />;
    }
  };

  return (
    <div style={{ background: C.void, minHeight: "100vh" }}>
      <Navbar page={detailVideo ? "detail" : page} setPage={handleSetPage}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery} watchlist={watchlist} />
      {renderPage()}
      {page !== "detail" && !detailVideo && <Footer setPage={handleSetPage} />}
      {playingVideo && (
        <VideoPlayer video={playingVideo} allVideos={ALL_VIDEOS} onClose={() => setPlayingVideo(null)} onDetail={handleDetail} />
      )}
      {authModalOpen && (
        <AuthModal onClose={() => setAuthModalOpen(false)} />
      )}
    </div>
  );
}