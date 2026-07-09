// 公共工具：JSON 响应、CORS、认证、SHA256
export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors, ...extra },
  })
}

export async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// 有效管理密码：优先数据库里改过的，其次环境变量，最后默认
export async function effectivePassword(env, db) {
  try {
    const row = await db.prepare('SELECT value FROM settings WHERE key=?').bind('admin_pass').first()
    if (row?.value) return row.value
  } catch (_) {}
  return env.ADMIN_PASSWORD || 'ahhuat888'
}

export async function makeToken(env, db) {
  const pw = await effectivePassword(env, db)
  return sha256hex(pw + '::' + (env.AUTH_SECRET || 'ah-huat-secret'))
}

export async function requireAuth(request, env, db) {
  const auth = request.headers.get('Authorization') || ''
  const token = auth.replace(/^Bearer\s+/i, '').trim()
  if (!token) return false
  const expected = await makeToken(env, db)
  return token === expected
}

export function db(env) {
  return env.DB
}
