'use client';

import { useEffect, useRef, useCallback } from 'react';

const DOTS_PER_WIDTH = 240;
const DEFAULT_ASPECT = 4 / 3;
// Phone tuning: below this container width, 240 dots across lands under a
// 3px pitch (reads as mush) and wide aspects collapse to a sliver — so the
// grid goes coarser and the frame no wider than 4:3.
const NARROW_BREAK = 480;
const NARROW_ASPECT = 4 / 3;
const NARROW_DOTS_PER_WIDTH = 80;
const MAX_BLOBS = 16;

// Simplex-ish 2D noise setup
const P = new Uint8Array(512);
{
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * i) | 0;
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) P[i] = p[i & 255];
}

const G = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;

function dot(gi: number, xx: number, yy: number): number {
  const g = G[gi % 8];
  return g[0] * xx + g[1] * yy;
}

function noise2d(x: number, y: number): number {
  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const t = (i + j) * G2;
  const x0 = x - (i - t);
  const y0 = y - (j - t);
  const i1 = x0 > y0 ? 1 : 0;
  const j1 = x0 > y0 ? 0 : 1;
  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;
  const ii = i & 255;
  const jj = j & 255;
  let n0 = 0,
    n1 = 0,
    n2 = 0;
  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 > 0) {
    t0 *= t0;
    n0 = t0 * t0 * dot(P[ii + P[jj]], x0, y0);
  }
  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 > 0) {
    t1 *= t1;
    n1 = t1 * t1 * dot(P[ii + i1 + P[jj + j1]], x1, y1);
  }
  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 > 0) {
    t2 *= t2;
    n2 = t2 * t2 * dot(P[ii + 1 + P[jj + 1]], x2, y2);
  }
  return 70 * (n0 + n1 + n2);
}

interface Blob {
  x: number;
  y: number;
  angles: number[];
  radii: number[];
  baseR: number;
  age: number;
  maxAge: number;
  seed: number;
}

function makeBlob(x: number, y: number, canvasW: number, scale = 1, maxAge = 400): Blob {
  const nLobes = (5 + Math.random() * 4) | 0;
  const angles: number[] = [];
  const radii: number[] = [];
  const baseR = canvasW * (0.08 + Math.random() * 0.12) * scale;
  for (let i = 0; i < nLobes; i++) {
    angles.push((i / nLobes) * Math.PI * 2 + (Math.random() - 0.5) * 0.4);
    radii.push(0.5 + Math.random() * 0.8);
  }
  return { x, y, angles, radii, baseR, age: 0, maxAge, seed: Math.random() * 999 };
}

function blobRadius(b: Blob, angle: number): number {
  let r = 0;
  for (let i = 0; i < b.angles.length; i++) {
    const diff = angle - b.angles[i];
    r += b.radii[i] * Math.exp(-2 * (1 - Math.cos(diff)));
  }
  return (r / b.angles.length) * b.baseR;
}

function blobInfluence(cx: number, cy: number, b: Blob, interference: boolean): number {
  const dx = cx - b.x;
  const dy = cy - b.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  const expand = b.age * 0.6;
  const blobR = blobRadius(b, angle) + expand;
  const edge = dist - blobR;
  const waveWidth = 18 + b.age * 0.15;
  const envelope = Math.exp(-(edge * edge) / (2 * waveWidth * waveWidth));
  const fade = Math.max(0, 1 - b.age / b.maxAge);
  if (interference) {
    // Signed carrier wave: crests darken, troughs lighten. Summing signed
    // contributions lets a crest from one ripple cancel a trough from
    // another back to equilibrium, like water.
    return Math.sin(edge * 0.25 - b.age * 0.04) * envelope * fade * 0.55;
  }
  const ripple = Math.sin(edge * 0.25 - b.age * 0.04) * 0.3;
  return (envelope * 0.9 + ripple * envelope * 0.4) * fade;
}

function coastWave(cx: number, cy: number, t: number, h: number): number {
  const n1 = noise2d(cx * 0.008 + t * 0.12, cy * 0.006);
  const n2 = noise2d(cx * 0.015 - t * 0.08, cy * 0.012 + t * 0.05);
  const n3 = noise2d(cx * 0.003 + t * 0.04, cy * 0.004 - t * 0.06);
  const waveY = h * 0.5 + n3 * h * 0.35;
  const distFromWave = (cy - waveY) / h;
  const shore = Math.exp(-distFromWave * distFromWave * 8);
  return (n1 * 0.4 + n2 * 0.3) * shore + n3 * 0.15;
}

interface InkWaveGridProps {
  /** Width-to-height ratio of the dot grid. Higher = shorter band. */
  aspect?: number;
  /** Spawn ripples continuously while the pointer is dragged, not just on click. */
  drag?: boolean;
  /** Ripples are signed waves that cancel where crest meets trough. */
  interference?: boolean;
}

