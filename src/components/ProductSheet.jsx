import { useEffect, useState } from 'react'
import { Modal } from './Modal.jsx'
import { CRYSTAL_MAP, ELEMENTS } from '../data/crystals.js'
import { useLang, localizeCrystal, money, ELEMENT_I18N } from '../i18n.jsx'
import { CheckIcon, OrderTagIcon } from './icons.jsx'

export function ProductSheet({ open, onClose, product }) {
  const { t, lang } = useLang()
  const [sizeIdx, setSizeIdx] = useState(1)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (open) setSizeIdx(1)
  }, [open, product])

  if (!product) return null
  const c = localizeCrystal(CRYSTAL_MAP[product.crystalId], lang)
  const name = lang === 'zh' ? product.name : product.name_en
  const picked = product.sizes[sizeIdx]

  const enquire = () => {
    setToast(t('product.picked', name, picked.size, money(picked.price)))
    setTimeout(() => setToast(''), 2200)
  }

  return (
    <Modal open={open} onClose={onClose} title={name} subtitle={c?.pinyin} maxWidth="max-w-md">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 dark:from-neutral-800 dark:to-neutral-900">
        <img src={product.image} alt={name} className="mx-auto max-h-64 w-auto object-contain drop-shadow-xl" />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {c?.keywords.map((k) => (
          <span key={k} className="rounded-full bg-brand-50 px-3 py-1 text-[12px] font-medium text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">{k}</span>
        ))}
        <span className="rounded-full px-3 py-1 text-[12px] font-medium text-white" style={{ background: ELEMENTS[c?.element]?.color }}>
          {lang === 'zh' ? '五行' : 'Element'} · {lang === 'zh' ? ELEMENTS[c?.element]?.label : ELEMENT_I18N[c?.element]}
        </span>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-[12px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          {t('product.natural')}
        </span>
      </div>

      <p className="mt-3 text-left text-[14px] leading-relaxed text-neutral-600 dark:text-neutral-300">{c?.energy}</p>

      {/* size -> price */}
      <div className="mt-4">
        <div className="mb-2 text-[13px] font-medium text-neutral-700 dark:text-neutral-200">{t('product.size')}</div>
        <div className="grid grid-cols-4 gap-2">
          {product.sizes.map((s, i) => {
            const active = i === sizeIdx
            return (
              <button
                key={s.size}
                onClick={() => setSizeIdx(i)}
                className={`flex flex-col items-center rounded-2xl border px-2 py-2.5 transition active:scale-95 ${
                  active
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900/30 dark:text-brand-200'
                    : 'border-black/8 bg-white text-neutral-600 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300'
                }`}
              >
                <span className="text-[14px] font-semibold">{s.size}mm</span>
                <span className="text-[12px]">{money(s.price)}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-black/[0.03] px-4 py-3 dark:bg-white/5">
        <span className="text-[13px] text-neutral-500">{picked.size}mm</span>
        <span className="text-xl font-bold text-brand-600 dark:text-brand-300">{money(picked.price)}</span>
      </div>

      <button
        onClick={enquire}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-500 py-3.5 font-medium text-white shadow-glow transition hover:bg-brand-600 active:scale-[0.99]"
      >
        <OrderTagIcon size={18} /> {t('product.enquire')}
      </button>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-6">
          <div className="flex items-center gap-1.5 rounded-full bg-neutral-900/90 px-4 py-2 text-[13px] text-white shadow-card-lg animate-scale-in dark:bg-white/90 dark:text-neutral-900">
            <CheckIcon size={15} /> {toast}
          </div>
        </div>
      )}
    </Modal>
  )
}
