import React, { useState } from 'react';
import { useCards } from '../hooks/useCards';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Search } from 'lucide-react';

export function Home() {
  const { cards, searchQuery, setSearchQuery } = useCards();
  const [selectedCard, setSelectedCard] = useState(null);

  const handleNext = () => {
    if (!selectedCard) return;
    const currentIndex = cards.findIndex(c => c.id === selectedCard.id);
    if (currentIndex < cards.length - 1) setSelectedCard(cards[currentIndex + 1]);
  };

  const handlePrev = () => {
    if (!selectedCard) return;
    const currentIndex = cards.findIndex(c => c.id === selectedCard.id);
    if (currentIndex > 0) setSelectedCard(cards[currentIndex - 1]);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-white/10 glass-panel border-x-0 rounded-none z-10">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zutomayo-light/60" size={20} />
            <input 
              type="text" 
              placeholder="カード名や効果で検索..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-zutomayo-border rounded-full py-2 pl-10 pr-4 text-white outline-none focus:border-zutomayo-accent focus:ring-1 focus:ring-zutomayo-accent transition-all"
            />
          </div>
        </div>

        {/* Card Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {cards.map(card => (
              <div key={card.id} className="relative group">
                <Card 
                  card={card} 
                  onClick={() => setSelectedCard(card)} 
                />
              </div>
            ))}
            {cards.length === 0 && (
              <div className="col-span-full py-20 text-center text-zutomayo-light">
                条件に一致するカードが見つかりません。
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Details Modal */}
      <Modal 
        isOpen={!!selectedCard} 
        onClose={() => setSelectedCard(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      >
        {selectedCard && (
          <div className="rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <img 
              src={selectedCard.imagePath} 
              alt={selectedCard.name} 
              className="w-auto h-auto max-w-full max-h-[90vh]"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
