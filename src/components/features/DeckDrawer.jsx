import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn, Button } from '../ui/Button';

export function DeckDrawer({ deckCardsList, totalCount, onRemove }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-y-0" : "translate-y-[calc(100%-48px)]"
      )}
    >
      {/* Toggle Bar */}
      <div 
        className="h-12 bg-zutomayo-darker/95 backdrop-blur-md border-t border-zutomayo-border flex items-center justify-between px-4 cursor-pointer hover:bg-zutomayo-darker transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-bold">現在のデッキ</span>
          <span className="bg-zutomayo-accent px-2 py-0.5 rounded-full text-xs font-bold text-white">
            {totalCount} 枚
          </span>
        </div>
        <div className="text-gray-400">
          {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </div>
      </div>

      {/* Drawer Content */}
      <div className="h-48 bg-zutomayo-darker/95 backdrop-blur-md border-t border-zutomayo-border/50 p-4">
        {totalCount === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            カードを選択してデッキに追加してください
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto h-full pb-2 scrollbar-thin scrollbar-thumb-zutomayo-accent scrollbar-track-transparent">
            {deckCardsList.map(({ card, count }) => (
              <div key={card.id} className="relative flex-shrink-0 h-full group">
                <img 
                  src={card.imageUrl} 
                  alt={card.name} 
                  className="h-full w-auto object-cover rounded-md border border-zutomayo-border"
                />
                <div className="absolute top-1 right-1 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded border border-zutomayo-border">
                  x{count}
                </div>
                <button 
                  onClick={() => onRemove(card.id)}
                  className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md text-white font-bold text-sm"
                >
                  減らす
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
