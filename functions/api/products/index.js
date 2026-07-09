import { json, requireAuth, db } from '../_lib.js'

// 新增/更新产品（管理员）
export async function onRequestPost({ request, env }) {
  const d = db(env)
  if (!(await requireAuth(request, env, d))) return json({ ok: false }, 401)
  const p = await request.json().catch(() => null)
  if (!p || !p.name) return json({ ok: false, error: 'need-name' }, 400)
  const id = p.id || `p_${Date.now()}`
  const now = Date.now()
  await d
    .prepare(
      `INSERT INTO products (id,name,name_en,image,badge,badge_en,element,keywords,energy,energy_en,sizes,crystal_id,stock,hidden,sort,updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT(id) DO UPDATE SET name=excluded.name,name_en=excluded.name_en,image=excluded.image,badge=excluded.badge,
         badge_en=excluded.badge_en,element=excluded.element,keywords=excluded.keywords,energy=excluded.energy,
         energy_en=excluded.energy_en,sizes=excluded.sizes,crystal_id=excluded.crystal_id,stock=excluded.stock,
         hidden=excluded.hidden,sort=excluded.sort,updated_at=excluded.updated_at`,
    )
    .bind(
      id, p.name, p.name_en || p.name, p.image || null, p.badge || '天然实拍', p.badge_en || 'Real Photo',
      p.element || 'wood', JSON.stringify(p.keywords || []), p.energy || '', p.energy_en || p.energy || '',
      JSON.stringify(p.sizes || []), p.crystalId || null, Number(p.stock) || 0, p.hidden ? 1 : 0, Number(p.sort) || 0, now,
    )
    .run()
  return json({ ok: true, id })
}
