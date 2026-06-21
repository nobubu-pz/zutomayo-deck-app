import React, { useState, useEffect } from 'react';
import { Save, Trash2, X } from 'lucide-react';
import { PromptModal } from './ui/PromptModal';

export function DeckBuilderSidebar({ deck, setDeck, onSave, shakeTrigger }) {
  const MAX_CARDS = 20; // 20枚ぴったりにするルール

  const [isShaking, setIsShaking] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  useEffect(() => {
    if (shakeTrigger > 0) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 400); // アニメーション時間経過後に戻す
      return () => clearTimeout(timer);
    }
  }, [shakeTrigger]);

  const handleRemoveCard = (index) => {
    const newCards = [...deck.cards];
    newCards.splice(index, 1);
    setDeck({ ...deck, cards: newCards });
  };

  const openSavePrompt = () => {
    setIsPromptOpen(true);
  };

  const handleConfirmSave = (finalName) => {
    setIsPromptOpen(false);
    onSave({ ...deck, name: finalName });
  };

  return (
    <div className="w-full h-full glass-panel flex flex-col">
      <div className="px-3 py-2 border-b border-zutomayo-border flex justify-between items-center bg-black/20">
        <div className={`font-bold text-sm transition-all duration-200 ${deck.cards.length !== MAX_CARDS ? 'text-red-400' : 'text-green-400'} ${isShaking ? 'animate-shake' : ''}`}>
          {deck.cards.length} / {MAX_CARDS} 枚
        </div>
        <button 
          onClick={openSavePrompt}
          disabled={deck.cards.length === 0}
          className="flex items-center gap-1 bg-zutomayo-accent hover:bg-zutomayo-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-xs font-bold transition-all shadow-sm"
        >
          <Save size={14} /> 保存する
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {deck.cards.length === 0 ? (
          <div className="text-center text-zutomayo-light/50 mt-6 text-sm">
            デッキは空です
          </div>
        ) : (
          deck.cards.map((card, idx) => (
            <div key={`${card.id}-${idx}`} className="flex items-center gap-2 p-1.5 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
              <img src={card.imagePath} alt={card.name} className="w-8 h-10 object-cover rounded-sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">{card.name}</p>
              </div>
              <button 
                onClick={() => handleRemoveCard(idx)}
                className="text-red-400 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-400/20 rounded"
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>
      <div className="p-2 border-t border-zutomayo-border bg-black/20">
        <button 
          onClick={() => setDeck({ ...deck, cards: [] })}
          className="w-full flex justify-center items-center gap-1 py-1.5 text-red-400 hover:bg-red-400/10 border border-red-400/30 rounded transition-colors text-xs"
        >
          <Trash2 size={14} /> クリア
        </button>
      </div>

      <PromptModal
        isOpen={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
        onSave={handleConfirmSave}
        defaultValue={deck.name || 'ZUTOMAYO Deck'}
        title="デッキの保存"
        warningMsg={
          deck.cards.length !== MAX_CARDS
            ? `※注意: デッキが${MAX_CARDS}枚ではありません（現在${deck.cards.length}枚）。\n公式ルールでは使用できない「下書き」状態となります。`
            : null
        }
      />
    </div>
  );
}
