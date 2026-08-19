// React Bits <Ferrofluid /> 的场景内移植：着色器原样照搬，画在包裹相机的背景球上（替代旧 GradientBackground）。
// 不走独立 DOM/ogl 画布：透明 R3F 画布 + EffectComposer(DoF/Bloom) 的 alpha 合成会在人物周围产生灰白晕圈，
// 在场景内以不透明背景渲染则后处理管线完全不受影响。
import { useMemo, useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// 与 reactbits 用法一致的参数（colors=#EC4899、down、mouse spike 开启）
const CONFIG = {
  colors: ['#EC4899', '#EC4899', '#EC4899'],
  background: '#0a0e16', // 流体画布下的站点底色（原 DOM 方案里由 body 提供）
  speed: 0.5,
  scale: 1,
  turbulence: 1,
  fluidity: 0.1,
  rimWidth: 0.2,
  sharpness: 3,
  shimmer: 1,
  glow: 2,
  flow: [0, -1] as [number, number], // down
  opacity: 1,
  mouseInteraction: true,
  mouseStrength: 1,
  mouseRadius: 0.3,
  mouseDampening: 0.15,
}

const MAX_COLORS = 8

const fragment = /* glsl */ `
uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

uniform vec3  uBackground;
uniform vec2  uFlow;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;

#define PI 3.14159265

vec3 palette(float h) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}

float hash(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float smin(float a, float b, float k) {
  float r = exp2(-a / k) + exp2(-b / k);
  return -k * log2(r);
}

float sinlerp(float a, float b, float w) {
  return mix(a, b, (sin(w * PI - PI / 2.0) + 1.0) / 2.0);
}

float vn(vec2 p, float s, float seed) {
  vec2 cellp = floor(p / s);
  vec2 relp = mod(p, s);
  float g1 = hash(vec3(cellp, seed));
  float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
  float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));
  float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
  float bx = sinlerp(g1, g2, relp.x / s);
  float tx = sinlerp(g4, g3, relp.x / s);
  return sinlerp(bx, tx, relp.y / s);
}

float dbn(vec2 p, float s, float seed) {
  float o = s / 2.0;
  float n0 = vn(p, s, seed);
  float n1 = vn(p + vec2(o, o), s, seed + 0.1);
  float n2 = vn(p + vec2(-o, o), s, seed + 0.2);
  float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
  float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  float ref = 700.0 / max(uScale, 0.05);
  vec2 p = fragCoord / iResolution.y * ref;

  float spd = 200.0 * uSpeed;
  float t = iTime;

  vec2 dir = uFlow;
  vec2 perp = vec2(-dir.y, dir.x);

  float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
  float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;

  float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
  float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);

  float mapeaks = smin(peaks, peaks2, max(uFluidity, 0.001));

  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mp = iMouse / iResolution.y * ref;
    float md = length(p - mp) / ref;
    float rr = max(uMouseRadius, 0.02);
    mGlow = exp(-md * md / (rr * rr)) * uMouseStrength;
  }

  float band = (uRimWidth - abs((mapeaks - 0.4) * 2.0)) * 5.0;
  float ltn = clamp(band - vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer, 0.0, 1.0);
  ltn = pow(ltn, uSharpness) * uGlow;
  ltn *= clamp(1.0 - mGlow, 0.0, 1.0);

  float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);
  vec3 col = palette(h);

  vec3 outc = col * ltn;
  float a = clamp(max(outc.r, max(outc.g, outc.b)), 0.0, 1.0) * uOpacity;
  // 原组件输出带 alpha 的 DOM 画布、由浏览器叠到深色 body 上；场景内直接完成同款合成，输出不透明
  gl_FragColor = vec4(mix(uBackground, outc, a), 1.0);
}
`

const vertex = /* glsl */ `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export default function FerrofluidBackground() {
  const gl = useThree((s) => s.gl)

  const uniforms = useMemo(() => {
    const cols = CONFIG.colors.slice(0, MAX_COLORS)
    const at = (i: number) => new THREE.Color(cols[Math.min(i, cols.length - 1)])
    return {
      iResolution: { value: new THREE.Vector3(1, 1, 1) },
      iMouse: { value: new THREE.Vector2(0, 0) },
      iTime: { value: 0 },
      uColor0: { value: at(0) },
      uColor1: { value: at(1) },
      uColor2: { value: at(2) },
      uColor3: { value: at(3) },
      uColor4: { value: at(4) },
      uColor5: { value: at(5) },
      uColor6: { value: at(6) },
      uColor7: { value: at(7) },
      uColorCount: { value: cols.length },
      uBackground: { value: new THREE.Color(CONFIG.background) },
      uFlow: { value: new THREE.Vector2(...CONFIG.flow) },
      uSpeed: { value: CONFIG.speed },
      uScale: { value: CONFIG.scale },
      uTurbulence: { value: CONFIG.turbulence },
      uFluidity: { value: CONFIG.fluidity },
      uRimWidth: { value: CONFIG.rimWidth },
      uSharpness: { value: CONFIG.sharpness },
      uShimmer: { value: CONFIG.shimmer },
      uGlow: { value: CONFIG.glow },
      uOpacity: { value: CONFIG.opacity },
      uMouseEnabled: { value: CONFIG.mouseInteraction ? 1 : 0 },
      uMouseStrength: { value: CONFIG.mouseStrength },
      uMouseRadius: { value: CONFIG.mouseRadius },
    }
  }, [])

  // 鼠标磁吸尖峰：window 级监听（内容层盖在画布上，画布收不到事件），坐标转 drawingBuffer 像素、原点左下
  const mouseTarget = useRef<[number, number]>([0, 0])
  useEffect(() => {
    if (!CONFIG.mouseInteraction) return
    const onMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      const dpr = gl.getPixelRatio()
      mouseTarget.current = [
        (e.clientX - rect.left) * dpr,
        (rect.height - (e.clientY - rect.top)) * dpr,
      ]
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [gl])

  useFrame((state, dt) => {
    uniforms.iTime.value = state.clock.elapsedTime
    const ctx = gl.getContext()
    uniforms.iResolution.value.set(ctx.drawingBufferWidth, ctx.drawingBufferHeight, 1)
    // 与原组件相同的指针缓动（mouseDampening 为时间常数）
    const tau = Math.max(1e-4, CONFIG.mouseDampening)
    let f = 1 - Math.exp(-dt / tau)
    if (f > 1) f = 1
    const m = uniforms.iMouse.value
    m.x += (mouseTarget.current[0] - m.x) * f
    m.y += (mouseTarget.current[1] - m.y) * f
  })

  return (
    <mesh scale={100}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
      />
    </mesh>
  )
}
