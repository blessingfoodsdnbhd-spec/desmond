import { Bead } from './Bead.jsx'
import { BraceletRing } from './BraceletRing.jsx'
import { CRYSTALS, CRYSTAL_MAP } from '../data/crystals.js'
import { PRESETS } from '../data/recommendations.js'
import { makeBead } from '../utils/bracelet.js'
import {
  DesignIcon,
  SparkleIcon,
  EnergyIcon,
  OrderTagIcon,
  ChevronRight,
} from './icons.jsx'

const FEATURES = [
  { icon: DesignIcon, title: '自由设计', desc: '自由搭配水晶' },
  { icon: SparkleIcon, title: 'AI 推荐', desc: '智能搭配建议' },
  { icon: EnergyIcon, title: '能量解读', desc: '解读水晶能量' },
  { icon: OrderTagIcon, title: '一键下单', desc: '定制专属手链' },
]

function patternToBeads(pattern) {
  return pattern.map((id) => makeBead(id, 8))
}

export function Home({ onStart }) {
  return (
    <div className="pb-24 lg:pb-12">
      <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-brand-50 via-white to-emerald-50/60 p-6 shadow-card dark:from-brand-900/40 dark:via-neutral-900 dark:to-neutral-900 sm:p-9">
          <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-700/20" />
          <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="text-center sm:text-left">
              <p className="text-[13px] font-medium tracking-wide text-brand-600 dark:text-brand-300">灵感石 · Stone Lab</p>
              <h1 className="mt-2 text-2xl font-bold leading-tight text-neutral-900 dark:text-white sm:text-4xl">
                设计专属你的
                <br />
                <span className="bg-gradient-to-r from-brand-500 to-emerald-500 bg-clip-text text-transparent">水晶能量手链</span>
              </h1>
              <p className="mt-3 text-[14px] text-neutral-500 dark:text-neutral-400">选择水晶 · 设计搭配 · 制作专属</p>
              <button
                onClick={() => onStart()}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-6 py-3 text-[15px] font-medium text-white shadow-glow transition hover:bg-brand-600 hover:shadow-card-lg active:scale-95"
              >
                开始设计 <ChevronRight size={17} />
              </button>
            </div>
            <div className="relative h-44 w-44 shrink-0 animate-float sm:h-56 sm:w-56">
              <BraceletRing beads={patternToBeads(PRESETS[0].pattern)} />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">
          {FEATURES.map((f) => (
            <button
              key={f.title}
              onClick={() => onStart()}
              className="flex flex-col items-center gap-2 rounded-3xl border border-black/5 bg-white/70 p-3 text-center shadow-card glass transition hover:-translate-y-0.5 hover:shadow-card-lg active:scale-95 dark:border-white/5 dark:bg-neutral-900/60 sm:p-5"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-900/40 dark:text-brand-300 sm:h-14 sm:w-14">
                <f.icon size={22} />
              </span>
              <div>
                <div className="text-[13px] font-semibold text-neutral-900 dark:text-white sm:text-[15px]">{f.title}</div>
                <div className="hidden text-[11px] text-neutral-400 sm:block">{f.desc}</div>
              </div>
            </button>
          ))}
        </section>

        {/* Popular presets */}
        <section className="mt-7">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">热门推荐</h2>
            <button onClick={() => onStart()} className="flex items-center gap-0.5 text-[13px] text-neutral-400 transition hover:text-brand-500">
              更多 <ChevronRight size={15} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => onStart(p.pattern)}
                className="group flex items-center gap-3 rounded-3xl border border-black/5 bg-white p-3 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-card-lg active:scale-[0.99] dark:border-white/5 dark:bg-neutral-800 sm:flex-col sm:items-stretch sm:text-center"
              >
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 p-1 dark:from-neutral-700 dark:to-neutral-900 sm:h-auto sm:w-full sm:aspect-square">
                  <BraceletRing beads={patternToBeads(p.pattern)} />
                </div>
                <div className="min-w-0 flex-1 sm:mt-1">
                  <div className="text-[15px] font-semibold text-neutral-900 dark:text-white">{p.name}</div>
                  <div className="truncate text-[12px] text-neutral-400">{p.tags.join(' · ')}</div>
                  <div className="mt-1 text-[15px] font-bold text-brand-600 dark:text-brand-300">¥{p.price}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* AI banner */}
        <section className="mt-6">
          <button
            onClick={() => onStart('smart')}
            className="relative flex w-full items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-emerald-600 p-5 text-left text-white shadow-card-lg transition hover:shadow-glow active:scale-[0.99]"
          >
            <div className="relative z-10 flex-1">
              <div className="text-[17px] font-bold">AI 智能搭配推荐</div>
              <p className="mt-1 text-[13px] text-white/80">告诉我们你的需求，AI 为你推荐最合适的水晶组合</p>
              <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-4 py-1.5 text-[13px] font-medium backdrop-blur">
                开始智能推荐 <ChevronRight size={15} />
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
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">水晶知识</h2>
            <button onClick={() => onStart()} className="flex items-center gap-0.5 text-[13px] text-neutral-400 transition hover:text-brand-500">
              更多 <ChevronRight size={15} />
            </button>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-card dark:border-white/5 dark:bg-neutral-800">
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 shrink-0 grid-cols-3 gap-1 rounded-2xl bg-gradient-to-br from-purple-100 to-white p-2 dark:from-purple-900/40 dark:to-neutral-900">
                {['amethyst', 'rose', 'citrine', 'green-phantom', 'lapis', 'obsidian'].map((id) => (
                  <Bead key={id} crystal={CRYSTAL_MAP[id]} size={18} />
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-semibold text-neutral-900 dark:text-white">不同水晶的能量与功效</div>
                <p className="mt-1 line-clamp-2 text-[13px] text-neutral-500 dark:text-neutral-400">
                  了解各种水晶的独特能量，选择最适合你的水晶伙伴，让能量伴你左右。
                </p>
                <div className="mt-1.5 text-[11px] text-neutral-400">1234 人已阅读</div>
              </div>
            </div>
          </div>
          {/* Quick crystal chips */}
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CRYSTALS.map((c) => (
              <button
                key={c.id}
                onClick={() => onStart()}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/5 bg-white py-1.5 pl-1.5 pr-3 shadow-card transition hover:-translate-y-0.5 dark:border-white/5 dark:bg-neutral-800"
              >
                <Bead crystal={c} size={26} />
                <span className="text-[12px] font-medium text-neutral-700 dark:text-neutral-200">{c.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
