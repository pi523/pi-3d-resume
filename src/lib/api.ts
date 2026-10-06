// 后端（worker/）的前端封装。VITE_API_BASE 为空 → 功能静默关闭（留言墙显示"上线中"，计数不显示）。
//   开发：web/.env.development  VITE_API_BASE=http://localhost:8787   （先在 worker/ 跑 npm run dev）
//   线上：web/.env.production   VITE_API_BASE=https://enge-site-api.<you>.workers.dev
export const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/+$/, '') || ''
export const apiEnabled = !!API_BASE

export type StickerId = 'cat' | 'coffee' | 'star' | 'gamepad' | 'rocket' | 'bulb' | 'flower' | 'robot'
export interface WallItem {
  id: number
  nick: string
  sticker: StickerId
  text: string
  created_at: number
  status?: string
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(API_BASE + path, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
  })
  const data = (await r.json().catch(() => ({}))) as T & { error?: string }
  if (!r.ok) throw new Error(data.error || `http ${r.status}`)
  return data
}

export const getPetCount = () => req<{ count: number }>('/api/pet')
export const pet = () => req<{ count: number; capped: boolean }>('/api/pet', { method: 'POST' })
export const getWall = (limit = 80) => req<{ items: WallItem[] }>(`/api/wall?limit=${limit}`)
export const postWall = (body: { nick: string; sticker: StickerId; text: string }) =>
  req<{ ok: boolean; id: number }>('/api/wall', { method: 'POST', body: JSON.stringify(body) })

const auth = (token: string) => ({ authorization: `Bearer ${token}` })
export const adminPending = (token: string) => req<{ items: WallItem[] }>('/api/admin/pending', { headers: auth(token) })
export const adminModerate = (token: string, id: number, action: 'approve' | 'reject' | 'delete') =>
  req<{ ok: boolean }>('/api/admin/moderate', { method: 'POST', headers: auth(token), body: JSON.stringify({ id, action }) })
