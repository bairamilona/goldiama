import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxSection({ children, className = "", speed = 0.5 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // useScroll with target tracks the element's progress through the viewport.
  // The 'target' element MUST have a non-static position (relative, absolute, fixed)
  // for measurements to work correctly in some browsers/versions of Motion.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  
  return (
    <div 
      ref={ref} 
      className={`relative ${className}`}
      style={{ position: 'relative' }} 
    >
      <motion.div style={{ y }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}
