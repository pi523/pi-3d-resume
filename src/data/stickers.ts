// 人物贴纸配置：贴在模型表面的透明 PNG 小平面（免 Blender）。
// 坐标在 man 本地系。取坐标方法：npm run dev 后打开 /debug.html，
// 点击模型表面，把面板输出的行复制进 STICKERS 即可。
//   img  public/ 下的图片路径
//   p    贴纸中心位置   n  表面法线（朝外）
//   size 边长           roll 绕法线旋转角度（度）
// 渲染用 DecalGeometry 贴花投影（Scene.tsx）：网格直接裹在脸部曲面上，无需抬升/弯曲参数
export interface Sticker {
  img: string
  p: [number, number, number]
  n: [number, number, number]
  size: number
  roll: number
}

export const STICKERS: Sticker[] = [
  // 全部贴脸，避开眉眼鼻嘴；贴纸片带曲率贴合（curve），法线在 pick 基础上略偏正面
  // MBTI 大宝剑哥（低多边形骑士）：左脸颊苹果肌
  { img: 'stickers/mbti-sword.png', p: [-0.062, 0.338, 0.242], n: [-0.4, -0.25, 0.88], size: 0.055, roll: -6 },
  // 奇绩创坛：左脸颊下方（骑士斜下）
  { img: 'stickers/miracleplus.png', p: [-0.028, 0.288, 0.238], n: [-0.25, -0.3, 0.92], size: 0.035, roll: -8 },
  // 自动驾驶小车：右脸颊外侧
  { img: 'stickers/autodrive.png', p: [0.214, 0.36, 0.248], n: [0.5, -0.05, 0.87], size: 0.05, roll: 8 },
  // Desay SV：右脸颊中部（原始 pick 法线，未手调，避免陷进曲面）
  { img: 'stickers/desaysv.png', p: [0.176, 0.3, 0.268], n: [0.179, -0.205, 0.962], size: 0.035, roll: 8 },
  // NTU 校徽（真实盾徽）：左脸颊外侧偏下（明确低于眼睛，原始 pick 法线）
  { img: 'stickers/ntu-shield.png', p: [-0.099, 0.333, 0.204], n: [-0.845, -0.265, 0.465], size: 0.04, roll: -5 },
  // A*STAR：右脸颊正面偏下（x 太外会被鬓角挡住，明确低于眼睛）
  { img: 'stickers/astar.png', p: [0.168, 0.352, 0.272], n: [0.22, 0.151, 0.964], size: 0.038, roll: 5 },
]
