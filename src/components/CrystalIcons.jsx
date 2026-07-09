// 立体水晶能量图标（玻璃球质感 + 高光 + 光泽 + 能量），对照实拍点击效果
// 全部 SVG 渐变绘制，自带 HDR 高光与折射感，配合卡片外围光环。

// 通用：玻璃能量球
function GlossSphere({ id, stops, r = 17 }) {
  return (
    <>
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="72%">
          {stops.map((s, i) => (
            <stop key={i} offset={s[0]} stopColor={s[1]} />
          ))}
        </radialGradient>
        <radialGradient id={`${id}-rim`} cx="50%" cy="50%" r="50%">
          <stop offset="72%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r={r} fill={`url(#${id})`} filter="url(#ci-sh)" />
      <circle cx="24" cy="24" r={r} fill={`url(#${id}-rim)`} />
      {/* 高光 */}
      <ellipse cx="18" cy="15.5" rx="6.2" ry="3.6" fill="#ffffff" opacity="0.9" transform="rotate(-26 18 15.5)" />
      <ellipse cx="15.5" cy="13.5" rx="2.2" ry="1.3" fill="#ffffff" transform="rotate(-26 15.5 13.5)" />
      <circle cx="31" cy="32" r="1.9" fill="#ffffff" opacity="0.5" />
    </>
  )
}

const SHADOW = (
  <defs>
    <filter id="ci-sh" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.4" floodColor="#0b1a3a" floodOpacity="0.5" />
    </filter>
  </defs>
)

// 自由设计 — 蓝色切面水晶能量球
export function GemCrystalIcon({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {SHADOW}
      <GlossSphere id="ci-blue" stops={[['0%', '#eaf8ff'], ['24%', '#96d4ff'], ['62%', '#2f8fe0'], ['100%', '#134f92']]} />
      {/* 切面线，营造水晶球折射 */}
      <g stroke="#dff2ff" strokeOpacity="0.4" strokeWidth="0.7" fill="none">
        <path d="M11 22 L24 17 L37 22" />
        <path d="M14 30 L24 26 L34 30" />
        <path d="M24 7 L24 41" strokeOpacity="0.22" />
      </g>
    </svg>
  )
}

// AI 推荐 — 紫色能量球 + 星光
export function DiamondSparkIcon({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {SHADOW}
      <GlossSphere id="ci-purple" stops={[['0%', '#f3e6ff'], ['26%', '#c79bff'], ['62%', '#8a4fe0'], ['100%', '#4a1e9c']]} />
      {/* 星光 */}
      <g className="animate-twinkle" style={{ transformOrigin: '39px 10px' }}>
        <path d="M39 5 L40.1 8.6 L43.6 9.7 L40.1 10.8 L39 14.4 L37.9 10.8 L34.4 9.7 L37.9 8.6 Z" fill="#fff6ff" />
      </g>
      <circle cx="9" cy="18" r="1.4" fill="#ffffff" className="animate-twinkle" style={{ animationDelay: '1s' }} />
      <circle cx="40" cy="34" r="1.2" fill="#f0d9ff" className="animate-twinkle" style={{ animationDelay: '1.8s' }} />
    </svg>
  )
}

// 能量解读 — 深紫能量球 + 发光闪电
export function EnergyOrbIcon({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {SHADOW}
      <GlossSphere id="ci-indigo" stops={[['0%', '#e7ecff'], ['28%', '#8f9bf0'], ['62%', '#5340c8'], ['100%', '#2a1d80']]} />
      {/* 闪电 */}
      <g filter="url(#ci-bolt)">
        <path d="M27 12 L17.5 26 L23 26 L20.5 36 L30.5 22 L25 22 Z" fill="#fff7c8" stroke="#ffe680" strokeWidth="0.6" strokeLinejoin="round" />
      </g>
      <defs>
        <filter id="ci-bolt" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.6" floodColor="#ffe680" floodOpacity="0.9" />
        </filter>
      </defs>
    </svg>
  )
}

// 一键下单 — 打开的礼盒，飞出水晶与金色粒子
export function GiftGlowIcon({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="ci-box" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe6a6" />
          <stop offset="100%" stopColor="#c88a2c" />
        </linearGradient>
        <linearGradient id="ci-lid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff1c8" />
          <stop offset="100%" stopColor="#e0a83e" />
        </linearGradient>
        <radialGradient id="ci-burst" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff4cf" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff4cf" stopOpacity="0" />
        </radialGradient>
        <filter id="ci-sh2" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#7a5214" floodOpacity="0.45" />
        </filter>
      </defs>
      {/* 迸发光 */}
      <circle cx="24" cy="20" r="15" fill="url(#ci-burst)" />
      {/* 盒身 */}
      <g filter="url(#ci-sh2)">
        <rect x="12" y="25" width="24" height="15" rx="2.5" fill="url(#ci-box)" />
        <rect x="21.5" y="25" width="5" height="15" fill="#fff2cc" fillOpacity="0.7" />
      </g>
      {/* 掀开的盖子 */}
      <g transform="rotate(-16 12 24)">
        <rect x="9.5" y="19" width="26" height="7" rx="2" fill="url(#ci-lid)" />
        <rect x="21.5" y="19" width="5" height="7" fill="#fff6dd" fillOpacity="0.8" />
      </g>
      {/* 飞出的水晶 */}
      <g filter="url(#ci-sh2)">
        <path d="M24 4 L29 10 L24 18 L19 10 Z" fill="#bfe6ff" />
        <path d="M24 4 L29 10 L24 12 Z" fill="#ffffff" fillOpacity="0.7" />
        <path d="M19 10 L24 12 L24 18 Z" fill="#6aa8d8" fillOpacity="0.5" />
      </g>
      {/* 金色粒子 */}
      <circle cx="12" cy="12" r="1.5" fill="#ffd76a" className="animate-twinkle" />
      <circle cx="37" cy="14" r="1.6" fill="#ffcf5a" className="animate-twinkle" style={{ animationDelay: '0.9s' }} />
      <circle cx="34" cy="6" r="1.1" fill="#ffe89a" className="animate-twinkle" style={{ animationDelay: '1.6s' }} />
      <circle cx="9" cy="20" r="1.1" fill="#ffe89a" className="animate-twinkle" style={{ animationDelay: '0.4s' }} />
    </svg>
  )
}

export const FEATURE_ICONS = {
  'feat.design': GemCrystalIcon,
  'feat.ai': DiamondSparkIcon,
  'feat.energy': EnergyOrbIcon,
  'feat.order': GiftGlowIcon,
}
