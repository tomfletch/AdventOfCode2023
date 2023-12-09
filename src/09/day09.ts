import { readInputLineNumbers, readInputLines } from "../utils/readInput.js"

const part1 = () => {
  const sequences = readInputLineNumbers(9)
  const nextValues = sequences.map(getNextNumber)
  const sum = nextValues.reduce((acc, v) => acc + v, 0)
  console.log(sum)
}

const part2 = () => {}

const getNextNumber = (sequence: number[]): number => {
  if (sequence.every((v) => v === 0)) {
    return 0
  }

  const differences: number[] = []

  for (let i = 0; i < sequence.length - 1; i++) {
    const v1 = sequence[i]!
    const v2 = sequence[i + 1]!
    differences.push(v2 - v1)
  }

  const lastValue = sequence[sequence.length - 1]!
  return lastValue + getNextNumber(differences)
}

export default [part1, part2]
