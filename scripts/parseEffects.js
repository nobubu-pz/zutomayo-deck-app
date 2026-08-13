import fs from 'fs';

const cardsPath = './src/data/cards.json';
const logicPath = './src/data/card_logic.json';

const cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
const logicData = {};

// Helper to determine timing based on text
function extractTiming(text) {
  if (text.includes('自分がダメージを受けたとき')) return 'ON_DAMAGE_TAKEN';
  if (text.includes('アビスにカードが置かれたとき')) return 'ON_ZONE_CHANGE_ABYSS';
  if (text.includes('パワーチャージャーにカードを置いたとき')) return 'ON_ZONE_CHANGE_POWER';
  if (text.includes('バトルに負けたとき')) return 'ON_BATTLE_LOSE';
  if (text.includes('ターンの終了時に') || text.includes('ターン終了時に')) return 'ON_TURN_END';
  return 'PHASE_ATTACK_CALC'; // Default
}

function parseConditions(text) {
  const conditions = [];
  
  if (text.includes('夜なら')) conditions.push({ type: 'TIME_IS', value: 'NIGHT' });
  if (text.includes('昼なら')) conditions.push({ type: 'TIME_IS', value: 'DAY' });
  
  // Previous turn attribute
  const prevTurnAttrMatch = text.match(/前のターンで使用したキャラクターカードの属性が(炎|水|風|闇|光|電気)なら/);
  if (prevTurnAttrMatch) {
    conditions.push({ type: 'HISTORY_PLAYED', target: 'PREV_TURN_ATTR', value: prevTurnAttrMatch[1] });
  }

  // Zone specific only attribute
  const abyssOnlyMatch = text.match(/アビスにあるカードが(炎|水|風|闇|光|電気)属性だけなら/);
  if (abyssOnlyMatch) {
    conditions.push({ type: 'ZONE_HAS', zone: 'ABYSS', attribute: abyssOnlyMatch[1], modifier: 'ONLY' });
  }

  // Opponent character attribute
  const oppAttrMatch = text.match(/相手のキャラクターカードの属性が(炎|水|風|闇|光|電気)なら/);
  if (oppAttrMatch) {
    conditions.push({ type: 'TARGET_STATUS', target: 'OPPONENT_ATTR', value: oppAttrMatch[1] });
  }
  
  // Battle zone character
  const battleCharMatch = text.match(/バトルゾーンの(?:カード|キャラクター)が \((.+?)\) (?:のキャラクター)?なら/);
  if (battleCharMatch) {
    conditions.push({ type: 'ZONE_HAS', zone: 'BATTLE', name: battleCharMatch[1] });
  }

  // Abyss empty
  if (text.includes('相手のアビスにカードがないなら')) {
    conditions.push({ type: 'ZONE_HAS', zone: 'OPPONENT_ABYSS', count: 0 });
  }

  // Damage threshold
  const damageMatch = text.match(/([0-9]+) ダメージ以上を受けたなら/);
  if (damageMatch) {
    conditions.push({ type: 'DAMAGE_TAKEN_THIS_TURN', min: parseInt(damageMatch[1], 10) });
  }

  return conditions;
}

function parseActions(text) {
  const actions = [];
  
  // Attack Power
  const atkMatch = text.match(/攻撃力\s*\+([0-9]+)/);
  if (atkMatch) {
    actions.push({ type: 'MODIFY_ATTACK', target: 'SELF', operation: 'ADD', value: parseInt(atkMatch[1], 10) });
  }

  // Opponent Attack Power
  const oppAtkMatch = text.match(/相手の攻撃力\s*\-([0-9]+)/);
  if (oppAtkMatch) {
    actions.push({ type: 'MODIFY_ATTACK', target: 'OPPONENT', operation: 'SUBTRACT', value: parseInt(oppAtkMatch[1], 10) });
  }
  
  // HP add
  const hpMatch = text.match(/HP\s*\+([0-9]+)/);
  if (hpMatch) {
    actions.push({ type: 'MODIFY_HP', target: 'SELF', operation: 'ADD', value: parseInt(hpMatch[1], 10) });
  }

  // HP heal
  const healMatch = text.match(/HPを\s*([0-9]+)\s*回復/);
  if (healMatch) {
    actions.push({ type: 'MODIFY_HP', target: 'SELF', operation: 'HEAL', value: parseInt(healMatch[1], 10) });
  }

  // Damage reduction
  const reduceMatch = text.match(/([0-9]+)\s*ダメージを軽減する/);
  if (reduceMatch) {
    actions.push({ type: 'REDUCE_DAMAGE', value: parseInt(reduceMatch[1], 10) });
  }

  // Draw card
  const drawMatch = text.match(/カードを\s*([0-9]+)\s*枚引く/);
  if (drawMatch) {
    actions.push({ type: 'DRAW_CARD', amount: parseInt(drawMatch[1], 10) });
  }
  
  // To Abyss
  if (text.includes('すぐにこのカードをアビスに置く') || text.includes('すぐにアビスに置く') || text.match(/ターンの終了時に.*アビスに置く/)) {
    actions.push({ type: 'MOVE_CARD', target: 'SELF', to: 'ABYSS' });
  }

  return actions;
}

cards.forEach(card => {
  if (card.effectText && card.effectText.trim() !== '') {
    const text = card.effectText;
    const sentences = text.split(/。/); // Rough split for multiple effects

    const effects = [];
    sentences.forEach(sentence => {
      if (sentence.trim() === '') return;
      
      const timing = extractTiming(sentence);
      const conditions = parseConditions(sentence);
      const actions = parseActions(sentence);

      if (actions.length > 0 || conditions.length > 0) {
        effects.push({ timing, conditions, actions });
      }
    });

    // Fallback if parser couldn't find anything
    if (effects.length === 0) {
      effects.push({
        timing: extractTiming(text),
        conditions: [],
        actions: [{ type: 'UNPARSED', originalText: text }]
      });
    }

    logicData[card.id] = { effects };
  }
});

fs.writeFileSync(logicPath, JSON.stringify(logicData, null, 2));
console.log(`Successfully parsed logic for ${Object.keys(logicData).length} cards.`);
