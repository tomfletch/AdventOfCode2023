import type { Vector } from "./vector.js"

export class Grid<T> {
  width: number
  height: number
  cells: T[][]

  constructor(cells: T[][]) {
    this.width = cells[0]!.length
    this.height = cells.length
    this.cells = cells
  }

  static fromString(gridStr: string): Grid<string> {
    const lines = gridStr.trim().split("\n")
    const cells: string[][] = []

    for (const line of lines) {
      const row = line.split("")
      cells.push(row)
    }

    return new Grid(cells)
  }

  getCell(position: Vector): T | null {
    if (position.x < 0 || position.x >= this.width) {
      return null
    }

    if (position.y < 0 || position.y >= this.height) {
      return null
    }

    return this.cells[position.y]![position.x]!
  }
}
