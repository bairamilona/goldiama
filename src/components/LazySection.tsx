import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion } from 'motion/react';

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  animationDelay?: number;
}

export function LazySection({ 
  children, 
  className = '',
  threshold = 0.1,
  rootMargin = '50px',
  animationDelay = 0
}: LazySectionProps) {
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            // 🚀 OPTIMIZATION: Используем requestIdleCallback для загрузки в idle time
            // Это предотвращает Long Tasks при одновременной загрузке нескольких секций
            if ('requestIdleCallback' in window) {
              requestIdleCallback(
                () => {
                  setTimeout(() => {
                    setIsInView(true);
                    setHasLoaded(true);
                  }, animationDelay);
                },
                { timeout: 2000 + animationDelay } // Комбинируем timeout с delay
              );
            } else {
              // Fallback для браузеров без requestIdleCallback (Safari)
              setTimeout(() => {
                setIsInView(true);
                setHasLoaded(true);
              }, animationDelay);
            }
            observer.disconnect();
          }
        });
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [hasLoaded, threshold, rootMargin, animationDelay]);

  return (
    <div ref={sectionRef} className={`relative ${className}`} style={{ position: 'relative' }}>
      {isInView ? (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.46, 0.45, 0.94] // easeOutQuad
          }}
        >
          {children}
        </motion.div>
      ) : (
        <div className="min-h-[200px]" /> // Placeholder для сохранения высоты
      )}
    </div>
  );
}