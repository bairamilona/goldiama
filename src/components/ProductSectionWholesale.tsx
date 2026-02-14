import { useState, useRef, useEffect, memo } from 'react';
import { motion } from 'motion/react';
import { debounce } from '@/lib/performance-utils';
import { ContactFormModal } from './ContactFormModal';

// Import Goldiama bar images
import gold1kg from 'figma:asset/a170b54df5d5398cac019a5501be723af458178a.png';
import gold500g from 'figma:asset/5329d2582195bdf8700e687e51463aacf9204eee.png';
import silver1kg from 'figma:asset/9d6d887510b9c65d4b05e9a9e6067159d8fd45f6.png';
import silver500g from 'figma:asset/804b3c4fa4b246fbe964fefd560161cfd4ca6ab8.png';

type FilterCategory = 'ALL' | 'GOLD BARS' | 'SILVER BARS';

interface WholesaleProduct {
  id: string;
  name: string;
  weight: string;
  category: FilterCategory;
  metal: string;
  image: string;
  purity: string;
  averageColor: string; // Average color from the product image
  darkestColor: string; // Darkest color from the product image for text
}

const products: WholesaleProduct[] = [
  {
    id: 'gold-1kg',
    name: '1 KG GOLD BAR',
    weight: '1 kg',
    category: 'GOLD BARS',
    metal: 'Gold',
    purity: '999.9',
    image: gold1kg,
    averageColor: 'rgba(165, 140, 98, 1)', // Darker warm golden tone
    darkestColor: 'rgba(62, 45, 28, 1)', // Deep brown from gold shadows
  },
  {
    id: 'gold-500g',
    name: '500 G GOLD BAR',
    weight: '500 g',
    category: 'GOLD BARS',
    metal: 'Gold',
    purity: '999.9',
    image: gold500g,
    averageColor: 'rgba(165, 140, 98, 1)', // Darker warm golden tone
    darkestColor: 'rgba(62, 45, 28, 1)', // Deep brown from gold shadows
  },
  {
    id: 'silver-1kg',
    name: '1 KG SILVER BAR',
    weight: '1 kg',
    category: 'SILVER BARS',
    metal: 'Silver',
    purity: '999',
    image: silver1kg,
    averageColor: 'rgba(135, 135, 140, 1)', // Darker cool silver tone
    darkestColor: 'rgba(45, 45, 50, 1)', // Deep anthracite from silver shadows
  },
  {
    id: 'silver-500g',
    name: '500 G SILVER BAR',
    weight: '500 g',
    category: 'SILVER BARS',
    metal: 'Silver',
    purity: '999',
    image: silver500g,
    averageColor: 'rgba(135, 135, 140, 1)', // Darker cool silver tone
    darkestColor: 'rgba(45, 45, 50, 1)', // Deep anthracite from silver shadows
  },
];

