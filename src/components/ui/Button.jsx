import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-95 focus:outline-none";
  
  const variants = {
    primary: "bg-zutomayo-accent hover:bg-zutomayo-accent-hover text-white shadow-[0_0_10px_rgba(123,94,167,0.2)] hover:shadow-[0_0_15px_rgba(123,94,167,0.4)]",
    secondary: "bg-transparent border border-zutomayo-secondary text-zutomayo-secondary hover:bg-zutomayo-secondary/10 shadow-[0_0_8px_rgba(85,139,110,0.1)]",
    ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-gray-200"
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-5 py-2.5",
    lg: "text-lg px-8 py-3"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      {...props}
    >
      {children}
    </button>
  );
}
