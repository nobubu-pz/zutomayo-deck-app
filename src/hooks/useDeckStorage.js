import { useState, useEffect } from 'react';

const DECK_STORAGE_KEY = 'zutomayo_decks';

export function useDeckStorage() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const storedDecks = localStorage.getItem(DECK_STORAGE_KEY);
    if (storedDecks) {
      try {
        setDecks(JSON.parse(storedDecks));
      } catch (e) {
        console.error('Failed to parse decks from local storage', e);
      }
    }
  }, []);

  const saveDeck = (deck) => {
    setDecks(prevDecks => {
      const existingIndex = prevDecks.findIndex(d => d.id === deck.id);
      let newDecks;
      if (existingIndex >= 0) {
        // Update existing deck
        newDecks = [...prevDecks];
        newDecks[existingIndex] = { ...deck, updatedAt: new Date().toISOString() };
      } else {
        // Create new deck
        newDecks = [...prevDecks, { 
          ...deck, 
          id: Date.now().toString(), 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }];
      }
      localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(newDecks));
      return newDecks;
    });
  };

  const deleteDeck = (deckId) => {
    setDecks(prevDecks => {
      const newDecks = prevDecks.filter(d => d.id !== deckId);
      localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(newDecks));
      return newDecks;
    });
  };

  const getDeck = (deckId) => {
    return decks.find(d => d.id === deckId);
  };

  return {
    decks,
    saveDeck,
    deleteDeck,
    getDeck
  };
}
