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
import { GemCrystalIcon, DiamondSparkIcon, EnergyOrbIcon, GiftGlowIcon } from './CrystalIcons.jsx'
import { useRipple, Sparkles } from './effects.jsx'
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
          {/* 文字可读遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#04121f]/80 via-[#06182a]/40 to-[#06182a]/20" />
          {/* 进光 */}
          <div className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 -translate-y-10 rounded-full blur-3xl" style={{ background: 'radial-gradient(ellipse at center, rgba(224,246,255,0.55), transparent 70%)' }} />
          {/* 星光粒子 */}
          <Sparkles />
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
                className="group relative mt-5 inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/40 bg-white/15 px-6 py-3 text-[15px] font-semibold text-white glass shadow-card-lg transition active:scale-95"
                style={{ '--glow': 'rgba(150,200,255,0.85)' }}
              >
                <span className="absolute inset-0 rounded-full animate-glow-pulse" />
                <span className="relative grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-cyan-200 to-sky-500 shadow-[0_0_10px_rgba(160,220,255,0.9)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
                </span>
                <span className="relative">{t('home.start')}</span>
                <ChevronRight size={17} className="relative" />
              </button>
            </div>
            <div className="relative h-60 w-60 shrink-0 sm:h-72 sm:w-72">
              {/* 呼吸光环 */}
              <div className="absolute inset-2 rounded-full animate-breath" style={{ background: 'radial-gradient(circle, rgba(120,190,255,0.45), rgba(150,120,255,0.18) 55%, transparent 72%)' }} />
              {/* 旋转光点环 */}
              <div className="absolute inset-0 animate-orbit">
                <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_8px_2px_rgba(180,230,255,0.9)]" />
                <span className="absolute right-2 top-1/2 h-1 w-1 rounded-full bg-purple-200 shadow-[0_0_8px_2px_rgba(210,180,255,0.9)]" />
                <span className="absolute bottom-1 left-1/3 h-1.5 w-1.5 rounded-full bg-amber-100 shadow-[0_0_8px_2px_rgba(255,235,180,0.9)]" />
              </div>
              <div className="relative h-full w-full animate-float drop-shadow-2xl">
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
        <section className="mt-7">
          <div className="mb-3 px-1">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">{t('home.match.title')}</h2>
            <p className="text-[12px] text-neutral-400">{t('home.match.sub')}</p>
          </div>

          {/* 生日输入 */}
          <div className="mb-3 flex items-center gap-2 rounded-3xl border border-black/5 bg-white/80 p-2.5 shadow-card glass dark:border-white/10 dark:bg-neutral-900/60">
            <span className="pl-1 text-lg">🎂</span>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[14px] text-neutral-900 outline-none focus:border-brand-400 dark:border-white/10 dark:bg-neutral-800 dark:text-white"
            />
            <button
              onClick={generateByBirthday}
              className="shrink-0 rounded-xl bg-brand-500 px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-brand-600 active:scale-95"
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
                className="flex w-[100px] shrink-0 flex-col items-center gap-1 rounded-3xl border border-black/5 bg-white p-3 text-center shadow-card transition hover:-translate-y-0.5 hover:shadow-card-lg active:scale-95 dark:border-white/5 dark:bg-neutral-800"
              >
                <span className="text-2xl">{z.emoji}</span>
                <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">{lang === 'zh' ? z.name : ZODIAC_I18N[z.key]?.name}</div>
                <div className="text-[10px] text-neutral-400">{z.range}</div>
                <div className="mt-0.5 flex gap-0.5">
                  {z.crystals.map((id) => (
                    <Bead key={id} crystal={CRYSTAL_MAP[id]} size={16} />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Featured real-photo products */}
        <section className="mt-7">
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">{t('home.featured')}</h2>
              <p className="text-[12px] text-neutral-400">{t('home.featured.sub')}</p>
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
                  className="group flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-card-lg active:scale-[0.99] dark:border-white/5 dark:bg-neutral-800"
                >
                  <div className="relative aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 p-2 dark:from-neutral-700/50 dark:to-neutral-900">
                    <img src={pr.image} alt={name} className="h-full w-full object-contain drop-shadow-md transition group-hover:scale-105" />
                    {badge && (
                      <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                        {badge}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="text-[14px] font-semibold text-neutral-900 dark:text-white">{name}</div>
                    <div className="truncate text-[11px] text-neutral-400">{kws.join(' · ')}</div>
                    <div className="mt-1 text-[14px] font-bold text-brand-600 dark:text-brand-300">{min ? t('product.from', money(min)) : ''}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* AI banner */}
        <section className="mt-6">
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
            <div className="relative h-20 w-20 shrink-0 animate-spin-slow">
              <div className="absolute inset-0 rounded-full bg-white/10" />
              <Bead crystal={CRYSTAL_MAP['green-phantom']} size={80} className="drop-shadow-xl" />
            </div>
            <SparkleIcon size={120} className="absolute -right-6 -top-6 text-white/10" />
          </button>
        </section>

        {/* Crystal knowledge */}
        <section className="mt-7">
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
        </section>
      </div>

      <ProductSheet open={!!product} onClose={() => setProduct(null)} product={product} />
    </div>
  )
}

/* ---------- 立体水晶玻璃功能卡（带能量波纹） ---------- */
function FeatureCard({ f, label, desc, onClick }) {
  const { onDown, rippleNode } = useRipple()
  const Icon = f.Icon
  return (
    <button
      onClick={onClick}
      onPointerDown={onDown}
      style={{ '--glow': f.glow, background: `linear-gradient(160deg, ${f.from}, ${f.to})` }}
      className="group relative flex flex-col items-center gap-2 overflow-hidden rounded-3xl p-3 text-center text-white glass-card shadow-card transition hover:-translate-y-1 hover:shadow-card-lg active:scale-95 sm:p-4"
    >
      {/* 内发光 + 顶部高光 */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
      <span className="pointer-events-none absolute -inset-px rounded-3xl animate-glow-pulse opacity-70" />
      <span className="relative grid h-12 w-12 place-items-center sm:h-14 sm:w-14">
        <span className="absolute inset-0 rounded-full opacity-70 blur-md" style={{ background: f.glow }} />
        <span className="relative animate-float" style={{ animationDelay: '0.3s' }}>
          <Icon size={44} />
        </span>
      </span>
      <div className="relative">
        <div className="text-[13px] font-semibold drop-shadow sm:text-[14px]">{label}</div>
        <div className="hidden text-[10px] text-white/70 sm:block">{desc}</div>
      </div>
      {rippleNode}
    </button>
  )
}
