/* eslint-disable @typescript-eslint/no-explicit-any */

import clsx from 'clsx';
import s from './ScenarioCard.module.scss';
import { typography } from '$/shared/typography/typography';
import { useTranslation } from 'react-i18next';

interface Props {
  scenario: any;
  onAnswer: (optionId: string) => void;
  isPending: boolean;
}

export const ScenarioCard = ({ scenario, onAnswer, isPending }: Props) => {
  const { t } = useTranslation()
  return (
    <div className={s.root}>
      {(scenario.playerCards?.length > 0 || scenario.boardCards?.length > 0) && (
        <div className={s.cardsSection}>
          {scenario.playerCards?.length > 0 && (
            <div className={s.cardGroup}>
              <span
                className={clsx(s.cardLabel, typography({ variant: 'caption', color: 'gray-500' }))}
              >
                { t('training.yourHand')}
              </span>
              <div className={s.cards}>
                {scenario.playerCards.map((c: string) => (
                  <CardChip key={c} card={c} />
                ))}
              </div>
            </div>
          )}
          {scenario.boardCards?.length > 0 && (
            <div className={s.cardGroup}>
              <span
                className={clsx(s.cardLabel, typography({ variant: 'caption', color: 'gray-500' }))}
              >
                { t('training.board')}
              </span>
              <div className={s.cards}>
                {scenario.boardCards.map((c: string) => (
                  <CardChip key={c} card={c} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {scenario.position && (
        <div className={s.position}>
          <span className={clsx(typography({ variant: 'caption', color: 'gray-500' }))}>
            { t('training.position')}
          </span>
          <span
            className={clsx(s.positionBadge, typography({ variant: 'caption', color: 'white' }))}
          >
            {scenario.position}
          </span>
        </div>
      )}

      <p className={clsx(s.description, typography({ variant: 'bodySm', color: 'white' }))}>
        {scenario.description}
      </p>

      <div className={s.options}>
        {scenario.options.map((option: any) => (
          <button
            key={option.id}
            className={s.option}
            onClick={() => onAnswer(option.id)}
            disabled={isPending}
          >
            <span className={s.optionId}>{option.id.toUpperCase()}</span>
            <span className={clsx(typography({ variant: 'bodySm', color: 'white' }))}>
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

function CardChip({ card }: { card: string }) {
  const suit = card.slice(-1);
  const rank = card.slice(0, -1);
  const isRed = suit === 'h' || suit === 'd';
  const suitSymbol = { h: '♥', d: '♦', c: '♣', s: '♠' }[suit] ?? suit;

  return (
    <div className={clsx(s.card, isRed && s.cardRed)}>
      {rank}
      {suitSymbol}
    </div>
  );
}
