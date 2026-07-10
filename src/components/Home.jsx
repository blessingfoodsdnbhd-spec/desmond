import { useState } from 'react'
import { Bead } from './Bead.jsx'
import { BraceletRing } from './BraceletRing.jsx'
import { ProductSheet } from './ProductSheet.jsx'
import { IceCaveImage } from './CrystalBackground.jsx'
import { CRYSTALS, CRYSTAL_MAP } from '../data/crystals.js'
import { PRESETS, ZODIACS, BIRTH_MONTHS, zodiacByDate, buildPatternFromCrystals } from '../data/recommendations.js'
import { useStore, effectiveDefaultProducts } from '../data/store.js'
import { makeBead } from '../utils/bracelet.js'
import { useLang, localizeCrystal, money, PRESET_I18N, ZODIAC_I18N } from '../i18n.jsx'
import { GemCrystalIcon, DiamondSparkIcon, EnergyOrbIcon, GiftGlowIcon, ZodiacMedallion } from './CrystalIcons.jsx'
import { useRipple, HeroAtmosphere, Reveal } from './effects.jsx'
import { SparkleIcon, ChevronRight } from './icons.jsx'

const FEATURE_KEYS = [
  { Icon: GemCrystalIcon, t: 'feat.design', d: 'feat.design.d', from: '#1e7fd4', to: '#0b3f74', glow: 'rgba(56,150,230,0.75)' },
  { Icon: DiamondSparkIcon, t: 'feat.ai', d: 'feat.ai.d', from: '#9a4ff0', to: '#4a1a9c', glow: 'rgba(160,90,240,0.8)' },
  { Icon: EnergyOrbIcon, t: 'feat.energy', d: 'feat.energy.d', from: '#5a63e6', to: '#2a2192', glow: 'rgba(110,120,240,0.8)' },
  { Icon: GiftGlowIcon, t: 'feat.order', d: 'feat.order.d', from: '#e0a340', to: '#9a6414', glow: 'rgba(240,180,80,0.8)' },
]

function patternToBeads(pattern) {
  return pattern.map((id) => makeBead(id, 8))
}

// 首页大圈手链：14 颗大珠，围出宽阔的中心以显示招牌名字
const HERO_PATTERN = [
  'citrine', 'green-phantom', 'tiger-eye', 'citrine', 'amethyst', 'green-phantom', 'tiger-eye',
  'citrine', 'green-phantom', 'tiger-eye', 'citrine', 'amethyst', 'green-phantom', 'tiger-eye',
]
const heroBeads = HERO_PATTERN.map((id) => makeBead(id, 12))

