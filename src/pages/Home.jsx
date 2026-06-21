import React, { useState } from 'react';
import { useCards } from '../hooks/useCards';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { FilterPanel } from '../components/ui/FilterPanel';
import { BasicFilterBar } from '../components/ui/BasicFilterBar';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export function Home() {
  const { 
    cards, 
    searchQuery, setSearchQuery,
    attributeFilter, setAttributeFilter, uniqueAttributes,
    rarityFilter, setRarityFilter, uniqueRarities,
    typeFilter, setTypeFilter, uniqueTypes,
    seasonFilter, setSeasonFilter, uniqueSeasons,
  } = useCards();
  const [selectedCard, setSelectedCard] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 検索エリア全体の開閉

  // フィルターがデフォルト以外に設定されているかどうかのチェック
  const hasDetailedFilters = rarityFilter !== 'All' || seasonFilter !== 'All';
  const hasAnyFilter = searchQuery !== '' || attributeFilter !== 'All' || typeFilter !== 'All' || hasDetailedFilters;

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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header Action Bar */}
        <div className="flex justify-end p-3 z-20 absolute top-0 right-0 w-full pointer-events-none">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className={`pointer-events-auto flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-full h-10 px-3 mr-2 mt-2 text-zutomayo-light hover:text-white hover:border-zutomayo-accent hover:bg-black/80 transition-all duration-300 ${isSearchOpen ? 'opacity-0 scale-90 invisible' : 'opacity-100 scale-100 visible'}`}
            title="検索 / 絞り込みを開く"
          >
            <div className="flex items-center gap-1 relative">
              <Search size={18} />
              <ChevronDown size={16} />
              {hasAnyFilter && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-zutomayo-accent rounded-full border border-black shadow-[0_0_8px_rgba(255,255,255,0.5)]"></span>
              )}
            </div>
          </button>
        </div>

        {/* Search Bar Container */}
        <div className={`transition-all duration-300 ease-in-out origin-top z-10 ${isSearchOpen ? 'max-h-[500px] opacity-100 pb-2 pt-2' : 'max-h-0 opacity-0 overflow-hidden pt-0'}`}>
          <div className="px-4 border-b border-white/10 glass-panel border-x-0 rounded-none flex flex-col gap-3 pb-4 pt-4">
            <div className="relative flex-1 max-w-3xl mx-auto w-full flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zutomayo-light/60" size={20} />
                <input 
                  type="text" 
                  placeholder="カード名や曲名で検索..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-zutomayo-border rounded-full py-2 pl-10 pr-4 text-white outline-none focus:border-zutomayo-accent focus:ring-1 focus:ring-zutomayo-accent transition-all"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-2 rounded-full transition-colors relative flex items-center justify-center shrink-0 ${isFilterOpen || hasDetailedFilters ? 'bg-zutomayo-accent/20 text-zutomayo-accent' : 'text-zutomayo-light hover:text-white hover:bg-white/10'}`}
                title="詳細フィルターを開く"
              >
                <Filter size={20} />
                {hasDetailedFilters && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black shadow-[0_0_8px_rgba(239,68,68,1)]" />
                )}
              </button>
              
              <div className="w-px h-6 bg-white/20 mx-1 shrink-0"></div>
              
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-full transition-colors flex items-center justify-center shrink-0 text-zutomayo-light hover:text-white hover:bg-white/10"
                title="検索を閉じる"
              >
                <ChevronUp size={20} />
              </button>
            </div>
            
            {/* Basic Filters */}
            <div className="max-w-3xl mx-auto w-full">
              <BasicFilterBar 
                attributeFilter={attributeFilter} 
                setAttributeFilter={setAttributeFilter} 
                typeFilter={typeFilter} 
                setTypeFilter={setTypeFilter} 
              />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel 
          isOpen={isFilterOpen} 
          onClose={() => setIsFilterOpen(false)}
          rarityFilter={rarityFilter} setRarityFilter={setRarityFilter} uniqueRarities={uniqueRarities}
          seasonFilter={seasonFilter} setSeasonFilter={setSeasonFilter} uniqueSeasons={uniqueSeasons}
        />

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
