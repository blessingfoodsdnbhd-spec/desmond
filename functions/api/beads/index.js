import { json, requireAuth, db } from '../_lib.js'

// 新增/更新自定义珠子（管理员）
export async function onRequestPost({ request, env }) {
  const d = db(env)
  if (!(await requireAuth(request, env, d))) return json({ ok: false }, 401)
  const b = await request.json().catch(() => null)
  if (!b || !b.name) return json({ ok: false, error: 'need-name' }, 400)
  const id = b.id || `c_${Date.now()}`
  const now = Date.now()
  await d
    .prepare(
      `INSERT INTO beads (id,name,name_en,photo,category,element,base_price,density,keywords,energy,energy_en,gradient,stock,hidden,updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT(id) DO UPDATE SET name=excluded.name,name_en=excluded.name_en,photo=excluded.photo,category=excluded.category,
         element=excluded.element,base_price=excluded.base_price,density=excluded.density,keywords=excluded.keywords,
         energy=excluded.energy,energy_en=excluded.energy_en,gradient=excluded.gradient,stock=excluded.stock,
         hidden=excluded.hidden,updated_at=excluded.updated_at`,
    )
    .bind(
      id, b.name, b.name_en || b.name, b.photo || null, JSON.stringify(b.category || ['popular']),
      b.element || 'wood', Number(b.basePrice) || 20, Number(b.density) || 2.6, JSON.stringify(b.keywords || []),
      b.energy || '', b.energy_en || b.energy || '', JSON.stringify(b.gradient || null), Number(b.stock) || 0, b.hidden ? 1 : 0, now,
    )
    .run()
  return json({ ok: true, id })
}
