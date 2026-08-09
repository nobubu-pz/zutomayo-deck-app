import React, { useState } from 'react';
import { useCards } from '../hooks/useCards';
import { useCollectionStorage } from '../hooks/useCollectionStorage';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { FilterPanel } from '../components/ui/FilterPanel';
import { BasicFilterBar } from '../components/ui/BasicFilterBar';
import { Search, Filter, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';

export function Collection() {
  const { 
    cards, 
    searchQuery, setSearchQuery,
    attributeFilter, setAttributeFilter, uniqueAttributes,
    rarityFilter, setRarityFilter, uniqueRarities,
    typeFilter, setTypeFilter, uniqueTypes,
    seasonFilter, setSeasonFilter, uniqueSeasons,
    nightMin, setNightMin,
    nightMax, setNightMax,
    dayMin, setDayMin,
    dayMax, setDayMax,
    sendToPowerFilter, setSendToPowerFilter,
  } = useCards();
  
  const { updateCount, getCount, collection } = useCollectionStorage();
  const [selectedCard, setSelectedCard] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showOwnedOnly, setShowOwnedOnly] = useState(false);

  // フィルターがデフォルト以外に設定されているかどうかのチェック
  const hasDetailedFilters = rarityFilter.length > 0 || seasonFilter.length > 0 || nightMin !== '' || nightMax !== '' || dayMin !== '' || dayMax !== '' || sendToPowerFilter.length > 0;
  const hasAnyFilter = searchQuery !== '' || attributeFilter.length > 0 || typeFilter.length > 0 || hasDetailedFilters;

  const displayedCards = showOwnedOnly ? cards.filter(c => getCount(c.uid) > 0) : cards;

  const handleNext = () => {
    if (!selectedCard) return;
    const currentIndex = displayedCards.findIndex(c => c.uid === selectedCard.uid);
    if (currentIndex < displayedCards.length - 1) setSelectedCard(displayedCards[currentIndex + 1]);
  };

  const handlePrev = () => {
    if (!selectedCard) return;
    const currentIndex = displayedCards.findIndex(c => c.uid === selectedCard.uid);
    if (currentIndex > 0) setSelectedCard(displayedCards[currentIndex - 1]);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header Action Bar */}
        <div className="flex justify-end p-3 z-20 absolute top-0 right-0 w-full pointer-events-none gap-2">
          <button 
            onClick={() => setShowOwnedOnly(!showOwnedOnly)}
            className={`pointer-events-auto flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-full h-10 px-4 mt-2 text-sm font-bold transition-all duration-300 ${isSearchOpen ? 'opacity-0 scale-90 invisible absolute right-16' : 'opacity-100 scale-100 visible'} ${showOwnedOnly ? 'text-white bg-zutomayo-accent/50 border-zutomayo-accent' : 'text-zutomayo-light hover:text-white hover:border-zutomayo-accent hover:bg-black/80'}`}
            title="所持カードのみ表示"
          >
            {showOwnedOnly ? '所持カードのみ' : 'すべて表示'}
          </button>

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
          nightMin={nightMin} setNightMin={setNightMin}
          nightMax={nightMax} setNightMax={setNightMax}
          dayMin={dayMin} setDayMin={setDayMin}
          dayMax={dayMax} setDayMax={setDayMax}
          sendToPowerFilter={sendToPowerFilter} setSendToPowerFilter={setSendToPowerFilter}
        />

        {/* Card Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayedCards.map(card => {
              const count = getCount(card.uid);
              return (
                <div key={card.id} className="relative group">
                  <Card 
                    card={card} 
                    onClick={() => setSelectedCard(card)}
                    className={count === 0 ? "grayscale opacity-60" : ""}
                  />
                  
                  {/* Plus/Minus Buttons */}
                  <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 z-10">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateCount(card.uid, -1);
                      }}
                      className="bg-black/60 backdrop-blur-md hover:bg-red-500/80 text-white/80 hover:text-white w-7 h-7 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center border border-white/10 hover:border-red-400/50 transition-all disabled:opacity-50 disabled:hover:bg-black/60"
                      title="枚数を減らす"
                      disabled={count === 0}
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateCount(card.uid, 1);
                      }}
                      className="bg-black/60 backdrop-blur-md hover:bg-zutomayo-accent text-white/80 hover:text-white w-7 h-7 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center border border-white/10 hover:border-zutomayo-accent/50 transition-all"
                      title="枚数を増やす"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>

                  {/* Collection Count Indicator */}
                  {count > 0 && (
                    <div className="absolute top-2 left-2 bg-black/80 text-zutomayo-light text-xs font-bold px-2 py-1 rounded-full border border-zutomayo-accent/50 z-10">
                      x{count}
                    </div>
                  )}
                </div>
              );
            })}
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
          <div className="rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
            <img 
              src={selectedCard.imagePath} 
              alt={selectedCard.name} 
              className="w-auto h-auto max-w-full max-h-[90vh]"
            />
            {/* Overlay Count on Modal too for convenience */}
            {getCount(selectedCard.uid) > 0 && (
              <div className="absolute top-4 left-4 bg-black/80 text-white text-lg font-bold px-4 py-2 rounded-full border border-zutomayo-accent/50 z-10 shadow-lg backdrop-blur-sm">
                所持枚数: {getCount(selectedCard.uid)}枚
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
