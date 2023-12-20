import { readInputLines } from "../utils/readInput.js"
import { Vector } from "../utils/vector.js"

type Direction = "U" | "R" | "D" | "L"

const Directions = {
  U: new Vector(0, -1),
  R: new Vector(1, 0),
  D: new Vector(0, 1),
  L: new Vector(-1, 0),
} as const satisfies Record<Direction, Vector>

type Instruction = {
  direction: Direction
  distance: number
  colour: string
}

const part1 = () => {
  const instructions = readInstructions()
  digTrench(instructions)
}

const part2 = () => {}

const readInstructions = (): Instruction[] => {
  const input = readInputLines(18)
  return input.map(parseInstruction)
}

const parseInstruction = (line: string): Instruction => {
  const parts = line.split(" ")
  const direction = parts[0] as Direction
  const distance = Number(parts[1])
  const colour = parts[2]!.substring(1, parts[2]!.length - 1)

  return {
    direction,
    distance,
    colour,
  }
}

const digTrench = (instructions: Instruction[]) => {
  const trench = new Set<string>()
  let currentPosition = new Vector(0, 0)

  let minX = Infinity
  let minY = Infinity

  let maxX = -Infinity
  let maxY = -Infinity

  for (const instruction of instructions) {
    const delta = Directions[instruction.direction]
    for (let i = 0; i < instruction.distance; i++) {
      currentPosition = currentPosition.add(delta)
      trench.add(currentPosition.toString())

      minX = Math.min(minX, currentPosition.x)
      maxX = Math.max(maxX, currentPosition.x)
      minY = Math.min(minY, currentPosition.y)
      maxY = Math.max(maxY, currentPosition.y)
    }
  }

  const rectangleArea = (maxX - minX + 1) * (maxY - minY + 1)

  const edgeCells = generateEdgeCells(minX, maxX, minY, maxY)

  const outsideCells = edgeCells.filter((e) => !trench.has(e.toString()))

  const outsideCellsSet = new Set(outsideCells.map((c) => c.toString()))

  while (outsideCells.length !== 0) {
    const edgeCell = outsideCells.pop()!

    for (const direction of Object.values(Directions)) {
      const neighbour = edgeCell.add(direction)

      if (
        neighbour.x < minX ||
        neighbour.x > maxX ||
        neighbour.y < minY ||
        neighbour.y > maxY
      ) {
        continue
      }

      if (trench.has(neighbour.toString())) {
        continue
      }

      if (!outsideCellsSet.has(neighbour.toString())) {
        outsideCells.push(neighbour)
        outsideCellsSet.add(neighbour.toString())
      }
    }
  }

  console.log(rectangleArea - outsideCellsSet.size)
}

const generateEdgeCells = (
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
): Vector[] => {
  const edgeCells: Vector[] = []

  for (let x = minX; x <= maxX; x++) {
    edgeCells.push(new Vector(x, minY), new Vector(x, maxY))
  }

  for (let y = minY + 1; y <= maxY - 1; y++) {
    edgeCells.push(new Vector(minX, y), new Vector(maxX, y))
  }

  return edgeCells
}

export default [part1, part2]
