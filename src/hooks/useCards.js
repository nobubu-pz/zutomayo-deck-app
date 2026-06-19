import { useState, useEffect, useMemo } from 'react';
import cardsData from '../data/cards.json';

export function useCards() {
  const [cards, setCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [attributeFilter, setAttributeFilter] = useState('All');

  useEffect(() => {
    // In a real scenario, this might be a fetch.
    // For now, we load from the local JSON.
    setCards(cardsData);
  }, []);

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          card.effect.toLowerCase().includes(searchQuery.toLowerCase());
      const matchAttribute = attributeFilter === 'All' || card.attribute === attributeFilter;
      
      return matchSearch && matchAttribute;
    });
  }, [cards, searchQuery, attributeFilter]);

  return {
    cards: filteredCards,
    searchQuery,
    setSearchQuery,
    attributeFilter,
    setAttributeFilter,
    allCards: cards
  };
}
