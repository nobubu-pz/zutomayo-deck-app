const fs = require('fs');

// Read the original cards data
const data = JSON.parse(fs.readFileSync('c:/Users/puraz/Desktop/Antigravity/RandD/zutomayo-deck-app/src/data/cards.json', 'utf8'));

// Map to simplified objects
const simplifiedData = data.map(card => ({
  id: card.id,
  season: card.season,
  name: card.name,
  attribute: card.attribute,
  sendToPower: card.sendToPower,
  powerCost: card.powerCost
}));

// Sort by id in ascending order (using natural sorting so 1st_2 comes before 1st_10)
simplifiedData.sort((a, b) => {
  return String(a.id).localeCompare(String(b.id), undefined, { numeric: true, sensitivity: 'base' });
});

// Write to a new JSON file
fs.writeFileSync(
  'c:/Users/puraz/Desktop/Antigravity/RandD/zutomayo-deck-app/docs/send_to_power_details.json', 
  JSON.stringify(simplifiedData, null, 2),
  'utf8'
);

console.log('Successfully generated send_to_power_details.json');
