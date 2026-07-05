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
        <radialGradient id={`${uid}-glow`} cx="60%" cy="66%" r="56%">
          <stop offset="0%" stopColor={g.light} stopOpacity="0.78" />
          <stop offset="48%" stopColor={g.light} stopOpacity="0.22" />
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
      <ellipse cx="50" cy="76" rx="31" ry="15" fill={g.light} opacity="0.34" />
      {/* 穿孔：中心柔和圆圈（透过水晶看到的孔道，自然含蓄） */}
      <circle cx="50" cy="51" r="7" fill="#000" opacity="0.045" />
      <circle cx="50" cy="51" r="8" fill="none" stroke={g.deep} strokeOpacity="0.2" strokeWidth="1.5" />
      <circle cx="50" cy="51" r="6.4" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="0.7" />
      {/* 柔和高光光晕 + 主高光 + 次高光 */}
      <ellipse cx="36" cy="31" rx="25" ry="17" fill="#ffffff" opacity="0.16" transform="rotate(-28 36 31)" />
      <ellipse cx="34" cy="29" rx="16" ry="10.5" fill="#ffffff" opacity="0.85" transform="rotate(-28 34 29)" />
      <circle cx="66" cy="65" r="5" fill="#ffffff" opacity="0.5" />
      <circle cx="50" cy="50" r="47" fill="none" stroke={g.ring} strokeOpacity="0.4" strokeWidth="1.8" />
    </svg>
  )
}
