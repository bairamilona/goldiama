import React, { useState, useEffect } from "react";
import { Navbar } from "@/app/components/Navbar";
import { Hero } from "@/app/components/Hero";
import { CartProvider } from "@/app/contexts/CartContext";
import { CurrencyProvider } from "@/app/contexts/CurrencyContext";
import { ShoppingCart } from "@/app/components/ShoppingCart";
import { LazySection } from "@/app/components/LazySection";
import { initPerformanceMonitoring } from "@/lib/performance-monitor";
import logoImage from "figma:asset/6996fefb20a009345d2866832d3a8332840c6b74.png";
import "@/styles/fonts.css";
import "@/styles/theme.css";

// ✅ STATIC IMPORTS: Заменяем все lazy на обычные импорты
import TickerPanel from "@/app/components/TickerPanel";
import { Heritage } from "@/app/components/Heritage";
import { ProductSection } from "@/app/components/ProductSection";
import { WholesaleBanner } from "@/app/components/WholesaleBanner";
import Footer from "@/app/components/Footer";
import { ProductSectionWholesale } from "@/app/components/ProductSectionWholesale";
import { CompareBlock } from "@/app/components/CompareBlock";
import { ContactSection } from "@/app/components/ContactSection";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [isLoading, setIsLoading] = useState(true);

  // Suppress Three.js multiple instances warning globally
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args[0]?.toString() || '';
      if (message.includes('Multiple instances of Three.js') || 
          message.includes('scroll offset is calculated correctly')) {
        return;
      }
      originalWarn(...args);
    };
    return () => {
      console.warn = originalWarn;
    };
  }, []);

  // 📊 PERFORMANCE MONITORING: Initialize Core Web Vitals tracking
  useEffect(() => {
    initPerformanceMonitoring();
  }, []);

  useEffect(() => {
    // Preloader duration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <CartProvider>
      <CurrencyProvider>
        {/* Preloader UI - now inside providers */}
        {isLoading ? (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
            {/* Animated Logo */}
            <div className="relative">
              <img 
                src={logoImage}
                alt="GOLDIAMA"
                className="w-32 h-32 object-contain animate-pulse"
                style={{
                  filter: 'brightness(1.2) contrast(1.1)',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}
              />
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-white text-gray-900 antialiased" style={{ scrollBehavior: 'smooth' }}>
            {/* 📱 MOBILE: Scroll Snap Container - только на мобильных */}
            <div className="page-main-wrapper snap-y snap-proximity md:snap-none overflow-y-auto md:overflow-visible h-screen md:h-auto">
              
              {/* Header */}
              <header className="fixed top-0 left-0 w-full z-50"> {/* ✅ Увеличен z-index с 40 до 50 чтобы быть выше Hero (z-1) */}
                  <Navbar 
                      onNavigate={setCurrentPage} 
                      isVisible={true} 
                  />
              </header>
              
              {/* Ticker Panel - Fixed below navbar */}
              <LazySection animationDelay={0}>
                <TickerPanel />
              </LazySection>
                
              <main className="page-main min-h-screen bg-white font-['Inter'] text-gray-900 selection:bg-[#B8A07E] selection:text-white flex flex-col">
                    
                    {/* HERO SECTION - Fixed position с параллакс-эффектом */}
                    <Hero />
                    
                    {/* NEXT SECTIONS - Mobile-optimized spacing */}
                    <div 
                      className="relative z-20 w-full"
                      style={{ background: 'transparent' }}
                    >
                        {/* Heritage - Snap point */}
                        <section className="snap-start snap-always md:snap-align-none py-8 md:py-0 md:mb-12 lg:mb-16 xl:mb-20">
                          <LazySection animationDelay={200}>
                            <Heritage />
                          </LazySection>
                        </section>
                        
                        {/* ProductSection - Snap point, user-friendly */}
                        <section className="snap-start snap-always md:snap-align-none py-8 md:py-0 md:mb-12 lg:mb-16 xl:mb-20">
                          <LazySection animationDelay={400}>
                            <ProductSection />
                          </LazySection>
                        </section>
                        
                        {/* Wholesale Banner + Products - Snap point, оптимизированные отступы */}
                        <section className="snap-start snap-always md:snap-align-none">
                          <div className="relative w-full bg-[#FAFAF8] pb-12 md:pb-16 lg:pb-20"> {/* ✅ Убран py, оставлен только pb */}
                            <LazySection animationDelay={600}>
                              <WholesaleBanner />
                            </LazySection>
                            
                            <div className="mt-8 md:mt-12">
                              <LazySection animationDelay={800}>
                                <ProductSectionWholesale />
                              </LazySection>
                            </div>
                          </div>
                        </section>
                    </div>
              </main>
              
              {/* COMPARE BLOCK - Stories style для мобильных */}
              <section className="snap-start snap-always md:snap-align-none relative w-full">
                <LazySection animationDelay={1000}>
                  <CompareBlock />
                </LazySection>
              </section>
              
              {/* Contact & Footer - Разделены с логичными отступами */}
              <div className="relative z-[60]">
                  <section className="snap-start snap-always md:snap-align-none py-12 md:py-16 lg:py-20">
                    <LazySection animationDelay={1200}>
                      <ContactSection />
                    </LazySection>
                  </section>
                  
                  <section className="snap-start snap-always md:snap-align-none mt-8 md:mt-0">
                    <LazySection animationDelay={1400}>
                      <Footer />
                    </LazySection>
                  </section>
              </div>

              {/* Shopping Cart Sidebar */}
              <ShoppingCart />
            </div>
          </div>
        )}
      </CurrencyProvider>
    </CartProvider>
  );
}