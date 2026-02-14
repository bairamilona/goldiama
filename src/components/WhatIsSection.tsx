import React, { useState } from "react";
import { motion } from "motion/react";
import { InteractiveParticleBackground } from "@/app/components/InteractiveParticleBackground";

function VisualEmbed({ src }: { src: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div 
        className="absolute inset-0 w-full h-full"
        animate={{ 
            rotate: [-2, 2, -2]
        }}
        transition={{
            duration: 10,
            ease: "easeInOut",
            repeat: Infinity
        }}
    >
        <motion.div
            className="w-full h-full"
            initial={{ opacity: 0, filter: "blur(12px)" }}
            animate={{ 
                opacity: isLoaded ? 1 : 0, 
                filter: isLoaded ? "blur(0px)" : "blur(12px)" 
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
        >
            <iframe 
                src={src}
                onLoad={() => setIsLoaded(true)}
                title="Endless Tools Editor" 
                className="w-full h-full pointer-events-auto touch-none"
                style={{ backgroundColor: "transparent" }}
                frameBorder="0"  
                allow="clipboard-write; encrypted-media; gyroscope; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
            />
        </motion.div>
    </motion.div>
  );
}

export function WhatIsSection() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white border-t border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-0 md:px-6 w-full">
        
        {/* Section Title */}
        <div className="flex justify-center mb-16 md:mb-24 px-6">
          <h2 className="font-heading text-5xl md:text-7xl font-bold text-gray-900 uppercase tracking-tighter text-center">
            What is GDTRADE?
          </h2>
        </div>

        <div className="flex flex-col gap-12 md:gap-16">
          
          {/* Card 1: Crypto Proprietary Trading */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative rounded-3xl md:rounded-3xl shadow-sm md:shadow-sm hover:shadow-md md:hover:shadow-xl transition-shadow duration-500 min-h-[160px] md:h-[450px] flex flex-row md:flex-row-reverse bg-transparent gap-0 overflow-hidden mx-4 md:mx-0"
          >
            {/* Visual Left (Mobile) / Right (Desktop) - Endless Tools Embed */}
            <div className="w-[120px] md:w-[480px] relative h-auto md:h-full bg-white md:bg-white shrink-0">
                <VisualEmbed src="https://app.endlesstools.io/embed/9de881fe-051d-4df1-aed3-d7ac550aaacd" />
            </div>

            {/* Content Right (Mobile) / Left (Desktop) (Text) */}
            <div className="flex-1 relative z-10 overflow-hidden !bg-gradient-to-r !from-white !to-gray-50 md:!bg-gradient-to-r md:!from-[#f0f0f4] md:!to-white">
                <div className="absolute inset-0 block md:hidden">
                    {/* Mobile: Text Right, Visual Left. Fade OUT towards Left (Visual) */}
                    <InteractiveParticleBackground fadeOnLeft={true} fadeOnRight={false} />
                </div>
                <div className="hidden md:block absolute inset-0">
                    {/* Desktop: Text Left, Visual Right. Fade OUT towards Right (Visual) */}
                    <InteractiveParticleBackground fadeOnRight={true} fadeOnLeft={false} />
                </div>
                
                <div className="relative z-10 p-4 md:p-16 flex flex-col justify-center gap-2 md:gap-6 h-full">
                    <h3 className="font-heading text-lg md:text-5xl font-bold text-gray-900 leading-[1.1] md:leading-[0.9] uppercase">
                        Crypto <br /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-gray-900">Proprietary <br /> Trading</span>
                    </h3>
                    {/* Desktop Text */}
                    <p className="font-body !text-2xl text-gray-600 max-w-md !leading-[1.3] hidden md:block">
                        Investing and trading in&nbsp;various digital assets using extensive knowledge and multiple strategies to&nbsp;ensure high returns in&nbsp;a&nbsp;short time
                    </p>
                    {/* Mobile Text - Now matching desktop full text */}
                     <p className="font-body !text-base text-gray-600 !leading-[1.3] block md:hidden">
                        Investing and trading in&nbsp;various digital assets using extensive knowledge and multiple strategies to&nbsp;ensure high returns in&nbsp;a&nbsp;short time
                    </p>
                </div>
            </div>
          </motion.div>

          {/* Card 2: AI & Algorithmic Trading */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative rounded-3xl md:rounded-3xl shadow-sm md:shadow-sm hover:shadow-md md:hover:shadow-xl transition-shadow duration-500 min-h-[160px] md:h-[450px] flex flex-row md:flex-row bg-transparent gap-0 overflow-hidden mx-4 md:mx-0"
          >
            {/* Visual Left - Endless Tools Embed */}
            <div className="w-[120px] md:w-[480px] relative h-auto md:h-full bg-white md:bg-white shrink-0">
                <VisualEmbed src="https://app.endlesstools.io/embed/e058edb0-160b-41f3-adbc-dd158a877e60" />
            </div>

            {/* Content Right (Text) */}
            <div className="flex-1 relative z-10 overflow-hidden !bg-gradient-to-r !from-white !to-gray-50 md:!bg-gradient-to-r md:!from-white md:!to-[#f0f0f4]">
               <div className="absolute inset-0 block md:hidden">
                    {/* Mobile: Text Right, Visual Left. Fade OUT towards Left (Visual) */}
                    <InteractiveParticleBackground fadeOnLeft={true} fadeOnRight={false} />
                </div>
                <div className="hidden md:block absolute inset-0">
                    {/* Desktop: Text Right, Visual Left. Fade OUT towards Left (Visual) */}
                    <InteractiveParticleBackground fadeOnLeft={true} fadeOnRight={false} />
                </div>

               <div className="relative z-10 p-4 md:p-16 flex flex-col justify-center gap-2 md:gap-6 h-full">
                  <h3 className="font-heading text-lg md:text-5xl font-bold text-gray-900 leading-[1.1] md:leading-[0.9] uppercase">
                    AI & <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-gray-900">Algorithmic <br /> Trading</span>
                  </h3>
                  {/* Desktop Text */}
                  <p className="font-body !text-2xl text-gray-600 max-w-md !leading-[1.3] hidden md:block">
                    Custom-made AI and algorithmic trading Platform enhances risk-free returns with&nbsp;meticulously crafted strategies for&nbsp;optimal performance
                  </p>
                  {/* Mobile Text - Now matching desktop full text */}
                  <p className="font-body !text-base text-gray-600 !leading-[1.3] block md:hidden">
                    Custom-made AI and algorithmic trading Platform enhances risk-free returns with&nbsp;meticulously crafted strategies for&nbsp;optimal performance
                  </p>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
