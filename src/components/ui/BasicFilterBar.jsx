import React from 'react';

export function BasicFilterBar({
  attributeFilter, setAttributeFilter,
  typeFilter, setTypeFilter
}) {
  const basicTypes = ['All', 'Character', 'Enchant', 'Area Enchant'];
  const basicAttributes = ['All', '闇', '炎', '電気', '風', 'カオス'];

  return (
    <div className="flex gap-2 sm:gap-4 flex-wrap">
      <select
        value={attributeFilter}
        onChange={(e) => setAttributeFilter(e.target.value)}
        className="bg-black/40 border border-zutomayo-border rounded-lg py-1.5 px-3 text-sm text-white outline-none focus:border-zutomayo-accent focus:ring-1 focus:ring-zutomayo-accent transition-all appearance-none cursor-pointer flex-1 min-w-[120px]"
        title="属性"
      >
        {basicAttributes.map(opt => (
          <option key={opt} value={opt} className="bg-zutomayo-dark">
            {opt === 'All' ? '全属性' : opt}
          </option>
        ))}
      </select>

      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        className="bg-black/40 border border-zutomayo-border rounded-lg py-1.5 px-3 text-sm text-white outline-none focus:border-zutomayo-accent focus:ring-1 focus:ring-zutomayo-accent transition-all appearance-none cursor-pointer flex-1 min-w-[120px]"
        title="種類"
      >
        {basicTypes.map(opt => (
          <option key={opt} value={opt} className="bg-zutomayo-dark">
            {opt === 'All' ? '全種類' : opt}
          </option>
        ))}
      </select>
    </div>
  );
}
