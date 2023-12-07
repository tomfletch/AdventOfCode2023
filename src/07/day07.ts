import { readInputLines } from "../utils/readInput.js"

const CARD_ORDER_1 = "23456789TJQKA"
const CARD_ORDER_2 = "J23456789TQKA"

type HandType =
  | "FIVE_OF_A_KIND"
  | "FOUR_OF_A_KIND"
  | "FULL_HOUSE"
  | "THREE_OF_A_KIND"
  | "TWO_PAIR"
  | "ONE_PAIR"
  | "HIGH_CARD"

const HAND_TYPE_ORDER: HandType[] = [
  "HIGH_CARD",
  "ONE_PAIR",
  "TWO_PAIR",
  "THREE_OF_A_KIND",
  "FULL_HOUSE",
  "FOUR_OF_A_KIND",
  "FIVE_OF_A_KIND",
]

type HandBid = {
  hand: string
  bid: number
}

const part1 = () => {
  const handBids = readHandBids()
  const sortedHandBids = handBids.sort((a, b) =>
    compareHands(a.hand, b.hand, false),
  )
  const winnings = calculateWinnings(sortedHandBids)
  console.log(winnings)
}

const part2 = () => {
  const handBids = readHandBids()
  const sortedHandBids = handBids.sort((a, b) =>
    compareHands(a.hand, b.hand, true),
  )
  const winnings = calculateWinnings(sortedHandBids)
  console.log(winnings)
}

const readHandBids = (): HandBid[] => {
  const lines = readInputLines(7)
  return lines.map(parseHandBid)
}

const parseHandBid = (line: string): HandBid => {
  const [hand, bid] = line.split(" ")
  return { hand: hand!, bid: Number(bid) }
}

const calculateWinnings = (sortedHandBids: HandBid[]): number => {
  const winnings = sortedHandBids.reduce(
    (acc, handBid, i) => acc + handBid.bid * (i + 1),
    0,
  )
  return winnings
}

const getHandType = (hand: string, isPart2: boolean = false): HandType => {
  const cardCounts = getCardCounts(hand)

  if (isPart2 && "J" in cardCounts) {
    const jCount = cardCounts["J"]

    let maxCount = 0
    let maxCard = ""

    for (const [card, count] of Object.entries(cardCounts)) {
      if (card === "J") {
        continue
      }

      if (count > maxCount) {
        maxCount = count
        maxCard = card
      }
    }

    cardCounts["J"] = 0

    if (maxCard) {
      cardCounts[maxCard] += jCount
    } else {
      cardCounts["A"] = 5
    }
  }

  const cardCountValues = Object.values(cardCounts)
  const sum = cardCountValues.reduce((acc, v) => acc + v, 0)
  if (sum !== 5) {
    console.log(cardCounts)
    console.log(cardCountValues)
    throw new Error(`Failed to get hand type`)
  }

  if (cardCountValues.includes(5)) {
    return "FIVE_OF_A_KIND"
  }

  if (cardCountValues.includes(4)) {
    return "FOUR_OF_A_KIND"
  }

  if (cardCountValues.includes(3) && cardCountValues.includes(2)) {
    return "FULL_HOUSE"
  }

  if (cardCountValues.includes(3)) {
    return "THREE_OF_A_KIND"
  }

  const twoCount = cardCountValues.filter((card) => card === 2).length

  if (twoCount === 2) {
    return "TWO_PAIR"
  }

  if (twoCount === 1) {
    return "ONE_PAIR"
  }

  return "HIGH_CARD"
}

const getCardCounts = (hand: string): { [key: string]: number } => {
  const cardCounts: { [key: string]: number } = {}

  for (const card of hand) {
    if (!(card in cardCounts)) {
      cardCounts[card] = 0
    }
    cardCounts[card] += 1
  }

  return cardCounts
}

const compareHands = (handA: string, handB: string, isPart2: boolean) => {
  const handAType = getHandType(handA, isPart2)
  const handBType = getHandType(handB, isPart2)

  const handAIndex = HAND_TYPE_ORDER.indexOf(handAType)
  const handBIndex = HAND_TYPE_ORDER.indexOf(handBType)

  if (handAIndex > handBIndex) {
    return 1
  }

  if (handBIndex > handAIndex) {
    return -1
  }

  const cardOrder = isPart2 ? CARD_ORDER_2 : CARD_ORDER_1

  for (let i = 0; i < handA.length; i++) {
    const cardA = handA[i]!
    const cardB = handB[i]!

    const cardComparison = compareCards(cardA, cardB, cardOrder)

    if (cardComparison !== 0) {
      return cardComparison
    }
  }

  return 0
}

const compareCards = (cardA: string, cardB: string, cardOrder: string) => {
  const cardAIndex = cardOrder.indexOf(cardA)
  const cardBIndex = cardOrder.indexOf(cardB)

  if (cardAIndex > cardBIndex) {
    return 1
  }

  if (cardAIndex < cardBIndex) {
    return -1
  }

  return 0
}

export default [part1, part2]
