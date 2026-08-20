import{r as i,j as e,a as jt}from"./react--USnTrUG.js";import{u as ot,a as Ct,b as We,c as Ue,E as St,D as At,B as Mt,S as Rt,e as Et,C as st,P as Nt,d as It,L as De,f as Ze,g as Ye,h as Tt,R as _e,i as Xe,j as Lt,M as Pt,k as Bt,l as _t,m as zt}from"./r3f-6VfoPXxf.js";import{b0 as Wt,aM as Ft,Y as x,V as Ke,C as Qe,h as j,aX as Ot,b1 as Dt,W as Vt,k as Gt,E as Ht,B as $t,M as it,ay as Ut,g as Zt,aw as ft,a$ as Ve,Q as Ae,b2 as Yt,y as Xt,b3 as Jt,b4 as Kt,b5 as Qt,s as qt,D as en,aE as tn,aB as nn}from"./three-yCav81tz.js";import{m as R,u as qe,a as X,A as on,b as sn}from"./motion-EZRZtDhR.js";import{M as rn,r as an,a as ln}from"./markdown-BvfWdjXE.js";import{ak as cn}from"./vendor-B-h-DeAm.js";import"./rapier-CmnDU9Yz.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}})();function un({intensity:t,rotationX:o,rotationY:n,rotationZ:r,asBackground:s,bgIntensity:a,bgBlur:l}){const u=ot(h=>h.scene),m=Ct(Wt,"./textures/env.hdr"),p=i.useRef(null);return i.useEffect(()=>{p.current=u.background},[u]),i.useEffect(()=>(m.mapping=Ft,u.environment=m,()=>{u.environment=null}),[u,m]),i.useEffect(()=>{u.environmentIntensity=t},[u,t]),i.useEffect(()=>{const h=x.degToRad(o),w=x.degToRad(n),b=x.degToRad(r);u.environmentRotation.set(h,w,b),u.backgroundRotation.set(h,w,b)},[u,o,n,r]),i.useEffect(()=>(u.background=s?m:p.current,()=>{u.background=p.current}),[u,m,s]),i.useEffect(()=>{u.backgroundIntensity=a,u.backgroundBlurriness=l},[u,a,l]),null}const T={colors:["#EC4899","#EC4899","#EC4899"],background:"#0a0e16",speed:.5,scale:1,turbulence:1,fluidity:.1,rimWidth:.2,sharpness:3,shimmer:1,glow:2,flow:[0,-1],opacity:1,mouseStrength:1,mouseRadius:.3,mouseDampening:.15},dn=8,mn=`
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
`,pn=`
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;function hn(){const t=ot(r=>r.gl),o=i.useMemo(()=>{const r=T.colors.slice(0,dn),s=a=>new Qe(r[Math.min(a,r.length-1)]);return{iResolution:{value:new j(1,1,1)},iMouse:{value:new Ke(0,0)},iTime:{value:0},uColor0:{value:s(0)},uColor1:{value:s(1)},uColor2:{value:s(2)},uColor3:{value:s(3)},uColor4:{value:s(4)},uColor5:{value:s(5)},uColor6:{value:s(6)},uColor7:{value:s(7)},uColorCount:{value:r.length},uBackground:{value:new Qe(T.background)},uFlow:{value:new Ke(...T.flow)},uSpeed:{value:T.speed},uScale:{value:T.scale},uTurbulence:{value:T.turbulence},uFluidity:{value:T.fluidity},uRimWidth:{value:T.rimWidth},uSharpness:{value:T.sharpness},uShimmer:{value:T.shimmer},uGlow:{value:T.glow},uOpacity:{value:T.opacity},uMouseEnabled:{value:1},uMouseStrength:{value:T.mouseStrength},uMouseRadius:{value:T.mouseRadius}}},[]),n=i.useRef([0,0]);return i.useEffect(()=>{const r=s=>{const a=t.domElement.getBoundingClientRect(),l=t.getPixelRatio();n.current=[(s.clientX-a.left)*l,(a.height-(s.clientY-a.top))*l]};return window.addEventListener("pointermove",r),()=>window.removeEventListener("pointermove",r)},[t]),We((r,s)=>{o.iTime.value=r.clock.elapsedTime;const a=t.getContext();o.iResolution.value.set(a.drawingBufferWidth,a.drawingBufferHeight,1);const l=Math.max(1e-4,T.mouseDampening);let u=1-Math.exp(-s/l);u>1&&(u=1);const m=o.iMouse.value;m.x+=(n.current[0]-m.x)*u,m.y+=(n.current[1]-m.y)*u}),e.jsxs("mesh",{scale:100,children:[e.jsx("sphereGeometry",{args:[1,32,32]}),e.jsx("shaderMaterial",{side:Ot,depthWrite:!1,uniforms:o,vertexShader:pn,fragmentShader:mn})]})}const gt=["focus-1","focus-2","focus-3","focus-4","focus-5"],Ge=50,lt=[{img:"stickers/mbti-sword.png",p:[-.062,.338,.242],n:[-.4,-.25,.88],size:.055,roll:-6},{img:"stickers/miracleplus.png",p:[-.028,.288,.238],n:[-.25,-.3,.92],size:.035,roll:-8},{img:"stickers/autodrive.png",p:[.214,.36,.248],n:[.5,-.05,.87],size:.05,roll:8},{img:"stickers/desaysv.png",p:[.176,.3,.268],n:[.179,-.205,.962],size:.035,roll:8},{img:"stickers/ntu-shield.png",p:[-.099,.333,.204],n:[-.845,-.265,.465],size:.04,roll:-5},{img:"stickers/astar.png",p:[.168,.352,.272],n:[.22,.151,.964],size:.038,roll:5}];Ue.preload("./models/me.glb");const He=gt,Y=He.length,re=Y*Ge,Je=50,ct=24,ut=.3;function fn(){const t={envIntensity:.85,hemiIntensity:1.15,hemiSky:"#ffffff",hemiGround:"#404040",keyIntensity:2.35,keyColor:"#ffd9c6",keyPos:[5,8,5],fillIntensity:2.25,fillColor:"#9fc6ff",fillPos:[-5,4,-4]};return e.jsxs(e.Fragment,{children:[e.jsx(un,{intensity:t.envIntensity,rotationX:0,rotationY:0,rotationZ:0,asBackground:!1,bgIntensity:.4,bgBlur:0}),e.jsx("hemisphereLight",{args:[t.hemiSky,t.hemiGround,t.hemiIntensity]}),e.jsx("directionalLight",{position:t.keyPos,intensity:t.keyIntensity,color:t.keyColor,castShadow:!0,"shadow-mapSize":[2048,2048]}),e.jsx("directionalLight",{position:t.fillPos,intensity:t.fillIntensity,color:t.fillColor})]})}function gn({focusRef:t,frameRef:o,dofBokehRef:n,dofRangeRef:r}){var Te;const p={scrollSpeed:.3,idleSpeed:1.4},h={damping:.1,dwell:.35,parallax:4,parallaxEase:.1,mobilePullback:1.2,mobileTimelineShift:.12},w={gain:3,maxYaw:15,maxPitch:8,smooth:.44,crossEye:45,crossRadius:.25},b=ot(A=>A.get),{scene:L,animations:y}=Ue("./models/me.glb"),{model:M,eyes:N,followGroup:ie,petUniforms:pe,points:C,startPoint:le,glbCam:J,focusNode:ye,dof:H}=i.useMemo(()=>{const A=Dt(L);A.traverse(c=>{c.isSkinnedMesh&&(c.frustumCulled=!1)});const v=(()=>{let c=null;return A.traverse(F=>{F.name==="man"&&(c=F)}),c})();let V=null;v&&v.parent&&(V=new Vt,V.name="man-follow",v.parent.add(V),V.add(v));let W=null;if(v&&lt.length){const c=new Gt;A.updateMatrixWorld(!0);const F=[];v.traverse(S=>{if(!S.isMesh)return;const oe=S.geometry,de=oe.attributes.position,me=new Float32Array(de.count*3),ee=new j;for(let g=0;g<de.count;g++)ee.fromBufferAttribute(de,g),S.isSkinnedMesh&&S.applyBoneTransform(g,ee),ee.applyMatrix4(S.matrixWorld),me[g*3]=ee.x,me[g*3+1]=ee.y,me[g*3+2]=ee.z;const d=new Ht;d.setAttribute("position",new $t(me,3)),oe.index&&d.setIndex(oe.index),d.computeVertexNormals();const f=new it(d);f.updateMatrixWorld(!0),F.push(f)});const q=new Ut,Se=new Zt().copy(v.matrixWorld).invert();for(const S of lt){const oe=c.load(`./${S.img}`);oe.colorSpace=ft,oe.anisotropy=16;const de=new j(...S.n).normalize(),me=new j(...S.p),ee=v.localToWorld(me.clone().addScaledVector(de,.05)),d=de.clone().transformDirection(v.matrixWorld).normalize();q.set(ee,d.clone().negate());const f=q.intersectObjects(F,!1)[0];if(!f)continue;const g=new Ve().setFromQuaternion(new Ae().setFromUnitVectors(new j(0,0,1),d).multiply(new Ae().setFromAxisAngle(new j(0,0,1),S.roll*Math.PI/180))),B=new Yt(f.object,f.point,g,new j(S.size,S.size,Math.max(S.size,.04)));B.applyMatrix4(Se);const se=new Xt({map:oe,transparent:!0,alphaTest:.4,roughness:.85,metalness:0,polygonOffset:!0,polygonOffsetFactor:-4});se.onBeforeCompile=Oe=>{Oe.fragmentShader=Oe.fragmentShader.replace("vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;","vec3 outgoingLight = min(totalDiffuse + totalSpecular + totalEmissiveRadiance, diffuseColor.rgb * 1.25);")};const te=new it(B,se);te.castShadow=!1,te.receiveShadow=!1,te.userData.isSticker=!0,v.add(te)}F.forEach(S=>S.geometry.dispose())}const I=[],Le={};let ge=null,xe=null,je=null;if(A.traverse(c=>{c.isMesh&&!c.userData.isSticker&&(c.castShadow=!0,c.receiveShadow=!0),c.isCamera&&(xe=c),(c.name==="focus-start"||c.name==="focus-0")&&(ge=c),c.name==="focus-works"&&(je=c),He.includes(c.name)&&(Le[c.name]=c),/eye/i.test(c.name)&&(c.isMesh&&(c.geometry.computeVertexNormals(),(Array.isArray(c.material)?c.material:[c.material]).forEach(q=>{q.flatShading=!1,q.needsUpdate=!0})),I.push({obj:c,base:c.quaternion.clone(),x:c.position.x}))}),I.length>1){const c=I.map(S=>S.x),F=Math.min(...c),q=Math.max(...c),Se=(F+q)/2;I.forEach(S=>{S.sx=S.x<Se?-1:1})}else I.forEach(c=>c.sx=0);const Q=He.map(c=>Le[c]||null),Ce=je||Q[Q.length-1]||null,ne=ge||Q[0]||null,G=c=>(c==null?void 0:c.userData)??{},Z=[...Q,ne,Ce].some(c=>G(c).dofBokeh!==void 0),Pe=c=>G(c).dofEnabled===!1?0:G(c).dofBokeh??0,Be=c=>G(c).dofFocusRange??0;return{model:A,eyes:I,followGroup:V,petUniforms:W,points:Q,startPoint:ne,glbCam:xe,focusNode:Ce,dof:{has:Z,bokeh:Q.map(Pe),range:Q.map(Be),startBokeh:Pe(ne),startRange:Be(ne),worksBokeh:Pe(Ce),worksRange:Be(Ce)}}},[L]),ve=i.useMemo(()=>{const A=y||[],V=A.find(W=>W.name==="CameraAction")||(A.length?A.reduce((W,I)=>I.duration>W.duration?I:W):null);return V?Math.round(V.duration*ct):re+2*Je},[y]),he=i.useMemo(()=>new Jt(M),[M]),$=i.useRef([]);i.useEffect(()=>{if(!(!y||y.length===0))return he.stopAllAction(),$.current=y.map(A=>{const v=he.clipAction(A);return v.play(),v.paused=!0,{action:v,duration:A.duration}}),()=>{he.stopAllAction(),$.current=[]}},[he,y]);const P=i.useRef({x:0,y:0}),U=i.useRef({x:0,y:0});i.useEffect(()=>{const A=v=>{P.current.x=v.clientX/window.innerWidth*2-1,P.current.y=-(v.clientY/window.innerHeight*2-1)};return window.addEventListener("mousemove",A),()=>window.removeEventListener("mousemove",A)},[]);const fe=i.useRef(typeof window<"u"&&(((Te=window.matchMedia)==null?void 0:Te.call(window,"(pointer: coarse)").matches)===!0||window.innerWidth<=640)),be=i.useRef(null),k=i.useRef(null),K=i.useRef(0),O=i.useRef(new j),_=i.useRef(new j),E=i.useRef(new Ve(0,0,0,"YXZ")),z=i.useRef(0),Re=i.useRef(new Ve(0,0,0,"YXZ")),ce=i.useRef(new Ae),ue=i.useRef(new Ae),D=i.useRef(new j),Ee=i.useRef(new j),Ne=i.useRef(new Ae),Ie=i.useRef(new j),ke=i.useRef(new Ve(0,0,0,"YXZ")),Fe=i.useRef(new Ae);return We((A,v)=>{const V=1-Math.pow(h.damping,v);be.current||(be.current=He.map(d=>document.querySelector(`[data-point="${d}"]`)));const W=be.current,I=x.clamp(h.dwell,0,.49),Le=d=>I<=0?d:d<I?0:d>1-I?1:x.smoothstep((d-I)/(1-2*I),0,1);let ge=x.clamp(K.current/Ge-1,-1,Y-1);if(W&&W.length===Y&&W.every(Boolean)){const d=window.scrollY+window.innerHeight*ut,f=W.map(g=>g.getBoundingClientRect().top+window.scrollY);if(d<=f[0]){const g=Math.max(1,f[0]-window.innerHeight*ut);ge=-1+Le(x.clamp(window.scrollY/g,0,1))}else if(d>=f[Y-1])ge=Y-1;else for(let g=0;g<Y-1;g++)if(d<=f[g+1]){const B=(d-f[g])/Math.max(1,f[g+1]-f[g]);ge=g+Le(B);break}}let xe=x.clamp((ge+1)*Ge,0,re),je=!1;if(k.current||(k.current=document.querySelector(".wk-gallery")),k.current){const d=window.innerHeight,f=k.current.getBoundingClientRect().top,g=Math.max(0,k.current.offsetHeight-d);if(f<d){je=!0;const B=Math.min(re+Je,ve);if(f>0){const se=x.clamp(1-f/d,0,1);xe=re+(B-re)*se}else{const se=x.clamp(-f,0,g),te=x.clamp(se/window.innerWidth,0,1);xe=B+(ve-B)*te}}}const Q=x.smoothstep(xe,re,re+Je),Ce=x.lerp(V,1,Q);K.current+=(xe-K.current)*Ce;const ne=K.current;if($.current.length){const d=ne/ct;for(const{action:f,duration:g}of $.current)f.time=Math.min(d,g);he.update(0)}o&&(o.current=ne);const G=x.clamp(ne/Ge-1,-1,Y-1);if(t)if(je&&ye)ye.getWorldPosition(t.current);else if(G<0&&le&&C[0])le.getWorldPosition(O.current),C[0].getWorldPosition(_.current),t.current.lerpVectors(O.current,_.current,x.clamp(G+1,0,1));else{const d=x.clamp(G,0,Y-1),f=Math.floor(d),g=Math.min(f+1,Y-1),B=d-f;C[f]&&C[g]&&(C[f].getWorldPosition(O.current),C[g].getWorldPosition(_.current),t.current.lerpVectors(O.current,_.current,B))}if(n&&r)if(!H.has)n.current=-1;else{const d=(f,g,B)=>{if(je)return B;if(G<0)return x.lerp(g,f[0]??g,x.clamp(G+1,0,1));const se=x.clamp(G,0,Y-1),te=Math.floor(se),Oe=Math.min(te+1,Y-1);return x.lerp(f[te]??0,f[Oe]??0,se-te)};n.current=d(H.bokeh,H.startBokeh,H.worksBokeh),r.current=d(H.range,H.startRange,H.worksRange)*2.25}const Z=b().camera;if(J&&Z.isPerspectiveCamera){J.updateWorldMatrix(!0,!1),J.matrixWorld.decompose(Ee.current,Ne.current,Ie.current);const d=1-Math.pow(h.parallaxEase,v);U.current.x+=(P.current.x-U.current.x)*d,U.current.y+=(P.current.y-U.current.y)*d;const f=x.degToRad(h.parallax);if(ke.current.set(-U.current.y*f,-U.current.x*f,0),Fe.current.setFromEuler(ke.current),D.current.copy(Ee.current).sub(t.current).applyQuaternion(Fe.current),fe.current&&D.current.multiplyScalar(h.mobilePullback),D.current.add(t.current),Z.position.copy(D.current),Z.quaternion.multiplyQuaternions(Fe.current,Ne.current),fe.current&&h.mobileTimelineShift!==0){const g=x.smoothstep(G,-.8,.3)*(1-Q);if(g>0){const B=Z.position.distanceTo(t.current);Z.translateX(-B*h.mobileTimelineShift*g)}}Z.fov!==J.fov&&(Z.fov=J.fov,Z.updateProjectionMatrix())}if(pe&&(z.current+=v,pe.uPetPhase.value=ne*p.scrollSpeed+z.current*p.idleSpeed),ie&&!fe.current){const d={yaw:7,pitch:4};E.current.set(-U.current.y*x.degToRad(d.pitch),U.current.x*x.degToRad(d.yaw),0),ie.quaternion.setFromEuler(E.current)}if(N.length===0||fe.current)return;const Pe=1,Be=1;let c=0,F=0;for(const d of N)d.obj.getWorldPosition(D.current).project(Z),c+=D.current.x,F+=D.current.y;c/=N.length,F/=N.length;const q=P.current.x-c,Se=P.current.y-F,S=Pe*q*x.degToRad(w.maxYaw)*w.gain,oe=Be*-Se*x.degToRad(w.maxPitch)*w.gain,de=Math.hypot(q,Se),me=x.clamp(1-de/w.crossRadius,0,1),ee=x.degToRad(w.crossEye)*me;for(const d of N){const f=S-d.sx*ee;Re.current.set(oe,f,0),ce.current.setFromEuler(Re.current),ue.current.copy(ce.current).multiply(d.base),d.obj.quaternion.slerp(ue.current,w.smooth)}}),e.jsx("group",{position:[0,.4,-.7],rotation:[0,0*Math.PI/180,0],scale:2.25,children:e.jsx("primitive",{object:M})})}function xn({focusRef:t,frameRef:o,dofBokehRef:n,dofRangeRef:r}){const s={bloomIntensity:.6,bloomThreshold:.82,startBokeh:7.4,startRange:2,focusBokeh:11,focusRange:.15,startBlendFrame:48,endBlendFrame:re-50},a=i.useRef(null);return We(()=>{const l=a.current;if(!l)return;l.target&&t&&l.target.copy(t.current);const u=o?o.current:0,m=1-x.smoothstep(u,0,s.startBlendFrame),p=x.smoothstep(u,s.endBlendFrame,re),h=Math.max(m,p);n&&n.current>=0?(l.bokehScale=n.current,l.cocMaterial&&(l.cocMaterial.focusRange=Math.max(1e-4,r?r.current:s.focusRange))):(l.bokehScale=x.lerp(s.focusBokeh,s.startBokeh,h),l.cocMaterial&&(l.cocMaterial.focusRange=x.lerp(s.focusRange,s.startRange,h)))}),e.jsxs(St,{multisampling:0,stencilBuffer:!1,depthBuffer:!0,children:[e.jsx(At,{ref:a,target:[0,1.3,0],worldFocusRange:s.focusRange,bokehScale:s.focusBokeh,height:480}),e.jsx(Mt,{mipmapBlur:!0,intensity:s.bloomIntensity,luminanceThreshold:s.bloomThreshold,luminanceSmoothing:.3}),e.jsx(Rt,{})]})}function wn(){const t=i.useRef(new j(0,1.3,0)),o=i.useRef(0),n=i.useRef(-1),r=i.useRef(.15);return e.jsxs(e.Fragment,{children:[e.jsx(hn,{}),e.jsxs(i.Suspense,{fallback:null,children:[e.jsx(fn,{}),e.jsx(gn,{focusRef:t,frameRef:o,dofBokehRef:n,dofRangeRef:r})]}),e.jsx(xn,{focusRef:t,frameRef:o,dofBokehRef:n,dofRangeRef:r})]})}Et({MeshLineGeometry:Bt,MeshLineMaterial:Pt});const xt="./lanyard/card.glb",yn="./lanyard/lanyard.png";Ue.preload(xt);const dt="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",vn={x:0,y:0,w:.5,h:.755},bn={x:.5,y:0,w:.5,h:.757};function kn({position:t=[0,0,30],gravity:o=[0,-40,0],fov:n=20,transparent:r=!0,frontImage:s=null,backImage:a=null,imageFit:l="cover",lanyardImage:u=null,lanyardWidth:m=1,offsetX:p=0}){const[h,w]=i.useState(()=>typeof window<"u"&&window.innerWidth<768);return i.useEffect(()=>{const b=()=>w(window.innerWidth<768);return window.addEventListener("resize",b),()=>window.removeEventListener("resize",b)},[]),e.jsx("div",{className:"lanyard-wrapper",children:e.jsxs(st,{camera:{position:t,fov:n},dpr:[1,h?1.5:2],gl:{alpha:r},onCreated:({gl:b})=>b.setClearColor(new Qe(0),r?0:1),children:[e.jsx("ambientLight",{intensity:Math.PI}),e.jsx(Nt,{gravity:o,timeStep:h?1/30:1/60,children:e.jsx(jn,{isMobile:h,frontImage:s,backImage:a,imageFit:l,lanyardImage:u,lanyardWidth:m,offsetX:p})}),e.jsxs(It,{blur:.75,children:[e.jsx(De,{intensity:2,color:"white",position:[0,-1,5],rotation:[0,0,Math.PI/3],scale:[100,.1,1]}),e.jsx(De,{intensity:3,color:"white",position:[-1,-1,1],rotation:[0,0,Math.PI/3],scale:[100,.1,1]}),e.jsx(De,{intensity:3,color:"white",position:[1,1,1],rotation:[0,0,Math.PI/3],scale:[100,.1,1]}),e.jsx(De,{intensity:10,color:"white",position:[-10,0,14],rotation:[0,Math.PI/2,Math.PI/3],scale:[100,10,1]})]})]})})}function jn({maxSpeed:t=50,minSpeed:o=0,isMobile:n=!1,frontImage:r=null,backImage:s=null,imageFit:a="cover",lanyardImage:l=null,lanyardWidth:u=1,offsetX:m=0}){const p=i.useRef(null),h=i.useRef(null),w=i.useRef(null),b=i.useRef(null),L=i.useRef(null),y=i.useRef(null),M=new j,N=new j,ie=new j,pe=new j,C={type:"dynamic",canSleep:!0,colliders:!1,angularDamping:4,linearDamping:4},{nodes:le,materials:J}=Ue(xt),ye=Ze(l||yn),H=Ze(r||dt),ve=Ze(s||dt),he=i.useMemo(()=>{const k=J.base.map;if(!r&&!s)return k;const K=k.image,O=K.width,_=K.height,E=document.createElement("canvas");E.width=O,E.height=_;const z=E.getContext("2d");if(!z)return k;z.drawImage(K,0,0,O,_);const Re=(ue,D)=>{const Ee=D.x*O,Ne=D.y*_,Ie=D.w*O,ke=D.h*_,Te=(a==="contain"?Math.min:Math.max)(Ie/ue.width,ke/ue.height),A=ue.width*Te,v=ue.height*Te,V=Ee+(Ie-A)/2,W=Ne+(ke-v)/2;z.save(),z.beginPath(),z.rect(Ee,Ne,Ie,ke),z.clip(),z.drawImage(ue,V,W,A,v),z.restore()};r&&H.image&&Re(H.image,vn),s&&ve.image&&Re(ve.image,bn);const ce=new Kt(E);return ce.colorSpace=ft,ce.flipY=k.flipY,ce.anisotropy=16,ce.needsUpdate=!0,ce},[r,s,a,H,ve,J.base.map]),[$]=i.useState(()=>new Qt([new j,new j,new j,new j])),[P,U]=i.useState(!1),[fe,be]=i.useState(!1);return Ye(h,w,[[0,0,0],[0,0,0],1]),Ye(w,b,[[0,0,0],[0,0,0],1]),Ye(b,L,[[0,0,0],[0,0,0],1]),Tt(L,y,[[0,0,0],[0,1.5,0]]),i.useEffect(()=>{if(fe)return document.body.style.cursor=P?"grabbing":"grab",()=>void(document.body.style.cursor="auto")},[fe,P]),We((k,K)=>{var O;P&&(M.set(k.pointer.x,k.pointer.y,.5).unproject(k.camera),pe.copy(M).sub(k.camera.position).normalize(),M.add(pe.multiplyScalar(k.camera.position.length())),[y,w,b,L,h].forEach(_=>{var E;return(E=_.current)==null?void 0:E.wakeUp()}),(O=y.current)==null||O.setNextKinematicTranslation({x:M.x-P.x,y:M.y-P.y,z:M.z-P.z})),h.current&&([w,b].forEach(_=>{const E=_.current;E.lerped||(E.lerped=new j().copy(E.translation()));const z=Math.max(.1,Math.min(1,E.lerped.distanceTo(E.translation())));E.lerped.lerp(E.translation(),K*(o+z*(t-o)))}),$.points[0].copy(L.current.translation()),$.points[1].copy(b.current.lerped),$.points[2].copy(w.current.lerped),$.points[3].copy(h.current.translation()),p.current.geometry.setPoints($.getPoints(n?16:32)),N.copy(y.current.angvel()),ie.copy(y.current.rotation()),y.current.setAngvel({x:N.x,y:N.y-ie.y*.25,z:N.z},!0))}),$.curveType="chordal",ye.wrapS=ye.wrapT=qt,e.jsxs(e.Fragment,{children:[e.jsxs("group",{position:[m,4,0],children:[e.jsx(_e,{ref:h,...C,type:"fixed"}),e.jsx(_e,{position:[.5,0,0],ref:w,...C,children:e.jsx(Xe,{args:[.1]})}),e.jsx(_e,{position:[1,0,0],ref:b,...C,children:e.jsx(Xe,{args:[.1]})}),e.jsx(_e,{position:[1.5,0,0],ref:L,...C,children:e.jsx(Xe,{args:[.1]})}),e.jsxs(_e,{position:[2,0,0],ref:y,...C,type:P?"kinematicPosition":"dynamic",children:[e.jsx(Lt,{args:[.8,1.125,.01]}),e.jsxs("group",{scale:2.25,position:[0,-1.2,-.05],onPointerOver:()=>be(!0),onPointerOut:()=>be(!1),onPointerUp:k=>(k.target.releasePointerCapture(k.pointerId),U(!1)),onPointerDown:k=>(k.target.setPointerCapture(k.pointerId),U(new j().copy(k.point).sub(M.copy(y.current.translation())))),children:[e.jsx("mesh",{geometry:le.card.geometry,children:e.jsx("meshPhysicalMaterial",{map:he,"map-anisotropy":16,clearcoat:n?0:1,clearcoatRoughness:.15,roughness:.9,metalness:.8})}),e.jsx("mesh",{geometry:le.clip.geometry,material:J.metal,"material-roughness":.3}),e.jsx("mesh",{geometry:le.clamp.geometry,material:J.metal})]})]})]}),e.jsxs("mesh",{ref:p,children:[e.jsx("meshLineGeometry",{}),e.jsx("meshLineMaterial",{color:"white",depthTest:!1,resolution:n?[1e3,2e3]:[1e3,1e3],useMap:!0,map:ye,repeat:[-4,1],lineWidth:u})]})]})}const rt="#f4f1ea",ze="#ffd9b3",mt="'ZCOOL XiaoWei', 'Chiron GoRound TC', 'PingFang SC', 'Microsoft YaHei', sans-serif",ae=1024,we=1440,wt={en:{title:"About Enge",paragraphs:["I'm Enge Lou — an applied AI agent developer who loves turning AI ideas into systems that actually run.","I believe AI's value isn't in the demo — it's in the moment it runs in production and solves a real problem."],cue:"SCROLL DOWN"},zh:{title:"About Enge",paragraphs:["我是楼恩鸽——一个喜欢把 AI 想法做成能跑的系统的应用型 AI Agent 开发者。","相信 AI 的价值不在 demo 里，而在真正跑在生产环境、解决实际问题的那一刻。"],cue:"向下滚动"}};async function Cn(t){const o=wt[t],n=o.title+o.paragraphs.join("")+o.cue+"Enge Code Art Play";try{await Promise.all([document.fonts.load("400 120px Mansalva","About Enge"),document.fonts.load("600 46px 'Cormorant Upright'",n),document.fonts.load("400 42px 'ZCOOL XiaoWei'",n)]),await document.fonts.ready}catch{}}function at(t,o){const n=document.createElement("canvas");n.width=t,n.height=o;const r=n.getContext("2d");return{canvas:n,ctx:r}}function yt(t){const o=t.createLinearGradient(0,0,0,we);o.addColorStop(0,"#151c2b"),o.addColorStop(1,"#0a0e16"),t.fillStyle=o,t.fillRect(0,0,ae,we);const n=64;t.strokeStyle="rgba(244, 241, 234, 0.16)",t.lineWidth=2,t.strokeRect(n,n,ae-n*2,we-n*2),t.strokeStyle="rgba(244, 241, 234, 0.4)";const r=16;for(const[s,a]of[[n,n],[ae-n,n],[n,we-n],[ae-n,we-n]])t.beginPath(),t.moveTo(s-r,a),t.lineTo(s+r,a),t.moveTo(s,a-r),t.lineTo(s,a+r),t.stroke()}function $e(t,o,n,r,s){const a=[...o],l=a.map(p=>t.measureText(p).width),u=l.reduce((p,h)=>p+h,0)+s*(a.length-1);let m=n-u/2;t.save(),t.textAlign="left";for(let p=0;p<a.length;p++)t.fillText(a[p],m,r),m+=l[p]+s;t.restore()}function Sn(t,o,n){const r=o.match(/[A-Za-z0-9''.,!?;:—–-]+\s*|\s+|./g)??[o],s=[];let a="";for(const l of r){const u=a+l;a&&t.measureText(u.trimEnd()).width>n?(s.push(a.trimEnd()),a=l.trimStart()):a=u}return a.trim()&&s.push(a.trimEnd()),s}function An(t){const{canvas:o,ctx:n}=at(ae,we),r=wt[t];yt(n);const s=ae/2;n.textAlign="center",n.textBaseline="alphabetic",n.fillStyle="rgba(244, 241, 234, 0.5)",n.font="500 30px 'Helvetica Neue', sans-serif",$e(n,"PORTFOLIO — 2026",s,172,9),n.fillStyle=rt,n.font="400 136px Mansalva, cursive",n.fillText(r.title,s,425),n.fillStyle=ze,n.fillRect(s-50,482,100,5),n.fillStyle="rgba(244, 241, 234, 0.92)";const a=t==="zh";n.font=a?`400 55px ${mt}`:"600 52px 'Cormorant Upright', serif";const l=a?94:74,u=ae-64*2-72;let m=618;for(const p of r.paragraphs){for(const h of Sn(n,p,u))n.fillText(h,s,m),m+=l;m+=38}n.fillStyle=ze,n.font=a?`400 48px ${mt}`:"500 36px 'Helvetica Neue', sans-serif",$e(n,r.cue,s,1242,14),n.strokeStyle=ze,n.lineWidth=4,n.lineCap="round";for(const p of[0,30])n.beginPath(),n.moveTo(s-19,1278+p),n.lineTo(s,1295+p),n.lineTo(s+19,1278+p),n.stroke();return o.toDataURL("image/png")}function Mn(){const{canvas:t,ctx:o}=at(ae,we);yt(o);const n=ae/2;return o.textAlign="center",o.fillStyle=rt,o.font="400 200px Mansalva, cursive",o.fillText("Enge",n,700),o.fillStyle=ze,o.beginPath(),o.arc(n+218,692,12,0,Math.PI*2),o.fill(),o.fillStyle="rgba(244, 241, 234, 0.55)",o.font="500 30px 'Helvetica Neue', sans-serif",$e(o,"CODE · ART · PLAY",n,810,8),o.fillStyle="rgba(244, 241, 234, 0.38)",o.font="500 24px 'Helvetica Neue', sans-serif",$e(o,"BASED IN SINGAPORE",n,1266,7),t.toDataURL("image/png")}function Rn(){const{canvas:t,ctx:o}=at(1024,256);o.fillStyle="#10151f",o.fillRect(0,0,1024,256),o.textAlign="center",o.textBaseline="middle",o.fillStyle=rt,o.font="400 108px Mansalva, cursive",o.fillText("Enge",512,136),o.fillStyle=ze;for(const n of[192,832])o.save(),o.translate(n,128),o.rotate(Math.PI/4),o.fillRect(-11,-11,22,22),o.restore();return t.toDataURL("image/png")}async function En(t){return await Cn(t),{front:An(t),back:Mn(),band:Rn()}}const et={zIndex:100,opacity:.5,alpha:1},vt="noise-v1",Nn=t=>t.toFixed(3),In=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`,Tn=`
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x)
      + (c - a) * u.y * (1.0 - u.x)
      + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 pixel = gl_FragCoord.xy;
    float frame = uTime;
    float mask = noise(pixel / uResolution.y * 30.0 + 1000.0*hash(vec2(frame * 0.1))) * 0.2;
    mask = smoothstep(0.005, 0.03, mask);
    float b = noise(pixel / uResolution.y * 30.0 + 1000.0*hash(vec2(frame * 0.1))) * 0.2;
    b += noise(pixel / uResolution.y * 60.0 + 1000.0*hash(vec2(frame * 0.2))) * 0.5;
    b = clamp(b, 0.0, 1.0);
    b = smoothstep(0.1, 0.12, b);
    vec3 color = mix(vec3(0.2, 0.4, 0.45), vec3(1.0, 1.4, 1.3), b);
    color += vec3(mask);
    color *= hash(pixel / uResolution.y * 200.0 + 1000.0*hash(vec2(frame * 0.3))) * 4.0;
    color = clamp(color, 0.0, 1.0);
    gl_FragColor = vec4(color, ${Nn(et.alpha)});
  }
