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
}

const part1 = () => {
  const lines = readInputLines(1)
  const lineNumbers = lines.map((line) => getLineNumber(line, false))
  const total = lineNumbers.reduce((a, c) => a + c, 0)
  console.log(total)
}

const part2 = () => {
  const lines = readInputLines(1)
  const lineNumbers = lines.map((line) => getLineNumber(line, true))
  const total = lineNumbers.reduce((a, c) => a + c, 0)
  console.log(total)
}

const getLineNumber = (line: string, withWords: boolean): number => {
  let numberLookup = Array(10)
    .fill(0)
    .map((v, i) => [i.toString(), i] as [string, number])

  if (withWords) {
    numberLookup = numberLookup.concat(Object.entries(NUMBER_TEXT_LOOKUP))
  }

  const firstDigit = getFirstDigit(line, numberLookup)

  const reversedLine = reverseString(line)
  const reversedNumberLookup = numberLookup.map(
    ([digitText, digit]) =>
      [reverseString(digitText), digit] as [string, number],
  )

  const lastDigit = getFirstDigit(reversedLine, reversedNumberLookup)
  return firstDigit * 10 + lastDigit
}

const getFirstDigit = (
  line: string,
  numberLookup: [string, number][],
): number => {
  for (let i = 0; i < line.length; i++) {
    const subline = line.substring(i)
    for (const [digitText, digit] of numberLookup) {
      if (subline.startsWith(digitText)) {
        return digit
      }
    }
  }

  throw new Error(`No digit on line: ${line}`)
}

const reverseString = (str: string): string => {
  return Array.from(str).reverse().join("")
}

export default [part1, part2]
