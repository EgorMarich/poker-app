export type Card = {
  rank: number; 
  suit: string; 
};

export type Combo = {
  cards: [Card, Card]; 
  weight?: number;     
};

export type Opponent = {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  range?: Record<string, any>     
};

export type CalculateEquityParams = {
  heroHand: Card[];
  board: Card[];
  opponents: Opponent[];
  simulations?: number;
};