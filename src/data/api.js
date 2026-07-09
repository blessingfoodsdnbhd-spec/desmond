// 云端 API 客户端（Cloudflare Pages Functions）
// 无后端时（单文件版 / 离线）所有调用自动失败并被上层忽略，回退本地。

const TOKEN_KEY = 'ah_token_v1'
export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY) || '' } catch { return '' }
}
export function setToken(t) {
  try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY) } catch (_) {}
}

// 是否处于「云端模式」：只有部署在 Cloudflare（有 /api）时才为真
let _cloud = null
export async function cloudReady() {
  if (_cloud != null) return _cloud
  // file:// 直接判定无后端
  if (typeof location !== 'undefined' && location.protocol === 'file:') { _cloud = false; return false }
  try {
    const r = await fetch('/api/state', { method: 'GET' })
    _cloud = r.ok
    if (r.ok) return true
  } catch (_) {}
  _cloud = false
  return false
}

async function req(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) headers.Authorization = `Bearer ${getToken()}`
  const r = await fetch(`/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`)
  return data
}

export const api = {
  state: () => req('/state'),
  login: (password) => req('/login', { method: 'POST', body: { password } }),
  saveProduct: (p) => req('/products', { method: 'POST', body: p, auth: true }),
  deleteProduct: (id) => req(`/products/${id}`, { method: 'DELETE', auth: true }),
  saveBead: (b) => req('/beads', { method: 'POST', body: b, auth: true }),
  deleteBead: (id) => req(`/beads/${id}`, { method: 'DELETE', auth: true }),
  setOverride: (o) => req('/overrides', { method: 'POST', body: o, auth: true }),
  createOrder: (o) => req('/orders', { method: 'POST', body: o }),
  listOrders: () => req('/orders', { auth: true }),
  patchOrder: (id, patch) => req(`/orders/${id}`, { method: 'PATCH', body: patch, auth: true }),
  deleteOrder: (id) => req(`/orders/${id}`, { method: 'DELETE', auth: true }),
  listCustomers: () => req('/customers', { auth: true }),
  stats: () => req('/stats', { auth: true }),
  saveSettings: (s) => req('/settings', { method: 'POST', body: s, auth: true }),
}
