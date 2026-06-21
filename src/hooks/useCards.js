import { useState, useEffect, useMemo } from 'react';
import cardsData from '../data/cards.json';

export function useCards() {
  const [cards, setCards] = useState([]);
  
  // フィルター用ステート
  const [searchQuery, setSearchQuery] = useState('');
  const [attributeFilter, setAttributeFilter] = useState([]);
  const [rarityFilter, setRarityFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [seasonFilter, setSeasonFilter] = useState([]);
  
  const [nightMin, setNightMin] = useState('');
  const [nightMax, setNightMax] = useState('');
  const [dayMin, setDayMin] = useState('');
  const [dayMax, setDayMax] = useState('');
  const [sendToPowerFilter, setSendToPowerFilter] = useState([]);

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
                          
      // 2. 複数選択対応フィルター
      const matchAttribute = attributeFilter.length === 0 || attributeFilter.includes(card.attribute);
      const matchRarity = rarityFilter.length === 0 || rarityFilter.includes(card.rarity);
      const matchType = typeFilter.length === 0 || typeFilter.includes(card.type);
      const matchSeason = seasonFilter.length === 0 || seasonFilter.includes(card.season);
      
      // 3. 数値フィルター (Night / Day / SendToPower)
      const matchNight = (nightMin === '' && nightMax === '') || 
                         (typeof card.night === 'number' && 
                          card.night >= (nightMin === '' ? -Infinity : parseInt(nightMin, 10)) && 
                          card.night <= (nightMax === '' ? Infinity : parseInt(nightMax, 10)));
                          
      const matchDay = (dayMin === '' && dayMax === '') || 
                       (typeof card.day === 'number' && 
                        card.day >= (dayMin === '' ? -Infinity : parseInt(dayMin, 10)) && 
                        card.day <= (dayMax === '' ? Infinity : parseInt(dayMax, 10)));

      const matchSendToPower = sendToPowerFilter.length === 0 || sendToPowerFilter.some(val => {
        if (val === '0') return card.sendToPower === 0;
        if (val === '1') return card.sendToPower === 1;
        if (val === '2') return card.sendToPower === 2;
        if (val === '3+') return card.sendToPower >= 3;
        return false;
      });
      
      // 未解析データ(Unknown)などの除外は特に行わない（全て検索可能にする）
      
      return matchSearch && matchAttribute && matchRarity && matchType && matchSeason && matchNight && matchDay && matchSendToPower;
    });
  }, [
    cards, searchQuery, attributeFilter, rarityFilter, typeFilter, seasonFilter,
    nightMin, nightMax, dayMin, dayMax, sendToPowerFilter
  ]);

  const sortedCards = useMemo(() => {
    return [...filteredCards].sort((a, b) => {
      // 構造化データとして持たせた uid (例: "001104") を使って直接比較
      if (a.uid && b.uid) {
        return a.uid.localeCompare(b.uid);
      }
      return 0; // uidがない場合はそのまま
    });
  }, [filteredCards]);

  // UI用のユニークな選択肢を自動抽出
  const uniqueAttributes = useMemo(() => [...new Set(cards.map(c => c.attribute).filter(Boolean))], [cards]);
  const uniqueRarities = useMemo(() => [...new Set(cards.map(c => c.rarity).filter(Boolean))], [cards]);
  const uniqueTypes = useMemo(() => [...new Set(cards.map(c => c.type).filter(Boolean))], [cards]);
  const uniqueSeasons = useMemo(() => [...new Set(cards.map(c => c.season).filter(Boolean))], [cards]);

  return {
    cards: sortedCards,
    allCards: cards,
    
    // 検索・フィルターステート
    searchQuery, setSearchQuery,
    attributeFilter, setAttributeFilter,
    rarityFilter, setRarityFilter,
    typeFilter, setTypeFilter,
    seasonFilter, setSeasonFilter,
    nightMin, setNightMin,
    nightMax, setNightMax,
    dayMin, setDayMin,
    dayMax, setDayMax,
    sendToPowerFilter, setSendToPowerFilter,
    
    // フィルター選択肢
    uniqueAttributes,
    uniqueRarities,
    uniqueTypes,
    uniqueSeasons,
  };
}
