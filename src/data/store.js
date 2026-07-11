// 商家后台数据存储（localStorage）+ 简单登录 + 图片压缩
// 说明：纯前端存储，数据保存在本机浏览器。提供导出/导入备份。
import { useSyncExternalStore } from 'react'
import { CRYSTAL_MAP, CRYSTALS } from './crystals.js'
import { PRODUCTS } from './products.js'
import { api, cloudReady, getToken, setToken } from './api.js'

// 云端推送（部署在 Cloudflare 时生效）：best-effort，失败不影响本地
let CLOUD = false
function push(fn) {
  if (!CLOUD || !getToken()) return
  Promise.resolve().then(fn).catch(() => {})
}

// 默认项目的原始副本（用于叠加编辑）
const ORIG_BEAD = Object.fromEntries(CRYSTALS.map((c) => [c.id, c]))

const K = {
  beads: 'ah_beads_v1',
  products: 'ah_products_v1',
  pass: 'ah_pass_v1',
  authed: 'ah_authed_v1',
  wa: 'ah_wa_v1',
  beadEdits: 'ah_bead_edits_v1',
  beadHidden: 'ah_bead_hidden_v1',
  productEdits: 'ah_product_edits_v1',
  productHidden: 'ah_product_hidden_v1',
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
// 写入本地缓存；配额满/隐私模式等异常不再中断添加流程（云端 D1 仍会保存）
let storageWarned = false
function write(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val))
    return true
  } catch (e) {
    if (!storageWarned) {
      storageWarned = true
      console.warn('本地存储写入失败（可能空间已满），改用云端保存：', e?.name || e)
    }
    return false
  }
}

// 把自定义珠子注册进 CRYSTAL_MAP，令现有渲染/计算逻辑直接可用
function registerBead(b) {
  CRYSTAL_MAP[b.id] = b
}

let state = {
  beads: read(K.beads, []),
  products: read(K.products, []),
  authed: read(K.authed, false),
  beadEdits: read(K.beadEdits, {}),
  beadHidden: read(K.beadHidden, []),
  productEdits: read(K.productEdits, {}),
  productHidden: read(K.productHidden, []),
}
// 把默认珠子的编辑叠加进 CRYSTAL_MAP
function applyBeadEdit(id) {
  if (ORIG_BEAD[id]) CRYSTAL_MAP[id] = { ...ORIG_BEAD[id], ...(state.beadEdits[id] || {}) }
}
Object.keys(ORIG_BEAD).forEach(applyBeadEdit)
// 启动时注册已保存的自定义珠子
state.beads.forEach(registerBead)

// ---------- 云端同步（Cloudflare 部署时）----------
async function syncFromCloud() {
  try {
    const ok = await cloudReady()
    if (!ok) return
    CLOUD = true
    const s = await api.state()
    if (!s?.ok) return
    state.beads = Array.isArray(s.beads) ? s.beads : []
    state.products = Array.isArray(s.products) ? s.products : []
    state.beadEdits = s.beadEdits || {}
    state.beadHidden = Array.isArray(s.beadHidden) ? s.beadHidden : []
    state.productEdits = s.productEdits || {}
    state.productHidden = Array.isArray(s.productHidden) ? s.productHidden : []
    state.cloudWa = s.settings?.wa || null
    // 缓存到本地并注册
    write(K.beads, state.beads); write(K.products, state.products)
    write(K.beadEdits, state.beadEdits); write(K.beadHidden, state.beadHidden)
    write(K.productEdits, state.productEdits); write(K.productHidden, state.productHidden)
    state.beads.forEach(registerBead)
    Object.keys(ORIG_BEAD).forEach(applyBeadEdit)
    emit()
  } catch (_) {}
}
syncFromCloud()

export function isCloud() {
  return CLOUD
}

// 生效后的默认项目（应用编辑 + 过滤隐藏）
export function effectiveDefaultBeads(s) {
  return CRYSTALS.map((c) => ({ ...c, ...(s.beadEdits[c.id] || {}) })).filter((c) => !s.beadHidden.includes(c.id))
}
export function effectiveDefaultProducts(s) {
  return PRODUCTS.map((p) => ({ ...p, ...(s.productEdits[p.id] || {}) })).filter((p) => !s.productHidden.includes(p.id))
}

