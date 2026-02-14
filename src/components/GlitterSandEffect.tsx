import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  isGlitter: boolean;
  angle: number; 
}

export function GlitterSandEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, isActive: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Configuration
    const particleCount = 25; // Optimized for performance
    const connectionRadius = 120; // Increased radius for better feel
    const returnSpeed = 0.05; 
    const moveSpeed = 0.12; // Faster response
    const friction = 0.9;

    // Find the card container to attach listeners to
    // We look for the closest parent with 'group' class or just use the window with bounding checks
    // Using capture phase on the parent container is best to ensure we get events even over interactive children
    const container = canvas.closest('.group') as HTMLElement || canvas.parentElement;

    const handleResize = () => {
      if (container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        initParticles();
      }
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const isGlitter = Math.random() > 0.7; 
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
          size: isGlitter ? Math.random() * 2 + 1 : Math.random() * 1.5,
          color: isGlitter 
            ? (Math.random() > 0.5 ? '#D4AF37' : '#FFFFFF') 
            : '#4A4A4A', 
          isGlitter,
          angle: Math.random() * Math.PI * 2
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        let targetX = p.originX;
        let targetY = p.originY;

        if (mouseRef.current.isActive) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionRadius) {
            const force = (connectionRadius - distance) / connectionRadius;
            const angle = Math.atan2(dy, dx);
            
            p.vx += Math.cos(angle) * force * moveSpeed * 5; // Increased force
            p.vy += Math.sin(angle) * force * moveSpeed * 5;
          }
        }

        const dxHome = p.originX - p.x;
        const dyHome = p.originY - p.y;
        
        p.vx += dxHome * returnSpeed * 0.1;
        p.vy += dyHome * returnSpeed * 0.1;

        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        
        if (p.isGlitter) {
          const opacity = 0.5 + Math.sin(Date.now() * 0.005 + p.originX) * 0.5;
          ctx.globalAlpha = opacity;
          ctx.fillStyle = p.color;
          
          ctx.moveTo(p.x, p.y - p.size);
          ctx.lineTo(p.x + p.size/2, p.y);
          ctx.lineTo(p.x, p.y + p.size);
          ctx.lineTo(p.x - p.size/2, p.y);
          ctx.fill();
        } else {
          ctx.globalAlpha = 0.4;
          ctx.fillStyle = p.color;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    const updateMousePos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
        isActive: true
      };
    };

    const onMouseMove = (e: MouseEvent) => updateMousePos(e.clientX, e.clientY);
    
    const onTouchMove = (e: TouchEvent) => {
      // e.preventDefault(); // Don't prevent default scrolling
      const touch = e.touches[0];
      updateMousePos(touch.clientX, touch.clientY);
    };

    const onLeave = () => {
      mouseRef.current.isActive = false;
    };

    if (container) {
      // Use capture phase to get events even if children stop propagation
      container.addEventListener('mousemove', onMouseMove, true);
      container.addEventListener('mouseleave', onLeave, true);
      container.addEventListener('touchmove', onTouchMove, true);
      container.addEventListener('touchend', onLeave, true);
      container.addEventListener('touchstart', onTouchMove, true); // Respond immediately to touch
      
      handleResize();
      const observer = new ResizeObserver(handleResize);
      observer.observe(container);

      render();

      return () => {
        container.removeEventListener('mousemove', onMouseMove, true);
        container.removeEventListener('mouseleave', onLeave, true);
        container.removeEventListener('touchmove', onTouchMove, true);
        container.removeEventListener('touchend', onLeave, true);
        container.removeEventListener('touchstart', onTouchMove, true);
        observer.disconnect();
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full pointer-events-none"
    />
  );
}
