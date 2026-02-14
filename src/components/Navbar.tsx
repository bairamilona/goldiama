import React, { useState, useEffect } from "react";
import { Menu, X, Search, User, TrendingUp, FileText, Shield, Globe, ArrowRight, Phone, LogIn, Heart, ShoppingBag, MapPin } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useCart } from "@/app/contexts/CartContext";
import { useCurrency, Currency } from "@/app/contexts/CurrencyContext";
import logoImage from "figma:asset/6996fefb20a009345d2866832d3a8332840c6b74.png";

interface NavbarProps {
  onNavigate?: (page: string) => void;
  isVisible?: boolean;
}

export function Navbar({ onNavigate, isVisible = true }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { currency, setCurrency } = useCurrency();
  
  const { scrollY } = useScroll();
  
  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Transparent at top, solid background on scroll - smooth easing (DESKTOP ONLY)
  const backgroundColor = useTransform(
    scrollY, 
    [0, 100, 150], 
    [
      isMobile ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0)",
      "rgba(255, 255, 255, 0.90)", 
      "rgba(255, 255, 255, 0.98)"
    ]
  );
  const shadow = useTransform(
    scrollY, 
    [0, 100, 150], 
    [
      isMobile ? "0px 2px 12px rgba(0,0,0,0.06)" : "0px 0px 0px rgba(0,0,0,0)",
      "0px 4px 20px rgba(0,0,0,0.03)", 
      "0px 8px 30px rgba(0,0,0,0.06)"
    ]
  );
  
  // Height reduction on scroll - MOBILE: фиксированная, DESKTOP: динамическая
  const headerHeight = useTransform(
    scrollY, 
    [0, 100, 150], 
    isMobile ? ["60px", "60px", "60px"] : ["80px", "68px", "64px"]
  );
  const logoHeight = useTransform(
    scrollY, 
    [0, 100, 150], 
    isMobile ? ["32px", "32px", "32px"] : ["40px", "34px", "32px"]
  );
  
  // Floating header effect - MOBILE: отключен, DESKTOP: включен
  const headerWidth = useTransform(
    scrollY, 
    [0, 50], 
    isMobile ? ["100%", "100%"] : ["100%", "96%"]
  );
  const headerMarginTop = useTransform(
    scrollY, 
    [0, 50], 
    isMobile ? [0, 0] : [0, 12]
  );
  const headerBorderRadius = useTransform(
    scrollY, 
    [0, 50], 
    isMobile ? [0, 0] : [0, 6]
  );

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const NAV_ITEMS = [
    { label: 'Market Data', id: 'market-data', icon: TrendingUp },
    { label: 'Products', id: 'products', icon: ShoppingBag },
    { label: 'Research & Reports', id: 'research', icon: FileText },
    { label: 'Storage & Vaults', id: 'storage', icon: Shield },
    { label: 'Institutional', id: 'institutional', icon: null },
    { label: 'Contact Advisory', id: 'contact', icon: Phone },
  ];

  const handleNav = (e: React.MouseEvent, item: typeof NAV_ITEMS[0]) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (onNavigate) {
       onNavigate('home');
       setTimeout(() => {
           const element = document.getElementById(item.id);
           if (element) {
               element.scrollIntoView({ behavior: 'smooth' });
           } else if (item.id === 'home') {
               window.scrollTo({ top: 0, behavior: 'smooth' });
           }
       }, 300);
    }
  };

  // Common icon props for thin, elegant look
  const iconProps = {
    strokeWidth: 1, // Ultra thin lines
    size: 22
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : -20 
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-40 w-full font-['Belleza'] pointer-events-none"
    >
      
      {/* Main Header Container */}
      <motion.div 
        style={{
            height: headerHeight,
            backgroundColor,
            boxShadow: shadow,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            width: headerWidth,
            marginTop: headerMarginTop,
            borderRadius: headerBorderRadius
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="mx-auto pointer-events-auto overflow-hidden px-4 md:px-8 flex items-center justify-between relative"
      >
           {/* LEFT: Logo */}
           <div className="flex items-center z-20">
             <a 
                href="#" 
                onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="flex items-center relative group"
            >
               <motion.img 
                  style={{ height: logoHeight }}
                  src={logoImage} 
                  alt="Goldiama" 
                  className="w-auto object-contain" 
               />
             </a>
           </div>

           {/* CENTER: Navigation */}
           <div className="hidden lg:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <a 
                href="#collection" 
                className={`relative text-base uppercase tracking-wide font-normal transition-all duration-700 ease-out cursor-pointer group active:scale-95 pb-1 ${
                  isScrolled ? 'text-black hover:text-[#D4AF37]' : 'text-white/90 hover:text-white'
                }`}
                style={{ fontFamily: "'Bellefair', serif" }}
              >
                Collection
                {/* Animated underline */}
                <span
                  className={`absolute left-0 bottom-0 h-[1px] w-0 group-hover:w-full transition-all duration-500 ease-out ${
                    isScrolled ? 'bg-[#D4AF37]' : 'bg-white'
                  }`}
                />
              </a>
              <a 
                href="#wholesale" 
                className={`relative text-base uppercase tracking-wide font-normal transition-all duration-700 ease-out cursor-pointer group active:scale-95 pb-1 ${
                  isScrolled ? 'text-black hover:text-[#D4AF37]' : 'text-white/90 hover:text-white'
                }`}
                style={{ fontFamily: "'Bellefair', serif" }}
              >
                Wholesale
                {/* Animated underline */}
                <span
                  className={`absolute left-0 bottom-0 h-[1px] w-0 group-hover:w-full transition-all duration-500 ease-out ${
                    isScrolled ? 'bg-[#D4AF37]' : 'bg-white'
                  }`}
                />
              </a>
              <a 
                href="#custom" 
                className={`relative text-base uppercase tracking-wide font-normal transition-all duration-700 ease-out cursor-pointer group active:scale-95 pb-1 ${
                  isScrolled ? 'text-black hover:text-[#D4AF37]' : 'text-white/90 hover:text-white'
                }`}
                style={{ fontFamily: "'Bellefair', serif" }}
              >
                Custom
                {/* Animated underline */}
                <span
                  className={`absolute left-0 bottom-0 h-[1px] w-0 group-hover:w-full transition-all duration-500 ease-out ${
                    isScrolled ? 'bg-[#D4AF37]' : 'bg-white'
                  }`}
                />
              </a>
              <a 
                href="#about" 
                className={`relative text-base uppercase tracking-wide font-normal transition-all duration-700 ease-out cursor-pointer group active:scale-95 pb-1 ${
                  isScrolled ? 'text-black hover:text-[#D4AF37]' : 'text-white/90 hover:text-white'
                }`}
                style={{ fontFamily: "'Bellefair', serif" }}
              >
                About
                {/* Animated underline */}
                <span
                  className={`absolute left-0 bottom-0 h-[1px] w-0 group-hover:w-full transition-all duration-500 ease-out ${
                    isScrolled ? 'bg-[#D4AF37]' : 'bg-white'
                  }`}
                />
              </a>
           </div>

           {/* RIGHT: Location, Currency, Cart, Phone */}
           <div className="flex items-center justify-end gap-4 md:gap-5 z-20">
              {/* Location */}
              <div className={`hidden lg:flex items-center gap-2 transition-colors duration-700 ease-out ${
                isScrolled ? 'text-gray-700' : 'text-white/80'
              }`}>
                  <MapPin strokeWidth={1} size={16} />
                  <span className="text-sm font-normal">Dubai-UAE</span>
              </div>

              {/* Currency Selector - Minimalist - ✅ ВИДИМ НА МОБИЛКЕ */}
              <div className={'flex items-center gap-1 transition-all duration-700 ease-out ' + (isMobile ? 'text-gray-900' : (isScrolled ? 'text-gray-900' : 'text-white/90'))}>
                <button
                  onClick={() => setCurrency('USD')}
                  className={'px-2 py-1 text-xs font-medium tracking-wider transition-all duration-300 ' + (currency === 'USD' ? (isMobile || isScrolled ? 'text-black' : 'text-white') : (isMobile || isScrolled ? 'text-gray-400' : 'text-white/40'))}
                >
                  USD
                </button>
                <span className={'text-xs ' + (isMobile || isScrolled ? 'text-gray-300' : 'text-white/30')}>/</span>
                <button
                  onClick={() => setCurrency('AED')}
                  className={'px-2 py-1 text-xs font-medium tracking-wider transition-all duration-300 ' + (currency === 'AED' ? (isMobile || isScrolled ? 'text-black' : 'text-white') : (isMobile || isScrolled ? 'text-gray-400' : 'text-white/40'))}
                >
                  AED
                </button>
              </div>

              {/* Shopping Cart with Counter */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className={`relative transition-colors duration-700 ease-out ${
                   // На мобильных всегда темные, на десктопе - зависит от скролла
                   isMobile 
                     ? 'text-gray-900 hover:text-[#D4AF37]' 
                     : (isScrolled ? 'text-gray-900 hover:text-[#D4AF37]' : 'text-white/90 hover:text-white')
                 }`}
              >
                  <ShoppingBag strokeWidth={1} size={22} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center font-['Inter']">
                      {totalItems}
                    </span>
                  )}
              </button>

              {/* Phone Icon - ✅ ВИДИМ НА МОБИЛКЕ (только иконка) */}
              <button 
                className={`flex items-center gap-2 transition-colors duration-700 ease-out ${
                  isMobile 
                    ? 'text-gray-900 hover:text-[#D4AF37]' 
                    : (isScrolled ? 'text-gray-900 hover:text-[#D4AF37]' : 'text-white/90 hover:text-white')
                }`}
              >
                <Phone strokeWidth={1} size={20} />
                {/* Номер телефона только на desktop */}
                <span className="hidden xl:inline text-sm font-['Inter'] font-medium tracking-wide lining-nums">+971 4 358 9000</span>
              </button>

              {/* Menu Trigger - Mobile */}
              <button 
                className={`lg:hidden flex items-center gap-2 transition-colors duration-700 ease-out ml-2 pl-3 border-l ${
                   // На мобильных всегда темные иконки, так как фон белый
                   isMobile
                     ? 'text-gray-900 hover:text-[#D4AF37] border-black/5'
                     : (isScrolled 
                         ? 'text-gray-900 hover:text-[#D4AF37] border-black/5' 
                         : 'text-white/90 hover:text-white border-white/10')
                 }`}
                onClick={() => setIsOpen(true)}
              >
                <Menu strokeWidth={0.75} size={28} />
              </button>
           </div>
      </motion.div>

      {/* Side Drawer / Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] pointer-events-auto"
            />
            
            {/* Sidebar - Coming from RIGHT */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-white z-[70] shadow-2xl pointer-events-auto flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="h-[80px] flex items-center justify-between px-8 border-b border-gray-100">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">Navigation</span>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 -mr-2 text-gray-900 hover:text-[var(--gold)] transition-colors flex items-center gap-2"
                  >
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">Close</span>
                    <X strokeWidth={0.75} size={28} />
                  </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto py-12 px-8 md:px-12 flex flex-col gap-10">
                  
                  {/* Main Links - Thinner Font */}
                  <nav className="flex flex-col gap-6">
                      {NAV_ITEMS.map((item, index) => (
                        <motion.a 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          key={item.label}
                          href={`#${item.id}`}
                          onClick={(e) => handleNav(e, item)}
                          className="group flex items-center justify-between text-2xl md:text-3xl font-light font-['Belleza'] text-gray-900 hover:text-[var(--gold)] transition-colors"
                        >
                          <span className="font-light tracking-wide">{item.label}</span>
                          <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-[#D4AF37]" strokeWidth={1} size={24} />
                        </motion.a>
                      ))}
                  </nav>

                  {/* Institutional CTA Footer */}
                  <div className="mt-auto pt-10 border-t border-gray-100 flex flex-col gap-4">
                      <a 
                        href="#quote" 
                        onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                        }}
                        className="w-full bg-[#B8A07E] text-white py-4 rounded-lg flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-wider hover:bg-[#A08F6D] transition-colors font-['Inter']"
                      >
                        <TrendingUp size={18} strokeWidth={1.5} />
                        Request Live Quote
                      </a>
                      
                      <a 
                        href="#portal" 
                        onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                        }}
                        className="w-full border border-gray-200 text-gray-900 py-4 rounded-lg flex items-center justify-center gap-3 text-sm font-medium uppercase tracking-wider hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors font-['Inter']"
                      >
                        <LogIn size={18} strokeWidth={1.5} />
                        Client Portal Login
                      </a>
                  </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}