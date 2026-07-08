// 蓝色冰晶洞氛围背景（参考冰川水晶洞照片，自绘无外部图片）
// 深蓝通透 + 一束进光 + 冰晶尖柱；浅色清透、深色如冰洞。

// 一颗冰晶尖柱的多边形路径（比水晶更瘦更尖）
function point(cx, h, hw, base = 100) {
  const t = base - h
  const s = base - h * 0.5
  return `M${cx - hw},${base} L${cx - hw * 0.7},${s} L${cx},${t} L${cx + hw * 0.7},${s} L${cx + hw},${base} Z`
}

function Cluster({ heights, gradId, opacity }) {
  const step = 300 / heights.length
  return (
    <g opacity={opacity}>
      {heights.map((h, i) => {
        const cx = i * step + step / 2
        const hw = step * 0.46
        return <path key={i} d={point(cx, h, hw)} fill={`url(#${gradId})`} stroke="#e0f2fe" strokeOpacity="0.08" strokeWidth="0.4" />
      })}
    </g>
  )
}

const BACK = [30, 52, 40, 64, 34, 56, 44, 70, 36, 54, 32, 60, 42, 48]
const FRONT = [60, 90, 70, 108, 66, 96, 78, 118, 68, 92, 58, 100, 74, 104, 64]
const SPARKLES = [
  [40, 30, 1.6], [90, 60, 1], [150, 24, 1.3], [210, 52, 1], [260, 34, 1.5], [300, 66, 1.1],
  [70, 90, 1.2], [180, 82, 1], [250, 96, 1.4], [120, 46, 0.9], [30, 70, 1], [285, 20, 1.2],
]

// 可复用冰晶簇（嵌入 hero / 圆盘等容器底部）
export function GeodeCluster({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 300 100" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="gcBack" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0" />
          <stop offset="55%" stopColor="#7dd3fc" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="gcFront" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id="gcBackD" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#0369a1" stopOpacity="0" />
          <stop offset="55%" stopColor="#0ea5e9" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="gcFrontD" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#075985" stopOpacity="0" />
          <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <g className="dark:hidden">
        <Cluster heights={BACK} gradId="gcBack" opacity={0.6} />
        <Cluster heights={FRONT} gradId="gcFront" opacity={0.72} />
      </g>
      <g className="hidden dark:block">
        <Cluster heights={BACK} gradId="gcBackD" opacity={0.65} />
        <Cluster heights={FRONT} gradId="gcFrontD" opacity={0.8} />
      </g>
    </svg>
  )
}

export function CrystalBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 一束进光（冰洞里透进来的光） */}
      <div className="absolute left-1/2 -top-24 h-[52vh] w-[70vw] -translate-x-1/2 rounded-full opacity-80 blur-3xl dark:opacity-60" style={{ background: 'radial-gradient(ellipse at center, rgba(236,250,255,0.85), rgba(186,230,253,0.35) 45%, transparent 72%)' }} />
      {/* 冰蓝光晕 */}
      <div className="absolute -left-24 top-[8vh] h-[48vh] w-[48vh] rounded-full opacity-75 blur-3xl dark:opacity-55" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.6), transparent 68%)' }} />
      <div className="absolute -right-24 top-[2vh] h-[46vh] w-[46vh] rounded-full opacity-70 blur-3xl dark:opacity-55" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.55), transparent 68%)' }} />
      <div className="absolute left-[10vw] bottom-[2vh] h-[48vh] w-[48vh] rounded-full opacity-70 blur-3xl dark:opacity-50" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.5), transparent 68%)' }} />
      <div className="absolute right-[4vw] bottom-[14vh] h-[38vh] w-[38vh] rounded-full opacity-65 blur-3xl dark:opacity-50" style={{ background: 'radial-gradient(circle, rgba(2,132,199,0.5), transparent 68%)' }} />

      {/* 底部冰晶簇 */}
      <svg className="absolute inset-x-0 bottom-0 h-[36vh] w-full" viewBox="0 0 300 100" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="cbBack" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0" />
            <stop offset="55%" stopColor="#7dd3fc" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="cbFront" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="cbBackD" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#0369a1" stopOpacity="0" />
            <stop offset="55%" stopColor="#0ea5e9" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="cbFrontD" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#075985" stopOpacity="0" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.88" />
          </linearGradient>
        </defs>
        <g className="dark:hidden">
          <Cluster heights={BACK} gradId="cbBack" opacity={0.5} />
          <Cluster heights={FRONT} gradId="cbFront" opacity={0.58} />
        </g>
        <g className="hidden dark:block">
          <Cluster heights={BACK} gradId="cbBackD" opacity={0.55} />
          <Cluster heights={FRONT} gradId="cbFrontD" opacity={0.62} />
        </g>
      </svg>

      {/* 星点微光 */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 100" preserveAspectRatio="xMidYMid slice">
        {SPARKLES.map(([x, y, r], i) => (
          <g key={i} className="animate-float" style={{ animationDelay: `${(i % 5) * 0.6}s`, transformOrigin: `${x}px ${y}px` }}>
            <circle cx={x} cy={y} r={r} className="fill-white dark:fill-sky-200" opacity="0.55" />
            <circle cx={x} cy={y} r={r * 2.4} className="fill-white dark:fill-sky-300" opacity="0.09" />
          </g>
        ))}
      </svg>
    </div>
  )
}
