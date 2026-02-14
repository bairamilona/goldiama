import React from "react";
import { motion } from "motion/react";

export function LegacyProduction() {
  return (
    <section className="py-24 md:py-32 bg-[#F5F3EC] text-[#1D2A2A] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Magazine Style Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-[#1D2A2A]/10 pb-8">
            <h2 className="font-['Belleza'] text-5xl md:text-7xl leading-none">
                A Legacy <br />
                <span className="italic font-light ml-12 md:ml-24">Refined.</span>
            </h2>
            <p className="max-w-xs text-sm font-medium uppercase tracking-widest text-gray-500 mb-2">
                Est. 1995 • Dubai, UAE
            </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            {/* Left text column */}
            <div className="md:col-span-4 flex flex-col justify-between order-2 md:order-1">
                <div className="space-y-8">
                    <p className="text-xl leading-relaxed font-['Belleza']">
                        "True luxury lies not in the abundance of gold, but in the precision of its crafting."
                    </p>
                    <p className="text-gray-600 font-light leading-relaxed">
                        Our master craftsmen combine centuries-old techniques with modern precision engineering. Every bar that leaves our facility is a testament to perfection, assayed by independent Swiss laboratories to ensure absolute purity.
                    </p>
                </div>
                
                <div className="mt-12">
                    <div className="grid grid-cols-2 gap-8">
                         <div>
                            <span className="block text-4xl font-['Belleza'] mb-2">25+</span>
                            <span className="text-xs uppercase tracking-wider text-gray-500">Years Experience</span>
                         </div>
                         <div>
                            <span className="block text-4xl font-['Belleza'] mb-2">10k+</span>
                            <span className="text-xs uppercase tracking-wider text-gray-500">Clients Served</span>
                         </div>
                    </div>
                </div>
            </div>

            {/* Right Image Grid */}
            <div className="md:col-span-8 order-1 md:order-2 grid grid-cols-2 gap-4 md:gap-8">
                <motion.div 
                    className="relative mt-12 md:mt-24"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <img 
                        src="https://images.unsplash.com/photo-1679019937997-2272d4a840ee?auto=format&fit=crop&q=80" 
                        alt="Craftsman" 
                        className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    <p className="absolute -bottom-6 left-0 text-xs font-bold uppercase tracking-widest text-gray-400">01. Casting</p>
                </motion.div>
                
                <motion.div 
                    className="relative"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <img 
                        src="https://images.unsplash.com/photo-1547259891-5d393d0fb2c8?auto=format&fit=crop&q=80" 
                        alt="Refining" 
                        className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                     <p className="absolute -bottom-6 left-0 text-xs font-bold uppercase tracking-widest text-gray-400">02. Refining</p>
                </motion.div>
            </div>
        </div>
      </div>
    </section>
  );
}
