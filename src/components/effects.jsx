import { useCallback, useState } from 'react'

// 点击能量波纹 — 返回 onDown 处理器和要渲染的波纹节点
export function useRipple() {
  const [ripples, setRipples] = useState([])
  const onDown = useCallback((e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 1.7
    const cx = (e.clientX ?? rect.left + rect.width / 2) - rect.left
    const cy = (e.clientY ?? rect.top + rect.height / 2) - rect.top
    const id = `${performance.now()}-${ripples.length}`
    setRipples((r) => [...r, { id, x: cx, y: cy, size }])
    setTimeout(() => setRipples((r) => r.filter((k) => k.id !== id)), 700)
  }, [ripples.length])
  const rippleNode = ripples.map((r) => (
    <span key={r.id} className="energy-ripple" style={{ left: r.x, top: r.y, width: r.size, height: r.size }} />
  ))
  return { onDown, rippleNode }
}

// 固定分布的星光粒子（无随机，稳定渲染）
const SPARKS = [
  { x: 8, y: 18, s: 3, d: 0 }, { x: 22, y: 62, s: 2, d: 0.8 }, { x: 40, y: 12, s: 2.5, d: 1.5 },
  { x: 58, y: 70, s: 2, d: 0.4 }, { x: 74, y: 26, s: 3, d: 1.1 }, { x: 88, y: 55, s: 2.5, d: 1.9 },
  { x: 15, y: 40, s: 2, d: 2.3 }, { x: 50, y: 88, s: 2.5, d: 0.6 }, { x: 66, y: 44, s: 2, d: 1.4 },
  { x: 82, y: 80, s: 3, d: 0.2 }, { x: 33, y: 34, s: 2, d: 2.0 }, { x: 92, y: 14, s: 2.5, d: 1.0 },
]
export function Sparkles({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {SPARKS.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s,
            boxShadow: '0 0 6px 1px rgba(200,225,255,0.9)',
            animationDelay: `${p.d}s`,
          }}
        />
      ))}
    </div>
  )
}
