// SVG 抛光水晶珠，与 Canvas 导出效果一致
let gid = 0

export function Bead({ crystal, size = 48, className = '', style }) {
  const g = crystal?.gradient || { light: '#fff', base: '#ccc', deep: '#999', ring: '#888' }
  const uid = `bead-${crystal?.id || 'x'}-${size}`
  const r = size / 2
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
        <radialGradient id={`${uid}-main`} cx="34%" cy="32%" r="72%">
          <stop offset="0%" stopColor={g.light} />
          <stop offset="42%" stopColor={g.base} />
          <stop offset="82%" stopColor={g.deep} />
          <stop offset="100%" stopColor={g.ring} />
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
      <ellipse cx="34" cy="30" rx="15" ry="10" fill="#ffffff" opacity="0.72" transform="rotate(-28 34 30)" />
      <circle cx="66" cy="66" r="5" fill="#ffffff" opacity="0.38" />
      <circle cx="50" cy="50" r="47" fill="none" stroke={g.ring} strokeOpacity="0.5" strokeWidth="2" />
    </svg>
  )
}
