// SVG 抛光水晶珠，与 Canvas 导出效果一致
let gid = 0

export function Bead({ crystal, size = 48, className = '', style }) {
  const g = crystal?.gradient || { light: '#fff', base: '#ccc', deep: '#999', ring: '#888' }
  const uid = `bead-${crystal?.id || 'x'}-${size}`
  const r = size / 2

  // 自定义珠子：用上传的照片，裁成圆形
  if (crystal?.photo) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={style} aria-label={crystal?.name}>
        <defs>
          <clipPath id={`${uid}-clip`}>
            <circle cx="50" cy="50" r="48" />
          </clipPath>
        </defs>
        <image href={crystal.photo} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${uid}-clip)`} />
        <ellipse cx="34" cy="30" rx="13" ry="8" fill="#ffffff" opacity="0.35" transform="rotate(-28 34 30)" />
        <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />
      </svg>
    )
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-label={crystal?.name}
    >
      <defs>
        <radialGradient id={`${uid}-main`} cx="36%" cy="34%" r="76%">
          <stop offset="0%" stopColor={g.light} />
          <stop offset="40%" stopColor={g.base} />
          <stop offset="80%" stopColor={g.deep} />
          <stop offset="100%" stopColor={g.ring} />
        </radialGradient>
        {/* 光线透射的内发光，营造水晶通透感 */}
        <radialGradient id={`${uid}-glow`} cx="62%" cy="70%" r="52%">
          <stop offset="0%" stopColor={g.light} stopOpacity="0.6" />
          <stop offset="55%" stopColor={g.light} stopOpacity="0.12" />
          <stop offset="100%" stopColor={g.light} stopOpacity="0" />
        </radialGradient>
        {g.sheen && (
          <radialGradient id={`${uid}-sheen`} cx="66%" cy="68%" r="60%">
            <stop offset="0%" stopColor={g.sheen} stopOpacity="0.6" />
            <stop offset="60%" stopColor={g.sheen} stopOpacity="0.08" />
            <stop offset="100%" stopColor={g.sheen} stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${uid}-main)`} />
      {g.sheen && <circle cx="50" cy="50" r="48" fill={`url(#${uid}-sheen)`} />}
      {/* 透射内发光 */}
      <circle cx="50" cy="50" r="48" fill={`url(#${uid}-glow)`} />
      {/* 底部透光边缘 */}
      <ellipse cx="50" cy="76" rx="30" ry="14" fill={g.light} opacity="0.28" />
      {/* 穿孔通道（越通透越明显）：细竖线 + 上下孔口 */}
      <g>
        <rect x="48.4" y="12" width="3.2" height="76" rx="1.6" fill={g.deep} opacity="0.12" />
        <ellipse cx="50" cy="13.5" rx="5.5" ry="2.6" fill="#1b1b1f" opacity="0.22" />
        <ellipse cx="50" cy="12.6" rx="3.4" ry="1.3" fill={g.light} opacity="0.5" />
        <ellipse cx="50" cy="86.5" rx="5.5" ry="2.6" fill="#1b1b1f" opacity="0.18" />
      </g>
      {/* 主高光 + 次高光 */}
      <ellipse cx="34" cy="29" rx="15" ry="10" fill="#ffffff" opacity="0.78" transform="rotate(-28 34 29)" />
      <circle cx="65" cy="64" r="4.5" fill="#ffffff" opacity="0.42" />
      <circle cx="50" cy="50" r="47" fill="none" stroke={g.ring} strokeOpacity="0.45" strokeWidth="2" />
    </svg>
  )
}
