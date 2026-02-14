import React, { useState, useRef } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import { LazyImage } from '@/app/components/LazyImage';

// Updated with your specific product images
const products = [
  {
    id: 1,
    title: "The Eagle Of Trust 100 Gram 24 Karat Minted Gold Bar",
    description: "Swiss craftsmanship meeting 999.9 purity. A substantial investment piece featuring our signature Eagle design.",
    price: 15500,
    link: "#",
    image: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-100gram-Pack-min-300x300.webp",
    tiny: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-100gram-Pack-min-300x300.webp"
  },
  {
    id: 2,
    title: "The Eagle Of Trust 250 Gram 24 Karat Minted Gold Bar",
    description: "Serious wealth preservation in a 250g format. Minted perfection with high-security packaging.",
    price: 38750,
    link: "#",
    image: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-250g-F-min-300x300.webp",
    tiny: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-250g-F-min-300x300.webp"
  },
  {
    id: 3,
    title: "The Eagle Of Trust 500 Gram 24 Karat Cast Gold Bar",
    description: "Traditional cast finish for the classic investor. 500 grams of pure 24 karat gold.",
    price: 77500,
    link: "#",
    image: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-500g-F-min-1-300x300.webp",
    tiny: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-500g-F-min-1-300x300.webp"
  },
  {
    id: 4,
    title: "The Eagle Of Trust 1 Kilo 24 Karat Cast Gold Bar",
    description: "The ultimate store of value. 1 Kilogram of 999.9 pure gold in a classic cast bar format.",
    price: 155000,
    link: "#",
    image: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-1kilo-F-min-300x300.webp",
    tiny: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-1kilo-F-min-300x300.webp"
  },
  {
    id: 5,
    title: "The Eagle Of Trust 1 Ounce 24 Karat Minted Gold Bar",
    description: "The global standard for gold investment. 1 Ounce of precision-minted 999.9 purity.",
    price: 4820.97,
    link: "#",
    image: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-1oz-Pack-min-300x300.webp",
    tiny: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-1oz-Pack-min-300x300.webp"
  },
  {
    id: 6,
    title: "The Eagle Of Trust 10 Gram 24 Karat Minted Gold Bar",
    description: "Accessible luxury. 10 Grams of pure gold, perfect for gifting or starting a portfolio.",
    price: 1550,
    link: "#",
    image: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-10gram-Pack-min-300x300.webp",
    tiny: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-10gram-Pack-min-300x300.webp"
  },
  {
    id: 7,
    title: "The Eagle Of Trust 20 Gram 24 Karat Minted Gold Bar",
    description: "A perfect balance of value and portability. 20 Grams of 999.9 fine gold.",
    price: 3100,
    link: "#",
    image: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-20gram-Pack-min-300x300.webp",
    tiny: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-20gram-Pack-min-300x300.webp"
  },
  {
    id: 8,
    title: "The Eagle Of Trust 50 Gram 24 Karat Minted Gold Bar",
    description: "Substantial wealth in your palm. 50 Grams of certified, minted 999.9 gold.",
    price: 7750,
    link: "#",
    image: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-50gram-Pack-min-300x300.webp",
    tiny: "https://www.goldiamagold.com/wp-content/uploads/2025/11/Goldiama-Bars-50gram-Pack-min-300x300.webp"
  }
];

function ProductImage({ src, tinySrc, alt }: { src: string, tinySrc: string, alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full aspect-[3/4] bg-[#F8F8F8] overflow-hidden mb-6 rounded-[24px]">
       {/* Tiny Blur Image (Placeholder) */}
       <img 
         src={tinySrc} 
         className={`absolute inset-0 w-full h-full object-cover filter blur-xl scale-110 transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} 
         alt="" 
       />
       
         {/* Main Image - Centered, limited max size for sharpness (native is 300x300) */}
       <img 
         src={src}
         alt={alt}
         loading="lazy"
         onLoad={() => setIsLoaded(true)}
         className={`absolute inset-0 m-auto w-auto h-auto max-w-[220px] max-h-[220px] object-contain transition-all duration-700 ease-out transform group-hover:scale-105 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
       />
    </div>
  );
}

export function ProductGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { formatPrice } = useCurrency();
  
  // Ensuring target has non-static position (relative) to avoid Framer Motion errors.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -50]); // Header moves up slightly faster
  const gridY = useTransform(scrollYProgress, [0, 1], [100, 0]); // Grid comes from bottom (pulling effect)

  return (
    <section 
        ref={containerRef}
        className="bg-white pb-32 md:pb-48 pt-10 relative z-20 overflow-hidden"
        style={{ position: "relative" }}
    >
      {/* 
         Full width layout
      */}
      <div 
        className="w-full px-6 md:px-12 relative" 
      >
        
        {/* Section Header with Parallax */}
        <motion.div 
          style={{ y: headerY }}
          className="flex flex-col items-center text-center mb-24 md:mb-32 pt-24 border-t border-gray-100"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs md:text-sm font-bold tracking-[0.2em] text-gray-500 uppercase mb-4"
          >
            The Collection That
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-['Belleza'] text-[#D4AF37] mb-8 uppercase tracking-wide leading-tight drop-shadow-sm"
          >
            Defines Ownership.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto text-gray-600 font-['Belleza'] text-base md:text-lg leading-relaxed text-center opacity-80"
          >
            The Goldiama Gold Bar represents the ultimate store of value, meticulously crafted for the serious collector and strategic investor. As a tangible asset in an unpredictable market, our gold bullion offers a bedrock of financial security and portfolio diversification.
          </motion.p>
        </motion.div>

        {/* Grid with Dynamic Pulling (Parallax Reveal) */}
        <motion.div 
            style={{ y: gridY }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-20 gap-x-8"
        >
          {products.map((product, index) => (
            <motion.a 
              key={product.id} 
              href={product.link}
              className="group block"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
            >
              <ProductImage 
                src={product.image} 
                tinySrc={product.tiny} 
                alt={product.title} 
              />

              {/* Info */}
              <div className="flex justify-between items-start">
                  <div className="space-y-2 pr-4 flex-1">
                     <h3 className="text-gray-900 font-['Belleza'] text-xl leading-snug group-hover:text-[#D4AF37] transition-colors duration-300">
                       {product.title.replace("The Eagle Of Trust", "").trim()}
                     </h3>
                     <p className="text-xs text-gray-500 font-medium tracking-wide uppercase line-clamp-2 min-h-[2.5em]">
                       {product.description}
                     </p>
                     <p className="text-gray-900 font-['Belleza'] text-lg pt-1 lining-nums tabular-nums">
                        {formatPrice(product.price)}
                     </p>
                  </div>
                  
                  {/* Shopping Bag Icon */}
                  <div className="shrink-0 pt-1">
                      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[#D4AF37] group-hover:text-white group-hover:border-[#D4AF37] transition-all duration-300">
                          <ShoppingBag size={18} strokeWidth={1.5} />
                      </div>
                  </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Mobile View All Button */}
        <div className="mt-20 flex justify-center md:hidden">
            <a href="#" className="flex items-center gap-2 text-sm text-gray-900 hover:text-gray-600 transition-colors duration-300 font-['Belleza'] tracking-wider uppercase border border-gray-300 px-6 py-3">
                View All Products
                <ArrowRight size={16} />
            </a>
        </div>
      </div>
    </section>
  );
}