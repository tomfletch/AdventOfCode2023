import { Grid } from "../utils/Grid.js"
import { readInput } from "../utils/readInput.js"
import { Vector } from "../utils/vector.js"

const TOTAL_CYCLES = 1000000000

const CellType = {
  EMPTY: ".",
  ROUND_ROCK: "O",
  CUBE_ROCK: "#",
} as const

const part1 = () => {
  const grid = readGrid()

  tiltNorth(grid)

  const load = calculateLoad(grid)
  console.log(load)
}

const part2 = () => {
  const grid = readGrid()
  const seenGrids: Record<string, number> = {}
  const gridLoads: Record<string, number> = {}
  let i = 0

  let gridStr = grid.toString()
  let load = calculateLoad(grid)

  seenGrids[gridStr] = i
  gridLoads[i] = load

  while (true) {
    i += 1
    tiltCycle(grid)
    gridStr = grid.toString()
    load = calculateLoad(grid)

    if (gridStr in seenGrids) {
      break
    }

    seenGrids[gridStr] = i
    gridLoads[i] = load
  }

  const iLastTime = seenGrids[gridStr]!
  const difference = i - iLastTime

  const remainder = (TOTAL_CYCLES - i) % difference

  const finalLoad = gridLoads[iLastTime + remainder]!
  console.log(finalLoad)
}

const readGrid = (): Grid<string> => {
  const input = readInput(14)
  return Grid.fromString(input)
}

const calculateLoad = (grid: Grid<string>): number => {
  let totalLoad = 0

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const position = new Vector(x, y)
      const cell = grid.getCell(position)

      if (cell === CellType.ROUND_ROCK) {
        totalLoad += grid.height - y
      }
    }
  }

  return totalLoad
}

const tiltCycle = (grid: Grid<string>) => {
  tiltNorth(grid)
  tiltWest(grid)
  tiltSouth(grid)
  tiltEast(grid)
}

const tiltNorth = (grid: Grid<string>) => {
  for (let x = 0; x < grid.width; x++) {
    const nextAvailablePosition = new Vector(x, 0)

    for (let y = 0; y < grid.height; y++) {
      const currentPosition = new Vector(x, y)
      const cell = grid.getCell(currentPosition)

      if (cell === CellType.ROUND_ROCK) {
        grid.setCell(currentPosition, CellType.EMPTY)
        grid.setCell(nextAvailablePosition, CellType.ROUND_ROCK)
        nextAvailablePosition.y += 1
      } else if (cell === CellType.CUBE_ROCK) {
        nextAvailablePosition.y = y + 1
      }
    }
  }
}

const tiltSouth = (grid: Grid<string>) => {
  for (let x = 0; x < grid.width; x++) {
    const nextAvailablePosition = new Vector(x, grid.height - 1)

    for (let y = grid.height - 1; y >= 0; y--) {
      const currentPosition = new Vector(x, y)
      const cell = grid.getCell(currentPosition)

      if (cell === CellType.ROUND_ROCK) {
        grid.setCell(currentPosition, CellType.EMPTY)
        grid.setCell(nextAvailablePosition, CellType.ROUND_ROCK)
        nextAvailablePosition.y -= 1
      } else if (cell === CellType.CUBE_ROCK) {
        nextAvailablePosition.y = y - 1
      }
    }
  }
}

const tiltWest = (grid: Grid<string>) => {
  for (let y = 0; y < grid.height; y++) {
    const nextAvailablePosition = new Vector(0, y)

    for (let x = 0; x < grid.width; x++) {
      const currentPosition = new Vector(x, y)
      const cell = grid.getCell(currentPosition)

      if (cell === CellType.ROUND_ROCK) {
        grid.setCell(currentPosition, CellType.EMPTY)
        grid.setCell(nextAvailablePosition, CellType.ROUND_ROCK)
        nextAvailablePosition.x += 1
      } else if (cell === CellType.CUBE_ROCK) {
        nextAvailablePosition.x = x + 1
      }
    }
  }
}

const tiltEast = (grid: Grid<string>) => {
  for (let y = 0; y < grid.height; y++) {
    const nextAvailablePosition = new Vector(grid.width - 1, y)

    for (let x = grid.width - 1; x >= 0; x--) {
      const currentPosition = new Vector(x, y)
      const cell = grid.getCell(currentPosition)

      if (cell === CellType.ROUND_ROCK) {
        grid.setCell(currentPosition, CellType.EMPTY)
        grid.setCell(nextAvailablePosition, CellType.ROUND_ROCK)
        nextAvailablePosition.x -= 1
      } else if (cell === CellType.CUBE_ROCK) {
        nextAvailablePosition.x = x - 1
      }
    }
  }
}

export default [part1, part2]
