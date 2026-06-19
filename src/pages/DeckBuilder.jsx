import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCards } from '../hooks/useCards';
import { useDeckStorage } from '../hooks/useDeckStorage';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { DeckBuilderSidebar } from '../components/DeckBuilderSidebar';
import { Search, ArrowLeft, X, Plus, Minus } from 'lucide-react';

export function DeckBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const deckId = searchParams.get('id');

  const { cards, searchQuery, setSearchQuery } = useCards();
  const { saveDeck, getDeck } = useDeckStorage();
  
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentDeck, setCurrentDeck] = useState({ cards: [], name: 'New Deck' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  useEffect(() => {
    if (deckId) {
      const existing = getDeck(deckId);
      if (existing) {
        setCurrentDeck(existing);
      }
    }
  }, [deckId, getDeck]);

  const handleAddToDeck = (card) => {
    setCurrentDeck(prev => ({
      ...prev,
      cards: [...prev.cards, card]
    }));
  };

  const handleRemoveFromDeck = (card) => {
    setCurrentDeck(prev => {
      const newCards = [...prev.cards];
      // 後ろから検索して最初に見つかった同じカードを削除
      const index = newCards.findLastIndex(c => c.id === card.id);
      if (index !== -1) {
        newCards.splice(index, 1);
      }
      return { ...prev, cards: newCards };
    });
  };

  const handleSaveDeck = (deckToSave) => {
    saveDeck(deckToSave);
    alert('デッキを保存しました！');
    navigate('/decks'); // 編集後は一覧に戻る
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Search Bar & Header */}
        <div className="p-4 border-b border-white/10 glass-panel border-x-0 rounded-none z-10 flex gap-4 items-center">
          <button 
            onClick={() => navigate('/decks')}
            className="p-2 text-zutomayo-light hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="relative flex-1 max-w-md">
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 lg:pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {cards.map(card => (
              <div key={card.id} className="relative group">
                <Card 
                  card={card} 
                  onClick={() => setSelectedCard(card)} 
                />
                
                {/* Plus/Minus Buttons */}
                <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromDeck(card);
                    }}
                    className="bg-black/60 backdrop-blur-md hover:bg-red-500/80 text-white/80 hover:text-white w-7 h-7 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center border border-white/10 hover:border-red-400/50 transition-all"
                    title="デッキから外す"
                  >
                    <Minus size={14} strokeWidth={3} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToDeck(card);
                    }}
                    className="bg-black/60 backdrop-blur-md hover:bg-zutomayo-accent text-white/80 hover:text-white w-7 h-7 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center border border-white/10 hover:border-zutomayo-accent/50 transition-all"
                    title="デッキに追加"
                  >
                    <Plus size={14} strokeWidth={3} />
                  </button>
                </div>

                {/* Deck Count Indicator */}
                {currentDeck.cards.filter(c => c.id === card.id).length > 0 && (
                  <div className="absolute top-2 left-2 bg-black/80 text-zutomayo-light text-xs font-bold px-2 py-1 rounded-full border border-zutomayo-accent/50 z-10">
                    x{currentDeck.cards.filter(c => c.id === card.id).length}
                  </div>
                )}
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

      {/* Mobile Floating Button */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 z-30">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="w-full py-3 bg-gradient-to-r from-zutomayo-accent to-zutomayo-secondary text-white rounded-xl shadow-[0_4px_20px_rgba(123,94,167,0.6)] font-bold flex justify-between px-6 items-center"
        >
          <span>デッキを確認・保存</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{currentDeck.cards.length} 枚</span>
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-30 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Right Sidebar - Deck Builder */}
      <div className={`
        fixed bottom-0 left-0 right-0 h-[40vh] z-40 
        lg:static lg:h-auto lg:block lg:w-80 lg:border-l border-white/10 lg:z-20 lg:shadow-2xl 
        shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-transform duration-300 rounded-t-2xl lg:rounded-none overflow-hidden
        ${isSidebarOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
      `}>
        <div className="w-full h-full bg-zutomayo-dark lg:bg-transparent relative">
          {/* Mobile drag handle indicator */}
          <div className="lg:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full z-50"></div>
          
          <DeckBuilderSidebar 
            deck={currentDeck} 
            setDeck={setCurrentDeck} 
            onSave={(deck) => {
              setIsSidebarOpen(false);
              handleSaveDeck(deck);
            }} 
          />
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
