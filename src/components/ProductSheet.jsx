import { useEffect, useState } from 'react'
import { Modal } from './Modal.jsx'
import { CRYSTAL_MAP, ELEMENTS } from '../data/crystals.js'
import { useLang, localizeCrystal, money, ELEMENT_I18N } from '../i18n.jsx'
import { waLink } from '../data/store.js'
import { WhatsAppIcon } from './icons.jsx'

export function ProductSheet({ open, onClose, product }) {
  const { t, lang } = useLang()
  const [sizeIdx, setSizeIdx] = useState(0)

  useEffect(() => {
    if (open) setSizeIdx(0)
  }, [open, product])

  if (!product) return null
  const c = product.crystalId ? localizeCrystal(CRYSTAL_MAP[product.crystalId], lang) : null
  const name = lang === 'zh' ? product.name : product.name_en
  const subtitle = c?.pinyin || product.name_en || ''
  const keywords = c?.keywords || product.keywords || []
  const element = c?.element || product.element
  const energy = c?.energy || (lang === 'zh' ? product.energy : product.energy_en) || ''
  const sizes = product.sizes || []
  const picked = sizes[sizeIdx] || sizes[0]

  const order = () => {
    const msg =
      lang === 'zh'
        ? `你好，我想订购：${name}（${picked.size}mm）${money(picked.price)}`
        : `Hi, I would like to order: ${name} (${picked.size}mm) ${money(picked.price)}`
    window.open(waLink(msg), '_blank')
  }

  return (
    <Modal open={open} onClose={onClose} title={name} subtitle={subtitle} maxWidth="max-w-md">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 dark:from-neutral-800 dark:to-neutral-900">
        {product.image ? (
          <img src={product.image} alt={name} className="mx-auto max-h-64 w-auto object-contain drop-shadow-xl" />
        ) : (
          <div className="grid h-48 place-items-center text-neutral-400">—</div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {keywords.map((k) => (
          <span key={k} className="rounded-full bg-brand-50 px-3 py-1 text-[12px] font-medium text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">{k}</span>
        ))}
        {element && (
          <span className="rounded-full px-3 py-1 text-[12px] font-medium text-white" style={{ background: ELEMENTS[element]?.color }}>
            {lang === 'zh' ? '五行' : 'Element'} · {lang === 'zh' ? ELEMENTS[element]?.label : ELEMENT_I18N[element]}
          </span>
        )}
        <span className="rounded-full bg-amber-100 px-3 py-1 text-[12px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          {t('product.natural')}
        </span>
      </div>

      {energy && <p className="mt-3 text-left text-[14px] leading-relaxed text-neutral-600 dark:text-neutral-300">{energy}</p>}

      {sizes.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-[13px] font-medium text-neutral-700 dark:text-neutral-200">{t('product.size')}</div>
          <div className={`grid gap-2 ${sizes.length >= 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
            {sizes.map((s, i) => {
              const active = i === sizeIdx
              return (
                <button
                  key={`${s.size}-${i}`}
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
      )}

      {picked && (
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-black/[0.03] px-4 py-3 dark:bg-white/5">
          <span className="text-[13px] text-neutral-500">{picked.size}mm</span>
          <span className="text-xl font-bold text-brand-600 dark:text-brand-300">{money(picked.price)}</span>
        </div>
      )}

      <button
        onClick={order}
        disabled={!picked}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 font-medium text-white shadow-glow transition hover:brightness-105 active:scale-[0.99] disabled:opacity-50"
      >
        <WhatsAppIcon size={20} /> {t('product.buy')}
      </button>
    </Modal>
  )
}
