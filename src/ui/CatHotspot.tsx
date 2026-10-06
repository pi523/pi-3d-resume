import { useEffect, useRef, useState } from 'react'
import { catTrack } from '../scene/catTrack'
import { apiEnabled, getPetCount, pet } from '../lib/api'
import { useStore } from '../store'

// 摸猫：跟着猫的屏幕投影走的一个圆形热区（Scene 每帧写 catTrack）。
// 点一下 = 摸一下：冒一个 "+1 喵"、全站计数 +1（后端未配置时只在本地计数）。
// 计数文案钉在热区旁边；首屏和末站（正面）时猫在画面里才出现。
export default function CatHotspot({ lang }: { lang: 'en' | 'zh' }) {
  const hidden = useStore((s) => !!s.route)
  const ref = useRef<HTMLButtonElement>(null)
  const [count, setCount] = useState<number | null>(null)
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([])
  const local = useRef(0)

  useEffect(() => {
    if (!apiEnabled) return
    getPetCount().then((r) => setCount(r.count)).catch(() => {})
  }, [])

  // 每帧把热区搬到猫的位置（不走 React state）
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const el = ref.current
      if (el) {
        const on = catTrack.on && !hidden
        el.style.opacity = on ? '1' : '0'
        el.style.pointerEvents = on ? 'auto' : 'none'
        el.style.transform = `translate(${catTrack.x}px, ${catTrack.y}px) translate(-50%, -50%) scale(${catTrack.scale})`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [hidden])

  const onPet = (e: React.MouseEvent) => {
    const id = Date.now() + Math.random()
    setPops((p) => [...p, { id, x: e.clientX, y: e.clientY }])
    setTimeout(() => setPops((p) => p.filter((q) => q.id !== id)), 900)
    local.current += 1
    if (apiEnabled) {
      pet()
        .then((r) => setCount(r.count))
        .catch(() => {})
    } else {
      setCount(local.current)
    }
  }

  const label =
    count == null
      ? ''
      : lang === 'zh'
        ? `这只猫已被摸了 ${count.toLocaleString()} 次`
        : `This cat has been petted ${count.toLocaleString()} times`

  return (
    <>
      <button
        ref={ref}
        className="cat-hotspot"
        onClick={onPet}
        aria-label={lang === 'zh' ? '摸猫' : 'Pet the cat'}
        title={lang === 'zh' ? '摸一下' : 'Pet me'}
      >
        <span className="cat-hotspot-ring" />
        {label && <span className="cat-hotspot-label">{label}</span>}
      </button>
      {pops.map((p) => (
        <span key={p.id} className="cat-pop" style={{ left: p.x, top: p.y }}>
          +1 {lang === 'zh' ? '喵' : 'meow'}
        </span>
      ))}
    </>
  )
}
