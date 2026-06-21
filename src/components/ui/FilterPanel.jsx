import React from 'react';
import { Filter, X } from 'lucide-react';

export function FilterPanel({
  isOpen,
  onClose,
  rarityFilter, setRarityFilter, uniqueRarities,
  seasonFilter, setSeasonFilter, uniqueSeasons,
}) {
  if (!isOpen) return null;

  const FilterSelect = ({ label, value, onChange, options }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zutomayo-light/80 font-semibold uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-black/40 border border-zutomayo-border rounded-lg p-2 text-white outline-none focus:border-zutomayo-accent focus:ring-1 focus:ring-zutomayo-accent transition-all appearance-none cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-zutomayo-dark text-white">
            {opt === 'All' ? 'すべて' : opt}
          </option>
        ))}
      </select>
    </div>
  );

  const resetFilters = () => {
    setRarityFilter('All');
    setSeasonFilter('All');
  };

  return (
    <div className="bg-black/60 backdrop-blur-xl border-y border-white/10 p-4 lg:p-6 shadow-lg animate-in slide-in-from-top-2 duration-300 relative z-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-white">
            <Filter size={18} className="text-zutomayo-accent" />
            <h3 className="font-bold text-lg">詳細フィルター</h3>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={resetFilters}
              className="text-sm text-zutomayo-light hover:text-white underline decoration-zutomayo-light/30 underline-offset-4 transition-colors"
            >
              詳細条件をリセット
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-zutomayo-light hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FilterSelect 
            label="Season (弾)" 
            value={seasonFilter} 
            onChange={setSeasonFilter} 
            options={uniqueSeasons} 
          />
          <FilterSelect 
            label="Rarity (レアリティ)" 
            value={rarityFilter} 
            onChange={setRarityFilter} 
            options={uniqueRarities} 
          />
        </div>
      </div>
    </div>
  );
}
