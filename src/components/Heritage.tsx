import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatedEagleEmblem } from './AnimatedEagleEmblem';
import { debounce } from '@/lib/performance-utils';

interface HeritageStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

const heritageSteps: HeritageStep[] = [
  {
    id: 'crown',
    title: 'CROWN — POWER IN PROSPERITY',
    subtitle: 'Authority & Leadership',
    description: 'The crown represents authority and leadership - the strength to guide growth and shape a stable financial future.',
  },
  {
    id: 'wings',
    title: 'WINGS — BORN FROM INNOVATION',
    subtitle: 'Endurance & Ambition',
    description: 'The Wings Are Inspired By Satellite Panels That Use Gold To Withstand The Extremes Of Space — A Symbol Of Endurance And Limitless Ambition.',
  },
  {
    id: 'scales',
    title: 'SCALES — BALANCE OF PURITY',
    subtitle: 'Fairness & Precision',
    description: 'Held firmly in the Eagle\'s grasp, the scales embody fairness, precision. They remind that trust is measured, not assumed - every ounce weighed with honesty, every promise backed by gold.',
  },
  {
    id: 'shield',
    title: 'SHIELD — GUARDIAN OF WEALTH',
    subtitle: 'Protection & Continuity',
    description: 'At its core lies the shield - a mark of protection and continuity, preserving the value built over generations.',
  }
];

// Typewriter Hook
function useTypewriter(text: string, speed: number = 25) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayedText, isComplete };
}

