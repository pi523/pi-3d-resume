import { useEffect, useRef, useState } from 'react'

// 蓝幕抠像视频：<video> 解码 → WebGL 逐帧上传纹理 → 片元着色器按 YCbCr 距离把纯蓝 (#0000FF) 抠成透明，
// 并做去溢色（边缘蓝边压掉）。画布输出带 alpha，直接叠在任何背景上。
// 文件不存在（HEAD 404）时什么都不渲染——所以片段还没生成时页面照常。
//
// props:
//   src        public/ 下的 mp4 路径（已含 BASE_URL）
//   keyColor   被抠的颜色，默认纯蓝
//   similarity 判定为背景的色距阈值（0–1，越大抠得越狠）
//   smoothness 过渡软边宽度
//   spill      去溢色强度
//   active     false 时暂停播放（离开视口省电）
interface Props {
  src: string
  className?: string
  keyColor?: [number, number, number]
  similarity?: number
  smoothness?: number
  spill?: number
  active?: boolean
  loop?: boolean
}

const VERT = `
attribute vec2 p;
varying vec2 v;
void main(){ v = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5); gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `
precision mediump float;
varying vec2 v;
uniform sampler2D tex;
uniform vec3 keyRGB;
uniform float similarity;
uniform float smoothness;
uniform float spill;
vec2 cc(vec3 c){ return vec2(-0.1687*c.r - 0.3313*c.g + 0.5*c.b, 0.5*c.r - 0.4187*c.g - 0.0813*c.b); }
void main(){
  vec4 c = texture2D(tex, v);
  float d = distance(cc(c.rgb), cc(keyRGB));
  float a = smoothstep(similarity, similarity + smoothness, d);
  // 去溢色：把残留的 key 色分量压向其它两通道的均值
  float keyAmt = 1.0 - smoothstep(similarity, similarity + spill, d);
  vec3 rgb = c.rgb;
  float other = (rgb.r + rgb.g) * 0.5;
  rgb.b = mix(rgb.b, min(rgb.b, other), keyAmt);
  gl_FragColor = vec4(rgb * a, a);
}`

export default function KeyedVideo({
  src,
  className,
  keyColor = [0, 0, 1],
  similarity = 0.3,
  smoothness = 0.08,
  spill = 0.12,
  active = true,
  loop = true,
}: Props) {
  const [exists, setExists] = useState<boolean | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 文件存在性探测：不存在就不渲染（片段尚未生成时站点不受影响）
  useEffect(() => {
    let alive = true
    fetch(src, { method: 'HEAD' })
      .then((r) => alive && setExists(r.ok && !(r.headers.get('content-type') || '').includes('text/html')))
      .catch(() => alive && setExists(false))
    return () => {
      alive = false
    }
  }, [src])

  useEffect(() => {
    if (!exists) return
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true })
    if (!gl) return

    const mk = (type: number, s: string) => {
      const sh = gl.createShader(type)!
      gl.shaderSource(sh, s)
      gl.compileShader(sh)
      return sh
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.uniform3fv(gl.getUniformLocation(prog, 'keyRGB'), keyColor)
    gl.uniform1f(gl.getUniformLocation(prog, 'similarity'), similarity)
    gl.uniform1f(gl.getUniformLocation(prog, 'smoothness'), smoothness)
    gl.uniform1f(gl.getUniformLocation(prog, 'spill'), spill)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)

    let raf = 0
    const draw = () => {
      if (video.readyState >= 2) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          gl.viewport(0, 0, canvas.width, canvas.height)
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [exists, keyColor, similarity, smoothness, spill])

  // 进出视口：播放 / 暂停
  useEffect(() => {
    const video = videoRef.current
    if (!video || !exists) return
    if (active) video.play().catch(() => {})
    else video.pause()
  }, [active, exists])

  if (!exists) return null
  return (
    <div className={`keyed-video${className ? ' ' + className : ''}`}>
      <video ref={videoRef} src={src} muted playsInline loop={loop} preload="auto" crossOrigin="anonymous" />
      <canvas ref={canvasRef} />
    </div>
  )
}
