'use client';

import { useEffect, useRef, useState } from 'react';

import InkWaveGrid from './InkWaveGrid';

const DOTS_PER_WIDTH = 240;
const DEFAULT_ASPECT = 4 / 3;
const MAX_RIPPLES = 16;
const RIPPLE_MAX_AGE = 180;

const VERT = `#version 300 es
in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2  uRes;   // drawing-buffer size in device px
uniform float uDpr;
uniform float uGap;   // grid pitch in canvas px
uniform float uDotR;  // dot radius in canvas px
uniform float uT;
uniform int   uCount;
uniform vec4  uRipple[${MAX_RIPPLES}]; // x, y, age, baseR
uniform vec4  uShape[${MAX_RIPPLES}];  // a1, p1, a2, p2 (lobe harmonics)

out vec4 outColor;

// 2D simplex noise (Ian McEwan / Ashima Arts, MIT)
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Same field as the CPU version's coastWave(), same frequencies.
float coastWave(vec2 c, float h) {
  float n1 = snoise(vec2(c.x * 0.008 + uT * 0.12, c.y * 0.006));
  float n2 = snoise(vec2(c.x * 0.015 - uT * 0.08, c.y * 0.012 + uT * 0.05));
  float n3 = snoise(vec2(c.x * 0.003 + uT * 0.04, c.y * 0.004 - uT * 0.06));
  float waveY = h * 0.5 + n3 * h * 0.35;
  float d = (c.y - waveY) / h;
  float shore = exp(-d * d * 8.0);
  return (n1 * 0.4 + n2 * 0.3) * shore + n3 * 0.15;
}

// Interference physics from the CPU version; two angular harmonics stand in
// for its random lobe shape.
float rippleWave(vec2 c, vec4 r, vec4 s) {
  vec2 d = c - r.xy;
  float dist = length(d);
  float angle = dist > 0.0001 ? atan(d.y, d.x) : 0.0;
  float lobes = 1.0 + s.x * cos(angle + s.y) + s.z * cos(2.0 * angle + s.w);
  float ringR = r.w * lobes + r.z * 0.6;
  float edge = dist - ringR;
  float ww = 18.0 + r.z * 0.15;
  float env = exp(-(edge * edge) / (2.0 * ww * ww));
  float fade = max(0.0, 1.0 - r.z / ${RIPPLE_MAX_AGE}.0);
  return sin(edge * 0.25 - r.z * 0.04) * env * fade * 0.55;
}

void main() {
  // Canvas-space px, y-down, matching the 2D implementation's coordinates.
  vec2 pos = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  vec2 cell = floor(pos / uGap);
  vec2 center = (cell + 0.5) * uGap;
  float h = uRes.y / uDpr;

  // Sample the field once per cell (at the dot center), like the CPU version.
  float val = 0.08 + coastWave(center, h) * 0.55;

  float wave = 0.0;
  for (int i = 0; i < ${MAX_RIPPLES}; i++) {
    if (i >= uCount) break;
    wave += rippleWave(center, uRipple[i], uShape[i]);
  }
  val += tanh(wave * 1.2) * 0.7;

  float opacity = clamp(val, 0.03, 1.0);

  float distPx = length(pos - center);
  float aa = fwidth(distPx);
  float dotMask = 1.0 - smoothstep(uDotR - aa, uDotR + aa, distPx);

  outColor = vec4(0.0, 0.0, 0.0, opacity * dotMask);
}
`;

interface Ripple {
  x: number;
  y: number;
  age: number;
  baseR: number;
  a1: number;
  p1: number;
  a2: number;
  p2: number;
}

interface InkWaveGridGLProps {
  /** Width-to-height ratio of the dot grid. Higher = shorter band. */
  aspect?: number;
  /** Spawn ripples continuously while the pointer is dragged, not just on click. */
  drag?: boolean;
}

/**
 * GPU version of InkWaveGrid (interference physics): the whole dot field is
 * one fragment shader, so the per-frame CPU cost is just a uniform upload.
 * Falls back to the Canvas-2D component when WebGL2 is unavailable.
 */
