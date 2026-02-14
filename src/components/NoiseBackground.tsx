import { useEffect, useRef } from 'react';

interface NoiseBackgroundProps {
  opacity?: number;
  className?: string;
}

export function NoiseBackground({ opacity = 0.4, className = '' }: NoiseBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Simplex-like noise function (optimized Perlin approximation)
    const noise2D = (x: number, y: number, seed: number) => {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      const xf = x - Math.floor(x);
      const yf = y - Math.floor(y);

      const hash = (i: number, j: number) => {
        return ((i * 374761393 + j * 668265263 + seed) ^ (i * j)) & 255;
      };

      const grad = (h: number, x: number, y: number) => {
        const v = h & 3;
        return ((v & 1) === 0 ? x : -x) + ((v & 2) === 0 ? y : -y);
      };

      const u = xf * xf * (3 - 2 * xf);
      const v = yf * yf * (3 - 2 * yf);

      const a = grad(hash(X, Y), xf, yf);
      const b = grad(hash(X + 1, Y), xf - 1, yf);
      const c = grad(hash(X, Y + 1), xf, yf - 1);
      const d = grad(hash(X + 1, Y + 1), xf - 1, yf - 1);

      const x1 = a + u * (b - a);
      const x2 = c + u * (d - c);
      
      return (x1 + v * (x2 - x1)) * 0.5 + 0.5;
    };

    // Multi-octave noise (fractal brownian motion)
    const fbm = (x: number, y: number, time: number, octaves: number = 6) => {
      let value = 0;
      let amplitude = 1;
      let frequency = 1;
      let maxValue = 0;

      for (let i = 0; i < octaves; i++) {
        value += noise2D(
          x * frequency * 0.005 + time * 0.3,
          y * frequency * 0.005 + time * 0.2,
          i * 1000
        ) * amplitude;
        maxValue += amplitude;
        amplitude *= 0.5;
        frequency *= 2.1;
      }

      return value / maxValue;
    };

    // Animated render loop
    let time = 0;
    const animate = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      // Prevent errors when canvas has no dimensions
      if (width <= 0 || height <= 0 || !isFinite(width) || !isFinite(height)) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, width, height);

      // Create noise texture
      const imageData = ctx.createImageData(Math.floor(width), Math.floor(height));
      const data = imageData.data;

      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x += 2) {
          // Multi-layered noise
          const noise1 = fbm(x, y, time, 6);
          const noise2 = fbm(x * 1.5, y * 1.5, time * 0.7, 4);
          const noise3 = fbm(x * 0.3, y * 0.3, time * 1.2, 3);

          // Combine layers for depth
          let value = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
          
          // Add wave-like darkening
          const wave1 = Math.sin(x * 0.01 + time * 0.5) * 0.5 + 0.5;
          const wave2 = Math.cos(y * 0.008 + time * 0.4) * 0.5 + 0.5;
          const waveFactor = (wave1 + wave2) * 0.5;
          
          value = value * 0.7 + waveFactor * 0.3;

          // Add subtle glow in center
          const centerX = width / 2;
          const centerY = height / 2;
          const distanceFromCenter = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          );
          const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
          const glowFactor = 1 - (distanceFromCenter / maxDistance) * 0.3;
          
          value = value * glowFactor;

          // Map to grayscale with contrast
          const intensity = Math.pow(value, 1.2) * 255;
          const grain = Math.random() * 30 - 15; // Film grain
          const finalValue = Math.max(0, Math.min(255, intensity + grain));

          // Fill 2x2 block for performance
          for (let dy = 0; dy < 2 && y + dy < height; dy++) {
            for (let dx = 0; dx < 2 && x + dx < width; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              data[idx] = finalValue;     // R
              data[idx + 1] = finalValue; // G
              data[idx + 2] = finalValue; // B
              data[idx + 3] = 255;        // A
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      time += 0.002; // Slow animation
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{
        opacity,
        mixBlendMode: 'overlay',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}