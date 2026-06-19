import React, { useState, useMemo } from 'react';
import { SearchBar } from '../components/features/SearchBar';
import { CardGrid } from '../components/features/CardGrid';
import { Modal } from '../components/ui/Modal';
import cardsData from '../data/cards.json';

export function CardGallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedAttribute, setSelectedAttribute] = useState('all');
  const [selectedCard, setSelectedCard] = useState(null);

  const filteredCards = useMemo(() => {
    return cardsData.filter(card => {
      const matchSearch = card.name.includes(searchQuery) || card.effect.includes(searchQuery);
      const matchSeason = selectedSeason === 'all' || card.season.toString() === selectedSeason;
      const matchAttribute = selectedAttribute === 'all' || card.attribute === selectedAttribute;
      return matchSearch && matchSeason && matchAttribute;
    });
  }, [searchQuery, selectedSeason, selectedAttribute]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-glow">カード一覧</h2>
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
        selectedAttribute={selectedAttribute}
        setSelectedAttribute={setSelectedAttribute}
      />
      <div className="mb-4 text-sm text-gray-400">全 {filteredCards.length} 枚</div>
      
      {/* ギャラリーモード：画像クリックでonClick発火 */}
      <CardGrid 
        cards={filteredCards} 
        onCardClick={(card) => setSelectedCard(card)}
        mode="gallery"
      />

      {/* ギャラリー用のモーダル（テキスト非表示、画像拡大のみ） */}
      <Modal 
        isOpen={!!selectedCard} 
        onClose={() => setSelectedCard(null)}
        title={selectedCard?.name || ''}
      >
        {selectedCard && (
          <div className="flex justify-center p-4">
            <img 
              src={selectedCard.imageUrl} 
              alt={selectedCard.name}
              className="w-full max-w-md rounded-xl shadow-[0_0_30px_rgba(123,94,167,0.3)] border border-zutomayo-border"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
