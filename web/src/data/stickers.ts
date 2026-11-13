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
  // 全部贴脸，避开眉眼鼻嘴。贴纸按相机站点分布：
  //   站 1 NTU / 站 2 Lobah 的机位看的是右脸颊 → 右脸贴 NTU + Lobah
  //   站 3 德赛 / 站 4 A*STAR 看左脸颊 → 左脸贴 Desay + 小车 + A*STAR
  //   站 5 奇绩是正面全景 → 奇绩贴右脸颊下方，正面可见
  // （槽位坐标沿用之前 pick 出来的 6 个位置，只换图；右下槽位是左下槽位的 x 镜像）

  // —— 右脸颊（站 1、2）——
  // NTU 校徽：右脸颊中部
  { img: 'stickers/ntu-shield.png', p: [0.176, 0.3, 0.268], n: [0.179, -0.205, 0.962], size: 0.04, roll: 8 },
  // Lobah Play：右脸颊外侧（站 2 的极侧面机位只看得到这一槽）
  { img: 'stickers/lobah.png', p: [0.214, 0.36, 0.248], n: [0.5, -0.05, 0.87], size: 0.045, roll: 8 },
  // 奇绩创坛：右脸颊下方靠外（pick 自 debug 正面机位；原 x=0.028 槽位贴到嘴角上了）
  { img: 'stickers/miracleplus.png', p: [0.168, 0.296, 0.249], n: [0.438, -0.586, 0.682], size: 0.034, roll: 8 },

  // —— 左脸颊（站 3、4）——
  // Desay SV：左脸颊苹果肌
  { img: 'stickers/desaysv.png', p: [-0.062, 0.338, 0.242], n: [-0.4, -0.25, 0.88], size: 0.04, roll: -6 },
  // 自动驾驶小车（德赛）：左脸颊下方靠外、避开嘴角（pick 自 debug 正面机位）
  { img: 'stickers/autodrive.png', p: [-0.052, 0.312, 0.237], n: [-0.55, -0.445, 0.707], size: 0.038, roll: -8 },
  // A*STAR：左脸颊外侧偏下
  { img: 'stickers/astar.png', p: [-0.099, 0.333, 0.204], n: [-0.845, -0.265, 0.465], size: 0.04, roll: -5 },

  // MBTI 大宝剑哥（个人）：右脸颊正面偏上
  { img: 'stickers/mbti-sword.png', p: [0.168, 0.352, 0.272], n: [0.22, 0.151, 0.964], size: 0.038, roll: 5 },
]
