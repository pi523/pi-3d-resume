// 猫在屏幕上的投影位置（Scene.tsx 每帧写、ui/CatHotspot.tsx 用 rAF 读）。
// 走可变对象而不是 React state：每帧更新不触发重渲染。
export const catTrack = {
  x: 0, // 视口像素
  y: 0,
  on: false, // 在视口内且在相机前方
  scale: 1, // 随距离缩放热区（相机近时猫更大）
}
