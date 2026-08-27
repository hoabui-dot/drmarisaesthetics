'use client'

import { useRef } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// ─── GLSL ────────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uHoverIntensity;

  varying vec2  vUv;
  varying float vElevation;

  // Simplex noise (3D)
  vec3 mod289v3(vec3 x) { return x - floor(x*(1./289.))*289.; }
  vec4 mod289v4(vec4 x) { return x - floor(x*(1./289.))*289.; }
  vec4 permute(vec4 x)  { return mod289v4(((x*34.)+1.)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1./6., 1./3.);
    const vec4 D = vec4(0., 0.5, 1., 2.);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289v3(i);
    vec4 p = permute(permute(permute(
      i.z+vec4(0.,i1.z,i2.z,1.))
      +i.y+vec4(0.,i1.y,i2.y,1.))
      +i.x+vec4(0.,i1.x,i2.x,1.));
    float n_ = 0.142857142857;
    vec3  ns = n_*D.wyz - D.xzx;
    vec4 j   = p - 49.*floor(p*ns.z*ns.z);
    vec4 x_  = floor(j*ns.z);
    vec4 y_  = floor(j - 7.*x_);
    vec4 x   = x_*ns.x + ns.yyyy;
    vec4 y   = y_*ns.x + ns.yyyy;
    vec4 h   = 1.0 - abs(x) - abs(y);
    vec4 b0  = vec4(x.xy, y.xy);
    vec4 b1  = vec4(x.zw, y.zw);
    vec4 s0  = floor(b0)*2.+1.;
    vec4 s1  = floor(b1)*2.+1.;
    vec4 sh  = -step(h, vec4(0.));
    vec4 a0  = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1  = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0  = vec3(a0.xy, h.x);
    vec3 p1  = vec3(a0.zw, h.y);
    vec3 p2  = vec3(a1.xy, h.z);
    vec3 p3  = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
    vec4 m = max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m = m*m;
    return 42.*dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main(){
    vUv = uv;

    // Two noise layers at different scales/speeds
    float n1 = snoise(vec3(position.x*0.5, position.y*0.5, uTime*0.15)) * 0.22;
    float n2 = snoise(vec3(position.x*1.1, position.y*1.1, uTime*0.28)) * 0.08;

    // Extra pulse when hovered
    float pulse = uHoverIntensity * snoise(vec3(position.x*0.8, position.y*0.8, uTime*0.6)) * 0.12;

    float elevation = n1 + n2 + pulse;
    vElevation = elevation;

    vec3 pos = position;
    pos.z += elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uHoverIntensity;

  varying vec2  vUv;
  varying float vElevation;

  void main(){
    // Richer blue palette — visible on white bg
    vec3 colorA = vec3(0.82, 0.93, 1.00);   // #d1edff  light sky
    vec3 colorB = vec3(0.55, 0.80, 0.98);   // #8cccfa  medium sky
    vec3 colorC = vec3(0.35, 0.68, 0.96);   // #59adF5  vivid sky

    // Blend by elevation
    float t = clamp((vElevation + 0.30) / 0.60, 0.0, 1.0);
    vec3 color = mix(colorA, colorB, t);
    color = mix(color, colorC, t * t * uHoverIntensity * 0.6);

    // Diagonal shimmer band
    float band = sin(vUv.x*4.0 + vUv.y*2.5 - uTime*0.5)*0.5+0.5;
    band = pow(band, 8.0) * 0.25;
    color += vec3(band*0.4, band*0.7, band);

    // Soft edge fade so it blends into the section bg
    float ex = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
    float ey = smoothstep(0.0, 0.08, vUv.y) * smoothstep(1.0, 0.92, vUv.y);
    float alpha = ex * ey * 0.85;

    gl_FragColor = vec4(color, alpha);
  }
`

// ─── Material ─────────────────────────────────────────────────────────────────

const WaveMaterial = shaderMaterial(
  { uTime: 0, uHoverIntensity: 0 },
  vertexShader,
  fragmentShader
)

extend({ WaveMaterial })

type WaveMaterialImpl = THREE.ShaderMaterial & {
  uTime: number
  uHoverIntensity: number
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    waveMaterial: Partial<WaveMaterialImpl> & {
      ref?: React.Ref<WaveMaterialImpl>
      transparent?: boolean
      depthWrite?: boolean
      side?: THREE.Side
    }
  }
}

// ─── Mesh ─────────────────────────────────────────────────────────────────────

function WaveMesh({ hoverIntensity }: { hoverIntensity: number }) {
  const matRef = useRef<WaveMaterialImpl>(null)
  const smoothed = useRef(0)

  useFrame(({ clock }) => {
    if (!matRef.current) return
    // Lerp hover intensity for smooth transition
    smoothed.current += (hoverIntensity - smoothed.current) * 0.05
    matRef.current.uTime = clock.getElapsedTime()
    matRef.current.uHoverIntensity = smoothed.current
  })

  return (
    // Flat, facing the camera directly — no tilt
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[12, 6, 96, 48]} />
      <waveMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

interface WaveSurfaceProps {
  hoverIntensity?: number
}

export function WaveSurface({ hoverIntensity = 0 }: WaveSurfaceProps) {
  return (
    // Full-size, pointer-events off, sits behind content
    <Canvas
      // Orthographic-style: camera looks straight down at the plane
      camera={{ position: [0, 0, 4], fov: 50 }}
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <WaveMesh hoverIntensity={hoverIntensity} />
    </Canvas>
  )
}
