import { useRef, useState } from 'react'
import { Bead } from './Bead.jsx'
import { CATEGORIES, ELEMENTS, CRYSTALS } from '../data/crystals.js'
import { PRODUCTS } from '../data/products.js'
import { useLang, money, CATEGORY_I18N, ELEMENT_I18N } from '../i18n.jsx'
import {
  useStore,
  login,
  logout,
  addBead,
  updateBead,
  deleteBead,
  setBeadEdit,
  toggleHideBead,
  addProduct,
  updateProduct,
  deleteProduct,
  setProductEdit,
  toggleHideProduct,
  effectiveDefaultBeads,
  effectiveDefaultProducts,
  compressImage,
  getWa,
  setWa,
  setPassword,
  exportData,
  importData,
} from '../data/store.js'
import { CloseIcon, PlusIcon, TrashIcon, CheckIcon, DownloadIcon, WhatsAppIcon, EyeIcon, EyeOffIcon, EditIcon } from './icons.jsx'

const ELEMENT_KEYS = Object.keys(ELEMENTS)
const CATS = CATEGORIES.filter((c) => c.key !== 'all')

function toast(setFn, msg) {
  setFn(msg)
  setTimeout(() => setFn(''), 1800)
}

export function Admin({ open, onClose }) {
  const { t, lang } = useLang()
  const store = useStore()
  const [tab, setTab] = useState('beads')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')

  if (!open) return null

  // ---- Login gate ----
  if (!store.authed) {
    const doLogin = () => {
      if (login(pw)) {
        setErr('')
        setPw('')
      } else setErr(t('admin.login.err'))
    }
    return (
      <Overlay onClose={onClose}>
        <div className="mx-auto flex min-h-full max-w-sm flex-col justify-center px-6">
          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-card-lg dark:border-white/10 dark:bg-neutral-900">
            <div className="mb-1 text-center text-2xl">🔐</div>
            <h2 className="text-center text-lg font-bold text-neutral-900 dark:text-white">{t('admin.login.title')}</h2>
            <p className="mt-1 text-center text-[13px] text-neutral-500 dark:text-neutral-400">{t('admin.login.sub')}</p>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && doLogin()}
              placeholder={t('admin.login.ph')}
              className="mt-4 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[15px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-white/10 dark:bg-neutral-800 dark:text-white"
            />
            {err && <p className="mt-2 text-[13px] text-red-500">{err}</p>}
            <button onClick={doLogin} className="mt-4 w-full rounded-2xl bg-brand-500 py-3.5 font-medium text-white shadow-glow transition hover:bg-brand-600 active:scale-[0.99]">
              {t('admin.login.btn')}
            </button>
          </div>
        </div>
      </Overlay>
    )
  }

  // ---- Admin panel ----
  return (
    <Overlay onClose={onClose}>
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-black/5 bg-white/90 px-4 py-3 glass dark:border-white/10 dark:bg-neutral-900/90" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <div className="flex-1">
          <div className="text-[16px] font-semibold text-neutral-900 dark:text-white">{t('admin.title')}</div>
        </div>
        <button onClick={() => logout()} className="rounded-full bg-black/5 px-3 py-1.5 text-[12px] font-medium text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
          {t('admin.logout')}
        </button>
        <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-black/5 text-neutral-500 dark:bg-white/10" aria-label="close">
          <CloseIcon size={18} />
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-24 pt-4">
        <div className="mb-4 flex gap-1 rounded-2xl bg-black/5 p-1 dark:bg-white/5">
          {[
            { k: 'beads', l: t('admin.tab.beads') },
            { k: 'products', l: t('admin.tab.products') },
            { k: 'settings', l: t('admin.tab.settings') },
          ].map((x) => (
            <button
              key={x.k}
              onClick={() => setTab(x.k)}
              className={`flex-1 rounded-xl py-2 text-[13px] font-medium transition ${tab === x.k ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'}`}
            >
              {x.l}
            </button>
          ))}
        </div>

        {tab === 'beads' && <BeadAdmin store={store} onMsg={(m) => toast(setMsg, m)} />}
        {tab === 'products' && <ProductAdmin store={store} onMsg={(m) => toast(setMsg, m)} />}
        {tab === 'settings' && <SettingsAdmin onMsg={(m) => toast(setMsg, m)} />}
      </div>

      {msg && (
        <div className="pointer-events-none fixed inset-x-0 bottom-8 z-[80] flex justify-center">
          <div className="flex items-center gap-1.5 rounded-full bg-neutral-900/90 px-4 py-2 text-[13px] text-white shadow-card-lg animate-scale-in dark:bg-white/90 dark:text-neutral-900">
            <CheckIcon size={15} /> {msg}
          </div>
        </div>
      )}
    </Overlay>
  )
}

