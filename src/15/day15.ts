import { readInput } from "../utils/readInput.js"

const part1 = () => {
  const steps = readSteps()
  const hashes = steps.map(hash)
  const hashSum = hashes.reduce((acc, h) => acc + h)
  console.log(hashSum)
}

const part2 = () => {}

const readSteps = (): string[] => {
  const input = readInput(15)
  return input.trim().split(",")
}

const hash = (text: string): number => {
  let value = 0

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i)
    value += charCode
    value *= 17
    value %= 256
  }

  return value
}

export default [part1, part2]
