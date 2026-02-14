import { motion } from 'motion/react';

interface SectionDividerProps {
  variant?: 'fade' | 'gradient' | 'wave' | 'minimal';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

export function SectionDivider({ variant = 'fade', spacing = 'md' }: SectionDividerProps) {
  const spacingClasses = {
    sm: 'h-16 md:h-20',
    md: 'h-24 md:h-32',
    lg: 'h-32 md:h-40',
    xl: 'h-40 md:h-48'
  };

  if (variant === 'fade') {
    return (
      <motion.div 
        className={`w-full ${spacingClasses[spacing]} relative overflow-hidden`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent" />
      </motion.div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className={`w-full ${spacingClasses[spacing]} relative`}>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        />
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className={`w-full ${spacingClasses[spacing]} relative overflow-hidden`}>
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <path
            fill="rgba(249, 250, 251, 0.3)"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,96C1248,75,1344,53,1392,42.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </motion.svg>
      </div>
    );
  }

  // minimal variant
  return <div className={spacingClasses[spacing]} />;
}
