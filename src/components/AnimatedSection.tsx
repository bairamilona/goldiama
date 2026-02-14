import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  enableParallax?: boolean;
  parallaxIntensity?: number;
}

export function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0,
  enableParallax = false,
  parallaxIntensity = 30
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    enableParallax ? [parallaxIntensity, -parallaxIntensity] : [0, 0]
  );

  return (
    <motion.div
      ref={ref}
      style={{ y: enableParallax ? y : undefined }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 1.2,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1] // Premium easing curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
