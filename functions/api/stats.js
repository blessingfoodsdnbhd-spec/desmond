import { json, requireAuth, db } from './_lib.js'

// 销售统计（管理员）
export async function onRequestGet({ request, env }) {
  const d = db(env)
  if (!(await requireAuth(request, env, d))) return json({ ok: false }, 401)
  const now = Date.now()
  const d30 = now - 30 * 864e5
  const [tot, paid, cust, recent, byStatus, prodCount] = await Promise.all([
    d.prepare('SELECT COUNT(*) c, COALESCE(SUM(total),0) s FROM orders').first(),
    d.prepare("SELECT COUNT(*) c, COALESCE(SUM(total),0) s FROM orders WHERE status IN ('paid','shipped','done')").first(),
    d.prepare('SELECT COUNT(*) c FROM customers').first(),
    d.prepare('SELECT COUNT(*) c, COALESCE(SUM(total),0) s FROM orders WHERE created_at>=?').bind(d30).first(),
    d.prepare('SELECT status, COUNT(*) c FROM orders GROUP BY status').all(),
    d.prepare('SELECT COUNT(*) c FROM products').first(),
  ])
  const statusMap = {}
  for (const r of byStatus.results || []) statusMap[r.status] = r.c
  return json({
    ok: true,
    stats: {
      totalOrders: tot.c, totalRevenue: tot.s,
      paidOrders: paid.c, paidRevenue: paid.s,
      customers: cust.c, products: prodCount.c,
      last30Orders: recent.c, last30Revenue: recent.s,
      byStatus: statusMap,
    },
  })
}
