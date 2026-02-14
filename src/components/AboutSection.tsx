import { useEffect, useRef, useState } from 'react';
import emblemImage from "figma:asset/95723c4a1b6fb893e11b31b630a2cbf52b7064b6.png";

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-[#FAFAF8] py-32 md:py-48 overflow-hidden"
    >
      {/* Subtle Background Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #8B7355 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="w-full px-8 md:px-16 lg:px-24">
        
        {/* Header Section */}
        <div className="text-center mb-24 md:mb-32">
          {/* Small Label */}
          <div 
            className={`mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#8B7355]/70 font-light font-['Inter']">
              Our Heritage
            </p>
          </div>

          {/* Main Title */}
          <h2 
            className={`text-[clamp(2rem,5vw,4.5rem)] leading-[1.1] tracking-[-0.01em] font-light text-[#1A1A1A] mb-8 transition-all duration-1000 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            A Modern Interpretation Of<br />Value And Integrity
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          
          {/* Left Column - Emblem */}
          <div className="flex justify-center md:justify-end md:pr-12">
            <div 
              className={`relative transition-all duration-1200 delay-300 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              {/* Emblem Container */}
              <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                <img 
                  src={emblemImage} 
                  alt="Goldiama Emblem" 
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_24px_rgba(139,115,85,0.12)]"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Storytelling Text */}
          <div className="md:pl-8 space-y-8">
            
            {/* Paragraph 1 - Eagle */}
            <div 
              className={`transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="text-[15px] leading-[1.8] text-[#1A1A1A]/80 font-light font-['Inter']">
                <span className="text-[#8B7355] font-medium">The Eagle Of Trust</span> Was Built From Simple Principles: Strength, Fairness, And Long-Term Value. Every Part Of The Design Reflects A Functional Idea Behind How Wealth Should Be Protected And Managed.
              </p>
            </div>

            {/* Paragraph 2 - Wings */}
            <div 
              className={`transition-all duration-1000 delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="text-[15px] leading-[1.8] text-[#1A1A1A]/80 font-light font-['Inter']">
                <span className="text-[#8B7355] font-medium">The Wings</span> Take Their Cue From Gold-Coated Satellite Panels — Engineered For Endurance And Built To Last Under Extreme Conditions.
              </p>
            </div>

            {/* Paragraph 3 - Crown */}
            <div 
              className={`transition-all duration-1000 delay-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="text-[15px] leading-[1.8] text-[#1A1A1A]/80 font-light font-['Inter']">
                <span className="text-[#8B7355] font-medium">The Crown</span> Represents Responsibility And The Clarity Needed To Make Sound Financial Decisions.
              </p>
            </div>

            {/* Paragraph 4 - Scales */}
            <div 
              className={`transition-all duration-1000 delay-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="text-[15px] leading-[1.8] text-[#1A1A1A]/80 font-light font-['Inter']">
                <span className="text-[#8B7355] font-medium">The Scales</span> Stand For Accuracy And Fairness — Because In Precious Metals, Every Number Matters.
              </p>
            </div>

            {/* Paragraph 5 - Shield */}
            <div 
              className={`transition-all duration-1000 delay-900 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="text-[15px] leading-[1.8] text-[#1A1A1A]/80 font-light font-['Inter']">
                <span className="text-[#8B7355] font-medium">And At The Center, The Shield</span> Reinforces What Goldiama Focuses On Most: Protection, Stability, And Continuity.
              </p>
            </div>

            {/* Paragraph 6 - Conclusion */}
            <div 
              className={`pt-4 transition-all duration-1000 delay-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="text-[15px] leading-[1.8] text-[#1A1A1A]/60 font-light italic font-['Inter']">
                It's A Straightforward Symbol Of How We Work — Precision In The Process, Honesty In The Value, And Consistency In Everything That Carries The Goldiama Name.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}