// Product Card Component - Simple Background Animation (10 sec loop) - ✅ МЕМОИЗИРОВАН
const ProductCard = memo(function ProductCard({ product, onRequestQuote }: { product: WholesaleProduct; onRequestQuote: (product: WholesaleProduct) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // ✅ Отложенная инициализация
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ Отложенная инициализация: запускаем canvas только когда карточка в viewport
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Задержка 100ms для уменьшения нагрузки на первый рендер
    
    return () => clearTimeout(timer);
  }, []);

  // Ultra-fine grain noise effect
  useEffect(() => {
    if (!isVisible) return; // ✅ Не запускаем canvas до момента видимости
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grainDensity = 0.08; // Более мелкий нойз (было 0.18)
    const resolutionMultiplier = 1.0; // Выше разрешение для мелких частиц (было 0.6)

    let animationFrameId: number;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.floor(rect.width * resolutionMultiplier);
      const height = Math.floor(rect.height * resolutionMultiplier);
      
      if (width > 0 && height > 0) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    };

    const renderGrain = () => {
      const { width, height } = canvas;
      if (width <= 0 || height <= 0) return;
      
      const imageData = ctx.createImageData(width, height);
      const buffer = imageData.data;

      for (let i = 0; i < buffer.length; i += 4) {
        if (Math.random() < grainDensity) {
          const brightness = 180 + Math.random() * 75;
          buffer[i] = brightness;
          buffer[i + 1] = brightness;
          buffer[i + 2] = brightness;
          buffer[i + 3] = 140; // Чуть меньш opacity для деликатности (было 180)
        } else {
          buffer[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const animate = () => {
      renderGrain();
      animationFrameId = requestAnimationFrame(animate);
    };

    if (resizeCanvas()) {
      animate();
    }

    const handleResize = debounce(() => resizeCanvas(), 100);
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible]);

  return (
    <motion.div
      className="relative rounded-[12px] md:rounded-[16px] overflow-hidden cursor-pointer w-full md:w-[calc(23%-16px)] aspect-[4/5] md:aspect-auto md:h-[550px]"
      style={{
        backgroundColor: '#F5F5F3',
      }}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 1.2, 
        ease: [0.19, 1.0, 0.22, 1.0],
        opacity: { duration: 1.0, ease: 'easeOut' }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 📱 Медленная анимация фона вверх-вниз (10 секунд цикл) */}
      <motion.div
        className="absolute inset-0 bg-cover bg-no-repeat will-change-transform"
        style={{
          backgroundImage: `url('${product.image}')`,
          backgroundPosition: '50% 50%',
          backgroundSize: product.id === 'silver-500g' ? '180%' : '150%', // ✅ 500g Silver = 180%, остальные = 150%
          transformOrigin: 'center',
          filter: isHovered ? 'brightness(1.05)' : 'brightness(1)', // Subtle bloom on hover
        }}
        animate={{
          scale: isHovered ? 1.05 : 1.0, // ✅ Уменьшен зум с 1.1 до 1.05
          y: ['0%', '-0.5%', '0.5%', '0%'], // ✅ Уменьшена амплитуда с 1% до 0.5%
        }}
        transition={{
          scale: {
            duration: 0.4,
            ease: [0.4, 0.0, 0.2, 1],
          },
          y: {
            duration: 20, // 20 секунд полный цикл (в 2 раза медленнее)
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          },
        }}
      />

      {/* Bloom glow layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
          mixBlendMode: 'soft-light',
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94], // Quad ease-out for smooth glow
        }}
      />

      {/* Subtle vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.08) 100%)',
        }}
      />

      {/* Gradient blur for text readability - positioned below noise */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none z-8"
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          maskImage: `linear-gradient(to top, ${product.averageColor} 0%, rgba(0,0,0,0.7) 40%, transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to top, ${product.averageColor} 0%, rgba(0,0,0,0.7) 40%, transparent 100%)`,
        }}
      />

      {/* Bottom shadow gradient for depth */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none z-9"
        style={{
          background: `linear-gradient(to top, ${product.averageColor.replace('1)', '0.6)')} 0%, ${product.averageColor.replace('1)', '0.3)')} 40%, transparent 100%)`,
        }}
      />

      {/* Ultra-fine Canvas Grain Overlay - Smooth fade in/out */}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{
          mixBlendMode: 'overlay',
        }}
        animate={{
          opacity: isHovered ? 0.30 : 0.25, // Увеличивается на 5% при hover
        }}
        transition={{
          opacity: {
            duration: 0.7,
            ease: [0.4, 0.0, 0.2, 1], // Material Design standard easing
          }
        }}
      />

      {/* Technical Product Info - Monotone Body Text */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 z-30 px-3 md:px-6 lg:px-8 pb-3 md:pb-6 lg:pb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Technical specifications - compact and uniform - поднимаются при hover */}
        <motion.div 
          className="space-y-1 md:space-y-1.5"
          animate={{
            y: isHovered ? -60 : 0, // Поднимаются вверх когда появляется кнопка (только на desktop)
          }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0.0, 0.2, 1],
          }}
        >
          <p 
            className="text-[9px] md:text-[10px] lg:text-[11px] font-normal tracking-[0.08em] uppercase leading-relaxed"
            style={{ 
              fontFamily: "'Inter', sans-serif",
              color: product.darkestColor,
              opacity: 0.95,
            }}
          >
            {product.name}
          </p>
          
          <div className="flex items-center gap-1.5 md:gap-3 flex-wrap">
            <p 
              className="text-[8px] md:text-[10px] lg:text-[11px] font-light tracking-wide"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                color: product.darkestColor,
                opacity: 0.85,
              }}
            >
              Weight: {product.weight}
            </p>
            
            <span 
              className="text-[6px] md:text-[8px]"
              style={{ 
                color: product.darkestColor,
                opacity: 0.45,
              }}
            >•</span>
            
            <p 
              className="text-[8px] md:text-[10px] lg:text-[11px] font-light tracking-wide"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                color: product.darkestColor,
                opacity: 0.85,
              }}
            >
              Purity: {product.purity}
            </p>
            
            <span 
              className="text-[6px] md:text-[8px]"
              style={{ 
                color: product.darkestColor,
                opacity: 0.45,
              }}
            >•</span>
            
            <p 
              className="text-[8px] md:text-[10px] lg:text-[11px] font-light tracking-wide"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                color: product.darkestColor,
                opacity: 0.85,
              }}
            >
              {product.metal}
            </p>
          </div>
        </motion.div>

        {/* Request Quote Button - всегда видна на мобильных, появляется при hover на desktop */}
        <motion.button
          className="relative px-4 md:px-8 py-2 md:py-3 overflow-hidden group mt-1.5 md:mt-2 w-full md:w-auto"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${product.darkestColor.replace('1)', '0.2)')}`,
            borderRadius: '6px',
          }}
          initial={{ opacity: 1 }}
          animate={{
            opacity: isMobile ? 1 : (isHovered ? 1 : 0),
            y: isMobile ? 0 : (isHovered ? 0 : 20),
          }}
          transition={{ 
            duration: 0.4,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          whileHover={{ 
            background: 'rgba(255, 255, 255, 0.15)',
            borderColor: product.darkestColor.replace('1)', '0.35)'),
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onRequestQuote(product)}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${product.darkestColor.replace('1)', '0.2)')} 50%, transparent 100%)`,
            }}
            initial={{ x: '-100%' }}
            whileHover={{
              x: '100%',
              transition: {
                duration: 0.8,
                ease: 'linear',
                repeat: Infinity,
                repeatDelay: 0.5,
              }
            }}
          />
          
          <span 
            className="relative text-[10px] md:text-sm tracking-widest uppercase font-medium"
            style={{ 
              fontFamily: "'Inter', sans-serif",
              color: product.darkestColor,
              opacity: 0.95,
            }}
          >
            Request Quote
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
});

