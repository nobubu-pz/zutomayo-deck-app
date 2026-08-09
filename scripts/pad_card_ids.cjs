const fs = require('fs');

const cardsPath = 'c:/Users/puraz/Desktop/Antigravity/RandD/zutomayo-deck-app/src/data/cards.json';
const data = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));

// Format ID to 3 digits (e.g., 1st_1 -> 1st_001)
data.forEach(card => {
  if (card.id) {
    const parts = card.id.split('_');
    if (parts.length === 2 && !isNaN(parts[1])) {
      const paddedNum = parts[1].padStart(3, '0');
      card.id = `${parts[0]}_${paddedNum}`;
    }
  }
});

fs.writeFileSync(cardsPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully padded IDs in cards.json');
