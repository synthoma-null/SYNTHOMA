'use client';

import type { DiceResult } from '../../game/types';

interface Props {
  dice?: DiceResult | undefined;
  canRoll: boolean;
  onRoll: () => void;
}

const DICE_FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export function DiceRoller({ dice, canRoll, onRoll }: Props) {
  const face = dice ? (DICE_FACES[dice.value] ?? dice.value.toString()) : '?';
  const isCrit = dice?.value === 1;
  const isBonus = dice?.value === 6;

  return (
    <div className={`dice-roller${isCrit ? ' dice-crit' : ''}${isBonus ? ' dice-bonus' : ''}`}>
      <div className="dice-face">{face}</div>
      {dice && (
        <div className="dice-value">
          {dice.value}
          {isCrit && <span className="dice-tag">KRITICKÝ VÝPADEK</span>}
          {isBonus && <span className="dice-tag">BONUS</span>}
        </div>
      )}
      {canRoll && (
        <button className="btn-roll" onClick={onRoll} type="button">
          HODIT KOSTKU
        </button>
      )}
    </div>
  );
}
