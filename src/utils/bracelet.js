import { CRYSTAL_MAP, beadPrice, beadWeight } from '../data/crystals.js'

// 手链上的一颗珠子： { uid, crystalId, size }
let seq = 0
export function makeBead(crystalId, size) {
  seq += 1
  return { uid: `b${seq}_${crystalId}`, crystalId, size }
}

// 汇总：周长、价格、重量、颗数
export function summarize(beads) {
  let circumference = 0 // mm
  let price = 0
  let weight = 0 // g
  for (const b of beads) {
    const c = CRYSTAL_MAP[b.crystalId]
    if (!c) continue
    circumference += b.size
    price += beadPrice(c, b.size)
    weight += beadWeight(c, b.size)
  }
  return {
    count: beads.length,
    circumferenceCm: circumference / 10,
    price,
    weightG: weight,
  }
}

// 根据手围 + 主珠尺寸，推荐颗数
// 成品内周长 ≈ 手围 + 松紧余量(约 1.5cm)，颗数 = 周长 / 珠径
export function recommendCount(wristCm, size) {
  const target = wristCm + 1.5 // cm
  const n = Math.round((target * 10) / size)
  return Math.max(6, Math.min(50, n))
}

// 当前手链相对目标手围还差几颗（用同尺寸主珠估算）
export function beadsToFill(beads, wristCm, fallbackSize = 8) {
  const size = beads.length ? mostCommonSize(beads) : fallbackSize
  const target = recommendCount(wristCm, size)
  return { size, needed: Math.max(0, target - beads.length), target }
}

function mostCommonSize(beads) {
  const tally = {}
  for (const b of beads) tally[b.size] = (tally[b.size] || 0) + 1
  return Number(Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0])
}

// 计算圆环上每颗珠子的位置（返回中心坐标 + 半径，单位：画布像素）
// beads 长度自适应：珠子沿圆周首尾相接排布。
export function layoutRing(beads, { cx, cy, ringRadius }) {
  const n = beads.length
  if (n === 0) return []
  const positions = []
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    const c = CRYSTAL_MAP[beads[i].crystalId]
    positions.push({
      ...beads[i],
      crystal: c,
      x: cx + Math.cos(angle) * ringRadius,
      y: cy + Math.sin(angle) * ringRadius,
      angle,
    })
  }
  return positions
}

// 依据珠子数量与最大珠径，自动算出合适的环半径，使珠子恰好相接不重叠
export function fitRingRadius(beads, maxBeadPx, viewSize) {
  const n = beads.length
  if (n === 0) return viewSize * 0.3
  // 相邻珠心弦长 = 2R sin(π/n) 需 ≈ 珠径 → R = beadPx / (2 sin(π/n))
  const byChord = maxBeadPx / (2 * Math.sin(Math.PI / Math.max(n, 2)))
  // 不超过画布范围
  const maxR = viewSize / 2 - maxBeadPx / 2 - 8
  return Math.min(byChord, maxR)
}
