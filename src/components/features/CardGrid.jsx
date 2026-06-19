import React from 'react';
import { CardItem } from './CardItem';

export function CardGrid({ cards, onCardClick, mode = 'gallery', getCount, onAdd, onRemove }) {
  if (cards.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400">
        条件に一致するカードが見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cards.map(card => (
        <CardItem 
          key={card.id} 
          card={card} 
          onClick={onCardClick}
          mode={mode}
          count={getCount ? getCount(card.id) : 0}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
