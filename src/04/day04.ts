import { readInputLines } from "../utils/readInput.js"

type Card = {
  id: number
  winningNumbers: number[]
  yourNumbers: number[]
}

const part1 = () => {
  const lines = readInputLines(4)
  const cards = lines.map(parseCard)
  const scores = cards.map(getCardScore)
  const totalScore = scores.reduce((acc, s) => acc + s, 0)
  console.log(totalScore)
}

const part2 = () => {}

const parseCard = (line: string): Card => {
  const [label, numbers] = line.split(":")
  const [_, idStr] = label!.split(/\s+/)
  const id = Number(idStr!.trim())

  const [winningNumbersStr, yourNumbersStr] = numbers!.split("|")

  const winningNumbers = winningNumbersStr!.trim().split(/\s+/g).map(Number)
  const yourNumbers = yourNumbersStr!.trim().split(/\s+/g).map(Number)

  return {
    id,
    winningNumbers,
    yourNumbers,
  }
}

const getCardScore = (card: Card): number => {
  const matches = card.winningNumbers.filter((n) =>
    card.yourNumbers.includes(n),
  )

  if (matches.length === 0) {
    return 0
  }

  return Math.pow(2, matches.length - 1)
}

export default [part1, part2]
