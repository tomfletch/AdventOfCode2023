import { Range } from "../utils/range.js"
import { readInputChunks } from "../utils/readInput.js"

type AlmanacMapItem = {
  sourceRange: Range
  offset: number
}

type AlmanacMap = AlmanacMapItem[]

type Input = {
  seeds: number[]
  maps: AlmanacMap[]
}

const part1 = () => {
  const chunks = readInputChunks(5)

  const seedsChunk = chunks.shift()
  const seeds = parseSeedsLine(seedsChunk![0]!)

  const maps = parseMaps(chunks)

  const locations = seeds.map((seed) => getSeedLocation(seed, maps))

  const minLocation = Math.min(...locations)
  console.log(minLocation)
}

const part2 = () => {
  const chunks = readInputChunks(5)

  const seedsChunk = chunks.shift()
  const seedRanges = parseSeedRanges(seedsChunk![0]!)

  const maps = parseMaps(chunks)

  const locationRanges = seedRanges
    .map((seedRange) => getSeedLocationRanges(seedRange, maps))
    .flat()

  const locationRangeStarts = locationRanges.map((r) => r.start)
  const minLocation = Math.min(...locationRangeStarts)

  console.log(minLocation)
}

const parseSeedsLine = (line: string): number[] => {
  const parts = line.split(":")
  const seeds = parts[1]!.trim().split(" ")
  return seeds.map(Number)
}

const parseSeedRanges = (line: string): Range[] => {
  const parts = line.split(":")
  const values = parts[1]!.trim().split(" ").map(Number)

  const seedRanges: Range[] = []

  for (let i = 0; i < values.length; i += 2) {
    const start = values[i]!
    const length = values[i + 1]!

    seedRanges.push(Range.fromLength(start, length))
  }

  return seedRanges
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

  const destinationRangeStart = parts[0]!
  const sourceRangeStart = parts[1]!
  const rangeLength = parts[2]!

  return {
    sourceRange: new Range(
      sourceRangeStart,
      sourceRangeStart + rangeLength - 1,
    ),
    offset: destinationRangeStart - sourceRangeStart,
  }
}

const getSeedLocation = (seed: number, maps: AlmanacMap[]): number => {
  let id = seed

  for (const map of maps) {
    id = transformIdWithMap(id, map)
  }

  return id
}

const transformIdWithMap = (id: number, map: AlmanacMap): number => {
  for (const mapItem of map) {
    if (mapItem.sourceRange.contains(id)) {
      return id + mapItem.offset
    }
  }

  return id
}

const getSeedLocationRanges = (
  seedRange: Range,
  maps: AlmanacMap[],
): Range[] => {
  let ranges: Range[] = [seedRange]

  for (const map of maps) {
    ranges = transformRangesWithMap(ranges, map)
  }

  return ranges
}

const transformRangesWithMap = (ranges: Range[], map: AlmanacMap): Range[] => {
  let newRanges: Range[] = []

  for (const range of ranges) {
    let leftoverRanges = [range]
    for (const mapItem of map) {
      for (const range of leftoverRanges) {
        leftoverRanges = range.subtract(mapItem.sourceRange)
        const intersection = range.intersect(mapItem.sourceRange)

        if (intersection) {
          newRanges.push(
            new Range(
              intersection.start + mapItem.offset,
              intersection.end + mapItem.offset,
            ),
          )
        }
      }
    }
    newRanges.push(...leftoverRanges)
  }

  return newRanges
}

export default [part1, part2]
