import React, { useEffect, useRef } from 'react';

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // ---------- CONFIG ----------
    const N = 12000;               // Reduced by 20%
    const FORM_N = 9120;          // Reduced by 20%
    const DOT_BASE_SIZE = 1.0;    // Smaller particles for finer resolution

    // Physics
    const FORMATION_SPEED = 0.12;    
    const SCATTER_SPEED = 0.008;     
    
    // Layout
    const SCALE = 1.45;         
    const SPACING_X = 110;      
    const SPACING_Y = 80;      

    // Motion
    const SCATTER_MARGIN = 100;
    const SCATTER_RETARGET_MS = [6000, 10000]; 
    
    // Micro-movements
    const JITTER_SPEED = 0.002;      
    const JITTER_AMP = 3.0;          
    
    // Macro-movements
    const ORBIT_RADIUS = 30;         
    const ORBIT_SPEED = 0.0005;      
    
    const COLORS = ["#335DFF", "#E5E7EB", "#4A4A4A"];

    // ---------- SPRITES ----------
    const SPRITE_SIZE = 64;
    const SPRITE_CENTER = 32;
    const SPRITE_RADIUS = 12; 
    
    const sprites: Record<string, HTMLCanvasElement[]> = {};
    
    const createSprite = (color: string, blurPx: number) => {
      const c = document.createElement('canvas');
      c.width = SPRITE_SIZE;
      c.height = SPRITE_SIZE;
      const x = c.getContext('2d');
      if (!x) return c;
      
      if (blurPx > 0) {
        x.filter = `blur(${blurPx}px)`;
      }
      
      x.fillStyle = color;
      x.beginPath();
      x.arc(SPRITE_CENTER, SPRITE_CENTER, SPRITE_RADIUS, 0, Math.PI * 2);
      x.fill();
      return c;
    };

    COLORS.forEach(color => {
      sprites[color] = [
        createSprite(color, 4), 
        createSprite(color, 2), 
        createSprite(color, 0)  
      ];
    });

    // ---------- STATE ----------
    let W = 0;
    let H = 0;
    let DPR = 1;
    let animationFrameId: number;
    let last = performance.now();
    let scatterTimer = 0;
    
    // Idle Animation State
    let lastMouseMove = performance.now();
    const IDLE_START_DELAY = 3000; // 3 seconds before idle mode starts
    const IDLE_GATHER_DURATION = 5000; // Hold shape for 5s
    const IDLE_SCATTER_DURATION = 4000; // Scatter for 4s
    const IDLE_CYCLE_TOTAL = IDLE_GATHER_DURATION + IDLE_SCATTER_DURATION;

    const mouse = { x: -5000, y: -5000, inside: false, onInteractive: false };

    // ---------- SHAPE GENERATION ----------
    const shapeCanvas = document.createElement("canvas");
    const shapeCtx = shapeCanvas.getContext("2d", { willReadFrequently: true });
    
    interface ShapePoint {
      x: number;
      y: number;
    }

    function shuffleArray(array: any[]) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function buildCoinPointCloud({ size = 300, symbol = "$", ring = 20, font = "700 160px system-ui" }) {
      if (!shapeCtx) return { pts: [] as ShapePoint[], size };

      shapeCanvas.width = size;
      shapeCanvas.height = size;
      shapeCtx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;

      shapeCtx.beginPath();
      shapeCtx.lineWidth = ring;
      shapeCtx.strokeStyle = "#000";
      shapeCtx.arc(cx, cy, size * 0.38, 0, Math.PI * 2);
      shapeCtx.stroke();

      shapeCtx.font = font;
      shapeCtx.textAlign = "center";
      shapeCtx.textBaseline = "middle";
      shapeCtx.fillStyle = "#000";
      shapeCtx.fillText(symbol, cx, cy + size * 0.02);

      const img = shapeCtx.getImageData(0, 0, size, size);
      const data = img.data;
      const step = 1; // Maximum density scanning for sharper edges 

      let pts: ShapePoint[] = [];
      for (let y = 0; y < size; y += step) {
        for (let x = 0; x < size; x += step) {
          const i = (y * size + x) * 4;
          if (data[i + 3] > 60) {
            pts.push({ x, y });
          }
        }
      }
      return { pts: shuffleArray(pts), size };
    }

    const COIN_DOLLAR = buildCoinPointCloud({ symbol: "$" });
    const COIN_CRYPTO = buildCoinPointCloud({ symbol: "₿" }); 
    const SHAPE_SIZE = COIN_DOLLAR.size;

    // ---------- PARTICLES ----------
    let P: any[] = [];
    
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    // IMPORTANT: Make sure scatter targets are within current bounds
    function randomScatterTarget(width: number, height: number) {
      // Fallback to minimal dimensions if 0 to prevent sticking to top-left
      const safeW = width || 1000;
      const safeH = height || 800;
      return {
        x: rand(-50, safeW + 50),
        y: rand(-50, safeH + 50)
      };
    }

    const initParticles = (width: number, height: number) => {
      P = [];
      const halfForm = Math.floor(FORM_N / 2);

      for (let i = 0; i < N; i++) {
        const st = randomScatterTarget(width, height);
        const isForm = i < FORM_N;
        
        let shapeIndex = -1;
        let shapeType = 0; 

        if (isForm) {
            if (i < halfForm) {
                shapeType = 0;
                shapeIndex = i % COIN_DOLLAR.pts.length;
            } else {
                shapeType = 1;
                shapeIndex = (i - halfForm) % COIN_CRYPTO.pts.length;
            }
        }

        const z = Math.random(); 
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        
        let spriteIndex = 2;
        if (z < 0.4) spriteIndex = 0;
        else if (z < 0.75) spriteIndex = 1;

        let currentSize = DOT_BASE_SIZE * (0.6 + z * 0.8);
        if (color === "#E5E7EB") {
           currentSize *= 0.5; 
        }

        P.push({
          x: rand(0, width),
          y: rand(0, height),
          stx: st.x,
          sty: st.y,
          z: z, 
          size: currentSize,
          baseAlpha: 0.3 + z * 0.5,
          alpha: 0.3 + z * 0.5, 
          color: color,
          spriteIndex: spriteIndex,
          inForm: isForm,
          shapeIndex: shapeIndex,
          shapeType: shapeType,
          phase: rand(0, Math.PI * 2),
        });
      }
      
      P.sort((a, b) => a.z - b.z);
    };

    const handleResize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newW = rect.width;
      const newH = rect.height;
      
      // Prevent init with 0 dimensions which causes particles to bunch at 0,0
      if (newW === 0 || newH === 0) return;

      W = newW;
      H = newH;
      DPR = Math.min(window.devicePixelRatio || 1, 2.0);
      
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      
      if (P.length === 0) {
        initParticles(W, H);
      } else {
        // If resizing, update scatter targets for existing particles so they don't get stuck in old bounds (or 0,0)
        for (const p of P) {
           // We only update if the targets are way out of bounds or clumped at 0
           // But simplest is to just re-assign valid scatter targets for the new size
           // This prevents the "flying from top-left" issue if they were initialized at 0 size
           const st = randomScatterTarget(W, H);
           p.stx = st.x;
           p.sty = st.y;
        }
      }
    };

    const retargetScatter = (dt: number) => {
      scatterTimer -= dt;
      if (scatterTimer <= 0) {
        scatterTimer = rand(SCATTER_RETARGET_MS[0], SCATTER_RETARGET_MS[1]);
        const fraction = 0.15; 
        for (const p of P) {
          if (Math.random() < fraction) {
            const st = randomScatterTarget(W, H);
            p.stx = st.x;
            p.sty = st.y;
          }
        }
      }
    };

    // ---------- LOOP ----------
    const frame = (now: number) => {
      const dt = now - last;
      last = now;

      retargetScatter(dt);

      // --- RESPONSIVE LAYOUT LOGIC ---
      // If width > 800px (Desktop), move center to 70% width.
      const isDesktop = W > 800;
      const ax = isDesktop ? W * 0.70 : W / 2;
      const ay = H / 2;
      
      // Idle Logic - replaced with Global Cycle + Inversion Logic
      // "If state is random - gather from mouse... if form - break similarly"
      
      const cyclePos = now % IDLE_CYCLE_TOTAL;
      const isGlobalGather = cyclePos < IDLE_GATHER_DURATION;
      
      let formationActive = isGlobalGather;

      if (mouse.inside) {
          if (mouse.onInteractive) {
             formationActive = false; // Hover button -> Scatter
          } else {
             // Mouse move -> Invert state
             // If Random (Scatter) -> Gather
             // If Form (Gather) -> Break (Scatter)
             formationActive = !isGlobalGather;
          }
      }
      
      const halfSize = (SHAPE_SIZE * SCALE) / 2;
      const spacingX = SPACING_X * SCALE; 
      const spacingY = SPACING_Y * SCALE;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);
      
      const orbitX = Math.sin(now * ORBIT_SPEED) * ORBIT_RADIUS;
      const orbitY = Math.cos(now * ORBIT_SPEED * 0.7) * ORBIT_RADIUS; 
      
      for (const p of P) {
        let desiredTx, desiredTy;
        let currentSpeed;
        let targetAlpha;

        if (p.inForm && formationActive && p.shapeIndex !== -1) {
          // FORMATION STATE
          currentSpeed = FORMATION_SPEED;
          targetAlpha = 1.0; 

          const pts = p.shapeType === 0 ? COIN_DOLLAR.pts : COIN_CRYPTO.pts;
          // Guard against potential undefined if font loaded late or resize weirdness
          const base = pts[p.shapeIndex] || { x: 0, y: 0 }; 
          
          let centerX = ax;
          let centerY = ay;

          if (p.shapeType === 0) {
            centerX = ax - spacingX - halfSize;
            centerY = ay - spacingY - halfSize;
          } else {
            centerX = ax + spacingX - halfSize;
            centerY = ay + spacingY - halfSize;
          }
          
          const jitterX = Math.sin(now * JITTER_SPEED + p.phase) * JITTER_AMP;
          const jitterY = Math.cos(now * JITTER_SPEED + p.phase) * JITTER_AMP;

          desiredTx = centerX + (base.x * SCALE) + jitterX + orbitX;
          desiredTy = centerY + (base.y * SCALE) + jitterY + orbitY;

        } else {
          // SCATTER STATE
          currentSpeed = SCATTER_SPEED;
          targetAlpha = p.baseAlpha * 0.3; 

          desiredTx = p.stx;
          desiredTy = p.sty;
          
          p.stx += Math.sin(now * 0.0001 + p.phase) * 0.05;
          p.sty += Math.cos(now * 0.0001 + p.phase + 10) * 0.05;
        }

        // MOVEMENT
        // Safety check to prevent NaN propagation if a target was invalid
        if (Number.isNaN(desiredTx)) desiredTx = p.x;
        if (Number.isNaN(desiredTy)) desiredTy = p.y;

        p.x += (desiredTx - p.x) * currentSpeed;
        p.y += (desiredTy - p.y) * currentSpeed;
        
        // ALPHA TRANSITION
        p.alpha += (targetAlpha - p.alpha) * 0.05;

        // Draw
        if (p.alpha > 0.01) {
            ctx.globalAlpha = p.alpha;
            const sprite = sprites[p.color][p.spriteIndex];
            const ratio = p.size / SPRITE_RADIUS; 
            const drawSize = SPRITE_SIZE * ratio; 
            
            ctx.drawImage(
              sprite, 
              p.x - drawSize / 2, 
              p.y - drawSize / 2, 
              drawSize, 
              drawSize
            );
        }
      }

      animationFrameId = requestAnimationFrame(frame);
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseMove = performance.now();
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const inX = e.clientX >= rect.left && e.clientX <= rect.right;
      const inY = e.clientY >= rect.top && e.clientY <= rect.bottom;
      
      if (inX && inY) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.inside = true;
      } else {
        mouse.inside = false;
      }
    };

    const handleInteractiveHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('button, a, input, [role="button"], .interactive-target');
      if (interactive) mouse.onInteractive = true;
    };

    const handleInteractiveLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('button, a, input, [role="button"], .interactive-target');
      if (interactive) mouse.onInteractive = false;
    };
    
    const handleContainerLeave = () => {
        mouse.inside = false;
    };

    const handleContainerClick = (e: MouseEvent) => {
        // Trigger interaction logic immediately on click
        lastMouseMove = performance.now();
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.inside = true;
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleContainerClick as any);
    document.addEventListener('mouseover', handleInteractiveHover, true); 
    document.addEventListener('mouseout', handleInteractiveLeave, true);
    
    container.addEventListener('mouseleave', handleContainerLeave);

    handleResize();
    requestAnimationFrame(frame);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleContainerClick as any);
      document.removeEventListener('mouseover', handleInteractiveHover, true);
      document.removeEventListener('mouseout', handleInteractiveLeave, true);
      container.removeEventListener('mouseleave', handleContainerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      style={{
        maskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)'
      }}
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full pointer-events-none"
      />
    </div>
  );
}
