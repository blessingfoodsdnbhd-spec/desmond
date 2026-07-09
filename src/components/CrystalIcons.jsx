// 立体水晶风格图标（SVG 渐变 + 高光 + 折射），替代线框图标
// 每个图标自带内部光泽，配合卡片外发光营造 Vision-Pro 质感。

function Defs({ id, stops }) {
  return (
    <defs>
      <linearGradient id={`${id}-body`} x1="30%" y1="0%" x2="70%" y2="100%">
        {stops.map((s, i) => (
          <stop key={i} offset={s[0]} stopColor={s[1]} />
        ))}
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

// 自由设计 — 多切面水晶宝石
export function GemCrystalIcon({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs id="gem" stops={[['0%', '#a8ecff'], ['45%', '#37b6e6'], ['100%', '#1668b0']]} />
      <g filter="url(#gemsh)">
        <path d="M24 5 L38 17 L24 44 L10 17 Z" fill="url(#gem-body)" />
        <path d="M24 5 L38 17 L24 22 Z" fill="#ffffff" fillOpacity="0.55" />
        <path d="M10 17 L24 22 L24 44 Z" fill="#0b4f86" fillOpacity="0.35" />
        <path d="M24 5 L24 22 L10 17 Z" fill="#ffffff" fillOpacity="0.28" />
        <path d="M38 17 L24 22 L24 44 Z" fill="#ffffff" fillOpacity="0.12" />
        <path d="M10 17 L38 17" stroke="#eaffff" strokeOpacity="0.7" strokeWidth="0.8" />
      </g>
      <ellipse cx="19" cy="14" rx="3.4" ry="1.7" fill="#ffffff" opacity="0.85" transform="rotate(-30 19 14)" />
      <defs>
        <filter id="gemsh" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.4" floodColor="#0a5aa0" floodOpacity="0.5" />
        </filter>
      </defs>
    </svg>
  )
}

// AI 推荐 — 紫钻 + 星芒
export function DiamondSparkIcon({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs id="dia" stops={[['0%', '#e9c7ff'], ['45%', '#a95cf0'], ['100%', '#6321b8']]} />
      <g filter="url(#diash)">
        <path d="M24 7 L36 18 L24 41 L12 18 Z" fill="url(#dia-body)" />
        <path d="M24 7 L36 18 L24 21 Z" fill="#ffffff" fillOpacity="0.6" />
        <path d="M12 18 L24 21 L24 41 Z" fill="#4a1690" fillOpacity="0.4" />
        <path d="M24 7 L24 21 L12 18 Z" fill="#ffffff" fillOpacity="0.3" />
        <path d="M12 18 L36 18" stroke="#f7ecff" strokeOpacity="0.7" strokeWidth="0.8" />
      </g>
      {/* 星芒 */}
      <g className="animate-twinkle" style={{ transformOrigin: '38px 11px' }}>
        <path d="M38 6 L39.2 9.8 L43 11 L39.2 12.2 L38 16 L36.8 12.2 L33 11 L36.8 9.8 Z" fill="#fff7ff" />
      </g>
      <circle cx="11" cy="30" r="1.6" fill="#ffffff" className="animate-twinkle" />
      <defs>
        <filter id="diash" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.4" floodColor="#5a18b0" floodOpacity="0.5" />
        </filter>
      </defs>
    </svg>
  )
}

// 能量解读 — 水晶球 + 闪电
export function EnergyOrbIcon({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs id="orb" stops={[['0%', '#c9e2ff'], ['50%', '#6a7bf0'], ['100%', '#3a2ea8']]} />
      <circle cx="24" cy="24" r="16" fill="url(#orb-body)" filter="url(#orbsh)" />
      <circle cx="24" cy="24" r="16" fill="url(#orb-glow)" opacity="0.5" />
      <ellipse cx="18.5" cy="17.5" rx="5.5" ry="3.4" fill="#ffffff" opacity="0.7" transform="rotate(-28 18.5 17.5)" />
      <path d="M26 13 L18 25 L23 25 L21 34 L30 21 L25 21 Z" fill="#fff6c0" stroke="#ffe27a" strokeWidth="0.6" />
      <circle cx="24" cy="24" r="16" fill="none" stroke="#dce8ff" strokeOpacity="0.5" strokeWidth="1" />
      <defs>
        <filter id="orbsh" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.6" floodColor="#2a1f88" floodOpacity="0.5" />
        </filter>
      </defs>
    </svg>
  )
}

// 一键下单 — 发光礼盒
export function GiftGlowIcon({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs id="gift" stops={[['0%', '#ffe9b0'], ['50%', '#f0b84e'], ['100%', '#b87a1e']]} />
      <g filter="url(#giftsh)">
        <rect x="10" y="20" width="28" height="20" rx="3" fill="url(#gift-body)" />
        <rect x="8" y="14" width="32" height="8" rx="2.5" fill="#ffd980" />
        <rect x="21" y="14" width="6" height="26" fill="#ffffff" fillOpacity="0.55" />
        <path d="M24 14 C20 8 12 9 15 14 M24 14 C28 8 36 9 33 14" stroke="#fff3d0" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
      <rect x="10" y="20" width="28" height="20" rx="3" fill="url(#gift-glow)" opacity="0.35" />
      <defs>
        <filter id="giftsh" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.4" floodColor="#9a6714" floodOpacity="0.5" />
        </filter>
      </defs>
    </svg>
  )
}

export const FEATURE_ICONS = {
  'feat.design': GemCrystalIcon,
  'feat.ai': DiamondSparkIcon,
  'feat.energy': EnergyOrbIcon,
  'feat.order': GiftGlowIcon,
}
