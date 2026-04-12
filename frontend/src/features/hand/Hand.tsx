import React from 'react';
import s from './Hand.module.scss';

import { typography } from '$/shared/typography/typography';

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

export interface Card {
  rank: Rank;
  suit: Suit;
  id: string;
}

export type SelectedCards = Card[];

interface HandProps {
  label: string;
  maxCards?: number;
  value?: SelectedCards;
  onChange?: (cards: SelectedCards) => void;
  disabled?: boolean;
  disabledCards?: SelectedCards;
}

const SUITS: { value: Suit; symbol: string; color: string }[] = [
  { value: 'hearts', symbol: '♥', color: '#e74c3c' },
  { value: 'diamonds', symbol: '♦', color: '#e74c3c' },
  { value: 'clubs', symbol: '♣', color: '#209c58' },
  { value: 'spades', symbol: '♠', color: '#209c58' },
];

const RANKS: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

export const Hand: React.FC<HandProps> = ({
  label,
  maxCards = 2,
  value = [],
  onChange,
  disabled = false,
  disabledCards = [],
}) => {
  const allCards: Card[] = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      allCards.push({
        rank,
        suit: suit.value,
        id: `${rank}${suit.symbol}`,
      });
    });
  });

  const isCardSelected = (card: Card): boolean => {
    return value.some(c => c.id === card.id);
  };

  const isCardDisabled = (card: Card): boolean => {
    return disabledCards.some(c => c.id === card.id);
  };

  const handleCardClick = (card: Card) => {
    if (disabled || isCardDisabled(card) || !onChange) return;

    const isSelected = isCardSelected(card);
    let newSelectedCards: SelectedCards;

    if (isSelected) {
      newSelectedCards = value.filter(c => c.id !== card.id);
    } else {
      if (value.length >= maxCards) {
        newSelectedCards = [...value.slice(1), card];
      } else {
        newSelectedCards = [...value, card];
      }
    }

    onChange(newSelectedCards);
  };

  const getSuitDisplay = (suit: Suit) => {
    const suitData = SUITS.find(s => s.value === suit);
    return suitData || SUITS[0];
  };

  return (
    <div className={s.root}>
      <div className={s.header}>
        <label className={typography({ variant: 'bodySmSemiBold', color: 'white' })}>{label}</label>
        <span className={s.counter}>
          {value.length}/{maxCards}
        </span>
      </div>

      <div className={s.cardsGrid}>
        {allCards.map(card => {
          const suitDisplay = getSuitDisplay(card.suit);
          const isSelected = isCardSelected(card);
          const isDisabled = disabled || isCardDisabled(card);

          return (
            <div
              key={card.id}
              className={`${s.card} ${isSelected ? s.selected : ''} ${isDisabled ? s.disabled : ''}`}
              onClick={() => handleCardClick(card)}
              style={{
                borderColor: isSelected ? suitDisplay.color : undefined,
              }}
            >
              <div className={s.cardContent}>
                <span className={s.rank} style={{ color: suitDisplay.color }}>
                  {card.rank}
                </span>
                <span className={s.suit} style={{ color: suitDisplay.color }}>
                  {suitDisplay.symbol}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
