// 个人站小后端：摸猫计数 + 贴纸留言墙（先入库待审，审核通过才公开）+ 审核接口。
//
//   GET  /api/pet                 → { count }
//   POST /api/pet                 → +1（每 IP 每日上限 PET_DAILY_CAP_PER_IP）→ { count }
//   GET  /api/wall?limit=80       → { items: [{ id, nick, sticker, text, created_at }] }（仅 approved）
//   POST /api/wall { nick, sticker, text } → { ok, id }（pending；每 IP 每日上限 WALL_DAILY_CAP_PER_IP）
//   GET  /api/admin/pending       → { items }         需要 Authorization: Bearer <ADMIN_TOKEN>
//   POST /api/admin/moderate { id, action: 'approve' | 'reject' | 'delete' }
//
// IP 只存 SHA-256 前 16 位（加盐 = ADMIN_TOKEN），不存原始 IP。
export interface Env {
  DB: D1Database
  ALLOWED_ORIGINS: string
  PET_DAILY_CAP_PER_IP: string
  WALL_DAILY_CAP_PER_IP: string
  ADMIN_TOKEN?: string
}

const STICKERS = new Set(['cat', 'coffee', 'star', 'gamepad', 'rocket', 'bulb', 'flower', 'robot'])
const NICK_MAX = 16
const TEXT_MAX = 80
// 极简敏感词：命中直接拒收（真正把关靠审核）
const BANNED = ['http://', 'https://', 'www.', '.com', '微信', 'wechat', 'telegram', 'vx:', '加我']

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  })

function corsHeaders(req: Request, env: Env): Record<string, string> {
  const origin = req.headers.get('origin') || ''
  const allowed = env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
  const ok = allowed.includes(origin)
  return {
    'access-control-allow-origin': ok ? origin : allowed[0],
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type,authorization',
    'access-control-max-age': '86400',
    vary: 'origin',
  }
}

async function ipHash(req: Request, salt: string): Promise<string> {
  const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown'
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip + '|' + salt))
  return [...new Uint8Array(buf)]
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const today = () => new Date().toISOString().slice(0, 10)

// 配额：原子 +1 并返回新值；超限返回 false
async function takeQuota(env: Env, ip: string, action: string, cap: number): Promise<boolean> {
  const day = today()
  await env.DB.prepare(
    `INSERT INTO quota (ip_hash, day, action, n) VALUES (?1, ?2, ?3, 1)
     ON CONFLICT(ip_hash, day, action) DO UPDATE SET n = n + 1`
  )
    .bind(ip, day, action)
    .run()
  const row = await env.DB.prepare('SELECT n FROM quota WHERE ip_hash = ?1 AND day = ?2 AND action = ?3')
    .bind(ip, day, action)
    .first<{ n: number }>()
  return (row?.n ?? 0) <= cap
}

function isAdmin(req: Request, env: Env): boolean {
  const auth = req.headers.get('authorization') || ''
  return !!env.ADMIN_TOKEN && auth === `Bearer ${env.ADMIN_TOKEN}`
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(req, env)
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    const url = new URL(req.url)
    const path = url.pathname.replace(/\/+$/, '')
    const salt = env.ADMIN_TOKEN || 'dev-salt'

    try {
      // ---- 摸猫计数 ----
      if (path === '/api/pet' && req.method === 'GET') {
        const row = await env.DB.prepare("SELECT value FROM counters WHERE key = 'pet'").first<{ value: number }>()
        return json({ count: row?.value ?? 0 }, 200, cors)
      }
      if (path === '/api/pet' && req.method === 'POST') {
        const ip = await ipHash(req, salt)
        const ok = await takeQuota(env, ip, 'pet', Number(env.PET_DAILY_CAP_PER_IP) || 300)
        if (ok) await env.DB.prepare("UPDATE counters SET value = value + 1 WHERE key = 'pet'").run()
        const row = await env.DB.prepare("SELECT value FROM counters WHERE key = 'pet'").first<{ value: number }>()
        return json({ count: row?.value ?? 0, capped: !ok }, 200, cors)
      }

      // ---- 留言墙 ----
      if (path === '/api/wall' && req.method === 'GET') {
        const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit')) || 80))
        const { results } = await env.DB.prepare(
          "SELECT id, nick, sticker, text, created_at FROM wall WHERE status = 'approved' ORDER BY created_at DESC LIMIT ?1"
        )
          .bind(limit)
          .all()
        return json({ items: results }, 200, { ...cors, 'cache-control': 'public, max-age=30' })
      }
      if (path === '/api/wall' && req.method === 'POST') {
        const body = (await req.json().catch(() => null)) as { nick?: string; sticker?: string; text?: string } | null
        const nick = (body?.nick || '').trim().slice(0, NICK_MAX)
        const sticker = (body?.sticker || '').trim()
        const text = (body?.text || '').replace(/\s+/g, ' ').trim().slice(0, TEXT_MAX)
        if (!nick || !text || !STICKERS.has(sticker)) return json({ error: 'invalid' }, 400, cors)
        const lower = (nick + ' ' + text).toLowerCase()
        if (BANNED.some((w) => lower.includes(w))) return json({ error: 'rejected' }, 400, cors)
        const ip = await ipHash(req, salt)
        const ok = await takeQuota(env, ip, 'wall', Number(env.WALL_DAILY_CAP_PER_IP) || 5)
        if (!ok) return json({ error: 'quota' }, 429, cors)
        const res = await env.DB.prepare(
          'INSERT INTO wall (nick, sticker, text, status, ip_hash, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)'
        )
          .bind(nick, sticker, text, 'pending', ip, Date.now())
          .run()
        return json({ ok: true, id: res.meta.last_row_id }, 200, cors)
      }

      // ---- 审核 ----
      if (path.startsWith('/api/admin/')) {
        if (!isAdmin(req, env)) return json({ error: 'unauthorized' }, 401, cors)
        if (path === '/api/admin/pending' && req.method === 'GET') {
          const { results } = await env.DB.prepare(
            "SELECT id, nick, sticker, text, status, created_at FROM wall WHERE status = 'pending' ORDER BY created_at ASC LIMIT 200"
          ).all()
          return json({ items: results }, 200, cors)
        }
        if (path === '/api/admin/moderate' && req.method === 'POST') {
          const body = (await req.json().catch(() => null)) as { id?: number; action?: string } | null
          const id = Number(body?.id)
          const action = body?.action
          if (!id || !['approve', 'reject', 'delete'].includes(action || '')) return json({ error: 'invalid' }, 400, cors)
          if (action === 'delete') await env.DB.prepare('DELETE FROM wall WHERE id = ?1').bind(id).run()
          else
            await env.DB.prepare('UPDATE wall SET status = ?1 WHERE id = ?2')
              .bind(action === 'approve' ? 'approved' : 'rejected', id)
              .run()
          return json({ ok: true }, 200, cors)
        }
      }

      return json({ error: 'not found' }, 404, cors)
    } catch (e) {
      return json({ error: 'server', detail: String(e) }, 500, cors)
    }
  },
}
