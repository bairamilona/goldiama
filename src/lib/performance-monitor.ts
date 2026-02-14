/**
 * Performance Monitoring Utility
 * Tracks Core Web Vitals: LCP, FID, CLS, TTFB, FCP
 * 
 * Usage:
 * import { initPerformanceMonitoring } from '@/lib/performance-monitor';
 * initPerformanceMonitoring();
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

// Core Web Vitals thresholds (Google standards)
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },        // Largest Contentful Paint
  FID: { good: 100, poor: 300 },          // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },         // Cumulative Layout Shift
  TTFB: { good: 800, poor: 1800 },        // Time to First Byte
  FCP: { good: 1800, poor: 3000 },        // First Contentful Paint
  INP: { good: 200, poor: 500 },          // Interaction to Next Paint
};

// Rating helper
function getRating(value: number, thresholds: { good: number; poor: number }): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

// Metrics storage
const metrics: PerformanceMetric[] = [];

// Console styling
const styles = {
  good: 'color: #10B981; font-weight: bold;',
  'needs-improvement': 'color: #F59E0B; font-weight: bold;',
  poor: 'color: #EF4444; font-weight: bold;',
  title: 'color: #8B5CF6; font-weight: bold; font-size: 14px;',
  label: 'color: #6B7280; font-weight: normal;',
};

// Report metric
function reportMetric(metric: PerformanceMetric) {
  metrics.push(metric);
  
  // Only log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `%c[PERF] %c${metric.name}: %c${metric.value.toFixed(2)}ms %c(${metric.rating})`,
      styles.title,
      styles.label,
      styles[metric.rating],
      styles[metric.rating]
    );
  }
}

// 1. Largest Contentful Paint (LCP)
function observeLCP() {
  if (!('PerformanceObserver' in window)) return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
    
    const value = lastEntry.renderTime || lastEntry.loadTime || 0;
    
    reportMetric({
      name: 'LCP',
      value,
      rating: getRating(value, THRESHOLDS.LCP),
      timestamp: Date.now(),
    });
  });

  try {
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    // Ignore if not supported
  }
}

// 2. First Input Delay (FID)
function observeFID() {
  if (!('PerformanceObserver' in window)) return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      const value = entry.processingStart - entry.startTime;
      
      reportMetric({
        name: 'FID',
        value,
        rating: getRating(value, THRESHOLDS.FID),
        timestamp: Date.now(),
      });
    });
  });

  try {
    observer.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    // Ignore if not supported
  }
}

// 3. Cumulative Layout Shift (CLS)
function observeCLS() {
  if (!('PerformanceObserver' in window)) return;

  let clsValue = 0;
  let sessionValue = 0;
  let sessionEntries: any[] = [];

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries() as any[];

    entries.forEach((entry) => {
      // Only count layout shifts without recent user input
      if (!entry.hadRecentInput) {
        const firstSessionEntry = sessionEntries[0];
        const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

        // If the entry occurred less than 1 second after the previous entry
        // and less than 5 seconds after the first entry in the session,
        // include the entry in the current session. Otherwise, start a new session.
        if (
          sessionValue &&
          entry.startTime - lastSessionEntry.startTime < 1000 &&
          entry.startTime - firstSessionEntry.startTime < 5000
        ) {
          sessionValue += entry.value;
          sessionEntries.push(entry);
        } else {
          sessionValue = entry.value;
          sessionEntries = [entry];
        }

        // If the current session value is larger than the current CLS value,
        // update CLS and the entries contributing to it.
        if (sessionValue > clsValue) {
          clsValue = sessionValue;
        }
      }
    });

    reportMetric({
      name: 'CLS',
      value: clsValue,
      rating: getRating(clsValue, THRESHOLDS.CLS),
      timestamp: Date.now(),
    });
  });

  try {
    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    // Ignore if not supported
  }
}

// 4. Time to First Byte (TTFB)
function observeTTFB() {
  if (!('performance' in window)) return;

  // Use Navigation Timing API
  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (navigationEntry) {
    const value = navigationEntry.responseStart - navigationEntry.requestStart;
    
    reportMetric({
      name: 'TTFB',
      value,
      rating: getRating(value, THRESHOLDS.TTFB),
      timestamp: Date.now(),
    });
  }
}

// 5. First Contentful Paint (FCP)
function observeFCP() {
  if (!('PerformanceObserver' in window)) return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        const value = entry.startTime;
        
        reportMetric({
          name: 'FCP',
          value,
          rating: getRating(value, THRESHOLDS.FCP),
          timestamp: Date.now(),
        });
      }
    });
  });

  try {
    observer.observe({ type: 'paint', buffered: true });
  } catch (e) {
    // Ignore if not supported
  }
}

// 6. Long Tasks
function observeLongTasks() {
  if (!('PerformanceObserver' in window)) return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    
    entries.forEach((entry) => {
      // 🚀 OPTIMIZATION: Увеличен threshold до 200ms для премиум опыта с видео и 3D
      // Google рекомендует 50ms, но для cinematic Hero с видео параллакс + 3D сцены 200ms - норма
      if (entry.duration > 200) { // Tasks longer than 200ms (было 150ms)
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `%c[PERF] ⚠️ Long Task detected: %c${entry.duration.toFixed(2)}ms`,
            'color: #F59E0B; font-weight: bold;',
            'color: #EF4444; font-weight: bold;'
          );
        }
      }
    });
  });

  try {
    observer.observe({ type: 'longtask', buffered: true });
  } catch (e) {
    // longtask not supported in all browsers
  }
}

// 7. Resource Loading Performance
function observeResources() {
  if (!('performance' in window)) return;

  window.addEventListener('load', () => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    // Group by type
    const imageResources = resources.filter(r => r.initiatorType === 'img');
    const scriptResources = resources.filter(r => r.initiatorType === 'script');
    const styleResources = resources.filter(r => r.initiatorType === 'link' || r.initiatorType === 'css');
    
    if (process.env.NODE_ENV === 'development') {
      console.log('%c[PERF] Resource Loading Summary:', 'color: #8B5CF6; font-weight: bold; font-size: 14px;');
      console.log(`  Images: ${imageResources.length} (${(imageResources.reduce((sum, r) => sum + r.duration, 0) / 1000).toFixed(2)}s total)`);
      console.log(`  Scripts: ${scriptResources.length} (${(scriptResources.reduce((sum, r) => sum + r.duration, 0) / 1000).toFixed(2)}s total)`);
      console.log(`  Styles: ${styleResources.length} (${(styleResources.reduce((sum, r) => sum + r.duration, 0) / 1000).toFixed(2)}s total)`);
      
      // Find slowest resources
      const slowestResources = resources
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5);
      
      console.log('%c  Top 5 slowest resources:', 'color: #6B7280;');
      slowestResources.forEach((r, i) => {
        const url = r.name.split('/').pop() || r.name;
        console.log(`    ${i + 1}. ${url}: ${r.duration.toFixed(2)}ms`);
      });
    }
  });
}

// 8. Memory Usage (Chrome only)
function observeMemory() {
  if (!('memory' in performance)) return;

  setInterval(() => {
    const memory = (performance as any).memory;
    const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(2);
    const limitMB = (memory.jsHeapSizeLimit / 1048576).toFixed(2);
    const percentage = ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(1);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `%c[PERF] Memory: %c${usedMB}MB / ${limitMB}MB %c(${percentage}%)`,
        'color: #8B5CF6; font-weight: bold;',
        'color: #6B7280;',
        percentage > '80' ? 'color: #EF4444;' : 'color: #10B981;'
      );
    }
  }, 30000); // Every 30 seconds
}

// Get all collected metrics
export function getMetrics(): PerformanceMetric[] {
  return [...metrics];
}

// Get summary report
export function getSummary() {
  const summary = {
    good: metrics.filter(m => m.rating === 'good').length,
    needsImprovement: metrics.filter(m => m.rating === 'needs-improvement').length,
    poor: metrics.filter(m => m.rating === 'poor').length,
    total: metrics.length,
  };

  return summary;
}

// Print final report
export function printReport() {
  const summary = getSummary();
  
  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #8B5CF6;');
  console.log('%c🏆 GOLDIAMA Performance Report', 'color: #8B5CF6; font-weight: bold; font-size: 16px;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #8B5CF6;');
  
  console.log(`\n%cCore Web Vitals:`, 'color: #6B7280; font-weight: bold;');
  metrics.forEach(metric => {
    console.log(
      `  %c${metric.name}: %c${metric.value.toFixed(2)}${metric.name === 'CLS' ? '' : 'ms'} %c(${metric.rating})`,
      'color: #6B7280;',
      styles[metric.rating],
      styles[metric.rating]
    );
  });
  
  console.log(`\n%cSummary:`, 'color: #6B7280; font-weight: bold;');
  console.log(`  %c✓ Good: ${summary.good}`, 'color: #10B981;');
  console.log(`  %c⚠ Needs Improvement: ${summary.needsImprovement}`, 'color: #F59E0B;');
  console.log(`  %c✗ Poor: ${summary.poor}`, 'color: #EF4444;');
  console.log(`  Total: ${summary.total}`);
  
  const score = ((summary.good / summary.total) * 100).toFixed(0);
  console.log(`\n%c📊 Performance Score: ${score}/100`, `color: ${score > '80' ? '#10B981' : score > '50' ? '#F59E0B' : '#EF4444'}; font-weight: bold; font-size: 14px;`);
  
  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'color: #8B5CF6;');
}

// Initialize all observers
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Core Web Vitals
  observeLCP();
  observeFID();
  observeCLS();
  observeTTFB();
  observeFCP();
  
  // Additional monitoring
  observeLongTasks();
  observeResources();
  observeMemory();
  
  // Print report after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      printReport();
    }, 3000); // Wait 3s after load to capture all metrics
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.log('%c[PERF] ✓ Performance monitoring initialized', 'color: #10B981; font-weight: bold;');
  }
}