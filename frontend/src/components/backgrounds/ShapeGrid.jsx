import React, { useRef, useEffect } from 'react';

const ShapeGrid = ({
  direction = 'right',
  speed = 0.18,
  borderColor = 'rgba(30, 58, 138, 0.12)',
  squareSize = 63,
  hoverFillColor = 'rgba(30, 58, 138, 0.08)',
  shape = 'square',
  hoverTrailAmount = 4,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const trailCells = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const drawHex = (cx, cy, r) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const vx = cx + r * Math.cos(angle);
        const vy = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
    };

    const drawCircle = (cx, cy, r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.closePath();
    };

    const drawTriangle = (cx, cy, r, flip) => {
      ctx.beginPath();
      if (flip) {
        ctx.moveTo(cx, cy + r);
        ctx.lineTo(cx + r * Math.cos(Math.PI / 6), cy - r * Math.sin(Math.PI / 6));
        ctx.lineTo(cx - r * Math.cos(Math.PI / 6), cy - r * Math.sin(Math.PI / 6));
      } else {
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx + r * Math.cos(Math.PI / 6), cy + r * Math.sin(Math.PI / 6));
        ctx.lineTo(cx - r * Math.cos(Math.PI / 6), cy - r * Math.sin(Math.PI / 6));
      }
      ctx.closePath();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Update Scroll Offset
      const dx = direction === 'right' || direction === 'diagonal' ? 1 : direction === 'left' ? -1 : 0;
      const dy = direction === 'down' || direction === 'diagonal' ? 1 : direction === 'up' ? -1 : 0;

      gridOffset.current.x += speed * dx;
      gridOffset.current.y += speed * dy;

      // Keep offsets bounded by squareSize
      gridOffset.current.x = (gridOffset.current.x + squareSize) % squareSize;
      gridOffset.current.y = (gridOffset.current.y + squareSize) % squareSize;

      // Calculate number of rows/cols needed to cover viewport plus buffer
      const cols = Math.ceil(canvas.width / squareSize) + 2;
      const rows = Math.ceil(canvas.height / squareSize) + 2;

      // 2. Track Mouse Hover
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      
      let currentHoveredCell = null;
      if (mx >= 0 && my >= 0) {
        const hoverCol = Math.floor((mx - gridOffset.current.x) / squareSize);
        const hoverRow = Math.floor((my - gridOffset.current.y) / squareSize);
        currentHoveredCell = `${hoverCol},${hoverRow}`;

        // If hovered cell changed, add to trail
        if (trailCells.current.length === 0 || trailCells.current[0] !== currentHoveredCell) {
          trailCells.current.unshift(currentHoveredCell);
          if (trailCells.current.length > hoverTrailAmount) {
            trailCells.current.pop();
          }
        }
      } else {
        // Slowly decay trail if mouse leaves
        if (Math.random() < 0.1 && trailCells.current.length > 0) {
          trailCells.current.pop();
        }
      }

      // 3. Draw Grid
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 0.5;

      for (let c = -1; c < cols; c++) {
        for (let r = -1; r < rows; r++) {
          const cx = c * squareSize + gridOffset.current.x + squareSize / 2;
          const cy = r * squareSize + gridOffset.current.y + squareSize / 2;

          const cellKey = `${c},${r}`;
          const trailIdx = trailCells.current.indexOf(cellKey);
          const isHovered = currentHoveredCell === cellKey;

          // Fill color logic
          if (isHovered) {
            ctx.fillStyle = hoverFillColor;
            ctx.beginPath();
            if (shape === 'square') {
              ctx.rect(cx - squareSize / 2, cy - squareSize / 2, squareSize, squareSize);
            } else if (shape === 'hexagon') {
              drawHex(cx, cy, squareSize / 2);
            } else if (shape === 'circle') {
              drawCircle(cx, cy, squareSize / 3);
            } else if (shape === 'triangle') {
              drawTriangle(cx, cy, squareSize / 2, (c + r) % 2 === 0);
            }
            ctx.fill();
          } else if (trailIdx !== -1 && hoverTrailAmount > 0) {
            const alpha = 1 - (trailIdx + 1) / (hoverTrailAmount + 1);
            ctx.fillStyle = hoverFillColor.replace(/rgba?\(([^)]+)\)/, (match, parts) => {
              const channels = parts.split(',');
              channels[3] = ` ${(parseFloat(channels[3] || '1') * alpha).toFixed(3)}`;
              return `rgba(${channels.join(',')})`;
            });
            ctx.beginPath();
            if (shape === 'square') {
              ctx.rect(cx - squareSize / 2, cy - squareSize / 2, squareSize, squareSize);
            } else if (shape === 'hexagon') {
              drawHex(cx, cy, squareSize / 2);
            } else if (shape === 'circle') {
              drawCircle(cx, cy, squareSize / 3);
            } else if (shape === 'triangle') {
              drawTriangle(cx, cy, squareSize / 2, (c + r) % 2 === 0);
            }
            ctx.fill();
          }

          // Draw outline
          ctx.beginPath();
          if (shape === 'square') {
            ctx.rect(cx - squareSize / 2, cy - squareSize / 2, squareSize, squareSize);
          } else if (shape === 'hexagon') {
            drawHex(cx, cy, squareSize / 2);
          } else if (shape === 'circle') {
            drawCircle(cx, cy, squareSize / 3);
          } else if (shape === 'triangle') {
            drawTriangle(cx, cy, squareSize / 2, (c + r) % 2 === 0);
          }
          ctx.stroke();
        }
      }

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [direction, speed, borderColor, squareSize, hoverFillColor, shape, hoverTrailAmount]);

  return <canvas ref={canvasRef} className={`w-full h-full block ${className}`} />;
};

export default ShapeGrid;