`;function Ln(){const t=i.useRef(null),o=i.useMemo(()=>new Ke,[]),n=i.useRef(-999),r=1;We(({clock:a,size:l})=>{t.current&&(a.elapsedTime-n.current<1/r*.5||(n.current=a.elapsedTime,t.current.uniforms.uTime.value=a.elapsedTime%1e4,o.set(l.width,l.height),t.current.uniforms.uResolution.value=o))}),i.useEffect(()=>{const a=setInterval(()=>_t(),1e3/r);return()=>clearInterval(a)},[]);const s=i.useMemo(()=>({uTime:{value:0},uResolution:{value:o}}),[o]);return e.jsxs("mesh",{frustumCulled:!1,children:[e.jsx("planeGeometry",{args:[2,2]}),e.jsx("shaderMaterial",{ref:t,transparent:!0,depthTest:!1,depthWrite:!1,side:en,uniforms:s,vertexShader:In,fragmentShader:Tn},vt)]})}function Pn(){const[t,o]=i.useState(!1);return i.useEffect(()=>o(!0),[]),t?e.jsx("div",{"aria-hidden":"true","data-three-noise-overlay":vt,style:{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:et.zIndex,mixBlendMode:"multiply"},children:e.jsx(st,{style:{width:"100%",height:"100%",opacity:et.opacity,pointerEvents:"none"},frameloop:"demand",camera:{position:[0,0,1]},gl:{alpha:!0,antialias:!1,powerPreference:"high-performance"},children:e.jsx(Ln,{})})}):null}function Bn({variant:t="horizontal",animated:o=!1,...n}){if(t==="square")return e.jsxs("svg",{viewBox:"0 0 1024 1024",fill:"none",xmlns:"http://www.w3.org/2000/svg",...n,children:[e.jsx("path",{d:"M464.06 263.688C399.55 319.14 356.934 399.347 350.954 489.572L210.514 665.66V665.68H388.834C408.362 702.086 434.592 734.362 465.872 760.857H79.4521V666.926L326.378 357.339V357.318H79.4521V263.142H79V262.142H464.06V263.688ZM468.856 665.68V681.275C464.731 676.226 460.784 671.025 457.028 665.68H468.856ZM327.378 357.688L327.379 357.689V356.319H327.378V357.688ZM80 356.318H80.001V263.142H80V356.318Z",fill:"currentColor"}),e.jsx("path",{d:"M856.061 511.5C856.061 412.536 775.835 332.31 676.871 332.31C577.907 332.31 497.681 412.536 497.681 511.5C497.681 610.464 577.907 690.69 676.871 690.69V780C528.583 780 408.371 659.788 408.371 511.5C408.371 363.212 528.583 243 676.871 243C825.16 243 945.371 363.212 945.371 511.5C945.371 659.788 825.16 780 676.871 780V690.69C775.835 690.69 856.061 610.464 856.061 511.5Z",fill:"currentColor"}),e.jsx("circle",{cx:"733.5",cy:"457.5",r:"77.5",fill:"currentColor"})]});const r=o?"zooop-dot":void 0;return e.jsxs("svg",{viewBox:"0 0 869 220",fill:"none",xmlns:"http://www.w3.org/2000/svg",...n,children:[o&&e.jsx("style",{children:`
          .zooop-dot { transform-box: view-box; animation: zooop-dot-spin 2.5s linear infinite; }
          .zooop-dot-1 { transform-origin: 244.324px 110px; }
          .zooop-dot-2 { transform-origin: 431.984px 110px; }
          .zooop-dot-3 { transform-origin: 612.316px 110px; }
          @keyframes zooop-dot-spin { to { transform: rotate(360deg); } }
          @media (prefers-reduced-motion: reduce) { .zooop-dot { animation: none; } }
        `}),e.jsx("path",{d:"M157.554 2.42578C127.965 26.2339 108.406 61.9988 106.209 102.385L49.1709 173.914V174.5H121.971C130.011 189.68 140.8 203.181 153.677 214.338H0V167.231L99.5547 42.3896V41.8037H0V1.96582H157.554V2.42578ZM159.604 174.5V180.552C157.964 178.591 156.39 176.573 154.887 174.5H159.604Z",fill:"currentColor"}),e.jsx("path",{d:"M792.444 3C806.465 3 819.271 5.72914 830.862 11.1875C842.453 16.4509 851.707 24.5413 858.624 35.458C865.541 46.1798 869 59.2411 869 74.6416C869 90.8217 865.354 104.467 858.063 115.579C850.959 126.496 841.331 134.586 829.18 139.85C817.215 145.113 803.755 147.745 788.799 147.745H767.5V215H718V198.364C737.977 174.426 750 143.617 750 110C750 76.3823 737.978 45.5734 718 21.6348V3H792.444ZM718 80.5098C720.605 89.8952 722 99.7847 722 110C722 120.215 720.605 130.104 718 139.489V80.5098ZM767.5 108.854H782.63C797.212 108.853 807.588 106.027 813.757 100.374C820.113 94.5257 823.291 86.2404 823.291 75.5186C823.291 65.1866 820.206 57.0963 814.037 51.248C807.868 45.2049 798.614 42.1836 786.275 42.1836H767.5V108.854Z",fill:"currentColor"}),e.jsx("circle",{className:r?`${r} zooop-dot-1`:void 0,cx:"217.886",cy:"108.781",r:"31.8863",fill:"currentColor"}),e.jsx("circle",{className:r?`${r} zooop-dot-2`:void 0,cx:"431.984",cy:"83.8863",r:"31.8863",fill:"currentColor"}),e.jsx("circle",{className:r?`${r} zooop-dot-3`:void 0,cx:"639.886",cy:"108.781",r:"31.8863",fill:"currentColor"}),e.jsx("path",{d:"M314.657 110C314.657 71.1562 283.168 39.6671 244.324 39.6671C205.48 39.6671 173.991 71.1562 173.991 110C173.991 148.844 205.48 180.333 244.324 180.333C283.168 180.333 314.657 148.844 314.657 110ZM354.324 110C354.324 170.751 305.076 220 244.324 220C183.573 220 134.324 170.751 134.324 110C134.324 49.2487 183.573 0 244.324 0C305.076 0 354.324 49.2487 354.324 110Z",fill:"currentColor"}),e.jsx("path",{d:"M502.317 110C502.317 71.1562 470.828 39.6671 431.984 39.6671C393.141 39.6671 361.652 71.1562 361.652 110C361.652 148.844 393.141 180.333 431.984 180.333C470.828 180.333 502.317 148.844 502.317 110ZM541.984 110C541.984 170.751 492.736 220 431.984 220C371.233 220 321.984 170.751 321.984 110C321.984 49.2487 371.233 0 431.984 0C492.736 0 541.984 49.2487 541.984 110Z",fill:"currentColor"}),e.jsx("path",{d:"M682.649 110C682.649 71.1562 651.16 39.6671 612.316 39.6671C573.473 39.6671 541.984 71.1562 541.984 110C541.984 148.844 573.473 180.333 612.316 180.333C651.16 180.333 682.649 148.844 682.649 110ZM722.316 110C722.316 170.751 673.068 220 612.316 220C551.565 220 502.316 170.751 502.316 110C502.316 49.2487 551.565 0 612.316 0C673.068 0 722.316 49.2487 722.316 110Z",fill:"currentColor"})]})}function _n(t){return e.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",...t,children:e.jsx("path",{d:"M13 3h3a5 5 0 0 0 4.6 4.98V11A8 8 0 0 1 16 9.6V15a6 6 0 1 1-6-6c.34 0 .67.03 1 .08v3.12A3 3 0 1 0 13 15V3z"})})}function zn(t){return e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",xmlns:"http://www.w3.org/2000/svg",...t,children:[e.jsx("path",{d:"M7 3l3 3M17 3l-3 3"}),e.jsx("rect",{x:"3",y:"6",width:"18",height:"13",rx:"3.5"}),e.jsx("path",{d:"M9 11v2M15 11v2"})]})}function Wn(t){return e.jsxs("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",...t,children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"5",fill:"none",stroke:"currentColor",strokeWidth:"2"}),e.jsx("path",{d:"M12 16.2c-2.1-1.5-4-3-4-5.1A2.1 2.1 0 0 1 12 9.9a2.1 2.1 0 0 1 4 1.2c0 2.1-1.9 3.6-4 5.1z",fill:"currentColor"})]})}function Fn(t){return e.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",...t,children:e.jsx("path",{d:"M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.18-.02-2.14-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18.92-.26 1.9-.38 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.12 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14 0 1.54-.02 2.79-.02 3.17 0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"})})}function On(t){return e.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",...t,children:e.jsx("path",{d:"M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H7.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM3.84 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM5.62 20.45H2.06V9h3.56v11.45z"})})}function Dn(t){return e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",xmlns:"http://www.w3.org/2000/svg",...t,children:[e.jsx("rect",{x:"2.5",y:"4.5",width:"19",height:"15",rx:"3"}),e.jsx("path",{d:"M3.5 6.5 12 13l8.5-6.5"})]})}const bt={douyin:_n,bilibili:zn,xiaohongshu:Wn,github:Fn,linkedin:On,mail:Dn},Vn=[{id:"github",label:"GitHub",href:"https://github.com/pi523"},{id:"linkedin",label:"LinkedIn",href:"https://www.linkedin.com/in/enge-lou-b77aa3214"},{id:"mail",label:"Email",href:"mailto:monicalou0523@gmail.com"}],Gn={en:{title:"Résumé",entries:[{period:"Aug 2025 – Dec 2026",place:"Nanyang Technological University, Singapore",role:"Master of Science in Artificial Intelligence"},{period:"Jul 2022 – Jun 2025",place:"B.Eng. Electrical & Electronic Engineering",role:"Specialization: Data Analysis & Machine Learning (Computing & Intelligent Systems)",points:["First Class Honours (AY22/23)","Machine Learning Design & Application · AI & Data Mining"]},{period:"Jan 2026 – May 2026",place:"Desay SV Automotive, Singapore",role:"LLM Applications Engineer Intern",points:["Multilingual translation plugin on local LLMs + RAG, deployed internally","Co-authored IEEE-ITSC paper (accepted): runtime safety monitoring for DMS","PRD–UE–UI automated audit system — 95% detection rate in pilot","ROS2 robotic-arm integration + scheduled AI news-digest service"]},{period:"Aug 2025 – Jan 2026",place:"A*STAR CFAR, Singapore",role:"Junior Scientist I",points:["PyTorch pipelines with ESM protein language models for enzyme activity prediction","Reproducible workflows for large, imbalanced datasets","400k+ dataset built with RhoFold for RNA–ligand binding prediction"]},{period:"May 2025 – Jul 2025",place:"MiraclePlus, Beijing",role:"Brand Marketing & Content Strategy",points:["In-depth interviews with 10+ AI founders","5+ research reports — readership up 12%","Built a systematic AI industry-trend research framework"]}]},zh:{title:"Résumé",entries:[{period:"Aug 2025 – Dec 2026",place:"南洋理工大学 · 新加坡",role:"人工智能理学硕士"},{period:"Jul 2022 – Jun 2025",place:"电气与电子工程学士",role:"专业方向：数据分析与机器学习（计算与智能系统）",points:["一等荣誉学位（AY22/23）","机器学习设计与应用 · 人工智能与数据挖掘"]},{period:"Jan 2026 – May 2026",place:"德赛西威 · 新加坡",role:"LLM 应用工程实习生",points:["本地 LLM + RAG 多语言翻译插件，已部署内部使用","IEEE-ITSC 论文合著（已录用）：驾驶员监测系统运行时安全监控","PRD–UE–UI 自动审查系统，试点检测率 95%","ROS2 机械臂集成 + 定时 AI 资讯摘要服务"]},{period:"Aug 2025 – Jan 2026",place:"A*STAR CFAR · 新加坡",role:"Junior Scientist I",points:["PyTorch + ESM 蛋白质语言模型管线，预测酶活性","大规模不均衡数据集下的可复现工作流","用 RhoFold 构建 40 万+ RNA–配体结合预测数据集"]},{period:"May 2025 – Jul 2025",place:"奇绩创坛 · 北京",role:"品牌营销与内容策略",points:["深度访谈 10+ 位 AI 创始人","产出 5+ 篇研究报告，阅读量提升 12%","搭建系统性 AI 行业趋势研究框架"]}]}},Hn=gt,kt=[.22,1,.36,1],$n={hidden:{},show:{transition:{staggerChildren:.09,delayChildren:.04}}},Me={hidden:{opacity:0,y:26},show:{opacity:1,y:0,transition:{duration:.75,ease:kt}}};function Un({group:t}){const o=t.logo==="zooop"?e.jsx("a",{className:"zooop-logo-link",href:t.link,target:"_blank",rel:"noopener noreferrer","aria-label":"ZOOOP",children:e.jsx(Bn,{className:"zooop-logo",animated:!0})}):t.link?e.jsx("a",{className:"about-link",href:t.link,target:"_blank",rel:"noopener noreferrer",children:t.heading}):e.jsx("span",{children:t.heading});return e.jsxs(R.div,{className:"tl-group",variants:Me,children:[e.jsxs("div",{className:"tl-group-head",children:[t.logoImg&&e.jsx("span",{className:"tl-group-logo",children:e.jsx("img",{src:t.logoImg,alt:t.heading||"",loading:"lazy"})}),o,t.sub&&e.jsx("span",{className:"tl-group-sub",children:t.sub})]}),t.items&&e.jsx("ul",{className:"tl-points",children:t.items.map((n,r)=>e.jsx("li",{children:n},r))}),t.links&&e.jsx("div",{className:"tl-logos",children:t.links.map(n=>{const r=bt[n.id];return e.jsx("a",{className:"tl-logo",href:n.href,target:"_blank",rel:"noopener noreferrer","aria-label":n.label,title:n.label,children:e.jsx(r,{})},n.id)})})]})}function Zn({entry:t,index:o}){return e.jsxs(R.div,{className:"tl-entry","data-point":Hn[o],variants:$n,initial:"hidden",whileInView:"show",viewport:{once:!0,margin:"-12% 0px -12% 0px"},children:[e.jsx(R.span,{className:"tl-dot",variants:Me,"aria-hidden":"true"}),e.jsxs("div",{className:"tl-body",children:[e.jsx(R.div,{className:"tl-period",variants:Me,children:t.period}),e.jsxs(R.div,{className:"tl-head",variants:Me,children:[t.logo&&e.jsx("span",{className:"tl-logo-chip",children:e.jsx("img",{src:t.logo.src,alt:t.logo.alt,loading:"lazy"})}),e.jsx("h3",{className:"tl-place",children:t.place})]}),t.role&&e.jsx(R.div,{className:"tl-role",variants:Me,children:t.role}),t.points&&e.jsx(R.ul,{className:"tl-points",variants:Me,children:t.points.map((n,r)=>e.jsx("li",{children:n},r))}),t.groups&&t.groups.map((n,r)=>e.jsx(Un,{group:n},r))]})]})}function Yn({lang:t}){const o=Gn[t];return e.jsxs("section",{className:"resume",lang:t,children:[e.jsx(R.h2,{className:"resume-title",initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-10% 0px"},transition:{duration:.7,ease:kt},children:o.title}),e.jsx("div",{className:"timeline",children:o.entries.map((n,r)=>e.jsx(Zn,{entry:n,index:r},r))})]})}const Xn={zh:{title:"Works",closeLabel:"返回",openLabel:"展开作品",hint:"继续下滑",awardsLabel:"获奖",visitLabel:"访问作品",detailPlaceholder:"你的作品介绍",phImageLabel:"图片 / 视频",phButtonLabel:"跳转按钮",countLabel:t=>`${t} 件作品`,sections:[{id:"isolid",no:"01",title:"iSolid",tagline:"一个不让想法烂在你脑子里的督促者",items:[{name:"iSolid",meta:"网页应用 · AI 督促者",link:"https://isolid.p1pi.me",slug:"isolid"}]},{id:"chain-agent",no:"02",title:"链上自动化交易 Agent",tagline:"Polygon 上的端到端自主管道——从信号到结算，全程护栏",items:[{name:"自主交易 Agent 系统",meta:"独立项目 · 链上自动化",slug:"chain-agent"}]},{id:"shieldflow",no:"03",title:"ShieldFlow",tagline:"多智能体数据分析引擎",items:[{name:"ShieldFlow",meta:"Multi-Agent · 数据分析",slug:"shieldflow"}]},{id:"aigc",no:"04",title:"AIGC 实验场",tagline:"自由探索——用 AI 生成温馨小片,也用 AI 快速做游戏",items:[{name:"儿童温馨短片",meta:"AIGC · 视频生成",slug:"aigc-film"}]}]},en:{title:"Works",closeLabel:"Back",openLabel:"Explore",hint:"Keep scrolling",awardsLabel:"Awards",visitLabel:"Visit site",detailPlaceholder:"Your work description",phImageLabel:"Image / Video",phButtonLabel:"Link button",countLabel:t=>`${t} works`,sections:[{id:"isolid",no:"01",title:"iSolid",tagline:"An accountability agent that won't let ideas rot in your head",items:[{name:"iSolid",meta:"Web app · AI accountability",link:"https://isolid.p1pi.me",slug:"isolid"}]},{id:"chain-agent",no:"02",title:"On-chain Trading Agent",tagline:"End-to-end autonomous pipeline on Polygon — signal to settlement, guardrails throughout",items:[{name:"Autonomous Trading Agent System",meta:"Independent project · On-chain automation",slug:"chain-agent"}]},{id:"shieldflow",no:"03",title:"ShieldFlow",tagline:"Multi-Agent Data Analysis Engine",items:[{name:"ShieldFlow",meta:"Multi-agent · Data analysis",slug:"shieldflow"}]},{id:"aigc",no:"04",title:"AIGC Playground",tagline:"Free exploration — warm little films and fast-built games, made with AI",items:[{name:"A Warm Short for Kids",meta:"AIGC · Video generation",slug:"aigc-film"}]}]}},Jn={isolid:"./works/covers/isolid.jpg","chain-agent":"./works/covers/chain-agent.jpg",shieldflow:"./works/covers/shieldflow.jpg",aigc:"./works/covers/aigc.jpg"},Kn=`---
