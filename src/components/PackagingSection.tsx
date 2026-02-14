import React from "react";
import { motion } from "motion/react";

export function PackagingSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <div className="relative">
                {/* Large Background Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0">
                    <span className="text-[12vw] md:text-[15vw] leading-none font-['Belleza'] text-gray-50 opacity-50 whitespace-nowrap">
                        UNBOXING
                    </span>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-24">
                    <motion.div 
                        className="flex-1 w-full"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1760804876166-aae5861ec7c1?auto=format&fit=crop&q=80" 
                            alt="Luxury Packaging" 
                            className="w-full h-auto shadow-2xl" 
                        />
                    </motion.div>
                    
                    <motion.div 
                        className="flex-1 text-center md:text-left"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">The Art of Giving</h3>
                        <h2 className="font-['Belleza'] text-4xl md:text-5xl text-[#1D2A2A] mb-8">
                            Timeless Craftsmanship, <br />
                            Wrapped in Elegance.
                        </h2>
                        <p className="text-gray-600 font-light leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
                            Each Goldiama purchase arrives in our signature velvet-lined mahogany case, accompanied by a certificate of authenticity. An experience that begins the moment you hold it.
                        </p>
                        <button className="text-[#1D2A2A] border-b border-[#1D2A2A] pb-1 hover:text-yellow-600 hover:border-yellow-600 transition-colors uppercase text-sm tracking-widest font-['Belleza']">
                            Explore Collections
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    </section>
  )
}
