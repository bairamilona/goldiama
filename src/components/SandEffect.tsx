import React, { useEffect, useRef } from 'react';

export const SandEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      x: number = 0;
      y: number = 0;
      baseX: number = 0;
      baseY: number = 0;
      size: number = 0;
      alpha: number = 0;
      offset: number = 0;
      speedModifier: number = 0;

      constructor() {
        this.reset();
      }

      reset() {
        if (!canvas) return;
        
        // Spawn particles in the bottom 30% of the card
        const bottomZoneHeight = canvas.height * 0.3;
        const startY = canvas.height - bottomZoneHeight;
        
        this.baseX = Math.random() * canvas.width;
        this.baseY = startY + Math.random() * bottomZoneHeight;
        
        // Hole logic at 15% from bottom
        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.85; 
        const holeRadiusX = canvas.width * 0.25; 
        const holeRadiusY = canvas.height * 0.08; 
        
        const dx = (this.baseX - centerX) / holeRadiusX;
        const dy = (this.baseY - centerY) / holeRadiusY;
        const distance = dx*dx + dy*dy;

        if (distance < 1) {
            const angle = Math.atan2(this.baseY - centerY, this.baseX - centerX);
            const pushFactor = 1.1 + Math.random() * 0.2; 
            this.baseX = centerX + Math.cos(angle) * holeRadiusX * pushFactor;
            this.baseY = centerY + Math.sin(angle) * holeRadiusY * pushFactor;
        }

        this.x = this.baseX;
        this.y = this.baseY;

        // Size: 0.8px to 1.8px 
        this.size = Math.random() * 1.0 + 0.8;
        
        // Alpha
        this.alpha = Math.random() * 0.4 + 0.4;
        
        // Random offsets for movement
        this.offset = Math.random() * 1000;
        this.speedModifier = Math.random() * 0.5 + 0.5;
      }

      update(time: number) {
        const windX = Math.sin(time * 0.002 * this.speedModifier + this.offset) * 4;
        const windY = Math.cos(time * 0.003 * this.speedModifier + this.offset) * 1.5;
        
        this.x = this.baseX + windX;
        this.y = this.baseY + windY;

        this.alpha = 0.5 + Math.sin(time * 0.005 + this.offset) * 0.3;
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Gold/Tan color
        ctx.fillStyle = `rgba(220, 190, 150, ${this.alpha})`; 
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();
      }
    }

    const particleCount = 350; 
    const particles = Array.from({ length: particleCount }, () => new Particle());

    let animationFrameId: number;

    const animate = (time: number) => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update(time);
        p.draw(ctx);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full pointer-events-none absolute inset-0 bg-transparent" />;
};
