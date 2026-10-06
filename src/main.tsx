import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Showcase from './ui/Showcase'
import ResumePage from './ui/ResumePage'
import AdminPage from './ui/AdminPage'
import { SHOWCASE } from './data/showcase'
import { useStore } from './store'
import './styles.css'

// hash 路由：'' 主页；'studio' / 'lab' 子页面覆盖在主页之上（主页保持挂载、停帧，返回时滚动位置原样保留）
function Root() {
  const route = useStore((s) => s.route)
  useEffect(() => {
    document.body.style.overflow = route ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [route])
  return (
    <>
      <App hidden={!!route} />
      {route === 'resume' ? (
        <ResumePage />
      ) : route === 'admin' ? (
        <AdminPage />
      ) : route ? (
        <Showcase key={route} page={SHOWCASE[route]} />
      ) : null}
    </>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