export default function InkWaveGridGL({
  aspect = DEFAULT_ASPECT,
  drag = false,
}: InkWaveGridGLProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
    if (!gl) {
      setFallback(true);
      return;
    }

    let raf = 0;
    let t = 0;
    let ripples: Ripple[] = [];
    let visible = true;
    const size = { w: 0, h: 0, gap: 3, r: 1, dpr: 1 };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let loc: Record<string, WebGLUniformLocation | null> = {};
    const rippleData = new Float32Array(MAX_RIPPLES * 4);
    const shapeData = new Float32Array(MAX_RIPPLES * 4);

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile failed');
      }
      return shader;
    };

    // All GL objects die with the context, so setup reruns on context restore.
    const setup = () => {
      const program = gl.createProgram()!;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? 'program link failed');
      }
      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(program, 'aPos');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      loc = Object.fromEntries(
        ['uRes', 'uDpr', 'uGap', 'uDotR', 'uT', 'uCount', 'uRipple', 'uShape'].map((name) => [
          name,
          gl.getUniformLocation(program, name),
        ])
      );
    };

    const resize = () => {
      const containerW = container.clientWidth;
      if (!containerW) return;
      const gap = Math.max(3, Math.round(containerW / DOTS_PER_WIDTH));
      const r = Math.max(1, gap * 0.22);
      const cols = Math.max(1, Math.floor(containerW / gap));
      const rows = Math.max(1, Math.round(cols / aspect));
      const dpr = window.devicePixelRatio || 1;
      size.w = cols * gap;
      size.h = rows * gap;
      size.gap = gap;
      size.r = r;
      size.dpr = dpr;
      canvas.width = size.w * dpr;
      canvas.height = size.h * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const drawFrame = () => {
      const n = Math.min(ripples.length, MAX_RIPPLES);
      for (let i = 0; i < n; i++) {
        const rp = ripples[i];
        rippleData.set([rp.x, rp.y, rp.age, rp.baseR], i * 4);
        shapeData.set([rp.a1, rp.p1, rp.a2, rp.p2], i * 4);
      }
      gl.uniform2f(loc.uRes, canvas.width, canvas.height);
      gl.uniform1f(loc.uDpr, size.dpr);
      gl.uniform1f(loc.uGap, size.gap);
      gl.uniform1f(loc.uDotR, size.r);
      gl.uniform1f(loc.uT, t);
      gl.uniform1i(loc.uCount, n);
      gl.uniform4fv(loc.uRipple, rippleData);
      gl.uniform4fv(loc.uShape, shapeData);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const tick = () => {
      drawFrame();
      t += 0.008;
      for (const rp of ripples) rp.age += 1;
      ripples = ripples.filter((rp) => rp.age < RIPPLE_MAX_AGE);
      raf = requestAnimationFrame(tick);
    };

    const toCanvas = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) * size.w) / rect.width,
        y: ((e.clientY - rect.top) * size.h) / rect.height,
      };
    };

    const spawn = (x: number, y: number, scale = 1) => {
      ripples.push({
        x,
        y,
        age: 0,
        baseR: size.w * (0.08 + Math.random() * 0.12) * scale * 0.15,
        a1: 0.08 + Math.random() * 0.12,
        p1: Math.random() * Math.PI * 2,
        a2: 0.04 + Math.random() * 0.08,
        p2: Math.random() * Math.PI * 2,
      });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
    };

    let dragging = false;
    let lastSpawn = { x: 0, y: 0 };

    const handleClick = (e: MouseEvent) => {
      const p = toCanvas(e);
      spawn(p.x, p.y);
    };

    const handlePointerDown = (e: PointerEvent) => {
      const p = toCanvas(e);
      spawn(p.x, p.y);
      dragging = true;
      lastSpawn = p;
      canvas.setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const p = toCanvas(e);
      const dx = p.x - lastSpawn.x;
      const dy = p.y - lastSpawn.y;
      const minDist = size.w * 0.1;
      if (dx * dx + dy * dy >= minDist * minDist) {
        spawn(p.x, p.y, 0.45);
        lastSpawn = p;
      }
    };

    const handlePointerUp = () => {
      dragging = false;
    };

    try {
      setup();
    } catch (err) {
      console.warn('InkWaveGridGL: shader setup failed, falling back to 2D', err);
      setFallback(true);
      return;
    }
    resize();

    const ro = new ResizeObserver(() => {
      resize();
      if (reducedMotion) drawFrame();
    });
    ro.observe(container);

    // Pause rendering while scrolled off-screen; a static first frame is
    // enough for visitors who prefer reduced motion.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (reducedMotion) return;
      if (visible && !raf) raf = requestAnimationFrame(tick);
      if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(canvas);

    if (reducedMotion) {
      drawFrame();
    } else if (drag) {
      canvas.addEventListener('pointerdown', handlePointerDown);
      canvas.addEventListener('pointermove', handlePointerMove);
      canvas.addEventListener('pointerup', handlePointerUp);
      canvas.addEventListener('pointercancel', handlePointerUp);
    } else {
      canvas.addEventListener('click', handleClick);
    }

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const handleContextRestored = () => {
      try {
        setup();
      } catch {
        setFallback(true);
        return;
      }
      resize();
      if (reducedMotion) drawFrame();
      else if (visible && !raf) raf = requestAnimationFrame(tick);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [aspect, drag]);

  if (fallback) {
    return <InkWaveGrid aspect={aspect} drag={drag} interference />;
  }

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        data-testid="gif-placeholder"
        data-renderer="webgl2"
        className="w-full cursor-crosshair rounded-sm"
        // pan-y keeps vertical page scrolling alive on touch while
        // horizontal drags feed the ripple trail.
        style={{ height: 'auto', touchAction: drag ? 'pan-y' : 'auto' }}
      />
    </div>
  );
}
