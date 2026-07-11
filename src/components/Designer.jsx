import { useEffect, useMemo, useRef, useState } from 'react'
import { Bead } from './Bead.jsx'
import { BraceletRing } from './BraceletRing.jsx'
import { SortableBeadStrip } from './SortableBeadStrip.jsx'
import { SmartRecommend } from './SmartRecommend.jsx'
import { ExportSheet } from './ExportSheet.jsx'
import { Modal } from './Modal.jsx'
import {
  CRYSTALS,
  CATEGORIES,
  SIZES,
  CRYSTAL_MAP,
  ELEMENTS,
  beadPrice,
} from '../data/crystals.js'
import { makeBead, summarize, recommendCount, beadsToFill } from '../utils/bracelet.js'
import { randomPattern } from '../data/recommendations.js'
import { useStore, effectiveDefaultBeads } from '../data/store.js'
import {
  useLang,
  localizeCrystal,
  money,
  CATEGORY_I18N,
  ELEMENT_I18N,
  CRYSTAL_I18N,
} from '../i18n.jsx'
import {
  TrashIcon,
  UndoIcon,
  RedoIcon,
  ShuffleIcon,
  SearchIcon,
  SparkleIcon,
  WandIcon,
  ChevronRight,
  CheckIcon,
  PlusIcon,
  EnergyIcon,
  DownloadIcon,
  OrderIcon,
  ShareIcon,
} from './icons.jsx'

