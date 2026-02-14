import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DashboardView } from "@/app/components/platform/DashboardView";
import { TradeView } from "@/app/components/platform/TradeView";
import { BacktestView } from "@/app/components/platform/BacktestView";
import { LayoutDashboard, Activity, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlatformSection() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "trading" | "backtest">("trading");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "trading", label: "Pro Trading", icon: Activity },
    { id: "backtest", label: "AI Backtesting", icon: BarChart2 },
  ];

  const features = [
    {
      title: "SuperNova AI Engine",
      description: "Next-generation machine learning analyzes millions of data points per second, predicting market movements with 87% accuracy across 50+ crypto pairs—our exclusive edge for alpha generation"
    },
    {
      title: "Real-Time Risk Shield",
      description: "Dynamic position sizing and stop-loss automation adjust to volatility in milliseconds, capping drawdowns at 2% while maximizing Sharpe ratios above 2.5"
    },
    {
      title: "Multi-Strategy Orchestrator",
      description: "Seamlessly blends arbitrage, momentum, mean-reversion, and sentiment analysis from on-chain data, social signals, and VARA-compliant feeds"
    }
  ];

  return (
    <section id="platform" className="py-16 md:py-24 bg-gray-50 border-t border-gray-100 relative overflow-visible">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gray-200/30 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 w-full relative z-10">
        
        {/* Header Section (Text Only) */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="font-heading text-3xl md:text-6xl font-bold text-gray-900 uppercase tracking-tighter mb-4">
            GDtrade Platform
          </h2>
          <p className="font-body text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            GDtrade's in-house trading platform revolutionizes digital asset management <br className="hidden md:block" /> with proprietary AI-driven technology.
          </p>
        </div>

        {/* Tab Navigation - Sticky on Mobile */}
        <div className="sticky top-[80px] md:static z-30 flex justify-center mb-8 md:mb-12 pointer-events-none">
           <div className="pointer-events-auto p-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/50 md:bg-transparent md:backdrop-blur-none md:border-none md:p-0 transition-all duration-300">
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      title={tab.label}
                      className={cn(
                        "flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full transition-all duration-300 relative group shrink-0 backdrop-blur-sm",
                        isActive 
                          ? "text-white bg-gray-900 shadow-[0_10px_30px_-10px_rgba(0,0,255,0.3)] hover:shadow-[0_10px_40px_-10px_rgba(0,0,255,0.5)] hover:bg-gray-800 transform scale-105 md:scale-110 z-10" 
                          : "bg-white/40 md:bg-white/30 text-gray-500 md:text-gray-900 border border-white/50 hover:bg-white/60 hover:text-gray-900 shadow-[-1px_0_2px_rgba(50,50,255,0.1),1px_0_2px_rgba(0,255,255,0.1)] hover:shadow-[-2px_0_5px_rgba(50,50,255,0.2),2px_0_5px_rgba(0,255,255,0.2)] hover:scale-105"
                      )}
                    >
                      <span className="relative z-10">
                        <tab.icon size={20} className="md:w-7 md:h-7" />
                      </span>
                    </button>
                  );
                })}
              </div>
           </div>
        </div>

        {/* Main Interface Container */}
        <div className="relative w-full min-h-[600px] md:h-[650px] mb-12 md:mb-16 max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full h-full bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                    <div className="flex-1 w-full relative">
                       {activeTab === "dashboard" && <DashboardView />}
                       {activeTab === "trading" && <TradeView />}
                       {activeTab === "backtest" && <BacktestView />}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 border-t border-gray-200 pt-12 md:pt-16 relative z-10 bg-gray-50">
           {features.map((feature, idx) => (
             <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-3 md:space-y-4"
             >
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" />
                <h3 className="font-heading text-xl md:text-2xl font-bold text-gray-900 uppercase">{feature.title}</h3>
                <p className="font-body text-gray-600 text-base md:text-lg leading-relaxed">{feature.description}</p>
             </motion.div>
           ))}
        </div>

      </div>
    </section>
  );
}