export function Home({ onStart, onOpenGuide }) {
  const { t, lang } = useLang()
  const store = useStore()
  const [product, setProduct] = useState(null)
  const [birthday, setBirthday] = useState('1998-08-15')
  const featured = [...effectiveDefaultProducts(store), ...store.products]
  const startRipple = useRipple()

  const generateByBirthday = () => {
    const bd = new Date(birthday + 'T00:00:00')
    if (isNaN(bd.getTime())) return
    const m = bd.getMonth() + 1
    const d = bd.getDate()
    const z = zodiacByDate(m, d)
    const theme = BIRTH_MONTHS[m - 1]
    onStart(buildPatternFromCrystals([...z.crystals, ...theme.crystals], 14))
  }

  return (
    <div className="pb-24 lg:pb-12">
      <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
        {/* Hero · 沉浸式冰洞实景 */}
        <section className="relative min-h-[340px] overflow-hidden rounded-4xl shadow-card-lg sm:min-h-[380px]">
          <div className="absolute inset-0 animate-cave-in">
            <IceCaveImage className="h-full w-full object-cover animate-cave-drift" />
          </div>
          {/* 文字可读遮罩 · 深空宇宙 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050b1e]/90 via-[#0a1430]/60 to-[#0d1638]/40" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 70% at 50% 42%, rgba(60,120,255,0.14), transparent 70%)' }} />
          {/* 进光 */}
          <div className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 -translate-y-10 rounded-full blur-3xl" style={{ background: 'radial-gradient(ellipse at center, rgba(224,246,255,0.55), transparent 70%)' }} />
          {/* 沉浸氛围：能量雾 + 光线 + 漂浮粒子 */}
          <HeroAtmosphere />
          <div className="relative flex min-h-[340px] flex-col items-center justify-center gap-6 p-6 text-center sm:min-h-[380px] sm:flex-row sm:justify-between sm:p-9 sm:text-left">
            <div>
              <p className="text-[13px] font-medium tracking-wide text-cyan-200/90 drop-shadow">{t('brand.full')}</p>
              <h1 className="mt-2 text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-4xl">
                {t('home.heroTitle1')}
                <br />
                <span className="bg-gradient-to-r from-cyan-200 via-sky-100 to-white bg-clip-text text-transparent">{t('home.heroTitle2')}</span>
              </h1>
              <p className="mt-3 text-[14px] text-white/85 drop-shadow">{t('home.heroSub')}</p>
              <button
                onClick={() => onStart()}
                onPointerDown={startRipple.onDown}
                className="shimmer-sweep group relative mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/60 px-6 py-3 text-[15px] font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 active:scale-[0.96]"
                style={{ background: 'linear-gradient(140deg, rgba(24,52,104,0.6), rgba(30,22,72,0.55))', boxShadow: '0 0 22px -4px rgba(90,180,255,0.7), inset 0 1px 0 rgba(180,225,255,0.5)' }}
              >
                <span className="relative grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-cyan-100 to-sky-500 shadow-[0_0_10px_rgba(160,220,255,0.85)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
                </span>
                <span className="relative">{t('home.start')}</span>
                <ChevronRight size={17} className="relative transition-transform duration-300 group-hover:translate-x-0.5" />
                {startRipple.rippleNode}
              </button>
            </div>
            <div className="relative h-60 w-60 shrink-0 sm:h-72 sm:w-72">
              {/* 能量辉光（更强，宇宙感） */}
              <div className="absolute -inset-2 rounded-full animate-breath" style={{ background: 'radial-gradient(circle, rgba(110,180,255,0.55), rgba(150,110,255,0.28) 50%, transparent 70%)' }} />
              {/* 绕圈能量光点 */}
              <div className="absolute inset-0 animate-orbit">
                <span className="absolute left-1/2 top-1 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-200" style={{ boxShadow: '0 0 10px 3px rgba(150,220,255,0.95)' }} />
                <span className="absolute right-3 top-1/2 h-1 w-1 rounded-full bg-violet-200" style={{ boxShadow: '0 0 10px 3px rgba(200,170,255,0.95)' }} />
                <span className="absolute bottom-3 left-6 h-1.5 w-1.5 rounded-full bg-sky-200" style={{ boxShadow: '0 0 10px 3px rgba(160,210,255,0.95)' }} />
              </div>
              {/* 手链极轻微摇摆，像活的一样 */}
              <div className="relative h-full w-full animate-sway drop-shadow-2xl">
                <BraceletRing beads={heroBeads} brandStyle="hero" />
              </div>
            </div>
          </div>
        </section>

        {/* Features · 立体水晶玻璃卡 */}
        <section className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">
          {FEATURE_KEYS.map((f) => (
            <FeatureCard
              key={f.t}
              f={f}
              label={t(f.t)}
              desc={t(f.d)}
              onClick={() => {
                if (f.t === 'feat.ai') onStart('smart')
                else if (f.t === 'feat.energy') onOpenGuide?.()
                else onStart()
              }}
            />
          ))}
        </section>

        {/* 生日 · 星座配对 */}
        <Reveal as="section" className="mt-7">
          <div className="mb-3 px-1">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{t('home.match.title')}</h2>
            <p className="text-[12px] text-neutral-500 dark:text-neutral-400">{t('home.match.sub')}</p>
          </div>

          {/* 毛玻璃面板 */}
          <div className="rounded-4xl border border-white/60 bg-white/45 p-3 shadow-card glass-card dark:border-white/10 dark:bg-white/10 sm:p-4">
            {/* 生日输入 */}
            <div className="mb-3 flex items-center gap-2 rounded-3xl border border-white/70 bg-white/70 p-2 shadow-inner dark:border-white/10 dark:bg-neutral-900/50">
              <span className="grid h-10 w-10 shrink-0 place-items-center text-2xl">🎂</span>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="min-w-0 flex-1 rounded-2xl border border-black/5 bg-white px-3 py-2.5 text-center text-[15px] font-medium text-neutral-900 outline-none focus:border-violet-300 dark:border-white/10 dark:bg-neutral-800 dark:text-white"
              />
              <button
                onClick={generateByBirthday}
                className="shimmer-sweep shrink-0 rounded-2xl px-5 py-2.5 text-[14px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 active:scale-95"
                style={{ background: 'linear-gradient(140deg, #a274f5, #6d3bd6)', boxShadow: '0 0 18px -4px rgba(150,90,240,0.75), inset 0 1px 0 rgba(255,255,255,0.4)' }}
              >
                {t('home.match.generate')}
              </button>
            </div>

            {/* 十二星座 */}
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {ZODIACS.map((z) => (
                <button
                  key={z.key}
                  onClick={() => onStart(buildPatternFromCrystals(z.crystals, 12))}
                  className="flex w-[108px] shrink-0 flex-col items-center gap-1.5 rounded-3xl border border-white/70 bg-white/55 p-3 text-center shadow-card transition duration-300 hover:-translate-y-1 active:scale-95 dark:border-[rgba(90,170,255,0.5)] dark:bg-[rgba(14,24,48,0.55)] dark:shadow-[0_0_20px_-6px_rgba(90,170,255,0.6)]"
                >
                  {/* 发光星座星盘 */}
                  <ZodiacMedallion symbol={z.emoji} size={56} />
                  <div className="text-[14px] font-semibold text-neutral-900 dark:text-white">{lang === 'zh' ? z.name : ZODIAC_I18N[z.key]?.name}</div>
                  <div className="text-[10px] text-neutral-400">{z.range}</div>
                  <div className="mt-0.5 flex gap-0.5">
                    {z.crystals.map((id) => (
                      <Bead key={id} crystal={CRYSTAL_MAP[id]} size={17} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Featured real-photo products */}
        <Reveal as="section" className="mt-7">
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{t('home.featured')}</h2>
              <p className="text-[12px] text-neutral-500 dark:text-neutral-400">{t('home.featured.sub')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {featured.map((pr) => {
              const c = localizeCrystal(CRYSTAL_MAP[pr.crystalId], lang)
              const name = lang === 'zh' ? pr.name : pr.name_en
              const badge = lang === 'zh' ? pr.badge : pr.badge_en
              const kws = c?.keywords || pr.keywords || []
              const min = pr.sizes?.length ? Math.min(...pr.sizes.map((s) => s.price)) : 0
              return (
                <button
                  key={pr.id}
                  onClick={() => setProduct(pr)}
                  className="group flex flex-col overflow-hidden rounded-4xl border border-white/60 bg-white/50 text-left shadow-card glass-card transition duration-300 hover:-translate-y-1 hover:shadow-card-lg active:scale-[0.99] dark:border-[rgba(100,160,255,0.4)] dark:bg-[rgba(16,26,50,0.55)] dark:shadow-[0_0_22px_-8px_rgba(90,160,255,0.55)]"
                >
                  <div className="relative aspect-square p-2">
                    <div className="absolute inset-2 rounded-3xl bg-gradient-to-br from-white/70 to-sky-50/40 dark:from-neutral-700/40 dark:to-neutral-900/40" />
                    <img src={pr.image} alt={name} className="relative h-full w-full object-contain drop-shadow-lg transition duration-300 group-hover:scale-105" />
                    {badge && (
                      <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                        {badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-end justify-between p-3.5 pt-1">
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold text-neutral-900 dark:text-white">{name}</div>
                      <div className="truncate text-[11px] text-neutral-400">{kws.join(' · ')}</div>
                      <div className="mt-1 text-[15px] font-bold text-brand-600 dark:text-brand-300">{min ? t('product.from', money(min)) : ''}</div>
                    </div>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-sky-200/70 bg-white/70 text-sky-500 shadow-sm backdrop-blur transition group-hover:bg-sky-500 group-hover:text-white dark:border-white/10 dark:bg-white/10">
                      <ChevronRight size={17} />
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* AI banner */}
        <Reveal as="section" className="mt-6">
          <button
            onClick={() => onStart('smart')}
            className="relative flex w-full items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-emerald-600 p-5 text-left text-white shadow-card-lg transition hover:shadow-glow active:scale-[0.99]"
          >
            <div className="relative z-10 flex-1">
              <div className="text-[17px] font-bold">{t('home.ai.title')}</div>
              <p className="mt-1 text-[13px] text-white/80">{t('home.ai.sub')}</p>
              <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-4 py-1.5 text-[13px] font-medium backdrop-blur">
                {t('home.ai.btn')} <ChevronRight size={15} />
              </span>
            </div>
            <div className="relative h-20 w-20 shrink-0 animate-float">
              <div className="absolute inset-0 rounded-full bg-white/10 animate-breath" />
              <Bead crystal={CRYSTAL_MAP['green-phantom']} size={80} className="drop-shadow-xl" />
            </div>
            <SparkleIcon size={120} className="absolute -right-6 -top-6 text-white/10" />
          </button>
        </Reveal>

        {/* Crystal knowledge */}
        <Reveal as="section" className="mt-7">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">{t('home.know')}</h2>
            <button onClick={() => onOpenGuide?.()} className="flex items-center gap-0.5 text-[13px] text-neutral-400 transition hover:text-brand-500">
              {t('home.more')} <ChevronRight size={15} />
            </button>
          </div>
          <button onClick={() => onOpenGuide?.()} className="block w-full rounded-3xl border border-black/5 bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-card-lg active:scale-[0.99] dark:border-white/5 dark:bg-neutral-800">
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 shrink-0 grid-cols-3 gap-1 rounded-2xl bg-gradient-to-br from-purple-100 to-white p-2 dark:from-purple-900/40 dark:to-neutral-900">
                {['amethyst', 'rose', 'citrine', 'green-phantom', 'lapis', 'obsidian'].map((id) => (
                  <Bead key={id} crystal={CRYSTAL_MAP[id]} size={18} />
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-semibold text-neutral-900 dark:text-white">{t('home.know.title')}</div>
                <p className="mt-1 line-clamp-2 text-[13px] text-neutral-500 dark:text-neutral-400">{t('home.know.desc')}</p>
                <div className="mt-1.5 text-[11px] text-neutral-400">{t('home.know.read')}</div>
              </div>
              <ChevronRight size={18} className="shrink-0 text-neutral-300" />
            </div>
          </button>
          {/* Quick crystal chips */}
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CRYSTALS.map((raw) => {
              const c = localizeCrystal(raw, lang)
              return (
                <button
                  key={c.id}
                  onClick={() => onOpenGuide?.()}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/5 bg-white py-1.5 pl-1.5 pr-3 shadow-card transition hover:-translate-y-0.5 dark:border-white/5 dark:bg-neutral-800"
                >
                  <Bead crystal={c} size={26} />
                  <span className="text-[12px] font-medium text-neutral-700 dark:text-neutral-200">{c.name}</span>
                </button>
              )
            })}
          </div>
        </Reveal>
      </div>

      <ProductSheet open={!!product} onClose={() => setProduct(null)} product={product} />
    </div>
  )
}

/* ---------- 深色能量玻璃功能卡（发光边框 + 绕圈光环 + 波纹） ---------- */
function FeatureCard({ f, label, desc, onClick }) {
  const { onDown, rippleNode } = useRipple()
  const Icon = f.Icon
  return (
    <button
      onClick={onClick}
      onPointerDown={onDown}
      style={{
        border: `1px solid ${f.glow}`,
        background: 'linear-gradient(160deg, rgba(18,32,60,0.72), rgba(10,18,38,0.78))',
        boxShadow: `0 0 20px -6px ${f.glow}, inset 0 1px 0 rgba(255,255,255,0.14)`,
      }}
      className="group relative flex flex-col items-center gap-2 overflow-hidden rounded-3xl p-3 text-center text-white glass-card transition duration-300 hover:-translate-y-1 active:scale-[0.96] sm:p-4"
    >
      {/* 顶部柔光 + 底部能量渐变 */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/12 to-transparent" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-70" style={{ background: `linear-gradient(to top, ${f.glow}, transparent 82%)`, mixBlendMode: 'screen' }} />
      {/* 图标 + 绕圈能量光环 */}
      <span className="glow-ring relative grid h-12 w-12 place-items-center rounded-full sm:h-14 sm:w-14" style={{ '--rc': f.glow }}>
        <span className="relative z-10 animate-float" style={{ animationDelay: '0.3s' }}>
          <Icon size={38} />
        </span>
      </span>
      <div className="relative">
        <div className="text-[13px] font-semibold drop-shadow sm:text-[14px]">{label}</div>
        <div className="hidden text-[10px] text-white/60 sm:block">{desc}</div>
      </div>
      {rippleNode}
    </button>
  )
}