export function Designer({ dark, initialBeads, smartSignal }) {
  const { t, lang } = useLang()
  const store = useStore()
  const customBeads = store.beads
  const [beads, setBeads] = useState(initialBeads || [])
  const [past, setPast] = useState([])
  const [future, setFuture] = useState([])
  const [size, setSize] = useState(8)
  const [wrist, setWrist] = useState(16)
  const [cat, setCat] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedUid, setSelectedUid] = useState(null)
  const [step, setStep] = useState(0)
  const [detail, setDetail] = useState(null) // localized crystal for detail modal
  const [showSmart, setShowSmart] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showEnergy, setShowEnergy] = useState(false)
  const [toast, setToast] = useState('')
  const [assembling, setAssembling] = useState(false)
  const toastTimer = useRef(null)
  const assembleTimer = useRef(null)

  const STEPS = [t('step.choose'), t('step.arrange'), t('step.finish')]

  // 从首页「开始智能推荐」进入时，直接弹出智能搭配面板
  useEffect(() => {
    if (smartSignal) setShowSmart(true)
  }, [smartSignal])

  // 从首页带方案进入时，播放珠子飞入组成手链动画
  useEffect(() => {
    if ((initialBeads?.length || 0) > 0) {
      setAssembling(true)
      const tmr = setTimeout(() => setAssembling(false), 1400)
      return () => clearTimeout(tmr)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const commit = (next) => {
    setPast((p) => [...p.slice(-40), beads])
    setFuture([])
    setBeads(next)
  }
  const undo = () => {
    if (!past.length) return
    setFuture((f) => [beads, ...f])
    setBeads(past[past.length - 1])
    setPast((p) => p.slice(0, -1))
  }
  const redo = () => {
    if (!future.length) return
    setPast((p) => [...p, beads])
    setBeads(future[0])
    setFuture((f) => f.slice(1))
  }

  const notify = (msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 1500)
  }

  const addBead = (crystal) => {
    commit([...beads, makeBead(crystal.id, size)])
    notify(t('design.added', localizeCrystal(CRYSTAL_MAP[crystal.id], lang)?.name, size))
  }
  const removeSelected = () => {
    if (!selectedUid) return
    commit(beads.filter((b) => b.uid !== selectedUid))
    setSelectedUid(null)
  }
  const clearAll = () => {
    if (!beads.length) return
    commit([])
    setSelectedUid(null)
  }
  const reorder = (next) => setBeads(next) // 拖拽即时更新，不逐帧写历史

  const applyPattern = (ids, label) => {
    commit(ids.map((id) => makeBead(id, size)))
    if (label) notify(label)
    // 珠子飞入组成手链动画
    setAssembling(true)
    clearTimeout(assembleTimer.current)
    assembleTimer.current = setTimeout(() => setAssembling(false), 1400)
    // 生成后滚到顶部，看到手链预览与价钱（等弹窗关闭、恢复滚动后再滚）
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 150)
  }
  const randomize = () => {
    const n = beads.length || recommendCount(wrist, size)
    applyPattern(randomPattern(n), t('design.randomToast'))
  }
  const autoFill = () => {
    const { needed } = beadsToFill(beads, wrist, size)
    if (needed <= 0) {
      notify(t('design.reached'))
      return
    }
    const base = beads.length ? beads.map((b) => b.crystalId) : ['clear']
    const add = Array.from({ length: needed }, (_, i) => makeBead(base[i % base.length], size))
    commit([...beads, ...add])
    notify(t('design.filled', needed))
  }

  const stats = useMemo(() => summarize(beads), [beads])
  const rec = useMemo(() => beadsToFill(beads, wrist, size), [beads, wrist, size])

  const filtered = useMemo(() => {
    let list = [...effectiveDefaultBeads(store), ...customBeads]
    if (cat !== 'all') list = list.filter((c) => c.category.includes(cat))
    const q = query.trim().toLowerCase()
    if (q)
      list = list.filter((c) => {
        const en = CRYSTAL_I18N[c.id]
        return (
          c.name.includes(query) ||
          (c.pinyin || '').toLowerCase().includes(q) ||
          c.keywords.some((k) => k.includes(query)) ||
          en?.keywords.some((k) => k.toLowerCase().includes(q))
        )
      })
    return list
  }, [cat, query, store])

  const selectedCrystal = localizeCrystal(CRYSTAL_MAP[beads.find((b) => b.uid === selectedUid)?.crystalId], lang)

  // 顶部模式 Tab
  const TABS = [
    { k: 'free', label: lang === 'zh' ? '自由设计' : 'Free Design' },
    { k: 'ai', label: lang === 'zh' ? 'AI 推荐' : 'AI Picks' },
    { k: 'energy', label: lang === 'zh' ? '能量解读' : 'Energy' },
    { k: 'order', label: lang === 'zh' ? '一键下单' : 'Order' },
  ]
  const onTab = (k) => {
    if (k === 'ai') setShowSmart(true)
    else if (k === 'energy') setShowEnergy(true)
    else if (k === 'order') (beads.length ? setShowExport(true) : notify(t('design.addFirst')))
  }
  const WRISTS = [
    { k: 'S', cm: 15 }, { k: 'M', cm: 16 }, { k: 'L', cm: 17 }, { k: 'XL', cm: 18 },
  ]
  const BEAD_SIZES = [8, 10, 12]

  // 依手围+珠子大小自动算需要几粒，按现有水晶花样重新铺满，颗数与价钱随之更新
  const refit = (nextWrist, nextSize) => {
    if (!beads.length) return
    const n = recommendCount(nextWrist, nextSize)
    const ids = beads.map((b) => b.crystalId)
    commit(Array.from({ length: n }, (_, i) => makeBead(ids[i % ids.length], nextSize)))
  }
  const changeWrist = (cm) => { setWrist(cm); refit(cm, size) }
  const changeSize = (s) => { setSize(s); refit(wrist, s) }
  // 显示价钱：有珠子=实际总价（随大小重算）；空手链=按手围+珠子大小预估满串价
  const isEstimate = beads.length === 0
  const displayPrice = isEstimate
    ? recommendCount(wrist, size) * beadPrice(CRYSTAL_MAP['clear'], size)
    : stats.price

  // 能量分析：五行分布
  const energyEls = useMemo(() => {
    const el = {}
    beads.forEach((b) => {
      const c = CRYSTAL_MAP[b.crystalId]
      if (c) el[c.element] = (el[c.element] || 0) + 1
    })
    return Object.entries(el).sort((a, b) => b[1] - a[1])
  }, [beads])

  return (
    <div className="mx-auto max-w-3xl px-4 pb-32 pt-3 sm:px-6 lg:pb-10">
      {/* ===== 顶部模式 Tab ===== */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1">
        {TABS.map((tb) => {
          const active = tb.k === 'free'
          return (
            <button
              key={tb.k}
              onClick={() => onTab(tb.k)}
              className={`relative px-1.5 py-2 text-[15px] font-semibold transition ${active ? 'text-white' : 'text-neutral-400 dark:text-neutral-400'}`}
            >
              {active && <span className="absolute -left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.8)]" />}
              {tb.label}
              {active && <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />}
            </button>
          )
        })}
      </div>

      {/* ===== 手链预览 + 右侧工具 ===== */}
      <div className="mt-4 flex gap-3">
        <div className="relative flex-1">
          <div className="mx-auto aspect-square w-full max-w-[340px] rounded-full">
            <BraceletRing
              beads={beads}
              selectedUid={selectedUid}
              onSelectBead={setSelectedUid}
              onClearSelection={() => setSelectedUid(null)}
              assembling={assembling}
            />
          </div>
          {beads.length === 0 && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <p className="text-center text-[14px] leading-relaxed text-neutral-300/80">
                {lang === 'zh' ? '拖拽水晶或' : 'Drag a crystal or'}<br />
                {lang === 'zh' ? '点击添加到手链' : 'tap to add to bracelet'}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-2.5">
          <RailBtn onClick={clearAll} icon={<TrashIcon size={18} />} label={lang === 'zh' ? '清空' : 'Clear'} disabled={!beads.length} />
          <RailBtn onClick={undo} icon={<UndoIcon size={18} />} label={lang === 'zh' ? '撤销' : 'Undo'} disabled={!past.length} />
          <RailBtn onClick={redo} icon={<RedoIcon size={18} />} label={lang === 'zh' ? '重做' : 'Redo'} disabled={!future.length} />
          <RailBtn onClick={() => (beads.length ? setShowExport(true) : notify(t('design.addFirst')))} icon={<DownloadIcon size={18} />} label={lang === 'zh' ? '保存' : 'Save'} />
        </div>
      </div>

      {/* 选中珠子操作 */}
      {selectedUid && selectedCrystal && (
        <div className="mt-1 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 animate-fade-in">
          <div className="flex items-center gap-2">
            <Bead crystal={selectedCrystal} size={26} />
            <span className="text-[13px] font-medium text-neutral-200">{t('design.selected')} · {selectedCrystal.name}</span>
          </div>
          <button onClick={removeSelected} className="flex items-center gap-1 rounded-full bg-red-500/90 px-3 py-1.5 text-[12px] font-medium text-white transition active:scale-95">
            <TrashIcon size={14} /> {t('design.delete')}
          </button>
        </div>
      )}

      {/* 拖拽重排 */}
      {beads.length > 0 && (
        <div className="mt-3 rounded-2xl border border-white/8 bg-white/5 p-2">
          <SortableBeadStrip beads={beads} onReorder={reorder} onSelect={setSelectedUid} selectedUid={selectedUid} emptyHint={t('design.strip')} />
        </div>
      )}

      {/* ===== 手链设置 ===== */}
      <div className="mt-5 flex items-end justify-between">
        <div>
          <h3 className="text-[18px] font-bold text-white">{lang === 'zh' ? '手链设置' : 'Bracelet Setup'}</h3>
          <p className="text-[12px] text-neutral-400">{lang === 'zh' ? '设置你的手链信息' : 'Configure your bracelet'}</p>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-medium text-neutral-400">
            {isEstimate
              ? (lang === 'zh' ? `预估 · ${recommendCount(wrist, size)}颗` : `Est · ${recommendCount(wrist, size)} pcs`)
              : (lang === 'zh' ? `${stats.count} 颗 · ${size}mm` : `${stats.count} pcs · ${size}mm`)}
          </div>
          <div className="text-2xl font-extrabold text-white">{money(displayPrice)}</div>
        </div>
      </div>

      {/* 手链尺寸 */}
      <div className="mt-4">
        <div className="mb-2 text-[13px] text-neutral-300">
          {lang === 'zh' ? '选择手链尺寸' : 'Bracelet size'}
          <span className="ml-1 text-[11px] text-neutral-500">{lang === 'zh' ? '（适合大多数手腕，可稍后调整尺寸或联系客服）' : '(fits most wrists)'}</span>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {WRISTS.map((w) => {
            const active = Math.round(wrist) === w.cm
            return (
              <button
                key={w.k}
                onClick={() => changeWrist(w.cm)}
                className={`rounded-2xl border px-2 py-2.5 text-center transition active:scale-95 ${active ? 'border-violet-400/80 bg-violet-500/15 text-white shadow-[0_0_16px_-4px_rgba(150,90,240,0.7)]' : 'border-white/12 bg-white/5 text-neutral-300'}`}
              >
                <span className="text-[14px] font-bold">{w.k}</span>
                <span className="ml-1.5 text-[13px]">{w.cm}.0cm</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 珠子大小 */}
      <div className="mt-4">
        <div className="mb-2 text-[13px] text-neutral-300">{lang === 'zh' ? '选择珠子大小' : 'Bead size'}</div>
        <div className="grid grid-cols-4 gap-2.5">
          {BEAD_SIZES.map((s) => {
            const active = size === s
            return (
              <button
                key={s}
                onClick={() => changeSize(s)}
                className={`flex items-center justify-center gap-1.5 rounded-2xl border px-2 py-2.5 transition active:scale-95 ${active ? 'border-violet-400/80 bg-violet-500/15 text-white shadow-[0_0_16px_-4px_rgba(150,90,240,0.7)]' : 'border-white/12 bg-white/5 text-neutral-300'}`}
              >
                <span className="rounded-full bg-white/25" style={{ width: 6 + (s - 6), height: 6 + (s - 6) }} />
                <span className="text-[13px] font-medium">{s}.0mm</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ===== 功能按钮 2x2 ===== */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <ActionCard onClick={() => setShowSmart(true)} tone="blue" icon={<SparkleIcon size={20} />} title={lang === 'zh' ? '智能配色' : 'Smart Match'} sub={lang === 'zh' ? 'AI 帮你搭配颜色' : 'AI colour matching'} />
        <ActionCard onClick={() => setShowEnergy(true)} tone="green" icon={<EnergyIcon size={20} />} title={lang === 'zh' ? '能量分析' : 'Energy Analysis'} sub={lang === 'zh' ? '解析手链能量' : 'Analyse energy'} />
        <ActionCard onClick={() => (beads.length ? setShowExport(true) : notify(t('design.addFirst')))} tone="blue" icon={<ShareIcon size={20} />} title={lang === 'zh' ? '分享我的设计' : 'Share Design'} sub={lang === 'zh' ? '分享给好友参考' : 'Share with friends'} />
        <ActionCard onClick={() => (beads.length ? setShowExport(true) : notify(t('design.addFirst')))} tone="green" icon={<OrderIcon size={20} />} title={lang === 'zh' ? '加入购物车' : 'Add to Cart'} sub="" />
      </div>

      {/* ===== 分类 + 搜索 + 水晶网格 ===== */}
      <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium transition ${cat === c.key ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_0_14px_-3px_rgba(70,160,255,0.8)]' : 'border border-white/12 bg-white/5 text-neutral-300'}`}
          >
            {lang === 'zh' ? c.label : CATEGORY_I18N[c.key]}
          </button>
        ))}
      </div>

      <div className="relative mt-3">
        <SearchIcon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === 'zh' ? '搜索水晶名称或能量功效' : 'Search crystal name or energy'}
          className="w-full rounded-2xl border border-white/12 bg-white/5 py-3 pl-10 pr-4 text-[14px] text-white outline-none transition placeholder:text-neutral-500 focus:border-cyan-400/60"
        />
      </div>

      {/* 水晶网格 4 列 */}
      <div className="mt-4 grid grid-cols-4 gap-2.5">
        {filtered.map((raw) => {
          const c = localizeCrystal(raw, lang)
          const glow = c.gradient?.base || '#88aaff'
          return (
            <button
              key={c.id}
              onClick={() => addBead(c)}
              style={{
                border: '1px solid rgba(150,190,255,0.26)',
                background: `linear-gradient(180deg, rgba(18,30,60,0.24) 0%, rgba(7,12,28,0.36) 100%)`,
                boxShadow: `0 0 22px -8px ${glow}aa, inset 0 1px 0 rgba(255,255,255,0.12)`,
              }}
              className="crystal-tile group relative flex flex-col overflow-hidden rounded-2xl p-2 pb-2.5 backdrop-blur-sm transition hover:-translate-y-0.5 active:scale-95"
            >
              <span
                onClick={(e) => { e.stopPropagation(); setDetail(c) }}
                className="absolute right-1 top-1 z-20 grid h-5 w-5 place-items-center rounded-full bg-black/40 text-neutral-300 transition hover:text-cyan-300"
                aria-label={t('design.energyRead')}
              >
                <EnergyIcon size={11} />
              </span>
              {/* 珠子居中，后方亮光正对珠子 */}
              <div className="relative flex h-[74px] items-center justify-center">
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-lg"
                  style={{ background: `radial-gradient(circle, rgba(255,255,255,0.4), ${glow}99 46%, transparent 72%)`, opacity: 0.9 }}
                />
                <Bead crystal={c} size={72} className="relative drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)] transition group-hover:scale-105" />
              </div>
              {/* 名称 + 功效 + 价钱 + 五行 */}
              <div className="relative mt-1 text-center">
                <div className="w-full truncate text-[12px] font-semibold text-white drop-shadow">{c.name}</div>
                <div className="w-full truncate text-[10px] text-white/60">{c.keywords.slice(0, 2).join(' · ')}</div>
                <div className="mt-0.5 flex items-center justify-center gap-1">
                  <span className="text-[12px] font-bold text-emerald-400 drop-shadow">{money(beadPrice(c, size))}</span>
                  <span className="rounded px-1 py-[1px] text-[9px] font-medium text-white" style={{ background: ELEMENTS[c.element]?.color }}>
                    {lang === 'zh' ? ELEMENTS[c.element]?.label : ELEMENT_I18N[c.element]}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-10 text-center text-[13px] text-neutral-400">{t('design.noResult')}</div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-32 z-[60] flex justify-center lg:bottom-16">
          <div className="rounded-full bg-neutral-900/90 px-4 py-2 text-[13px] text-white shadow-card-lg animate-scale-in dark:bg-white/90 dark:text-neutral-900">{toast}</div>
        </div>
      )}

      {/* Bead detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name} subtitle={detail?.pinyin} maxWidth="max-w-sm">
        {detail && (
          <div className="text-center">
            <Bead crystal={detail} size={120} className="mx-auto animate-float drop-shadow-xl" />
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {detail.keywords.map((k) => (
                <span key={k} className="rounded-full bg-brand-50 px-3 py-1 text-[12px] font-medium text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">{k}</span>
              ))}
              <span className="rounded-full px-3 py-1 text-[12px] font-medium text-white" style={{ background: ELEMENTS[detail.element]?.color }}>
                {t('design.element')} · {lang === 'zh' ? ELEMENTS[detail.element]?.label : ELEMENT_I18N[detail.element]}
              </span>
            </div>
            <p className="mt-4 text-left text-[14px] leading-relaxed text-neutral-600 dark:text-neutral-300">{detail.energy}</p>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-black/[0.03] px-4 py-3 dark:bg-white/5">
              <span className="text-[13px] text-neutral-500">{t('design.unitPrice', size)}</span>
              <span className="text-lg font-bold text-brand-600 dark:text-brand-300">{money(beadPrice(detail, size))}</span>
            </div>
            <button
              onClick={() => { addBead(detail); setDetail(null) }}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-500 py-3.5 font-medium text-white shadow-glow transition hover:bg-brand-600 active:scale-[0.99]"
            >
              <PlusIcon size={18} /> {t('design.addToBracelet')}
            </button>
          </div>
        )}
      </Modal>

      {/* 能量分析 modal */}
      <Modal open={showEnergy} onClose={() => setShowEnergy(false)} title={lang === 'zh' ? '能量分析' : 'Energy Analysis'} subtitle={lang === 'zh' ? `${stats.count} 颗 · ${money(stats.price)}` : `${stats.count} beads · ${money(stats.price)}`} maxWidth="max-w-sm">
        {beads.length === 0 ? (
          <p className="py-6 text-center text-[14px] text-neutral-500">{lang === 'zh' ? '还没有添加水晶，先加几颗再分析吧。' : 'Add some crystals first.'}</p>
        ) : (
          <div>
            <div className="space-y-2.5">
              {energyEls.map(([el, n]) => {
                const pct = Math.round((n / stats.count) * 100)
                return (
                  <div key={el}>
                    <div className="mb-1 flex items-center justify-between text-[13px]">
                      <span className="font-medium text-neutral-700 dark:text-neutral-200">{lang === 'zh' ? `${ELEMENTS[el]?.label}行` : ELEMENT_I18N[el]}</span>
                      <span className="text-neutral-400">{n} · {pct}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: ELEMENTS[el]?.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <button
              onClick={() => { setShowEnergy(false); setShowSmart(true) }}
              className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-500 py-3 font-medium text-white shadow-glow transition active:scale-[0.99]"
            >
              <SparkleIcon size={17} /> {lang === 'zh' ? '让 AI 优化搭配' : 'Let AI optimise'}
            </button>
          </div>
        )}
      </Modal>

      <SmartRecommend open={showSmart} onClose={() => setShowSmart(false)} count={beads.length || rec.target} onApply={applyPattern} />
      <ExportSheet open={showExport} onClose={() => setShowExport(false)} beads={beads} dark={dark} wristCm={wrist} />
    </div>
  )
}

function RailBtn({ onClick, icon, label, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-2xl border border-white/12 bg-white/5 text-neutral-200 backdrop-blur-sm transition hover:border-cyan-400/40 hover:text-white active:scale-95 disabled:opacity-35"
    >
      {icon}
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  )
}

function ActionCard({ onClick, tone, icon, title, sub }) {
  const c = tone === 'green'
    ? { border: 'rgba(52,211,153,0.55)', glow: 'rgba(52,211,153,0.5)', icon: '#34d399' }
    : { border: 'rgba(70,160,255,0.55)', glow: 'rgba(70,160,255,0.5)', icon: '#6bc0ff' }
  return (
    <button
      onClick={onClick}
      style={{ border: `1px solid ${c.border}`, boxShadow: `0 0 18px -6px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`, background: 'linear-gradient(150deg, rgba(16,26,48,0.7), rgba(9,14,30,0.8))' }}
      className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition hover:-translate-y-0.5 active:scale-[0.98]"
    >
      <span className="shrink-0" style={{ color: c.icon, filter: `drop-shadow(0 0 6px ${c.glow})` }}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold text-white">{title}</span>
        {sub && <span className="block truncate text-[11px] text-neutral-400">{sub}</span>}
      </span>
    </button>
  )
}
