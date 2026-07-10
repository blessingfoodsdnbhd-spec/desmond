// 深空水晶背景：设计稿实拍水晶洞背景图（按页面切换）+ 星云辉光 + 密集星光/四角闪钻 + 光束（会移动会闪）
import iceCave from '../assets/bg/icecave.webp'
import bgLightning from '../assets/backgrounds/bg-cosmic-lightning-crystal.webp'
import bgCosmos from '../assets/backgrounds/bg-discover-crystal-cosmos.webp'
import bgEmerald from '../assets/backgrounds/bg-profile-emerald-cosmic.webp'

// 每个页面对应的水晶洞背景（依设计稿 README）
const PAGE_BG = {
  home: bgLightning,
  design: bgLightning,
  discover: bgCosmos,
  order: bgEmerald,
  me: bgEmerald,
}

// 可复用冰洞图（嵌入 hero 等容器，object-cover 铺满）
export function IceCaveImage({ className = '' }) {
  return <img src={iceCave} alt="" aria-hidden className={className} />
}

// 稳定分布的星点（无随机）
const STARS = []
{
  const seed = [7, 13, 23, 31, 41, 53, 61, 71, 83, 97]
  for (let i = 0; i < 70; i++) {
    const x = (seed[i % 10] * 9.7 + i * 17.3) % 100
    const y = (seed[(i + 3) % 10] * 7.3 + i * 11.1) % 100
    const s = 0.6 + ((i * 37) % 20) / 12
    const d = ((i * 29) % 40) / 10
    STARS.push([x, y, s, d, 3 + (i % 4)])
  }
}

// 稳定分布的四角闪钻（更亮的星光，集中在中间读作闪耀）
const SPARKLES = []
{
  const sx = [15, 30, 46, 62, 80, 22, 38, 55, 70, 48, 33, 60, 26, 72, 42, 58]
  const sy = [16, 26, 12, 30, 20, 46, 58, 50, 62, 38, 70, 34, 54, 44, 64, 24]
  for (let i = 0; i < sx.length; i++) {
    const size = 11 + (i % 4) * 6
    const dur = 3.4 + ((i * 7) % 30) / 10
    const delay = ((i * 13) % 46) / 10
    const hue = i % 3 === 0 ? 'rgba(190,150,255,0.95)' : 'rgba(180,225,255,0.95)'
    SPARKLES.push([sx[i], sy[i], size, dur, delay, hue])
  }
}

// 四角星光形状
function SparkleShape({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
      <path d="M12 0c.8 6.5 4.7 10.4 12 12-7.3 1.6-11.2 5.5-12 12-.8-6.5-4.7-10.4-12-12C7.3 10.4 11.2 6.5 12 0z" fill={color} />
    </svg>
  )
}

export function CrystalBackground({ tab = 'home' }) {
  const pageBg = PAGE_BG[tab] || bgLightning
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* ===== 浅色：冰洞照片 ===== */}
      <div className="absolute inset-0 dark:hidden">
        <div className="absolute inset-0 animate-cave-in">
          <img src={iceCave} alt="" className="h-full w-full origin-center object-cover animate-cave-drift" />
        </div>
        <div className="absolute inset-0 bg-white/58" />
        <div className="absolute left-1/2 -top-24 h-[52vh] w-[72vw] -translate-x-1/2 rounded-full opacity-70 blur-3xl" style={{ background: 'radial-gradient(ellipse at center, rgba(236,250,255,0.85), transparent 72%)' }} />
      </div>

      {/* ===== 深色：设计稿水晶洞背景（按页面切换）===== */}
      <div className="absolute inset-0 hidden dark:block" style={{ background: '#050912' }}>
        {/* 水晶洞背景图：全屏固定、缓慢推拉（会移动）。切页淡入过渡 */}
        <img
          key={pageBg}
          src={pageBg}
          alt=""
          className="absolute inset-0 h-full w-full origin-center object-cover animate-cosmic-drift animate-fade-in"
        />
        {/* 深色晕影，让中间内容区更暗更好读 */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(100% 78% at 50% 42%, rgba(5,9,18,0.72) 0%, rgba(5,9,18,0.35) 46%, rgba(5,9,18,0.15) 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: 'linear-gradient(to top, #050912, transparent)' }} />

        {/* 星云辉光（screen 混合，缓慢流动，叠在洞图上更亮） */}
        <div className="absolute -left-16 top-8 h-[42vh] w-[64vw] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(70,140,255,0.36), transparent 70%)', mixBlendMode: 'screen', animation: 'mist-drift 20s ease-in-out infinite' }} />
        <div className="absolute -right-16 top-1/3 h-[44vh] w-[64vw] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(165,110,255,0.32), transparent 70%)', mixBlendMode: 'screen', animation: 'mist-drift 26s ease-in-out infinite reverse' }} />

        {/* 斜向光束缓缓扫过 */}
        <div className="absolute -top-1/4 left-0 h-[150vh] w-40 blur-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(150,200,255,0.42), transparent)', mixBlendMode: 'screen', animation: 'ray-sweep 14s ease-in-out infinite' }} />
        <div className="absolute -top-1/4 left-0 h-[150vh] w-28 blur-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(180,150,255,0.34), transparent)', mixBlendMode: 'screen', animation: 'ray-sweep 19s ease-in-out 5s infinite' }} />

        {/* 星点 */}
        {STARS.map(([x, y, s, d, dur], i) => (
          <span key={`s${i}`} className="absolute rounded-full bg-white" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, boxShadow: '0 0 4px 1px rgba(200,225,255,0.85)', animation: `star-tw ${dur}s ease-in-out ${d}s infinite`, mixBlendMode: 'screen' }} />
        ))}

        {/* 四角闪钻（闪闪发亮） */}
        {SPARKLES.map(([x, y, size, dur, delay, color], i) => (
          <span key={`k${i}`} className="sparkle-star" style={{ left: `${x}%`, top: `${y}%`, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
            <SparkleShape size={size} color={color} />
          </span>
        ))}
      </div>
    </div>
  )
}
