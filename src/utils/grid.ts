import { Vector } from "./vector.js"

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

  forEachCell(cb: (cell: T, position: Vector) => void) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.cells[y]![x]!
        const position = new Vector(x, y)
        cb(cell, position)
      }
    }
  }
}
