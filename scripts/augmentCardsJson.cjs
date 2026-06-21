const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../src/data/cards.json');

function main() {
  if (!fs.existsSync(FILE_PATH)) {
    console.error('cards.json not found');
    return;
  }

  const cards = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
  let updatedCount = 0;

  cards.forEach(card => {
    // id: "1st_104", "2nd_3" etc.
    const match = card.id.match(/^(\d)[a-z]+_(.+)$/);
    if (match) {
      card.seasonNo = parseInt(match[1], 10);
      
      const numMatch = match[2].match(/\d+/);
      card.cardNo = numMatch ? parseInt(numMatch[0], 10) : 999;
      
      // フォーマット: 例: 1stの104番 -> "001104"
      const formattedSeason = card.seasonNo.toString().padStart(3, '0');
      const formattedCardNo = card.cardNo.toString().padStart(3, '0');
      card.uid = `${formattedSeason}${formattedCardNo}`;
    } else {
      card.seasonNo = 99;
      card.cardNo = 999;
      card.uid = '099999';
    }
    updatedCount++;
  });

  // Sort the JSON array globally by uid
  cards.sort((a, b) => a.uid.localeCompare(b.uid));

  fs.writeFileSync(FILE_PATH, JSON.stringify(cards, null, 2));
  console.log(`Successfully augmented ${updatedCount} cards with seasonNo, cardNo, and uid. Sorted by uid.`);
}

main();
