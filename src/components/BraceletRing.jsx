import { CRYSTALS, SPACER } from '../data/crystals.js'
import { layoutRing, fitRingRadius } from '../utils/bracelet.js'

const VIEW = 360
const CX = VIEW / 2
const CY = VIEW / 2

const beadR = (size) => size * 2 // 6->12, 8->16, 10->20, 12->24

// 珠子在 viewBox 中的绘制（<g>，可平滑过渡位置）
function BeadNode({ p, selected, onSelect }) {
  const r = beadR(p.size)
  return (
    <g
      style={{
        transform: `translate(${p.x}px, ${p.y}px)`,
        transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1)',
        cursor: 'pointer',
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.(p.uid)
      }}
    >
      <g className="animate-pop">
        {selected && <circle r={r + 4} fill="none" stroke="#2f9c66" strokeWidth="2.5" />}
        {p.crystal?.photo ? (
          <>
            <clipPath id={`ringclip-${p.uid}`}>
              <circle r={r} />
            </clipPath>
            <circle r={r} fill="#e5e7eb" filter="url(#beadShadow)" />
            <image href={p.crystal.photo} x={-r} y={-r} width={r * 2} height={r * 2} preserveAspectRatio="xMidYMid slice" clipPath={`url(#ringclip-${p.uid})`} />
            <ellipse cx={-r * 0.34} cy={-r * 0.4} rx={r * 0.24} ry={r * 0.15} fill="#ffffff" opacity="0.35" transform="rotate(-28)" />
            <circle r={r * 0.98} fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth={Math.max(0.6, r * 0.05)} />
          </>
        ) : (
          <>
            <circle r={r} fill={`url(#grad-${p.crystalId})`} filter="url(#beadShadow)" />
            {p.crystal?.gradient?.sheen && <circle r={r} fill={`url(#sheen-${p.crystalId})`} />}
            <circle r={r} fill={`url(#glow-${p.crystalId})`} />
            <ellipse cx={0} cy={r * 0.5} rx={r * 0.6} ry={r * 0.28} fill={p.crystal?.gradient?.light || '#fff'} opacity="0.26" />
            {/* 穿孔：中心圆圈 */}
            <circle cx={0} cy={r * 0.02} r={r * 0.18} fill="#000" opacity="0.06" />
            <circle cx={0} cy={r * 0.02} r={r * 0.19} fill="none" stroke={p.crystal?.gradient?.deep || '#999'} strokeOpacity="0.3" strokeWidth={Math.max(0.4, r * 0.045)} />
            <ellipse cx={-r * 0.34} cy={-r * 0.4} rx={r * 0.28} ry={r * 0.2} fill="#ffffff" opacity="0.78" transform="rotate(-28)" />
            <circle cx={r * 0.3} cy={r * 0.28} r={r * 0.09} fill="#ffffff" opacity="0.42" />
            <circle r={r * 0.98} fill="none" stroke={p.crystal?.gradient?.ring || '#999'} strokeOpacity="0.45" strokeWidth={Math.max(0.6, r * 0.05)} />
          </>
        )}
      </g>
    </g>
  )
}

export function BraceletRing({ beads, selectedUid, onSelectBead, onClearSelection }) {
  const maxSize = beads.length ? Math.max(...beads.map((b) => b.size)) : 8
  const ringRadius = fitRingRadius(beads, beadR(maxSize) * 2, VIEW)
  const positions = layoutRing(beads, { cx: CX, cy: CY, ringRadius })

  return (
    <svg
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      className="h-full w-full select-none"
      onClick={onClearSelection}
    >
      <defs>
        {[...CRYSTALS, SPACER].map((c) => (
          <radialGradient key={c.id} id={`grad-${c.id}`} cx="36%" cy="34%" r="76%">
            <stop offset="0%" stopColor={c.gradient.light} />
            <stop offset="40%" stopColor={c.gradient.base} />
            <stop offset="80%" stopColor={c.gradient.deep} />
            <stop offset="100%" stopColor={c.gradient.ring} />
          </radialGradient>
        ))}
        {[...CRYSTALS, SPACER].map((c) => (
          <radialGradient key={c.id} id={`glow-${c.id}`} cx="62%" cy="70%" r="52%">
            <stop offset="0%" stopColor={c.gradient.light} stopOpacity="0.55" />
            <stop offset="55%" stopColor={c.gradient.light} stopOpacity="0.1" />
            <stop offset="100%" stopColor={c.gradient.light} stopOpacity="0" />
          </radialGradient>
        ))}
        {[...CRYSTALS, SPACER]
          .filter((c) => c.gradient.sheen)
          .map((c) => (
            <radialGradient key={c.id} id={`sheen-${c.id}`} cx="66%" cy="68%" r="60%">
              <stop offset="0%" stopColor={c.gradient.sheen} stopOpacity="0.6" />
              <stop offset="60%" stopColor={c.gradient.sheen} stopOpacity="0.08" />
              <stop offset="100%" stopColor={c.gradient.sheen} stopOpacity="0" />
            </radialGradient>
          ))}
        <filter id="beadShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="3" floodColor="#0b1220" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* 引导虚线圆 */}
      {beads.length === 0 && (
        <circle cx={CX} cy={CY} r={VIEW * 0.3} fill="none" stroke="currentColor" className="text-neutral-300 dark:text-neutral-600" strokeWidth="1.5" strokeDasharray="4 7" />
      )}

      {/* 中心水印 */}
      <text x={CX} y={CY - 6} textAnchor="middle" className="fill-neutral-300 dark:fill-neutral-600" style={{ fontSize: 18, fontWeight: 600, letterSpacing: 1 }}>
        阿发水晶阁
      </text>
      <text x={CX} y={CY + 14} textAnchor="middle" className="fill-neutral-300 dark:fill-neutral-600" style={{ fontSize: 9, letterSpacing: 1 }}>
        AH HUAT CRYSTAL
      </text>

      {positions.map((p) => (
        <BeadNode key={p.uid} p={p} selected={p.uid === selectedUid} onSelect={onSelectBead} />
      ))}
    </svg>
  )
}
