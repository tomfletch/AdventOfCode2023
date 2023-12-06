export class Range {
  start: number
  end: number

  constructor(start: number, end: number) {
    this.start = start
    this.end = end
  }

  static fromLength(start: number, length: number) {
    return new Range(start, start + length - 1)
  }

  intersect(other: Range): Range | null {
    const newStart = Math.max(this.start, other.start)
    const newEnd = Math.min(this.end, other.end)

    if (newStart > newEnd) {
      return null
    }

    return new Range(newStart, newEnd)
  }

  subtract(other: Range): Range[] {
    if (other.start > this.end || other.end < this.start) {
      return [new Range(this.start, this.end)]
    }

    if (other.start <= this.start && other.end >= this.end) {
      return []
    }

    if (other.start > this.start && other.end >= this.end) {
      return [new Range(this.start, other.start - 1)]
    }

    if (other.start <= this.start && other.end < this.end) {
      return [new Range(other.end + 1, this.end)]
    }

    return [
      new Range(this.start, other.start - 1),
      new Range(other.end + 1, this.end),
    ]
  }

  contains(value: number) {
    return value >= this.start && value <= this.end
  }

  toString(): string {
    return `[${this.start},${this.end}]`
  }
}
