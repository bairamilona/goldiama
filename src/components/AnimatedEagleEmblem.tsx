import { motion } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';

interface AnimatedEagleEmblemProps {
  activeStep: number; // 0: crown, 1: wings, 2: scales, 3: shield
}

// Particle interface
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

// Dynamic SVG paths state
type SVGPaths = Record<string, string>;

// Helper functions to get paths (accepts svgPaths parameter)
const getCrownPaths = (svgPaths: SVGPaths) => [
  svgPaths.p2d72280,
  svgPaths.p1d011500,
  svgPaths.p38447b80,
  svgPaths.p3e497a00,
  svgPaths.p155a8500,
  svgPaths.p33561500,
];

const getWingsPaths = (svgPaths: SVGPaths) => [
  svgPaths.p2f303a00, svgPaths.p13162d00, svgPaths.p3fc94000, svgPaths.p264a1280,
  svgPaths.p9711000, svgPaths.pf22c200, svgPaths.p1d7a5700, svgPaths.p1a07ec80,
  svgPaths.p4142680, svgPaths.p3005f700, svgPaths.p28fdf480, svgPaths.p12a7e80,
  svgPaths.padbbd40, svgPaths.pd553b00, svgPaths.p2d08a00, svgPaths.p3b71e400,
  svgPaths.pbf5f000, svgPaths.p31563600, svgPaths.pd5a68f0, svgPaths.p1df66000,
  svgPaths.p20ac7fc0, svgPaths.p11fc2b00, svgPaths.p2b82af00, svgPaths.p2c51c700,
  svgPaths.p3d300d80, svgPaths.p151fce00, svgPaths.p2772d600, svgPaths.p2a263a00,
  svgPaths.p2ec31e00, svgPaths.p1bdfe000, svgPaths.pd29f370, svgPaths.p14faf6f0,
  svgPaths.p64a4700, svgPaths.p3c7c1900, svgPaths.p274fef00, svgPaths.p2313bf00,
  svgPaths.p2cbc6000, svgPaths.p32075e80, svgPaths.p152ccd80, svgPaths.p27db8d00,
  svgPaths.p3eb48f80, svgPaths.p2f75d830, svgPaths.p18ce6600, svgPaths.p1f4f5b80,
  svgPaths.p2f93b400, svgPaths.p14113e00, svgPaths.p20287900, svgPaths.p394ede80,
  svgPaths.p1fd30e00, svgPaths.p2f707380, svgPaths.pa7a7800, svgPaths.p1717e600,
  svgPaths.p733ec80, svgPaths.p350b05f0, svgPaths.p29d94400, svgPaths.p244b8100,
  svgPaths.p37bc800, svgPaths.pb7a400, svgPaths.p1cdd4080, svgPaths.p24852c00,
  svgPaths.p3ae3fe00, svgPaths.pd01ec00, svgPaths.p3a7bbd80, svgPaths.p843dc00,
  svgPaths.p16f24880, svgPaths.p1c7b4600, svgPaths.p3dc3a00, svgPaths.p9aad00,
  svgPaths.p2a411770, svgPaths.p9d00eb0, svgPaths.p1dbea900, svgPaths.p6d94680,
  svgPaths.p2b55eaf0, svgPaths.p2031d6f2, svgPaths.pb80b780, svgPaths.pc282300,
  svgPaths.p1ca65500, svgPaths.p3b20b6f0, svgPaths.p2a304300, svgPaths.p329ad980,
  svgPaths.p2869aa80, svgPaths.p2197f100, svgPaths.p3ab41800, svgPaths.p1282ad80,
  svgPaths.p3dcc080, svgPaths.p27e3bf80, svgPaths.p16278500, svgPaths.p16e91a40,
  svgPaths.p70ed400, svgPaths.p22bbe380, svgPaths.p3a325980, svgPaths.p1891600,
  svgPaths.p15b24f80, svgPaths.p4d94d00, svgPaths.p1854f300, svgPaths.p2c019000,
  svgPaths.pd76b100, svgPaths.p14b91440, svgPaths.p23667a00, svgPaths.p1652a600,
  svgPaths.p20bc1200, svgPaths.p3681e500, svgPaths.pef487b0, svgPaths.p3896de80,
  svgPaths.p17b58a00, svgPaths.p1f591f80, svgPaths.p45ec200, svgPaths.p8085fb0,
  svgPaths.p3a021e00, svgPaths.p2e08f500, svgPaths.p28abbf80, svgPaths.p1d798ff0,
  svgPaths.p2ebacd80, svgPaths.p8db1a80, svgPaths.p3a1d9500, svgPaths.p29245a00,
  svgPaths.p135d6800, svgPaths.pcf684f0, svgPaths.p172f71c0, svgPaths.pc468700,
  svgPaths.p2f559700, svgPaths.p40ef400, svgPaths.p20132f00, svgPaths.p2bde87f0,
  svgPaths.p494d180, svgPaths.p19c8bb00, svgPaths.p13622000, svgPaths.p38774c80,
  svgPaths.p3aa1ae00, svgPaths.p7e3e100, svgPaths.p1c3aaa80, svgPaths.p1e7b5d00,
  svgPaths.p34ea1600, svgPaths.p3a6bc600, svgPaths.pdc87f00, svgPaths.p3fbbab80,
  svgPaths.p325f2180, svgPaths.p1fecad00, svgPaths.p21e58d00, svgPaths.p26a3d500,
  svgPaths.p1879d880, svgPaths.p23421200, svgPaths.p350fdf00, svgPaths.p2cab7b00,
  svgPaths.pa7bf500, svgPaths.pd8aae00, svgPaths.p3c728c00, svgPaths.p1b904100,
  svgPaths.pd355200, svgPaths.p726e600, svgPaths.p2b61b080, svgPaths.p2244780,
  svgPaths.p292f9f00, svgPaths.p2e0a29c0, svgPaths.p2be64b00, svgPaths.p307a0300,
  svgPaths.p37da000, svgPaths.p1c222400, svgPaths.p92ab900, svgPaths.p3fb9800,
  svgPaths.p1881ac00, svgPaths.p3fb2a500, svgPaths.p34305a00, svgPaths.p20af4900,
  svgPaths.p24e11d00, svgPaths.pa9b8d80, svgPaths.p16d82700, svgPaths.pfac4600,
  svgPaths.p148d2e00, svgPaths.p6a2e700, svgPaths.p1c865b80, svgPaths.p211a8400,
  svgPaths.p396a8000, svgPaths.p2ded6300, svgPaths.p23098b00, svgPaths.pc2dfa00,
  svgPaths.pec11b00, svgPaths.p8b8b80, svgPaths.p24261f80, svgPaths.p2eeb1480,
  svgPaths.p6481c00, svgPaths.p1f483c80, svgPaths.pb8c2300, svgPaths.paa78300,
  svgPaths.p3574400, svgPaths.p141419c0, svgPaths.p1f528300, svgPaths.p806cd00,
  svgPaths.p29ad4280, svgPaths.p75ae380, svgPaths.p1078f700, svgPaths.p2d3f7100,
  svgPaths.p27a4700, svgPaths.p2ba6f400, svgPaths.p3c7bbc00, svgPaths.p2b1b9d00,
  svgPaths.p21aaa980,
];

