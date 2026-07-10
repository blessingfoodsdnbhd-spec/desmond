// 立体发光水晶能量图标（对照参考图）：水晶体 + 环绕能量光环(土星环) + 星光
// 全部 SVG 渐变绘制，配合卡片外发光。

// 环绕能量光环（横向椭圆，双圈，发光）
function OrbitRing({ color = '#7cc4ff' }) {
  return (
    <g opacity="0.95">
      <ellipse cx="24" cy="27" rx="21.5" ry="6.6" fill="none" stroke={color} strokeWidth="1.4" opacity="0.85" transform="rotate(-16 24 27)" style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
      <ellipse cx="24" cy="27" rx="15" ry="4" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" transform="rotate(-16 24 27)" />
    </g>
  )
}

function Sparks({ pts, color = '#ffffff' }) {
  return (
    <>
      {pts.map(([x, y, r], i) => (
        <g key={i} className="animate-twinkle" style={{ animationDelay: `${(i % 4) * 0.5}s`, transformOrigin: `${x}px ${y}px` }}>
          <path d={`M${x} ${y - r} L${x + r * 0.32} ${y - r * 0.32} L${x + r} ${y} L${x + r * 0.32} ${y + r * 0.32} L${x} ${y + r} L${x - r * 0.32} ${y + r * 0.32} L${x - r} ${y} L${x - r * 0.32} ${y - r * 0.32} Z`} fill={color} />
        </g>
      ))}
    </>
  )
}

// 自由设计 — 蓝白发光水晶体（簇尖）
export function GemCrystalIcon({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="ci-crys" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#bfe6ff" />
          <stop offset="100%" stopColor="#5aa8e6" />
        </linearGradient>
        <filter id="ci-g1" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="2.6" floodColor="#8fd0ff" floodOpacity="0.95" /></filter>
      </defs>
      <OrbitRing color="#7cc4ff" />
      <g filter="url(#ci-g1)">
        {/* 主晶体 */}
        <path d="M24 5 L31 18 L27 32 L24 36 L21 32 L17 18 Z" fill="url(#ci-crys)" />
        <path d="M24 5 L31 18 L24 20 Z" fill="#ffffff" fillOpacity="0.75" />
        <path d="M24 5 L17 18 L24 20 Z" fill="#ffffff" fillOpacity="0.45" />
        <path d="M17 18 L24 20 L21 32 Z" fill="#3d84c4" fillOpacity="0.35" />
        <path d="M31 18 L24 20 L27 32 Z" fill="#2f78bd" fillOpacity="0.22" />
        {/* 侧小晶 */}
        <path d="M15 20 L18.5 26 L16 33 L13.5 26 Z" fill="url(#ci-crys)" opacity="0.9" />
        <path d="M33 21 L30 27 L32 33 L34.5 27 Z" fill="url(#ci-crys)" opacity="0.85" />
      </g>
      <Sparks pts={[[13, 12, 2], [37, 15, 1.6], [34, 34, 1.4]]} color="#eaf7ff" />
    </svg>
  )
}

// AI 推荐 — 紫色发光钻（八面体）
export function DiamondSparkIcon({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="ci-dia" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#f0d9ff" />
          <stop offset="45%" stopColor="#b98cff" />
          <stop offset="100%" stopColor="#6a34d6" />
        </linearGradient>
        <filter id="ci-g2" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="2.8" floodColor="#b98cff" floodOpacity="0.95" /></filter>
      </defs>
      <OrbitRing color="#b98cff" />
      <g filter="url(#ci-g2)">
        {/* 八面体钻 */}
        <path d="M24 7 L34 20 L24 24 L14 20 Z" fill="url(#ci-dia)" />
        <path d="M14 20 L24 24 L24 39 Z" fill="#7a3fd6" />
        <path d="M34 20 L24 24 L24 39 Z" fill="#5a25b0" />
        <path d="M24 7 L34 20 L24 24 Z" fill="#ffffff" fillOpacity="0.5" />
        <path d="M24 7 L14 20 L24 24 Z" fill="#ffffff" fillOpacity="0.3" />
        <path d="M14 20 L34 20" stroke="#f3e6ff" strokeOpacity="0.6" strokeWidth="0.7" />
      </g>
      <Sparks pts={[[36, 9, 2.2], [12, 16, 1.6], [38, 30, 1.5], [11, 30, 1.3]]} color="#fbefff" />
    </svg>
  )
}

