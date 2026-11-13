import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 打包后资源用相对路径（dist/index.html 引用 ./assets/...，可放任意子目录/直接打开）
  base: './',
  plugins: [react()],
  server: { host: true, port: 5173 },
  build: {
    rollupOptions: {
      output: {
        // 按库拆 vendor chunk：单文件变小（本机网络传不动 >4MB 的包），
        // 且改业务代码时 three/react 等 chunk 的 hash 不变，部署只需上传小的业务包
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return
          if (id.includes('/three/') || id.includes('three.module')) return 'three'
          if (id.includes('@react-three') || id.includes('meshline') || id.includes('postprocessing')) return 'r3f'
          if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype') ||
              id.includes('mdast') || id.includes('hast') || id.includes('micromark') ||
              id.includes('unified') || id.includes('unist') || id.includes('vfile')) return 'markdown'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('rapier')) return 'rapier'
          if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('scheduler')) return 'react'
          return 'vendor'
        },
      },
    },
  },
})
