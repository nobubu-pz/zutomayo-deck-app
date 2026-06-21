const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../src/data/cards.json');

const attributeMapping = {
  // 闇 (Dark/Target)
  'target': '闇',
  'dark': '闇',
  'purple': '闇',
  
  // 炎 (Fire/Flame)
  'flame': '炎',
  'fire': '炎',
  'red': '炎',
  
  // 電気 (Electric/Lightning)
  'lightning': '電気',
  'electric': '電気',
  'energy': '電気',
  'yellow': '電気',
  
  // 風 (Wind/Leaf)
  'wind': '風',
  'leaf': '風',
  'green': '風',
  'green swirl': '風',
  'spiral': '風',
  'wind swirl': '風',
  'wings': '風',
  
  // カオス (Chaos/Star/Orb/Swirl)
  'star': 'カオス',
  'star burst': 'カオス',
  'zutomayo symbol': 'カオス',
  'chaos': 'カオス',
  'swirl': 'カオス',
  'vortex': 'カオス',
  'orb': 'カオス',
  'orb swirl': 'カオス',
  'swirl sphere': 'カオス',
  'swirl orb': 'カオス',
  'wavy orb': 'カオス',
  'eye orb': 'カオス',
  'winged orb': 'カオス',
  'black': 'カオス'
};

function normalizeAttribute(attr) {
  if (!attr) return 'Unknown';
  if (['闇', '炎', '電気', '風', 'カオス'].includes(attr)) return attr;
  
  const lowerAttr = attr.toLowerCase().trim();
  for (const key in attributeMapping) {
    if (lowerAttr.includes(key)) {
      return attributeMapping[key];
    }
  }
  
  // デフォルト（紫のターゲットっぽいやつを闇、黒い星っぽいやつをカオスとする）
  // 判定できなかったものはカオスに入れておくか、Unknownのままにするか
  return 'Unknown';
}

function main() {
  const cards = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
  let updated = 0;

  cards.forEach(card => {
    const oldAttr = card.attribute;
    const newAttr = normalizeAttribute(oldAttr);
    if (oldAttr !== newAttr) {
      card.attribute = newAttr;
      updated++;
    }
  });

  fs.writeFileSync(FILE_PATH, JSON.stringify(cards, null, 2));
  console.log(`Normalized attributes for ${updated} cards.`);
}

main();