// 能量解读 — 深紫能量球 + 发光闪电
export function EnergyOrbIcon({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <radialGradient id="ci-orb" cx="40%" cy="34%" r="68%">
          <stop offset="0%" stopColor="#c9d6ff" />
          <stop offset="45%" stopColor="#6a63e6" />
          <stop offset="100%" stopColor="#2a1d80" />
        </radialGradient>
        <filter id="ci-g3" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="2.8" floodColor="#7c8cff" floodOpacity="0.95" /></filter>
      </defs>
      <OrbitRing color="#8fb4ff" />
      <g filter="url(#ci-g3)">
        <circle cx="24" cy="22" r="13" fill="url(#ci-orb)" />
        <ellipse cx="19" cy="16" rx="4.6" ry="2.8" fill="#ffffff" opacity="0.6" transform="rotate(-26 19 16)" />
      </g>
      <g style={{ filter: 'drop-shadow(0 0 2.4px #ffe680)' }}>
        <path d="M27 12 L18 24 L23 24 L20.5 33 L30 20 L25 20 Z" fill="#fff7c8" stroke="#ffe680" strokeWidth="0.7" strokeLinejoin="round" />
      </g>
      <Sparks pts={[[37, 13, 1.8], [11, 18, 1.5]]} color="#eaf0ff" />
    </svg>
  )
}

// 一键下单 — 金色发光礼盒开盖
export function GiftGlowIcon({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="ci-box2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ffe6a6" /><stop offset="100%" stopColor="#c88a2c" /></linearGradient>
        <linearGradient id="ci-lid2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fff1c8" /><stop offset="100%" stopColor="#e0a83e" /></linearGradient>
        <radialGradient id="ci-burst2" cx="50%" cy="38%" r="60%"><stop offset="0%" stopColor="#fff4cf" stopOpacity="0.95" /><stop offset="100%" stopColor="#fff4cf" stopOpacity="0" /></radialGradient>
        <filter id="ci-g4" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="2.6" floodColor="#ffcf6b" floodOpacity="0.9" /></filter>
      </defs>
      <OrbitRing color="#ffcf6b" />
      <circle cx="24" cy="18" r="14" fill="url(#ci-burst2)" />
      <g filter="url(#ci-g4)">
        <rect x="13" y="24" width="22" height="14" rx="2.5" fill="url(#ci-box2)" />
        <rect x="21.5" y="24" width="5" height="14" fill="#fff2cc" fillOpacity="0.7" />
        <g transform="rotate(-14 13 23)"><rect x="10.5" y="18.5" width="24" height="6.5" rx="2" fill="url(#ci-lid2)" /><rect x="21.5" y="18.5" width="5" height="6.5" fill="#fff6dd" fillOpacity="0.8" /></g>
        {/* 飞出的小晶 */}
        <path d="M24 5 L28 10 L24 15 L20 10 Z" fill="#cfeeff" /><path d="M24 5 L28 10 L24 11 Z" fill="#ffffff" fillOpacity="0.7" />
      </g>
      <Sparks pts={[[11, 12, 2], [37, 13, 1.8], [34, 6, 1.4], [13, 22, 1.3]]} color="#fff0c0" />
    </svg>
  )
}

export const FEATURE_ICONS = {
  'feat.design': GemCrystalIcon,
  'feat.ai': DiamondSparkIcon,
  'feat.energy': EnergyOrbIcon,
  'feat.order': GiftGlowIcon,
}

// 星座发光星盘（紫色星云圆盘 + 发光环 + 白色星座符号）
const ZSTARS = [
  [18, 20, 1], [30, 14, 1.3], [42, 20, 1], [46, 32, 1.1], [40, 44, 1], [30, 48, 1.3],
  [20, 44, 1], [15, 32, 1.1], [24, 30, 0.8], [37, 30, 0.9], [30, 22, 0.8], [30, 40, 0.9],
]
export function ZodiacMedallion({ symbol, size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ filter: 'drop-shadow(0 0 6px rgba(150,90,240,0.85))' }}>
      <defs>
        <radialGradient id="zd-disc" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#4a2b8f" />
          <stop offset="55%" stopColor="#2a1560" />
          <stop offset="100%" stopColor="#160a34" />
        </radialGradient>
        <radialGradient id="zd-core" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor="#c9a8ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#c9a8ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="26" fill="url(#zd-disc)" />
      <circle cx="30" cy="30" r="26" fill="url(#zd-core)" />
      {/* 星云连线 */}
      <g stroke="#b98cff" strokeOpacity="0.35" strokeWidth="0.5">
        <path d="M18 20 L30 14 L42 20 L46 32 L40 44 L30 48 L20 44 L15 32 Z" fill="none" />
      </g>
      {/* 闪烁星点 */}
      {ZSTARS.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#ffffff" className="animate-twinkle" style={{ animationDelay: `${(i % 5) * 0.45}s`, transformOrigin: `${x}px ${y}px` }} opacity="0.9" />
      ))}
      {/* 发光外环 */}
      <circle cx="30" cy="30" r="26" fill="none" stroke="#b98cff" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 4px #a15dff)' }} />
      <circle cx="30" cy="30" r="26" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="0.7" />
      {/* 星座符号（︎ 强制文字渲染 → 白色线条，而非彩色 emoji） */}
      <text x="30" y="31" textAnchor="middle" dominantBaseline="central" fill="#ffffff" style={{ fontSize: 22, fontWeight: 700, filter: 'drop-shadow(0 0 3px #d9c2ff)' }}>{symbol + '︎'}</text>
    </svg>
  )
}
