import { useState, useEffect } from 'react';
import cardsData from '../data/cards.json';

const STORAGE_KEY = 'zutomayo_deck_draft';

export function useDeckBuilder() {
  // deckItems is an object mapping cardId to count
  const [deckItems, setDeckItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deckItems));
  }, [deckItems]);

  const addCard = (cardId) => {
    setDeckItems(prev => ({
      ...prev,
      [cardId]: (prev[cardId] || 0) + 1
    }));
  };

  const removeCard = (cardId) => {
    setDeckItems(prev => {
      const current = prev[cardId] || 0;
      if (current <= 1) {
        const newItems = { ...prev };
        delete newItems[cardId];
        return newItems;
      }
      return {
        ...prev,
        [cardId]: current - 1
      };
    });
  };

  const getCount = (cardId) => deckItems[cardId] || 0;

  const totalCount = Object.values(deckItems).reduce((sum, count) => sum + count, 0);

  // Array of { card, count } for the drawer
  const deckCardsList = Object.entries(deckItems)
    .map(([id, count]) => {
      const card = cardsData.find(c => c.id === id);
      return { card, count };
    })
    .filter(item => item.card);

  return {
    deckItems,
    addCard,
    removeCard,
    getCount,
    totalCount,
    deckCardsList
  };
}