const getScalePaths = (svgPaths: SVGPaths) => [
  svgPaths.p2b278b00, svgPaths.p1aa77a00, svgPaths.p2c5a4300, svgPaths.p1fa17380,
  svgPaths.p160d6b80, svgPaths.p80e5700, svgPaths.p1f417400, svgPaths.pfa32200,
  svgPaths.p196f0ef0, svgPaths.p11516b80, svgPaths.p1b0fd300, svgPaths.p3a9c5000,
  svgPaths.p36fa5200, svgPaths.p508c00, svgPaths.p36af3a00, svgPaths.p16d3d180,
  svgPaths.p281bd7f0, svgPaths.p37294500, svgPaths.p428cb00, svgPaths.p331fe800,
  svgPaths.p1ed66f00, svgPaths.p326e2f00, svgPaths.p309dc600, svgPaths.p1644e5f0,
  svgPaths.p1bb5ee00, svgPaths.p368e7a40, svgPaths.p2e224200, svgPaths.p3bdc6180,
  svgPaths.p38e4a300, svgPaths.p1bc82480,
];

const getShieldPaths = (svgPaths: SVGPaths) => [
  svgPaths.p33a34d80, svgPaths.p1f134880, svgPaths.p33f90500, svgPaths.p27d92480,
  svgPaths.pae48200, svgPaths.p323631c0, svgPaths.p2947d370, svgPaths.p39d5b780,
  svgPaths.pe8c6100, svgPaths.p22695700, svgPaths.p35d16700, svgPaths.p2a03a00,
  svgPaths.p255b8ff0, svgPaths.p3969da80, svgPaths.p234ed500, svgPaths.p10284800,
  svgPaths.p25b9680, svgPaths.p4366b00, svgPaths.p1bf96500, svgPaths.p2473fd00,
  svgPaths.pa85ddc0, svgPaths.p345bb480, svgPaths.p2306f100, svgPaths.p1931f871,
];

