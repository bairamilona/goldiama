import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "hero";
  icon?: LucideIcon;
}

export function Button({ className, variant = "primary", size = "md", icon: Icon, children, ...props }: ButtonProps) {
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(50,50,255,0.3),0_0_10px_rgba(0,255,255,0.2)] border border-gray-800",
    secondary: "bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200",
    ghost: "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/50",
    outline: "border border-gray-200 bg-transparent text-gray-900 hover:bg-gray-50 hover:border-gray-300",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs tracking-wide",
    md: "h-11 px-6 text-sm tracking-wide",
    lg: "h-14 px-8 text-base tracking-wide",
    hero: "h-16 px-10 text-lg tracking-wide",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-body font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none gap-2.5",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
      {Icon && <Icon size={size === 'hero' ? 22 : 18} />}
    </button>
  );
}
