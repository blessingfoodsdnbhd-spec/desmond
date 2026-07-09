import { json, requireAuth, db } from '../_lib.js'

export async function onRequestDelete({ request, env, params }) {
  const d = db(env)
  if (!(await requireAuth(request, env, d))) return json({ ok: false }, 401)
  await d.prepare('DELETE FROM beads WHERE id=?').bind(params.id).run()
  return json({ ok: true })
}
