import { useState, useEffect, useMemo } from 'react';
import cardsData from '../data/cards.json';

export function useCards() {
  const [cards, setCards] = useState([]);
  
  // フィルター用ステート
  const [searchQuery, setSearchQuery] = useState('');
  const [attributeFilter, setAttributeFilter] = useState('All');
  const [rarityFilter, setRarityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [seasonFilter, setSeasonFilter] = useState('All');

  useEffect(() => {
    // データをロード（将来的にはAPIからのフェッチ等に変更可能）
    setCards(cardsData);
  }, []);

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      // 1. テキスト検索（カード名または曲名）
      const q = searchQuery.toLowerCase();
      const matchSearch = q === '' || 
                          (card.name && card.name.toLowerCase().includes(q)) || 
                          (card.songTitle && card.songTitle.toLowerCase().includes(q));
                          
      // 2. プルダウンフィルター
      const matchAttribute = attributeFilter === 'All' || card.attribute === attributeFilter;
      const matchRarity = rarityFilter === 'All' || card.rarity === rarityFilter;
      const matchType = typeFilter === 'All' || card.type === typeFilter;
      const matchSeason = seasonFilter === 'All' || card.season === seasonFilter;
      
      // 未解析データ(Unknown)などの除外は特に行わない（全て検索可能にする）
      
      return matchSearch && matchAttribute && matchRarity && matchType && matchSeason;
    });
  }, [cards, searchQuery, attributeFilter, rarityFilter, typeFilter, seasonFilter]);

  const sortedCards = useMemo(() => {
    return [...filteredCards].sort((a, b) => {
      // 構造化データとして持たせた uid (例: "001104") を使って直接比較
      if (a.uid && b.uid) {
        return a.uid.localeCompare(b.uid);
      }
      return 0; // uidがない場合はそのまま
    });
  }, [filteredCards]);

  // プルダウン用のユニークな選択肢を自動抽出
  const uniqueAttributes = useMemo(() => ['All', ...new Set(cards.map(c => c.attribute).filter(Boolean))], [cards]);
  const uniqueRarities = useMemo(() => ['All', ...new Set(cards.map(c => c.rarity).filter(Boolean))], [cards]);
  
  // Basic Search用: Typeは指定の3つのみ、または全種？ ひとまず全種抽出しておいてUI側で制限する
  const uniqueTypes = useMemo(() => ['All', ...new Set(cards.map(c => c.type).filter(Boolean))], [cards]);
  const uniqueSeasons = useMemo(() => ['All', ...new Set(cards.map(c => c.season).filter(Boolean))], [cards]);

  return {
    cards: sortedCards,
    allCards: cards,
    
    // 検索・フィルターステート
    searchQuery, setSearchQuery,
    attributeFilter, setAttributeFilter,
    rarityFilter, setRarityFilter,
    typeFilter, setTypeFilter,
    seasonFilter, setSeasonFilter,
    
    // フィルター選択肢
    uniqueAttributes,
    uniqueRarities,
    uniqueTypes,
    uniqueSeasons,
  };
}
