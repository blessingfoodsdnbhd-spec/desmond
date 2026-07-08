// 水晶洞 / 晶簇氛围背景（自绘，无外部图片）
// 柔和彩色光晕 + 底部晶簇 + 星点微光；浅色淡雅、深色如紫水晶洞。

// 一颗水晶尖柱的多边形路径
function point(cx, h, hw, base = 100) {
  const t = base - h
  const s = base - h * 0.6
  return `M${cx - hw},${base} L${cx - hw},${s} L${cx},${t} L${cx + hw},${s} L${cx + hw},${base} Z`
}

// 一排晶簇（沿底部）
function Cluster({ heights, gradId, opacity }) {
  const step = 300 / heights.length
  return (
    <g opacity={opacity}>
      {heights.map((h, i) => {
        const cx = i * step + step / 2
        const hw = step * 0.42
        return <path key={i} d={point(cx, h, hw)} fill={`url(#${gradId})`} stroke="#ffffff" strokeOpacity="0.06" strokeWidth="0.4" />
      })}
    </g>
  )
}

const BACK = [26, 44, 34, 56, 30, 48, 38, 60, 32, 46, 28, 52, 36, 42]
const FRONT = [54, 78, 62, 96, 58, 84, 68, 104, 60, 80, 50, 88, 64, 92, 56]

// 可复用晶簇（嵌入 hero / 圆盘等容器底部）
export function GeodeCluster({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 300 100" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="gcBack" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0" />
          <stop offset="55%" stopColor="#c4b5fd" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="gcFront" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0" />
          <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="gcBackD" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#6d28d9" stopOpacity="0" />
          <stop offset="55%" stopColor="#7c3aed" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="gcFrontD" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#5b21b6" stopOpacity="0" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ddd6fe" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <g className="dark:hidden">
        <Cluster heights={BACK} gradId="gcBack" opacity={0.6} />
        <Cluster heights={FRONT} gradId="gcFront" opacity={0.7} />
      </g>
      <g className="hidden dark:block">
        <Cluster heights={BACK} gradId="gcBackD" opacity={0.65} />
        <Cluster heights={FRONT} gradId="gcFrontD" opacity={0.75} />
      </g>
    </svg>
  )
}
const SPARKLES = [
  [40, 30, 1.6], [90, 60, 1], [150, 24, 1.3], [210, 52, 1], [260, 34, 1.5], [300, 66, 1.1],
  [70, 90, 1.2], [180, 82, 1], [250, 96, 1.4], [120, 46, 0.9], [30, 70, 1], [285, 20, 1.2],
]

export function CrystalBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 柔和彩色光晕（水晶色） */}
      <div className="absolute -left-24 -top-28 h-[50vh] w-[50vh] rounded-full opacity-80 blur-3xl dark:opacity-60" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.6), transparent 68%)' }} />
      <div className="absolute -right-24 top-[4vh] h-[44vh] w-[44vh] rounded-full opacity-70 blur-3xl dark:opacity-55" style={{ background: 'radial-gradient(circle, rgba(110,231,183,0.55), transparent 68%)' }} />
      <div className="absolute left-[12vw] bottom-[2vh] h-[48vh] w-[48vh] rounded-full opacity-70 blur-3xl dark:opacity-50" style={{ background: 'radial-gradient(circle, rgba(244,180,220,0.55), transparent 68%)' }} />
      <div className="absolute right-[2vw] bottom-[16vh] h-[36vh] w-[36vh] rounded-full opacity-65 blur-3xl dark:opacity-50" style={{ background: 'radial-gradient(circle, rgba(125,211,252,0.55), transparent 68%)' }} />

      {/* 底部晶簇（水晶洞地面） */}
      <svg className="absolute inset-x-0 bottom-0 h-[34vh] w-full" viewBox="0 0 300 100" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="cbBack" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.0" />
            <stop offset="55%" stopColor="#c4b5fd" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="cbFront" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="cbBackD" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.0" />
            <stop offset="55%" stopColor="#7c3aed" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="cbFrontD" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#5b21b6" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ddd6fe" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        {/* 浅色晶簇 */}
        <g className="dark:hidden">
          <Cluster heights={BACK} gradId="cbBack" opacity={0.5} />
          <Cluster heights={FRONT} gradId="cbFront" opacity={0.55} />
        </g>
        {/* 深色晶簇（紫水晶洞） */}
        <g className="hidden dark:block">
          <Cluster heights={BACK} gradId="cbBackD" opacity={0.55} />
          <Cluster heights={FRONT} gradId="cbFrontD" opacity={0.6} />
        </g>
      </svg>

      {/* 星点微光 */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 100" preserveAspectRatio="xMidYMid slice">
        {SPARKLES.map(([x, y, r], i) => (
          <g key={i} className="animate-float" style={{ animationDelay: `${(i % 5) * 0.6}s`, transformOrigin: `${x}px ${y}px` }}>
            <circle cx={x} cy={y} r={r} className="fill-white dark:fill-violet-200" opacity="0.5" />
            <circle cx={x} cy={y} r={r * 2.4} className="fill-white dark:fill-violet-300" opacity="0.08" />
          </g>
        ))}
      </svg>
    </div>
  )
}
