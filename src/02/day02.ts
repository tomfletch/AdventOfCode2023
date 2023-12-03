import { readInputLines } from "../utils/readInput.js"

type Subset = {
  red: number
  green: number
  blue: number
}

type Game = {
  id: number
  subsets: Subset[]
}

const BAG_CONTAINS = {
  red: 12,
  green: 13,
  blue: 14,
} as const satisfies Subset

const part1 = () => {
  const lines = readInputLines(2)
  const games = lines.map(parseGame)

  const validGames = games.filter(isValidGame)
  const idSum = validGames.reduce((acc, game) => acc + game.id, 0)
  console.log(idSum)
}

const part2 = () => {
  const lines = readInputLines(2)
  const games = lines.map(parseGame)

  const minSubsets = games.map(getGameMinSubset)
  const powers = minSubsets.map(getSubsetPower)
  const powerSum = powers.reduce((acc, p) => acc + p, 0)
  console.log(powerSum)
}

const parseGame = (line: string): Game => {
  const [gamePart, subsetsPart] = line.split(":")

  if (!gamePart || !subsetsPart) {
    throw new Error(`Failed to parse game: ${line}`)
  }

  const id = parseInt(gamePart.trim().split(" ")[1]!)
  const subsets = subsetsPart.split(";").map(parseSubset)

  return {
    id,
    subsets,
  }
}

const parseSubset = (subsetStr: string): Subset => {
  const parts = subsetStr.split(",")
  const subset: Subset = {
    red: 0,
    green: 0,
    blue: 0,
  }

  for (const part of parts) {
    const [quantity, colour] = part.trim().split(" ")

    if (!quantity || !colour) {
      throw new Error(`Failed to parse subset part: ${part}`)
    }

    const count = parseInt(quantity)

    if (colour === "red" || colour === "green" || colour === "blue") {
      subset[colour] = count
    } else {
      throw new Error(`Invalid colour: ${colour}`)
    }
  }

  return subset
}

const isValidGame = (game: Game): boolean => {
  return game.subsets.every(isValidSubset)
}

const isValidSubset = (subset: Subset): boolean => {
  if (subset.red > BAG_CONTAINS.red) {
    return false
  }

  if (subset.green > BAG_CONTAINS.green) {
    return false
  }

  if (subset.blue > BAG_CONTAINS.blue) {
    return false
  }

  return true
}

const getGameMinSubset = (game: Game): Subset => {
  const minSubset: Subset = {
    red: 0,
    green: 0,
    blue: 0,
  }

  for (const subset of game.subsets) {
    if (subset.red > minSubset.red) {
      minSubset.red = subset.red
    }
    if (subset.green > minSubset.green) {
      minSubset.green = subset.green
    }
    if (subset.blue > minSubset.blue) {
      minSubset.blue = subset.blue
    }
  }

  return minSubset
}

const getSubsetPower = (subset: Subset): number => {
  return subset.red * subset.green * subset.blue
}

export default [part1, part2]
