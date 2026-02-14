import React, { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Settings2, ArrowDown, ArrowUp, Zap, Shield, Cpu, Activity, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DroneIcon } from '@/app/components/ui/DroneIcons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const OrderBookRow = ({ price, amount, total, type }: { price: string, amount: string, total: string, type: 'ask' | 'bid' }) => (
  <div className="grid grid-cols-3 text-xs py-1.5 px-3 hover:bg-gray-50 cursor-pointer relative group lining-nums transition-colors rounded-md">
    <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
    <span className={`relative z-10 font-bold ${type === 'ask' ? 'text-rose-500' : 'text-emerald-500'}`}>{price}</span>
    <span className="text-right relative z-10 text-gray-500 font-medium group-hover:text-gray-900">{amount}</span>
    <span className="text-right relative z-10 text-gray-300 font-medium group-hover:text-gray-500">{total}</span>
  </div>
);

export const TradeView = () => {
  const [btcPrice, setBtcPrice] = useState<number>(85000);
  const [priceChange, setPriceChange] = useState<number>(2.45);
  const [chartData, setChartData] = useState<any[]>([]);

  // Fallback data function
  const getFallbackData = () => {
      return Array.from({ length: 60 }, (_, i) => ({
          time: `${i}:00`,
          price: 85000 + Math.random() * 800 + Math.sin(i / 3) * 400
      }));
  };

  // Fetch Real Data
  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true');
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            
            const current = data.market_data.current_price.usd;
            const change = data.market_data.price_change_percentage_24h;
            
            setBtcPrice(current);
            setPriceChange(change);

            const prices = data.market_data.sparkline_7d.price.slice(-60); 
            const formatted = prices.map((p: number, i: number) => ({
                time: `${i}m`,
                price: p
            }));
            setChartData(formatted);

        } catch (e) {
            console.log("Using fallback data for TradeView", e);
            // Only use fallback if we don't have data yet
            setChartData(prev => prev.length > 0 ? prev : getFallbackData());
        }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="h-full w-full bg-white p-4 md:p-8 flex flex-col lg:flex-row gap-6 overflow-y-auto md:overflow-hidden font-body [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
       {/* Main Chart Area - Visible on Mobile now */}
       <div className="flex flex-col flex-1 space-y-6 lg:h-full min-h-0">
          <Card className="flex-1 flex flex-col p-4 md:p-6 bg-white border-gray-100 shadow-sm min-h-[350px] md:min-h-0">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-lg">₿</div>
                    <div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="font-heading text-xl md:text-2xl font-medium text-gray-900 leading-none">BTC/USD</h3>
                            <span className={`font-bold text-xs px-1.5 py-0.5 rounded-md ${priceChange >= 0 ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
                                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-1">
                    {['1H', '4H', '1D'].map(tf => (
                        <button key={tf} className="px-2 py-1 md:px-2.5 rounded-md text-[10px] md:text-xs font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                            {tf}
                        </button>
                    ))}
                </div>
            </div>
            
        <div className="flex-1 w-full relative min-h-[200px]">
            {chartData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={200}>
                    <AreaChart data={chartData}>
                        <defs>
                        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.1}/>
                            <stop offset="100%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="time" hide dy={10} />
                        <YAxis 
                            domain={['auto', 'auto']} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 600}} 
                            tickFormatter={(val) => `$${val.toLocaleString()}`}
                            dx={-10}
                            width={60}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'none', backgroundColor: 'rgba(255,255,255,0.9)', fontWeight: 'bold', fontSize: '12px' }}
                            cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '4 4' }}
                            formatter={(val: number) => [`$${val.toLocaleString()}`, 'Price']}
                        />
                        <ReferenceLine 
                            y={btcPrice * 1.05} 
                            stroke="#F43F5E" 
                            strokeDasharray="4 4" 
                            label={{ position: 'right', value: 'Resist', fill: '#F43F5E', fontSize: 9, fontWeight: 700 }} 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#10B981" 
                            strokeWidth={2} 
                            fill="url(#chartFill)" 
                            isAnimationActive={true}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
            </div>
          </Card>

          <div className="h-auto md:h-[240px] grid grid-cols-1 md:grid-cols-2 gap-6 flex-shrink-0">
             <Card className="p-0 overflow-hidden flex flex-col bg-white border-gray-100 shadow-sm h-[240px]">
                <div className="p-4 border-b border-gray-50 bg-white flex justify-between items-center">
                    <h3 className="font-heading text-sm font-bold text-gray-900">Order Book</h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Spread: 0.2</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-0.5 [&::-webkit-scrollbar]:hidden">
                   {/* Asks (Sell Orders) */}
                   {[3,2,1].map(i => (
                       <OrderBookRow key={`ask-${i}`} price={fmt(btcPrice + (i * 15))} amount={(Math.random()).toFixed(2)} total={(Math.random() * 5).toFixed(2)} type="ask" />
                   ))}
                   
                   <div className="py-2 my-1 flex items-center justify-center gap-2 border-y border-dashed border-gray-100 bg-gray-50/30">
                       <span className="text-base font-sans font-thin text-gray-900 lining-nums tracking-tight">{fmt(btcPrice)}</span>
                       {priceChange >= 0 ? <ArrowUp size={12} className="text-emerald-500" /> : <ArrowDown size={12} className="text-rose-500" />}
                   </div>
                   
                   {/* Bids (Buy Orders) */}
                   {[1,2,3].map(i => (
                       <OrderBookRow key={`bid-${i}`} price={fmt(btcPrice - (i * 15))} amount={(Math.random() * 2).toFixed(2)} total={(Math.random() * 10).toFixed(2)} type="bid" />
                   ))}
                </div>
             </Card>

             <Card className="p-0 overflow-hidden flex flex-col bg-white border-gray-100 shadow-sm h-[240px] hidden md:flex">
                <div className="p-4 border-b border-gray-50 bg-white">
                    <h3 className="font-heading text-sm font-bold text-gray-900">Recent Trades</h3>
                </div>
                <div className="flex-1 p-2 space-y-1 text-xs lining-nums overflow-y-auto [&::-webkit-scrollbar]:hidden">
                   {[1,2,3,4,5].map((i) => (
                       <div key={i} className="flex justify-between py-1.5 px-3 rounded-md hover:bg-gray-50 transition-colors group cursor-pointer">
                           <span className={`font-bold ${i % 2 === 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {fmt(btcPrice + (Math.random() * 50 - 25))}
                           </span>
                           <span className="font-medium text-gray-600">{(Math.random() * 0.5).toFixed(4)}</span>
                           <span className="text-gray-400 font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', second:'2-digit' })}</span>
                       </div>
                   ))}
                </div>
             </Card>
          </div>
       </div>

       {/* Execution Panel - Demo Style */}
       <div className="w-full lg:w-[320px] flex-shrink-0 lg:h-full">
          <Card className="h-auto lg:h-full flex flex-col p-6 bg-white border-gray-100 shadow-sm relative overflow-hidden">
             <header className="mb-6 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">System Active</span>
                </div>
                <h2 className="font-heading text-2xl font-medium text-gray-900">Execution</h2>
             </header>

             {/* Demo Parameters Visualization */}
             <div className="space-y-4 flex-1 relative z-10 mb-6 lg:mb-0">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Algo Engine</p>
                    <p className="text-sm font-bold text-gray-900">SuperNova v4.2</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Risk Guard</p>
                    <p className="text-sm font-bold text-gray-900">Conservative (Max 2%)</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Latency</p>
                    <p className="text-sm font-bold text-gray-900">~12ms (Ultra Low)</p>
                </div>

                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Smart Routing</span>
                        <span className="text-xs font-bold text-emerald-600">Optimized</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 w-3/4 rounded-full" />
                    </div>
                </div>
             </div>
             
             {/* Demo Action Button */}
             <Button 
                className="w-full py-6 text-base rounded-xl mt-auto bg-gray-900 text-white shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all group relative overflow-hidden border border-gray-800"
                disabled
             >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                    <Lock size={16} className="text-gray-400" />
                    <span>Authorize Terminal</span>
                </span>
             </Button>
          </Card>
       </div>
    </div>
  );
};
