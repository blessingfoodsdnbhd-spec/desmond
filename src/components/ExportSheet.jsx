import { useEffect, useState } from 'react'
import { Modal } from './Modal.jsx'
import { renderProductImage, downloadDataUrl, exportPdf } from '../utils/render.js'
import { DownloadIcon, ShareIcon, PdfIcon } from './icons.jsx'

export function ExportSheet({ open, onClose, beads, dark, wristCm }) {
  const [preview, setPreview] = useState(null)
  const [mode, setMode] = useState('product') // product | share
  const [busy, setBusy] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!open) return
    const url = renderProductImage(beads, { dark, share: mode === 'share', wristCm })
    setPreview(url)
  }, [open, beads, dark, mode, wristCm])

  const notify = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1800)
  }

  const savePng = () => {
    const url = renderProductImage(beads, { dark, share: mode === 'share', wristCm })
    downloadDataUrl(url, `crystal-bracelet-${mode}.png`)
    notify('已保存 PNG 到下载')
  }

  const share = async () => {
    const url = renderProductImage(beads, { dark, share: true, wristCm })
    try {
      const blob = await (await fetch(url)).blob()
      const file = new File([blob], 'crystal-bracelet.png', { type: 'image/png' })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: '我的水晶能量手链', text: '来看看我设计的专属手链 ✨' })
        return
      }
    } catch (_) {}
    downloadDataUrl(url, 'crystal-bracelet-share.png')
    notify('分享图已保存')
  }

  const pdf = async () => {
    setBusy('pdf')
    try {
      await exportPdf(beads, { dark, wristCm })
      notify('已导出 PDF')
    } catch (e) {
      notify('导出失败，请重试')
    } finally {
      setBusy('')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="生成成品图" subtitle="保存、分享或导出你的专属手链" maxWidth="max-w-md">
      <div className="mb-4 flex gap-1 rounded-2xl bg-black/5 p-1 dark:bg-white/5">
        {[
          { k: 'product', l: '产品图' },
          { k: 'share', l: '分享图' },
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
          <img src={preview} alt="成品预览" className="w-full" />
        ) : (
          <div className="grid aspect-[4/5] place-items-center text-neutral-400">生成中…</div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        <ExportBtn onClick={savePng} icon={<DownloadIcon size={20} />} label="保存 PNG" />
        <ExportBtn onClick={share} icon={<ShareIcon size={20} />} label="分享图片" />
        <ExportBtn onClick={pdf} icon={<PdfIcon size={20} />} label={busy === 'pdf' ? '导出中…' : '导出 PDF'} disabled={busy === 'pdf'} />
      </div>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center">
          <div className="rounded-full bg-neutral-900/90 px-4 py-2 text-[13px] text-white shadow-card-lg animate-scale-in dark:bg-white/90 dark:text-neutral-900">
            {toast}
          </div>
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