title: A Warm Short for Kids
banner: /works/covers/aigc.jpg
role: Free Exploration
tags: [AIGC, Video Generation]
---

Beyond work, I explore what AIGC can do and where its edges are. What I'm after: warm, serialized educational shorts made for kids. This little film is the first result — character, storyboard, visuals, and narration subtitles, all generated by AI.

<video src="/works/aigc/short-film.mp4" poster="/works/aigc/poster.jpg" controls playsinline preload="none"></video>

What turned out to be genuinely hard isn't the beauty of a single frame — it's consistency and continuity of atmosphere: the character, the lighting, and the emotional tone have to hold steady across every shot. This AIGC playground keeps on growing.
`,Qn=`---
title: 儿童温馨短片
banner: /works/covers/aigc.jpg
role: 自由探索
tags: [AIGC, Video Generation]
---

工作之外,我也在探索 AIGC 的各种玩法以及边界。我想用 AI 产出"给孩子看的温馨感的连续教育短片"。这支小短片是第一个成果:从角色、分镜、画面到旁白字幕,全部由 AI 生成。

<video src="/works/aigc/short-film.mp4" poster="/works/aigc/poster.jpg" controls playsinline preload="none"></video>

做下来发现,这类内容真正难的不是单帧的精美,而是"氛围的一致性和连贯性":角色形象、光线、情绪基调要在每一个镜头里都稳得住。这个 AIGC 实验场还会继续扩张中。
`,qn=`---
title: On-chain Trading Agent
banner: /works/chain-agent/banner.jpg
role: Independent Project
tags: [Polygon, Autonomous Agent, Web3]
---

