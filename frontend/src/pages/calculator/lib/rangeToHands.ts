import { Card } from './types'

// const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const SUITS = ['s', 'h', 'd', 'c'] as const

// Все возможные комбо для руки типа 'AKs', 'AKo', 'AA'
function expandHand(hand: string): [Card, Card][] {
  const rankMap: Record<string, number> = {
    'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10,
    '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2,
  }

  const isPair = hand.length === 2 && hand[0] === hand[1]
  const isSuited = hand.endsWith('s')
  const isOffsuit = hand.endsWith('o')

  const r1 = rankMap[hand[0]]
  const r2 = rankMap[hand[1]]

  if (!r1 || !r2) return []

  const combos: [Card, Card][] = []

  if (isPair) {
    // 6 комбо: все пары разных мастей
    for (let i = 0; i < SUITS.length; i++) {
      for (let j = i + 1; j < SUITS.length; j++) {
        combos.push([
          { rank: r1, suit: SUITS[i] },
          { rank: r2, suit: SUITS[j] },
        ])
      }
    }
  } else if (isSuited) {
    // 4 комбо: одинаковые масти
    for (const suit of SUITS) {
      combos.push([
        { rank: r1, suit },
        { rank: r2, suit },
      ])
    }
  } else if (isOffsuit) {
    // 12 комбо: разные масти
    for (const s1 of SUITS) {
      for (const s2 of SUITS) {
        if (s1 !== s2) {
          combos.push([
            { rank: r1, suit: s1 },
            { rank: r2, suit: s2 },
          ])
        }
      }
    }
  }

  return combos
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rangeToHands(matrix: Record<string, any>): [Card, Card][] {
  const result: [Card, Card][] = []

  for (const [hand, action] of Object.entries(matrix)) {
    if (!action || action === 'fold' || action === null) continue
    result.push(...expandHand(hand))
  }

  return result
}