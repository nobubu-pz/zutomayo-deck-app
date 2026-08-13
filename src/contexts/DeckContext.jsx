import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const DeckContext = createContext();

export function useDeck() {
  return useContext(DeckContext);
}

const DECK_STORAGE_KEY = 'zutomayo_decks';

export function DeckProvider({ children }) {
  const [decks, setDecks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadLocal = () => {
      const stored = localStorage.getItem(DECK_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse decks from local storage', e);
        }
      }
      return [];
    };

    const localDecks = loadLocal();
    setDecks(localDecks);

    if (user) {
      syncWithDatabase(localDecks);
    }
  }, [user]);

  const syncWithDatabase = async (localDecks) => {
    try {
      const { data: dbDecksData, error } = await supabase
        .from('user_decks')
        .select('*');
      
      if (error) throw error;

      // Convert DB decks to local format
      const dbDecks = dbDecksData.map(d => ({
        id: d.id,
        name: d.name,
        cards: d.cards,
        createdAt: d.created_at,
        updatedAt: d.updated_at
      }));

      const mergedDecksMap = new Map();

      // Put DB decks first
      dbDecks.forEach(d => mergedDecksMap.set(d.id, d));

      // Check local decks for un-synced ones
      const decksToUpload = [];
      localDecks.forEach(localDeck => {
        if (!mergedDecksMap.has(localDeck.id)) {
          mergedDecksMap.set(localDeck.id, localDeck);
          decksToUpload.push({
            id: localDeck.id,
            user_id: user.id,
            name: localDeck.name,
            cards: localDeck.cards,
            created_at: localDeck.createdAt,
            updated_at: localDeck.updatedAt
          });
        } else {
          // If local is newer than DB, we could upload it, but for simplicity
          // we assume DB is source of truth if it exists, unless we want to do complex conflict resolution.
          // For now, if it's in DB, we keep DB version.
        }
      });

      const mergedDecks = Array.from(mergedDecksMap.values());
      
      // Sort by updatedAt descending
      mergedDecks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      setDecks(mergedDecks);
      localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(mergedDecks));

      if (decksToUpload.length > 0) {
        const { error: upsertError } = await supabase
          .from('user_decks')
          .upsert(decksToUpload, { onConflict: 'id' });
        
        if (upsertError) throw upsertError;
      }
    } catch (e) {
      console.error('Error syncing decks with database:', e);
    }
  };

  const saveDeck = async (deck) => {
    let finalDecks;
    const now = new Date().toISOString();
    
    setDecks(prevDecks => {
      const existingIndex = prevDecks.findIndex(d => d.id === deck.id);
      let newDecks;
      if (existingIndex >= 0) {
        newDecks = [...prevDecks];
        newDecks[existingIndex] = { ...deck, updatedAt: now };
      } else {
        newDecks = [...prevDecks, { 
          ...deck, 
          id: deck.id || Date.now().toString(), 
          createdAt: now,
          updatedAt: now
        }];
      }
      localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(newDecks));
      finalDecks = newDecks;
      return newDecks;
    });

    if (user) {
      // Find the saved deck to upload
      const savedDeck = finalDecks.find(d => d.id === deck.id) || finalDecks[finalDecks.length - 1];
      try {
        await supabase.from('user_decks').upsert({
          id: savedDeck.id,
          user_id: user.id,
          name: savedDeck.name,
          cards: savedDeck.cards,
          created_at: savedDeck.createdAt,
          updated_at: savedDeck.updatedAt
        }, { onConflict: 'id' });
      } catch (e) {
        console.error('Failed to save deck to DB', e);
      }
    }
  };

  const deleteDeck = async (deckId) => {
    setDecks(prevDecks => {
      const newDecks = prevDecks.filter(d => d.id !== deckId);
      localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(newDecks));
      return newDecks;
    });

    if (user) {
      try {
        await supabase.from('user_decks').delete().eq('id', deckId);
      } catch (e) {
        console.error('Failed to delete deck from DB', e);
      }
    }
  };

  const getDeck = (deckId) => {
    return decks.find(d => d.id === deckId);
  };

  return (
    <DeckContext.Provider value={{ decks, saveDeck, deleteDeck, getDeck }}>
      {children}
    </DeckContext.Provider>
  );
}
