import { Card } from "./types";

const rankMap: Record<string, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  'T': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
  'A': 14,
};

const suitMap: Record<string, string> = {
  'hearts': 'h',
  'diamonds': 'd',
  'clubs': 'c',
  'spades': 's',
};

export function mapUICardToEngine(card: { rank: string; suit: string }): Card {
  const rankNumber = rankMap[card.rank.toUpperCase()];
  if (!rankNumber) throw new Error(`Unknown card rank: ${card.rank}`);
  
  const suit = suitMap[card.suit] ?? card.suit; 
  
  return { rank: rankNumber, suit };
}

export function mapUICards(cards: { rank: string; suit: string }[]): Card[] {
  return cards.map(mapUICardToEngine);
}