export default function InkWaveGrid({
  aspect = DEFAULT_ASPECT,
  drag = false,
  interference = false,
}: InkWaveGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const tRef = useRef(0);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ cols: 0, rows: 0, w: 0, h: 0, dpr: 1, gap: 0, r: 0 });
  const draggingRef = useRef(false);
  const lastSpawnRef = useRef({ x: 0, y: 0 });

  const resize = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const containerW = container.clientWidth;
    const narrow = containerW < NARROW_BREAK;
    const effAspect = narrow ? Math.min(aspect, NARROW_ASPECT) : aspect;
    const gap = Math.max(
      3,
      Math.round(containerW / (narrow ? NARROW_DOTS_PER_WIDTH : DOTS_PER_WIDTH))
    );
    const r = Math.max(1, gap * (narrow ? 0.33 : 0.22));
    const cols = Math.max(1, Math.floor(containerW / gap));
    const rows = Math.max(1, Math.round(cols / effAspect));
    const w = cols * gap;
    const h = rows * gap;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    sizeRef.current = { cols, rows, w, h, dpr, gap, r };
  }, [aspect]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { cols, rows, w, h, dpr, gap, r } = sizeRef.current;
    if (cols === 0) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#000';

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const cx = col * gap + gap / 2;
        const cy = row * gap + gap / 2;

        let val = 0.08;
        val += coastWave(cx, cy, tRef.current, h) * 0.55;

        let wave = 0;
        for (const b of blobsRef.current) {
          wave += blobInfluence(cx, cy, b, interference);
        }
        // Soft-clip the summed ripple field so stacked crests compress
        // toward a ceiling instead of blacking out the canvas.
        val += interference ? Math.tanh(wave * 1.2) * 0.7 : wave;

        const opacity = Math.max(0.03, Math.min(1, val));
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.globalAlpha = opacity;
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    tRef.current += 0.008;
    for (const b of blobsRef.current) b.age += 1;
    blobsRef.current = blobsRef.current.filter((b) => b.age < b.maxAge);
    rafRef.current = requestAnimationFrame(draw);
  }, [interference]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    resize();

    const toCanvas = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const { w, h } = sizeRef.current;
      return {
        x: ((e.clientX - rect.left) * w) / rect.width,
        y: ((e.clientY - rect.top) * h) / rect.height,
      };
    };

    const spawn = (x: number, y: number, scale = 1) => {
      // Interference ripples originate AT the cursor (tiny initial ring that
      // expands outward, like a raindrop) and live ~3s instead of ~6.7s.
      const blob = interference
        ? makeBlob(x, y, sizeRef.current.w, scale * 0.15, 180)
        : makeBlob(x, y, sizeRef.current.w, scale);
      blobsRef.current.push(blob);
      if (blobsRef.current.length > MAX_BLOBS) blobsRef.current.shift();
    };

    const handleClick = (e: MouseEvent) => {
      const p = toCanvas(e);
      spawn(p.x, p.y);
    };

    const handlePointerDown = (e: PointerEvent) => {
      const p = toCanvas(e);
      spawn(p.x, p.y);
      draggingRef.current = true;
      lastSpawnRef.current = p;
      canvas.setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const p = toCanvas(e);
      const dx = p.x - lastSpawnRef.current.x;
      const dy = p.y - lastSpawnRef.current.y;
      // Distance-throttled: drop a smaller ripple every ~10% of the canvas width.
      const minDist = sizeRef.current.w * 0.1;
      if (dx * dx + dy * dy >= minDist * minDist) {
        spawn(p.x, p.y, 0.45);
        lastSpawnRef.current = p;
      }
    };

    const handlePointerUp = () => {
      draggingRef.current = false;
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    if (drag) {
      canvas.addEventListener('pointerdown', handlePointerDown);
      canvas.addEventListener('pointermove', handlePointerMove);
      canvas.addEventListener('pointerup', handlePointerUp);
      canvas.addEventListener('pointercancel', handlePointerUp);
    } else {
      canvas.addEventListener('click', handleClick);
    }
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      if (drag) {
        canvas.removeEventListener('pointerdown', handlePointerDown);
        canvas.removeEventListener('pointermove', handlePointerMove);
        canvas.removeEventListener('pointerup', handlePointerUp);
        canvas.removeEventListener('pointercancel', handlePointerUp);
      } else {
        canvas.removeEventListener('click', handleClick);
      }
      cancelAnimationFrame(rafRef.current);
    };
  }, [draw, resize, drag, interference]);

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        data-testid="gif-placeholder"
        className="w-full cursor-crosshair rounded-sm"
        // pan-y keeps vertical page scrolling alive on touch while
        // horizontal drags feed the ripple trail.
        style={{ height: 'auto', touchAction: drag ? 'pan-y' : 'auto' }}
      />
    </div>
  );
}
