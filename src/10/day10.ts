import { Grid } from "../utils/Grid.js"
import { readInput } from "../utils/readInput.js"
import { Vector } from "../utils/vector.js"

const Direction = {
  NORTH: "NORTH",
  SOUTH: "SOUTH",
  EAST: "EAST",
  WEST: "WEST",
} as const

type Direction = (typeof Direction)[keyof typeof Direction]

const CellType = {
  NORTH_SOUTH: "NORTH_SOUTH",
  EAST_WEST: "EAST_WEST",
  NORTH_EAST: "NORTH_EAST",
  NORTH_WEST: "NORTH_WEST",
  SOUTH_WEST: "SOUTH_WEST",
  SOUTH_EAST: "SOUTH_EAST",
  GROUND: "GROUND",
  START: "START",
} as const

type CellType = (typeof CellType)[keyof typeof CellType]

const CharCellTypeMap = {
  "|": CellType.NORTH_SOUTH,
  "-": CellType.EAST_WEST,
  L: CellType.NORTH_EAST,
  J: CellType.NORTH_WEST,
  "7": CellType.SOUTH_WEST,
  F: CellType.SOUTH_EAST,
  ".": CellType.GROUND,
  S: CellType.START,
} as const satisfies Record<string, CellType>

const CellTypeDisplayCharMap = {
  [CellType.NORTH_SOUTH]: "│",
  [CellType.EAST_WEST]: "─",
  [CellType.NORTH_EAST]: "└",
  [CellType.NORTH_WEST]: "┘",
  [CellType.SOUTH_WEST]: "┐",
  [CellType.SOUTH_EAST]: "┌",
  [CellType.GROUND]: " ",
  [CellType.START]: "S",
} as const satisfies Record<CellType, string>

const DirectionCellTypes = {
  [Direction.NORTH]: [
    CellType.NORTH_SOUTH,
    CellType.SOUTH_WEST,
    CellType.SOUTH_EAST,
  ],
  [Direction.SOUTH]: [
    CellType.NORTH_SOUTH,
    CellType.NORTH_WEST,
    CellType.NORTH_EAST,
  ],
  [Direction.EAST]: [
    CellType.EAST_WEST,
    CellType.NORTH_WEST,
    CellType.SOUTH_WEST,
  ],
  [Direction.WEST]: [
    CellType.EAST_WEST,
    CellType.NORTH_EAST,
    CellType.SOUTH_EAST,
  ],
} as Record<Direction, readonly CellType[]>

const CellTypeDirections = {
  [CellType.NORTH_SOUTH]: [Direction.NORTH, Direction.SOUTH],
  [CellType.EAST_WEST]: [Direction.EAST, Direction.WEST],
  [CellType.NORTH_EAST]: [Direction.NORTH, Direction.EAST],
  [CellType.NORTH_WEST]: [Direction.NORTH, Direction.WEST],
  [CellType.SOUTH_WEST]: [Direction.SOUTH, Direction.WEST],
  [CellType.SOUTH_EAST]: [Direction.SOUTH, Direction.EAST],
} as Record<CellType, [Direction, Direction]>

const OppositeDirections = {
  [Direction.NORTH]: Direction.SOUTH,
  [Direction.SOUTH]: Direction.NORTH,
  [Direction.EAST]: Direction.WEST,
  [Direction.WEST]: Direction.EAST,
} as const satisfies Record<Direction, Direction>

const part1 = () => {
  const inputString = readInput(10)
  const grid = Grid.fromStringWithMap(inputString, CharCellTypeMap)
  // console.log(grid.toString(CellTypeDisplayCharMap))

  const startPosition = findStartPosition(grid)
  let position = startPosition
  let direction = findFirstDirection(grid, startPosition)
  let cell = grid.getCell(position)!

  const positions: Vector[] = []

  do {
    const delta = DIRECTIONS[direction]
    position = position.add(delta)
    cell = grid.getCell(position)!

    if (cell !== "START") {
      direction = getOutputDirection(cell, direction)
    }

    positions.push(position)
  } while (cell !== "START")

  console.log(positions.length / 2)
}

const getOutputDirection = (
  cellType: CellType,
  inputDirection: Direction,
): Direction => {
  const cellTypeDirections = CellTypeDirections[cellType]

  for (const direction of cellTypeDirections) {
    if (direction !== OppositeDirections[inputDirection]) {
      return direction
    }
  }

  throw new Error("Failed to follow pipe")
}

const findFirstDirection = (
  grid: Grid<CellType>,
  startPosition: Vector,
): Direction => {
  for (const direction in DIRECTIONS) {
    const compasDirection = direction as Direction
    const delta = DIRECTIONS[compasDirection]
    const nextPosition = startPosition.add(delta)
    const cell = grid.getCell(nextPosition)
    const possibleCells = DirectionCellTypes[compasDirection]
    if (cell && possibleCells.includes(cell)) {
      return compasDirection
    }
  }

  throw new Error("Failed to find a first direction")
}

const findStartPosition = (grid: Grid<CellType>): Vector => {
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const position = new Vector(x, y)
      const cell = grid.getCell(position)
      if (cell === CellType.START) {
        return position
      }
    }
  }

  throw new Error("Failed to find start position")
}

const DIRECTIONS = {
  [Direction.EAST]: new Vector(1, 0),
  [Direction.SOUTH]: new Vector(0, 1),
  [Direction.WEST]: new Vector(-1, 0),
  [Direction.NORTH]: new Vector(0, -1),
} as const satisfies Record<Direction, Vector>

const part2 = () => {}

export default [part1, part2]
