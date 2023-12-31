export class Vector {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  equals(other: Vector): boolean {
    return this.x === other.x && this.y === other.y
  }

  add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y)
  }

  manhattenDist(other: Vector): number {
    return Math.abs(other.x - this.x) + Math.abs(other.y - this.y)
  }

  clone(): Vector {
    return new Vector(this.x, this.y)
  }

  toString() {
    return `(${this.x},${this.y})`
  }
}
