import { useState } from 'react';
import { motion } from 'motion/react';
import { LazySpline } from '@/app/components/LazySpline';
import { CompareBlockMobile } from '@/app/components/CompareBlockMobile';
import { ContactFormModal } from './ContactFormModal';
import noiseTexture from 'figma:asset/3bbfa7222d026613911cd55a43c11daf446cb9e2.png';

export function CompareBlock() {
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | 'luxury' | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isTimelineHovered, setIsTimelineHovered] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [customType, setCustomType] = useState<'bar' | 'coin' | 'luxury' | null>(null);

  // Premium easing
  const premiumEasing = [0.33, 0.1, 0.33, 1];

  // Product data
  const leftProduct = {
    title: 'Custom Bar',
    subtitle: 'Personalized Ingots',
    description: 'Design your own gold bar with custom engravings, weights, and finishes.',
    specs: [
      'Available in 1oz to 1kg',
      'Custom engraving included',
      '99.99% pure gold',
      'Certificate of authenticity'
    ]
  };

  const rightProduct = {
    title: 'Custom Coin',
    subtitle: 'Unique Collectibles',
    description: 'Craft personalized gold coins with bespoke designs and inscriptions.',
    specs: [
      'Available in 1/10oz to 1oz',
      'Custom design & text',
      '99.99% pure gold',
      'Limited edition minting'
    ]
  };

  const luxuryProduct = {
    title: 'Luxury Box',
    subtitle: 'Premium Presentation',
    description: 'Every custom order arrives in luxury packaging, designed for gifting or personal collection.',
    specs: [
      'Hand-Crafted Wooden Cases',
      'Velvet Interior Lining',
      'Authenticity Certificates',
      'Insured Worldwide Delivery'
    ]
  };

  // 📱 MOBILE: Показываем Stories-версию
  // 💻 DESKTOP: Показываем полную desktop-версию
  
  return (
    <>
      {/* Mobile Version - Stories Style */}
      <div className="block md:hidden">
        <CompareBlockMobile />
      </div>

      {/* Desktop Version - Original Layout */}
      <section 
        id="compare-block" 
        className="hidden md:block relative w-full bg-[#0a0a0f]"
      >
        {/* Gradient Transition from Wholesale (FAFAF8) to White */}
        <div 
          className="absolute top-0 left-0 w-full h-32 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, #FAFAF8 0%, #FFFFFF 100%)',
          }}
        />
        
        {/* Header Block - отдельная секция на светлом фоне */}
        <div className="relative w-full bg-white border-b border-gray-200">
          <div className="relative pt-20 pb-12 lg:pt-32 lg:pb-16 text-center px-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-[11px] tracking-[0.3em] uppercase text-[#B8A07E] mb-4 font-['Inter']"
            >
              Bespoke Collection
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[clamp(3rem,6vw,5.5rem)] leading-[1.05] tracking-[-0.02em] font-light text-black"
              style={{ 
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Create Your Legacy
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base text-black/70 mt-6 max-w-3xl mx-auto font-light leading-relaxed font-['Inter']"
            >
              Design personalized gold bars and coins with custom engravings, weights, and finishes. 
              Each piece arrives in luxury presentation packaging.
            </motion.p>
          </div>
        </div>

        {/* 3D Panels Section */}
        <div className="relative w-full h-screen" style={{ minHeight: '900px' }}>
          {/* Container with flex layout */}
          <div className="w-full h-full flex flex-col">
            
            {/* Top Row - Two columns */}
            <div className="flex border-b border-white/10" style={{ 
              flex: hoveredSide === 'luxury' ? '0 0 45%' : hoveredSide === 'left' || hoveredSide === 'right' ? '0 0 70%' : '0 0 60%',
              transition: 'flex 0.8s cubic-bezier(0.33, 0.1, 0.33, 1)'
            }}>
              
              {/* Left Panel - Custom Bar */}
              <div
                className="relative bg-[#0a0a0f] overflow-hidden border-r border-white/10"
                style={{ 
                  flex: hoveredSide === 'left' ? '0 0 60%' : hoveredSide === 'right' ? '0 0 40%' : '0 0 50%',
                  transition: 'flex 0.8s cubic-bezier(0.33, 0.1, 0.33, 1)'
                }}
                onMouseEnter={() => setHoveredSide('left')}
                onMouseLeave={() => setHoveredSide(null)}
              >
                {/* Dimming overlay */}
                <motion.div
                  className="absolute inset-0 bg-black pointer-events-none z-10"
                  animate={{ opacity: (hoveredSide === 'left' || hoveredSide === 'right') ? 0.4 : 0 }}
                  transition={{ duration: 0.5, ease: premiumEasing }}
                />
                
                {/* Brightness overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-white pointer-events-none z-10"
                  style={{ mixBlendMode: 'overlay' }}
                  animate={{ opacity: hoveredSide === 'left' ? 0.12 : 0 }}
                  transition={{ duration: 0.4, ease: premiumEasing }}
                />
                
                {/* 3D Scene - Fixed size, slight zoom only */}
                <motion.div 
                  className="absolute"
                  style={{ 
                    top: '50%',
                    left: '50%',
                    width: '1000px',
                    height: '1000px',
                    marginLeft: '-500px',
                    marginTop: '-500px'
                  }}
                  animate={{ 
                    scale: hoveredSide === 'left' ? 1.05 : 1
                  }}
                  transition={{ duration: 0.6, ease: premiumEasing }}
                >
                  <LazySpline
                    scene="https://prod.spline.design/LRiA4rWtLlexpu7i/scene.splinecode"
                    style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
                  />
                </motion.div>

                {/* Content Overlay */}
                <motion.div 
                  className="absolute inset-0 flex flex-col items-start justify-center z-20"
                  animate={{
                    opacity: hoveredSide === 'left' ? 1 : hoveredSide === 'right' ? 0.15 : 0.45
                  }}
                  transition={{ duration: 0.4, ease: premiumEasing }}
                >
                  <div className="pl-8 md:pl-12 lg:pl-16 max-w-md">
                    <motion.h3 
                      className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl text-white/95 mb-3"
                      animate={{ opacity: hoveredSide === 'left' ? 1 : 0.7 }}
                      transition={{ duration: 0.5, ease: premiumEasing }}
                    >
                      {leftProduct.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="font-['Inter'] text-sm md:text-base text-white/60 uppercase tracking-[0.2em] mb-6"
                      animate={{ opacity: hoveredSide === 'left' ? 1 : 0.5 }}
                      transition={{ duration: 0.4, ease: premiumEasing }}
                    >
                      {leftProduct.subtitle}
                    </motion.p>

                    <motion.p 
                      className="font-['Inter'] text-sm text-white/70 leading-relaxed mb-6"
                      animate={{ opacity: hoveredSide === 'left' ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: premiumEasing }}
                    >
                      {leftProduct.description}
                    </motion.p>

                    <motion.div 
                      className="mb-8"
                      animate={{ opacity: hoveredSide === 'left' ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: premiumEasing }}
                    >
                      <div className="grid grid-cols-1 gap-y-2">
                        {leftProduct.specs.map((spec, i) => (
                          <div key={i} className="flex items-start gap-2 font-['Inter'] text-xs text-white/60">
                            <span className="text-white/30">—</span>
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.button
                      className="group inline-flex items-center gap-3 px-8 py-3 rounded-full border border-white/30 hover:border-white/60 hover:bg-white/5 transition-all duration-500 active:scale-95 pointer-events-auto cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ duration: 0.6, ease: premiumEasing, delay: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setCustomType('bar');
                        setIsContactModalOpen(true);
                      }}
                    >
                      <span className="font-['Inter'] text-xs uppercase tracking-[0.2em] text-white/90">
                        Explore Options
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>

              {/* Right Panel - Custom Coin */}
              <div
                className="relative bg-[#0a0a0f] overflow-hidden"
                style={{ 
                  flex: hoveredSide === 'right' ? '0 0 60%' : hoveredSide === 'left' ? '0 0 40%' : '0 0 50%',
                  transition: 'flex 0.8s cubic-bezier(0.33, 0.1, 0.33, 1)'
                }}
                onMouseEnter={() => setHoveredSide('right')}
                onMouseLeave={() => setHoveredSide(null)}
              >
                {/* Dimming overlay */}
                <motion.div
                  className="absolute inset-0 bg-black pointer-events-none z-10"
                  animate={{ opacity: hoveredSide === 'right' ? 0.4 : 0 }}
                  transition={{ duration: 0.5, ease: premiumEasing }}
                />
                
                {/* Brightness overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-white pointer-events-none z-10"
                  style={{ mixBlendMode: 'overlay' }}
                  animate={{ opacity: hoveredSide === 'right' ? 0.12 : 0 }}
                  transition={{ duration: 0.4, ease: premiumEasing }}
                />
                
                {/* 3D Scene - Fixed size, slight zoom only */}
                <motion.div 
                  className="absolute"
                  style={{ 
                    top: '50%',
                    left: '50%',
                    width: '1000px',
                    height: '1000px',
                    marginLeft: '-500px',
                    marginTop: '-500px'
                  }}
                  animate={{ 
                    scale: hoveredSide === 'right' ? 1.05 : 1
                  }}
                  transition={{ duration: 0.6, ease: premiumEasing }}
                >
                  <LazySpline
                    scene="https://prod.spline.design/xDHgvyQ0AufB0oAo/scene.splinecode"
                    style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
                  />
                </motion.div>

                {/* Content Overlay */}
                <motion.div 
                  className="absolute inset-0 flex flex-col items-start justify-center z-20"
                  animate={{
                    opacity: hoveredSide === 'right' ? 1 : hoveredSide === 'left' ? 0.15 : 0.45
                  }}
                  transition={{ duration: 0.4, ease: premiumEasing }}
                >
                  <div className="pl-8 md:pl-12 lg:pl-16 max-w-md">
                    <motion.h3 
                      className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl text-white/95 mb-3"
                      animate={{ opacity: hoveredSide === 'right' ? 1 : 0.7 }}
                      transition={{ duration: 0.5, ease: premiumEasing }}
                    >
                      {rightProduct.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="font-['Inter'] text-sm md:text-base text-white/60 uppercase tracking-[0.2em] mb-6"
                      animate={{ opacity: hoveredSide === 'right' ? 1 : 0.5 }}
                      transition={{ duration: 0.4, ease: premiumEasing }}
                    >
                      {rightProduct.subtitle}
                    </motion.p>

                    <motion.p 
                      className="font-['Inter'] text-sm text-white/70 leading-relaxed mb-6"
                      animate={{ opacity: hoveredSide === 'right' ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: premiumEasing }}
                    >
                      {rightProduct.description}
                    </motion.p>

                    <motion.div 
                      className="mb-8"
                      animate={{ opacity: hoveredSide === 'right' ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: premiumEasing }}
                    >
                      <div className="grid grid-cols-1 gap-y-2">
                        {rightProduct.specs.map((spec, i) => (
                          <div key={i} className="flex items-start gap-2 font-['Inter'] text-xs text-white/60">
                            <span className="text-white/30">—</span>
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.button
                      className="group inline-flex items-center gap-3 px-8 py-3 rounded-full border border-white/30 hover:border-white/60 hover:bg-white/5 transition-all duration-500 active:scale-95 pointer-events-auto cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ duration: 0.6, ease: premiumEasing, delay: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setCustomType('coin');
                        setIsContactModalOpen(true);
                      }}
                    >
                      <span className="font-['Inter'] text-xs uppercase tracking-[0.2em] text-white/90">
                        Explore Options
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>

            </div>

            {/* Bottom Row - Full width Luxury Box */}
            <div
              className="relative bg-[#0a0a0f] overflow-hidden"
              style={{ 
                flex: hoveredSide === 'luxury' ? '0 0 55%' : hoveredSide === 'left' || hoveredSide === 'right' ? '0 0 30%' : '0 0 40%',
                transition: 'flex 0.8s cubic-bezier(0.33, 0.1, 0.33, 1)'
              }}
              onMouseEnter={() => setHoveredSide('luxury')}
              onMouseLeave={() => setHoveredSide(null)}
            >
              {/* Dimming overlay */}
              <motion.div
                className="absolute inset-0 bg-black pointer-events-none z-10"
                animate={{ opacity: (hoveredSide === 'left' || hoveredSide === 'right') ? 0.75 : 0 }}
                transition={{ duration: 0.5, ease: premiumEasing }}
              />
              
              {/* Brightness overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-white pointer-events-none z-10"
                style={{ mixBlendMode: 'overlay' }}
                animate={{ opacity: hoveredSide === 'luxury' ? 0.12 : 0 }}
                transition={{ duration: 0.4, ease: premiumEasing }}
              />
              
              {/* 3D Scene - Fixed size, slight zoom only */}
              <motion.div 
                className="absolute"
                style={{ 
                  top: '50%',
                  left: '50%',
                  width: '100vw',
                  height: '800px',
                  marginLeft: '-50vw',
                  marginTop: '-400px'
                }}
                animate={{ 
                  scale: hoveredSide === 'luxury' ? 1.05 : 1
                }}
                transition={{ duration: 0.6, ease: premiumEasing }}
              >
                <LazySpline
                  scene="https://prod.spline.design/yT0oCr3pevScJCWl/scene.splinecode"
                  style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
                />
              </motion.div>

              {/* Content Overlay */}
              <motion.div 
                className="absolute inset-0 flex flex-col items-start justify-center z-20"
                animate={{
                  opacity: hoveredSide === 'luxury' ? 1 : (hoveredSide === 'left' || hoveredSide === 'right') ? 0.15 : 0.45
                }}
                transition={{ duration: 0.4, ease: premiumEasing }}
              >
                <div className="pl-8 md:pl-12 lg:pl-16 max-w-lg">
                  <motion.h3 
                    className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl text-white/95 mb-3"
                    animate={{ opacity: hoveredSide === 'luxury' ? 1 : 0.7 }}
                    transition={{ duration: 0.5, ease: premiumEasing }}
                  >
                    {luxuryProduct.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="font-['Inter'] text-sm md:text-base text-white/60 uppercase tracking-[0.2em] mb-6"
                    animate={{ opacity: hoveredSide === 'luxury' ? 1 : 0.5 }}
                    transition={{ duration: 0.4, ease: premiumEasing }}
                  >
                    {luxuryProduct.subtitle}
                  </motion.p>

                  <motion.p 
                    className="font-['Inter'] text-sm text-white/70 leading-relaxed mb-6"
                    animate={{ opacity: hoveredSide === 'luxury' ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: premiumEasing }}
                  >
                    {luxuryProduct.description}
                  </motion.p>

                  <motion.div 
                    className="mb-8"
                    animate={{ opacity: hoveredSide === 'luxury' ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: premiumEasing }}
                  >
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {luxuryProduct.specs.map((spec, i) => (
                        <div key={i} className="flex items-start gap-2 font-['Inter'] text-xs text-white/60">
                          <span className="text-white/30">—</span>
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.button
                    className="group inline-flex items-center gap-3 px-8 py-3 rounded-full border border-white/30 hover:border-white/60 hover:bg-white/5 transition-all duration-500 active:scale-95 pointer-events-auto cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.6, ease: premiumEasing, delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setCustomType('luxury');
                      setIsContactModalOpen(true);
                    }}
                  >
                    <span className="font-['Inter'] text-xs uppercase tracking-[0.2em] text-white/90">
                      Explore Options
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            </div>

          </div>
        </div>

        {/* Legacy Process Steps - Subtle height expansion on hover */}
        <motion.div 
          className="relative w-full bg-[#0a0a0f] border-t border-white/10 overflow-hidden cursor-pointer"
          animate={{ 
            height: isTimelineHovered ? '270px' : '250px'
          }}
          transition={{ 
            duration: 0.7, 
            ease: [0.33, 0.1, 0.33, 1]
          }}
          onMouseEnter={() => setIsTimelineHovered(true)}
          onMouseLeave={() => setIsTimelineHovered(false)}
        >
          {/* Atmospheric background */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `url(${noiseTexture})`,
                backgroundRepeat: 'repeat',
                backgroundSize: '512px 512px',
              }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(20, 20, 30, 0.4) 0%, transparent 100%)',
              }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.6) 100%)',
              }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 60%)',
              }}
            />
          </div>

          {/* Brightness overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-white pointer-events-none z-5"
            style={{ mixBlendMode: 'overlay' }}
            animate={{ opacity: isTimelineHovered ? 0.06 : 0 }}
            transition={{ duration: 0.5, ease: premiumEasing }}
          />

          <div className="max-w-7xl mx-auto relative z-10 h-full flex items-center py-16 px-4">
            
            {/* Three columns - Premium, brutal typography */}
            <div className="grid grid-cols-3 gap-12 md:gap-20 lg:gap-32 xl:gap-48 w-full mx-auto">
              
              {/* Column 01 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ 
                  duration: 0.9, 
                  ease: [0.19, 1.0, 0.22, 1.0],
                  delay: 0.1 
                }}
              >
                <h4 className="text-[2rem] md:text-[2.25rem] lg:text-[2.5rem] xl:text-[2.75rem] font-['Cormorant_Garamond'] text-white mb-3 leading-[1.1] tracking-tight xl:whitespace-nowrap">
                  Brand Creation
                </h4>
                <p className="text-[11px] font-['Inter'] text-white/50 leading-relaxed tracking-[0.15em] uppercase">
                  Unique Identity Design
                </p>
              </motion.div>

              {/* Column 02 */}
              <motion.div
                className="text-center flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ 
                  duration: 0.9, 
                  ease: [0.19, 1.0, 0.22, 1.0],
                  delay: 0.25 
                }}
              >
                <h4 className="text-[2rem] md:text-[2.25rem] lg:text-[2.5rem] xl:text-[2.75rem] font-['Cormorant_Garamond'] text-white mb-3 leading-[1.1] tracking-tight text-center xl:whitespace-nowrap">
                  Hallmark Registration
                </h4>
                <p className="text-[11px] font-['Inter'] text-white/50 leading-relaxed tracking-[0.15em] uppercase text-center">
                  Official Legal Protection
                </p>
              </motion.div>

              {/* Column 03 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ 
                  duration: 0.9, 
                  ease: [0.19, 1.0, 0.22, 1.0],
                  delay: 0.4 
                }}
              >
                <h4 className="text-[2rem] md:text-[2.25rem] lg:text-[2.5rem] xl:text-[2.75rem] font-['Cormorant_Garamond'] text-white mb-3 leading-[1.1] tracking-tight xl:whitespace-nowrap">
                  Brand Production
                </h4>
                <p className="text-[11px] font-['Inter'] text-white/50 leading-relaxed tracking-[0.15em] uppercase">
                  Swiss Craftsmanship
                </p>
              </motion.div>

            </div>

          </div>
        </motion.div>
      </section>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setCustomType(null);
        }}
        inquiryType="custom"
        customType={customType}
        defaultMessage={
          customType === 'bar' 
            ? 'I\'m interested in creating a custom gold bar with personalized engravings. Please provide details about available weights, design options, and pricing.'
            : customType === 'coin'
            ? 'I\'d like to design a custom gold coin with bespoke artwork. Please share information about sizes, minting processes, and costs.'
            : customType === 'luxury'
            ? 'I\'m interested in premium luxury packaging for my gold products. Please provide details about available materials, customization options, and pricing.'
            : ''
        }
      />
    </>
  );
}