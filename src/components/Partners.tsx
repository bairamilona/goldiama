import React, { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import svgPaths from "@/imports/svg-c174shga5b";

// Imported Assets
import imgKingdomBank from "figma:asset/558086cf84efeda10e19e648c826548df5943423.png";
import imgZand from "figma:asset/3b14d3fe872db5134b818eb5ec83329d2a9129db.png";
import imgHashKey from "figma:asset/028f275b595babadc77707c966df47184b42f4ec.png";
import imgBybit from "figma:asset/00aced3525e5044f07b79c96067d72c4898359d4.png";
import imgBinance from "figma:asset/5c01a60f8b87dc220fab9fabbb0518c7ac1eadfa.png";

const OKXLogo = () => (
  <svg className="h-full w-auto text-gray-900" viewBox="0 0 126 36" fill="none">
    <g>
      <path d={svgPaths.p31213900} fill="currentColor" />
      <path d={svgPaths.pb183880} fill="currentColor" />
      <path d={svgPaths.p1b564100} fill="currentColor" />
      <path d={svgPaths.p123a75f0} fill="currentColor" />
      <path d={svgPaths.p12664600} fill="currentColor" />
      <path d={svgPaths.p116fce80} fill="currentColor" />
      <path d={svgPaths.p25ab1f00} fill="currentColor" />
      <path d={svgPaths.p15c51012} fill="currentColor" />
      <path d={svgPaths.p2d9bfa70} fill="currentColor" />
    </g>
  </svg>
);

const PartnerItem = ({ logo, index }: { logo: any; index: number }) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHighlighted(true);
          const timer = setTimeout(() => {
            setIsHighlighted(false);
          }, 2000);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative flex items-center justify-center px-8 md:px-12 transition-all duration-300 cursor-pointer ${
        isHighlighted
          ? "grayscale-0 opacity-100"
          : "grayscale opacity-80 hover:grayscale-0 hover:opacity-100"
      }`}
    >
      {logo.isImg ? (
        <img
          src={logo.src}
          alt={logo.name}
          className={`${logo.h} w-auto object-contain max-w-[120px] md:max-w-[160px]`}
        />
      ) : (
        <div className={`${logo.h} w-auto`}>{logo.component}</div>
      )}
    </div>
  );
};

export function Partners() {
  const logos = [
    { name: "The Kingdom Bank", src: imgKingdomBank, isImg: true, h: "h-12" },
    { name: "Zand", src: imgZand, isImg: true, h: "h-9" },
    { name: "HashKey", src: imgHashKey, isImg: true, h: "h-7" },
    { name: "OKX", component: <OKXLogo />, isImg: false, h: "h-5" },
    { name: "Bybit", src: imgBybit, isImg: true, h: "h-7" },
    { name: "Binance", src: imgBinance, isImg: true, h: "h-7" },
  ];

  // Duplicate for seamless loop
  const marqueeItems = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

  return (
    <section className="py-8 border-y border-gray-200/60 bg-white/40 backdrop-blur-sm relative overflow-hidden">
      <div className="w-full flex items-center justify-between gap-4 md:gap-8">
        
        {/* Marquee Container - Takes available space */}
        <div className="flex-1 overflow-hidden mask-linear-fade h-20 flex items-center pl-4 md:pl-8">
          <motion.div 
            className="flex items-center w-max relative"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              repeat: Infinity, 
              ease: "linear", 
              duration: 40 
            }}
          >
            {marqueeItems.map((logo, index) => (
              <PartnerItem key={`${logo.name}-${index}`} logo={logo} index={index} />
            ))}
          </motion.div>
        </div>

        {/* Stats Block - Compact & Right Aligned */}
        <div className="shrink-0 relative z-20 group">
             {/* Glass effect container for the stat */}
            <div className="bg-gradient-to-r from-blue-600 to-gray-900 text-white py-2 px-4 md:py-3 md:px-6 rounded-none shadow-lg flex items-center gap-3 md:gap-4 transition-transform hover:scale-105 origin-right duration-300">
                <div className="flex flex-col font-sans leading-[1.1] tracking-tight">
                    {/* Mobile: 3 lines */}
                    <span className="text-[10px] uppercase font-bold text-white/90 md:hidden text-right">
                        Active<br/>Operational<br/>Accounts
                    </span>
                    {/* Desktop: 2 lines styled as before but smaller */}
                    <div className="hidden md:flex flex-col items-end">
                         <span className="text-sm text-white/80 font-medium">Active operational</span>
                         <span className="text-base text-white font-bold uppercase">accounts</span>
                    </div>
                </div>
                {/* Indicator dot */}
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
            </div>
        </div>

      </div>
      
      {/* CSS Mask for fade effect on edges of MARQUEE CONTAINER */}
      <style>{`
        .mask-linear-fade {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}</style>
    </section>
  );
}