import { json, requireAuth, db } from './_lib.js'

// 客户列表（管理员）
export async function onRequestGet({ request, env }) {
  const d = db(env)
  if (!(await requireAuth(request, env, d))) return json({ ok: false }, 401)
  const rows = await d.prepare('SELECT * FROM customers ORDER BY last_at DESC LIMIT 500').all()
  return json({ ok: true, customers: rows.results || [] })
}
