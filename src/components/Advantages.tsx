import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRightLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { useCurrency } from '@/app/contexts/CurrencyContext';

// Assets for Ticker
import goldSphere from "figma:asset/7cc915087ef6f743d1b11f994726b858699cfcd4.png";
import silverSphere from "figma:asset/358970d9c1e8c7e75a78713c8e1b2103b19698d3.png";

// --- Styles for CSS Marquee ---
const marqueeStyle = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }
  .animate-marquee {
    animation: marquee 40s linear infinite;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }
`;

// --- Data Generation & Simulation ---

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

// Initial States
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

const createSparklinePath = (data: any[], width: number, height: number) => {
  if (!data || data.length === 0) return { area: "", line: "" };
  const values = data.map(d => d.value);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;
  
  // Padding to prevent stroke clipping
  const padding = 4;
  const availableHeight = height - (padding * 2);

  const points = values.map((val, i) => {
    const x = (i / (values.length - 1)) * width;
    // Invert Y because SVG 0 is top
    const y = (height - padding) - ((val - minVal) / range) * availableHeight; 
    return [x, y];
  });

  // Smoothing Logic (Catmull-Rom to Bezier)
  const line = (pointA: number[], pointB: number[]) => {
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    };
  };

  const controlPoint = (current: number[], previous: number[], next: number[], reverse?: boolean) => {
    const p = previous || current;
    const n = next || current;
    const smoothing = 0.2;
    const o = line(p, n);
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing;
    const x = current[0] + Math.cos(angle) * length;
    const y = current[1] + Math.sin(angle) * length;
    return [x, y];
  };

  const bezierCommand = (point: number[], i: number, a: any[]) => {
    const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point);
    const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true);
    return `C ${cpsX.toFixed(2)},${cpsY.toFixed(2)} ${cpeX.toFixed(2)},${cpeY.toFixed(2)} ${point[0].toFixed(2)},${point[1].toFixed(2)}`;
  };

  const d = points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point[0].toFixed(2)},${point[1].toFixed(2)}`;
    return `${acc} ${bezierCommand(point as number[], i, a)}`;
  }, "");

  const area = `${d} L ${width},${height} L 0,${height} Z`;
  
  return { area, line: d as string };
};

// --- Ticker Components ---
function TickerCard({ title, price, change, isPositive, data, color, imageBg }: { 
    title: string, 
    price: string, 
    change: string, 
    isPositive: boolean, 
    data: any[], 
    color: string, 
    imageBg?: string
}) {
  const { area, line } = useMemo(() => createSparklinePath(data, 340, 100), [data]);

  return (
    <div className="w-[340px] h-[220px] bg-white rounded-2xl p-6 flex flex-col justify-between shrink-0 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden border border-gray-100 group">
      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-3">
              {imageBg && (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden p-1.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)]">
                      <img src={imageBg} alt={title} className="w-full h-full object-contain drop-shadow-sm transform group-hover:scale-110 transition-transform duration-500" />
                  </div>
              )}
              <div>
                  <span className="font-['Inter'] text-xs text-gray-500 uppercase tracking-wider">{title}</span>
                  <h3 className="text-2xl font-['Inter'] font-bold text-gray-900 leading-none mt-1 lining-nums tabular-nums">
                      {price}
                  </h3>
              </div>
          </div>
          <div className={`px-2.5 py-1.5 rounded text-xs font-bold font-['Inter'] ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
             {change}
          </div>
      </div>

      {/* Sparkline Chart */}
      <div className="absolute bottom-0 left-0 right-0 h-[100px] pointer-events-none opacity-15">
         <svg width="340" height="100" viewBox="0 0 340 100" className="w-full h-full">
            <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.4}/>
                    <stop offset="100%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#gradient-${title})`} />
            <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
         </svg>
      </div>
    </div>
  );
}

