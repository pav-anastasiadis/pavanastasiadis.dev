'use client';

import React, { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 32;
const CELL_SIZE = 16;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

const COLORS = ['#ff00ff', '#00ff41', '#00ffff', '#ffff00', '#ff6600', '#ffffff', '#000000'];

export default function PixelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentColor, setCurrentColor] = useState(COLORS[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixels, setPixels] = useState<Record<string, string>>({});

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }
  };

  const drawPixels = (ctx: CanvasRenderingContext2D) => {
    Object.entries(pixels).forEach(([key, color]) => {
      const [x, y] = key.split(',').map(Number);
      ctx.fillStyle = color;
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    drawPixels(ctx);
    drawGrid(ctx);
  };

  useEffect(() => {
    renderCanvas();
  }, [pixels]);

  const paintPixel = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      const key = `${x},${y}`;
      if (pixels[key] !== currentColor) {
        setPixels((prev) => ({ ...prev, [key]: currentColor }));
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    paintPixel(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      paintPixel(e);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setPixels({});
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        fontFamily: 'var(--font-terminal)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '10px',
          padding: '10px',
          border: '2px solid #00ff41',
          backgroundColor: '#000000',
        }}
      >
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setCurrentColor(color)}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: color,
              border: currentColor === color ? '3px solid #ffffff' : '1px solid #333333',
              cursor: 'pointer',
            }}
            aria-label={`Select color ${color}`}
          />
        ))}
        <button
          onClick={clearCanvas}
          style={{
            marginLeft: '10px',
            padding: '0 15px',
            backgroundColor: '#ff00ff',
            color: '#ffffff',
            border: '2px solid #ffffff',
            cursor: 'pointer',
            fontFamily: 'var(--font-pixel)',
            fontSize: '12px',
            textTransform: 'uppercase',
          }}
        >
          Clear
        </button>
      </div>

      <div
        style={{
          border: '4px solid #00ffff',
          boxShadow: '0 0 10px #00ffff, inset 0 0 10px #00ffff',
          backgroundColor: '#111111',
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
          cursor: 'crosshair',
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          data-testid="demo-interactive"
          style={{
            display: 'block',
          }}
        />
      </div>

      <div style={{ color: '#00ff41', marginTop: '10px' }}>
        Selected: <span style={{ color: currentColor }}>{currentColor}</span>
      </div>
    </div>
  );
}
