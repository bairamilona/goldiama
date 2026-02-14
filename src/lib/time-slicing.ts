/**
 * Time Slicing Utilities
 * Разбивает тяжелые операции на chunks для предотвращения Long Tasks
 */

/**
 * Рендерит массив элементов порциями для предотвращения блокировки UI
 * Использует requestIdleCallback для рендеринга в idle time
 * 
 * @param items - массив элементов для рендеринга
 * @param chunkSize - количество элементов в одном chunk (по умолчанию 10)
 * @returns Promise с полным массивом после завершения
 */
export function renderInChunks<T>(
  items: T[],
  chunkSize: number = 10
): Promise<T[]> {
  return new Promise((resolve) => {
    let currentIndex = 0;
    const result: T[] = [];

    function processChunk() {
      const endIndex = Math.min(currentIndex + chunkSize, items.length);
      
      // Обработать текущий chunk
      for (let i = currentIndex; i < endIndex; i++) {
        result.push(items[i]);
      }

      currentIndex = endIndex;

      // Если есть еще элементы, запланировать следующий chunk
      if (currentIndex < items.length) {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(processChunk, { timeout: 1000 });
        } else {
          setTimeout(processChunk, 0);
        }
      } else {
        // Все элементы обработаны
        resolve(result);
      }
    }

    // Начать обработку
    processChunk();
  });
}

/**
 * Выполняет функцию в idle time для предотвращения блокировки main thread
 * 
 * @param callback - функция для выполнения
 * @param options - опции requestIdleCallback
 */
export function runInIdleTime(
  callback: () => void,
  options?: { timeout?: number }
): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      callback();
    }, options);
  } else {
    // Fallback для браузеров без requestIdleCallback (Safari)
    setTimeout(callback, 0);
  }
}

/**
 * Разбивает большую операцию на маленькие tasks
 * Полезно для предотвращения Long Tasks (>50ms)
 * 
 * @param taskFn - функция для выполнения по частям
 * @param chunkSize - размер chunk
 * @param onProgress - callback для прогресса (опционально)
 */
export async function splitTask<T>(
  items: T[],
  taskFn: (item: T, index: number) => void,
  chunkSize: number = 20,
  onProgress?: (progress: number) => void
): Promise<void> {
  const totalItems = items.length;
  
  for (let i = 0; i < totalItems; i += chunkSize) {
    await new Promise<void>((resolve) => {
      runInIdleTime(() => {
        const end = Math.min(i + chunkSize, totalItems);
        
        for (let j = i; j < end; j++) {
          taskFn(items[j], j);
        }
        
        // Отчет о прогрессе
        if (onProgress) {
          const progress = Math.round((end / totalItems) * 100);
          onProgress(progress);
        }
        
        resolve();
      });
    });
  }
}

/**
 * Debounce с requestAnimationFrame для плавности
 * Полезно для дорогих операций при scroll/resize
 */
export function rafDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 100
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;
  let rafId: number | null = null;

  return function (this: any, ...args: Parameters<T>) {
    // Отменить предыдущие вызовы
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }

    // Запланировать новый вызов
    timeoutId = window.setTimeout(() => {
      rafId = requestAnimationFrame(() => {
        fn.apply(this, args);
      });
    }, delay);
  };
}

/**
 * Lazy loader для тяжелых компонентов
 * Использует IntersectionObserver + requestIdleCallback
 */
export class LazyComponentLoader {
  private static observers = new Map<Element, IntersectionObserver>();

  static observe(
    element: Element,
    callback: () => void,
    options?: {
      rootMargin?: string;
      threshold?: number;
      useIdleCallback?: boolean;
    }
  ): () => void {
    const {
      rootMargin = '200px',
      threshold = 0.01,
      useIdleCallback = true,
    } = options || {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (useIdleCallback) {
              runInIdleTime(callback, { timeout: 2000 });
            } else {
              callback();
            }
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    this.observers.set(element, observer);

    // Cleanup function
    return () => {
      observer.disconnect();
      this.observers.delete(element);
    };
  }

  static cleanup(element: Element): void {
    const observer = this.observers.get(element);
    if (observer) {
      observer.disconnect();
      this.observers.delete(element);
    }
  }
}

/**
 * Throttle с максимальной задержкой (leading + trailing)
 * Гарантирует что функция вызовется не чаще чем раз в delay
 */
export function throttleWithMax<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: number | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    // Очистить предыдущий timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    // Если прошло достаточно времени, вызвать сразу (leading)
    if (timeSinceLastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    } else {
      // Иначе запланировать на trailing edge
      timeoutId = window.setTimeout(() => {
        lastCall = Date.now();
        fn.apply(this, args);
        timeoutId = null;
      }, delay - timeSinceLastCall);
    }
  };
}
