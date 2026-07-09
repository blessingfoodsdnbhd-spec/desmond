// 阿发水晶阁 · Cloudflare Pages 高级模式 Worker（含 CRM API）
// 直接上传 dist（含本文件）即可；非 /api 请求交给静态资源。

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors } })
const J = (s, f) => { try { return s ? JSON.parse(s) : f } catch { return f } }

async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
async function effectivePassword(env, db) {
  try { const r = await db.prepare('SELECT value FROM settings WHERE key=?').bind('admin_pass').first(); if (r?.value) return r.value } catch (_) {}
  return env.ADMIN_PASSWORD || 'ahhuat888'
}
async function makeToken(env, db) {
  return sha256hex((await effectivePassword(env, db)) + '::' + (env.AUTH_SECRET || 'ah-huat-secret'))
}
async function auth(request, env, db) {
  const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim()
  return !!token && token === (await makeToken(env, db))
}

function productOut(r) {
  return { id: r.id, name: r.name, name_en: r.name_en, image: r.image, badge: r.badge, badge_en: r.badge_en,
    element: r.element, keywords: J(r.keywords, []), energy: r.energy, energy_en: r.energy_en,
    sizes: J(r.sizes, []), crystalId: r.crystal_id, stock: r.stock, hidden: !!r.hidden, custom: true }
}
function beadOut(r) {
  return { id: r.id, name: r.name, name_en: r.name_en, pinyin: r.name_en || r.name, photo: r.photo,
    category: J(r.category, ['popular']), element: r.element, basePrice: r.base_price, density: r.density,
    keywords: J(r.keywords, []), energy: r.energy, energy_en: r.energy_en, gradient: J(r.gradient, null),
    stock: r.stock, hidden: !!r.hidden, custom: true }
}

