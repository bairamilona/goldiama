import React from 'react';

export const Logo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#Eebb58" />
        <stop offset="40%" stopColor="#CF9626" />
        <stop offset="60%" stopColor="#F5D688" />
        <stop offset="100%" stopColor="#AA771C" />
      </linearGradient>
    </defs>
    
    {/* The butterfly shape */}
    <path 
      d="M30,25 C45,25 50,45 50,50 C50,55 45,75 30,75 M70,25 C55,25 50,45 50,50 C50,55 55,75 70,75 M25,50 H75" 
      stroke="url(#gold-grad)" 
      strokeWidth="3" 
      fill="none"
      strokeLinecap="round"
    />
    {/* Inner curves */}
    <path 
      d="M30,35 C40,35 45,45 45,50 C45,55 40,65 30,65 M70,35 C60,35 55,45 55,50 C55,55 60,65 70,65" 
      stroke="url(#gold-grad)" 
      strokeWidth="2" 
      fill="none" 
      strokeLinecap="round"
    />
  </svg>
);
