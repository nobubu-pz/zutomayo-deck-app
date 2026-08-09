const fs = require('fs');
const path = require('path');

const cardsJsonPath = path.join(__dirname, '../src/data/cards.json');
const editsJsonPath = path.join(__dirname, '../docs/send_to_power_details_edit.json');

try {
  const cardsData = JSON.parse(fs.readFileSync(cardsJsonPath, 'utf8'));
  const editsData = JSON.parse(fs.readFileSync(editsJsonPath, 'utf8'));

  const editMap = new Map();
  editsData.forEach(edit => {
    editMap.set(edit.id, edit);
  });

  let updatedCount = 0;
  cardsData.forEach(card => {
    if (editMap.has(card.id)) {
      const edit = editMap.get(card.id);
      if (card.sendToPower !== edit.sendToPower || card.powerCost !== edit.powerCost) {
        card.sendToPower = edit.sendToPower;
        card.powerCost = edit.powerCost;
        updatedCount++;
      }
    }
  });

  fs.writeFileSync(cardsJsonPath, JSON.stringify(cardsData, null, 2), 'utf8');
  console.log(`Successfully updated ${updatedCount} cards in cards.json`);
} catch (error) {
  console.error("Error updating cards:", error);
}
