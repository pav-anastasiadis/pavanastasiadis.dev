'use client';

import { useEffect, useRef, useCallback } from 'react';

const GAP = 10;
const R = 2.5;
const ASPECT = 4 / 3;

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

function noise2d(x: number, y: number): number {
  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;
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
  function dot(gi: number, xx: number, yy: number) {
    const g = G[gi % 8];
    return g[0] * xx + g[1] * yy;
  }
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
  seed: number;
}

function makeBlob(x: number, y: number): Blob {
  const nLobes = (5 + Math.random() * 4) | 0;
  const angles: number[] = [];
  const radii: number[] = [];
  const baseR = 60 + Math.random() * 80;
  for (let i = 0; i < nLobes; i++) {
    angles.push((i / nLobes) * Math.PI * 2 + (Math.random() - 0.5) * 0.4);
    radii.push(0.5 + Math.random() * 0.8);
  }
  return { x, y, angles, radii, baseR, age: 0, seed: Math.random() * 999 };
}

function blobRadius(b: Blob, angle: number): number {
  let r = 0;
  for (let i = 0; i < b.angles.length; i++) {
    const diff = angle - b.angles[i];
    r += b.radii[i] * Math.exp(-2 * (1 - Math.cos(diff)));
  }
  return (r / b.angles.length) * b.baseR;
}

function blobInfluence(cx: number, cy: number, b: Blob): number {
  const dx = cx - b.x;
  const dy = cy - b.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  const expand = b.age * 0.6;
  const blobR = blobRadius(b, angle) + expand;
  const edge = dist - blobR;
  const waveWidth = 18 + b.age * 0.15;
  const wave = Math.exp(-(edge * edge) / (2 * waveWidth * waveWidth));
  const ripple = Math.sin(edge * 0.25 - b.age * 0.04) * 0.3;
  const fade = Math.max(0, 1 - b.age / 400);
  return (wave * 0.9 + ripple * wave * 0.4) * fade;
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

export default function InkWaveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const tRef = useRef(0);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ cols: 0, rows: 0, w: 0, h: 0 });

  const resize = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const containerW = container.clientWidth;
    const cols = Math.max(1, Math.floor(containerW / GAP));
    const rows = Math.max(1, Math.round(cols / ASPECT));
    const w = cols * GAP;
    const h = rows * GAP;

    canvas.width = w;
    canvas.height = h;
    sizeRef.current = { cols, rows, w, h };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { cols, rows, w, h } = sizeRef.current;
    if (cols === 0) return;

    ctx.clearRect(0, 0, w, h);

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const cx = col * GAP + GAP / 2;
        const cy = row * GAP + GAP / 2;

        let val = 0.08;
        val += coastWave(cx, cy, tRef.current, h) * 0.55;

        for (const b of blobsRef.current) {
          val += blobInfluence(cx, cy, b);
        }

        const opacity = Math.max(0.03, Math.min(1, val));
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${opacity})`;
        ctx.fill();
      }
    }

    tRef.current += 0.008;
    for (const b of blobsRef.current) b.age += 1;
    blobsRef.current = blobsRef.current.filter((b) => b.age < 400);
    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    resize();

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const { w, h } = sizeRef.current;
      const sx = w / rect.width;
      const sy = h / rect.height;
      blobsRef.current.push(makeBlob((e.clientX - rect.left) * sx, (e.clientY - rect.top) * sy));
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    canvas.addEventListener('click', handleClick);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, [draw, resize]);

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        data-testid="gif-placeholder"
        className="w-full cursor-crosshair rounded-sm"
        style={{ height: 'auto' }}
      />
    </div>
  );
}
