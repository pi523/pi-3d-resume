// 按 y 切片统计网格宽度/深度，用于定位头、脖子、肩。用法: node tools/slices.mjs <model.glb> [nodeName]
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
const doc = await io.read(process.argv[2])
// 遍历场景节点，按各自世界矩阵把顶点变换到世界坐标（站立姿态）
const pos = []
const visit = (node) => {
  const mesh = node.getMesh()
  if (mesh) {
    const m = node.getWorldMatrix()
    for (const p of mesh.listPrimitives()) {
      const a = p.getAttribute('POSITION')
      const arr = a.getArray()
      for (let i = 0; i < arr.length; i += 3) {
        const x = arr[i], y = arr[i + 1], z = arr[i + 2]
        pos.push([
          m[0] * x + m[4] * y + m[8] * z + m[12],
          m[1] * x + m[5] * y + m[9] * z + m[13],
          m[2] * x + m[6] * y + m[10] * z + m[14],
        ])
      }
    }
  }
  node.listChildren().forEach(visit)
}
for (const s of doc.getRoot().listScenes()) s.listChildren().forEach(visit)
let minY = Infinity, maxY = -Infinity
for (const p of pos) { minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]) }
const BINS = 40
const bins = Array.from({ length: BINS }, () => ({ xmin: Infinity, xmax: -Infinity, zmin: Infinity, zmax: -Infinity, n: 0 }))
for (const [x, y, z] of pos) {
  const b = bins[Math.min(BINS - 1, Math.floor(((y - minY) / (maxY - minY)) * BINS))]
  b.xmin = Math.min(b.xmin, x); b.xmax = Math.max(b.xmax, x)
  b.zmin = Math.min(b.zmin, z); b.zmax = Math.max(b.zmax, z)
  b.n++
}
console.log(`height ${minY.toFixed(3)} .. ${maxY.toFixed(3)}`)
console.log('   y      width  depth   zmin..zmax')
bins.forEach((b, i) => {
  if (!b.n) return
  const y = minY + ((i + 0.5) / BINS) * (maxY - minY)
  const w = b.xmax - b.xmin, d = b.zmax - b.zmin
  console.log(`${y.toFixed(3)}  ${w.toFixed(3)}  ${d.toFixed(3)}  ${b.zmin.toFixed(2)}..${b.zmax.toFixed(2)}  ${'#'.repeat(Math.round(w * 40))}`)
})
