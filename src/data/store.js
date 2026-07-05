// 商家后台数据存储（localStorage）+ 简单登录 + 图片压缩
// 说明：纯前端存储，数据保存在本机浏览器。提供导出/导入备份。
import { useSyncExternalStore } from 'react'
import { CRYSTAL_MAP, CRYSTALS } from './crystals.js'

const K = {
  beads: 'ah_beads_v1',
  products: 'ah_products_v1',
  pass: 'ah_pass_v1',
  authed: 'ah_authed_v1',
  wa: 'ah_wa_v1',
}
const DEFAULT_PASS = 'ahhuat888'
const DEFAULT_WA = '60127718812' // 马来西亚 WhatsApp（不含 +）

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
function write(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

// 把自定义珠子注册进 CRYSTAL_MAP，令现有渲染/计算逻辑直接可用
function registerBead(b) {
  CRYSTAL_MAP[b.id] = b
}

let state = {
  beads: read(K.beads, []),
  products: read(K.products, []),
  authed: read(K.authed, false),
}
// 启动时注册已保存的自定义珠子
state.beads.forEach(registerBead)

const listeners = new Set()
function emit() {
  state = { ...state }
  listeners.forEach((l) => l())
}
export function subscribe(l) {
  listeners.add(l)
  return () => listeners.delete(l)
}
function getSnapshot() {
  return state
}

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

// ---------- 认证 ----------
export function getPassword() {
  return read(K.pass, DEFAULT_PASS)
}
export function login(pw) {
  if (pw === getPassword()) {
    state.authed = true
    write(K.authed, true)
    emit()
    return true
  }
  return false
}
export function logout() {
  state.authed = false
  write(K.authed, false)
  emit()
}
export function setPassword(pw) {
  if (!pw || pw.length < 4) return false
  write(K.pass, pw)
  return true
}

// ---------- WhatsApp 下单 ----------
export function getWa() {
  return read(K.wa, DEFAULT_WA)
}
export function setWa(num) {
  const clean = String(num).replace(/[^0-9]/g, '')
  write(K.wa, clean)
  emit()
  return clean
}
export function waLink(text) {
  const num = getWa()
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`
}

// ---------- 自定义 DIY 珠子 ----------
export function addBead(bead) {
  const b = {
    id: bead.id || `c_${state.beads.length + 1}_${Math.abs(hash(bead.name + (bead.photo || '')))}`,
    name: bead.name,
    name_en: bead.name_en || bead.name,
    pinyin: bead.name_en || bead.name,
    photo: bead.photo || null,
    category: bead.category?.length ? bead.category : ['popular'],
    element: bead.element || 'wood',
    basePrice: Number(bead.basePrice) || 20,
    density: Number(bead.density) || 2.6,
    keywords: bead.keywords?.length ? bead.keywords : [],
    energy: bead.energy || '',
    energy_en: bead.energy_en || bead.energy || '',
    gradient: bead.gradient || { light: '#eef1f4', base: '#c8d0d8', deep: '#9aa4ae', ring: '#7d868f' },
    custom: true,
  }
  registerBead(b)
  state.beads = [...state.beads, b]
  write(K.beads, state.beads)
  emit()
  return b
}
export function deleteBead(id) {
  state.beads = state.beads.filter((b) => b.id !== id)
  delete CRYSTAL_MAP[id]
  write(K.beads, state.beads)
  emit()
}

// ---------- 自定义成品产品 ----------
export function addProduct(p) {
  const prod = {
    id: p.id || `p_${state.products.length + 1}_${Math.abs(hash(p.name + (p.image || '')))}`,
    name: p.name,
    name_en: p.name_en || p.name,
    image: p.image || null,
    badge: p.badge || '天然实拍',
    badge_en: p.badge_en || 'Real Photo',
    element: p.element || 'wood',
    keywords: p.keywords?.length ? p.keywords : [],
    energy: p.energy || '',
    energy_en: p.energy_en || p.energy || '',
    sizes: (p.sizes || []).filter((s) => s.size && s.price).map((s) => ({ size: Number(s.size), price: Number(s.price) })),
    custom: true,
  }
  state.products = [...state.products, prod]
  write(K.products, state.products)
  emit()
  return prod
}
export function deleteProduct(id) {
  state.products = state.products.filter((p) => p.id !== id)
  write(K.products, state.products)
  emit()
}

// ---------- 备份 导出 / 导入 ----------
export function exportData() {
  return JSON.stringify({ beads: state.beads, products: state.products, v: 1 }, null, 2)
}
export function importData(json) {
  const data = typeof json === 'string' ? JSON.parse(json) : json
  if (Array.isArray(data.beads)) {
    state.beads = data.beads
    state.beads.forEach(registerBead)
    write(K.beads, state.beads)
  }
  if (Array.isArray(data.products)) {
    state.products = data.products
    write(K.products, state.products)
  }
  emit()
}

// ---------- 图片压缩：File -> dataURL（缩放 + webp/jpeg） ----------
export function compressImage(file, maxSize = 512, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        // 优先 webp（支持透明且体积小），失败退回 jpeg
        let out = canvas.toDataURL('image/webp', quality)
        if (!out.startsWith('data:image/webp')) out = canvas.toDataURL('image/jpeg', quality)
        resolve(out)
      }
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 合并后的调色板 / 产品（默认 + 自定义）
export function allBeads(customBeads) {
  return [...CRYSTALS, ...customBeads]
}

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return h
}
