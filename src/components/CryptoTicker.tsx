import React, { useEffect, useState, useMemo, memo } from "react";
import { motion } from "motion/react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, Gem } from "lucide-react";
import { Card } from "@/app/components/ui/Card";

// Mock data as fallback in case API fails
const FALLBACK_DATA = [
  { id: "bitcoin", symbol: "btc", name: "Bitcoin", current_price: 84985.20, price_change_percentage_24h: 1.93, image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png", sparkline_in_7d: { price: Array(25).fill(0).map((_, i) => 100 + Math.sin(i) * 10 + i) } },
  { id: "ethereum", symbol: "eth", name: "Ethereum", current_price: 4032.15, price_change_percentage_24h: 2.15, image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png", sparkline_in_7d: { price: Array(25).fill(0).map((_, i) => 200 + Math.cos(i) * 20 + i) } },
  { id: "solana", symbol: "sol", name: "Solana", current_price: 145.20, price_change_percentage_24h: -0.84, image: "https://assets.coingecko.com/coins/images/4128/large/solana.png", sparkline_in_7d: { price: Array(25).fill(0).map((_, i) => 50 + Math.random() * 10) } },
  { id: "ripple", symbol: "xrp", name: "XRP", current_price: 0.62, price_change_percentage_24h: 0.45, image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png", sparkline_in_7d: { price: Array(25).fill(0).map((_, i) => 10 + Math.sin(i * 2) * 2) } },
  { id: "binancecoin", symbol: "bnb", name: "BNB", current_price: 590.10, price_change_percentage_24h: 1.2, image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png", sparkline_in_7d: { price: Array(25).fill(0).map((_, i) => 300 + i * 2) } },
];

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  sparkline_in_7d: {
    price: number[];
  };
}

// React.memo: Предотвращает ререндер карточки если props не изменились
const CryptoCard = memo(({ item }: { item: CoinData }) => {
  const isUp = item.price_change_percentage_24h >= 0;
  const strokeColor = isUp ? '#10B981' : '#F43F5E';
  const fillColor = isUp ? '#10B981' : '#F43F5E';
  
  // useMemo: Cache chart data (пересчитывается только при изменении sparkline)
  const chartData = useMemo(() => {
    return item.sparkline_in_7d.price
      .filter((_, i) => i % 4 === 0) // optimize performance by taking every 4th point
      .map((val) => ({ value: val }));
  }, [item.sparkline_in_7d.price]);

  return (
    <Card hoverEffect className="shrink-0 w-[300px] md:w-[340px] h-[240px] flex flex-col relative group cursor-pointer bg-white mx-4">
      <div className="p-7 pb-0 flex-1 relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="font-heading text-2xl text-gray-900 leading-none mb-2">{item.name}</h3>
            <p className="font-body text-sm text-gray-400 font-bold uppercase tracking-widest">{item.symbol}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-500 overflow-hidden p-2">
             <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 mt-auto relative z-10">
          <h2 className="font-sans font-thin text-3xl lg:text-4xl text-gray-900 tracking-tight lining-nums">
            ${item.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </h2>
          <div className={`inline-flex items-center gap-1.5 text-sm font-bold lining-nums px-2.5 py-1 rounded-full ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            <span>{Math.abs(item.price_change_percentage_24h).toFixed(2)}%</span>
            {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          </div>
        </div>
      </div>

      <div className="h-28 w-full mt-auto absolute bottom-0 left-0 right-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillColor} stopOpacity={0.4}/>
                <stop offset="100%" stopColor={fillColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={strokeColor} 
              strokeWidth={2} 
              fill={`url(#gradient-${item.id})`} 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});

// Display name for React DevTools
CryptoCard.displayName = 'CryptoCard';

export function CryptoTicker() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,binancecoin,cardano,avalanche-2,dogecoin,polkadot,tron&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h"
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setCoins(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
        setCoins(FALLBACK_DATA as CoinData[]);
        setLoading(false);
      }
    };

    fetchCoins();
    // Refresh every 60 seconds
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  // Triple the items for smooth infinite scroll
  const marqueeItems = [...coins, ...coins, ...coins];

  if (loading && coins.length === 0) return null; // Or a skeleton

  return (
    <section className="py-20 bg-transparent border-b border-gray-100 overflow-hidden">
      <div className="w-full group/marquee overflow-hidden">
        <div className="flex w-max animate-scroll-left group-hover/marquee:[animation-play-state:paused]">
          {marqueeItems.map((item, idx) => (
            <CryptoCard key={`${item.id}-${idx}`} item={item} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          from { transform: translateX(0%); }
          to { transform: translateX(-33.33%); }
        }
        .animate-scroll-left {
          animation: scroll-left 60s linear infinite;
        }
      `}</style>
    </section>
  );
}