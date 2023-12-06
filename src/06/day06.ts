import { solveQuadratic } from "../utils/math.js"
import { readInputLines } from "../utils/readInput.js"

type Race = {
  time: number
  distance: number
}

const part1 = () => {
  const races = readRaces()
  const racesOptions = races.map(getRaceChargeTimeOptions)
  const options = racesOptions.reduce((acc, r) => acc * r, 1)
  console.log(options)
}

const part2 = () => {}

const readRaces = (): Race[] => {
  const lines = readInputLines(6)
  const splitLines = lines.map((line) => line.split(/\s+/).slice(1).map(Number))

  const races: Race[] = []

  for (let i = 0; i < splitLines[0]!.length; i++) {
    races.push({
      time: splitLines[0]![i]!,
      distance: splitLines[1]![i]!,
    })
  }

  return races
}

const getRaceChargeTimeOptions = (race: Race): number => {
  const [min, max] = getRaceMinMaxChargeTimes(race)
  return max - min + 1
}

const getRaceMinMaxChargeTimes = (race: Race): [number, number] => {
  const solutions = solveQuadratic(-1, race.time, -race.distance)

  if (solutions.length !== 2) {
    throw new Error("No race solutions")
  }

  let min = Math.ceil(solutions[0]!)
  let max = Math.floor(solutions[1]!)

  if (Number.isInteger(solutions[0]!)) {
    min += 1
  }

  if (Number.isInteger(solutions[1]!)) {
    max -= 1
  }

  return [min, max]
}

export default [part1, part2]