// 编辑默认珠子 / 隐藏 / 恢复
export function setBeadEdit(id, patch) {
  state.beadEdits = { ...state.beadEdits, [id]: { ...(state.beadEdits[id] || {}), ...patch } }
  write(K.beadEdits, state.beadEdits)
  applyBeadEdit(id)
  emit()
  push(() => api.setOverride({ scope: 'bead', ref_id: id, patch: state.beadEdits[id], hidden: state.beadHidden.includes(id) }))
}
export function toggleHideBead(id) {
  state.beadHidden = state.beadHidden.includes(id) ? state.beadHidden.filter((x) => x !== id) : [...state.beadHidden, id]
  write(K.beadHidden, state.beadHidden)
  emit()
  push(() => api.setOverride({ scope: 'bead', ref_id: id, patch: state.beadEdits[id] || null, hidden: state.beadHidden.includes(id) }))
}
export function setProductEdit(id, patch) {
  state.productEdits = { ...state.productEdits, [id]: { ...(state.productEdits[id] || {}), ...patch } }
  write(K.productEdits, state.productEdits)
  emit()
  push(() => api.setOverride({ scope: 'product', ref_id: id, patch: state.productEdits[id], hidden: state.productHidden.includes(id) }))
}
export function toggleHideProduct(id) {
  state.productHidden = state.productHidden.includes(id) ? state.productHidden.filter((x) => x !== id) : [...state.productHidden, id]
  write(K.productHidden, state.productHidden)
  emit()
  push(() => api.setOverride({ scope: 'product', ref_id: id, patch: state.productEdits[id] || null, hidden: state.productHidden.includes(id) }))
}

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
export async function login(pw) {
  // 云端模式：向服务器验证并取得 token
  if (CLOUD) {
    try {
      const r = await api.login(pw)
      if (r?.ok && r.token) {
        setToken(r.token)
        state.authed = true
        write(K.authed, true)
        emit()
        return true
      }
      return false
    } catch {
      return false
    }
  }
  // 本地模式
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
  setToken('')
  write(K.authed, false)
  emit()
}
export function setPassword(pw) {
  if (!pw || pw.length < 4) return false
  write(K.pass, pw)
  push(() => api.saveSettings({ admin_pass: pw }))
  return true
}

// ---------- WhatsApp 下单 ----------
export function getWa() {
  return state.cloudWa || read(K.wa, DEFAULT_WA)
}
export function setWa(num) {
  const clean = String(num).replace(/[^0-9]/g, '')
  write(K.wa, clean)
  state.cloudWa = clean
  emit()
  push(() => api.saveSettings({ wa: clean }))
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
  push(() => api.saveBead(b))
  return b
}
export function updateBead(id, patch) {
  let updated = null
  state.beads = state.beads.map((b) => {
    if (b.id !== id) return b
    const merged = { ...b, ...patch }
    if (patch.keywords) merged.keywords = patch.keywords
    merged.basePrice = Number(merged.basePrice) || b.basePrice
    registerBead(merged)
    updated = merged
    return merged
  })
  write(K.beads, state.beads)
  emit()
  if (updated) push(() => api.saveBead(updated))
}
export function deleteBead(id) {
  state.beads = state.beads.filter((b) => b.id !== id)
  delete CRYSTAL_MAP[id]
  write(K.beads, state.beads)
  emit()
  push(() => api.deleteBead(id))
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
  push(() => api.saveProduct(prod))
  return prod
}
export function updateProduct(id, patch) {
  let updated = null
  state.products = state.products.map((p) => {
    if (p.id !== id) return p
    updated = { ...p, ...patch }
    return updated
  })
  write(K.products, state.products)
  emit()
  if (updated) push(() => api.saveProduct(updated))
}
export function deleteProduct(id) {
  state.products = state.products.filter((p) => p.id !== id)
  write(K.products, state.products)
  emit()
  push(() => api.deleteProduct(id))
}

// ---------- 备份 导出 / 导入 ----------
export function exportData() {
  return JSON.stringify(
    {
      beads: state.beads,
      products: state.products,
      beadEdits: state.beadEdits,
      beadHidden: state.beadHidden,
      productEdits: state.productEdits,
      productHidden: state.productHidden,
      v: 2,
    },
    null,
    2,
  )
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
  if (data.beadEdits) {
    state.beadEdits = data.beadEdits
    write(K.beadEdits, state.beadEdits)
    Object.keys(ORIG_BEAD).forEach(applyBeadEdit)
  }
  if (Array.isArray(data.beadHidden)) {
    state.beadHidden = data.beadHidden
    write(K.beadHidden, state.beadHidden)
  }
  if (data.productEdits) {
    state.productEdits = data.productEdits
    write(K.productEdits, state.productEdits)
  }
  if (Array.isArray(data.productHidden)) {
    state.productHidden = data.productHidden
    write(K.productHidden, state.productHidden)
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
