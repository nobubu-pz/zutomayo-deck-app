import React from 'react';

export function BasicFilterBar({
  attributeFilter, setAttributeFilter,
  typeFilter, setTypeFilter
}) {
  const basicTypes = ['Character', 'Enchant', 'Area Enchant'];
  const basicAttributes = ['闇', '炎', '電気', '風', 'カオス'];

  const toggleFilter = (currentList, setList, item) => {
    if (currentList.includes(item)) {
      setList(currentList.filter(i => i !== item));
    } else {
      setList([...currentList, item]);
    }
  };

  const FilterGroup = ({ label, options, currentList, setList }) => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-zutomayo-light font-bold uppercase tracking-wider">{label}</span>
        {currentList.length > 0 && (
          <button onClick={() => setList([])} className="text-[10px] text-zutomayo-light hover:text-white underline decoration-white/30 px-1 py-0.5 rounded transition-colors">
            クリア
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const isSelected = currentList.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggleFilter(currentList, setList, opt)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                isSelected 
                  ? 'bg-zutomayo-accent border-zutomayo-accent text-white shadow-[0_0_10px_rgba(123,94,167,0.5)]' 
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

  return (
    <div className="flex flex-col sm:flex-row gap-6">
      <FilterGroup label="属性 (Attribute)" options={basicAttributes} currentList={attributeFilter} setList={setAttributeFilter} />
      <FilterGroup label="種類 (Type)" options={basicTypes} currentList={typeFilter} setList={setTypeFilter} />
    </div>
  );
}
