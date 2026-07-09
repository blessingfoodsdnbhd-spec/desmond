import { json, effectivePassword, makeToken, db } from './_lib.js'

export async function onRequestPost({ request, env }) {
  const { password } = await request.json().catch(() => ({}))
  const pw = await effectivePassword(env, db(env))
  if (!password || password !== pw) return json({ ok: false, error: 'wrong-password' }, 401)
  const token = await makeToken(env, db(env))
  return json({ ok: true, token })
}
