// 底部导航「点击后」立体发光图标（玻璃质感 + 高光）
// 未选中用简洁线条图标，选中时切换到这些立体图标 + 能量光圈。

function Sh() {
  return (
    <defs>
      <filter id="nv-sh" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="1.4" stdDeviation="1.6" floodColor="#123" floodOpacity="0.45" />
      </filter>
    </defs>
  )
}

// 首页 — 蓝色立体小屋
export function HomeGloss({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Sh />
      <defs>
        <linearGradient id="nv-home" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#cdeaff" />
          <stop offset="45%" stopColor="#5aa8ee" />
          <stop offset="100%" stopColor="#2b6fc4" />
        </linearGradient>
      </defs>
      <g filter="url(#nv-sh)">
        <path d="M20 6 L33 17 L33 32 A2 2 0 0 1 31 34 L9 34 A2 2 0 0 1 7 32 L7 17 Z" fill="url(#nv-home)" />
        <path d="M20 6 L33 17 L20 17 Z" fill="#ffffff" fillOpacity="0.45" />
        <rect x="16.5" y="22" width="7" height="12" rx="1.4" fill="#eaf6ff" fillOpacity="0.9" />
      </g>
      <ellipse cx="14.5" cy="19" rx="2.6" ry="1.4" fill="#ffffff" opacity="0.7" transform="rotate(-24 14.5 19)" />
    </svg>
  )
}

// 设计 — 紫色切面水晶
export function DesignGloss({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Sh />
      <defs>
        <linearGradient id="nv-des" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#ecd6ff" />
          <stop offset="45%" stopColor="#a86ff0" />
          <stop offset="100%" stopColor="#5b28b8" />
        </linearGradient>
      </defs>
      <g filter="url(#nv-sh)">
        <path d="M20 5 L31 15 L20 35 L9 15 Z" fill="url(#nv-des)" />
        <path d="M20 5 L31 15 L20 18 Z" fill="#ffffff" fillOpacity="0.55" />
        <path d="M9 15 L20 18 L20 35 Z" fill="#3f1a86" fillOpacity="0.4" />
        <path d="M20 5 L20 18 L9 15 Z" fill="#ffffff" fillOpacity="0.28" />
        <path d="M9 15 L31 15" stroke="#f3e8ff" strokeOpacity="0.6" strokeWidth="0.7" />
      </g>
    </svg>
  )
}

// 发现 — 蓝色立体罗盘
export function DiscoverGloss({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Sh />
      <defs>
        <radialGradient id="nv-dis" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#e9f6ff" />
          <stop offset="30%" stopColor="#8fd0ff" />
          <stop offset="70%" stopColor="#3a8fe0" />
          <stop offset="100%" stopColor="#1a5aa0" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="14" fill="url(#nv-dis)" filter="url(#nv-sh)" />
      {/* 罗盘指针 */}
      <path d="M27 13 L21 19 L13 27 L19 21 Z" fill="#ffffff" />
      <path d="M27 13 L21 19 L19 21 Z" fill="#ff6f5e" />
      <circle cx="20" cy="20" r="2" fill="#ffffff" />
      <circle cx="20" cy="20" r="2" fill="none" stroke="#2a6aa8" strokeWidth="0.6" />
      <ellipse cx="15" cy="13.5" rx="3.2" ry="1.7" fill="#ffffff" opacity="0.7" transform="rotate(-26 15 13.5)" />
    </svg>
  )
}

// 订单 — 卷轴
export function OrderGloss({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Sh />
      <defs>
        <linearGradient id="nv-ord" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbfdff" />
          <stop offset="100%" stopColor="#c9d8ee" />
        </linearGradient>
      </defs>
      <g filter="url(#nv-sh)">
        <rect x="10" y="9" width="20" height="24" rx="3" fill="url(#nv-ord)" />
        <path d="M10 12 Q6 12 6 8.5 Q6 12 10 12" fill="#aebfd8" />
        <rect x="10" y="7" width="20" height="4" rx="2" fill="#8aa2c6" />
        <g stroke="#7f93b6" strokeWidth="1.5" strokeLinecap="round">
          <path d="M14 18 H26" />
          <path d="M14 23 H26" />
          <path d="M14 28 H22" />
        </g>
      </g>
      <ellipse cx="15" cy="13" rx="2.4" ry="1.2" fill="#ffffff" opacity="0.7" />
    </svg>
  )
}

// 我的 — 蓝色能量球（人像）
export function MeGloss({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Sh />
      <defs>
        <radialGradient id="nv-me" cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#eef6ff" />
          <stop offset="30%" stopColor="#9ac2ff" />
          <stop offset="70%" stopColor="#5470e0" />
          <stop offset="100%" stopColor="#2b3aa0" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="14" fill="url(#nv-me)" filter="url(#nv-sh)" />
      <circle cx="20" cy="16.5" r="4" fill="#ffffff" opacity="0.92" />
      <path d="M12.5 29 A8 8 0 0 1 27.5 29 Z" fill="#ffffff" opacity="0.88" />
      <ellipse cx="15" cy="14" rx="3.2" ry="1.7" fill="#ffffff" opacity="0.7" transform="rotate(-26 15 14)" />
    </svg>
  )
}

export const NAV_GLOSS = {
  home: HomeGloss,
  design: DesignGloss,
  discover: DiscoverGloss,
  order: OrderGloss,
  me: MeGloss,
}
