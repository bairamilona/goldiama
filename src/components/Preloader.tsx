import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from "figma:asset/6996fefb20a009345d2866832d3a8332840c6b74.png";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show preloader for 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait" onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
        >
          {/* Container width controls logo size */}
          <div className="relative w-32 md:w-48">
            {/* Base Logo - Static, Faint. Controls height of container. */}
            <img
              src={logoImage}
              alt="Goldiama"
              className="w-full h-auto object-contain opacity-20 grayscale block"
            />
            
            {/* Shimmering Logo - Animated Mask */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{
                 maskImage: 'linear-gradient(to right, transparent 0%, black 50%, transparent 100%)',
                 maskSize: '200% 100%',
                 WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 50%, transparent 100%)', 
                 WebkitMaskSize: '200% 100%',
              }}
              animate={{
                maskPosition: ['-150% 0', '150% 0'],
                WebkitMaskPosition: ['-150% 0', '150% 0']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 0.2
              }}
            >
               <img
                  src={logoImage}
                  alt="Goldiama"
                  className="w-full h-full object-contain" 
                />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
