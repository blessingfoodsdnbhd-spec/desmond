import { useRef, useState } from 'react'
import { Bead } from './Bead.jsx'
import { CRYSTAL_MAP } from '../data/crystals.js'
import { useLang, localizeCrystal } from '../i18n.jsx'

// 可拖拽排序的珠子横条（支持触摸，实时换位）
export function SortableBeadStrip({ beads, onReorder, onSelect, selectedUid, emptyHint }) {
  const { lang } = useLang()
  const wrapRef = useRef(null)
  const dragUidRef = useRef(null)
  const [draggingUid, setDraggingUid] = useState(null)

  function onPointerDown(e, uid) {
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch (_) {}
    dragUidRef.current = uid
    setDraggingUid(uid)
  }

  function onPointerMove(e) {
    if (!dragUidRef.current || !wrapRef.current) return
    const items = [...wrapRef.current.querySelectorAll('[data-uid]')]
    const x = e.clientX
    let targetIdx = items.length - 1
    for (let i = 0; i < items.length; i++) {
      const r = items[i].getBoundingClientRect()
      if (x < r.left + r.width / 2) {
        targetIdx = i
        break
      }
    }
    const curIdx = beads.findIndex((b) => b.uid === dragUidRef.current)
    if (curIdx === -1 || targetIdx === curIdx || targetIdx < 0) return
    const next = [...beads]
    const [moved] = next.splice(curIdx, 1)
    next.splice(targetIdx, 0, moved)
    onReorder(next)
  }

  function onPointerUp() {
    dragUidRef.current = null
    setDraggingUid(null)
  }

  if (beads.length === 0) {
    return (
      <div className="flex h-14 items-center justify-center rounded-2xl border border-dashed border-black/10 px-3 text-center text-[13px] text-neutral-400 dark:border-white/10">
        {emptyHint || '点击左侧水晶加入手链，长按拖拽可调整顺序'}
      </div>
    )
  }

  return (
    <div
      ref={wrapRef}
      className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {beads.map((b) => {
        const c = localizeCrystal(CRYSTAL_MAP[b.crystalId], lang)
        const active = b.uid === selectedUid
        const dragging = b.uid === draggingUid
        return (
          <button
            key={b.uid}
            data-uid={b.uid}
            onPointerDown={(e) => onPointerDown(e, b.uid)}
            onClick={() => onSelect?.(b.uid)}
            className={`relative shrink-0 touch-none rounded-full transition-transform ${
              dragging ? 'z-10 scale-110' : ''
            } ${active ? 'ring-2 ring-brand-500 ring-offset-1 ring-offset-white dark:ring-offset-neutral-900' : ''}`}
            style={{ cursor: 'grab' }}
            title={`${c?.name} ${b.size}mm`}
          >
            <Bead crystal={c} size={34} />
          </button>
        )
      })}
    </div>
  )
}
