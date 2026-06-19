import React from 'react';
import { Search, Filter } from 'lucide-react';

export function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  selectedSeason, 
  setSelectedSeason, 
  selectedAttribute, 
  setSelectedAttribute 
}) {
  return (
    <div className="glass-panel p-4 mb-6 flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="カード名や効果で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zutomayo-darker border border-zutomayo-border rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-zutomayo-accent focus:ring-1 focus:ring-zutomayo-accent transition-colors"
        />
      </div>
      
      <div className="flex gap-4">
        <div className="relative">
          <select 
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="appearance-none bg-zutomayo-darker border border-zutomayo-border rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:border-zutomayo-secondary transition-colors cursor-pointer"
          >
            <option value="all">全シーズン</option>
            <option value="1">Season 1</option>
            <option value="2">Season 2</option>
            <option value="3">Season 3</option>
            <option value="4">Season 4</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
        
        <div className="relative">
          <select 
            value={selectedAttribute}
            onChange={(e) => setSelectedAttribute(e.target.value)}
            className="appearance-none bg-zutomayo-darker border border-zutomayo-border rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:border-zutomayo-secondary transition-colors cursor-pointer"
          >
            <option value="all">全属性</option>
            <option value="Purple">Purple</option>
            <option value="Green">Green</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>
    </div>
  );
}
