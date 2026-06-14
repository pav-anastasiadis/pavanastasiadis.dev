'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

const MIN_CELL = 4;
const MAX_CELL = 40;
const STEP_CELL = 2;
const DEFAULT_CELL = 16;
const RECENT_MAX = 4;
const BG_COLOR = '#111111';
const GRID_COLOR = '#333333';
const NEON = '#00ff41';
const PINK = '#ff00ff';

type Pixels = Record<string, string>;

export default function PixelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  const [currentColor, setCurrentColor] = useState(PINK);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [cellSize, setCellSize] = useState(DEFAULT_CELL);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixels, setPixels] = useState<Pixels>({});
  const [area, setArea] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setArea({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cols = Math.max(1, Math.floor(area.w / cellSize));
  const rows = Math.max(1, Math.floor(area.h / cellSize));
  const w = cols * cellSize;
  const h = rows * cellSize;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, w, h);

    Object.entries(pixels).forEach(([key, color]) => {
      const [x, y] = key.split(',').map(Number);
      if (x < cols && y < rows) {
        ctx.fillStyle = color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    });

    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;
    for (let i = 0; i <= cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, h);
      ctx.stroke();
    }
    for (let j = 0; j <= rows; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * cellSize);
      ctx.lineTo(w, j * cellSize);
      ctx.stroke();
    }
  }, [pixels, cols, rows, cellSize, w, h]);

  const pushRecent = useCallback((color: string) => {
    setRecentColors((prev) => {
      const filtered = prev.filter((c) => c !== color);
      return [color, ...filtered].slice(0, RECENT_MAX);
    });
  }, []);

  const paintPixel = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      const key = `${x},${y}`;
      if (pixels[key] !== currentColor) {
        setPixels((prev) => ({ ...prev, [key]: currentColor }));
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    pushRecent(currentColor);
    paintPixel(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) paintPixel(e);
  };

  const handleMouseUp = () => setIsDrawing(false);
  const handleMouseLeave = () => setIsDrawing(false);

  const clearCanvas = () => setPixels({});

  const exportPng = () => {
    if (cols === 0 || rows === 0) return;
    const off = document.createElement('canvas');
    off.width = cols;
    off.height = rows;
    const ctx = off.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, cols, rows);
    Object.entries(pixels).forEach(([key, color]) => {
      const [x, y] = key.split(',').map(Number);
      if (x < cols && y < rows) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    });
    off.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pixel-art-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 12px',
    backgroundColor: PINK,
    color: '#ffffff',
    border: '2px solid #ffffff',
    cursor: 'pointer',
    fontFamily: 'var(--font-pixel)',
    fontSize: '12px',
    textTransform: 'uppercase',
  };

  const swatchStyle = (color: string, selected: boolean): React.CSSProperties => ({
    width: '36px',
    height: '36px',
    backgroundColor: color,
    border: selected ? `3px solid ${NEON}` : '1px solid #333333',
    cursor: 'pointer',
    padding: 0,
  });

  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        width: '100%',
        height: '80vh',
        minHeight: '520px',
        fontFamily: 'var(--font-terminal)',
      }}
    >
      <aside
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '220px',
          flexShrink: 0,
          padding: '16px',
          border: `2px solid ${NEON}`,
          backgroundColor: '#000000',
          color: NEON,
        }}
      >
        <div>
          <label htmlFor="pc-color" style={labelStyle}>
            Color
          </label>
          <input
            id="pc-color"
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              background: 'transparent',
              border: `1px solid ${NEON}`,
              cursor: 'pointer',
              padding: 0,
            }}
          />
        </div>

        <div role="group" aria-labelledby="pc-recent-label">
          <span id="pc-recent-label" style={labelStyle}>
            Recent
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {Array.from({ length: RECENT_MAX }).map((_, i) => {
              const color = recentColors[i];
              if (!color) {
                return (
                  <div
                    key={`empty-${i}`}
                    style={{
                      width: '36px',
                      height: '36px',
                      border: '1px dashed #333333',
                      backgroundColor: 'transparent',
                    }}
                  />
                );
              }
              return (
                <button
                  key={`${color}-${i}`}
                  onClick={() => setCurrentColor(color)}
                  style={swatchStyle(color, currentColor === color)}
                  aria-label={`Select color ${color}`}
                />
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="pc-cell-size" style={labelStyle}>
            Cell size: {cellSize}px
          </label>
          <input
            id="pc-cell-size"
            type="range"
            min={MIN_CELL}
            max={MAX_CELL}
            step={STEP_CELL}
            value={cellSize}
            onChange={(e) => setCellSize(Number(e.target.value))}
            style={{ width: '100%', accentColor: NEON }}
          />
        </div>

        <button onClick={exportPng} style={buttonStyle}>
          Export PNG
        </button>
        <button
          onClick={clearCanvas}
          style={{
            ...buttonStyle,
            backgroundColor: '#000000',
            border: `2px solid ${NEON}`,
            color: NEON,
          }}
        >
          Clear
        </button>

        <div style={{ marginTop: 'auto', fontSize: '11px', opacity: 0.7 }}>
          Grid: {cols}×{rows}
        </div>
      </aside>

      <div
        ref={areaRef}
        style={{
          flex: 1,
          minWidth: 0,
          backgroundColor: BG_COLOR,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          width={w}
          height={h}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          data-testid="demo-interactive"
          style={{
            display: 'block',
            cursor: 'crosshair',
          }}
        />
      </div>
    </div>
  );
}
