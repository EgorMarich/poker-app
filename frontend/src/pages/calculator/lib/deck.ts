import { Card } from './types';

export function generateDeck(): Card[] {
  const suits = ['h','d','c','s'];
  const ranks = [2,3,4,5,6,7,8,9,10,11,12,13,14]; 
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

export function removeCards(deck: Card[], cards: Card[]): Card[] {
  return deck.filter(
    d => !cards.some(c => c.rank === d.rank && c.suit === d.suit)
  );
}

export function drawRandomCards(deck: Card[], count: number): Card[] {
  const result: Card[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * deck.length);
    result.push(deck[idx]);
    deck.splice(idx, 1);
  }
  return result;
}

export function completeBoard(deck: Card[], board: Card[]): Card[] {
  const needed = 5 - board.length;
  const newBoard = [...board];
  for (let i = 0; i < needed; i++) {
    const idx = Math.floor(Math.random() * deck.length);
    newBoard.push(deck[idx]);
    deck.splice(idx, 1);
  }
  return newBoard;
}