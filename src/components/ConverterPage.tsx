import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { RefreshCw, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { ParticleBackground } from "@/app/components/ParticleBackground";

const CURRENCIES = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", type: "crypto", logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", type: "crypto", logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  { id: "tether", symbol: "USDT", name: "Tether", type: "crypto", logo: "https://assets.coingecko.com/coins/images/325/small/Tether.png" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", type: "crypto", logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png" },
  { id: "solana", symbol: "SOL", name: "Solana", type: "crypto", logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
  { id: "ripple", symbol: "XRP", name: "XRP", type: "crypto", logo: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png" },
  { id: "usd-coin", symbol: "USDC", name: "USDC", type: "crypto", logo: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", type: "crypto", logo: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png" },
  { id: "cardano", symbol: "ADA", name: "Cardano", type: "crypto", logo: "https://assets.coingecko.com/coins/images/975/small/cardano.png" },
  { id: "tron", symbol: "TRX", name: "TRON", type: "crypto", logo: "https://assets.coingecko.com/coins/images/1094/small/tron-logo.png" },
  { id: "toncoin", symbol: "TON", name: "Toncoin", type: "crypto", logo: "https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", type: "crypto", logo: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png" },
  { id: "shiba-inu", symbol: "SHIB", name: "Shiba Inu", type: "crypto", logo: "https://assets.coingecko.com/coins/images/11939/small/shiba.png" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot", type: "crypto", logo: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink", type: "crypto", logo: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png" },
  { id: "bitcoin-cash", symbol: "BCH", name: "Bitcoin Cash", type: "crypto", logo: "https://assets.coingecko.com/coins/images/780/small/bitcoin-cash-circle.png" },
  { id: "litecoin", symbol: "LTC", name: "Litecoin", type: "crypto", logo: "https://assets.coingecko.com/coins/images/2/small/litecoin.png" },
  { id: "near", symbol: "NEAR", name: "NEAR Protocol", type: "crypto", logo: "https://assets.coingecko.com/coins/images/10365/small/near.png" },
  { id: "matic-network", symbol: "MATIC", name: "Polygon", type: "crypto", logo: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png" },
  { id: "uniswap", symbol: "UNI", name: "Uniswap", type: "crypto", logo: "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png" },
  { id: "pepe", symbol: "PEPE", name: "Pepe", type: "crypto", logo: "https://assets.coingecko.com/coins/images/29850/small/pepe-token.png" },
  { id: "usd", symbol: "USD", name: "US Dollar", type: "fiat", logo: "https://flagcdn.com/w40/us.png" },
  { id: "eur", symbol: "EUR", name: "Euro", type: "fiat", logo: "https://flagcdn.com/w40/eu.png" },
  { id: "aed", symbol: "AED", name: "UAE Dirham", type: "fiat", logo: "https://flagcdn.com/w40/ae.png" },
];

export function ConverterPage({ onBack }: { onBack?: () => void }) {
  const [amount, setAmount] = useState<string>("1");
  const [from, setFrom] = useState(CURRENCIES.find(c => c.id === 'aed') || CURRENCIES[0]); // Default AED
  const [to, setTo] = useState(CURRENCIES.find(c => c.id === 'bitcoin') || CURRENCIES[0]); // Default BTC
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onBack) {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  useEffect(() => {
    const fetchRate = async () => {
      setLoading(true);
      try {
        // Simple mock logic with extended rates
        const rates: Record<string, number> = {
          "bitcoin": 96500,
          "ethereum": 3400,
          "tether": 1,
          "binancecoin": 600,
          "solana": 185,
          "ripple": 2.40,
          "usd-coin": 1,
          "dogecoin": 0.38,
          "cardano": 0.95,
          "tron": 0.20,
          "toncoin": 6.50,
          "avalanche-2": 45,
          "shiba-inu": 0.000025,
          "polkadot": 8.50,
          "chainlink": 22,
          "bitcoin-cash": 450,
          "litecoin": 110,
          "near": 7.50,
          "matic-network": 0.60,
          "uniswap": 12,
          "pepe": 0.00002,
          "usd": 1,
          "eur": 1.05,
          "aed": 0.272
        };

        const fromRate = rates[from.id] || 1;
        const toRate = rates[to.id] || 1;
        
        // Calculate: How many "to" units for 1 "from" unit
        // Rate = Price(From) / Price(To)
        // e.g. BTC/USD = 96500 / 1 = 96500
        const calculatedRate = fromRate / toRate;
        
        await new Promise(r => setTimeout(r, 400)); // Faster response for calculator feel
        
        setRate(calculatedRate);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, [from, to]);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleIncrement = () => {
    setAmount(prev => (parseFloat(prev || "0") + 1).toString());
  };

  const handleDecrement = () => {
    setAmount(prev => {
        const val = parseFloat(prev || "0");
        return val > 0 ? (val - 1).toString() : "0";
    });
  };

  const result = rate && amount ? (parseFloat(amount) * rate) : 0;
  
  return (
    <div 
      onClick={onBack}
      className="min-h-[100dvh] relative overflow-hidden flex items-center justify-center p-4 sm:p-6 font-body text-slate-600 bg-gradient-to-br from-white via-[#f5f5f7] to-[#e8e8ed] cursor-pointer"
    >
      {/* Hero Animation Background */}
      <ParticleBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] relative z-10 cursor-auto"
      >
        <div className="bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_24px_60px_-12px_rgba(50,50,93,0.15),0_12px_24px_-8px_rgba(0,0,0,0.08)] rounded-[24px] sm:rounded-[32px] overflow-hidden p-6 sm:p-8">
            
            {/* Header - Calculator Style */}
            <div className="mb-6 sm:mb-8 text-center">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-800 leading-none mb-2">Converter</h1>
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time Calculator</p>
            </div>

            <div className="space-y-4 sm:space-y-6 relative">
              
              {/* Input 1: From */}
              <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Amount</span>
                  <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 transition-all focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white group relative shadow-sm hover:shadow-md border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Custom Stepper - Optimized for Touch */}
                        <div className="flex flex-col gap-0.5 bg-slate-200/50 rounded-lg p-0.5 shrink-0">
                            <button onClick={handleIncrement} className="p-1 sm:p-0.5 hover:bg-white hover:shadow-sm rounded transition-all text-slate-500 hover:text-indigo-600 active:scale-95 touch-manipulation">
                                <ChevronUp size={14} strokeWidth={3} />
                            </button>
                            <button onClick={handleDecrement} className="p-1 sm:p-0.5 hover:bg-white hover:shadow-sm rounded transition-all text-slate-500 hover:text-indigo-600 active:scale-95 touch-manipulation">
                                <ChevronDown size={14} strokeWidth={3} />
                            </button>
                        </div>

                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-transparent text-2xl sm:text-3xl font-bold text-slate-800 outline-none placeholder:text-slate-300 lining-nums min-w-0"
                            placeholder="0.00"
                        />
                         
                         {/* Currency Selector */}
                         <div className="relative group/select shrink-0">
                            <select 
                                value={from.id}
                                onChange={(e) => setFrom(CURRENCIES.find(c => c.id === e.target.value) || from)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            >
                                {CURRENCIES.map(c => <option key={c.id} value={c.id}>{c.symbol}</option>)}
                            </select>
                            <button className="flex items-center gap-2 bg-white pl-2 pr-3 py-2 rounded-xl shadow-sm border border-slate-100 group-hover/select:border-indigo-200 transition-colors">
                                <ImageWithFallback src={from.logo} alt={from.symbol} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover shadow-sm" />
                                <span className="text-sm font-bold text-slate-800">{from.symbol}</span>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>
                        </div>
                    </div>
                  </div>
              </div>

              {/* Swap Divider */}
              <div className="relative h-4 flex items-center justify-center">
                 <div className="absolute inset-x-0 h-px bg-slate-100"></div>
                 <button 
                    onClick={handleSwap}
                    className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white border border-slate-100 rounded-full shadow-md flex items-center justify-center text-slate-400 hover:text-indigo-600 active:scale-90 sm:hover:scale-110 transition-all duration-300 group touch-manipulation"
                 >
                    <ArrowUpDown size={14} className="group-hover:rotate-180 transition-transform duration-500 sm:w-4 sm:h-4" />
                 </button>
              </div>

              {/* Input 2: To (Result) */}
               <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Converted Amount</span>
                  <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 transition-all group border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3 sm:gap-4">
                       <div className="w-full text-2xl sm:text-3xl font-bold text-slate-800 lining-nums truncate select-all min-w-0">
                          {loading ? (
                            <span className="animate-pulse text-slate-300">...</span>
                          ) : (
                            result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })
                          )}
                       </div>
                       
                       {/* Currency Selector */}
                       <div className="relative group/select shrink-0">
                            <select 
                                value={to.id}
                                onChange={(e) => setTo(CURRENCIES.find(c => c.id === e.target.value) || to)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            >
                                {CURRENCIES.map(c => <option key={c.id} value={c.id}>{c.symbol}</option>)}
                            </select>
                            <button className="flex items-center gap-2 bg-white pl-2 pr-3 py-2 rounded-xl shadow-sm border border-slate-100 group-hover/select:border-indigo-200 transition-colors">
                                <ImageWithFallback src={to.logo} alt={to.symbol} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover shadow-sm" />
                                <span className="text-sm font-bold text-slate-800">{to.symbol}</span>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>
                        </div>
                    </div>
                  </div>
              </div>

              {/* Rate Info Footer */}
              <div className="pt-4 flex flex-col sm:flex-row justify-between items-center text-xs font-medium text-slate-400 border-t border-slate-100 mt-6 gap-2 sm:gap-0">
                <div className="flex items-center gap-2">
                    <RefreshCw size={12} className={cn("transition-transform", loading && "animate-spin")} />
                    <span>Rate: 1 {from.symbol} = {rate?.toLocaleString(undefined, { maximumFractionDigits: 4 })} {to.symbol}</span>
                </div>
                <span>Last updated: Just now</span>
              </div>

            </div>
        </div>
      </motion.div>
    </div>
  );
}
