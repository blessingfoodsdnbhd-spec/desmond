import { json, requireAuth, db } from '../_lib.js'

// 更新订单状态/备注（管理员）
export async function onRequestPatch({ request, env, params }) {
  const d = db(env)
  if (!(await requireAuth(request, env, d))) return json({ ok: false }, 401)
  const { status, note } = await request.json().catch(() => ({}))
  await d
    .prepare('UPDATE orders SET status=COALESCE(?,status), note=COALESCE(?,note) WHERE id=?')
    .bind(status ?? null, note ?? null, params.id)
    .run()
  return json({ ok: true })
}

export async function onRequestDelete({ request, env, params }) {
  const d = db(env)
  if (!(await requireAuth(request, env, d))) return json({ ok: false }, 401)
  await d.prepare('DELETE FROM orders WHERE id=?').bind(params.id).run()
  return json({ ok: true })
}
