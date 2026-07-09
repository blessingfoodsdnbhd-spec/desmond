import { json, requireAuth, db } from './_lib.js'

// 更新设置：WhatsApp 号码 / 管理密码（管理员）
export async function onRequestPost({ request, env }) {
  const d = db(env)
  if (!(await requireAuth(request, env, d))) return json({ ok: false }, 401)
  const body = await request.json().catch(() => ({}))
  const entries = []
  if (body.wa != null) entries.push(['wa', String(body.wa).replace(/[^0-9]/g, '')])
  if (body.admin_pass && String(body.admin_pass).length >= 4) entries.push(['admin_pass', String(body.admin_pass)])
  for (const [k, v] of entries) {
    await d
      .prepare('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value')
      .bind(k, v)
      .run()
  }
  return json({ ok: true })
}
