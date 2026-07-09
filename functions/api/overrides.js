import { json, requireAuth, db } from './_lib.js'

// 编辑/隐藏内置默认珠子或产品（管理员）
export async function onRequestPost({ request, env }) {
  const d = db(env)
  if (!(await requireAuth(request, env, d))) return json({ ok: false }, 401)
  const { scope, ref_id, patch, hidden } = await request.json().catch(() => ({}))
  if (!scope || !ref_id) return json({ ok: false, error: 'bad' }, 400)
  await d
    .prepare(
      `INSERT INTO overrides (scope,ref_id,patch,hidden) VALUES (?,?,?,?)
       ON CONFLICT(scope,ref_id) DO UPDATE SET
         patch=COALESCE(excluded.patch, overrides.patch),
         hidden=excluded.hidden`,
    )
    .bind(scope, ref_id, patch != null ? JSON.stringify(patch) : null, hidden ? 1 : 0)
    .run()
  return json({ ok: true })
}
