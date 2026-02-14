import { useState, useEffect, useRef, lazy, Suspense } from 'react';

// Lazy load Spline only when needed
const Spline = lazy(() => import('@splinetool/react-spline').then(module => ({ default: module.default || module })));

interface LazySplineProps {
  scene?: string;
  url?: string; // Support both 'scene' and 'url' props for backwards compatibility
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
}

/**
 * LazySpline - загружает Spline только когда компонент виден
 * Оптимизация: не грузим тяжелую 3D сцену до скролла
 * + requestIdleCallback для предотвращения Long Tasks
 */
export function LazySpline({ scene, url, className, style, onLoad }: LazySplineProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Support both 'scene' and 'url' props
  const splineUrl = scene || url;
  
  // Validate URL before loading
  if (!splineUrl || typeof splineUrl !== 'string') {
    console.warn('LazySpline: Invalid or missing scene/url prop');
    return (
      <div ref={containerRef} className={className} style={style}>
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white" />
      </div>
    );
  }

  useEffect(() => {
    // Проверяем размер экрана - на mobile не грузим Spline вообще
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad) {
            // 🚀 OPTIMIZATION: Используем requestIdleCallback для загрузки в idle time
            // Это предотвращает блокировку main thread
            if ('requestIdleCallback' in window) {
              requestIdleCallback(
                () => {
                  setShouldLoad(true);
                },
                { timeout: 2000 } // Максимум 2s ждем idle
              );
            } else {
              // Fallback для браузеров без requestIdleCallback
              setTimeout(() => setShouldLoad(true), 100);
            }
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Начинаем загружать за 200px до появления
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className={className} style={style}>
      {shouldLoad ? (
        <Suspense 
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
              <div className="text-sm text-gray-400 animate-pulse">Loading 3D...</div>
            </div>
          }
        >
          <Spline scene={splineUrl} onLoad={onLoad} />
        </Suspense>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white" />
      )}
    </div>
  );
}