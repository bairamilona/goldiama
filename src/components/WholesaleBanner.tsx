import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { debounce } from '@/lib/performance-utils';

export function WholesaleBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoError, setVideoError] = useState(false);

  // Parallax scroll effect for text
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 0.5, 0.7]);

  // Live grain effect for video texture - Matching Heritage premium style
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grainDensity = 0.12; // Matching Heritage
    const resolutionMultiplier = 0.65; // Fine detail matching Heritage

    let animationFrameId: number;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.floor(rect.width * resolutionMultiplier);
      const height = Math.floor(rect.height * resolutionMultiplier);
      
      if (width > 0 && height > 0) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    };

    const renderGrain = () => {
      const { width, height } = canvas;
      if (width <= 0 || height <= 0) return;
      
      const imageData = ctx.createImageData(width, height);
      const buffer = imageData.data;

      for (let i = 0; i < buffer.length; i += 4) {
        if (Math.random() < grainDensity) {
          const brightness = 180 + Math.random() * 75; // Light grain like Heritage
          buffer[i] = brightness;
          buffer[i + 1] = brightness;
          buffer[i + 2] = brightness;
          buffer[i + 3] = 180; // Premium opacity
        } else {
          buffer[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const animate = () => {
      renderGrain();
      animationFrameId = requestAnimationFrame(animate);
    };

    if (resizeCanvas()) {
      animate();
    }

    const handleResize = debounce(() => resizeCanvas(), 100);
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Intersection Observer to play/pause when in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch(() => {
                // Ignore autoplay errors
              });
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  if (videoError) {
    // Fallback if video fails to load
    return (
      <section className="relative w-full h-[408px] bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1920&q=80')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 h-full flex items-center justify-center px-8">
          <h2 
            className="text-[clamp(2rem,5vw,4rem)] leading-[1.1] tracking-[-0.02em] font-light text-white text-center"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            GOLDIAMA FINE GOLD COIN<br />
            <span className="text-[#B8A07E]">THE EAGLE OF TRUST</span>
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section id="video-section" className="relative w-full h-[408px] bg-black overflow-hidden mb-0" ref={containerRef}>
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video 
          ref={videoRef}
          className="w-full h-full object-cover opacity-70 transition-opacity duration-1000"
          autoPlay 
          muted={true}
          loop 
          playsInline
          preload="auto"
          src="https://github.com/bairamilona/goldiama/raw/refs/heads/main/gdl-Gold-coin-01%20(1).mp4"
          onError={() => {
            console.error('Video failed to load');
            setVideoError(true);
          }}
        />
      </div>

      {/* Dark Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" 
        style={{ opacity: overlayOpacity }} 
      />

      {/* Live Grain Effect - Premium texture */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ 
          opacity: 0.25, // Matching Heritage
          mixBlendMode: 'overlay' 
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-8">
        <motion.h2 
          className="text-[clamp(2rem,5vw,4rem)] leading-[1.1] tracking-[-0.02em] font-light text-white text-center"
          style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            y: textY,
            scale: textScale,
            textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
            filter: 'contrast(1.05)',
          }}
        >
          GOLDIAMA FINE GOLD COIN<br />
          <span className="text-[#B8A07E]" style={{ textShadow: '0 2px 8px rgba(184, 160, 126, 0.4)' }}>THE EAGLE OF TRUST</span>
        </motion.h2>
      </div>
    </section>
  );
}