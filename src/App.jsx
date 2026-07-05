import { useEffect, useMemo, useState } from 'react'
import { Home } from './components/Home.jsx'
import { Designer } from './components/Designer.jsx'
import { Bead } from './components/Bead.jsx'
import { CRYSTALS, CATEGORIES, ELEMENTS } from './data/crystals.js'
import { makeBead } from './utils/bracelet.js'
import {
  HomeIcon,
  DesignIcon,
  DiscoverIcon,
  OrderIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  ArrowLeft,
  CheckIcon,
  SparkleIcon,
} from './components/icons.jsx'

const TABS = [
  { key: 'home', label: '首页', icon: HomeIcon },
  { key: 'design', label: '设计', icon: DesignIcon },
  { key: 'discover', label: '发现', icon: DiscoverIcon },
  { key: 'order', label: '订单', icon: OrderIcon },
  { key: 'me', label: '我的', icon: UserIcon },
]

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('sl-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b0b0c' : '#ffffff')
    localStorage.setItem('sl-theme', dark ? 'dark' : 'light')
  }, [dark])
  return [dark, setDark]
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [dark, setDark] = useDarkMode()
  const [initialBeads, setInitialBeads] = useState([])
  const [designKey, setDesignKey] = useState(0)

  const start = (pattern) => {
    if (Array.isArray(pattern)) {
      setInitialBeads(pattern.map((id) => makeBead(id, 8)))
      setDesignKey((k) => k + 1)
    } else if (pattern === undefined) {
      // keep current design
    }
    setTab('design')
  }

  const headers = {
    home: { title: '水晶手链 DIY', sub: '灵感石 · Stone Lab' },
    design: { title: '自由设计', sub: '选择水晶 · 设计搭配' },
    discover: { title: '发现', sub: '水晶能量图鉴' },
    order: { title: '订单', sub: '我的定制记录' },
    me: { title: '我的', sub: 'Stone Lab 会员' },
  }
  const h = headers[tab]

  return (
    <div className="min-h-full bg-neutral-50 font-sans text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 glass dark:border-white/5 dark:bg-neutral-950/80">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
          {tab !== 'home' && (
            <button onClick={() => setTab('home')} className="grid h-9 w-9 place-items-center rounded-full text-neutral-500 transition hover:bg-black/5 active:scale-90 dark:hover:bg-white/10" aria-label="返回">
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-[17px] font-semibold leading-tight">{h.title}</div>
            <div className="truncate text-[11px] text-neutral-400">{h.sub}</div>
          </div>
          {tab === 'design' && (
            <button className="flex items-center gap-1 rounded-full border border-brand-300 px-3.5 py-1.5 text-[13px] font-medium text-brand-600 transition hover:bg-brand-50 active:scale-95 dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900/30">
              <CheckIcon size={14} /> 保存设计
            </button>
          )}
          <button
            onClick={() => setDark((d) => !d)}
            className="grid h-9 w-9 place-items-center rounded-full text-neutral-500 transition hover:bg-black/5 active:scale-90 dark:text-neutral-300 dark:hover:bg-white/10"
            aria-label="切换深色模式"
          >
            {dark ? <SunIcon size={19} /> : <MoonIcon size={19} />}
          </button>
        </div>
      </header>

      {/* Pages */}
      <main className="animate-fade-in" key={tab}>
        {tab === 'home' && <Home onStart={start} />}
        {tab === 'design' && <Designer key={designKey} dark={dark} initialBeads={initialBeads} />}
        {tab === 'discover' && <Discover onStart={start} />}
        {tab === 'order' && <Orders onStart={start} />}
        {tab === 'me' && <Profile dark={dark} setDark={setDark} />}
      </main>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/85 glass dark:border-white/5 dark:bg-neutral-950/85" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-6xl items-stretch justify-around px-2">
          {TABS.map((t) => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 transition ${active ? 'text-brand-600 dark:text-brand-400' : 'text-neutral-400'}`}
              >
                <t.icon size={23} className={active ? 'scale-105' : ''} />
                <span className="text-[10px] font-medium">{t.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

/* ---------- 发现：水晶能量图鉴 ---------- */
function Discover({ onStart }) {
  const [cat, setCat] = useState('all')
  const list = useMemo(() => (cat === 'all' ? CRYSTALS : CRYSTALS.filter((c) => c.category.includes(cat))), [cat])
  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-4 sm:px-6">
      <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${cat === c.key ? 'bg-brand-500 text-white' : 'bg-black/5 text-neutral-500 dark:bg-white/8 dark:text-neutral-300'}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((c) => (
          <div key={c.id} className="flex gap-4 rounded-3xl border border-black/5 bg-white p-4 shadow-card dark:border-white/5 dark:bg-neutral-800">
            <Bead crystal={c} size={64} className="shrink-0 drop-shadow-md" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-semibold text-neutral-900 dark:text-white">{c.name}</span>
                <span className="text-[11px] text-neutral-400">{c.pinyin}</span>
                <span className="ml-auto rounded px-1.5 py-0.5 text-[10px] font-medium text-white" style={{ background: ELEMENTS[c.element]?.color }}>
                  五行·{ELEMENTS[c.element]?.label}
                </span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-300">{c.energy}</p>
              <div className="mt-2 flex items-center gap-2">
                {c.keywords.map((k) => (
                  <span key={k} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">{k}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => onStart()} className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-500 py-3.5 font-medium text-white shadow-glow transition hover:bg-brand-600 active:scale-[0.99]">
        <SparkleIcon size={18} /> 去设计我的手链
      </button>
    </div>
  )
}

/* ---------- 订单：空状态 ---------- */
function Orders({ onStart }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 pb-28 pt-24 text-center">
      <div className="grid h-24 w-24 place-items-center rounded-full bg-brand-50 dark:bg-brand-900/30">
        <OrderIcon size={44} className="text-brand-400" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-neutral-900 dark:text-white">还没有订单</h3>
      <p className="mt-1.5 text-[14px] text-neutral-500 dark:text-neutral-400">设计一条专属你的水晶能量手链，开启定制之旅。</p>
      <button onClick={() => onStart()} className="mt-6 rounded-full bg-brand-500 px-6 py-3 text-[15px] font-medium text-white shadow-glow transition hover:bg-brand-600 active:scale-95">
        立即设计
      </button>
    </div>
  )
}

/* ---------- 我的：会员 + 设置 ---------- */
function Profile({ dark, setDark }) {
  const rows = [
    { label: '我的设计', value: '3 条草稿' },
    { label: '收藏水晶', value: '8 种' },
    { label: '能量档案', value: '已完善' },
    { label: '关于灵感石', value: 'v1.0.0' },
  ]
  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-4 sm:px-6">
      <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-br from-brand-500 to-emerald-600 p-5 text-white shadow-card-lg">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-white/20 text-2xl backdrop-blur">✦</div>
        <div>
          <div className="text-[17px] font-semibold">灵感石会员</div>
          <div className="text-[13px] text-white/80">定制你的专属能量</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-3xl border border-black/5 bg-white p-4 shadow-card dark:border-white/5 dark:bg-neutral-800">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-900/30 dark:text-brand-300">
            {dark ? <MoonIcon size={20} /> : <SunIcon size={20} />}
          </span>
          <div>
            <div className="text-[15px] font-medium text-neutral-900 dark:text-white">深色模式</div>
            <div className="text-[12px] text-neutral-400">跟随心情自由切换</div>
          </div>
        </div>
        <button
          onClick={() => setDark((d) => !d)}
          className={`relative h-7 w-12 rounded-full transition ${dark ? 'bg-brand-500' : 'bg-neutral-300'}`}
          aria-label="切换深色模式"
        >
          <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${dark ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-card dark:border-white/5 dark:bg-neutral-800">
        {rows.map((r, i) => (
          <div key={r.label} className={`flex items-center justify-between px-4 py-3.5 ${i > 0 ? 'border-t border-black/5 dark:border-white/5' : ''}`}>
            <span className="text-[15px] text-neutral-800 dark:text-neutral-100">{r.label}</span>
            <span className="text-[13px] text-neutral-400">{r.value}</span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-[12px] text-neutral-400">灵感石 · Stone Lab · 用心传递每一份能量</p>
    </div>
  )
}
