import { useEffect } from 'react'
import { CloseIcon } from './icons.jsx'

// Apple 风格底部弹出面板 / 居中卡片
export function Modal({ open, onClose, title, subtitle, children, footer, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxWidth} max-h-[88vh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white/95 dark:bg-neutral-900/95 glass shadow-card-lg animate-scale-in`}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-3 border-b border-black/5 dark:border-white/5">
          <div>
            {title && <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-[13px] text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/5 text-neutral-500 transition hover:bg-black/10 active:scale-90 dark:bg-white/10 dark:text-neutral-300"
            aria-label="关闭"
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto thin-scrollbar px-6 py-4">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-black/5 dark:border-white/5 bg-white/60 dark:bg-neutral-900/60">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
