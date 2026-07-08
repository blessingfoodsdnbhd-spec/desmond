// 沉浸式蓝冰洞背景：直接用冰洞实景照片 + 进光 + 缓慢漂移，营造"走进冰洞"的感觉
import iceCave from '../assets/bg/icecave.webp'

const SPARKLES = [
  [40, 30, 1.6], [90, 60, 1], [150, 24, 1.3], [210, 52, 1], [260, 34, 1.5], [300, 66, 1.1],
  [70, 90, 1.2], [180, 82, 1], [250, 96, 1.4], [120, 46, 0.9], [30, 70, 1], [285, 20, 1.2],
]

// 可复用冰洞图（嵌入 hero 等容器，object-cover 铺满）
export function IceCaveImage({ className = '' }) {
  return <img src={iceCave} alt="" aria-hidden className={className} />
}

export function CrystalBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 冰洞实景，进入时缓慢放大 + 持续漂移 */}
      <div className="absolute inset-0 animate-cave-in">
        <img src={iceCave} alt="" className="h-full w-full origin-center object-cover animate-cave-drift" />
      </div>
      {/* 可读性遮罩（浅色偏白、深色偏深蓝），内容区看得清 */}
      <div className="absolute inset-0 bg-white/58 dark:bg-[#04101c]/64" />
      {/* 一束进光，强化通透 */}
      <div className="absolute left-1/2 -top-24 h-[52vh] w-[72vw] -translate-x-1/2 rounded-full opacity-70 blur-3xl dark:opacity-45" style={{ background: 'radial-gradient(ellipse at center, rgba(236,250,255,0.85), transparent 72%)' }} />
      {/* 底部冰蓝加深 */}
      <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-sky-100/50 to-transparent dark:from-[#06121f]/70" />

      {/* 星点微光 */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 100" preserveAspectRatio="xMidYMid slice">
        {SPARKLES.map(([x, y, r], i) => (
          <g key={i} className="animate-float" style={{ animationDelay: `${(i % 5) * 0.6}s`, transformOrigin: `${x}px ${y}px` }}>
            <circle cx={x} cy={y} r={r} className="fill-white" opacity="0.6" />
            <circle cx={x} cy={y} r={r * 2.4} className="fill-white" opacity="0.1" />
          </g>
        ))}
      </svg>
    </div>
  )
}
