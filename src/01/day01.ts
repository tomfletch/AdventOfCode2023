import { readInputLines } from "../utils/readInput.js"

const NUMBER_TEXT_LOOKUP = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
}

const part1 = () => {
  const lines = readInputLines(1)
  const lineNumbers = lines.map(getLineNumber)
  const total = lineNumbers.reduce((a, c) => a + c, 0)
  console.log(total)
}

const part2 = () => {
  const lines = readInputLines(1)
  const lineNumbers = lines.map(getLineNumberWithWords)
  const total = lineNumbers.reduce((a, c) => a + c, 0)
  console.log(total)
}

const getLineNumber = (line: string): number => {
  const digits = line.replaceAll(/\D+/g, "")
  const firstDigit = digits[0]
  const lastDigit = digits[digits.length - 1]

  if (!firstDigit || !lastDigit) {
    throw new Error(`No digits in line: ${line}`)
  }

  const numberStr = `${firstDigit}${lastDigit}`

  const number = parseInt(numberStr)

  if (!number) {
    throw new Error(`Failed to parse number: ${numberStr}`)
  }

  return number
}

const getLineNumberWithWords = (line: string): number => {
  const firstDigit = getFirstDigit(line)
  const lastDigit = getLastDigit(line)
  return firstDigit * 10 + lastDigit
}

const getFirstDigit = (line: string): number => {
  let firstDigit: number | null = null
  let firstDigitIndex: number = line.length

  for (const [digitText, digit] of Object.entries(NUMBER_TEXT_LOOKUP)) {
    const digitIndex = line.indexOf(digitText)

    if (digitIndex !== -1 && digitIndex < firstDigitIndex) {
      firstDigit = digit
      firstDigitIndex = digitIndex
    }
  }

  if (!firstDigit) {
    throw new Error(`No first digit on line: ${line}`)
  }

  return firstDigit
}

const getLastDigit = (line: string): number => {
  let lastDigit: number | null = null
  let lastDigitIndex: number = -1

  for (const [digitText, digit] of Object.entries(NUMBER_TEXT_LOOKUP)) {
    const digitIndex = line.lastIndexOf(digitText)

    if (digitIndex !== -1 && digitIndex > lastDigitIndex) {
      lastDigit = digit
      lastDigitIndex = digitIndex
    }
  }

  if (!lastDigit) {
    throw new Error(`No last digit on line: ${line}`)
  }

  return lastDigit
}

export default [part1, part2]