export function Heritage() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const AUTOPLAY_DURATION = 12000; // 12 seconds per slide - comfortable reading time

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const eagleY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3]);

  // Live grain effect (light version)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Grain settings for light noise
    const grainDensity = 0.12; // Lighter density
    const resolutionMultiplier = 0.65;

    let animationFrameId: number;
    let retryCount = 0;
    const maxRetries = 10;

    // Resize canvas to match container
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.floor(rect.width * resolutionMultiplier);
      const height = Math.floor(rect.height * resolutionMultiplier);
      
      if (width > 0 && height > 0 && isFinite(width) && isFinite(height)) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    };

    // Generate light grain pattern
    const renderGrain = () => {
      const { width, height } = canvas;
      
      if (width <= 0 || height <= 0 || !isFinite(width) || !isFinite(height)) {
        return;
      }
      
      const imageData = ctx.createImageData(width, height);
      const buffer = imageData.data;

      for (let i = 0; i < buffer.length; i += 4) {
        // Random light/white dots with specified density
        if (Math.random() < grainDensity) {
          const brightness = 180 + Math.random() * 75; // 180-255 for light grain
          buffer[i] = brightness;     // R
          buffer[i + 1] = brightness; // G
          buffer[i + 2] = brightness; // B
          buffer[i + 3] = 100; // Semi-transparent for subtle effect
        } else {
          buffer[i + 3] = 0; // Transparent
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    // Animation loop
    const animate = () => {
      renderGrain();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize
    const initCanvas = () => {
      retryCount++;
      const hasValidSize = resizeCanvas();
      
      if (hasValidSize) {
        animate();
      } else if (retryCount < maxRetries) {
        setTimeout(initCanvas, 100);
      }
    };

    const initTimer = setTimeout(initCanvas, 50);

    const handleResize = debounce(() => {
      resizeCanvas();
    }, 100);
    
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initTimer);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Manual navigation functions
  const goToNextStep = () => {
    setProgress(0);
    setActiveStep((prev) => {
      // Loop back to start
      return prev === heritageSteps.length - 1 ? 0 : prev + 1;
    });
  };

  const goToPrevStep = () => {
    setProgress(0);
    setActiveStep((prev) => {
      // Loop to end
      return prev === 0 ? heritageSteps.length - 1 : prev - 1;
    });
  };

  const goToStep = (index: number) => {
    setProgress(0);
    setActiveStep(index);
  };

  // Touch handlers for mobile
  const handleTouchStart = () => {
    setIsAutoPlayPaused(true);
  };

  const handleTouchEnd = () => {
    // Delay resume slightly to feel more natural
    touchTimerRef.current = setTimeout(() => {
      setIsAutoPlayPaused(false);
    }, 300);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
      }
    };
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlayPaused) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / AUTOPLAY_DURATION) * 100;
      
      if (newProgress >= 100) {
        goToNextStep();
      } else {
        setProgress(newProgress);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [activeStep, isAutoPlayPaused]);

  const currentStep = heritageSteps[activeStep];
  const { displayedText: displayedTitle } = useTypewriter(currentStep.title, 15);
  const { displayedText: displayedDescription } = useTypewriter(currentStep.description, 5);

  return (
    <section ref={containerRef} className="relative w-full h-[85vh] md:h-screen overflow-hidden" style={{
      background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.5) 5%, rgba(255, 255, 255, 0.9) 15%, rgba(255, 255, 255, 0.98) 30%, #ffffff 50%, rgba(255, 255, 255, 0.98) 70%, rgba(255, 255, 255, 0.9) 85%, rgba(255, 255, 255, 0.5) 95%, transparent 100%)'
    }}>
      {/* Live Grain Canvas - Light version */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[2] w-full h-full pointer-events-none"
        style={{
          opacity: 0.4,
          mixBlendMode: 'multiply',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.9) 70%, rgba(0,0,0,0.5) 85%, rgba(0,0,0,0.2) 95%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.9) 70%, rgba(0,0,0,0.5) 85%, rgba(0,0,0,0.2) 95%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Subtle gradient overlay for depth */}
      <motion.div 
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          opacity: overlayOpacity,
          background: 'radial-gradient(circle at 65% 50%, transparent 0%, rgba(184, 160, 126, 0.06) 50%, rgba(212, 175, 55, 0.08) 100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.8) 75%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.8) 75%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Full-screen centered layout */}
      <div className="relative w-full h-full flex items-center justify-center z-[4]">
        <div className="w-full max-w-[1800px] mx-auto px-6 sm:px-12 md:px-20 lg:px-32 xl:px-40">
          
          {/* Split Layout - Mobile optimized with tighter spacing */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-4 sm:gap-6 lg:gap-4 xl:gap-6 items-center">
            
            {/* LEFT: Text Content with Parallax */}
            <motion.div 
              className="relative flex flex-col justify-center order-2 lg:order-1 mt-8 sm:mt-12 lg:mt-0"
              style={{ y: textY }}
            >
              
              {/* Overline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#B8A07E] mb-2 sm:mb-4 font-['Inter']"
              >
                Our Heritage
              </motion.p>

              {/* Main Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-[clamp(1.75rem,4vw,3.5rem)] leading-[1.1] font-light text-[#1A1A1A] mb-3 sm:mb-6"
                style={{ 
                  fontFamily: "'Cormorant Garamond', serif",
                  textShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  letterSpacing: '-0.01em',
                }}
              >
                The Eagle Emblem
              </motion.h2>

              {/* Dynamic Content Container - Reduced height for mobile */}
              <div 
                className="relative" 
                style={{ minHeight: window.innerWidth < 640 ? '280px' : '400px' }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                
                {/* Text Content Block */}
                <div>
                  {/* Subtitle */}
                  <motion.p 
                    key={`subtitle-${activeStep}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#B8A07E] mb-2 sm:mb-4 font-['Inter']"
                  >
                    {currentStep.subtitle}
                  </motion.p>

                  {/* Title Container - Reduced height for mobile */}
                  <div className="mb-2 sm:mb-4" style={{ minHeight: window.innerWidth < 640 ? '60px' : '90px' }}>
                    <h3 
                      key={`title-${activeStep}`}
                      className="text-[clamp(1.25rem,3vw,2.25rem)] leading-[1.15] font-light text-[#1A1A1A]"
                      style={{ 
                        fontFamily: "'Cormorant Garamond', serif",
                        textShadow: '0 0.5px 1px rgba(0,0,0,0.03)',
                        letterSpacing: '-0.005em',
                      }}
                    >
                      {displayedTitle}
                    </h3>
                  </div>

                  {/* Description Container - Reduced height for mobile */}
                  <div className="mb-4 sm:mb-8" style={{ minHeight: window.innerWidth < 640 ? '80px' : '120px' }}>
                    <p 
                      key={`desc-${activeStep}`}
                      className="text-[13px] sm:text-[15px] leading-[1.6] sm:leading-[1.7] text-[#1A1A1A]/70 font-light font-['Inter'] max-w-[540px]"
                      style={{
                        textRendering: 'optimizeLegibility',
                        WebkitFontSmoothing: 'antialiased',
                        textShadow: '0 0.5px 0.5px rgba(0,0,0,0.02)',
                      }}
                    >
                      {displayedDescription}
                    </p>
                  </div>
                </div>

                {/* Step Indicator - Minimal Lines */}
                <div className="mb-3 sm:mb-6">
                  <div className="flex gap-2 sm:gap-3">
                    {heritageSteps.map((step, i) => (
                      <button
                        key={i}
                        onClick={() => goToStep(i)}
                        className="relative cursor-pointer group"
                        aria-label={`Go to step ${i + 1}: ${step.subtitle}`}
                      >
                        <motion.div
                          animate={{
                            width: i === activeStep ? '24px' : '12px',
                            opacity: i === activeStep ? 1 : 0.25,
                          }}
                          whileHover={{ 
                            opacity: i === activeStep ? 1 : 0.5,
                          }}
                          transition={{ duration: 0.3 }}
                          className="h-[1.5px] rounded-full bg-[#D4AF37]"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desktop Navigation Buttons */}
                <div className="hidden lg:flex gap-3">
                  <button
                    onClick={goToPrevStep}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-['Inter'] uppercase tracking-[0.15em] transition-all duration-300 border border-gray-300 text-black hover:bg-[#D4AF37] hover:border-[#D4AF37] cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">{heritageSteps[activeStep === 0 ? heritageSteps.length - 1 : activeStep - 1].id}</span>
                  </button>
                  
                  <button
                    onClick={goToNextStep}
                    className="relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-['Inter'] uppercase tracking-[0.15em] transition-all duration-300 border border-gray-300 text-black hover:border-[#D4AF37] cursor-pointer overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#B8A07E] via-[#D4AF37] to-[#E5C88F] rounded-full"
                      style={{
                        width: `${progress}%`,
                        transition: 'width 0.016s linear',
                      }}
                    />
                    <span className="relative z-10 hidden sm:inline">{heritageSteps[activeStep === heritageSteps.length - 1 ? 0 : activeStep + 1].id}</span>
                    <ChevronRight className="relative z-10 w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Navigation Buttons - Under text content */}
                <div className="flex gap-2 justify-center lg:hidden mt-6">
                  <button
                    onClick={goToPrevStep}
                    className="flex items-center justify-center w-9 h-9 rounded-full text-xs font-['Inter'] uppercase tracking-[0.15em] transition-all duration-300 border border-gray-300 text-black hover:bg-[#D4AF37] hover:border-[#D4AF37] cursor-pointer"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  
                  <button
                    onClick={goToNextStep}
                    className="relative flex items-center justify-center w-9 h-9 rounded-full text-xs font-['Inter'] uppercase tracking-[0.15em] transition-all duration-300 border border-gray-300 text-black hover:border-[#D4AF37] cursor-pointer overflow-hidden group"
                    aria-label="Next"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#B8A07E] via-[#D4AF37] to-[#E5C88F] rounded-full"
                      style={{
                        width: `${progress}%`,
                        transition: 'width 0.016s linear',
                      }}
                    />
                    <ChevronRight className="relative z-10 w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </motion.div>

            {/* RIGHT: Eagle Emblem - Smaller on mobile, moved above text */}
            <div className="relative overflow-visible order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.22, 0.61, 0.36, 1]
                }}
                style={{
                  y: eagleY,
                  filter: 'drop-shadow(0 20px 60px rgba(184, 160, 126, 0.15)) contrast(1.05)',
                }}
                className="relative w-full max-w-[280px] sm:max-w-[400px] lg:max-w-[600px] mx-auto lg:ml-auto overflow-visible"
              >
                <AnimatedEagleEmblem activeStep={activeStep} />
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}