function Overlay({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-neutral-50 dark:bg-neutral-950 animate-fade-in">
      {children}
    </div>
  )
}

/* ---------- Photo picker ---------- */
function PhotoPicker({ value, onChange, round }) {
  const { t } = useLang()
  const ref = useRef(null)
  const pick = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const data = await compressImage(file, round ? 512 : 720)
    onChange(data)
  }
  return (
    <button
      type="button"
      onClick={() => ref.current?.click()}
      className={`relative grid aspect-square w-full place-items-center overflow-hidden border-2 border-dashed border-black/15 bg-black/[0.02] text-neutral-400 transition hover:border-brand-400 dark:border-white/15 dark:bg-white/5 ${round ? 'rounded-full' : 'rounded-2xl'}`}
    >
      {value ? (
        <img src={value} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-1 text-[12px]">
          <PlusIcon size={22} />
          {t('admin.photo.pick')}
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" onChange={pick} className="hidden" />
    </button>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-neutral-600 dark:text-neutral-300">{label}</span>
      {children}
    </label>
  )
}
const inputCls =
  'w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[14px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-white/10 dark:bg-neutral-800 dark:text-white'

/* ---------- Beads admin ---------- */
function BeadAdmin({ store, onMsg }) {
  const { t, lang } = useLang()
  const empty = { photo: null, name: '', name_en: '', element: 'wood', category: ['popular'], keywords: '', basePrice: '20', energy: '', energy_en: '' }
  const [f, setF] = useState(empty)
  const [editing, setEditing] = useState(null) // {id, isDefault}
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const toggleCat = (k) => set('category', f.category.includes(k) ? f.category.filter((c) => c !== k) : [...f.category, k])
  const reset = () => { setF(empty); setEditing(null) }

  const loadEdit = (item, isDefault) => {
    setF({
      photo: item.photo || null,
      name: item.name || '',
      name_en: item.name_en || item.pinyin || '',
      element: item.element || 'wood',
      category: item.category || ['popular'],
      keywords: (item.keywords || []).join('、'),
      basePrice: String(item.basePrice ?? 20),
      energy: item.energy || '',
      energy_en: item.energy_en || '',
    })
    setEditing({ id: item.id, isDefault })
  }

  const save = () => {
    if (!f.name.trim()) return onMsg(t('admin.needName'))
    if (!editing && !f.photo) return onMsg(t('admin.needPhoto'))
    const patch = {
      name: f.name,
      name_en: f.name_en,
      element: f.element,
      category: f.category,
      keywords: f.keywords.split(/[,，、]/).map((s) => s.trim()).filter(Boolean),
      basePrice: Number(f.basePrice) || 20,
      energy: f.energy,
      energy_en: f.energy_en,
    }
    if (f.photo) patch.photo = f.photo
    if (!editing) addBead({ ...patch, photo: f.photo })
    else if (editing.isDefault) setBeadEdit(editing.id, patch)
    else updateBead(editing.id, patch)
    reset()
    onMsg(t('admin.bead.saved'))
  }

  const defaultList = CRYSTALS.map((c) => ({ ...c, ...(store.beadEdits[c.id] || {}), _default: true, _hidden: store.beadHidden.includes(c.id) }))
  const customList = store.beads.map((b) => ({ ...b, _default: false }))
  const list = [...defaultList, ...customList]

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-card dark:border-white/5 dark:bg-neutral-900">
        {editing && (
          <div className="mb-3 flex items-center justify-between rounded-xl bg-brand-50 px-3 py-2 text-[12px] text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
            <span>{editing.isDefault ? '编辑默认珠子' : '编辑自定义珠子'} · {f.name}</span>
            <button onClick={reset} className="font-medium underline">{t('admin.cancel')}</button>
          </div>
        )}
        <div className="grid grid-cols-[100px_1fr] gap-3">
          <div className="w-[100px]"><PhotoPicker value={f.photo} onChange={(d) => set('photo', d)} round /></div>
          <div className="grid grid-cols-2 gap-2">
            <Field label={t('admin.name.zh')}><input className={inputCls} value={f.name} onChange={(e) => set('name', e.target.value)} /></Field>
            <Field label={t('admin.name.en')}><input className={inputCls} value={f.name_en} onChange={(e) => set('name_en', e.target.value)} /></Field>
            <Field label={t('admin.price8') + ' (RM)'}><input type="number" className={inputCls} value={f.basePrice} onChange={(e) => set('basePrice', e.target.value)} /></Field>
            <Field label={t('admin.element')}>
              <select className={inputCls} value={f.element} onChange={(e) => set('element', e.target.value)}>
                {ELEMENT_KEYS.map((k) => (
                  <option key={k} value={k}>{lang === 'zh' ? ELEMENTS[k].label : ELEMENT_I18N[k]}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>
        <div className="mt-3">
          <span className="mb-1 block text-[12px] font-medium text-neutral-600 dark:text-neutral-300">{t('admin.category')}</span>
          <div className="flex flex-wrap gap-1.5">
            {CATS.map((c) => (
              <button
                key={c.key}
                onClick={() => toggleCat(c.key)}
                className={`rounded-full px-3 py-1 text-[12px] font-medium transition ${f.category.includes(c.key) ? 'bg-brand-500 text-white' : 'bg-black/5 text-neutral-500 dark:bg-white/10 dark:text-neutral-300'}`}
              >
                {lang === 'zh' ? c.label : CATEGORY_I18N[c.key]}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 grid gap-2">
          <Field label={t('admin.keywords')}><input className={inputCls} value={f.keywords} onChange={(e) => set('keywords', e.target.value)} placeholder="招财、事业" /></Field>
          <Field label={t('admin.energy') + '（中）'}><textarea className={inputCls} rows={2} value={f.energy} onChange={(e) => set('energy', e.target.value)} /></Field>
          <Field label={t('admin.energy') + '（EN）'}><textarea className={inputCls} rows={2} value={f.energy_en} onChange={(e) => set('energy_en', e.target.value)} /></Field>
        </div>
        <button onClick={save} className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-500 py-3 font-medium text-white shadow-glow transition hover:bg-brand-600 active:scale-[0.99]">
          {editing ? <CheckIcon size={18} /> : <PlusIcon size={18} />} {editing ? t('admin.save') : t('admin.add')}
        </button>
      </div>

      {/* list: default + custom, tap to edit */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {list.map((b) => (
          <div
            key={b.id}
            onClick={() => loadEdit(b, b._default)}
            className={`relative flex cursor-pointer flex-col items-center rounded-2xl border p-3 text-center shadow-card transition hover:-translate-y-0.5 ${editing?.id === b.id ? 'border-brand-500 ring-2 ring-brand-200 dark:ring-brand-900' : 'border-black/5 dark:border-white/5'} ${b._hidden ? 'opacity-40' : ''} bg-white dark:bg-neutral-800`}
          >
            <div className="absolute left-2 top-2 flex gap-1">
              {b._default && <span className="rounded bg-black/10 px-1.5 py-0.5 text-[9px] text-neutral-500 dark:bg-white/15 dark:text-neutral-300">默认</span>}
            </div>
            <div className="absolute right-2 top-2 flex gap-1">
              <button onClick={(e) => { e.stopPropagation(); loadEdit(b, b._default) }} className="grid h-6 w-6 place-items-center rounded-full bg-black/5 text-neutral-500 dark:bg-white/15 dark:text-neutral-300" aria-label="edit">
                <EditIcon size={13} />
              </button>
              {b._default ? (
                <button onClick={(e) => { e.stopPropagation(); toggleHideBead(b.id) }} className="grid h-6 w-6 place-items-center rounded-full bg-black/5 text-neutral-500 dark:bg-white/15 dark:text-neutral-300" aria-label="hide">
                  {b._hidden ? <EyeOffIcon size={13} /> : <EyeIcon size={13} />}
                </button>
              ) : (
                <button onClick={(e) => { e.stopPropagation(); deleteBead(b.id) }} className="grid h-6 w-6 place-items-center rounded-full bg-red-500 text-white" aria-label="delete">
                  <TrashIcon size={13} />
                </button>
              )}
            </div>
            <Bead crystal={b} size={52} />
            <div className="mt-1.5 text-[13px] font-medium text-neutral-900 dark:text-white">{lang === 'zh' ? b.name : b.name_en || b.pinyin}</div>
            <div className="text-[12px] font-semibold text-brand-600 dark:text-brand-300">{money(b.basePrice)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Products admin ---------- */
function ProductAdmin({ store, onMsg }) {
  const { t, lang } = useLang()
  const empty = { image: null, name: '', name_en: '', element: 'wood', badge: '天然实拍', keywords: '', energy: '', energy_en: '', sizes: [{ size: '8', price: '' }] }
  const [f, setF] = useState(empty)
  const [editing, setEditing] = useState(null)
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const setSize = (i, k, v) => set('sizes', f.sizes.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)))
  const addSizeRow = () => set('sizes', [...f.sizes, { size: '', price: '' }])
  const rmSize = (i) => set('sizes', f.sizes.filter((_, idx) => idx !== i))
  const reset = () => { setF(empty); setEditing(null) }

  const loadEdit = (item, isDefault) => {
    setF({
      image: item.image || null,
      name: item.name || '',
      name_en: item.name_en || '',
      element: item.element || 'wood',
      badge: item.badge || '天然实拍',
      keywords: (item.keywords || []).join('、'),
      energy: item.energy || '',
      energy_en: item.energy_en || '',
      sizes: (item.sizes && item.sizes.length ? item.sizes : [{ size: '', price: '' }]).map((s) => ({ size: String(s.size), price: String(s.price) })),
    })
    setEditing({ id: item.id, isDefault })
  }

  const save = () => {
    if (!f.name.trim()) return onMsg(t('admin.needName'))
    if (!editing && !f.image) return onMsg(t('admin.needPhoto'))
    const patch = {
      name: f.name,
      name_en: f.name_en,
      element: f.element,
      badge: f.badge,
      keywords: f.keywords.split(/[,，、]/).map((s) => s.trim()).filter(Boolean),
      energy: f.energy,
      energy_en: f.energy_en,
      sizes: f.sizes.filter((s) => s.size && s.price).map((s) => ({ size: Number(s.size), price: Number(s.price) })),
    }
    if (f.image) patch.image = f.image
    if (!editing) addProduct({ ...patch, image: f.image })
    else if (editing.isDefault) setProductEdit(editing.id, patch)
    else updateProduct(editing.id, patch)
    reset()
    onMsg(t('admin.product.saved'))
  }

  const defaultList = PRODUCTS.map((p) => ({ ...p, ...(store.productEdits[p.id] || {}), _default: true, _hidden: store.productHidden.includes(p.id) }))
  const list = [...defaultList, ...store.products.map((p) => ({ ...p, _default: false }))]

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-card dark:border-white/5 dark:bg-neutral-900">
        {editing && (
          <div className="mb-3 flex items-center justify-between rounded-xl bg-brand-50 px-3 py-2 text-[12px] text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
            <span>{editing.isDefault ? '编辑默认成品' : '编辑自定义成品'} · {f.name}</span>
            <button onClick={reset} className="font-medium underline">{t('admin.cancel')}</button>
          </div>
        )}
        <div className="grid grid-cols-[110px_1fr] gap-3">
          <div className="w-[110px]"><PhotoPicker value={f.image} onChange={(d) => set('image', d)} /></div>
          <div className="grid grid-cols-2 gap-2">
            <Field label={t('admin.name.zh')}><input className={inputCls} value={f.name} onChange={(e) => set('name', e.target.value)} /></Field>
            <Field label={t('admin.name.en')}><input className={inputCls} value={f.name_en} onChange={(e) => set('name_en', e.target.value)} /></Field>
            <Field label={t('admin.element')}>
              <select className={inputCls} value={f.element} onChange={(e) => set('element', e.target.value)}>
                {ELEMENT_KEYS.map((k) => (
                  <option key={k} value={k}>{lang === 'zh' ? ELEMENTS[k].label : ELEMENT_I18N[k]}</option>
                ))}
              </select>
            </Field>
            <Field label={t('admin.badge')}><input className={inputCls} value={f.badge} onChange={(e) => set('badge', e.target.value)} /></Field>
          </div>
        </div>

        <div className="mt-3">
          <span className="mb-1 block text-[12px] font-medium text-neutral-600 dark:text-neutral-300">{t('admin.sizes')} (RM)</span>
          <div className="space-y-2">
            {f.sizes.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input className={inputCls + ' flex-1'} type="number" placeholder={t('admin.size')} value={s.size} onChange={(e) => setSize(i, 'size', e.target.value)} />
                <input className={inputCls + ' flex-1'} type="number" placeholder="RM" value={s.price} onChange={(e) => setSize(i, 'price', e.target.value)} />
                <button onClick={() => rmSize(i)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-black/5 text-neutral-400 dark:bg-white/10" aria-label="remove size">
                  <TrashIcon size={15} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addSizeRow} className="mt-2 flex items-center gap-1 text-[13px] font-medium text-brand-600 dark:text-brand-300">
            <PlusIcon size={15} /> {t('admin.addSize')}
          </button>
        </div>

        <div className="mt-3 grid gap-2">
          <Field label={t('admin.keywords')}><input className={inputCls} value={f.keywords} onChange={(e) => set('keywords', e.target.value)} /></Field>
          <Field label={t('admin.energy') + '（中）'}><textarea className={inputCls} rows={2} value={f.energy} onChange={(e) => set('energy', e.target.value)} /></Field>
          <Field label={t('admin.energy') + '（EN）'}><textarea className={inputCls} rows={2} value={f.energy_en} onChange={(e) => set('energy_en', e.target.value)} /></Field>
        </div>
        <button onClick={save} className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-500 py-3 font-medium text-white shadow-glow transition hover:bg-brand-600 active:scale-[0.99]">
          {editing ? <CheckIcon size={18} /> : <PlusIcon size={18} />} {editing ? t('admin.save') : t('admin.add')}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {list.map((p) => (
          <div
            key={p.id}
            onClick={() => loadEdit(p, p._default)}
            className={`relative flex cursor-pointer flex-col rounded-2xl border p-2 text-center shadow-card transition hover:-translate-y-0.5 ${editing?.id === p.id ? 'border-brand-500 ring-2 ring-brand-200 dark:ring-brand-900' : 'border-black/5 dark:border-white/5'} ${p._hidden ? 'opacity-40' : ''} bg-white dark:bg-neutral-800`}
          >
            {p._default && <span className="absolute left-2 top-2 z-10 rounded bg-black/10 px-1.5 py-0.5 text-[9px] text-neutral-500 dark:bg-white/15 dark:text-neutral-300">默认</span>}
            <div className="absolute right-2 top-2 z-10 flex gap-1">
              <button onClick={(e) => { e.stopPropagation(); loadEdit(p, p._default) }} className="grid h-6 w-6 place-items-center rounded-full bg-black/5 text-neutral-500 dark:bg-white/15 dark:text-neutral-300" aria-label="edit">
                <EditIcon size={13} />
              </button>
              {p._default ? (
                <button onClick={(e) => { e.stopPropagation(); toggleHideProduct(p.id) }} className="grid h-6 w-6 place-items-center rounded-full bg-black/5 text-neutral-500 dark:bg-white/15 dark:text-neutral-300" aria-label="hide">
                  {p._hidden ? <EyeOffIcon size={13} /> : <EyeIcon size={13} />}
                </button>
              ) : (
                <button onClick={(e) => { e.stopPropagation(); deleteProduct(p.id) }} className="grid h-6 w-6 place-items-center rounded-full bg-red-500 text-white" aria-label="delete">
                  <TrashIcon size={13} />
                </button>
              )}
            </div>
            {p.image && <img src={p.image} alt="" className="mx-auto h-24 w-24 object-contain" />}
            <div className="mt-1 text-[13px] font-medium text-neutral-900 dark:text-white">{lang === 'zh' ? p.name : p.name_en}</div>
            <div className="text-[12px] font-semibold text-brand-600 dark:text-brand-300">{p.sizes?.length ? money(Math.min(...p.sizes.map((s) => s.price))) : ''}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Settings ---------- */
function SettingsAdmin({ onMsg }) {
  const { t } = useLang()
  const [wa, setWaVal] = useState(getWa())
  const [np, setNp] = useState('')
  const fileRef = useRef(null)

  const saveWa = () => {
    setWa(wa)
    onMsg(t('admin.settings.saved'))
  }
  const savePass = () => {
    if (setPassword(np)) {
      setNp('')
      onMsg(t('admin.settings.saved'))
    }
  }
  const doExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ahhuat-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }
  const doImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    try {
      importData(text)
      onMsg(t('admin.settings.saved'))
    } catch {
      onMsg('Import failed')
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-card dark:border-white/5 dark:bg-neutral-900">
        <div className="flex items-center gap-2 text-[15px] font-semibold text-neutral-900 dark:text-white">
          <WhatsAppIcon size={18} /> {t('admin.settings.wa')}
        </div>
        <p className="mt-0.5 text-[12px] text-neutral-500 dark:text-neutral-400">{t('admin.settings.wa.sub')}</p>
        <div className="mt-2 flex gap-2">
          <input className={inputCls + ' flex-1'} value={wa} onChange={(e) => setWaVal(e.target.value)} placeholder="60127718812" />
          <button onClick={saveWa} className="rounded-xl bg-brand-500 px-4 text-[13px] font-medium text-white">{t('admin.save')}</button>
        </div>
      </div>

      <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-card dark:border-white/5 dark:bg-neutral-900">
        <div className="text-[15px] font-semibold text-neutral-900 dark:text-white">{t('admin.settings.pass')}</div>
        <div className="mt-2 flex gap-2">
          <input type="password" className={inputCls + ' flex-1'} value={np} onChange={(e) => setNp(e.target.value)} placeholder={t('admin.settings.pass.ph')} />
          <button onClick={savePass} className="rounded-xl bg-brand-500 px-4 text-[13px] font-medium text-white">{t('admin.save')}</button>
        </div>
      </div>

      <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-card dark:border-white/5 dark:bg-neutral-900">
        <div className="text-[15px] font-semibold text-neutral-900 dark:text-white">{t('admin.settings.backup')}</div>
        <p className="mt-0.5 text-[12px] text-neutral-500 dark:text-neutral-400">{t('admin.settings.note')}</p>
        <div className="mt-2 flex gap-2">
          <button onClick={doExport} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-black/10 py-2.5 text-[13px] font-medium text-neutral-700 dark:border-white/10 dark:text-neutral-200">
            <DownloadIcon size={16} /> {t('admin.settings.export')}
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-black/10 py-2.5 text-[13px] font-medium text-neutral-700 dark:border-white/10 dark:text-neutral-200">
            {t('admin.settings.import')}
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={doImport} className="hidden" />
        </div>
      </div>
    </div>
  )
}
