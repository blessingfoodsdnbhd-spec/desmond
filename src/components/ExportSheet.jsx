import { useEffect, useMemo, useState } from 'react'
import { Modal } from './Modal.jsx'
import { renderProductImage, downloadDataUrl, exportPdf } from '../utils/render.js'
import { useLang, localizeCrystal, money } from '../i18n.jsx'
import { CRYSTAL_MAP } from '../data/crystals.js'
import { DownloadIcon, ShareIcon, PdfIcon } from './icons.jsx'

export function ExportSheet({ open, onClose, beads, dark, wristCm }) {
  const { t, lang } = useLang()
  const [preview, setPreview] = useState(null)
  const [mode, setMode] = useState('product') // product | share
  const [busy, setBusy] = useState('')
  const [toast, setToast] = useState('')

  // 传给 Canvas 渲染器的本地化文案
  const imgI18n = useMemo(
    () => ({
      brand: t('brand.full'),
      tagline: t('brand.tagline'),
      money: (n) => money(n),
      unitPcs: t('unit.pcs'),
      lengthLabel: t('export.img.length'),
      weightLabel: t('export.img.weight'),
      wristLabel: t('export.img.wrist'),
      emptyText: t('export.img.empty'),
      qrText: t('export.img.qr'),
      crystalName: (id) => localizeCrystal(CRYSTAL_MAP[id], lang)?.name,
    }),
    [t, lang],
  )

  useEffect(() => {
    if (!open) return
    setPreview(renderProductImage(beads, { dark, share: mode === 'share', wristCm, i18n: imgI18n }))
  }, [open, beads, dark, mode, wristCm, imgI18n])

  const notify = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1800)
  }

  const savePng = () => {
    const url = renderProductImage(beads, { dark, share: mode === 'share', wristCm, i18n: imgI18n })
    downloadDataUrl(url, `crystal-bracelet-${mode}.png`)
    notify(t('export.savedPng'))
  }

  const share = async () => {
    const url = renderProductImage(beads, { dark, share: true, wristCm, i18n: imgI18n })
    try {
      const blob = await (await fetch(url)).blob()
      const file = new File([blob], 'crystal-bracelet.png', { type: 'image/png' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: t('export.shareTitle'), text: t('export.shareText') })
        return
      }
    } catch (_) {}
    downloadDataUrl(url, 'crystal-bracelet-share.png')
    notify(t('export.savedShare'))
  }

  const pdf = async () => {
    setBusy('pdf')
    try {
      await exportPdf(beads, { dark, wristCm, i18n: imgI18n })
      notify(t('export.savedPdf'))
    } catch (e) {
      notify(t('export.failed'))
    } finally {
      setBusy('')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t('export.title')} subtitle={t('export.sub')} maxWidth="max-w-md">
      <div className="mb-4 flex gap-1 rounded-2xl bg-black/5 p-1 dark:bg-white/5">
        {[
          { k: 'product', l: t('export.tab.product') },
          { k: 'share', l: t('export.tab.share') },
        ].map((m) => (
          <button
            key={m.k}
            onClick={() => setMode(m.k)}
            className={`flex-1 rounded-xl py-2 text-[13px] font-medium transition ${
              mode === m.k ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            {m.l}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/5 shadow-card dark:border-white/10">
        {preview ? (
          <img src={preview} alt="preview" className="w-full" />
        ) : (
          <div className="grid aspect-[4/5] place-items-center text-neutral-400">{t('export.generating')}</div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        <ExportBtn onClick={savePng} icon={<DownloadIcon size={20} />} label={t('export.png')} />
        <ExportBtn onClick={share} icon={<ShareIcon size={20} />} label={t('export.share')} />
        <ExportBtn onClick={pdf} icon={<PdfIcon size={20} />} label={busy === 'pdf' ? t('export.pdf.busy') : t('export.pdf')} disabled={busy === 'pdf'} />
      </div>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center">
          <div className="rounded-full bg-neutral-900/90 px-4 py-2 text-[13px] text-white shadow-card-lg animate-scale-in dark:bg-white/90 dark:text-neutral-900">{toast}</div>
        </div>
      )}
    </Modal>
  )
}

function ExportBtn({ onClick, icon, label, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1.5 rounded-2xl border border-black/5 bg-white py-3.5 text-neutral-700 shadow-card transition hover:-translate-y-0.5 hover:text-brand-600 hover:shadow-card-lg active:scale-95 disabled:opacity-50 dark:border-white/5 dark:bg-neutral-800 dark:text-neutral-200"
    >
      {icon}
      <span className="text-[12px] font-medium">{label}</span>
    </button>
  )
}