I wanted to see whether an AI agent can be trusted with real money. This autonomous trading engine on Polygon is my answer. Asynchronous daemons run around the clock (signal → execution → settlement → audit), taking a signal all the way to an on-chain order with zero manual intervention.

But autonomous doesn't mean unguarded: every signal must clear 5 risk guards before it trades; multi-node RPC failover keeps the system at zero downtime; and an independent reconciliation layer trusts no local records, recomputing equity straight from chain state. It proves that agents can run in production — and the proof is verified with real money.
`,eo=`---
title: 链上自动化交易 Agent
banner: /works/chain-agent/banner.jpg
role: 独立项目
tags: [Polygon, Autonomous Agent, Web3]
---

我想验证一个 AI Agent 能不能被信任去管真金白银。这套跑在 Polygon 上的自主交易引擎就是我的答案。异步守护进程昼夜接力(信号 → 执行 → 结算 → 审计),从捕捉信号到链上下单,全程无人工干预。

但"自主"不等于"放任":每个信号要闯过 5 道风控才能成交;多节点 RPC 容错让系统保持零宕机;还有一个独立对账层,不信任何本地记录,直接从链上状态重算权益。证明了 Agent 能上生产环境,而这个证明是通过真钱验证的。
`,to=`---
title: 示例作品 · Example Work
banner: /works/example/banner.jpg
year: 2026
role: 设计 / 开发
tags: [互动项目, 示例标签]
link: https://example.com
---

