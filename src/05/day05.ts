import { readInputChunks } from "../utils/readInput.js"

type AlmanacMapItem = {
  destinationRangeStart: number
  sourceRangeStart: number
  rangeLength: number
}

type AlmanacMap = AlmanacMapItem[]

type Input = {
  seeds: number[]
  maps: AlmanacMap[]
}

const part1 = () => {
  const { seeds, maps } = readInput()

  const locations = seeds.map((seed) => getSeedLocation(seed, maps))

  const minLocation = Math.min(...locations)
  console.log(minLocation)
}

const part2 = () => {}

const readInput = (): Input => {
  const chunks = readInputChunks(5)

  const seedsChunk = chunks.shift()
  const seeds = parseSeedsLine(seedsChunk![0]!)

  const maps = parseMaps(chunks)
  return { seeds, maps }
}

const parseSeedsLine = (line: string): number[] => {
  const parts = line.split(":")
  const seeds = parts[1]!.trim().split(" ")
  return seeds.map(Number)
}

const parseMaps = (chunks: string[][]): AlmanacMap[] => {
  return chunks.map(parseMap)
}

const parseMap = (lines: string[]): AlmanacMap => {
  lines.shift()
  return lines.map(parseMapItem)
}

const parseMapItem = (line: string): AlmanacMapItem => {
  const parts = line.split(" ").map(Number)
  return {
    destinationRangeStart: parts[0]!,
    sourceRangeStart: parts[1]!,
    rangeLength: parts[2]!,
  }
}

const getSeedLocation = (seed: number, maps: AlmanacMap[]) => {
  let id = seed

  for (const map of maps) {
    id = transformIdWithMap(id, map)
  }

  return id
}

const transformIdWithMap = (id: number, map: AlmanacMap): number => {
  for (const mapItem of map) {
    if (
      id >= mapItem.sourceRangeStart &&
      id < mapItem.sourceRangeStart + mapItem.rangeLength
    ) {
      return (id =
        id - mapItem.sourceRangeStart + mapItem.destinationRangeStart)
    }
  }

  return id
}

export default [part1, part2]
