import { useState, useEffect, memo, useMemo } from 'react';
import { ArrowRightLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import goldSphere from "figma:asset/7cc915087ef6f743d1b11f994726b858699cfcd4.png";
import silverSphere from "figma:asset/358970d9c1e8c7e75a78713c8e1b2103b19698d3.png";

// Market Data Utilities
const generateHistory = (startPrice: number, volatility: number = 0.5) => {
  const data = [];
  let currentPrice = startPrice;
  for (let i = 0; i < 20; i++) {
    const change = (Math.random() - 0.5) * volatility;
    currentPrice += change;
    data.push({ name: i, value: currentPrice });
  }
  return data;
};

const INITIAL_PRICES = {
    gold: 1950.20,
    silver: 24.50,
    platinum: 920.75,
    palladium: 1240.00
};

const INITIAL_DATA = {
    gold: generateHistory(INITIAL_PRICES.gold, 2.0),
    silver: generateHistory(INITIAL_PRICES.silver, 0.3),
    platinum: generateHistory(INITIAL_PRICES.platinum, 1.5),
    palladium: generateHistory(INITIAL_PRICES.palladium, 2.5)
};

// React.memo: Glass Ticker Card Component - предотвращает ререндер при неизменных props
const GlassTickerCard = memo(({ title, price, change, isPositive, imageBg, history, inverted, compact, hideInset }: { 
    title: string, 
    price: string, 
    change: string, 
    isPositive: boolean,
    imageBg?: string,
    history?: Array<{ name: number; value: number }>,
    inverted?: boolean,
    compact?: boolean,
    hideInset?: boolean
}) => {
  // useMemo: Cache sparkline path generation
  const sparklinePath = useMemo(() => {
    if (!history || history.length === 0) return '';
    
    const width = 100;
    const height = 30;
    const padding = 2;
    
    const values = history.map(h => h.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    const points = history.map((point, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - ((point.value - min) / range) * (height - padding * 2) - padding;
      return { x, y };
    });
    
    // Create ultra smooth curve using quadratic bezier
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x},${points[0].y}`;
    
    // Use quadratic bezier for smoothness
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      // Control point is midpoint
      const cpx = (current.x + next.x) / 2;
      const cpy = (current.y + next.y) / 2;
      
      path += ` Q ${current.x},${current.y} ${cpx},${cpy}`;
    }
    
    // Connect to last point
    const last = points[points.length - 1];
    const secondLast = points[points.length - 2];
    const cpx = (secondLast.x + last.x) / 2;
    const cpy = (secondLast.y + last.y) / 2;
    path += ` Q ${cpx},${cpy} ${last.x},${last.y}`;
    
    return path;
  }, [history]);

  return (
    <div 
      className={`relative rounded-[6px] transition-all duration-700 group flex items-center ${compact ? 'px-4 py-2 h-8 w-fit' : 'px-8 h-16 flex-1'}`}
      style={{ 
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px) saturate(140%)',
        WebkitBackdropFilter: 'blur(20px) saturate(140%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        willChange: 'backdrop-filter, opacity',
        transitionProperty: 'opacity, transform, backdrop-filter',
        transitionDuration: '700ms',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Sparkline Graph - Background layer */}
      {history && history.length > 0 && !compact && (
        <svg 
          width="100%" 
          height="100%" 
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{ opacity: inverted ? 0.15 : 0.2 }}
          preserveAspectRatio="none"
          viewBox="0 0 100 30"
        >
          <path
            d={sparklinePath}
            fill="none"
            stroke={isPositive 
              ? (inverted ? 'rgb(5, 150, 105)' : 'rgb(167, 243, 208)')
              : (inverted ? 'rgb(225, 29, 72)' : 'rgb(254, 205, 211)')
            }
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      
      {/* Chromatic Aberration - Red channel */}
      <div 
        className="absolute inset-0 rounded-[6px] pointer-events-none opacity-40"
        style={{
          background: 'linear-gradient(90deg, rgba(255, 0, 0, 0.03) 0%, transparent 10%, transparent 90%, rgba(255, 0, 0, 0.03) 100%)',
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Chromatic Aberration - Cyan channel */}
      <div 
        className="absolute inset-0 rounded-[6px] pointer-events-none opacity-40"
        style={{
          background: 'linear-gradient(90deg, rgba(0, 255, 255, 0.03) 0%, transparent 10%, transparent 90%, rgba(0, 255, 255, 0.03) 100%)',
          mixBlendMode: 'screen',
          transform: 'translateX(1px)',
        }}
      />
      
      {/* Edge distortion highlight */}
      <div 
        className="absolute inset-0 rounded-[6px] pointer-events-none opacity-60"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 20%, transparent 80%, rgba(255, 255, 255, 0.04) 100%)',
        }}
      />
      
      <div className={`relative z-10 flex items-center ${compact ? 'gap-2' : 'gap-4 justify-between w-full'}`}>
        {imageBg && (
          <div 
            className={`rounded-full flex items-center justify-center overflow-hidden transition-all duration-700 ${compact ? 'w-5 h-5 p-0.5' : 'w-10 h-10 p-1'}`}
            style={{
              background: hideInset 
                ? (title === 'Gold' 
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(184, 160, 126, 0.25) 100%)'
                    : 'rgba(0, 0, 0, 0.06)')
                : (inverted ? 'rgba(10, 14, 26, 0.05)' : 'rgba(255, 255, 255, 0.05)'),
              boxShadow: hideInset 
                ? (title === 'Gold' 
                    ? '0 0 0 1px rgba(212, 175, 55, 0.2), 0 2px 8px rgba(212, 175, 55, 0.15)'
                    : '0 0 0 1px rgba(0, 0, 0, 0.08)')
                : (inverted 
                    ? 'inset 0 1px 3px rgba(10, 14, 26, 0.2), inset 0 1px 1px rgba(10, 14, 26, 0.1)' 
                    : 'inset 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 -1px 2px rgba(255, 255, 255, 0.1)'),
            }}
          >
            <img src={imageBg} alt={title} className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500" />
          </div>
        )}
        <div className={`flex items-center ${compact ? 'gap-2' : 'gap-6 flex-1'}`}>
          <span 
            className={`font-medium uppercase tracking-widest font-['Inter'] transition-colors duration-700 ${compact ? 'text-[8px]' : 'text-xs'}`}
            style={{ color: inverted ? 'rgba(10, 14, 26, 0.5)' : 'rgba(255, 255, 255, 0.5)' }}
          >
            {title}
          </span>
          <span 
            className={`font-bold lining-nums tabular-nums font-['Inter'] transition-colors duration-700 ${compact ? 'text-sm' : 'text-xl'}`}
            style={{ color: inverted ? '#0A0E1A' : '#FFFFFF' }}
          >
            {price}
          </span>
          <div 
            className={`px-1.5 py-0.5 rounded font-medium font-['Inter'] transition-all duration-700 ${compact ? 'text-[9px]' : 'text-xs px-3 py-1'}`}
            style={{
              background: isPositive 
                ? (inverted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.15)')
                : (inverted ? 'rgba(244, 63, 94, 0.1)' : 'rgba(244, 63, 94, 0.15)'),
              color: isPositive
                ? (inverted ? 'rgb(5, 150, 105)' : 'rgb(167, 243, 208)')
                : (inverted ? 'rgb(225, 29, 72)' : 'rgb(254, 205, 211)'),
              border: isPositive
                ? (inverted ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(16, 185, 129, 0.2)')
                : (inverted ? '1px solid rgba(244, 63, 94, 0.15)' : '1px solid rgba(244, 63, 94, 0.2)')
            }}
          >
            {change}
          </div>
        </div>
      </div>
    </div>
  );
});

// Display name for React DevTools
GlassTickerCard.displayName = 'GlassTickerCard';

// Glass Converter Component
function GlassConverter({ livePrices, inverted }: { livePrices?: any, inverted?: boolean }) {
    const [amount, setAmount] = useState<number>(10);
    const [metal, setMetal] = useState<"gold" | "silver" | "platinum" | "palladium">("gold");
    const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP" | "AED" | "JPY">("USD");

    const METALS = {
        gold: { name: "Gold", priceOz: livePrices?.gold?.currentPrice || 1950.20 },
        silver: { name: "Silver", priceOz: livePrices?.silver?.currentPrice || 24.50 },
        platinum: { name: "Platinum", priceOz: livePrices?.platinum?.currentPrice || 920.75 },
        palladium: { name: "Palladium", priceOz: livePrices?.palladium?.currentPrice || 1240.00 }
    };

    const CURRENCIES = {
        USD: { symbol: "$", rate: 1.0 },
        EUR: { symbol: "€", rate: 0.92 },
        GBP: { symbol: "£", rate: 0.79 },
        AED: { symbol: "AED", rate: 3.67 },
        JPY: { symbol: "¥", rate: 148.0 }
    };
    
    const GRAMS_PER_OUNCE = 31.1035;
    const metalPriceInUSDPerOz = METALS[metal].priceOz;
    const metalPriceInUSDPerGram = metalPriceInUSDPerOz / GRAMS_PER_OUNCE;
    const exchangeRate = CURRENCIES[currency].rate;
    const total = amount * metalPriceInUSDPerGram * exchangeRate;
    const symbol = CURRENCIES[currency].symbol;

    const increment = () => setAmount(prev => prev + 1);
    const decrement = () => setAmount(prev => Math.max(0, prev - 1));

    return (
        <div 
          className="relative rounded-[6px] px-8 h-16 transition-all duration-700 flex items-center flex-1" 
          style={{ 
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px) saturate(140%)',
            WebkitBackdropFilter: 'blur(20px) saturate(140%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            willChange: 'backdrop-filter, opacity',
            transitionProperty: 'opacity, transform, backdrop-filter',
            transitionDuration: '700ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
            {/* Chromatic Aberration - Red channel */}
            <div 
              className="absolute inset-0 rounded-[6px] pointer-events-none opacity-40"
              style={{
                background: 'linear-gradient(90deg, rgba(255, 0, 0, 0.03) 0%, transparent 10%, transparent 90%, rgba(255, 0, 0, 0.03) 100%)',
                mixBlendMode: 'screen',
              }}
            />
            
            {/* Chromatic Aberration - Cyan channel */}
            <div 
              className="absolute inset-0 rounded-[6px] pointer-events-none opacity-40"
              style={{
                background: 'linear-gradient(90deg, rgba(0, 255, 255, 0.03) 0%, transparent 10%, transparent 90%, rgba(0, 255, 255, 0.03) 100%)',
                mixBlendMode: 'screen',
                transform: 'translateX(1px)',
              }}
            />
            
            {/* Edge distortion highlight */}
            <div 
              className="absolute inset-0 rounded-[6px] pointer-events-none opacity-60"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 20%, transparent 80%, rgba(255, 255, 255, 0.04) 100%)',
              }}
            />
            
            <div className="flex items-center gap-4 justify-between w-full relative z-10">
                {/* Input Section */}
                <div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-700"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                    <input 
                        type="number" 
                        value={amount}
                        min="0"
                        step="1"
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="bg-transparent text-base w-12 font-['Inter'] font-bold focus:outline-none lining-nums tabular-nums text-center p-0 border-none transition-colors duration-700"
                        style={{ color: inverted ? '#0A0E1A' : '#FFFFFF' }}
                    />
                    <div className="flex flex-col -space-y-0.5">
                       <button 
                         onClick={increment} 
                         className="transition-colors duration-700 hover:scale-110"
                         style={{ color: inverted ? 'rgba(10, 14, 26, 0.4)' : 'rgba(255, 255, 255, 0.4)' }}
                       >
                         <ChevronUp size={12} />
                       </button>
                       <button 
                         onClick={decrement} 
                         className="transition-colors duration-700 hover:scale-110"
                         style={{ color: inverted ? 'rgba(10, 14, 26, 0.4)' : 'rgba(255, 255, 255, 0.4)' }}
                       >
                         <ChevronDown size={12} />
                       </button>
                    </div>
                    <span 
                      className="text-xs font-bold uppercase tracking-wider transition-colors duration-700"
                      style={{ color: inverted ? 'rgba(10, 14, 26, 0.5)' : 'rgba(255, 255, 255, 0.5)' }}
                    >
                      G
                    </span>
                </div>
                
                {/* Metal Select */}
                <div className="relative">
                    <select 
                        value={metal} 
                        onChange={(e) => setMetal(e.target.value as any)} 
                        className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer border-none outline-none appearance-none uppercase tracking-wider font-['Inter'] transition-colors duration-700 pr-6 py-2 px-3 rounded-lg hover:bg-white/5"
                        style={{ 
                            color: inverted ? 'rgba(10, 14, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                            background: 'rgba(255, 255, 255, 0.05)'
                        }}
                    >
                        <option value="gold" className="bg-[#0A0E1A] text-white">Gold</option>
                        <option value="silver" className="bg-[#0A0E1A] text-white">Silver</option>
                        <option value="platinum" className="bg-[#0A0E1A] text-white">Platinum</option>
                        <option value="palladium" className="bg-[#0A0E1A] text-white">Palladium</option>
                    </select>
                    <ChevronDown 
                        size={12} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-700"
                        style={{ color: inverted ? 'rgba(10, 14, 26, 0.4)' : 'rgba(255, 255, 255, 0.4)' }}
                    />
                </div>
                
                <ArrowRightLeft 
                  size={14} 
                  className="transition-colors duration-700" 
                  style={{ color: inverted ? 'rgba(10, 14, 26, 0.4)' : 'rgba(255, 255, 255, 0.4)' }}
                />
                
                {/* Currency Select */}
                <div className="relative">
                    <select 
                        value={currency} 
                        onChange={(e) => setCurrency(e.target.value as any)} 
                        className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer border-none outline-none appearance-none font-['Inter'] transition-colors duration-700 pr-6 py-2 px-3 rounded-lg hover:bg-white/5"
                        style={{ 
                            color: inverted ? 'rgba(10, 14, 26, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                            background: 'rgba(255, 255, 255, 0.05)'
                        }}
                    >
                        <option value="USD" className="bg-[#0A0E1A] text-white">USD</option>
                        <option value="EUR" className="bg-[#0A0E1A] text-white">EUR</option>
                        <option value="GBP" className="bg-[#0A0E1A] text-white">GBP</option>
                        <option value="AED" className="bg-[#0A0E1A] text-white">AED</option>
                        <option value="JPY" className="bg-[#0A0E1A] text-white">JPY</option>
                    </select>
                    <ChevronDown 
                        size={12} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-700"
                        style={{ color: inverted ? 'rgba(10, 14, 26, 0.4)' : 'rgba(255, 255, 255, 0.4)' }}
                    />
                </div>
                
                <span 
                  className="text-xl font-['Inter'] lining-nums tabular-nums font-bold transition-colors duration-700"
                  style={{ color: inverted ? '#0A0E1A' : '#FFFFFF' }}
                >
                    {symbol}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
        </div>
    );
}

export default function TickerPanel() {
  const { formatPrice } = useCurrency();
  const [isTickerVisible, setIsTickerVisible] = useState(false);
  const [isLightBackground, setIsLightBackground] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  
  // Market Data State
  const [marketData, setMarketData] = useState({
      gold: { 
          currentPrice: INITIAL_PRICES.gold, 
          history: INITIAL_DATA.gold,
          change: 2.5,
          volatility: 2.0 
      },
      silver: { 
          currentPrice: INITIAL_PRICES.silver, 
          history: INITIAL_DATA.silver,
          change: -1.2,
          volatility: 0.3 
      }
  });

  // Scroll handler for ticker visibility AND background detection
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const direction = currentScrollY > lastScrollY ? 'down' : 'up';
          
          // Detect if we're on light background
          const heroHeight = window.innerHeight;
          const isAfterHero = currentScrollY > heroHeight - 150;
          
          // Check if we're on dark sections (CompareBlock or Video Section)
          const compareBlock = document.getElementById('compare-block');
          const videoSection = document.getElementById('video-section');
          let isOnDarkSection = false;
          
          const tickerY = 92 + 32; // navbar height + ticker height
          
          if (compareBlock) {
            const rect = compareBlock.getBoundingClientRect();
            // Check if ticker overlaps with CompareBlock
            if (rect.top < tickerY && rect.bottom > tickerY) {
              isOnDarkSection = true;
            }
          }
          
          if (videoSection && !isOnDarkSection) {
            const rect = videoSection.getBoundingClientRect();
            // Check if ticker overlaps with Video Section
            if (rect.top < tickerY && rect.bottom > tickerY) {
              isOnDarkSection = true;
            }
          }
          
          // Set light background if after hero BUT NOT on dark section
          setIsLightBackground(isAfterHero && !isOnDarkSection);
          
          if (currentScrollY > 150) {
            if (direction === 'down' && scrollDirection === 'up') {
              setIsTickerVisible(false);
            } else if (direction === 'down' && !isTickerVisible) {
              setIsTickerVisible(true);
            }
          } else {
            setIsTickerVisible(false);
          }
          
          setScrollDirection(direction);
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, scrollDirection, isTickerVisible]);

  // Realtime Price Updates
  useEffect(() => {
      const fetchRealGold = async () => {
          try {
              const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=PAXGUSDT');
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              
              const data = await res.json();
              const realPrice = parseFloat(data.lastPrice);
              
              if (isNaN(realPrice) || realPrice <= 0) throw new Error('Invalid price data');
              
              setMarketData(prev => {
                  const currentMetal = prev.gold;
                  const newHistory = [
                      ...currentMetal.history.slice(1),
                      { name: currentMetal.history[currentMetal.history.length - 1].name + 1, value: realPrice }
                  ];

                  const startPrice = newHistory[0].value;
                  const changePct = ((realPrice - startPrice) / startPrice) * 100;

                  return {
                      ...prev,
                      gold: {
                          ...currentMetal,
                          currentPrice: realPrice,
                          history: newHistory,
                          change: changePct
                      }
                  };
              });
          } catch (e) {
              // Silently fallback to simulation
          }
      };

      const apiInterval = setInterval(fetchRealGold, 10000);
      fetchRealGold();

      const interval = setInterval(() => {
          setMarketData(prev => {
              const newData = { ...prev };
              
              (Object.keys(newData) as Array<keyof typeof newData>).forEach(metal => {
                  const currentMetal = newData[metal];
                  const lastPrice = currentMetal.history[currentMetal.history.length - 1].value;
                  const fluctuation = (Math.random() - 0.5) * currentMetal.volatility;
                  const newPrice = lastPrice + fluctuation;
                  
                  const newHistory = [
                      ...currentMetal.history.slice(1),
                      { name: currentMetal.history[0].name + currentMetal.history.length, value: newPrice }
                  ];

                  const startPrice = newHistory[0].value;
                  const changePct = ((newPrice - startPrice) / startPrice) * 100;

                  newData[metal] = {
                      ...currentMetal,
                      currentPrice: newPrice,
                      history: newHistory,
                      change: changePct
                  };
              });

              return newData;
          });
      }, 2000);

      return () => {
          clearInterval(interval);
          clearInterval(apiInterval);
      };
  }, []);

  return (
    <>
      {/* Desktop Ticker Panel */}
      <div 
        className={`fixed left-0 z-[45] transition-all ease-[cubic-bezier(0.4,0,0.2,1)] hidden md:block ${ 
          isTickerVisible ? 'translate-y-0' : '-translate-y-8 pointer-events-none'
        }`}
        style={{
          top: '96px',
          width: '100%',
          opacity: isTickerVisible ? 1 : 0,
          transitionProperty: 'transform 700ms, opacity 700ms',
          transitionDelay: isTickerVisible ? '350ms, 350ms' : '0ms, 0ms',
        }}
      >
        <div className="flex items-center gap-4 px-4 md:px-6 lg:px-8">
          <GlassTickerCard 
            title="Gold" 
            price={formatPrice(marketData.gold.currentPrice)} 
            change={`${marketData.gold.change >= 0 ? '+' : ''}${marketData.gold.change.toFixed(2)}%`} 
            isPositive={marketData.gold.change >= 0}
            imageBg={goldSphere}
            history={marketData.gold.history}
            inverted={isLightBackground}
            compact={false}
          />
          <GlassTickerCard 
            title="Silver" 
            price={formatPrice(marketData.silver.currentPrice)} 
            change={`${marketData.silver.change >= 0 ? '+' : ''}${marketData.silver.change.toFixed(2)}%`} 
            isPositive={marketData.silver.change >= 0}
            imageBg={silverSphere}
            history={marketData.silver.history}
            inverted={isLightBackground}
            compact={false}
          />
          <GlassConverter livePrices={marketData} inverted={isLightBackground} />
        </div>
      </div>

      {/* Mobile: Floating Button */}
      <button
        onClick={() => setIsMobileModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #D4AF37 0%, #B8A07E 100%)',
        }}
        aria-label="Open market prices"
      >
        <img src={goldSphere} alt="Gold" className="w-7 h-7 object-contain" />
        
        {/* Pulse animation ring */}
        <span 
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8A07E 100%)',
            animationDuration: '2s'
          }}
        />
      </button>

      {/* Mobile: Modal */}
      {isMobileModalOpen && (
        <div 
          className="md:hidden fixed inset-0 z-[100] flex items-end justify-center"
          onClick={() => setIsMobileModalOpen(false)}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            style={{
              animation: 'fadeIn 300ms ease-out'
            }}
          />
          
          {/* Modal Content - White Background */}
          <div 
            className="relative w-full bg-white rounded-t-3xl p-6 pb-8 shadow-2xl"
            style={{
              animation: 'slideUp 400ms cubic-bezier(0.16, 1, 0.3, 1)',
              maxHeight: '85vh',
              overflowY: 'auto',
              background: 'linear-gradient(to bottom, #FFFFFF 0%, #F8F8F8 100%)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-1 bg-black/10 rounded-full" />
            </div>

            {/* Title */}
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-[#1A1A1A] font-['Cormorant_Garamond'] mb-1">
                Live Market Prices
              </h3>
              <p className="text-xs text-[#1A1A1A]/50 uppercase tracking-widest font-['Inter']">
                Real-time precious metals
              </p>
            </div>

            {/* Cards Stack - inverted for light background, hideInset for mobile */}
            <div className="flex flex-col gap-4">
              <GlassTickerCard 
                title="Gold" 
                price={formatPrice(marketData.gold.currentPrice)} 
                change={`${marketData.gold.change >= 0 ? '+' : ''}${marketData.gold.change.toFixed(2)}%`} 
                isPositive={marketData.gold.change >= 0}
                imageBg={goldSphere}
                history={marketData.gold.history}
                inverted={true}
                compact={false}
                hideInset={true}
              />
              <GlassTickerCard 
                title="Silver" 
                price={formatPrice(marketData.silver.currentPrice)} 
                change={`${marketData.silver.change >= 0 ? '+' : ''}${marketData.silver.change.toFixed(2)}%`} 
                isPositive={marketData.silver.change >= 0}
                imageBg={silverSphere}
                history={marketData.silver.history}
                inverted={true}
                compact={false}
                hideInset={true}
              />
              <GlassConverter livePrices={marketData} inverted={true} />
            </div>

            {/* Close Button - Explore style */}
            <button
              onClick={() => setIsMobileModalOpen(false)}
              className="mt-6 w-full py-3 rounded-full text-sm font-['Inter'] font-medium uppercase tracking-[0.15em] transition-all duration-300 bg-transparent border border-[#1A1A1A]/20 text-[#1A1A1A] hover:border-[#1A1A1A]/40 hover:bg-[#1A1A1A]/5"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            transform: translateY(100%);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}