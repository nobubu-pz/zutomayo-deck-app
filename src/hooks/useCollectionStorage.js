import { useState, useEffect } from 'react';

export function useCollectionStorage() {
  const [collection, setCollection] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('zutomayo_collection');
    if (stored) {
      try {
        setCollection(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse collection data', e);
      }
    }
  }, []);

  const updateCount = (uid, delta) => {
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
      return newCollection;
    });
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
