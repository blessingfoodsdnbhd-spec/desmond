// 深空水晶背景：深蓝黑 + 星云辉光 + 星空微光（深色）；浅色回退冰洞照片
import iceCave from '../assets/bg/icecave.webp'

// 可复用冰洞图（嵌入 hero 等容器，object-cover 铺满）
export function IceCaveImage({ className = '' }) {
  return <img src={iceCave} alt="" aria-hidden className={className} />
}

// 稳定分布的星空（无随机）
const STARS = []
{
  const seed = [7, 13, 23, 31, 41, 53, 61, 71, 83, 97]
  for (let i = 0; i < 60; i++) {
    const x = (seed[i % 10] * 9.7 + i * 17.3) % 100
    const y = (seed[(i + 3) % 10] * 7.3 + i * 11.1) % 100
    const s = 0.6 + ((i * 37) % 20) / 14
    const d = ((i * 29) % 40) / 10
    STARS.push([x, y, s, d, 3 + (i % 4)])
  }
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

      {/* ===== 深色：深空宇宙 ===== */}
      <div className="absolute inset-0 hidden dark:block" style={{ background: 'radial-gradient(120% 90% at 50% -10%, #0a1330 0%, #070c22 45%, #050912 100%)' }}>
        {/* 星云辉光（screen 混合，读作光而非颜料） */}
        <div className="absolute -left-16 top-10 h-[46vh] w-[70vw] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(70,140,255,0.42), transparent 70%)', mixBlendMode: 'screen', animation: 'mist-drift 20s ease-in-out infinite' }} />
        <div className="absolute -right-16 top-1/3 h-[48vh] w-[70vw] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(160,110,255,0.38), transparent 70%)', mixBlendMode: 'screen', animation: 'mist-drift 26s ease-in-out infinite reverse' }} />
        <div className="absolute bottom-0 left-1/4 h-[40vh] w-[60vw] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(90,190,255,0.28), transparent 72%)', mixBlendMode: 'screen', animation: 'mist-drift 30s ease-in-out infinite' }} />
        {/* 底部水晶微光 */}
        <div className="absolute bottom-0 left-0 h-40 w-40 blur-2xl" style={{ background: 'radial-gradient(circle at 20% 100%, rgba(120,180,255,0.35), transparent 70%)', mixBlendMode: 'screen' }} />
        <div className="absolute bottom-0 right-0 h-44 w-44 blur-2xl" style={{ background: 'radial-gradient(circle at 80% 100%, rgba(175,130,255,0.32), transparent 70%)', mixBlendMode: 'screen' }} />
        {/* 星空 */}
        {STARS.map(([x, y, s, d, dur], i) => (
          <span key={i} className="absolute rounded-full bg-white" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, boxShadow: '0 0 4px 1px rgba(200,225,255,0.8)', animation: `star-tw ${dur}s ease-in-out ${d}s infinite`, mixBlendMode: 'screen' }} />
        ))}
      </div>
    </div>
  )
}
