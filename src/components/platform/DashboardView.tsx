import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '@/app/components/ui/Card';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, ArrowRight, Bell, MoreVertical, Wallet, Gem, ShieldCheck } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

// --- Types ---

interface AssetData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
}

// --- Data ---

const HISTORY = [
  { id: 1, title: "Capital Allocation", date: "Today, 10:23 AM", value: "+ $500,000.00", type: "income" },
  { id: 2, title: "Transfer to Cold Storage", date: "Yesterday, 4:15 PM", value: "- 25.0 BTC", type: "expense" },
];

const TRADING_NOTIFICATIONS = [
  { 
    id: 1, 
    user: "Risk Engine", 
    action: "Alert", 
    content: "Daily drawdown limit approaching (1.8% / 2.0%).", 
    time: "5 min ago",
    type: "system",
    avatar: "R"
  },
  { 
    id: 2, 
    user: "Algo Bot", 
    action: "Execution", 
    content: "BTC/USDT Short position closed at TP 1.", 
    time: "45 min ago",
    type: "trade",
    avatar: "A",
    meta: "+3.2%"
  },
];

// --- Helper Components ---

const AssetCard = ({ 
  data,
  className
}: { 
  data: AssetData;
  className?: string;
}) => {
  const trend = data.price_change_percentage_24h >= 0 ? 'up' : 'down';
  const strokeColor = trend === 'up' ? '#10B981' : '#F43F5E';
  const fillColor = trend === 'up' ? '#10B981' : '#F43F5E';

  // Format sparkline data for Recharts
  const chartData = data.sparkline_in_7d.price.slice(-20).map((val) => ({ value: val }));

  return (
    <Card hoverEffect className={`p-0 h-[160px] md:h-[180px] flex flex-col relative group cursor-pointer bg-white shrink-0 w-[260px] md:w-auto ${className}`}>
      <div className="p-4 md:p-5 pb-0 flex-1 relative z-10">
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div>
            <h3 className="font-heading text-lg md:text-xl text-gray-900 leading-none mb-1">{data.name}</h3>
            <p className="font-body text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">{data.symbol.toUpperCase()}</p>
          </div>
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-500">
             {data.symbol === 'btc' ? <span className="font-bold text-xs md:text-sm">₿</span> : <Gem size={14} />}
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 mt-auto relative z-10">
          <h2 className="font-sans font-thin text-xl md:text-2xl lg:text-3xl text-gray-900 tracking-tight lining-nums">
            ${data.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div className={`inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold lining-nums px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            <span>{data.price_change_percentage_24h.toFixed(2)}%</span>
            {trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          </div>
        </div>
      </div>

      <div className="h-16 md:h-20 w-full mt-auto absolute bottom-0 left-0 right-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
        <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${data.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillColor} stopOpacity={0.4}/>
                <stop offset="100%" stopColor={fillColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={strokeColor} 
              strokeWidth={2} 
              fill={`url(#gradient-${data.id})`} 
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

const NotificationItem = ({ item }: { item: typeof TRADING_NOTIFICATIONS[0] }) => (
  <div className="flex gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors group cursor-pointer">
    <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-500 font-heading font-bold text-sm">
      {item.avatar}
    </div>
    <div className="flex-1 space-y-1">
      <div className="flex justify-between items-start">
        <p className="font-body text-sm font-bold text-gray-900">
          {item.user} <span className="text-gray-400 font-medium ml-1 text-xs uppercase tracking-wider">{item.action}</span>
        </p>
        <span className="font-body text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.time}</span>
      </div>
      <p className="font-body text-sm text-gray-500 leading-snug">
        {item.content}
      </p>
      {item.meta && (
        <div className="mt-1 inline-flex items-center gap-2 px-1.5 py-0.5 bg-green-50 rounded-md">
           <span className="text-xs font-bold text-green-700 lining-nums">{item.meta}</span>
        </div>
      )}
    </div>
  </div>
);

const HistoryRow = ({ item }: { item: typeof HISTORY[0] }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-4 -mx-4 transition-colors group cursor-pointer">
    <div className="flex items-center gap-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${item.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400 group-hover:text-gray-900'}`}>
         {item.type === 'income' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
      </div>
      <div>
        <p className="font-body font-bold text-gray-900 text-sm mb-0.5">{item.title}</p>
        <p className="font-body text-xs text-gray-400 font-bold tracking-wider uppercase">{item.date}</p>
      </div>
    </div>
    <span className={`font-body font-medium text-sm lining-nums ${item.type === 'income' ? 'text-emerald-600' : 'text-gray-900'}`}>
      {item.value}
    </span>
  </div>
);

// Fallback data
const MOCK_ASSETS: AssetData[] = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 84985.20, price_change_percentage_24h: 1.93, sparkline_in_7d: { price: Array(20).fill(0).map((_, i) => 84000 + i * 50) } },
    { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 4032.15, price_change_percentage_24h: 2.15, sparkline_in_7d: { price: Array(20).fill(0).map((_, i) => 4000 + i * 10) } },
    { id: 'solana', name: 'Solana', symbol: 'sol', current_price: 145.20, price_change_percentage_24h: -0.84, sparkline_in_7d: { price: Array(20).fill(0).map((_, i) => 140 + i) } },
];

export const DashboardView = () => {
  const [assets, setAssets] = useState<AssetData[]>(MOCK_ASSETS);

  useEffect(() => {
    const fetchAssets = async () => {
        try {
            const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&per_page=3&page=1&sparkline=true');
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setAssets(data);
        } catch (e) {
            console.log("Using fallback data due to API error:", e);
            setAssets(MOCK_ASSETS);
        }
    };
    fetchAssets();
  }, []);

  return (
    <div className="w-full h-full bg-white p-4 md:p-8 overflow-y-auto md:overflow-hidden flex flex-col">
      {/* Header / Hero */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 pb-4 md:pb-6 border-b border-gray-100 flex-shrink-0">
        <div className="w-full md:max-w-xl text-center md:text-left">
           <h1 className="font-heading text-2xl md:text-4xl mb-3 md:mb-4 text-gray-900 tracking-tight leading-tight">
             Internal Overview
           </h1>
           <div className="flex flex-row items-center justify-center md:justify-start gap-4">
              <Button size="sm" variant="primary" icon={ArrowRight} className="pl-6 pr-6 w-full md:w-auto">
                ALLOCATION
              </Button>
           </div>
        </div>
        
        {/* Top Actions */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
           <div className="md:hidden text-xs font-bold text-gray-400 uppercase tracking-widest">
                My Account
           </div>
           <div className="flex items-center gap-3">
               <button className="w-10 h-10 rounded-xl border border-gray-100 bg-white hover:border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all duration-300">
                 <Wallet size={18} />
               </button>
               <button className="w-10 h-10 rounded-xl border border-gray-100 bg-white hover:border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all duration-300 relative">
                 <Bell size={18} />
                 <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
               </button>
           </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 pt-4 md:pt-6">
        
        {/* Left Column: Wallets & Chart (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col space-y-6 min-h-0">
           {/* Asset Cards - Horizontal Scroll on Mobile */}
           <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 gap-4 md:pb-0 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-shrink-0">
              {assets.slice(0, 3).map(asset => (
                <AssetCard key={asset.id} data={asset} className="snap-center" />
              ))}
           </div>

           {/* Trend / History Section - compacted */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
              <Card className="bg-white border-gray-100 flex flex-col h-[300px] md:h-full md:min-h-[300px]">
                 <CardHeader title="Market Watch" subtitle="Live Feeds" className="pb-2" />
                 <div className="flex-1 overflow-y-auto space-y-2 p-4 md:p-6 pt-2 [&::-webkit-scrollbar]:hidden">
                    {assets.map((coin) => {
                        const up = coin.price_change_percentage_24h >= 0;
                        return (
                            <div key={coin.id} className="group p-3 border border-gray-50 rounded-xl flex items-center justify-between hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-300 cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${up ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <div>
                                        <span className="block font-body font-bold text-gray-900 text-sm">{coin.symbol.toUpperCase()}/USD</span>
                                        <span className="block font-body text-xs text-gray-400 font-medium">{coin.name}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-sans font-thin text-gray-900 lining-nums text-sm">
                                        ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                    </p>
                                    <p className={`font-body text-xs font-bold lining-nums ${up ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {coin.price_change_percentage_24h.toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                 </div>
              </Card>

              <Card className="bg-white border-gray-100 flex flex-col h-[300px] md:h-full md:min-h-[300px]">
                 <CardHeader 
                    title="Treasury" 
                    subtitle="Internal Transfers" 
                    className="pb-2"
                 />
                 <div className="mt-1 p-2 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    {HISTORY.map(item => (
                       <HistoryRow key={item.id} item={item} />
                    ))}
                 </div>
              </Card>
           </div>
        </div>

        {/* Right Column: Notifications (1/3 width) */}
        <div className="lg:col-span-1 flex flex-col space-y-6 min-h-0">
           <Card className="p-0 overflow-hidden bg-white border-gray-100 flex flex-col shrink-0">
              <div className="p-4 md:p-5 border-b border-gray-50">
                <h2 className="font-body text-sm font-bold text-gray-900 uppercase tracking-[0.2em]">Desk Updates</h2>
              </div>
              <div className="divide-y divide-gray-50 h-auto">
                 {TRADING_NOTIFICATIONS.map(note => (
                    <NotificationItem key={note.id} item={note} />
                 ))}
              </div>
           </Card>

           {/* Internal Status Banner - Compacted */}
           <div className="relative rounded-2xl overflow-hidden h-[120px] md:h-[140px] p-6 flex flex-col justify-end group cursor-default flex-shrink-0">
              <div className="absolute inset-0 bg-gray-900">
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>
              <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="text-emerald-400" size={18} />
                      <span className="inline-block px-2 py-0.5 bg-emerald-500/20 backdrop-blur-md rounded-md text-[10px] font-bold text-emerald-400 uppercase tracking-widest border border-emerald-500/20">Operational</span>
                  </div>
                  <h3 className="font-heading text-xl text-white">Systems Nominal</h3>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
