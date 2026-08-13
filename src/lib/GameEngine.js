import { TIMING, ACTION_TYPE, CONDITION_TYPE, TARGET, ZONE } from './effectTypes.js';
import cardLogic from '../data/card_logic.json';
import cards from '../data/cards.json';

/**
 * Zutomayo TCG - Core Game Engine
 * 
 * 盤面の状態（gameState）を受け取り、カードロジックを評価して
 * 最新のステータス（攻撃力やHP）を計算するエンジン。
 */

export class GameEngine {
  /**
   * 初期状態のゲームステートを生成する
   */
  static createInitialState() {
    return {
      turnCount: 1,
      time: 'DAY', // 'DAY' or 'NIGHT'
      players: {
        player1: {
          hp: 500,
          deck: [],
          hand: [],
          abyss: [],
          powerCharger: [],
          battleZone: null,
          setZone: [],
          modifiers: {
            attack: 0,
            damageReduction: 0
          },
          history: {
            playedThisTurn: [],
            playedPreviousTurn: []
          }
        },
        player2: {
          hp: 500,
          deck: [],
          hand: [],
          abyss: [],
          powerCharger: [],
          battleZone: null,
          setZone: [],
          modifiers: {
            attack: 0,
            damageReduction: 0
          },
          history: {
            playedThisTurn: [],
            playedPreviousTurn: []
          }
        }
      }
    };
  }

  /**
   * 現在の盤面状況から、特定のプレイヤーの最終的な攻撃力を計算する
   * @param {Object} gameState 現在のゲーム状態
   * @param {string} playerId 計算対象のプレイヤー ("player1" or "player2")
   */
  static calculateAttack(gameState, playerId) {
    const player = gameState.players[playerId];
    const opponentId = playerId === 'player1' ? 'player2' : 'player1';
    const opponent = gameState.players[opponentId];
    
    // 基本攻撃力（バトルゾーンのキャラクターの素の攻撃力）
    // ※カードデータに元々の攻撃力がない場合は0とする
    let baseAttack = 0;
    if (player.battleZone) {
      const cardMaster = cards.find(c => c.id === player.battleZone.id);
      baseAttack = cardMaster && cardMaster.attack ? cardMaster.attack : 0;
    }

    let attackModifier = 0;

    // 現在出ているカード（キャラクター＋エンチャント）の全効果を評価
    const activeCards = [];
    if (player.battleZone) activeCards.push(player.battleZone);
    activeCards.push(...player.setZone);

    activeCards.forEach(card => {
      const logic = cardLogic[card.id];
      if (!logic || !logic.effects) return;

      logic.effects.forEach(effect => {
        // 効果計算フェーズのみ評価
        if (effect.timing === TIMING.PHASE_ATTACK_CALC) {
          // 条件を満たしているかチェック
          if (this.evaluateConditions(effect.conditions, gameState, playerId, opponentId)) {
            // アクション（攻撃力変化）を適用
            effect.actions.forEach(action => {
              if (action.type === ACTION_TYPE.MODIFY_ATTACK) {
                if (action.target === TARGET.SELF || !action.target) {
                  if (action.operation === 'ADD') {
                    attackModifier += action.value;
                  } else if (action.operation === 'SUBTRACT') {
                    attackModifier -= action.value;
                  }
                }
              }
            });
          }
        }
      });
    });

    // 相手からのデバフも計算（相手のカードを評価し、TargetがOPPONENTのものを適用）
    const oppActiveCards = [];
    if (opponent.battleZone) oppActiveCards.push(opponent.battleZone);
    oppActiveCards.push(...opponent.setZone);

    oppActiveCards.forEach(card => {
      const logic = cardLogic[card.id];
      if (!logic || !logic.effects) return;

      logic.effects.forEach(effect => {
        if (effect.timing === TIMING.PHASE_ATTACK_CALC) {
          if (this.evaluateConditions(effect.conditions, gameState, opponentId, playerId)) {
            effect.actions.forEach(action => {
              if (action.type === ACTION_TYPE.MODIFY_ATTACK && action.target === TARGET.OPPONENT) {
                if (action.operation === 'ADD') {
                  attackModifier += action.value;
                } else if (action.operation === 'SUBTRACT') {
                  attackModifier -= action.value;
                }
              }
            });
          }
        }
      });
    });

    return Math.max(0, baseAttack + attackModifier);
  }

  /**
   * 条件配列を評価して、全て満たすか(AND)を返す
   */
  static evaluateConditions(conditions, gameState, playerId, opponentId) {
    if (!conditions || conditions.length === 0) return true;

    const player = gameState.players[playerId];
    const opponent = gameState.players[opponentId];

    for (const cond of conditions) {
      if (cond.type === CONDITION_TYPE.TIME_IS) {
        if (gameState.time !== cond.value) return false;
      }
      
      if (cond.type === CONDITION_TYPE.ZONE_HAS) {
        // 例：アビスにあるカードの判定など
        let targetZone = [];
        if (cond.zone === 'ABYSS') targetZone = player.abyss;
        else if (cond.zone === 'BATTLE') targetZone = player.battleZone ? [player.battleZone] : [];
        else if (cond.zone === 'OPPONENT_ABYSS') targetZone = opponent.abyss;

        if (cond.name) {
          const hasName = targetZone.some(c => {
             const m = cards.find(mc => mc.id === c.id);
             return m && m.name.includes(cond.name);
          });
          if (!hasName) return false;
        }

        if (cond.count !== undefined) {
          if (targetZone.length !== cond.count) return false;
        }

        if (cond.attribute) {
          const attrs = targetZone.map(c => {
            const m = cards.find(mc => mc.id === c.id);
            return m ? m.attribute : null;
          });
          
          if (cond.modifier === 'ONLY') {
            if (attrs.length === 0 || !attrs.every(a => a === cond.attribute)) return false;
          }
        }
      }

      if (cond.type === CONDITION_TYPE.TARGET_STATUS) {
        if (cond.target === 'OPPONENT_ATTR') {
          const oppChar = opponent.battleZone;
          if (!oppChar) return false;
          const m = cards.find(c => c.id === oppChar.id);
          if (!m || m.attribute !== cond.value) return false;
        }
      }

      if (cond.type === CONDITION_TYPE.HISTORY_PLAYED) {
        if (cond.target === 'PREV_TURN_ATTR') {
          // 前のターンの履歴から属性チェック
          const prevCards = player.history.playedPreviousTurn;
          const hasAttr = prevCards.some(c => {
            const m = cards.find(mc => mc.id === c.id);
            return m && m.attribute === cond.value;
          });
          if (!hasAttr) return false;
        }
      }
    }

    return true; // 全ての条件をクリア
  }
}
