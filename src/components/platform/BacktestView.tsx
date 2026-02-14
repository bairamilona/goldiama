import React from 'react';
import { Card, CardHeader } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, RotateCcw, Save, Sliders, Database, BrainCircuit, Zap } from 'lucide-react';
import { DroneIcon } from '@/app/components/ui/DroneIcons';

// Mock data for the chart
const backtestData = Array.from({ length: 50 }, (_, i) => ({
  date: `Day ${i + 1}`,
  value: 10000 + Math.random() * 2000 + (i * 150),
  benchmark: 10000 + (i * 80) + Math.random() * 500
}));

export const BacktestView = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-full w-full bg-white p-4 md:p-8 flex flex-col lg:flex-row gap-6 overflow-y-auto lg:overflow-hidden font-body">
      <Card className="w-full lg:w-72 flex-shrink-0 lg:h-full bg-white border-gray-100 p-6 flex flex-col shadow-sm">
        <CardHeader 
            title="Simulation" 
            subtitle="Parameters" 
            className="mb-6 px-0 border-none bg-transparent p-0" 
            action={<div className="p-1.5 bg-gray-50 rounded-full"><Sliders size={16} className="text-gray-400" /></div>}
        />
        
        <div className="space-y-4 flex-1">
          {/* Visual Demo Item 1 */}
          <div className="group p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Strategy</span>
            </div>
            <div>
                <p className="text-sm font-bold text-gray-900">Mean Reversion v4</p>
                <p className="text-[10px] font-medium text-emerald-600">AI Optimized</p>
            </div>
          </div>

          {/* Visual Demo Item 2 */}
          <div className="group p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Dataset</span>
            </div>
            <div>
                <p className="text-sm font-bold text-gray-900">BTC/USD (2020-25)</p>
                <p className="text-[10px] font-medium text-gray-500">Tick-level data</p>
            </div>
          </div>

          {/* Visual Demo Item 3 */}
          <div className="group p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
             <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Speed</span>
            </div>
            <div>
                <p className="text-sm font-bold text-gray-900">GPU Accelerated</p>
                <div className="mt-1.5 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[90%] rounded-full" />
                </div>
            </div>
          </div>
        </div>

        <div className="pt-6 space-y-3 mt-auto">
            <Button 
                className="w-full flex items-center gap-2 justify-center py-4 rounded-xl bg-gray-900 text-white shadow-lg shadow-gray-200 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 border border-gray-800"
            >
              <DroneIcon icon={Play} size={14} fill="currentColor" /> 
              <span className="text-sm font-bold uppercase tracking-widest">Re-Run Sim</span>
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold text-xs hover:bg-gray-50 hover:text-gray-900 transition-all uppercase tracking-wider">
                 <DroneIcon icon={Save} size={12} /> Export
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold text-xs hover:bg-gray-50 hover:text-gray-900 transition-all uppercase tracking-wider">
                 <DroneIcon icon={RotateCcw} size={12} /> Report
              </button>
            </div>
          </div>
      </Card>

      {/* Results Area */}
      <div className="flex-1 flex flex-col min-h-0 space-y-6">
         <Card className="flex-1 bg-white border-gray-100 p-8 flex flex-col min-h-0 shadow-sm min-h-[400px] lg:min-h-0">
            <div className="flex justify-between items-start mb-4 flex-shrink-0">
               <div>
                  <h2 className="font-heading text-2xl font-medium text-gray-900 mb-2">Performance</h2>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-900 ring-4 ring-gray-100"></div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Strategy</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300 ring-4 ring-gray-100"></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Benchmark</span>
                     </div>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-4xl font-sans font-thin text-gray-900 lining-nums tracking-tighter mb-0.5">+124.5%</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Return</p>
               </div>
            </div>
            
            <div className="flex-1 w-full min-h-[200px]">
               {mounted ? (
               <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={200}>
                  <LineChart data={backtestData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                     <XAxis dataKey="date" hide />
                     <YAxis 
                        orientation="right" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 600}} 
                        tickFormatter={(val) => `$${val/1000}k`}
                     />
                     <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', fontWeight: 'bold', fontSize: '12px' }}
                     />
                     <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#111111" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 4, strokeWidth: 0 }}
                     />
                     <Line 
                        type="monotone" 
                        dataKey="benchmark" 
                        stroke="#E5E7EB" 
                        strokeWidth={2} 
                        dot={false} 
                        strokeDasharray="4 4"
                     />
                  </LineChart>
               </ResponsiveContainer>
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Loading Chart...</div>
               )}
            </div>
         </Card>

         <div className="h-auto md:h-32 grid grid-cols-2 md:grid-cols-4 gap-4 flex-shrink-0">
            {[
                { label: "Sharpe Ratio", val: "2.45" },
                { label: "Max Drawdown", val: "-12.4%" },
                { label: "Win Rate", val: "64.2%" },
                { label: "Profit Factor", val: "1.85" }
            ].map((stat, i) => (
                <Card key={i} className="p-4 flex flex-col justify-center items-center text-center hover:scale-[1.02] transition-transform duration-300 cursor-default bg-white border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                    <p className="text-2xl font-sans font-thin text-gray-900 lining-nums tracking-tight">{stat.val}</p>
                </Card>
            ))}
         </div>
      </div>
    </div>
  );
};
