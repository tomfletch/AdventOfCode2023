import { Grid } from "../utils/Grid.js"
import { readInput } from "../utils/readInput.js"
import { Vector } from "../utils/vector.js"

type SchematicNumber = {
  number: number
  position: Vector
  length: number
}

const part1 = () => {
  const inputString = readInput(3)
  const grid = Grid.fromString(inputString)
  const schematicNumbers = findSchematicNumbers(grid)

  let partNumberSum = 0

  for (const schematicNumber of schematicNumbers) {
    if (isPartNumber(schematicNumber, grid)) {
      partNumberSum += schematicNumber.number
    }
  }

  console.log(partNumberSum)
}

const part2 = () => {}

const findSchematicNumbers = (grid: Grid<string>) => {
  const schematicNumbers: SchematicNumber[] = []

  for (let y = 0; y < grid.height; y++) {
    let schematicNumber: SchematicNumber | null = null

    for (let x = 0; x < grid.width; x++) {
      const position = new Vector(x, y)
      const cell = grid.getCell(position)!

      if (cell >= "0" && cell <= "9") {
        if (!schematicNumber) {
          schematicNumber = {
            number: 0,
            position,
            length: 0,
          }
        }

        schematicNumber.number = schematicNumber.number * 10 + parseInt(cell)
        schematicNumber.length += 1
      } else {
        if (schematicNumber) {
          schematicNumbers.push(schematicNumber)
          schematicNumber = null
        }
      }
    }

    if (schematicNumber) {
      schematicNumbers.push(schematicNumber)
    }
  }

  return schematicNumbers
}

const isPartNumber = (
  schematicNumber: SchematicNumber,
  grid: Grid<string>,
): boolean => {
  const { position } = schematicNumber

  for (let i = -1; i <= schematicNumber.length; i++) {
    if (i === -1 || i === schematicNumber.length) {
      const sidePosition = new Vector(position.x + i, position.y)

      if (isSymbolAtPosition(grid, sidePosition)) {
        return true
      }
    }

    const abovePosition = new Vector(position.x + i, position.y - 1)

    if (isSymbolAtPosition(grid, abovePosition)) {
      return true
    }

    const belowPosition = new Vector(position.x + i, position.y + 1)

    if (isSymbolAtPosition(grid, belowPosition)) {
      return true
    }
  }

  return false
}

const isSymbolAtPosition = (grid: Grid<string>, position: Vector): boolean => {
  const cell = grid.getCell(position)

  if (!cell) {
    return false
  }

  return isSymbol(cell)
}

const isSymbol = (cell: string): boolean => {
  const isNumber = cell >= "0" && cell <= "9"
  return cell !== "." && !isNumber
}

export default [part1, part2]