> **这是一个作品详情模板。** 把本文件复制成 \`src/content/works/<slug>.md\`，其中
> \`<slug>\` 要与 \`src/data/works.js\` 里某个作品 item 的 \`slug\` 一致，该作品点开后就会
> 渲染成完整详情；否则详情页显示统一占位。本文件 slug 为 \`example\`，不对应任何作品，
> 因此不会出现在线上——仅作参考。

## 小标题

正文支持标准 Markdown：**加粗**、*斜体*、[外链](https://example.com)，以及列表：

- 要点一
- 要点二
- 要点三

## 图片与视频

媒体放在 \`public/works/<slug>/\` 下，用 \`/works/...\` 绝对路径引用（\`public/works/\` 默认
不入 git，见 \`.gitignore\`）：

![示例配图](/works/example/1.jpg)

<video src="/works/example/demo.mp4" autoplay muted loop playsinline></video>

---

frontmatter 可用字段（均可选）：

| 字段 | 说明 |
| --- | --- |
| \`title\` | 详情标题（缺省回退 works.js 里的作品名） |
| \`banner\` | 顶部 banner 图路径（缺省用渐变占位） |
| \`year\` | 年份 |
| \`role\` | 角色 / 担当 |
| \`tags\` | 标签数组，如 \`[互动项目, 虎啸奖]\` |
| \`link\` | 外链，渲染成「访问作品」按钮 |
`,no=`---
title: iSolid
banner: /works/isolid/banner.jpg
role: Design & Development (solo)
tags: [AI Agent, LangGraph, Full-Stack]
link: https://isolid.p1pi.me
---

Most "I'll do it tomorrow" ideas end up forgotten — not because they're bad, but because they're vague and nobody pushes you. iSolid is that push: drop in a rough idea, and it asks you the right follow-up questions to shape it into a structured PRD and an actionable GTD list, then checks in on your progress until things actually get done.

It's also a production agent system in its own right: LangGraph state graphs hand off work along the pipeline, a tiered dispatch layer routes tasks across different models by difficulty, and end-to-end structured validation lets it fail over between providers without a crash. From product design to frontend, backend, and Docker deployment — all built solo. Now live in closed beta with early-access users.
`,oo=`---
title: iSolid
banner: /works/isolid/banner.jpg
role: 独立设计与开发
tags: [AI Agent, LangGraph, Full-Stack]
link: https://isolid.p1pi.me
---

"明天再做"的想法,大多数会被遗忘掉——不是因为想法本身不好,而是它太模糊,又没人推你一把。iSolid 就是那个推你的"人":把一团模糊的念头丢给它,它会追问你、帮助你变成结构化的 PRD 和能直接动手的 GTD 清单,然后定时来追问进度,直到事情真的做完。

它本身也是一个跑在生产环境的 Agent 系统:LangGraph 状态图接力工作,按任务难度在不同模型之间分层调度,全链路结构化校验让任何一家模型出问题都能无感切换、不崩溃。从产品设计、前后端到 Docker 部署,全部独立完成。现已上线,封闭 Beta 中,早期用户使用中。
`,so=`---
title: ShieldFlow
banner: /works/shieldflow/banner.jpg
role: Independent Project
tags: [Multi-Agent, Data Analysis, Sandbox]
---

The hard part of handing data analysis to AI isn't generating code — it's daring to run it. ShieldFlow answers with a team of specialized agents: a Coordinator decomposes the task, an Analyst writes the analysis code, a Verifier checks the results — natural language in, interactive Plotly charts out, with a self-correction loop that turns execution errors into automatic fixes, no human in the middle.

Trust comes from constraints: every generated snippet passes AST-based static auditing before running in a network-isolated Docker sandbox, and a Schema RAG pipeline injects real column samples and dtypes into prompts, sharply reducing mapping errors on complex datasets. Every step is inspectable and traceable — my full answer to what makes a multi-agent system trustworthy.
`,ro=`---
title: ShieldFlow
banner: /works/shieldflow/banner.jpg
role: 独立项目
tags: [Multi-Agent, Data Analysis, Sandbox]
---

把数据分析交给 AI,最难的不是让它生成代码,而是敢不敢跑它生成的代码。ShieldFlow 用一组各司其职的智能体回答这个问题:Coordinator 拆解任务、Analyst 编写分析代码、Verifier 校验结果——自然语言进,交互式 Plotly 图表出;执行报错会自动触发自我修正循环,改完再跑,不用人插手。

而信任来自约束:所有生成代码先过 AST 静态审计,再进网络隔离的 Docker 沙箱执行;Schema RAG 把数据列的真实样本和类型精准注入提示词,大幅减少复杂数据集上的字段映射错误。每一步可检查、可追溯——这是我对"多智能体系统怎样才算可信"的一次完整回答。
`,pt=Object.assign({"../content/works/aigc-film.en.md":Kn,"../content/works/aigc-film.zh.md":Qn,"../content/works/chain-agent.en.md":qn,"../content/works/chain-agent.zh.md":eo,"../content/works/example.md":to,"../content/works/isolid.en.md":no,"../content/works/isolid.zh.md":oo,"../content/works/shieldflow.en.md":so,"../content/works/shieldflow.zh.md":ro});function ao(t){const o=/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(t);if(!o)return{data:{},body:t};const n={};for(const r of o[1].split(`
`)){const s=/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(r.trim());if(!s)continue;const a=s[2].trim();let l;a.startsWith("[")&&a.endsWith("]")?l=a.slice(1,-1).split(",").map(u=>u.trim().replace(/^['"]|['"]$/g,"")).filter(Boolean):l=a.replace(/^['"]|['"]$/g,""),n[s[1]]=l}return{data:n,body:o[2].trim()}}const tt="./",io=t=>t.replace(/\b(src|poster|href)="\/(?!\/)/g,`$1="${tt}`).replace(/\]\(\/(?!\/)/g,`](${tt}`),lo=t=>t&&t.startsWith("/")&&!t.startsWith("//")?tt+t.slice(1):t,nt={};for(const t in pt){const o=t.split("/").pop().replace(/\.md$/,""),{data:n,body:r}=ao(pt[t]),s={slug:o,...n,body:io(r)};s.banner=lo(s.banner),nt[o]=s}function co(t,o){return t&&(o&&nt[`${t}.${o}`]||nt[t])||null}const uo=[.22,1,.36,1];function ht({item:t,onOpen:o}){const n=t.meta||t.tags&&t.tags.length;return e.jsx("li",{className:"wk-line",children:e.jsxs("button",{className:"wk-line-btn",onClick:()=>o(t),children:[e.jsx("span",{className:"wk-line-name",children:t.name}),n&&e.jsxs("span",{className:"wk-line-meta",children:[t.meta&&e.jsx("span",{className:"wk-line-num",children:t.meta}),t.tags&&t.tags.map((r,s)=>e.jsx("span",{className:"wk-line-tag",children:r},s))]})]})})}function mo({section:t,data:o,onOpen:n}){const[r,s]=i.useState(!1),a=Jn[t.id];return e.jsxs("div",{className:"wk-card",children:[e.jsxs("div",{className:"wk-card-head",children:[e.jsx("span",{className:"wk-card-no",children:t.no}),e.jsx("h3",{className:"wk-card-title",children:t.title}),e.jsx("span",{className:"wk-card-tagline",children:t.tagline})]}),e.jsx("div",{className:"wk-card-cover",children:a&&!r?e.jsx("img",{src:a,alt:"",onError:()=>s(!0)}):e.jsx("div",{className:"wk-card-cover-ph","aria-hidden":"true",children:e.jsx("span",{className:"wk-card-cover-no",children:t.no})})}),e.jsx(po,{section:t,data:o,onOpen:n})]})}function po({section:t,data:o,onOpen:n}){return e.jsxs("div",{className:"wk-card-body",children:[t.items&&e.jsx("ul",{className:"wk-list",children:t.items.map((r,s)=>e.jsx(ht,{item:r,onOpen:n},s))}),t.groups&&t.groups.map((r,s)=>e.jsxs("div",{className:"wk-sub",children:[e.jsx("div",{className:"wk-sub-head",children:r.heading}),e.jsx("ul",{className:"wk-list",children:r.items.map((a,l)=>e.jsx(ht,{item:{name:a},onOpen:n},l))})]},s)),(t.awards||t.footer)&&e.jsxs("div",{className:"wk-foot",children:[t.awards&&e.jsxs("p",{className:"wk-foot-line",children:[e.jsx("span",{className:"wk-foot-label",children:o.awardsLabel}),e.jsx("span",{className:"wk-foot-val accent",children:t.awards.join("  ·  ")})]}),t.footer&&e.jsx("p",{className:"wk-foot-line",children:t.footer})]})]})}function ho({item:t,data:o,lang:n,onClose:r}){const[s,a]=i.useState(!1),l=co(t.slug,n),u=l&&l.title||t.name,m=l&&l.banner,p=l?l.link||t.link:null,h=l?l.tags||t.tags:null,w=l?[t.meta,l.role].filter(Boolean).join("  ·  "):"";return e.jsxs(e.Fragment,{children:[e.jsx(R.div,{className:"wk-detail-backdrop",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},onClick:r}),e.jsxs(R.div,{className:"wk-detail",initial:{opacity:0,scale:.985,y:8},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.99,y:6},transition:{duration:.42,ease:uo},children:[e.jsx("button",{className:"wk-detail-close",onClick:r,"aria-label":o.closeLabel,children:"✕"}),m&&!s?e.jsx("div",{className:"wk-detail-banner",children:e.jsx("img",{src:m,alt:u,onError:()=>a(!0)})}):e.jsx("div",{className:"wk-detail-banner is-ph","aria-hidden":"true",children:e.jsx("span",{className:"wk-detail-ph-text",children:u})}),e.jsxs("article",{className:"wk-detail-article",children:[e.jsxs("header",{className:"wk-detail-head",children:[e.jsx("h3",{className:"wk-detail-title",children:u}),w&&e.jsx("div",{className:"wk-detail-sub",children:w}),h&&h.length>0&&e.jsx("div",{className:"wk-detail-tags",children:h.map((b,L)=>e.jsx("span",{className:"wk-badge",children:b},L))})]}),l&&l.body?e.jsx("div",{className:"wk-md",children:e.jsx(rn,{remarkPlugins:[ln],rehypePlugins:[an],children:l.body})}):e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"wk-detail-desc",children:o.detailPlaceholder}),e.jsx("div",{className:"wk-detail-ph-img","aria-hidden":"true",children:e.jsx("span",{className:"wk-detail-ph-img-label",children:o.phImageLabel})}),e.jsxs("span",{className:"wk-detail-link is-ph",role:"button","aria-disabled":"true",children:[o.phButtonLabel," ",e.jsx("span",{"aria-hidden":"true",children:"↗"})]})]}),p&&e.jsxs("a",{className:"wk-detail-link",href:p,target:"_blank",rel:"noopener noreferrer",children:[o.visitLabel," ",e.jsx("span",{"aria-hidden":"true",children:"↗"})]})]})]})]})}function fo({lang:t,innerRef:o}){const n=Xn[t],r=n.sections,s=r.length,[a,l]=i.useState(null),u=i.useRef(null),m=i.useRef(null),{scrollYProgress:p}=qe({target:u,offset:["start start","end end"]}),[h,w]=i.useState(0);i.useEffect(()=>{const y=m.current;if(!y)return;const M=()=>w(Math.max(0,y.scrollWidth-window.innerWidth));M();const N=new ResizeObserver(M);return N.observe(y),window.addEventListener("resize",M),()=>{N.disconnect(),window.removeEventListener("resize",M)}},[s,t]);const b=X(p,[0,1],[0,-h]),L=X(p,[.85,1],[1,0]);return i.useEffect(()=>{if(!a)return;const y=N=>N.key==="Escape"&&l(null);window.addEventListener("keydown",y);const M=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{window.removeEventListener("keydown",y),document.body.style.overflow=M}},[a]),e.jsxs("section",{className:"works",lang:t,ref:o,children:[e.jsx("div",{className:"wk-gallery",ref:u,style:{height:`calc(100vh + ${h}px)`},children:e.jsxs("div",{className:"wk-gallery-sticky",children:[e.jsx("span",{className:"wk-gallery-title",children:n.title}),e.jsx(R.div,{className:"wk-track",ref:m,style:{x:b},children:r.map(y=>e.jsx(mo,{section:y,data:n,onOpen:l},y.id))}),e.jsx("div",{className:"wk-progress","aria-hidden":"true",children:e.jsx(R.div,{className:"wk-progress-fill",style:{scaleX:p}})}),e.jsx(R.span,{className:"wk-hint",style:{opacity:L},"aria-hidden":"true",children:n.hint})]})}),e.jsx(on,{children:a&&e.jsx(ho,{item:a,data:n,lang:t,onClose:()=>l(null)},a.slug||a.name)})]})}function go(){const{progress:t}=zt(),[o,n]=i.useState(!1),[r,s]=i.useState(!1),[a,l]=i.useState(!1),u=i.useRef(0);if(u.current=Math.max(u.current,Math.min(Math.max(t,0),100)),i.useEffect(()=>{t>=100&&n(!0)},[t]),i.useEffect(()=>{if(!o)return;const w=setTimeout(()=>s(!0),400),b=setTimeout(()=>l(!0),1100);return()=>{clearTimeout(w),clearTimeout(b)}},[o]),a)return null;const m=34,p=2*Math.PI*m,h=p*(1-u.current/100);return e.jsx("div",{className:`loading-screen${r?" is-hidden":""}`,"aria-hidden":"true",children:e.jsx("div",{className:"loading-ring",children:e.jsxs("svg",{viewBox:"0 0 80 80",children:[e.jsx("circle",{className:"lr-track",cx:"40",cy:"40",r:m}),e.jsx("circle",{className:"lr-arc",cx:"40",cy:"40",r:m,style:{strokeDasharray:p,strokeDashoffset:h}})]})})})}const xo=cn(t=>({active:null,hovered:null,entered:!1,setActive:o=>t({active:o}),setHovered:o=>t({hovered:o}),enter:()=>t({entered:!0})}));function wo(){const t=xo(o=>o.setActive);return e.jsxs("mesh",{position:[0,0,-40],onClick:()=>t(null),children:[e.jsx("planeGeometry",{args:[600,300]}),e.jsx("meshBasicMaterial",{transparent:!0,opacity:0,depthWrite:!1})]})}function yo({lang:t,cueOpacity:o}){return e.jsx("section",{className:"hero",children:e.jsxs(R.div,{className:"scroll-cue",style:{opacity:o},"aria-hidden":"true",children:[e.jsx("span",{className:"scroll-cue-label",children:t==="en"?"SCROLL":"向下滚动"}),e.jsx("span",{className:"scroll-cue-track",children:e.jsx("span",{className:"scroll-cue-dot"})})]})})}function vo({lang:t}){return e.jsxs("footer",{className:"site-footer",lang:t,children:[e.jsx("span",{className:"site-footer-line",children:t==="en"?"Say hi":"找我聊聊"}),e.jsx("div",{className:"site-footer-links",children:Vn.map(o=>{const n=bt[o.id];return e.jsxs("a",{className:"site-footer-link",href:o.href,target:"_blank",rel:"noopener noreferrer","aria-label":o.label,title:o.label,children:[e.jsx(n,{}),e.jsx("span",{children:o.label})]},o.id)})}),e.jsx("span",{className:"site-footer-copy",children:"© 2026 Enge Lou"})]})}function bo({lang:t,onToggle:o}){return e.jsx("button",{className:"lang-toggle",onClick:o,"aria-label":"切换语言 / Switch language",children:t==="en"?"中文":"EN"})}function ko(){const[t,o]=i.useState("zh"),{scrollY:n}=qe(),r=i.useRef(null),{scrollYProgress:s}=qe({target:r,offset:["start end","start center"]}),a=X(s,[0,1],["rgba(8, 11, 18, 0)","rgba(8, 11, 18, 0.41)"]);X(s,[0,1],["blur(0px)","blur(10px)"]);const l=X(n,[0,520],[0,.4]),u=X(n,[0,160],[1,0]);X(n,[0,240],[1,0]);const m=typeof window<"u"?window.innerHeight:800,p=X(n,[m*.5,m*1.1],[0,1]),h=X(n,[0,280],[1,0]),[w,b]=i.useState(null);i.useEffect(()=>{let C=!0;return En(t).then(le=>{C&&b(le)}),()=>{C=!1}},[t]);const L=X(n,[m*.15,m*.45],[1,0]),y=X(n,[m*.15,m*.45],["blur(0px)","blur(16px)"]),[M,N]=i.useState(!1);sn(n,"change",C=>N(C>m*.45));const[ie,pe]=i.useState(()=>typeof window<"u"&&window.innerWidth<768);return i.useEffect(()=>{const C=()=>pe(window.innerWidth<768);return window.addEventListener("resize",C),()=>window.removeEventListener("resize",C)},[]),e.jsxs(e.Fragment,{children:[e.jsx(go,{}),e.jsx("div",{className:"scene-bg",children:e.jsx(st,{shadows:{type:nn},dpr:[1,1.5],camera:{position:[0,5,19],fov:39,near:.1,far:500},gl:{antialias:!1,stencil:!1,depth:!0,toneMapping:tn},children:e.jsxs(i.Suspense,{fallback:null,children:[e.jsx(wo,{}),e.jsx(wn,{})]})})}),e.jsx(R.div,{className:"scrim",style:{opacity:l},"aria-hidden":"true"}),e.jsx(R.div,{className:"stage-fog",style:{background:a},"aria-hidden":"true"}),e.jsx(R.div,{className:"glass-rail",style:{opacity:p},"aria-hidden":"true"}),e.jsx(bo,{lang:t,onToggle:()=>o(C=>C==="en"?"zh":"en")}),e.jsxs(R.div,{className:"hero-chrome",style:{opacity:h},"aria-hidden":"true",children:[e.jsx("div",{className:"hero-frame"}),e.jsx("span",{className:"hero-mark tl",children:"+"}),e.jsx("span",{className:"hero-mark tr",children:"+"}),e.jsx("span",{className:"hero-mark bl",children:"+"}),e.jsx("span",{className:"hero-mark br",children:"+"}),e.jsxs("div",{className:"hero-meta hm-tl",children:[e.jsx("span",{className:"hm-name",children:"Enge"}),e.jsx("span",{children:t==="zh"?"应用型 AI Agent 开发者 / 南洋理工大学 AI 硕士":"Applied AI Agent Developer / MSc AI, NTU"})]}),e.jsx("div",{className:"hero-meta hm-tr",children:"Portfolio — 2026"}),e.jsx("div",{className:"hero-meta hm-bl",children:"Code · Art · Play"}),e.jsx("div",{className:"hero-meta hm-right",children:"Based in Singapore"})]}),w&&e.jsx(R.div,{className:`lanyard-overlay${M?" is-off":""}`,style:{opacity:L,filter:y},children:e.jsx(kn,{position:ie?[0,0,20]:[0,0,15],offsetX:ie?0:-2.4,gravity:[0,-40,0],frontImage:w.front,backImage:w.back,lanyardImage:w.band,lanyardWidth:1},t)}),e.jsx(Pn,{}),e.jsxs("main",{className:"content",children:[e.jsx(yo,{lang:t,cueOpacity:u}),e.jsx(Yn,{lang:t}),e.jsx(fo,{lang:t,innerRef:r}),e.jsx(vo,{lang:t})]})]})}jt(document.getElementById("root")).render(e.jsx(ko,{}));
