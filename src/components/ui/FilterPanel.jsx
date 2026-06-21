import React from 'react';
import { Filter, X } from 'lucide-react';

export function FilterPanel({
  isOpen,
  onClose,
  rarityFilter, setRarityFilter, uniqueRarities,
  seasonFilter, setSeasonFilter, uniqueSeasons,
  nightMin, setNightMin,
  nightMax, setNightMax,
  dayMin, setDayMin,
  dayMax, setDayMax,
  sendToPowerFilter, setSendToPowerFilter,
}) {
  if (!isOpen) return null;

  const toggleFilter = (currentList, setList, item) => {
    if (currentList.includes(item)) {
      setList(currentList.filter(i => i !== item));
    } else {
      setList([...currentList, item]);
    }
  };

  const FilterGroup = ({ label, options, currentList, setList }) => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <label className="text-xs text-zutomayo-light/80 font-bold uppercase tracking-wider">{label}</label>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const isSelected = currentList.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggleFilter(currentList, setList, opt)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                isSelected 
                  ? 'bg-white border-white text-black shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                  : 'bg-black/40 border-zutomayo-border text-zutomayo-light hover:border-white/40 hover:text-white'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );

  const resetFilters = () => {
    setRarityFilter([]);
    setSeasonFilter([]);
    setSendToPowerFilter([]);
    setNightMin('');
    setNightMax('');
    setDayMin('');
    setDayMax('');
  };

  return (
    <div className="bg-black/60 backdrop-blur-xl border-y border-white/10 p-4 lg:p-6 shadow-lg animate-in slide-in-from-top-2 duration-300 relative z-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FilterGroup 
            label="Season (弾)" 
            options={uniqueSeasons}
            currentList={seasonFilter} 
            setList={setSeasonFilter} 
          />
          <FilterGroup 
            label="Rarity (レアリティ)" 
            options={uniqueRarities}
            currentList={rarityFilter} 
            setList={setRarityFilter} 
          />
          <FilterGroup 
            label="Send To Power" 
            options={['0', '1', '2', '3+']}
            currentList={sendToPowerFilter} 
            setList={setSendToPowerFilter} 
          />
          <div className="flex flex-col gap-3">
            <label className="text-xs text-zutomayo-light/80 font-bold uppercase tracking-wider">攻撃力 (Power)</label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zutomayo-light w-10">Night</span>
                <input 
                  type="number" 
                  value={nightMin} 
                  onChange={e => setNightMin(e.target.value)} 
                  className="w-16 bg-black/40 border border-zutomayo-border rounded-lg text-white text-center py-1 outline-none focus:border-zutomayo-accent" 
                  placeholder="Min" 
                />
                <span className="text-zutomayo-light/50">~</span>
                <input 
                  type="number" 
                  value={nightMax} 
                  onChange={e => setNightMax(e.target.value)} 
                  className="w-16 bg-black/40 border border-zutomayo-border rounded-lg text-white text-center py-1 outline-none focus:border-zutomayo-accent" 
                  placeholder="Max" 
                />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-zutomayo-light w-10">Day</span>
                <input 
                  type="number" 
                  value={dayMin} 
                  onChange={e => setDayMin(e.target.value)} 
                  className="w-16 bg-black/40 border border-zutomayo-border rounded-lg text-white text-center py-1 outline-none focus:border-zutomayo-accent" 
                  placeholder="Min" 
                />
                <span className="text-zutomayo-light/50">~</span>
                <input 
                  type="number" 
                  value={dayMax} 
                  onChange={e => setDayMax(e.target.value)} 
                  className="w-16 bg-black/40 border border-zutomayo-border rounded-lg text-white text-center py-1 outline-none focus:border-zutomayo-accent" 
                  placeholder="Max" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
