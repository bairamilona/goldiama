# ⚡ GOLDIAMA - Quick Performance Reference

> Быстрый справочник по оптимизациям для разработчиков

---

## 🎯 Когда использовать что?

### **useMemo** - Дорогие вычисления
```typescript
// ✅ Используй когда:
const filteredData = useMemo(() => {
  return data.filter(...).map(...).sort(...);
}, [data, filterParam]);

// ❌ НЕ используй для простых операций:
const sum = useMemo(() => a + b, [a, b]); // Overhead > benefit
```

### **useCallback** - Стабильные функции
```typescript
// ✅ Используй для функций передаваемых в props:
const handleClick = useCallback((id: string) => {
  doSomething(id);
}, [dependency]);

// ❌ НЕ используй если нет child компонентов:
const local = useCallback(() => console.log('hi'), []); // Overkill
```

### **React.memo** - Предотвращение ререндеров
```typescript
// ✅ Используй для компонентов с частыми parent updates:
const Card = memo(({ item }: { item: Item }) => {
  return <div>{item.name}</div>;
});
Card.displayName = 'Card';

// ❌ НЕ используй для компонентов с children:
const Wrapper = memo(({ children }) => <div>{children}</div>); // Бесполезно
```

### **lazy** - Отложенная загрузка
```typescript
// ✅ Используй для:
// - Модальных окон
// - Роуты
// - Тяжелые компоненты (>50KB)
const Modal = lazy(() => import('./Modal'));

// Используй с Suspense:
<Suspense fallback={<Spinner />}>
  <Modal />
</Suspense>
```

---

## 🚀 Performance Patterns

### **1. Фильтрация/Сортировка**
```typescript
// ❌ ПЛОХО: Пересчитывается каждый рендер
function Component() {
  const filtered = items.filter(i => i.active).sort((a, b) => a.order - b.order);
  return <List items={filtered} />;
}

// ✅ ХОРОШО: Кешируется с useMemo
function Component() {
  const filtered = useMemo(() => 
    items.filter(i => i.active).sort((a, b) => a.order - b.order),
    [items]
  );
  return <List items={filtered} />;
}
```

### **2. Event Handlers**
```typescript
// ❌ ПЛОХО: Новая функция каждый рендер
function Component() {
  return <Child onClick={(id) => handleClick(id)} />;
}

// ✅ ХОРОШО: Стабильная функция с useCallback
function Component() {
  const handleClick = useCallback((id: string) => {
    // ...
  }, [dependency]);
  
  return <Child onClick={handleClick} />;
}
```

### **3. Scroll/Resize Handlers**
```typescript
// ❌ ПЛОХО: Без throttle
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
}, []);

// ✅ ХОРОШО: С RAF throttle + passive
import { rafThrottle, passiveEventOptions } from '@/lib/performance-utils';

useEffect(() => {
  const throttled = rafThrottle(handleScroll);
  window.addEventListener('scroll', throttled, passiveEventOptions);
  return () => window.removeEventListener('scroll', throttled);
}, []);
```

### **4. Дорогие SVG/Canvas вычисления**
```typescript
// ❌ ПЛОХО: Генерация каждый рендер
function Chart({ data }) {
  const path = generateSVGPath(data); // Expensive!
  return <svg><path d={path} /></svg>;
}

// ✅ ХОРОШО: С useMemo
function Chart({ data }) {
  const path = useMemo(() => generateSVGPath(data), [data]);
  return <svg><path d={path} /></svg>;
}
```

### **5. Частые обновления (ticker, live data)**
```typescript
// ✅ ХОРОШО: memo + useMemo для карточек
const TickerCard = memo(({ item }: { item: Data }) => {
  const formattedPrice = useMemo(() => 
    formatPrice(item.price), 
    [item.price]
  );
  
  return <Card>{formattedPrice}</Card>;
});
TickerCard.displayName = 'TickerCard';
```

---

## 🎨 CSS Performance

### **Animations**
```css
/* ❌ ПЛОХО: Layout thrashing */
.element {
  animation: move 1s;
}
@keyframes move {
  from { left: 0; }
  to { left: 100px; }
}

/* ✅ ХОРОШО: GPU accelerated */
.element {
  animation: move 1s;
  will-change: transform;
}
@keyframes move {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}
```

### **Containment**
```css
/* ✅ Изолирует layout/paint от остальной страницы */
.section {
  contain: layout style paint;
}

.card {
  contain: layout paint;
}
```

---

## 📦 Import Optimization

### **Tree-shaking friendly**
```typescript
// ✅ ХОРОШО: Named imports
import { motion } from 'motion/react';
import { Button, Card } from '@/components/ui';
import { useState, useEffect, useMemo } from 'react';

// ❌ ПЛОХО: Default import или star import
import * as Motion from 'motion/react'; // Импортирует все!
import Framer from 'framer-motion'; // Устаревший пакет
```

---

## 🖼️ Images

### **Lazy Loading**
```typescript
// ✅ Используй LazyImage компонент
import { LazyImage } from '@/app/components/LazyImage';

<LazyImage 
  src={imgUrl} 
  alt="Description"
  className="..."
/>

// Автоматически:
// - Intersection Observer
// - Placeholder blur
// - Progressive loading
```

