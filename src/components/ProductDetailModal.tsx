import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, Minus, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import { LuxuryBoxModal } from './LuxuryBoxModal';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: any) => void; // ✅ NEW: callback для открытия LuxuryBoxModal
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    metal: string;
    weight: string;
    purity: string;
    price: number;
    image: string;
    inStock: boolean;
    // Extended details
    denomination?: string;
    design?: string;
    appearance?: string;
    designTheme?: string;
    certificate?: string;
    securityFeatures?: string;
    // Multiple images support
    images?: string[];
  } | null;
}

export function ProductDetailModal({ isOpen, onClose, onAddToCart, product }: ProductDetailModalProps) {
  const { addItem, items, updateQuantity, removeItem } = useCart();
  const { formatPrice } = useCurrency();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLuxuryBox, setShowLuxuryBox] = useState(false); // NEW: State для показа конструктора

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Return null if no product (after all hooks are called)
  if (!product) return null;

  // Get current cart quantity
  const cartItem = items.find(item => item.id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  // Image navigation helpers
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    // ✅ Всегда показываем luxury box конструктор
    setShowLuxuryBox(true);
  };

  // Handle luxury box confirmation
  const handleBoxConfirm = (material: any, metalFinish: 'gold' | 'silver') => {
    // Add the main product
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      weight: product.weight,
      metal: product.metal,
      purity: product.purity,
      image: product.image,
    });
    
    // If user selected a box material, add it as a free item
    if (material) {
      // Determine if product is a coin (round box) or bar (rectangular box)
      const isCoin = product.category === 'GOLDEN COINS' || product.category === 'SILVER COINS';
      
      // Get the correct image based on product type and metal finish
      let boxImage: string;
      if (isCoin) {
        // Use round box image for coins
        boxImage = material.imageRound;
      } else {
        // Use rectangular box image for bars (gold or silver hardware)
        boxImage = metalFinish === 'gold' ? material.imageGold : material.imageSilver;
      }
      
      addItem({
        id: `box-${product.id}`,
        name: `Luxury ${material.name} Box`,
        price: 0, // FREE
        weight: 'N/A',
        metal: isCoin ? 'Gold hardware' : `${metalFinish === 'gold' ? 'Gold' : 'Silver'} hardware`,
        purity: material.description,
        image: boxImage,
        isBox: true,
      });
    }
    
    // ✅ Закрываем только LuxuryBoxModal, ProductDetailModal остается открытым
    setShowLuxuryBox(false);
    // ❌ НЕ ЗАКРЫВАЕМ ProductDetailModal - пользователь сам закроет кнопкой "Close"
    // onClose();
  };

  const handleIncrement = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      weight: product.weight,
      metal: product.metal,
      purity: product.purity,
      image: product.image,
    });
  };

  const handleDecrement = () => {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(product.id, cartItem.quantity - 1);
      } else {
        removeItem(product.id);
      }
    }
  };

  // Dynamic gradient based on metal type
  const getBackgroundGradient = () => {
    if (!product) return 'radial-gradient(ellipse at 55% 45%, #f5f0eb 0%, #ebe4dc 35%, #ddd4c8 100%)';
    
    const metalLower = product.metal.toLowerCase();
    
    if (metalLower.includes('gold')) {
      return 'radial-gradient(ellipse at 55% 45%, #faf6f0 0%, #f5e6d3 25%, #ead4b8 55%, #d4b896 100%)';
    } else if (metalLower.includes('silver')) {
      return 'radial-gradient(ellipse at 55% 45%, #f5f5f7 0%, #e8eaed 25%, #d5d8dc 55%, #c4c8cc 100%)';
    } else if (metalLower.includes('platinum')) {
      return 'radial-gradient(ellipse at 55% 45%, #f8f9fa 0%, #e9ecef 25%, #dce0e4 55%, #cbd1d8 100%)';
    }
    
    return 'radial-gradient(ellipse at 55% 45%, #f5f0eb 0%, #ebe4dc 35%, #ddd4c8 100%)';
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* DESKTOP VERSION - hidden on mobile */}
          <motion.div
            className="hidden lg:block fixed inset-0 z-[999999] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Premium Background Gradient - Gold or Silver */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: product.metal.toLowerCase().includes('gold')
                  // ✅ СВЕТЛЫЙ ТЕПЛЫЙ ЗОЛОТОЙ - БЕЗ ЗАТЕМНЕНИЯ
                  ? 'radial-gradient(circle at 70% 50%, #faf6f0 0%, #f5ead8 25%, #f0dfc6 50%, #ead4b4 75%, #e5c9a3 100%)'
                  : product.metal.toLowerCase().includes('silver')
                    ? 'radial-gradient(circle at 70% 50%, #f5f5f5 0%, #e5e5e5 35%, #b8b8b8 65%, #7a7a7a 100%)'
                    : 'radial-gradient(circle at 70% 50%, #faf6f0 0%, #f5ead8 25%, #f0dfc6 50%, #ead4b4 75%, #e5c9a3 100%)',
                backgroundSize: '150% 150%',
                animation: 'goldCardMove 14s ease-in-out infinite alternate'
              }}
            >
              {/* ❌ УБРАНО: Мягкая виньетка - было слишком темно для золота */}
              {/* <div 
                className="absolute pointer-events-none"
                style={{
                  inset: '-20%',
                  background: 'radial-gradient(circle at 20% 50%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0) 70%)',
                  zIndex: 1
                }}
              /> */}
              
              {/* Световой перелив - ТОЛЬКО ДЛЯ ЗОЛОТА (теплый) */}
              <div 
                className="absolute pointer-events-none"
                style={{
                  inset: '-25%',
                  background: product.metal.toLowerCase().includes('gold')
                    ? 'radial-gradient(circle at 50% 50%, rgba(255,247,230,0.25), rgba(255,243,214,0.12) 30%, transparent 60%)'
                    : 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12), rgba(255,255,255,0.05) 30%, transparent 60%)',
                  mixBlendMode: 'soft-light',
                  animation: 'cardSweep 18s linear infinite',
                  zIndex: 1
                }}
              />
            </div>

            {/* 🎬 CINEMATIC FILM GRAIN OVERLAY - 35mm Film Simulation */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 999998 }}>
              {/* SVG Film Grain Filter - ТЕПЛЫЙ ДЛЯ ЗОЛОТА */}
              <svg className="absolute w-0 h-0">
                <defs>
                  <filter id="filmGrainFilter">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.8"
                      numOctaves="4"
                      seed="2"
                      stitchTiles="stitch"
                    >
                      <animate
                        attributeName="seed"
                        values="1;2;3;4;5;6;7;8;9;10"
                        dur="0.8s"
                        repeatCount="indefinite"
                      />
                    </feTurbulence>
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                      <feFuncA type="discrete" tableValues="0.5 0.5" />
                    </feComponentTransfer>
                  </filter>

                  {/* Chromatic Aberration Filter */}
                  <filter id="chromaticAberration">
                    <feOffset in="SourceGraphic" dx="0.3" dy="0" result="red" />
                    <feOffset in="SourceGraphic" dx="-0.3" dy="0" result="blue" />
                    <feBlend in="red" in2="SourceGraphic" mode="screen" result="redBlend" />
                    <feBlend in="blue" in2="redBlend" mode="screen" />
                  </filter>
                </defs>
              </svg>

              {/* Film Grain Layer with Vertical Jitter - ТЕПЛЫЙ ДЛЯ ЗОЛОТА */}
              <div
                className="absolute inset-0"
                style={{
                  filter: 'url(#filmGrainFilter)',
                  opacity: 0.03,
                  mixBlendMode: 'overlay',
                  animation: 'filmJitter 0.15s steps(2) infinite, filmGrainMove 1.2s steps(8) infinite',
                  // ✅ Теплый оттенок для золота
                  backgroundColor: product.metal.toLowerCase().includes('gold') 
                    ? 'rgba(255, 243, 214, 0.15)' 
                    : 'transparent'
                }}
              />
              
              {/* ❌ УБРАНО: Subtle Vignette - было слишком темно */}
              {/* <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.15) 100%)',
                  opacity: 0.4,
                  mixBlendMode: 'multiply'
                }}
              /> */}

              {/* Soft Blur Layer - Slight Diffusion */}
              <div
                className="absolute inset-0"
                style={{
                  backdropFilter: 'blur(0.3px)',
                  opacity: 0.15, // Уменьшена с 0.3
                  pointerEvents: 'none'
                }}
              />

              {/* Chromatic Aberration Layer */}
              <div
                className="absolute inset-0"
                style={{
                  filter: 'url(#chromaticAberration)',
                  opacity: 0.02, // Уменьшена с 0.04
                  mixBlendMode: 'screen',
                  animation: 'chromaticShift 4s ease-in-out infinite alternate'
                }}
              />

              {/* Analog Scanlines - Subtle Horizontal Lines */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.01) 2px, rgba(0,0,0,0.01) 4px)', // Уменьшена прозрачность
                  opacity: 0.08, // Уменьшена с 0.15
                  mixBlendMode: 'overlay',
                  animation: 'scanlineMove 8s linear infinite'
                }}
              />
            </div>

            {/* CLOSE Button */}
            <motion.button
              className="fixed top-10 right-10 px-6 py-3 bg-[#1A1A1A] text-white text-xs tracking-[0.12em] uppercase font-medium rounded-xl hover:bg-[#2A2A2A] transition-all font-['Inter'] pointer-events-auto z-10"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Close
            </motion.button>

            {/* Desktop Layout: Left Panel + Right Image */}
            <div className="fixed inset-0 flex items-center justify-between px-12 py-12">
              
              {/* Left Panel - Info Card (40%) */}
              <motion.div
                className="w-[34%] max-w-[540px] bg-[#fafaf9] rounded-[30px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-y-auto pointer-events-auto"
                style={{
                  maxHeight: 'calc(100vh - 96px)',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.26, ease: 'easeOut' }}
              >
                <div className="p-14">
                  {/* Category */}
                  <p className="text-[10px] tracking-[0.24em] uppercase text-[#B8A07E] mb-4 font-['Inter'] font-medium">
                    {product.category}
                  </p>

                  {/* Title */}
                  <h2
                    className="text-[2.5rem] leading-[1.1] tracking-[-0.015em] font-light text-[#1A1A1A] mb-8"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {product.name}
                  </h2>

                  {/* Price */}
                  <p className="text-[2rem] text-[#1A1A1A] font-bold tracking-tight mb-6 lining-nums" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {formatPrice(product.price)}
                  </p>

                  {/* Add to Cart / Quantity Control (like catalog) */}
                  <div className="mb-10">
                    {cartQuantity === 0 ? (
                      <button
                        onClick={handleAddToCart}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-xs font-['Inter'] font-medium uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer bg-black text-white border-black hover:bg-gray-800"
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                      </button>
                    ) : (
                      <div className="w-full inline-flex items-center justify-center gap-2 px-3 py-3 rounded-full bg-black text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                        <button
                          onClick={handleDecrement}
                          className="hover:bg-white/20 rounded-full p-1 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <span className="text-sm font-bold font-['Inter'] min-w-[32px] text-center">
                          {cartQuantity}
                        </span>
                        
                        <button
                          onClick={handleIncrement}
                          className="hover:bg-white/20 rounded-full p-1 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        <div className="w-px h-4 bg-white/30 mx-1" />
                        
                        <button
                          onClick={() => removeItem(product.id)}
                          className="hover:bg-red-500/20 rounded-full p-1 transition-colors cursor-pointer"
                          aria-label="Remove from cart"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-[1px] bg-[#1A1A1A]/10 mb-8" />

                  {/* PRODUCT INFO */}
                  <div className="mb-8">
                    <h3 className="text-[10px] tracking-[0.24em] uppercase text-[#1A1A1A]/50 mb-4 font-['Inter'] font-medium">
                      Product
                    </h3>
                    <p className="text-[15px] leading-[1.7] text-[#1A1A1A]/80 font-light font-['Inter']">
                      {product.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-[1px] bg-[#1A1A1A]/10 mb-8" />

                  {/* INFO Section */}
                  <div className="mb-8">
                    <h3 className="text-[10px] tracking-[0.24em] uppercase text-[#1A1A1A]/50 mb-4 font-['Inter'] font-medium">
                      Info
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm text-[#1A1A1A]/50 font-['Inter']">Metal</span>
                        <span className="text-sm text-[#1A1A1A] font-light font-['Inter']">{product.metal}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm text-[#1A1A1A]/50 font-['Inter']">Weight</span>
                        <span className="text-sm text-[#1A1A1A] font-light font-['Inter']">{product.weight}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm text-[#1A1A1A]/50 font-['Inter']">Purity</span>
                        <span className="text-sm text-[#1A1A1A] font-light font-['Inter']">{product.purity}</span>
                      </div>
                      {product.denomination && (
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-[#1A1A1A]/50 font-['Inter']">Denomination</span>
                          <span className="text-sm text-[#1A1A1A] font-light font-['Inter']">{product.denomination}</span>
                        </div>
                      )}
                      {product.appearance && (
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-[#1A1A1A]/50 font-['Inter']">Appearance</span>
                          <span className="text-sm text-[#1A1A1A] font-light font-['Inter']">{product.appearance}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Certificate */}
                  {product.certificate && (
                    <>
                      <div className="h-[1px] bg-[#1A1A1A]/10 mb-8" />
                      <div className="mb-8">
                        <h3 className="text-[10px] tracking-[0.24em] uppercase text-[#1A1A1A]/50 mb-4 font-['Inter'] font-medium">
                          Certificate
                        </h3>
                        <p className="text-[15px] leading-[1.7] text-[#1A1A1A]/80 font-light font-['Inter']">
                          {product.certificate}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Security Features */}
                  {product.securityFeatures && (
                    <>
                      <div className="h-[1px] bg-[#1A1A1A]/10 mb-8" />
                      <div>
                        <h3 className="text-[10px] tracking-[0.24em] uppercase text-[#1A1A1A]/50 mb-4 font-['Inter'] font-medium">
                          Security Features
                        </h3>
                        <p className="text-[15px] leading-[1.7] text-[#1A1A1A]/80 font-light font-['Inter']">
                          {product.securityFeatures}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Right Area - Product Image (60%) - Centered in remaining space */}
              <motion.div
                className="flex-1 flex flex-col items-center justify-center pl-12 relative"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.08 }}
              >
                {/* Image Container */}
                <div className="relative pointer-events-auto group">
                  <motion.img
                    key={currentImageIndex}
                    src={currentImage}
                    alt={product.name}
                    className={`max-h-[70vh] max-w-full w-auto ${
                      product.category === 'GOLDEN COINS' || product.category === 'SILVER COINS'
                        ? 'object-cover' // Монеты заполняют контейнер полностью
                        : 'object-contain' // Слитки сохраняют пропорции
                    }`}
                    style={{
                      filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.08))',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Navigation Arrows - Show on hover */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 backdrop-blur-md text-[#1A1A1A] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/10 pointer-events-auto"
                        style={{ border: '0.5px solid rgba(26, 26, 26, 0.15)' }}
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
                      </button>
                      
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 backdrop-blur-md text-[#1A1A1A] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/10 pointer-events-auto"
                        style={{ border: '0.5px solid rgba(26, 26, 26, 0.15)' }}
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
                      </button>
                    </>
                  )}
                </div>

                {/* Dot Indicators */}
                {hasMultipleImages && (
                  <div className="flex gap-2 mt-8 pointer-events-auto">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`transition-all duration-300 rounded-full ${
                          index === currentImageIndex
                            ? 'w-8 h-2 bg-[#1A1A1A]'
                            : 'w-2 h-2 bg-[#1A1A1A]/20 hover:bg-[#1A1A1A]/40'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* MOBILE VERSION - bottom sheet style */}
          <motion.div
            className="lg:hidden fixed inset-0 z-[999999] flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Bottom Sheet */}
            <motion.div
              className="relative w-full bg-white rounded-t-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.12)] overflow-hidden pointer-events-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Content Container - Scrollable */}
              <div className="max-h-[85vh] overflow-y-auto">
                
                {/* Product Image Section */}
                <div className="w-full bg-[#FAFAF8] px-6 py-8 relative">
                  <div className="flex items-center justify-center relative">
                    <motion.img
                      key={currentImageIndex}
                      src={currentImage}
                      alt={product.name}
                      className={`max-h-[40vh] w-auto ${
                        product.category === 'GOLDEN COINS' || product.category === 'SILVER COINS'
                          ? 'object-cover' // Монеты заполняют контейнер полностью
                          : 'object-contain' // Слитки сохраняют пропорции
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Navigation Arrows */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 backdrop-blur-md text-[#1A1A1A] rounded-full flex items-center justify-center active:scale-95 transition-transform hover:bg-white/10"
                          style={{ border: '0.5px solid rgba(26, 26, 26, 0.15)' }}
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                        
                        <button
                          onClick={handleNextImage}
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 backdrop-blur-md text-[#1A1A1A] rounded-full flex items-center justify-center active:scale-95 transition-transform hover:bg-white/10"
                          style={{ border: '0.5px solid rgba(26, 26, 26, 0.15)' }}
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Dot Indicators */}
                  {hasMultipleImages && (
                    <div className="flex gap-1.5 mt-4 justify-center">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`transition-all duration-300 rounded-full ${
                            index === currentImageIndex
                              ? 'w-6 h-1.5 bg-[#1A1A1A]'
                              : 'w-1.5 h-1.5 bg-[#1A1A1A]/20 active:bg-[#1A1A1A]/40'
                          }`}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="px-6 py-6">
                  
                  {/* Category */}
                  <p className="text-[9px] tracking-[0.24em] uppercase text-[#B8A07E] mb-2 font-['Inter'] font-medium">
                    {product.category}
                  </p>

                  {/* Title */}
                  <h2
                    className="text-[1.75rem] leading-[1.15] tracking-[-0.015em] font-light text-[#1A1A1A] mb-4"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {product.name}
                  </h2>

                  {/* Description */}
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-4 font-['Inter']">
                    {product.description}
                  </p>

                  {/* Specs */}
                  <div className="flex items-center gap-3 text-[10px] text-gray-600 mb-6 font-['Inter']">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 uppercase tracking-wider">Purity</span>
                      <span className="font-semibold text-gray-900">{product.purity}</span>
                    </div>
                    <div className="w-px h-3 bg-gray-300" />
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 uppercase tracking-wider">Weight</span>
                      <span className="font-semibold text-gray-900">{product.weight}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <p className="text-[2rem] text-[#1A1A1A] font-light tracking-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {formatPrice(product.price)}
                  </p>

                  {/* Add to Cart Button (catalog style) */}
                  <div className="mb-6">
                    {cartQuantity === 0 ? (
                      <button
                        onClick={handleAddToCart}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-['Inter'] font-medium uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer bg-black text-white border-black hover:bg-gray-800"
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                      </button>
                    ) : (
                      <div className="w-full inline-flex items-center justify-center gap-2 px-3 py-3 rounded-full bg-black text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                        <button
                          onClick={handleDecrement}
                          className="hover:bg-white/20 rounded-full p-1 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        
                        <span className="text-sm font-bold font-['Inter'] min-w-[32px] text-center">
                          {cartQuantity}
                        </span>
                        
                        <button
                          onClick={handleIncrement}
                          className="hover:bg-white/20 rounded-full p-1 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>

                        <div className="w-px h-4 bg-white/30 mx-1" />
                        
                        <button
                          onClick={() => removeItem(product.id)}
                          className="hover:bg-red-500/20 rounded-full p-1 transition-colors cursor-pointer"
                          aria-label="Remove from cart"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  {(product.certificate || product.securityFeatures) && (
                    <div className="border-t border-gray-200 pt-6 space-y-4">
                      {product.certificate && (
                        <div>
                          <h3 className="text-[9px] tracking-[0.24em] uppercase text-[#1A1A1A]/50 mb-2 font-['Inter'] font-medium">
                            Certificate
                          </h3>
                          <p className="text-[13px] leading-[1.6] text-[#1A1A1A]/80 font-light font-['Inter']">
                            {product.certificate}
                          </p>
                        </div>
                      )}
                      {product.securityFeatures && (
                        <div>
                          <h3 className="text-[9px] tracking-[0.24em] uppercase text-[#1A1A1A]/50 mb-2 font-['Inter'] font-medium">
                            Security Features
                          </h3>
                          <p className="text-[13px] leading-[1.6] text-[#1A1A1A]/80 font-light font-['Inter']">
                            {product.securityFeatures}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Safe bottom spacing for mobile gestures */}
                  <div className="h-8" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {createPortal(modalContent, document.body)}
      {/* Luxury Box Modal - shown on top of product detail */}
      <LuxuryBoxModal
        isOpen={showLuxuryBox}
        onClose={() => setShowLuxuryBox(false)}
        onConfirm={handleBoxConfirm}
        productName={product.name}
        productMetal={product.metal}
        productCategory={product.category}
      />
    </>
  );
}