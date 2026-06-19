import React, { useState } from 'react';
import { cn } from '../ui/Button';
import { Plus, Minus } from 'lucide-react';

export function CardItem({ card, onClick, mode = 'gallery', count = 0, onAdd, onRemove }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isSelected = count > 0;

  const handleCardClick = (e) => {
    if (mode === 'builder') {
      onAdd && onAdd(card.id);
    } else {
      onClick && onClick(card);
    }
  };

  return (
    <div 
      className={cn(
        "group relative aspect-[63/88] rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
        "border-2",
        isSelected && mode === 'builder' 
          ? "border-zutomayo-accent shadow-[0_0_15px_rgba(123,94,167,0.4)] -translate-y-1" 
          : "border-transparent hover:border-zutomayo-border hover:-translate-y-1"
      )}
      onClick={handleCardClick}
    >
      {/* Loading Placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-zutomayo-darker animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-zutomayo-secondary border-t-transparent animate-spin" />
        </div>
      )}

      <img 
        src={card.imageUrl} 
        alt={card.name} 
        loading="lazy"
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setImageLoaded(true)}
      />

      {/* Hover Overlay for Gallery mode only */}
      {mode === 'gallery' && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 pointer-events-none">
          <p className="text-white font-bold text-sm truncate">{card.name}</p>
        </div>
      )}

      {/* Builder Mode Controls */}
      {mode === 'builder' && isSelected && (
        <div className="absolute inset-0 bg-black/20 pointer-events-none">
          <div 
            className="absolute bottom-2 right-2 flex items-center gap-1 bg-zutomayo-darker/90 backdrop-blur-md border border-zutomayo-accent rounded-full p-1 shadow-lg pointer-events-auto"
            onClick={(e) => e.stopPropagation()} // Prevent card click
          >
            <button 
              onClick={() => onRemove(card.id)}
              className="w-6 h-6 flex items-center justify-center rounded-full text-white bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all"
            >
              <Minus size={14} />
            </button>
            <span className="text-white font-bold text-sm min-w-[20px] text-center">
              {count}
            </span>
            <button 
              onClick={() => onAdd(card.id)}
              className="w-6 h-6 flex items-center justify-center rounded-full text-white bg-zutomayo-accent hover:bg-zutomayo-accent-hover active:scale-95 transition-all"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
