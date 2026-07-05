import { useMemo, useRef, useState } from 'react'
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
} from './icons.jsx'

export function Designer({ dark, initialBeads }) {
  const { t, lang } = useLang()
  const [beads, setBeads] = useState(initialBeads || [])
  const [past, setPast] = useState([])
  const [future, setFuture] = useState([])
  const [size, setSize] = useState(8)
  const [wrist, setWrist] = useState(15)
  const [cat, setCat] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedUid, setSelectedUid] = useState(null)
  const [step, setStep] = useState(0)
  const [detail, setDetail] = useState(null) // localized crystal for detail modal
  const [showSmart, setShowSmart] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)

  const STEPS = [t('step.choose'), t('step.arrange'), t('step.finish')]

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
    let list = CRYSTALS
    if (cat !== 'all') list = list.filter((c) => c.category.includes(cat))
    const q = query.trim().toLowerCase()
    if (q)
      list = list.filter((c) => {
        const en = CRYSTAL_I18N[c.id]
        return (
          c.name.includes(query) ||
          c.pinyin.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.includes(query)) ||
          en?.keywords.some((k) => k.toLowerCase().includes(q))
        )
      })
    return list
  }, [cat, query])

  const selectedCrystal = localizeCrystal(CRYSTAL_MAP[beads.find((b) => b.uid === selectedUid)?.crystalId], lang)

  return (
    <div className="pb-32 lg:pb-10">
      {/* Step header */}
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          {STEPS.map((s, i) => (
            <button key={s} onClick={() => setStep(i)} className="flex flex-1 items-center gap-2">
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-semibold transition ${
                  i <= step ? 'bg-brand-500 text-white' : 'bg-black/8 text-neutral-400 dark:bg-white/10'
                }`}
              >
                {i < step ? <CheckIcon size={13} /> : i + 1}
              </span>
              <span className={`whitespace-nowrap text-[13px] font-medium transition ${i === step ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <span className="mx-1 hidden h-px flex-1 bg-black/8 dark:bg-white/10 sm:block" />}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-6xl flex-col-reverse gap-5 px-4 sm:px-6 lg:grid lg:grid-cols-[1fr_400px]">
        {/* ==== Left: crystal palette ==== */}
        <section className="rounded-3xl border border-black/5 bg-white/70 p-4 shadow-card glass dark:border-white/5 dark:bg-neutral-900/60 sm:p-5">
          {/* Size selector */}
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1 rounded-2xl bg-black/5 p-1 dark:bg-white/5">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-xl px-3 py-1.5 text-[13px] font-medium transition ${
                    size === s ? 'bg-white text-brand-600 shadow-sm dark:bg-neutral-700 dark:text-brand-300' : 'text-neutral-500'
                  }`}
                >
                  {s}mm
                </button>
              ))}
            </div>
            <span className="text-[12px] text-neutral-400">{t('design.size')}</span>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <SearchIcon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('design.search')}
              className="w-full rounded-2xl border border-black/8 bg-white py-2.5 pl-10 pr-4 text-[14px] outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-white/10 dark:bg-neutral-800 dark:text-white dark:focus:ring-brand-900/50"
            />
          </div>

          {/* Categories */}
          <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
                  cat === c.key ? 'bg-brand-500 text-white shadow-sm' : 'bg-black/5 text-neutral-500 dark:bg-white/8 dark:text-neutral-300'
                }`}
              >
                {lang === 'zh' ? c.label : CATEGORY_I18N[c.key]}
              </button>
            ))}
          </div>

          {/* Bead grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {filtered.map((raw) => {
              const c = localizeCrystal(raw, lang)
              return (
                <div
                  key={c.id}
                  className="group relative flex flex-col items-center rounded-2xl border border-black/5 bg-white p-3 text-center shadow-card transition hover:-translate-y-0.5 hover:shadow-card-lg dark:border-white/5 dark:bg-neutral-800"
                >
                  <button
                    onClick={() => setDetail(c)}
                    className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-black/5 text-neutral-400 transition hover:bg-black/10 hover:text-brand-500 dark:bg-white/10"
                    aria-label={t('design.energyRead')}
                  >
                    <EnergyIcon size={13} />
                  </button>
                  <button onClick={() => addBead(c)} className="flex flex-col items-center active:scale-95">
                    <div className="relative">
                      <Bead crystal={c} size={64} className="drop-shadow-md transition group-hover:scale-105" />
                      <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-brand-500 text-white opacity-0 shadow-md transition group-hover:opacity-100">
                        <PlusIcon size={14} />
                      </span>
                    </div>
                    <div className="mt-2 text-[14px] font-medium text-neutral-900 dark:text-white">{c.name}</div>
                    <div className="text-[11px] text-neutral-400">{c.keywords.join(' · ')}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold text-brand-600 dark:text-brand-300">{money(beadPrice(c, size))}</span>
                      <span className="rounded px-1 py-0.5 text-[10px] font-medium text-white" style={{ background: ELEMENTS[c.element]?.color }}>
                        {lang === 'zh' ? ELEMENTS[c.element]?.label : ELEMENT_I18N[c.element]}
                      </span>
                    </div>
                  </button>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div className="col-span-full py-10 text-center text-[13px] text-neutral-400">{t('design.noResult')}</div>
            )}
          </div>
        </section>

        {/* ==== Right: bracelet preview ==== */}
        <section className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-3xl border border-black/5 bg-white/70 p-4 shadow-card glass dark:border-white/5 dark:bg-neutral-900/60 sm:p-5">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="mx-auto aspect-square w-full max-w-[300px] rounded-full bg-gradient-to-br from-white to-neutral-100 shadow-inner dark:from-neutral-800 dark:to-neutral-900">
                  <BraceletRing
                    beads={beads}
                    selectedUid={selectedUid}
                    onSelectBead={setSelectedUid}
                    onClearSelection={() => setSelectedUid(null)}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center gap-2">
                <RailBtn onClick={clearAll} icon={<TrashIcon size={18} />} label={t('rail.clear')} disabled={!beads.length} />
                <RailBtn onClick={undo} icon={<UndoIcon size={18} />} label={t('rail.undo')} disabled={!past.length} />
                <RailBtn onClick={redo} icon={<RedoIcon size={18} />} label={t('rail.redo')} disabled={!future.length} />
                <RailBtn onClick={randomize} icon={<ShuffleIcon size={18} />} label={t('rail.random')} />
              </div>
            </div>

            {/* Selected bead action */}
            {selectedUid && selectedCrystal && (
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-brand-50 px-3.5 py-2.5 dark:bg-brand-900/30 animate-fade-in">
                <div className="flex items-center gap-2">
                  <Bead crystal={selectedCrystal} size={26} />
                  <span className="text-[13px] font-medium text-neutral-700 dark:text-neutral-200">
                    {t('design.selected')} · {selectedCrystal.name}
                  </span>
                </div>
                <button onClick={removeSelected} className="flex items-center gap-1 rounded-full bg-red-500/90 px-3 py-1.5 text-[12px] font-medium text-white transition active:scale-95">
                  <TrashIcon size={14} /> {t('design.delete')}
                </button>
              </div>
            )}

            {/* Title + count */}
            <div className="mt-3 flex items-end justify-between">
              <div>
                <div className="text-[15px] font-semibold text-neutral-900 dark:text-white">{t('design.preview')}</div>
                <div className="text-[12px] text-neutral-500 dark:text-neutral-400">{t('design.selectedN', stats.count)}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-neutral-900 dark:text-white">{money(stats.price)}</div>
              </div>
            </div>

            {/* Reorder strip */}
            <div className="mt-3 rounded-2xl bg-black/[0.03] p-2 dark:bg-white/5">
              <SortableBeadStrip beads={beads} onReorder={reorder} onSelect={setSelectedUid} selectedUid={selectedUid} emptyHint={t('design.strip')} />
            </div>

            {/* Stats grid */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Stat label={t('stat.length')} value={`${stats.circumferenceCm.toFixed(1)}`} unit={t('unit.cm')} />
              <Stat label={t('stat.weight')} value={`${stats.weightG.toFixed(1)}`} unit={t('unit.g')} />
              <Stat label={t('stat.count')} value={`${stats.count}`} unit={t('unit.pcs')} />
            </div>

            {/* Wrist size */}
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-[13px]">
                <span className="font-medium text-neutral-700 dark:text-neutral-200">{t('design.wrist')}</span>
                <span className="text-neutral-500 dark:text-neutral-400">{wrist.toFixed(1)} cm</span>
              </div>
              <input
                type="range"
                min="13"
                max="22"
                step="0.5"
                value={wrist}
                onChange={(e) => setWrist(Number(e.target.value))}
                className="w-full"
                style={{ background: `linear-gradient(to right, #2f9c66 ${((wrist - 13) / 9) * 100}%, rgba(120,120,120,0.2) ${((wrist - 13) / 9) * 100}%)`, height: 4, borderRadius: 999 }}
              />
              <div className="mt-2 flex items-center justify-between rounded-2xl bg-brand-50/70 px-3.5 py-2.5 dark:bg-brand-900/20">
                <div className="flex items-center gap-2 text-[12px] text-neutral-600 dark:text-neutral-300">
                  <WandIcon size={16} className="text-brand-500" />
                  <span>
                    {t('design.aiRec', rec.target, size)}
                    {rec.needed > 0 && <span className="text-neutral-400">{t('design.stillNeed', rec.needed)}</span>}
                  </span>
                </div>
                <button onClick={autoFill} className="shrink-0 rounded-full bg-brand-500 px-3 py-1.5 text-[12px] font-medium text-white transition active:scale-95 disabled:opacity-40" disabled={rec.needed <= 0}>
                  {t('design.autoFill')}
                </button>
              </div>
            </div>

            {/* Smart + Finish */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setShowSmart(true)}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-brand-200 bg-white py-3 text-[14px] font-medium text-brand-600 transition hover:bg-brand-50 active:scale-[0.99] dark:border-brand-800 dark:bg-neutral-800 dark:text-brand-300"
              >
                <SparkleIcon size={17} /> {t('design.smart')}
              </button>
              <button
                onClick={() => (beads.length ? setShowExport(true) : notify(t('design.addFirst')))}
                className="flex items-center justify-center gap-1.5 rounded-2xl bg-brand-500 py-3 text-[14px] font-medium text-white shadow-glow transition hover:bg-brand-600 active:scale-[0.99]"
              >
                {t('design.finish')} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile sticky summary bar */}
      <div className="fixed inset-x-0 bottom-14 z-30 lg:hidden">
        <div className="mx-3 mb-2 flex items-center gap-3 rounded-2xl border border-black/5 bg-white/85 px-4 py-2.5 shadow-card-lg glass dark:border-white/10 dark:bg-neutral-900/85">
          <div className="flex -space-x-2 overflow-hidden">
            {beads.slice(0, 6).map((b) => (
              <div key={b.uid} className="rounded-full ring-2 ring-white dark:ring-neutral-900">
                <Bead crystal={CRYSTAL_MAP[b.crystalId]} size={24} />
              </div>
            ))}
            {beads.length === 0 && <span className="text-[13px] text-neutral-400">{t('design.noBeads')}</span>}
          </div>
          <div className="ml-auto text-right">
            <div className="text-[11px] text-neutral-400">{t('design.selN', stats.count)}</div>
            <div className="text-[15px] font-bold text-neutral-900 dark:text-white">{money(stats.price)}</div>
          </div>
          <button
            onClick={() => (beads.length ? setShowExport(true) : notify(t('design.addFirst')))}
            className="rounded-full bg-brand-500 px-4 py-2 text-[13px] font-medium text-white active:scale-95"
          >
            {t('design.done')}
          </button>
        </div>
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
              onClick={() => {
                addBead(detail)
                setDetail(null)
              }}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-500 py-3.5 font-medium text-white shadow-glow transition hover:bg-brand-600 active:scale-[0.99]"
            >
              <PlusIcon size={18} /> {t('design.addToBracelet')}
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
      className="flex flex-col items-center gap-0.5 rounded-2xl bg-white px-2.5 py-2 text-neutral-600 shadow-card transition hover:text-brand-600 active:scale-95 disabled:opacity-35 dark:bg-neutral-800 dark:text-neutral-300"
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}

function Stat({ label, value, unit }) {
  return (
    <div className="rounded-2xl bg-black/[0.03] px-2 py-2.5 text-center dark:bg-white/5">
      <div className="text-[11px] text-neutral-400">{label}</div>
      <div className="text-[15px] font-bold text-neutral-900 dark:text-white">
        {value}
        <span className="ml-0.5 text-[11px] font-normal text-neutral-400">{unit}</span>
      </div>
    </div>
  )
}
