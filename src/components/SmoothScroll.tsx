import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with premium smooth scroll settings
    const lenis = new Lenis({
      duration: 1.2, // Smooth, not too fast
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for organic feel
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0, // Normal speed, not accelerated
      smoothTouch: false, // Keep native touch scroll on mobile
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Request animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
