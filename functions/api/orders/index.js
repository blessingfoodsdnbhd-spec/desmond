import { json, requireAuth, db } from '../_lib.js'

const J = (s, f) => { try { return s ? JSON.parse(s) : f } catch { return f } }

// 客人下单（公共）
export async function onRequestPost({ request, env }) {
  const d = db(env)
  const o = await request.json().catch(() => null)
  if (!o) return json({ ok: false }, 400)
  const id = `o_${Date.now()}`
  const now = Date.now()
  const total = Number(o.total) || 0
  await d
    .prepare(
      `INSERT INTO orders (id,name,phone,address,items,summary,total,channel,status,note,created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    )
    .bind(
      id, o.name || '', o.phone || '', o.address || '', JSON.stringify(o.items || null),
      o.summary || '', total, o.channel || 'web', 'new', '', now,
    )
    .run()
  // 更新客户
  if (o.phone) {
    await d
      .prepare(
        `INSERT INTO customers (phone,name,address,orders_count,total_spent,first_at,last_at)
         VALUES (?,?,?,1,?,?,?)
         ON CONFLICT(phone) DO UPDATE SET name=excluded.name,address=excluded.address,
           orders_count=customers.orders_count+1, total_spent=customers.total_spent+excluded.total_spent, last_at=excluded.last_at`,
      )
      .bind(o.phone, o.name || '', o.address || '', total, now, now)
      .run()
  }
  return json({ ok: true, id })
}

// 订单列表（管理员）
export async function onRequestGet({ request, env }) {
  const d = db(env)
  if (!(await requireAuth(request, env, d))) return json({ ok: false }, 401)
  const rows = await d.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 500').all()
  const orders = (rows.results || []).map((r) => ({ ...r, items: J(r.items, null), hidden: undefined }))
  return json({ ok: true, orders })
}