export function ProductSectionWholesale() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<WholesaleProduct | null>(null);

  const handleRequestQuote = (product: WholesaleProduct) => {
    setSelectedProduct(product);
    setIsContactModalOpen(true);
  };

  return (
    <section id="wholesale" className="relative w-full bg-[#FAFAF8] pt-16 pb-16 lg:pt-24 lg:pb-24 overflow-hidden -mt-0">
      <div className="w-full">
        {/* Section Header */}
        <div className="mb-10 lg:mb-14 text-center px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[11px] tracking-[0.3em] uppercase text-[#B8A07E] mb-4 font-['Inter']"
          >
            Wholesale Division
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] tracking-[-0.02em] font-light text-[#1A1A1A]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            GOLD AND SILVER<br />
            WHOLESALE
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm text-[#1A1A1A]/60 mt-6 max-w-2xl mx-auto font-light font-['Inter']"
          >
            Premium bullion for serious investors. Request a quote for bulk orders.
          </motion.p>
        </div>

        {/* Products - 4 Cards in a row on desktop, 2x2 grid on mobile */}
        <div className="w-full px-4 md:px-12 lg:px-20">
          <div className="grid grid-cols-2 md:flex md:justify-between gap-3 md:gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onRequestQuote={handleRequestQuote} />
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setSelectedProduct(null);
        }}
        inquiryType="wholesale"
        defaultMessage={selectedProduct ? `I'm interested in wholesale pricing for ${selectedProduct.name} (${selectedProduct.weight}, ${selectedProduct.metal}, Purity: ${selectedProduct.purity}). Please provide a quote for bulk orders.` : ''}
      />
    </section>
  );
}