export function AnimatedEagleEmblem({ activeStep }: AnimatedEagleEmblemProps) {
  const [svgPaths, setSvgPaths] = useState<SVGPaths>({});
  const [loading, setLoading] = useState(true);

  // 🚀 OPTIMIZATION: Мемоизируем particles генерацию
  // Это дорогая операция (30 элементов), кешируем результат
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.5,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
    }));
  }, []); // Генерируем один раз при mount

  // Load SVG paths dynamically on mount
  useEffect(() => {
    let isMounted = true;

    const loadSVGPaths = async () => {
      try {
        const module = await import('@/imports/svg-ri8525563j');
        if (isMounted) {
          setSvgPaths(module.default);
          setLoading(false);
        }
      } catch (error) {
        // Silent fail - component will show loading state
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSVGPaths();

    return () => {
      isMounted = false;
    };
  }, []);

  // Map steps to path arrays - memoized to avoid recalculation
  const zonePathsMap: Record<number, string[]> = useMemo(() => {
    if (!svgPaths) return { 0: [], 1: [], 2: [], 3: [] };
    
    return {
      0: getCrownPaths(svgPaths),
      1: getWingsPaths(svgPaths),
      2: getScalePaths(svgPaths),
      3: getShieldPaths(svgPaths),
    };
  }, [svgPaths]);

  const activePaths = zonePathsMap[activeStep] || [];

  // Show elegant loading skeleton while SVG data loads
  if (loading || !svgPaths) {
    return (
      <div className="relative size-full flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-[400px] aspect-square">
          {/* Elegant backdrop blur container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
              backdropFilter: 'blur(20px)',
            }}
          />

          {/* Subtle gold dust particles */}
          {particles.map((particle) => {
            return (
              <motion.div
                key={`dust-${particle.id}`}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.6) 0%, transparent 70%)',
                  boxShadow: '0 0 2px rgba(212, 175, 55, 0.4)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.7, 0],
                  scale: [0, 1, 0],
                  y: [0, -10, -20],
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            );
          })}

          {/* Minimalist eagle emblem silhouette with sophisticated blur */}
          <motion.svg 
            className="block size-full relative z-10" 
            viewBox="0 0 498.909 413.35"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: [0.15, 0.25, 0.15],
              scale: [0.95, 1, 0.95],
            }}
            transition={{
              opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <defs>
              {/* Premium blur filter for sophisticated loading state */}
              <filter id="premiumBlur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                <feColorMatrix 
                  in="blur" 
                  type="matrix" 
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.3 0"
                  result="softBlur"
                />
              </filter>
              
              {/* Subtle shimmer gradient */}
              <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#E5C88F" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#B8A07E" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Crown - minimalist circle */}
            <motion.circle 
              cx="249" 
              cy="80" 
              r="35" 
              fill="url(#shimmerGradient)" 
              filter="url(#premiumBlur)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2.5, delay: 0, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            {/* Wings - elegant ellipse */}
            <motion.ellipse 
              cx="249" 
              cy="206" 
              rx="190" 
              ry="130" 
              fill="url(#shimmerGradient)" 
              filter="url(#premiumBlur)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2.5, delay: 0.3, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            {/* Shield - sophisticated polygon */}
            <motion.path 
              d="M249 280 L330 330 L315 365 L249 390 L183 365 L168 330 Z" 
              fill="url(#shimmerGradient)" 
              filter="url(#premiumBlur)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2.5, delay: 0.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.svg>

          {/* Centered shimmer line - très chic */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '120px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.6) 50%, transparent 100%)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ 
              scaleX: [0, 1, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative size-full overflow-visible">
      <svg 
        className="block size-full overflow-visible" 
        fill="none" 
        preserveAspectRatio="none" 
        viewBox="0 0 498.909 413.35"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <clipPath id="clip0_eagle">
            <rect fill="white" height="413.35" width="498.909" />
          </clipPath>
          
          <filter id="luxuryGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
            <feColorMatrix 
              in="blur" 
              type="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.3 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="inactiveBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blurred" />
          </filter>
        </defs>

        {/* Main eagle with conditional opacity */}
        <motion.g 
          clipPath="url(#clip0_eagle)" 
          id="eagle"
          initial={{ opacity: 1 }}
          animate={{ opacity: activePaths.length > 0 ? 0.35 : 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Wings group */}
          <g id="wings">
            <g id="Vector">
              {getWingsPaths(svgPaths).map((pathData, index) => (
                <path
                  key={'wing-base-' + String(index)}
                  d={pathData}
                  fill="var(--fill-0, #7C715A)"
                  clipRule={index === 26 || index === 35 || index === 59 || index === 144 || index === 147 || index === 148 || index === 173 || index === 176 ? "evenodd" : undefined}
                  fillRule={index === 26 || index === 35 || index === 59 || index === 144 || index === 147 || index === 148 || index === 173 || index === 176 ? "evenodd" : undefined}
                />
              ))}
            </g>
          </g>

          {/* Union group */}
          <g>
            <g id="Union">
              <path clipRule="evenodd" d={svgPaths.pd4b5a00} fill="var(--fill-0, #7C715A)" fillRule="evenodd" />
              <path d={svgPaths.p1edac300} fill="var(--fill-0, #7C715A)" />
              <path clipRule="evenodd" d={svgPaths.pf637d80} fill="var(--fill-0, #7C715A)" fillRule="evenodd" />
              <path d={svgPaths.p36d74300} fill="var(--fill-0, #7C715A)" />
            </g>
          </g>

          {/* Crown group */}
          <g id="crown">
            <g id="Union_2">
              {getCrownPaths(svgPaths).map((pathData, index) => (
                <path
                  key={'crown-base-' + String(index)}
                  d={pathData}
                  fill="var(--fill-0, #7C715A)"
                  clipRule={index === 5 ? "evenodd" : undefined}
                  fillRule={index === 5 ? "evenodd" : undefined}
                />
              ))}
            </g>
          </g>

          {/* Shield group */}
          <g id="shield">
            <g id="Union_3">
              {getShieldPaths(svgPaths).map((pathData, index) => (
                <path
                  key={'shield-base-' + String(index)}
                  d={pathData}
                  fill="var(--fill-0, #7C715A)"
                  clipRule={[0, 6, 9, 17].includes(index) ? "evenodd" : undefined}
                  fillRule={[0, 6, 9, 17].includes(index) ? "evenodd" : undefined}
                />
              ))}
            </g>
          </g>

          {/* Bottom group */}
          <g id="bottom">
            <g id="Union_4">
              <path d={svgPaths.p3a93ff00} fill="var(--fill-0, #7C715A)" />
              <path d={svgPaths.p28800100} fill="var(--fill-0, #7C715A)" />
              <path d={svgPaths.p16bc4580} fill="var(--fill-0, #7C715A)" />
              <path d={svgPaths.p132d0e00} fill="var(--fill-0, #7C715A)" />
              <path d={svgPaths.p55f980} fill="var(--fill-0, #7C715A)" />
              <path d={svgPaths.pb409000} fill="var(--fill-0, #7C715A)" />
              <path d={svgPaths.p2a946a00} fill="var(--fill-0, #7C715A)" />
              <path d={svgPaths.p19a7600} fill="var(--fill-0, #7C715A)" />
              <path d={svgPaths.p32eb4000} fill="var(--fill-0, #7C715A)" />
              <path clipRule="evenodd" d={svgPaths.p84d3500} fill="var(--fill-0, #7C715A)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p4ed66f0} fill="var(--fill-0, #7C715A)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p27047900} fill="var(--fill-0, #7C715A)" fillRule="evenodd" />
              <path d={svgPaths.p2222a780} fill="var(--fill-0, #7C715A)" />
              <path d={svgPaths.p31236100} fill="var(--fill-0, #7C715A)" />
              <path d={svgPaths.p1dd7f580} fill="var(--fill-0, #7C715A)" />
              <path d={svgPaths.p20b7b380} fill="var(--fill-0, #7C715A)" />
              <path d={svgPaths.p3443b800} fill="var(--fill-0, #7C715A)" />
              <path d={svgPaths.p2a1b5d00} fill="var(--fill-0, #7C715A)" />
              <path d={svgPaths.p2aacfa80} fill="var(--fill-0, #7C715A)" />
              <path d={svgPaths.p3b69ef00} fill="var(--fill-0, #7C715A)" />
            </g>
          </g>

          <path d={svgPaths.p1be9600} fill="var(--fill-0, #7C715A)" id="Vector_2" />

          {/* Scale group */}
          <g id="scale">
            <g id="Vector_3">
              {getScalePaths(svgPaths).map((pathData, index) => (
                <path
                  key={'scale-base-' + String(index)}
                  d={pathData}
                  fill="var(--fill-0, #7C715A)"
                  clipRule={[2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].includes(index) ? "evenodd" : undefined}
                  fillRule={[2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].includes(index) ? "evenodd" : undefined}
                />
              ))}
            </g>
          </g>

          {/* Animated stroke overlays for active zone */}
          <g filter="url(#luxuryGlow)">
            {activePaths.map((pathData, index) => (
              <motion.path
                key={'glow-' + String(activeStep) + '-' + String(index)}
                d={pathData}
                fill="none"
                stroke="#E5C88F"
                strokeWidth={activeStep === 0 ? "2.0" : "1.2"}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ 
                  pathLength: 0,
                  opacity: 0,
                }}
                animate={{ 
                  pathLength: 1,
                  opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                  pathLength: { 
                    duration: 1.2, 
                    ease: [0.22, 1, 0.36, 1],
                    delay: activeStep === 1 ? 0 : index * 0.015,
                  },
                  opacity: {
                    duration: 2.5,
                    delay: activeStep === 1 ? 0 : index * 0.015,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
                style={{
                  vectorEffect: 'non-scaling-stroke',
                }}
              />
            ))}
            
            {activePaths.map((pathData, index) => (
              <motion.path
                key={'stroke-' + String(activeStep) + '-' + String(index)}
                d={pathData}
                fill="none"
                stroke="#D4AF37"
                strokeWidth={activeStep === 0 ? "1.0" : "0.6"}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ 
                  pathLength: 0,
                  opacity: 0,
                }}
                animate={{ 
                  pathLength: 1,
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  pathLength: { 
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                    delay: activeStep === 1 ? 0 : index * 0.015,
                  },
                  opacity: {
                    duration: 2.5,
                    delay: activeStep === 1 ? 0 : index * 0.015,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
                style={{
                  vectorEffect: 'non-scaling-stroke',
                }}
              />
            ))}
          </g>
        </motion.g>

        {/* Active zone layer with full opacity */}
        <motion.g
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.01, 1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{ transformOrigin: "center center" }}
        >
          {activePaths.map((pathData, index) => (
            <motion.path
              key={'active-fill-' + String(activeStep) + '-' + String(index)}
              d={pathData}
              fill="var(--fill-0, #7C715A)"
              initial={{ 
                opacity: 0,
              }}
              animate={{ 
                opacity: 1,
              }}
              transition={{
                duration: 1.0,
                ease: [0.22, 1, 0.36, 1],
                delay: activeStep === 1 ? 0 : index * 0.01,
              }}
            />
          ))}
        </motion.g>
      </svg>
    </div>
  );
}