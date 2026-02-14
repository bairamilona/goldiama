import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = 'USD' | 'AED';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (usdPrice: number) => number;
  formatPrice: (usdPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Fixed exchange rate AED to USD (pegged currency)
const EXCHANGE_RATES = {
  USD: 1,
  AED: 3.67, // 1 USD = 3.67 AED
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD');

  const convertPrice = (usdPrice: number): number => {
    return usdPrice * EXCHANGE_RATES[currency];
  };

  const formatPrice = (usdPrice: number): string => {
    const converted = convertPrice(usdPrice);
    const symbol = currency === 'USD' ? '$' : 'د.إ';
    
    if (currency === 'AED') {
      return `${symbol}${converted.toFixed(2)}`;
    }
    
    return `${symbol}${converted.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
