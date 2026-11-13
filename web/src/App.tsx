import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import * as THREE from 'three'
import Scene from './scene/Scene'
import Lanyard from './ui/Lanyard'
import { makeLanyardImages, type LanyardImages } from './ui/lanyardCard'
import NoiseOverlay from './ui/NoiseOverlay'
import Resume, { CONTACT_LINKS } from './ui/Resume'
import ChapterNav from './ui/ChapterNav'
import { SOCIAL_ICONS } from './ui/SocialIcons'
import Works from './ui/Works'
import LoadingScreen from './ui/LoadingScreen'
import Finale from './ui/Finale'
import StickerWall from './ui/StickerWall'
import CatHotspot from './ui/CatHotspot'
import { useStore, type Lang } from './store'

function Backdrop() {
  // 点击空白处收起详情
  const setActive = useStore((s) => s.setActive)
  return (
    <mesh position={[0, 0, -40]} onClick={() => setActive(null)}>
      <planeGeometry args={[600, 300]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}


// About 文案已移到左侧工牌卡面（lanyardCard.ts），首屏只留底部滚动提示
function Hero({ lang, cueOpacity }: { lang: Lang; cueOpacity: MotionValue<number> }) {
  return (
    <section className="hero">
      <motion.div className="scroll-cue" style={{ opacity: cueOpacity }} aria-hidden="true">
        <span className="scroll-cue-label">{lang === 'en' ? 'SCROLL' : '向下滚动'}</span>
        <span className="scroll-cue-track">
          <span className="scroll-cue-dot" />
        </span>
      </motion.div>
    </section>
  )
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="site-footer" lang={lang}>
      <span className="site-footer-line">{lang === 'en' ? 'Say hi' : '找我聊聊'}</span>
      <div className="site-footer-links">
        {CONTACT_LINKS.map((l) => {
          const Icon = SOCIAL_ICONS[l.id as keyof typeof SOCIAL_ICONS]
          return (
            <a
              key={l.id}
              className="site-footer-link"
              href={l.href}
              target={l.href.startsWith('#') ? undefined : '_blank'}
              rel={l.href.startsWith('#') ? undefined : 'noopener noreferrer'}
              aria-label={l.label}
              title={l.label}
            >
              <Icon />
              <span>{l.label}</span>
            </a>
          )
        })}
      </div>
      <span className="site-footer-copy">© 2026 Enge Lou</span>
    </footer>
  )
}

function LangToggle({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  return (
    <button className="lang-toggle" onClick={onToggle} aria-label="切换语言 / Switch language">
      {lang === 'en' ? '中文' : 'EN'}
    </button>
  )
}

// 昼夜切换：与语言按钮同款，放其左侧。图标：深色模式下显示太阳（点了变亮），反之月亮
function ThemeToggle() {
  const theme = useStore((s) => s.theme)
  const toggle = useStore((s) => s.toggleTheme)
  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === 'dark' ? '切换到浅色 / Light mode' : '切换到深色 / Dark mode'}
      title={theme === 'dark' ? 'Light' : 'Dark'}
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  )
}

