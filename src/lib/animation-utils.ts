/**
 * Оптимизированные настройки для Motion анимаций
 * Используют GPU-ускорение через transform и will-change
 */

import type { Variants, Transition } from 'motion/react';

/**
 * Базовый transition с оптимизацией производительности
 */
export const performantTransition: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 15,
  mass: 0.5,
};

/**
 * Быстрый transition для UI элементов
 */
export const fastTransition: Transition = {
  duration: 0.2,
  ease: 'easeOut',
};

/**
 * Fade In/Out с GPU-ускорением
 */
export const fadeInOut: Variants = {
  hidden: { 
    opacity: 0,
    willChange: 'opacity', // Подсказка браузеру для оптимизации
  },
  visible: { 
    opacity: 1,
    willChange: 'auto', // Убираем will-change после анимации
    transition: fastTransition,
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  }
};

/**
 * Slide Up с GPU-ускорением (transform вместо top/bottom)
 */
export const slideUp: Variants = {
  hidden: { 
    opacity: 0,
    y: 20, // transform: translateY вместо top
    willChange: 'transform, opacity',
  },
  visible: { 
    opacity: 1,
    y: 0,
    willChange: 'auto',
    transition: performantTransition,
  }
};

/**
 * Scale с GPU-ускорением
 */
export const scaleIn: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    willChange: 'transform, opacity',
  },
  visible: { 
    opacity: 1,
    scale: 1,
    willChange: 'auto',
    transition: performantTransition,
  }
};

/**
 * Slide In from Left
 */
export const slideInLeft: Variants = {
  hidden: { 
    opacity: 0,
    x: -30,
    willChange: 'transform, opacity',
  },
  visible: { 
    opacity: 1,
    x: 0,
    willChange: 'auto',
    transition: performantTransition,
  }
};

/**
 * Slide In from Right
 */
export const slideInRight: Variants = {
  hidden: { 
    opacity: 0,
    x: 30,
    willChange: 'transform, opacity',
  },
  visible: { 
    opacity: 1,
    x: 0,
    willChange: 'auto',
    transition: performantTransition,
  }
};

/**
 * Stagger анимация для списков
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
};

/**
 * Элемент в stagger списке
 */
export const staggerItem: Variants = {
  hidden: { 
    opacity: 0,
    y: 10,
    willChange: 'transform, opacity',
  },
  visible: { 
    opacity: 1,
    y: 0,
    willChange: 'auto',
    transition: fastTransition,
  }
};

/**
 * Hover эффект для карточек
 */
export const cardHover = {
  rest: { 
    scale: 1,
    transition: { duration: 0.2 }
  },
  hover: { 
    scale: 1.02,
    willChange: 'transform',
    transition: { duration: 0.2 }
  }
};

/**
 * Модальное окно (backdrop + content)
 */
export const modalBackdrop: Variants = {
  hidden: { 
    opacity: 0,
    willChange: 'opacity',
  },
  visible: { 
    opacity: 1,
    willChange: 'auto',
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

export const modalContent: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 20,
    willChange: 'transform, opacity',
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    willChange: 'auto',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.15 }
  }
};

/**
 * Parallax эффект (для useTransform)
 * Используется с useScroll
 */
export const parallaxConfig = {
  // Небольшой parallax для производительности
  light: {
    inputRange: [0, 1],
    outputRange: [0, -50],
  },
  // Средний parallax
  medium: {
    inputRange: [0, 1],
    outputRange: [0, -100],
  },
  // Сильный parallax (используй осторожно)
  strong: {
    inputRange: [0, 1],
    outputRange: [0, -200],
  }
};
