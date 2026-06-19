import fs from 'fs';

const numCards = 104;
const cards = [];

for (let i = 1; i <= numCards; i++) {
  const idStr = String(i).padStart(3, '0');
  const filename = `ZUTOMAYO_CARD_THE_BATTLE_BEGINS_1_${idStr}.jpg`;
  
  cards.push({
    id: `1st-${idStr}`,
    name: `Card No.${idStr}`,
    season: 1,
    imagePath: `/images/cards/CardList_1st/${filename}`,
    attribute: "Unknown",
    type: "Character",
    effect: "テキストは未解析です"
  });
}

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/cards.json', JSON.stringify(cards, null, 2));
console.log('Successfully generated src/data/cards.json with 104 cards.');
