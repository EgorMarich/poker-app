import { evaluate, getCardCode } from '@pokertools/evaluator'
import { Card, CalculateEquityParams } from './types'
import { generateDeck, removeCards, drawRandomCards, completeBoard } from './deck'
import { rangeToHands } from './rangeToHands'

const rankToStr: Record<number, string> = {
  2: '2', 3: '3', 4: '4', 5: '5', 6: '6',
  7: '7', 8: '8', 9: '9', 10: 'T',
  11: 'J', 12: 'Q', 13: 'K', 14: 'A',
}

function cardToCode(card: Card): number {
  const rankStr = rankToStr[card.rank]
  if (!rankStr) throw new Error(`Unknown rank: ${card.rank}`)
  return getCardCode(`${rankStr}${card.suit}`)
}

// Выбирает случайную руку из диапазона, исключая уже занятые карты
function drawFromRange(
  hands: [Card, Card][],
  usedCards: Card[],
): [Card, Card] | null {
  const usedSet = new Set(
    usedCards.map((c) => `${c.rank}${c.suit}`)
  )

  const available = hands.filter(([c1, c2]) =>
    !usedSet.has(`${c1.rank}${c1.suit}`) &&
    !usedSet.has(`${c2.rank}${c2.suit}`)
  )

  if (available.length === 0) return null

  return available[Math.floor(Math.random() * available.length)]
}

export function calculateEquity({
  heroHand,
  board,
  opponents,
  simulations = 10000,
}: CalculateEquityParams): number {
  // Предварительно раскрываем диапазоны оппонентов
  const opponentRanges = opponents.map((opp) =>
    opp.range ? rangeToHands(opp.range) : null
  )

  let wins = 0

  for (let i = 0; i < simulations; i++) {
    let deck = generateDeck()
    deck = removeCards(deck, [...heroHand, ...board])

    const usedCards = [...heroHand, ...board]
    const opponentHands: Card[][] = []

    for (let j = 0; j < opponents.length; j++) {
      const rangeHands = opponentRanges[j]

      if (rangeHands && rangeHands.length > 0) {
        // Берём руку из диапазона
        const drawn = drawFromRange(rangeHands, usedCards)
        if (drawn) {
          opponentHands.push(drawn)
          usedCards.push(...drawn)
          deck = removeCards(deck, drawn)
        } else {
          // Диапазон заблокирован — берём случайные карты
          opponentHands.push(drawRandomCards(deck, 2))
        }
      } else {
        // Нет диапазона — случайные карты
        opponentHands.push(drawRandomCards(deck, 2))
      }
    }

    const fullBoard = completeBoard(deck, board)

    const heroRank = evaluate([...heroHand, ...fullBoard].map(cardToCode))
    const opponentRanks = opponentHands.map((hand) =>
      evaluate([...hand, ...fullBoard].map(cardToCode))
    )

    const bestOpponent = Math.min(...opponentRanks)

    if (heroRank < bestOpponent) {
      wins += 1
    } else if (heroRank === bestOpponent) {
      const tiedPlayers = opponentRanks.filter((r) => r === heroRank).length + 1
      wins += 1 / tiedPlayers
    }
  }

  return wins / simulations
}