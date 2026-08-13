/**
 * Zutomayo TCG Effect System Constants
 * 
 * Defines the triggers, conditions, and actions for the card effect logic engine.
 */

// ==========================================
// 1. Timings & Triggers (フェーズとトリガー)
// ==========================================
export const TIMING = {
  // メインの計算フェーズ（毎ターンのステータス計算時に評価される）
  PHASE_ATTACK_CALC: 'PHASE_ATTACK_CALC',
  PHASE_DAMAGE_CALC: 'PHASE_DAMAGE_CALC',
  
  // 割り込み・イベントトリガー
  ON_TURN_START: 'ON_TURN_START',
  ON_TURN_END: 'ON_TURN_END',
  ON_CARD_REVEAL: 'ON_CARD_REVEAL',
  ON_CARD_DRAW: 'ON_CARD_DRAW',
  ON_ZONE_CHANGE_ABYSS: 'ON_ZONE_CHANGE_ABYSS', // アビスにカードが置かれた時
  ON_ZONE_CHANGE_POWER: 'ON_ZONE_CHANGE_POWER', // パワーチャージャーにカードが置かれた時
  ON_BATTLE_LOSE: 'ON_BATTLE_LOSE',
  ON_HP_BELOW_THRESHOLD: 'ON_HP_BELOW_THRESHOLD'
};

// ==========================================
// 2. Conditions (発動条件)
// ==========================================
export const CONDITION_TYPE = {
  ZONE_HAS: 'ZONE_HAS',           // 特定のゾーンに特定のカード/属性/枚数があるか
  TARGET_STATUS: 'TARGET_STATUS', // 相手または自分のステータス（攻撃力など）が特定の値か
  TIME_IS: 'TIME_IS',             // 現在の時間（昼/夜）
  HISTORY_PLAYED: 'HISTORY_PLAYED'// 履歴（前のターンに出したカードの属性など）
};

// ==========================================
// 3. Actions (効果の対象・結果)
// ==========================================
export const ACTION_TYPE = {
  MODIFY_ATTACK: 'MODIFY_ATTACK',   // 攻撃力の増減・固定
  MODIFY_HP: 'MODIFY_HP',           // HPの増減・回復・ダメージ
  REDUCE_DAMAGE: 'REDUCE_DAMAGE',   // ダメージ軽減
  DRAW_CARD: 'DRAW_CARD',           // ドロー
  MOVE_CARD: 'MOVE_CARD',           // ゾーン間のカード移動（破棄など）
  MODIFY_TIME: 'MODIFY_TIME',       // 時計の操作（昼夜変更など）
  META_EFFECT: 'META_EFFECT'        // 特殊効果（無効化など）
};

// ==========================================
// 4. Targets (効果の対象先指定)
// ==========================================
export const TARGET = {
  SELF: 'SELF',
  OPPONENT: 'OPPONENT',
  BOTH: 'BOTH'
};

// ==========================================
// 5. Zones (ゾーン定義)
// ==========================================
export const ZONE = {
  HAND: 'HAND',
  DECK: 'DECK',
  ABYSS: 'ABYSS',
  POWER_CHARGER: 'POWER_CHARGER',
  BATTLE: 'BATTLE',
  SET: 'SET' // Area Enchantment / Character Backside etc.
};
