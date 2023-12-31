import { Grid } from "../utils/Grid.js"
import { readInputChunks } from "../utils/readInput.js"
import { Vector } from "../utils/vector.js"

const part1 = () => {
  const mapGrids = readMapGrids()
  const mapValues = mapGrids.map((m) => getMapValue(m, false))
  const sum = mapValues.reduce((acc, v) => acc + v)
  console.log(sum)
}

const part2 = () => {
  const mapGrids = readMapGrids()
  const mapValues = mapGrids.map((m) => getMapValue(m, true))
  const sum = mapValues.reduce((acc, v) => acc + v)
  console.log(sum)
}

const readMapGrids = (): Grid<string>[] => {
  const maps = readInputChunks(13)
  const mapGrids = maps.map((m) => new Grid(m.map((r) => r.split(""))))
  return mapGrids
}

const getMapValue = (mapGrid: Grid<string>, oneMistake: boolean): number => {
  const verticalReflection = findVerticalReflection(mapGrid, oneMistake)

  if (verticalReflection !== null) {
    return verticalReflection + 1
  }

  const horizontalReflection = findHorizontalReflection(mapGrid, oneMistake)

  if (horizontalReflection !== null) {
    return (horizontalReflection + 1) * 100
  }

  throw new Error("Failed to find reflection line")
}

const findVerticalReflection = (
  mapGrid: Grid<string>,
  oneMistake: boolean,
): number | null => {
  for (let i = 0; i < mapGrid.width - 1; i++) {
    if (isVerticalReflection(mapGrid, i, oneMistake)) {
      return i
    }
  }

  return null
}

const findHorizontalReflection = (
  mapGrid: Grid<string>,
  oneMistake: boolean,
): number | null => {
  for (let i = 0; i < mapGrid.height - 1; i++) {
    if (isHorizontalReflection(mapGrid, i, oneMistake)) {
      return i
    }
  }

  return null
}

const isVerticalReflection = (
  mapGrid: Grid<string>,
  reflectionLine: number,
  oneMistake: boolean,
): boolean => {
  const distanceFromLeft = reflectionLine + 1
  const distanceFromRight = mapGrid.width - reflectionLine - 1
  const reflectionDistance = Math.min(distanceFromLeft, distanceFromRight)

  let mistakes = 0

  for (let y = 0; y < mapGrid.height; y++) {
    for (let dist = 0; dist < reflectionDistance; dist++) {
      const leftX = reflectionLine - dist
      const rightX = reflectionLine + dist + 1

      const leftCell = mapGrid.getCell(new Vector(leftX, y))
      const rightCell = mapGrid.getCell(new Vector(rightX, y))

      if (leftCell !== rightCell) {
        mistakes += 1

        if (mistakes > (oneMistake ? 1 : 0)) {
          return false
        }
      }
    }
  }

  return mistakes === (oneMistake ? 1 : 0)
}

const isHorizontalReflection = (
  mapGrid: Grid<string>,
  reflectionLine: number,
  oneMistake: boolean,
): boolean => {
  const distanceFromTop = reflectionLine + 1
  const distanceFromBottom = mapGrid.height - reflectionLine - 1
  const reflectionDistance = Math.min(distanceFromTop, distanceFromBottom)

  let mistakes = 0

  for (let x = 0; x < mapGrid.width; x++) {
    for (let dist = 0; dist < reflectionDistance; dist++) {
      const topY = reflectionLine - dist
      const bottomY = reflectionLine + dist + 1

      const topCell = mapGrid.getCell(new Vector(x, topY))
      const bottomCell = mapGrid.getCell(new Vector(x, bottomY))

      if (topCell !== bottomCell) {
        mistakes += 1

        if (mistakes > (oneMistake ? 1 : 0)) {
          return false
        }
      }
    }
  }

  return mistakes === (oneMistake ? 1 : 0)
}

export default [part1, part2]