async function handleApi(request, env, url) {
  const db = env.DB
  const path = url.pathname.replace(/\/+$/, '')
  const m = request.method
  const body = async () => await request.json().catch(() => ({}))
  if (!db) return json({ ok: false, error: 'no-db' }, 500)

  // 登录
  if (path === '/api/login' && m === 'POST') {
    const { password } = await body()
    const pw = await effectivePassword(env, db)
    if (!password || password !== pw) return json({ ok: false, error: 'wrong-password' }, 401)
    return json({ ok: true, token: await makeToken(env, db) })
  }

  // 公共状态
  if (path === '/api/state' && m === 'GET') {
    const [prods, beads, ovr, setts] = await Promise.all([
      db.prepare('SELECT * FROM products ORDER BY sort ASC, updated_at DESC').all(),
      db.prepare('SELECT * FROM beads ORDER BY updated_at DESC').all(),
      db.prepare('SELECT * FROM overrides').all(),
      db.prepare('SELECT * FROM settings').all(),
    ])
    const settings = {}; for (const s of setts.results || []) if (s.key !== 'admin_pass') settings[s.key] = s.value
    const beadEdits = {}, beadHidden = [], productEdits = {}, productHidden = []
    for (const o of ovr.results || []) {
      if (o.scope === 'bead') { if (o.patch) beadEdits[o.ref_id] = J(o.patch, {}); if (o.hidden) beadHidden.push(o.ref_id) }
      else { if (o.patch) productEdits[o.ref_id] = J(o.patch, {}); if (o.hidden) productHidden.push(o.ref_id) }
    }
    return json({ ok: true, products: (prods.results || []).map(productOut), beads: (beads.results || []).map(beadOut),
      beadEdits, beadHidden, productEdits, productHidden, settings })
  }

  // 下单（公共）+ 更新客户
  if (path === '/api/orders' && m === 'POST') {
    const o = await body(); const id = `o_${Date.now()}`; const now = Date.now(); const total = Number(o.total) || 0
    await db.prepare(`INSERT INTO orders (id,name,phone,address,items,summary,total,channel,status,note,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
      .bind(id, o.name || '', o.phone || '', o.address || '', JSON.stringify(o.items || null), o.summary || '', total, o.channel || 'web', 'new', '', now).run()
    if (o.phone) {
      await db.prepare(`INSERT INTO customers (phone,name,address,orders_count,total_spent,first_at,last_at) VALUES (?,?,?,1,?,?,?)
        ON CONFLICT(phone) DO UPDATE SET name=excluded.name,address=excluded.address,orders_count=customers.orders_count+1,total_spent=customers.total_spent+excluded.total_spent,last_at=excluded.last_at`)
        .bind(o.phone, o.name || '', o.address || '', total, now, now).run()
    }
    return json({ ok: true, id })
  }

  // ↓↓↓ 以下均需管理员
  if (!(await auth(request, env, db))) return json({ ok: false, error: 'unauth' }, 401)

  if (path === '/api/products' && m === 'POST') {
    const p = await body(); if (!p.name) return json({ ok: false }, 400)
    const id = p.id || `p_${Date.now()}`, now = Date.now()
    await db.prepare(`INSERT INTO products (id,name,name_en,image,badge,badge_en,element,keywords,energy,energy_en,sizes,crystal_id,stock,hidden,sort,updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET name=excluded.name,name_en=excluded.name_en,image=excluded.image,badge=excluded.badge,badge_en=excluded.badge_en,
        element=excluded.element,keywords=excluded.keywords,energy=excluded.energy,energy_en=excluded.energy_en,sizes=excluded.sizes,
        crystal_id=excluded.crystal_id,stock=excluded.stock,hidden=excluded.hidden,sort=excluded.sort,updated_at=excluded.updated_at`)
      .bind(id, p.name, p.name_en || p.name, p.image || null, p.badge || '天然实拍', p.badge_en || 'Real Photo', p.element || 'wood',
        JSON.stringify(p.keywords || []), p.energy || '', p.energy_en || p.energy || '', JSON.stringify(p.sizes || []), p.crystalId || null,
        Number(p.stock) || 0, p.hidden ? 1 : 0, Number(p.sort) || 0, now).run()
    return json({ ok: true, id })
  }
  if (path.startsWith('/api/products/') && m === 'DELETE') {
    await db.prepare('DELETE FROM products WHERE id=?').bind(decodeURIComponent(path.split('/').pop())).run()
    return json({ ok: true })
  }
  if (path === '/api/beads' && m === 'POST') {
    const b = await body(); if (!b.name) return json({ ok: false }, 400)
    const id = b.id || `c_${Date.now()}`, now = Date.now()
    await db.prepare(`INSERT INTO beads (id,name,name_en,photo,category,element,base_price,density,keywords,energy,energy_en,gradient,stock,hidden,updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET name=excluded.name,name_en=excluded.name_en,photo=excluded.photo,category=excluded.category,element=excluded.element,
        base_price=excluded.base_price,density=excluded.density,keywords=excluded.keywords,energy=excluded.energy,energy_en=excluded.energy_en,
        gradient=excluded.gradient,stock=excluded.stock,hidden=excluded.hidden,updated_at=excluded.updated_at`)
      .bind(id, b.name, b.name_en || b.name, b.photo || null, JSON.stringify(b.category || ['popular']), b.element || 'wood',
        Number(b.basePrice) || 20, Number(b.density) || 2.6, JSON.stringify(b.keywords || []), b.energy || '', b.energy_en || b.energy || '',
        JSON.stringify(b.gradient || null), Number(b.stock) || 0, b.hidden ? 1 : 0, now).run()
    return json({ ok: true, id })
  }
  if (path.startsWith('/api/beads/') && m === 'DELETE') {
    await db.prepare('DELETE FROM beads WHERE id=?').bind(decodeURIComponent(path.split('/').pop())).run()
    return json({ ok: true })
  }
  if (path === '/api/overrides' && m === 'POST') {
    const { scope, ref_id, patch, hidden } = await body(); if (!scope || !ref_id) return json({ ok: false }, 400)
    await db.prepare(`INSERT INTO overrides (scope,ref_id,patch,hidden) VALUES (?,?,?,?)
      ON CONFLICT(scope,ref_id) DO UPDATE SET patch=COALESCE(excluded.patch, overrides.patch), hidden=excluded.hidden`)
      .bind(scope, ref_id, patch != null ? JSON.stringify(patch) : null, hidden ? 1 : 0).run()
    return json({ ok: true })
  }
  if (path === '/api/orders' && m === 'GET') {
    const rows = await db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 500').all()
    return json({ ok: true, orders: (rows.results || []).map((r) => ({ ...r, items: J(r.items, null) })) })
  }
  if (path.startsWith('/api/orders/') && m === 'PATCH') {
    const { status, note } = await body()
    await db.prepare('UPDATE orders SET status=COALESCE(?,status), note=COALESCE(?,note) WHERE id=?')
      .bind(status ?? null, note ?? null, decodeURIComponent(path.split('/').pop())).run()
    return json({ ok: true })
  }
  if (path.startsWith('/api/orders/') && m === 'DELETE') {
    await db.prepare('DELETE FROM orders WHERE id=?').bind(decodeURIComponent(path.split('/').pop())).run()
    return json({ ok: true })
  }
  if (path === '/api/customers' && m === 'GET') {
    const rows = await db.prepare('SELECT * FROM customers ORDER BY last_at DESC LIMIT 500').all()
    return json({ ok: true, customers: rows.results || [] })
  }
  if (path === '/api/stats' && m === 'GET') {
    const now = Date.now(), d30 = now - 30 * 864e5
    const [tot, paid, cust, recent, byStatus, prodCount] = await Promise.all([
      db.prepare('SELECT COUNT(*) c, COALESCE(SUM(total),0) s FROM orders').first(),
      db.prepare("SELECT COUNT(*) c, COALESCE(SUM(total),0) s FROM orders WHERE status IN ('paid','shipped','done')").first(),
      db.prepare('SELECT COUNT(*) c FROM customers').first(),
      db.prepare('SELECT COUNT(*) c, COALESCE(SUM(total),0) s FROM orders WHERE created_at>=?').bind(d30).first(),
      db.prepare('SELECT status, COUNT(*) c FROM orders GROUP BY status').all(),
      db.prepare('SELECT COUNT(*) c FROM products').first(),
    ])
    const statusMap = {}; for (const r of byStatus.results || []) statusMap[r.status] = r.c
    return json({ ok: true, stats: { totalOrders: tot.c, totalRevenue: tot.s, paidOrders: paid.c, paidRevenue: paid.s,
      customers: cust.c, products: prodCount.c, last30Orders: recent.c, last30Revenue: recent.s, byStatus: statusMap } })
  }
  if (path === '/api/settings' && m === 'POST') {
    const b = await body(); const entries = []
    if (b.wa != null) entries.push(['wa', String(b.wa).replace(/[^0-9]/g, '')])
    if (b.admin_pass && String(b.admin_pass).length >= 4) entries.push(['admin_pass', String(b.admin_pass)])
    for (const [k, v] of entries) await db.prepare('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(k, v).run()
    return json({ ok: true })
  }
  return json({ ok: false, error: 'not-found' }, 404)
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    const url = new URL(request.url)
    if (url.pathname.startsWith('/api/')) {
      try { return await handleApi(request, env, url) } catch (e) { return json({ ok: false, error: String(e) }, 500) }
    }
    return env.ASSETS.fetch(request)
  },
}
