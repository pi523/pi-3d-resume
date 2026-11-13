import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
const doc = await io.read(process.argv[2])
const root = doc.getRoot()

function walk(node, depth) {
  const mesh = node.getMesh()
  const cam = node.getCamera()
  const t = node.getTranslation().map((v) => +v.toFixed(2))
  const s = node.getScale().map((v) => +v.toFixed(2))
  const tags = []
  if (mesh) tags.push(`MESH(${mesh.listPrimitives().reduce((n, p) => n + (p.getAttribute('POSITION')?.getCount() ?? 0), 0)}v)`)
  if (cam) tags.push('CAMERA')
  const ud = node.getExtras()
  const udStr = ud && Object.keys(ud).length ? ` extras=${JSON.stringify(ud)}` : ''
  console.log(`${'  '.repeat(depth)}- ${node.getName() || '(unnamed)'} ${tags.join(' ')} t=[${t}] s=[${s}]${udStr}`)
  for (const c of node.listChildren()) walk(c, depth + 1)
}

for (const scene of root.listScenes()) {
  console.log(`SCENE: ${scene.getName()}`)
  for (const n of scene.listChildren()) walk(n, 1)
}
console.log('\nANIMATIONS:')
for (const a of root.listAnimations()) {
  const targets = new Set(a.listChannels().map((c) => `${c.getTargetNode()?.getName()}(${c.getTargetPath()})`))
  console.log(`- ${a.getName()}: ${[...targets].join(', ')}`)
}
