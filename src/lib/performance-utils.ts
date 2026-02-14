/**
 * Performance utilities для оптимизации обработчиков событий
 */

/**
 * Debounce - вызывает функцию только после того, как прошло время delay с последнего вызова
 * Идеально для: resize, input, search
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttle - вызывает функцию максимум раз в delay миллисекунд
 * Идеально для: scroll, mousemove, touchmove
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      // Гарантируем последний вызов
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
        timeoutId = null;
      }, delay - (now - lastCall));
    }
  };
}

/**
 * requestAnimationFrame throttle - для максимальной производительности scroll
 * Выполняет функцию максимум раз в кадр (60 FPS)
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function throttled(...args: Parameters<T>) {
    if (rafId !== null) {
      return;
    }

    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

/**
 * Passive event listener options для scroll/touch событий
 * Улучшает производительность на 30-40%
 */
export const passiveEventOptions: AddEventListenerOptions = {
  passive: true,
  capture: false,
};

/**
 * Hook для debounced значения
 * Использование:
 * const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook для throttled callback
 * Использование:
 * const handleScroll = useThrottle(() => { ... }, 100);
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const throttledFn = React.useMemo(
    () => throttle(callback, delay),
    [callback, delay]
  );

  return throttledFn;
}

/**
 * Hook для RAF throttled callback
 * Использование:
 * const handleScroll = useRAFThrottle(() => { ... });
 */
export function useRAFThrottle<T extends (...args: any[]) => any>(
  callback: T
): (...args: Parameters<T>) => void {
  const throttledFn = React.useMemo(
    () => rafThrottle(callback),
    [callback]
  );

  return throttledFn;
}

// Импорты для хуков
import React from 'react';

/**
 * IntersectionObserver options для lazy loading
 */
export const lazyLoadOptions: IntersectionObserverInit = {
  rootMargin: '200px', // Начинаем загружать за 200px до появления
  threshold: 0.01,
};

/**
 * IntersectionObserver options для анимаций при скролле
 */
export const scrollAnimationOptions: IntersectionObserverInit = {
  rootMargin: '0px',
  threshold: 0.15, // Запускаем когда 15% элемента видимо
};

/**
 * Check если устройство имеет ограниченную производительность
 */
export function isLowEndDevice(): boolean {
  // Проверяем количество логических процессоров
  const cores = navigator.hardwareConcurrency || 4;
  
  // Проверяем память (если доступно)
  const memory = (navigator as any).deviceMemory;
  
  // Проверяем connection type (если доступно)
  const connection = (navigator as any).connection;
  const slowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
  
  return cores < 4 || (memory && memory < 4) || slowConnection;
}

/**
 * Reduce motion check (accessibility)
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