function ConverterCard({ livePrices }: { livePrices?: any }) {
    const [amount, setAmount] = useState<number>(10);
    const [metal, setMetal] = useState<"gold" | "silver" | "platinum" | "palladium">("gold");
    const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP" | "AED" | "JPY">("USD");
    const [isSwapped, setIsSwapped] = useState(false);

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
        <div className="w-full md:w-[340px] h-[220px] bg-white p-6 flex flex-col rounded-2xl border border-gray-100 relative z-20 shadow-none hover:shadow-lg transition-all duration-500">
            <div className="flex justify-between items-center mb-5">
                <span className="font-['Cormorant_Garamond'] text-lg text-gray-900 font-bold">Converter</span>
                <motion.button 
                    onClick={() => setIsSwapped(!isSwapped)}
                    animate={{ rotate: isSwapped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100 text-[#D4AF37]"
                >
                    <ArrowRightLeft size={16} />
                </motion.button>
            </div>
            <div className="space-y-3 flex-1 flex flex-col justify-center">
                <div className="bg-[#F9F9F9] p-3 rounded-xl flex items-center justify-between group focus-within:ring-1 focus-within:ring-[#D4AF37]/30 transition-all">
                    <div className="flex items-center gap-1.5">
                        <input 
                            type="number" 
                            value={amount}
                            min="0"
                            step="1"
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="bg-transparent text-xl w-12 font-['Cormorant_Garamond'] font-bold focus:outline-none text-gray-900 lining-nums tabular-nums text-center p-0 border-none appearance-none placeholder-gray-300"
                        />
                        <div className="flex flex-col">
                           <button onClick={increment} className="text-gray-400 hover:text-gray-600"><ChevronUp size={10} /></button>
                           <button onClick={decrement} className="text-gray-400 hover:text-gray-600"><ChevronDown size={10} /></button>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">G</span>
                    </div>
                    <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>
                    <select value={metal} onChange={(e) => setMetal(e.target.value as any)} className="bg-transparent text-right text-xs font-bold text-gray-700 focus:outline-none cursor-pointer border-none outline-none appearance-none uppercase tracking-wider">
                        <option value="gold">Gold</option>
                        <option value="silver">Silver</option>
                        <option value="platinum">Platinum</option>
                        <option value="palladium">Palladium</option>
                    </select>
                </div>
                <div className="flex items-center justify-between bg-[#F9F9F9] p-3 rounded-xl">
                    <select value={currency} onChange={(e) => setCurrency(e.target.value as any)} className="bg-transparent text-xs font-bold text-gray-500 focus:outline-none cursor-pointer border-none outline-none w-16 appearance-none">
                       <option value="USD">USD</option>
                       <option value="EUR">EUR</option>
                       <option value="GBP">GBP</option>
                       <option value="AED">AED</option>
                       <option value="JPY">JPY</option>
                   </select>
                    <span className="text-lg font-['Cormorant_Garamond'] text-[#D4AF37] lining-nums tabular-nums font-bold">
                        {symbol}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    );
}

export function Advantages() {
  const { currency, formatPrice, convertPrice } = useCurrency();
  
  // State for Market Data
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
      },
      platinum: { 
          currentPrice: INITIAL_PRICES.platinum, 
          history: INITIAL_DATA.platinum,
          change: 0.8,
          volatility: 1.5 
      },
      palladium: { 
          currentPrice: INITIAL_PRICES.palladium, 
          history: INITIAL_DATA.palladium,
          change: 1.5,
          volatility: 2.5 
      }
  });

  // Realtime Simulation Effect
  useEffect(() => {
      // Fetch Real Gold Price from Binance (PAXG/USDT is a gold-backed token)
      // Using Binance's ticker/24hr endpoint which provides more data and better CORS support
      const fetchRealGold = async () => {
          try {
              const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=PAXGUSDT', {
                  method: 'GET',
                  headers: {
                      'Accept': 'application/json',
                  },
              });
              
              if (!res.ok) {
                  throw new Error(`HTTP error! status: ${res.status}`);
              }
              
              const data = await res.json();
              const realPrice = parseFloat(data.lastPrice);
              
              if (isNaN(realPrice) || realPrice <= 0) {
                  throw new Error('Invalid price data');
              }
              
              setMarketData(prev => {
                  const currentMetal = prev.gold;
                  
                  // Update History with Real Price
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
              // Silently fallback to simulation - no console warnings
              // The simulation interval below will handle the data
          }
      };

      // Run fetch every 10 seconds (reduced frequency to avoid rate limits)
      const apiInterval = setInterval(fetchRealGold, 10000);
      fetchRealGold(); // Initial call

      const interval = setInterval(() => {
          setMarketData(prev => {
              const newData = { ...prev };
              
              (Object.keys(newData) as Array<keyof typeof newData>).forEach(metal => {
                  const currentMetal = newData[metal];
                  const lastPrice = currentMetal.history[currentMetal.history.length - 1].value;
                  const fluctuation = (Math.random() - 0.5) * currentMetal.volatility;
                  const newPrice = lastPrice + fluctuation;
                  
                  // Update History
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
      }, 2000); // Update every 2 seconds

      return () => {
          clearInterval(interval);
          clearInterval(apiInterval);
      };
  }, []);
  
  const cards = [
    <TickerCard 
        key="gold" 
        title="Gold" 
        price={formatPrice(marketData.gold.currentPrice)} 
        change={`${marketData.gold.change >= 0 ? '+' : ''}${marketData.gold.change.toFixed(2)}%`} 
        isPositive={marketData.gold.change >= 0} 
        data={marketData.gold.history} 
        color="#059669" 
        imageBg={goldSphere}
    />,
    <TickerCard 
        key="silver" 
        title="Silver" 
        price={formatPrice(marketData.silver.currentPrice)} 
        change={`${marketData.silver.change >= 0 ? '+' : ''}${marketData.silver.change.toFixed(2)}%`} 
        isPositive={marketData.silver.change >= 0} 
        data={marketData.silver.history} 
        color="#6B7280" 
        imageBg={silverSphere}
    />
  ];

  return (
    <section className="relative z-10 mt-0">
      <style>{marqueeStyle}</style>
      
      {/* Ticker Section Container */}
      <div className="w-full bg-white shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.1)] pt-16 md:pt-24 pb-24 relative z-20">
          
          <div className="w-full px-6 md:px-12 lg:px-16">
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center justify-center max-w-[1400px] mx-auto">
                  
                  {/* Cards Section - Static Grid (No Marquee) */}
                  <div className="w-full lg:flex-1 flex items-center justify-center">
                      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full sm:w-auto">
                          {cards.map((card, i) => <div key={i}>{card}</div>)}
                      </div>
                  </div>

                  {/* Converter Section (Right) */}
                  <div className="w-full md:w-auto shrink-0 z-20 flex justify-center lg:justify-end">
                      <ConverterCard livePrices={marketData} />
                  </div>
              </div>
          </div>

      </div>
    </section>
  );
}