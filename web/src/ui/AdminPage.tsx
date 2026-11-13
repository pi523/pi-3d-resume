import { useEffect, useState } from 'react'
import SubTop from './SubTop'
import { adminModerate, adminPending, apiEnabled, type WallItem } from '../lib/api'
import { STICKER_SET } from './StickerWall'

// 审核页 #/admin：输入 ADMIN_TOKEN（存 sessionStorage），列出待审留言，通过 / 拒绝 / 删除。
// 页面本身没有秘密——没有 token 什么都拿不到。
export default function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem('enge-admin') || '')
  const [items, setItems] = useState<WallItem[]>([])
  const [msg, setMsg] = useState('')

  const load = async (tk = token) => {
    if (!tk) return
    try {
      const r = await adminPending(tk)
      setItems(r.items)
      setMsg(`${r.items.length} 条待审`)
      sessionStorage.setItem('enge-admin', tk)
    } catch (e) {
      setMsg(String(e).includes('unauthorized') ? '口令不对' : `出错：${e}`)
    }
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const act = async (id: number, action: 'approve' | 'reject' | 'delete') => {
    await adminModerate(token, id, action).catch((e) => setMsg(`出错：${e}`))
    setItems((xs) => xs.filter((x) => x.id !== id))
  }

  return (
    <div className="show admin" lang="zh">
      <SubTop active="" />
      <div className="admin-body">
        <h1 className="tk-h2">留言审核</h1>
        {!apiEnabled && <p className="wall-status">VITE_API_BASE 未配置。</p>}
        <form
          className="admin-login"
          onSubmit={(e) => {
            e.preventDefault()
            load()
          }}
        >
          <input
            className="wall-input"
            type="password"
            value={token}
            placeholder="ADMIN_TOKEN"
            onChange={(e) => setToken(e.target.value)}
          />
          <button className="wall-send" type="submit">
            载入待审
          </button>
          <span className="wall-status">{msg}</span>
        </form>
        <ul className="admin-list">
          {items.map((it) => (
            <li key={it.id} className="admin-item">
              <span className="admin-emoji">{STICKER_SET.find((s) => s.id === it.sticker)?.emoji}</span>
              <div className="admin-text">
                <strong>{it.nick}</strong>
                <span>{it.text}</span>
                <small>{new Date(it.created_at).toLocaleString()}</small>
              </div>
              <div className="admin-actions">
                <button className="wall-send" onClick={() => act(it.id, 'approve')}>
                  通过
                </button>
                <button className="cv-btn is-ghost" onClick={() => act(it.id, 'reject')}>
                  拒绝
                </button>
                <button className="cv-btn is-ghost" onClick={() => act(it.id, 'delete')}>
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