export default function App({ hidden = false }: { hidden?: boolean }) {
  // 语言在 store 里（子页面共用）；hidden = 子页面覆盖在上面时，停掉 3D 帧循环省 GPU
  const lang = useStore((s) => s.lang)
  const toggleLang = useStore((s) => s.toggleLang)
  const { scrollY } = useScroll()
  // 作品区蒙层：以作品区顶部从视口底进入到视口中部的进度，驱动 3D 渐暗 + 模糊
  const worksRef = useRef(null)
  const { scrollYProgress: worksProgress } = useScroll({
    target: worksRef,
    offset: ['start end', 'start center'],
  })
  // 蒙层颜色随主题：深色压暗、浅色提亮（与 --bg 同色系）
  const theme = useStore((s) => s.theme)
  const fogRgb = theme === 'light' ? '243, 239, 232' : '8, 11, 18'
  const fogBg = useTransform(
    worksProgress,
    [0, 1],
    [`rgba(${fogRgb}, 0)`, `rgba(${fogRgb}, 0.41)`] // 压暗减半（原 0.82）
  )
  const fogBlur = useTransform(worksProgress, [0, 1], ['blur(0px)', 'blur(10px)'])
  // 滚动渐暗：离开首屏后压暗 3D 场景，保证履历文字可读
  const scrimOpacity = useTransform(scrollY, [0, 520], [0, 0.4])
  // 首屏滚动提示随之淡出
  const cueOpacity = useTransform(scrollY, [0, 160], [1, 0])
  // 首屏底部渐变底色：开始滑动后淡出
  const heroGradientOpacity = useTransform(scrollY, [0, 240], [1, 0])
  // 磨砂右轨：进入履历区后淡入（首屏不磨砂）
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const railOpacity = useTransform(scrollY, [vh * 0.5, vh * 1.1], [0, 1])
  // 首屏装饰画框/角标：滚动后淡出
  const heroChromeOpacity = useTransform(scrollY, [0, 280], [1, 0])

  // 左侧工牌挂绳：卡面贴图运行时按语言生成；滚动时与 about 文字同步淡出+模糊
  const [lanyardImages, setLanyardImages] = useState<LanyardImages | null>(null)
  useEffect(() => {
    let alive = true
    makeLanyardImages(lang).then((imgs) => {
      if (alive) setLanyardImages(imgs)
    })
    return () => {
      alive = false
    }
  }, [lang])
  const lanyardOpacity = useTransform(scrollY, [vh * 0.15, vh * 0.45], [1, 0])
  const lanyardBlur = useTransform(scrollY, [vh * 0.15, vh * 0.45], ['blur(0px)', 'blur(16px)'])
  // 淡出后关掉指针事件，避免透明画布挡住下方内容。
  // 注意：r3f Canvas 容器 div 内联 pointer-events:auto，会击穿父层的 none，
  // 所以用 class + CSS !important 覆盖整棵子树（见 styles.css .lanyard-overlay.is-off）
  const [lanyardOff, setLanyardOff] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setLanyardOff(v > vh * 0.45))
  // 画布全屏：宽屏用相机 x 偏移把卡片推到人物左侧，窄屏居中且拉远些
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  )
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      {/* 加载遮罩：模型全部加载完成前覆盖全屏，完成后淡出 */}
      {!hidden && <LoadingScreen />}

      {/* 固定的 3D 背景（铁磁流体背景在场景内：scene/FerrofluidBackground.tsx） */}
      <div className="scene-bg">
        <Canvas
          frameloop={hidden ? 'never' : 'always'}
          shadows={{ type: THREE.PCFShadowMap }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 5, 19], fov: 39, near: 0.1, far: 500 }}
          gl={{ antialias: false, stencil: false, depth: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <Suspense fallback={null}>
            <Backdrop />
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* 滚动渐暗蒙层 */}
      <motion.div className="scrim" style={{ opacity: scrimOpacity }} aria-hidden="true" />

      {/* 作品区固定蒙层：仅压暗（减半），模糊先注释掉 */}
      <motion.div
        className="stage-fog"
        style={{ background: fogBg /* , backdropFilter: fogBlur, WebkitBackdropFilter: fogBlur */ }}
        aria-hidden="true"
      />

      {/* 固定磨砂右轨（进入履历区淡入） */}
      <motion.div className="glass-rail" style={{ opacity: railOpacity }} aria-hidden="true" />

      {/* 首屏底部渐变底色，滚动后淡出 —— 暂时注释查看效果 */}
      {/* <motion.div
        className="hero-gradient"
        style={{ opacity: heroGradientOpacity }}
        aria-hidden="true"
      /> */}

      {!hidden && (
        <>
          <LangToggle lang={lang} onToggle={toggleLang} />
          <ThemeToggle />
        </>
      )}

      {/* 章节索引：左下角，离开首屏后淡入（接替 hero-chrome 的角标位置） */}
      {!hidden && <ChapterNav lang={lang} />}
      <CatHotspot lang={lang} />

      {/* 首屏装饰：发丝内框 + 四角定位标 + 角标元数据（随滚动淡出） */}
      <motion.div className="hero-chrome" style={{ opacity: heroChromeOpacity }} aria-hidden="true">
        <div className="hero-frame" />
        <span className="hero-mark tl">+</span>
        <span className="hero-mark tr">+</span>
        <span className="hero-mark bl">+</span>
        <span className="hero-mark br">+</span>
        <div className="hero-meta hm-tl">
          <span className="hm-name">Enge</span>
          <span>
            {lang === 'zh'
              ? '应用型 AI Agent 开发者 / 南洋理工大学 AI 硕士'
              : 'Applied AI Agent Developer / MSc AI, NTU'}
          </span>
        </div>
        <div className="hero-meta hm-tr">Portfolio — 2026</div>
        <div className="hero-meta hm-bl">Code · Art · Play</div>
        <div className="hero-meta hm-right">Based in Singapore</div>
      </motion.div>

      {/* 物理工牌挂绳（可拖拽）：全屏画布、卡片停在人物左侧，滚动时淡出 */}
      {lanyardImages && !hidden && (
        <motion.div
          className={`lanyard-overlay${lanyardOff ? ' is-off' : ''}`}
          style={{ opacity: lanyardOpacity, filter: lanyardBlur }}
        >
          <Lanyard
            key={lang}
            position={narrow ? [0, 0, 20] : [0, 0, 15]}
            offsetX={narrow ? 0 : -2.4}
            gravity={[0, -40, 0]}
            frontImage={lanyardImages.front}
            backImage={lanyardImages.back}
            lanyardImage={lanyardImages.band}
            lanyardWidth={1}
          />
        </motion.div>
      )}

      {/* 全屏胶片噪点蒙层（multiply 混合） */}
      <NoiseOverlay />

      {/* 可滚动内容 */}
      <main className="content">
        <Hero lang={lang} cueOpacity={cueOpacity} />
        <Resume lang={lang} />
        <Works lang={lang} innerRef={worksRef} />
        <StickerWall lang={lang} />
        <Finale lang={lang} />
        <Footer lang={lang} />
      </main>
    </>
  )
}
