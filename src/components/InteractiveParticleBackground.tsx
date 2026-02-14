import React, { useEffect, useRef } from 'react';

export function InteractiveParticleBackground({ fadeOnRight = true, fadeOnLeft = false, spawnFromMouse = false }: { fadeOnRight?: boolean, fadeOnLeft?: boolean, spawnFromMouse?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Config
    const PARTICLE_DENSITY_AREA = 100; // 1 particle per 100px^2
    const MOUSE_DIST = 250; // Attraction range
    const ATTRACT_FORCE = 0.08; // How strong they pull to mouse
    const FRICTION = 0.98; // Lower air resistance for faster movement
    const BASE_SPEED_MIN = 0.5; // Increased base speed
    const BASE_SPEED_MAX = 1.2; // Increased max speed
    
    let W = 0;
    let H = 0;
    let animationFrameId: number;
    let targetParticleCount = 0;

    const mouse = { x: -1000, y: -1000 };

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      isDust: boolean;
    }

    let particles: Particle[] = [];
    const colors = ["#3B82F6", "#9CA3AF", "#60A5FA", "#CBD5E1"];

    const init = () => {
      const area = W * H;
      targetParticleCount = Math.floor(area / PARTICLE_DENSITY_AREA);

      // If we are NOT spawning from mouse, we populate immediately
      if (!spawnFromMouse) {
          particles = [];
          for (let i = 0; i < targetParticleCount; i++) {
              createParticle();
          }
      } else {
        // If spawning from mouse, start with 0
        particles = [];
      }
    };

    const createParticle = (x?: number, y?: number, speedMultiplier: number = 1) => {
          const isDust = Math.random() < 0.5;
          // Max size 1.5px. Dust is 0.5-0.9px, Large is 1.0-1.5px
          const size = isDust 
              ? Math.random() * 0.4 + 0.5 
              : Math.random() * 0.5 + 1.0;

          // Random initial velocity
          const angle = Math.random() * Math.PI * 2;
          const speed = (Math.random() * (BASE_SPEED_MAX - BASE_SPEED_MIN) + BASE_SPEED_MIN) * speedMultiplier;

          const startX = x !== undefined ? x : Math.random() * W;
          const startY = y !== undefined ? y : Math.random() * H;

          particles.push({
              x: startX,
              y: startY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: size,
              color: colors[Math.floor(Math.random() * colors.length)],
              isDust: isDust,
          });
    }

    const handleResize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      
      init(); 
    };

    const update = () => {
      ctx.clearRect(0, 0, W, H);

      // Spawning logic for cursor mode
      if (spawnFromMouse && particles.length < targetParticleCount) {
         // Only spawn if mouse is on screen
         if (mouse.x > -500 && mouse.y > -500) {
             // Spawn a few particles per frame
             const spawnRate = 2; 
             for(let k=0; k<spawnRate; k++) {
                 if (particles.length < targetParticleCount) {
                    // Spawn at mouse with slightly higher speed to "emit"
                    createParticle(mouse.x, mouse.y, 1.5); 
                 }
             }
         }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Mouse Attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_DIST) {
            const force = (MOUSE_DIST - dist) / MOUSE_DIST; // 0 to 1
            const angle = Math.atan2(dy, dx);
            
            // Attract towards mouse
            // Dust moves slightly easier
            const strength = ATTRACT_FORCE * force * (p.isDust ? 1.2 : 1.0);
            
            p.vx += Math.cos(angle) * strength;
            p.vy += Math.sin(angle) * strength;
        }

        // 2. Physics & Movement
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        
        // Ensure minimum movement so they don't stop completely (Systematic drift)
        // If speed is too low, boost it slightly in current direction
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (currentSpeed < BASE_SPEED_MIN) {
            const angle = Math.atan2(p.vy, p.vx);
            p.vx = Math.cos(angle) * BASE_SPEED_MIN;
            p.vy = Math.sin(angle) * BASE_SPEED_MIN;
        }

        p.x += p.vx;
        p.y += p.vy;

        // 3. Bounce off walls
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > W) { p.x = W; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > H) { p.y = H; p.vy *= -1; }

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        // Fading logic: particles fade out as they approach the right edge
        if (fadeOnRight) {
             const fadeStart = W * 0.5; // Start fading at 50% width
             let positionAlpha = 1;
             if (p.x > fadeStart) {
                  // Linear fade from 1 to 0 between 50% and 100% width
                  positionAlpha = 1 - (p.x - fadeStart) / (W - fadeStart);
                  positionAlpha = Math.max(0, positionAlpha); // Clamp to 0
             }
             
             // Apply fadeOnLeft if active (fade out as approaching 0)
             if (fadeOnLeft) {
                const fadeEnd = W * 0.5; // End fading at 50% width
                if (p.x < fadeEnd) {
                    const leftAlpha = p.x / fadeEnd;
                    positionAlpha = Math.min(positionAlpha, leftAlpha);
                    positionAlpha = Math.max(0, positionAlpha);
                }
             }

             // Dust is more transparent
             const baseAlpha = p.isDust ? 0.4 : 0.7; 
             ctx.globalAlpha = baseAlpha * positionAlpha;
        } else if (fadeOnLeft) {
             // Only fadeOnLeft case
             const fadeEnd = W * 0.5; // End fading at 50% width
             let positionAlpha = 1;
             if (p.x < fadeEnd) {
                 positionAlpha = p.x / fadeEnd;
                 positionAlpha = Math.max(0, positionAlpha);
             }
             
             const baseAlpha = p.isDust ? 0.4 : 0.7;
             ctx.globalAlpha = baseAlpha * positionAlpha;
        } else {
             // Uniform alpha if no fade
             ctx.globalAlpha = p.isDust ? 0.4 : 0.7;
        }
        
        // Only draw if visible
        if (ctx.globalAlpha > 0.01) {
            ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        mouse.x = x;
        mouse.y = y;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
    }

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    handleResize();
    update();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [fadeOnRight, fadeOnLeft, spawnFromMouse]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
