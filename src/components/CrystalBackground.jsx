// 深空水晶背景：电光冰洞照片 + 星云辉光 + 密集星光/四角闪钻 + 光束（深色，会移动会闪）
import iceCave from '../assets/bg/icecave.webp'

// 可复用冰洞图（嵌入 hero 等容器，object-cover 铺满）
export function IceCaveImage({ className = '' }) {
  return <img src={iceCave} alt="" aria-hidden className={className} />
}

// 稳定分布的星点（无随机）
const STARS = []
{
  const seed = [7, 13, 23, 31, 41, 53, 61, 71, 83, 97]
  for (let i = 0; i < 78; i++) {
    const x = (seed[i % 10] * 9.7 + i * 17.3) % 100
    const y = (seed[(i + 3) % 10] * 7.3 + i * 11.1) % 100
    const s = 0.6 + ((i * 37) % 20) / 12
    const d = ((i * 29) % 40) / 10
    STARS.push([x, y, s, d, 3 + (i % 4)])
  }
}

// 稳定分布的四角闪钻（更亮的星光）
const SPARKLES = []
{
  const sx = [11, 27, 44, 63, 82, 91, 19, 36, 54, 71, 88, 6, 48, 76, 33, 60, 15, 84, 40, 68, 24, 95]
  const sy = [9, 22, 6, 30, 14, 41, 52, 63, 47, 70, 58, 34, 82, 88, 76, 12, 66, 25, 38, 92, 55, 44]
  for (let i = 0; i < sx.length; i++) {
    const size = 10 + (i % 4) * 6
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

export function CrystalBackground() {
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

      {/* ===== 深色：电光深空冰洞 ===== */}
      <div className="absolute inset-0 hidden dark:block" style={{ background: '#050912' }}>
        {/* 冰洞照片基底（顶部铺满，缓慢推拉移动） */}
        <div className="absolute inset-x-0 top-0 h-[72vh] overflow-hidden">
          <img
            src={iceCave}
            alt=""
            className="h-full w-full origin-center object-cover object-top animate-cosmic-drift"
            style={{ opacity: 0.62 }}
          />
          {/* 电蓝调色（让冰洞更像宇宙电光） */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,25,64,0.55) 0%, rgba(9,16,44,0.35) 40%, #050912 100%)', mixBlendMode: 'multiply' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 70% at 50% 22%, rgba(70,150,255,0.35), transparent 68%)', mixBlendMode: 'screen' }} />
        </div>
        {/* 深空底色叠加，把照片融进星海 */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% -6%, rgba(12,26,64,0) 0%, rgba(7,12,34,0.35) 46%, #050912 82%)' }} />

        {/* 星云辉光（screen 混合，缓慢流动） */}
        <div className="absolute -left-16 top-8 h-[46vh] w-[70vw] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(70,140,255,0.5), transparent 70%)', mixBlendMode: 'screen', animation: 'mist-drift 20s ease-in-out infinite' }} />
        <div className="absolute -right-16 top-1/3 h-[48vh] w-[70vw] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(165,110,255,0.46), transparent 70%)', mixBlendMode: 'screen', animation: 'mist-drift 26s ease-in-out infinite reverse' }} />
        <div className="absolute bottom-0 left-1/4 h-[42vh] w-[62vw] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(90,190,255,0.34), transparent 72%)', mixBlendMode: 'screen', animation: 'mist-drift 30s ease-in-out infinite' }} />

        {/* 斜向光束缓缓扫过 */}
        <div className="absolute -top-1/4 left-0 h-[150vh] w-40 blur-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(150,200,255,0.5), transparent)', mixBlendMode: 'screen', animation: 'ray-sweep 14s ease-in-out infinite' }} />
        <div className="absolute -top-1/4 left-0 h-[150vh] w-28 blur-2xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(180,150,255,0.4), transparent)', mixBlendMode: 'screen', animation: 'ray-sweep 19s ease-in-out 5s infinite' }} />

        {/* 底部水晶微光 */}
        <div className="absolute bottom-0 left-0 h-44 w-44 blur-2xl" style={{ background: 'radial-gradient(circle at 20% 100%, rgba(120,180,255,0.4), transparent 70%)', mixBlendMode: 'screen' }} />
        <div className="absolute bottom-0 right-0 h-48 w-48 blur-2xl" style={{ background: 'radial-gradient(circle at 80% 100%, rgba(180,130,255,0.36), transparent 70%)', mixBlendMode: 'screen' }} />

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
