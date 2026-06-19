import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Card({ card, onClick, className }) {
  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
        "hover:scale-105 hover:shadow-[0_0_15px_rgba(123,94,167,0.5)]",
        "border border-zutomayo-border group",
        className
      )}
      onClick={() => onClick?.(card)}
    >
      {/* Lazy loading is critical here due to 440+ images */}
      <img 
        src={card.imagePath} 
        alt={card.name} 
        loading="lazy"
        className="w-full h-auto object-cover block"
      />
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <p className="text-white font-bold text-sm truncate">{card.name}</p>
        <p className="text-zutomayo-light text-xs opacity-80">{card.attribute}</p>
      </div>
    </div>
  );
}
