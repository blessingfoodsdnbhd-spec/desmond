import { useCallback, useEffect, useRef, useState } from 'react'

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

// 缓慢上升的柔光粒子（稳定分布，慢速，有呼吸感，不炫技）
const PARTICLES = [
  { x: 12, y: 70, s: 2.5, d: 0, dur: 9 }, { x: 26, y: 84, s: 1.8, d: 2.4, dur: 11 },
  { x: 40, y: 76, s: 3, d: 4.1, dur: 10 }, { x: 55, y: 88, s: 2, d: 1.2, dur: 12 },
  { x: 68, y: 72, s: 2.6, d: 3.3, dur: 9.5 }, { x: 82, y: 82, s: 1.8, d: 5.0, dur: 11.5 },
  { x: 20, y: 60, s: 2, d: 6.0, dur: 13 }, { x: 48, y: 64, s: 2.4, d: 2.0, dur: 10.5 },
  { x: 74, y: 58, s: 2, d: 4.6, dur: 12.5 }, { x: 90, y: 68, s: 2.6, d: 0.8, dur: 10 },
]

// Hero 沉浸氛围：蓝色能量雾 + 缓慢光线 + 上升粒子
export function HeroAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 蓝色能量雾 */}
      <div
        className="absolute -left-10 top-6 h-56 w-72 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(80,160,255,0.35), transparent 70%)', animation: 'mist-drift 16s ease-in-out infinite' }}
      />
      <div
        className="absolute -right-8 bottom-4 h-52 w-72 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(140,120,255,0.28), transparent 70%)', animation: 'mist-drift 20s ease-in-out infinite reverse' }}
      />
      {/* 缓慢流过的光线 */}
      <div
        className="absolute inset-y-0 left-0 w-1/3 blur-2xl"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(220,240,255,0.28), transparent)', animation: 'light-flow 14s ease-in-out infinite' }}
      />
      {/* 上升柔光粒子 */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s,
            boxShadow: '0 0 7px 1px rgba(200,225,255,0.85)',
            animation: `drift-up ${p.dur}s ease-in-out ${p.d}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

// 星光（用于 icon 内部装饰，柔和）
const SPARKS = [
  { x: 18, y: 22, s: 2, d: 0 }, { x: 74, y: 30, s: 2.5, d: 1.1 }, { x: 50, y: 78, s: 2, d: 0.6 },
]
export function Sparkles({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {SPARKS.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, boxShadow: '0 0 6px 1px rgba(200,225,255,0.9)', animationDelay: `${p.d}s` }}
        />
      ))}
    </div>
  )
}

// 滚动揭示：进入视口时淡入 + 上移 + 去模糊
export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setShown(true); return }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { setShown(true); io.unobserve(e.target) }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}
