// 高清珠子 & 手链的 Canvas 渲染 + 导出（PNG / 分享图 / PDF）
import { CRYSTAL_MAP } from '../data/crystals.js'
import { layoutRing, fitRingRadius, summarize } from './bracelet.js'

// 在 canvas 上绘制一颗抛光水晶珠（多层径向渐变 + 高光）
export function drawBead(ctx, x, y, r, crystal) {
  const g = crystal?.gradient || { light: '#fff', base: '#ccc', deep: '#999', ring: '#888' }

  // 主体径向渐变（高光偏左上）
  const grad = ctx.createRadialGradient(
    x - r * 0.35,
    y - r * 0.4,
    r * 0.05,
    x,
    y,
    r * 1.05,
  )
  grad.addColorStop(0, g.light)
  grad.addColorStop(0.42, g.base)
  grad.addColorStop(0.82, g.deep)
  grad.addColorStop(1, g.ring)

  ctx.save()
  // 落地投影
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.shadowColor = 'rgba(20,25,35,0.28)'
  ctx.shadowBlur = r * 0.5
  ctx.shadowOffsetY = r * 0.28
  ctx.fillStyle = grad
  ctx.fill()
  ctx.restore()

  // 冷光/内反光（部分石材，如月光石/青金石）
  if (g.sheen) {
    const sh = ctx.createRadialGradient(x + r * 0.3, y + r * 0.35, r * 0.02, x + r * 0.3, y + r * 0.35, r * 0.9)
    sh.addColorStop(0, hexA(g.sheen, 0.55))
    sh.addColorStop(0.6, hexA(g.sheen, 0.08))
    sh.addColorStop(1, hexA(g.sheen, 0))
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = sh
    ctx.fill()
  }

  // 主高光
  ctx.beginPath()
  ctx.ellipse(x - r * 0.34, y - r * 0.4, r * 0.28, r * 0.2, -0.5, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.72)'
  ctx.fill()

  // 次高光小点
  ctx.beginPath()
  ctx.arc(x + r * 0.3, y + r * 0.28, r * 0.09, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.fill()

  // 边缘暗环，增强立体感
  ctx.beginPath()
  ctx.arc(x, y, r * 0.98, 0, Math.PI * 2)
  ctx.strokeStyle = hexA(g.ring, 0.5)
  ctx.lineWidth = Math.max(0.5, r * 0.05)
  ctx.stroke()
}

function hexA(hex, a) {
  const h = hex.replace('#', '')
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const r = parseInt(n.slice(0, 2), 16)
  const g = parseInt(n.slice(2, 4), 16)
  const b = parseInt(n.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

// 渲染整条手链的产品图 / 分享图到一个 canvas 并返回 dataURL
export function renderProductImage(beads, opts = {}) {
  const {
    width = 1080,
    height = 1350,
    dark = false,
    share = false,
    wristCm = null,
  } = opts
  const dpr = 2
  const canvas = document.createElement('canvas')
  canvas.width = width * dpr
  canvas.height = height * dpr
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  // 背景渐变
  const bg = ctx.createLinearGradient(0, 0, width, height)
  if (dark) {
    bg.addColorStop(0, '#1c1c1e')
    bg.addColorStop(1, '#0b0b0c')
  } else {
    bg.addColorStop(0, '#ffffff')
    bg.addColorStop(0.55, '#f4f7f5')
    bg.addColorStop(1, '#e9f2ec')
  }
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)

  // 顶部品牌
  ctx.textAlign = 'center'
  ctx.fillStyle = dark ? '#e8f5ee' : '#1f7d50'
  ctx.font = '600 40px -apple-system, "PingFang SC", sans-serif'
  ctx.fillText('灵感石 · Stone Lab', width / 2, 96)
  ctx.fillStyle = dark ? '#8b8b90' : '#98a29b'
  ctx.font = '400 24px -apple-system, "PingFang SC", sans-serif'
  ctx.fillText('专属定制 · 水晶能量手链', width / 2, 138)

  // 圆盘背景
  const plateCx = width / 2
  const plateCy = height * 0.44
  const plateR = width * 0.36
  const plate = ctx.createRadialGradient(plateCx - plateR * 0.25, plateCy - plateR * 0.3, plateR * 0.1, plateCx, plateCy, plateR)
  if (dark) {
    plate.addColorStop(0, '#2c2c2e')
    plate.addColorStop(1, '#161618')
  } else {
    plate.addColorStop(0, '#ffffff')
    plate.addColorStop(1, '#e7ded6')
  }
  ctx.save()
  ctx.beginPath()
  ctx.arc(plateCx, plateCy, plateR, 0, Math.PI * 2)
  ctx.shadowColor = 'rgba(0,0,0,0.14)'
  ctx.shadowBlur = 60
  ctx.shadowOffsetY = 24
  ctx.fillStyle = plate
  ctx.fill()
  ctx.restore()

  // 手链
  const viewSize = plateR * 1.7
  const maxSize = Math.max(8, ...beads.map((b) => b.size))
  const beadPx = (maxSize / 12) * (viewSize * 0.13)
  const ringR = fitRingRadius(beads, beadPx * 2, viewSize)
  const positions = layoutRing(beads, { cx: plateCx, cy: plateCy, ringRadius: ringR })
  for (const p of positions) {
    const r = (p.size / 12) * (viewSize * 0.13)
    drawBead(ctx, p.x, p.y, r, p.crystal)
  }
  if (beads.length === 0) {
    ctx.fillStyle = dark ? '#6b6b70' : '#b9c2ba'
    ctx.font = '400 30px -apple-system, "PingFang SC", sans-serif'
    ctx.fillText('空手链 · 去添加水晶吧', plateCx, plateCy)
  }

  // 统计信息卡
  const s = summarize(beads)
  const cardY = height * 0.76
  ctx.fillStyle = dark ? '#e8e8ea' : '#1c1c1e'
  ctx.font = '600 52px -apple-system, "PingFang SC", sans-serif'
  ctx.fillText(`¥${s.price}`, width / 2, cardY)

  const stats = [
    `${s.count} 颗`,
    `周长 ${s.circumferenceCm.toFixed(1)}cm`,
    `约 ${s.weightG.toFixed(1)}g`,
  ]
  if (wristCm) stats.push(`手围 ${wristCm}cm`)
  ctx.fillStyle = dark ? '#9a9aa0' : '#7c857e'
  ctx.font = '400 28px -apple-system, "PingFang SC", sans-serif'
  ctx.fillText(stats.join('   ·   '), width / 2, cardY + 48)

  // 成分
  const kinds = [...new Set(beads.map((b) => b.crystalId))]
    .map((id) => CRYSTAL_MAP[id]?.name)
    .filter(Boolean)
  if (kinds.length) {
    ctx.fillStyle = dark ? '#c9c9cf' : '#4a544c'
    ctx.font = '400 26px -apple-system, "PingFang SC", sans-serif'
    ctx.fillText(kinds.join(' · '), width / 2, cardY + 96)
  }

  if (share) {
    // 分享图底部二维码占位与标语
    ctx.fillStyle = dark ? '#6b6b70' : '#aeb6ae'
    ctx.font = '400 22px -apple-system, "PingFang SC", sans-serif'
    ctx.fillText('长按识别 · 定制你的专属能量手链', width / 2, height - 60)
  }

  return canvas.toDataURL('image/png')
}

export function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export async function exportPdf(beads, opts = {}) {
  const { default: JsPDF } = await import('jspdf')
  const dataUrl = renderProductImage(beads, { ...opts, width: 1080, height: 1350 })
  const pdf = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const imgW = pageW - 24
  const imgH = (imgW * 1350) / 1080
  const x = 12
  const y = Math.max(12, (pageH - imgH) / 2)
  pdf.addImage(dataUrl, 'PNG', x, y, imgW, imgH)
  pdf.save('crystal-bracelet.pdf')
}
