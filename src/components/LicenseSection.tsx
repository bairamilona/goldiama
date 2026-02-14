import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Vector from "@/imports/Vector";
import VaraLogo from "@/imports/Vector-197-72";

export function LicenseSection() {
  return (
    <section className="relative py-32 md:py-48 bg-white border-t border-gray-100 overflow-hidden">
      {/* Background Vector - Eagle/Hawk */}
      {/* Positioned bottom-left, fitted by height */}
      <div className="absolute bottom-0 left-0 h-full w-auto z-0 pointer-events-none [&_path]:!stroke-opacity-[0.15] [mask-image:linear-gradient(45deg,black_30%,transparent_90%)] flex items-end">
         <div className="h-[90%] aspect-square">
            <Vector />
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-4">
          
          {/* Left Column: Headline */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 max-w-2xl"
          >
            <h2 className="font-heading font-normal text-[#333] text-4xl md:text-[54px] leading-[1.1] md:leading-[70px] tracking-[-0.54px]">
              Licensed by the Virtual Assets Regulatory Authority (VARA) in&nbsp;Dubai
            </h2>
          </motion.div>

          {/* Right Column: Content Stack */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-start md:items-end gap-8 flex-1 w-full md:w-auto"
          >
            
            {/* VARA Logo */}
            <div className="w-[200px] md:w-[322px] aspect-[218/25] text-black">
              <VaraLogo />
            </div>

            {/* Arabic Text */}
            <div className="max-w-[460px]">
               <p className="font-body text-[20px] md:text-[24px] text-black text-left md:text-right leading-normal" dir="rtl" lang="ar">
                مرخصة من قبل سلطة تنظيم الأصول الافتراضية
               </p>
            </div>

            {/* Description Text */}
            <div className="max-w-[460px]">
              <p className="font-body text-[20px] md:text-[24px] text-[#333]/70 text-left md:text-right leading-normal">
                GDtrade MENA FZE is authorized and supervised by&nbsp;VARA for&nbsp;proprietary digital assets trading, ensuring full compliance with&nbsp;KYC, AML, and&nbsp;market conduct rules
              </p>
            </div>

            {/* Read More Link */}
            <a 
              href="#" 
              className="group inline-flex items-center gap-2 text-[#333] hover:opacity-70 transition-opacity"
            >
              <span className="font-heading font-semibold text-[20px] tracking-widest uppercase">
                Read more
              </span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </a>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