### **Responsive Images**
```typescript
// ✅ С srcSet для разных размеров
<img 
  src="image-800.webp"
  srcSet="
    image-400.webp 400w,
    image-800.webp 800w,
    image-1200.webp 1200w
  "
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  alt="..."
/>
```

---

## 🔧 Debugging Performance

### **React DevTools Profiler**
```bash
# 1. Open React DevTools
# 2. Profiler tab
# 3. Record
# 4. Interact with app
# 5. Stop
# 6. Analyze flame graph

# Ищи:
# - Длинные bars (медленные renders)
# - Частые re-renders (memo кандидаты)
# - Ненужные renders (useCallback нужен)
```

### **Chrome Performance Tab**
```bash
# 1. Open DevTools (F12)
# 2. Performance tab
# 3. Record (Ctrl+E)
# 4. Interact with app
# 5. Stop (Ctrl+E)
# 6. Analyze

# Ищи:
# - Long tasks (желтый > 50ms)
# - Layout thrashing (фиолетовый spike)
# - Paint storms (зеленый spike)
```

### **Performance Monitor**
```typescript
// В dev режиме автоматически логируется:
// [PERF] LCP: 2300ms (good)
// [PERF] FID: 45ms (good)
// [PERF] CLS: 0.05 (good)

// Смотри консоль после загрузки страницы (3s задержка)
```

---

## ⚠️ Common Mistakes

### **1. Over-optimization**
```typescript
// ❌ ПЛОХО: Memo все подряд
const Text = memo(({ children }) => <span>{children}</span>);

// ✅ ХОРОШО: Memo только где нужно
const ExpensiveCard = memo(({ data }) => {
  // Complex calculations...
  return <div>...</div>;
});
```

### **2. Неправильные dependencies**
```typescript
// ❌ ПЛОХО: Пропущена зависимость
const calculate = useCallback(() => {
  return data.map(d => d * multiplier); // multiplier не в deps!
}, [data]);

// ✅ ХОРОШО: Все зависимости указаны
const calculate = useCallback(() => {
  return data.map(d => d * multiplier);
}, [data, multiplier]);
```

### **3. Anonymous functions в JSX**
```typescript
// ❌ ПЛОХО: Новая функция каждый рендер
{items.map(item => <Card onClick={() => handle(item.id)} />)}

// ✅ ХОРОШО: Стабильная функция
const handleClick = useCallback((id: string) => handle(id), []);
{items.map(item => <Card onClick={() => handleClick(item.id)} />)}

// ✅ ЕЩЕ ЛУЧШЕ: Memo Card + передача id
const Card = memo(({ id, onClick }) => (
  <div onClick={() => onClick(id)}>...</div>
));
```

### **4. Inline objects/arrays**
```typescript
// ❌ ПЛОХО: Новый объект каждый рендер
<Component style={{ color: 'red' }} />

// ✅ ХОРОШО: Вынести наружу
const styles = { color: 'red' };
<Component style={styles} />

// ИЛИ useMemo для динамических:
const styles = useMemo(() => ({ color: theme.primary }), [theme]);
```

---

## 📊 Metrics Targets

| Метрика | Good | Needs Improvement | Poor |
|---------|------|-------------------|------|
| **LCP** | < 2.5s | 2.5s - 4.0s | > 4.0s |
| **FID** | < 100ms | 100ms - 300ms | > 300ms |
| **CLS** | < 0.1 | 0.1 - 0.25 | > 0.25 |
| **TTFB** | < 800ms | 800ms - 1800ms | > 1800ms |
| **FCP** | < 1.8s | 1.8s - 3.0s | > 3.0s |

---

## 🛠️ Useful Commands

```bash
# Performance audit
npm run build
npx lighthouse https://localhost:3000 --view

# Bundle analysis
npx vite-bundle-visualizer

# Memory profiling (Chrome DevTools)
# Performance tab → Memory checkbox → Record → Profile

# React Profiler
# React DevTools → Profiler → Record

# Check bundle size
npm run build
ls -lh dist/assets/

# Analyze what's in bundle
npx source-map-explorer 'dist/assets/*.js'
```

---

## 🎓 Resources

**Documentation:**
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

**Tools:**
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Bundle Analyzer](https://www.npmjs.com/package/vite-bundle-visualizer)

**Files в проекте:**
- `/src/lib/performance-utils.ts` - Утилиты
- `/src/lib/performance-monitor.ts` - Monitoring
- `/PERFORMANCE_CHECKLIST.md` - Полный checklist
- `/OPTIMIZATION_SUMMARY.md` - Подробный отчет

---

## 💡 Pro Tips

1. **Measure first, optimize second** - не оптимизируй наугад
2. **80/20 rule** - 20% оптимизаций дают 80% результата
3. **User-centric metrics** - оптимизируй то что видит пользователь
4. **Progressive enhancement** - работает без JS, улучшается с JS
5. **Test on real devices** - эмуляция != реальность

---

**Happy optimizing! 🚀**
