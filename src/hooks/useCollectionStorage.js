import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function useCollectionStorage() {
  const [collection, setCollection] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    // 1. Load local data first for fast render
    const loadLocal = () => {
      const stored = localStorage.getItem('zutomayo_collection');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse collection data', e);
        }
      }
      return {};
    };

    const localData = loadLocal();
    setCollection(localData);

    // 2. If user is logged in, sync with DB
    if (user) {
      syncWithDatabase(localData);
    }
  }, [user]);

  const syncWithDatabase = async (localData) => {
    try {
      // Get DB cards
      const { data, error } = await supabase
        .from('user_cards')
        .select('card_uid, count');
      
      if (error) throw error;

      const dbData = {};
      data.forEach(row => {
        dbData[row.card_uid] = row.count;
      });

      // Merge local and DB data (DB takes precedence, but if local has something DB doesn't, upload it)
      const merged = { ...localData };
      let hasChangesToUpload = false;
      const upsertPayload = [];

      for (const [uid, count] of Object.entries(dbData)) {
        merged[uid] = count;
      }

      for (const [uid, count] of Object.entries(localData)) {
        if (dbData[uid] === undefined) {
          hasChangesToUpload = true;
          upsertPayload.push({ user_id: user.id, card_uid: uid, count: count });
        }
      }

      setCollection(merged);
      localStorage.setItem('zutomayo_collection', JSON.stringify(merged));

      if (hasChangesToUpload && upsertPayload.length > 0) {
        const { error: upsertError } = await supabase
          .from('user_cards')
          .upsert(upsertPayload, { onConflict: 'user_id,card_uid' });
        
        if (upsertError) throw upsertError;
      }
    } catch (e) {
      console.error('Error syncing collection with database:', e);
    }
  };

  const updateCount = async (uid, delta) => {
    setCollection(prev => {
      const currentCount = prev[uid] || 0;
      const newCount = Math.max(0, currentCount + delta);
      
      const newCollection = { ...prev };
      if (newCount === 0) {
        delete newCollection[uid];
      } else {
        newCollection[uid] = newCount;
      }
      
      localStorage.setItem('zutomayo_collection', JSON.stringify(newCollection));
      
      // Update DB asynchronously if logged in
      if (user) {
        updateDatabase(uid, newCount);
      }

      return newCollection;
    });
  };

  const updateDatabase = async (uid, newCount) => {
    try {
      if (newCount === 0) {
        await supabase
          .from('user_cards')
          .delete()
          .eq('user_id', user.id)
          .eq('card_uid', uid);
      } else {
        await supabase
          .from('user_cards')
          .upsert({ user_id: user.id, card_uid: uid, count: newCount }, { onConflict: 'user_id,card_uid' });
      }
    } catch (e) {
      console.error('Error updating database:', e);
    }
  };

  const getCount = (uid) => {
    return collection[uid] || 0;
  };

  return {
    collection,
    updateCount,
    getCount
  };
}
