import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { LazySpline } from '@/app/components/LazySpline';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContactFormModal } from './ContactFormModal';

export function CompareBlockMobile() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [customType, setCustomType] = useState<'bar' | 'coin' | 'luxury' | null>(null);
  
  const slides = [
    {
      id: 'custom-bar',
      title: 'Custom Bar',
      subtitle: 'Personalized Ingots',
      description: 'Design your own gold bar with custom engravings, weights, and finishes.',
      splineUrl: 'https://prod.spline.design/Cq2fQ8Z6UtGYfRzP/scene.splinecode',
      specs: [
        'Available in 1oz to 1kg',
        'Custom engraving included',
        '99.99% pure gold',
        'Certificate of authenticity'
      ]
    },
    {
      id: 'custom-coin',
      title: 'Custom Coin',
      subtitle: 'Unique Collectibles',
      description: 'Craft personalized gold coins with bespoke designs and inscriptions.',
      splineUrl: 'https://prod.spline.design/fY6pF6e09gKGcjq2/scene.splinecode',
      specs: [
        'Available in 1/10oz to 1oz',
        'Custom design & text',
        '99.99% pure gold',
        'Limited edition minting'
      ]
    },
    {
      id: 'luxury-box',
      title: 'Luxury Box',
      subtitle: 'Premium Presentation',
      description: 'Every custom order arrives in luxury packaging, designed for gifting or personal collection.',
      splineUrl: 'https://prod.spline.design/GIAQNuZB8PvIWwA9/scene.splinecode',
      specs: [
        'Hand-Crafted Wooden Cases',
        'Velvet Interior Lining',
        'Authenticity Certificates',
        'Insured Worldwide Delivery'
      ]
    }
  ];

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    
    if (info.offset.x > threshold && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (info.offset.x < -threshold && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section 
      id="custom" 
      className="relative w-full bg-white overflow-hidden"
    >
      {/* Header */}
      <div className="relative pt-16 pb-8 text-center px-6 bg-white">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[10px] tracking-[0.3em] uppercase text-[#B8A07E] mb-3 font-['Inter']"
        >
          Bespoke Collection
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[2.5rem] leading-[1.1] tracking-[-0.02em] font-light text-black"
          style={{ 
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          Create Your Legacy
        </motion.h2>
      </div>

      {/* Stories Container */}
      <div className="relative w-full h-[calc(100vh-200px)] min-h-[600px] bg-black">
        {/* Progress Indicators */}
        <div className="absolute top-4 left-0 right-0 z-20 flex gap-2 px-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: index === currentSlide ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </button>
          ))}
        </div>

        {/* Slides */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentSlide}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 overflow-visible"
          >
            {/* 3D Background - Zoom 50%, overflow visible */}
            <div className="absolute inset-0 scale-50 origin-center overflow-visible">
              <LazySpline
                url={slides[currentSlide].splineUrl}
                className="w-full h-full overflow-visible"
              />
            </div>

            {/* Gradient Overlay для читаемости текста */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Text Content - Desktop стиль */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute bottom-0 left-0 right-0 p-8 pb-12 text-white"
            >
              <p className="text-xs text-white/60 uppercase tracking-[0.2em] mb-3 font-['Inter']">
                {slides[currentSlide].subtitle}
              </p>

              <h3 
                className="text-4xl md:text-5xl text-white/95 mb-4 font-light tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {slides[currentSlide].title}
              </h3>

              <p className="text-sm text-white/70 leading-relaxed mb-6 font-['Inter']">
                {slides[currentSlide].description}
              </p>

              {/* Specs - Desktop стиль */}
              <div className="mb-8">
                <div className="grid grid-cols-1 gap-y-2">
                  {slides[currentSlide].specs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2 font-['Inter'] text-xs text-white/60">
                      <span className="text-white/30">—</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button - Desktop стиль */}
              <button
                onClick={() => {
                  setIsContactModalOpen(true);
                  setCustomType(slides[currentSlide].id === 'custom-bar' ? 'bar' : slides[currentSlide].id === 'custom-coin' ? 'coin' : 'luxury');
                }}
                className="group inline-flex items-center gap-3 px-8 py-3 rounded-full border border-white/30 hover:border-white/60 hover:bg-white/5 transition-all duration-500 active:scale-95"
              >
                <span className="font-['Inter'] text-xs uppercase tracking-[0.2em] text-white/90">
                  Explore Options
                </span>
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {currentSlide > 0 && (
          <button
            onClick={() => setCurrentSlide(currentSlide - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        
        {currentSlide < slides.length - 1 && (
          <button
            onClick={() => setCurrentSlide(currentSlide + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Legacy Process Steps - Три тезиса */}
      <div className="relative w-full bg-[#0a0a0f] py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Three columns - мобильная версия */}
          <div className="grid grid-cols-1 gap-8">
            
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
              <h4 className="text-3xl font-['Cormorant_Garamond'] text-white mb-2 leading-[1.1] tracking-tight">
                Brand Creation
              </h4>
              <p className="text-[10px] font-['Inter'] text-white/50 leading-relaxed tracking-[0.15em] uppercase">
                Unique Identity Design
              </p>
            </motion.div>

            {/* Column 02 */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ 
                duration: 0.9, 
                ease: [0.19, 1.0, 0.22, 1.0],
                delay: 0.2 
              }}
            >
              <h4 className="text-3xl font-['Cormorant_Garamond'] text-white mb-2 leading-[1.1] tracking-tight">
                Hallmark Registration
              </h4>
              <p className="text-[10px] font-['Inter'] text-white/50 leading-relaxed tracking-[0.15em] uppercase">
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
                delay: 0.3 
              }}
            >
              <h4 className="text-3xl font-['Cormorant_Garamond'] text-white mb-2 leading-[1.1] tracking-tight">
                Brand Production
              </h4>
              <p className="text-[10px] font-['Inter'] text-white/50 leading-relaxed tracking-[0.15em] uppercase">
                Swiss Craftsmanship
              </p>
            </motion.div>

          </div>
        </div>
      </div>

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
    </section>
  );
}