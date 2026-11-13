import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f)
  console.log('====', f)
  for (const n of doc.getRoot().listNodes()) {
    const r = n.getRotation().map((v) => +v.toFixed(3))
    const t = n.getTranslation().map((v) => +v.toFixed(3))
    const s = n.getScale().map((v) => +v.toFixed(3))
    console.log(`${n.getName()}: t=[${t}] r=[${r}] s=[${s}]`)
  }
  const cam = doc.getRoot().listCameras()[0]
  if (cam) console.log('camera yfov(rad):', cam.getYFov()?.toFixed(4))
  for (const a of doc.getRoot().listAnimations()) {
    if (a.getName() !== 'CameraAction') continue
    for (const ch of a.listChannels()) {
      if (ch.getTargetPath() !== 'translation') continue
      const out = ch.getSampler().getOutput().getArray()
      console.log(`CameraAction 首帧 t=[${[...out.slice(0, 3)].map((v) => v.toFixed(3))}] 末帧 t=[${[...out.slice(-3)].map((v) => v.toFixed(3))}]`)
    }
  }
}
