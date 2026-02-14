import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ className, hoverEffect, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white/80 backdrop-blur-md rounded-[2rem] border border-gray-100 overflow-hidden",
        hoverEffect && "transition-all duration-500 hover:border-gray-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn("px-8 py-6 flex justify-between items-center bg-transparent", className)}>
      <div>
        <h3 className="font-heading font-medium text-gray-900 text-2xl tracking-tight">{title}</h3>
        {subtitle && <p className="font-body text-xs font-bold text-gray-400 uppercase tracking-widest mt-1.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
