// 把 Sen 的 me.glb 中的人物网格换成新形象，保留相机动画与 focus 锚点。
// 用法: node tools/merge.mjs <sen-me.glb> <avatar.glb> <out.glb> [rotYdeg] [scale] [ty] [tz]
// 缺省按整体身高对齐；传入 scale/ty/tz 可手动覆盖（用于头部对齐等）
import { NodeIO, getBounds } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { mergeDocuments, prune, dedup, unpartition } from '@gltf-transform/functions'

const [senPath, avatarPath, outPath, rotYdeg = '0', argScale, argTy, argTz] = process.argv.slice(2)
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)

const doc = await io.read(senPath)
const root = doc.getRoot()
const man = root.listNodes().find((n) => n.getName() === 'man')
if (!man) throw new Error('man node not found')

// 1) 摘掉眼睛和贴纸（保留 focus-* 空锚点）
for (const child of [...man.listChildren()]) {
  const name = child.getName()
  if (/^eye|^sticker/.test(name)) child.dispose()
}

// 2) 记录 Sen 身体包围盒（此时 man 还挂着原网格）
const senB = getBounds(man)
console.log('sen bbox', senB)

// 3) 卸下 Sen 的身体网格
man.setMesh(null)

// 4) 合并新形象文档
const avatarDoc = await io.read(avatarPath)
mergeDocuments(doc, avatarDoc)
const scenes = root.listScenes()
const avatarScene = scenes[scenes.length - 1]
const avatarNode = avatarScene.listChildren()[0]
const avB = getBounds(avatarNode)
console.log('avatar bbox', avB)

// 5) 按身高对齐：脚贴地、水平居中，缩放到 Sen 的身高
const senH = senB.max[1] - senB.min[1]
const avH = avB.max[1] - avB.min[1]
const s = argScale !== undefined ? parseFloat(argScale) : senH / avH
const cx = (senB.max[0] + senB.min[0]) / 2 - ((avB.max[0] + avB.min[0]) / 2) * s
const cz = argTz !== undefined ? parseFloat(argTz) : (senB.max[2] + senB.min[2]) / 2 - ((avB.max[2] + avB.min[2]) / 2) * s
const cy = argTy !== undefined ? parseFloat(argTy) : senB.min[1] - avB.min[1] * s
avatarNode.setScale([s, s, s])
avatarNode.setTranslation([cx, cy, cz])
// 追加 Y 轴旋转时与模型原有旋转复合（模型可能靠自身旋转“站立”，不可覆盖）
const rad = (parseFloat(rotYdeg) * Math.PI) / 180
const [qx, qy, qz, qw] = avatarNode.getRotation()
const ry = Math.sin(rad / 2), rw = Math.cos(rad / 2)
avatarNode.setRotation([
  rw * qx + ry * qz,
  rw * qy + ry * qw,
  rw * qz - ry * qx,
  rw * qw - ry * qy,
])
avatarNode.setName('body')
console.log(`scale=${s.toFixed(3)} t=[${cx.toFixed(3)},${cy.toFixed(3)},${cz.toFixed(3)}] rotY=${rotYdeg}`)

// 6) 挂到 man 容器下（继承 manAction 的待机动画），清理多余场景
man.addChild(avatarNode)
avatarScene.dispose()
await doc.transform(prune({ keepLeaves: true, keepExtras: true }), dedup(), unpartition())
await io.write(outPath, doc)
console.log('written:', outPath)
