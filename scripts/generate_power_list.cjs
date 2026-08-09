const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:/Users/puraz/Desktop/Antigravity/RandD/zutomayo-deck-app/src/data/cards.json'));

let out = '# Send To Power 値別カード一覧\n\n';
const groups = { '0': [], '1': [], '2': [], '3+': [], 'undefined': [] };

data.forEach(c => {
  let v = c.sendToPower;
  if (v === 0) groups['0'].push(c.name || c.id);
  else if (v === 1) groups['1'].push(c.name || c.id);
  else if (v === 2) groups['2'].push(c.name || c.id);
  else if (v >= 3) groups['3+'].push(c.name || c.id);
  else groups['undefined'].push(c.name || c.id);
});

for (const [key, arr] of Object.entries(groups)) {
  out += '## Send To Power: ' + key + '\n';
  if (arr.length === 0) {
    out += 'なし\n\n';
  } else {
    arr.forEach(name => out += '- ' + name + '\n');
    out += '\n';
  }
}

fs.writeFileSync('C:/Users/puraz/.gemini/antigravity-ide/brain/dd505091-f92f-42d1-8736-64a1f1b7310c/send_to_power_list.md', out);
