import { readInputLines } from "../utils/readInput.js"
import { Vector } from "../utils/vector.js"

abstract class Item {
  position: Vector

  constructor(position: Vector) {
    this.position = position
  }

  abstract interact(beam: Beam): Beam[]
}

class MirrorNE extends Item {
  interact(beam: Beam) {
    const newBeamPosition = this.position.clone()

    const { x, y } = beam.direction
    return [new Beam(newBeamPosition, new Vector(y * -1, x * -1))]
  }
}

class MirrorNW extends Item {
  interact(beam: Beam) {
    const newBeamPosition = this.position.clone()

    const { x, y } = beam.direction
    return [new Beam(newBeamPosition, new Vector(y, x))]
  }
}

class SplitterH extends Item {
  interact(beam: Beam) {
    const newBeamPosition = this.position.clone()

    const { x, y } = beam.direction

    if (y === 1 || y === -1) {
      return [
        new Beam(newBeamPosition, new Vector(-1, 0)),
        new Beam(newBeamPosition, new Vector(1, 0)),
      ]
    }

    return [new Beam(newBeamPosition, beam.direction.clone())]
  }
}

class SplitterV extends Item {
  interact(beam: Beam) {
    const newBeamPosition = this.position.clone()

    const { x, y } = beam.direction

    if (x === 1 || x === -1) {
      return [
        new Beam(newBeamPosition, new Vector(0, -1)),
        new Beam(newBeamPosition, new Vector(0, 1)),
      ]
    }

    return [new Beam(newBeamPosition, beam.direction.clone())]
  }
}

class Beam {
  position: Vector
  direction: Vector

  constructor(position: Vector, direction: Vector) {
    this.position = position
    this.direction = direction
  }

  toString() {
    return `[${this.position},${this.direction}]`
  }
}

class Contraption {
  width: number
  height: number
  items: Record<string, Item>
  beams: Set<string>
  energizedTiles: Set<string>

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.items = {}
    this.beams = new Set()
    this.energizedTiles = new Set()
  }

  addItem(item: Item) {
    this.items[item.position.toString()] = item
  }

  addBeam(startBeam: Beam) {
    const startPosition = startBeam.position.clone()
    const beams = [startBeam]

    while (beams.length !== 0) {
      const beam = beams.pop()!

      if (!beam.position.equals(startPosition)) {
        this.energizedTiles.add(beam.position.toString())
      }

      // Get next beam positions
      beam.position = beam.position.add(beam.direction)

      if (beam.position.x < 0 || beam.position.x >= this.width) {
        continue
      }

      if (beam.position.y < 0 || beam.position.y >= this.height) {
        continue
      }

      const item = this.items[beam.position.toString()]

      let newBeams: Beam[] = []

      if (item) {
        newBeams = item.interact(beam)
      } else {
        newBeams = [beam]
      }

      for (const newBeam of newBeams) {
        if (!this.beams.has(newBeam.toString())) {
          this.beams.add(newBeam.toString())
          beams.push(newBeam)
        }
      }
    }
  }

  countEnergizedTiles(): number {
    return this.energizedTiles.size
  }
}

const part1 = () => {
  const input = readInputLines(16)
  const contraption = parseContraption(input)
  const startingBeam = new Beam(new Vector(-1, 0), new Vector(1, 0))
  contraption.addBeam(startingBeam)

  console.log(contraption.countEnergizedTiles())
}

const parseContraption = (input: string[]): Contraption => {
  const width = input[0]!.length
  const height = input.length

  const contraption = new Contraption(width, height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const char = input[y]![x]!
      const position = new Vector(x, y)

      const item = buildItem(char, position)

      if (item) {
        contraption.addItem(item)
      }
    }
  }

  return contraption
}

const buildItem = (char: string, position: Vector): Item | null => {
  if (char === "/") {
    return new MirrorNE(position)
  }

  if (char === "\\") {
    return new MirrorNW(position)
  }

  if (char === "|") {
    return new SplitterV(position)
  }

  if (char === "-") {
    return new SplitterH(position)
  }

  return null
}

const part2 = () => {
  let maxEnergizedTiles = 0

  const input = readInputLines(16)
  const contraption = parseContraption(input)

  const startingBeams: Beam[] = []

  for (let y = 0; y < contraption.height; y++) {
    startingBeams.push(
      new Beam(new Vector(-1, y), new Vector(1, 0)),
      new Beam(new Vector(contraption.width, y), new Vector(-1, 0)),
    )
  }

  for (let x = 0; x < contraption.width; x++) {
    startingBeams.push(
      new Beam(new Vector(x, -1), new Vector(0, 1)),
      new Beam(new Vector(x, contraption.height), new Vector(0, -1)),
    )
  }

  for (const startingBeam of startingBeams) {
    const contraption = parseContraption(input)
    contraption.addBeam(startingBeam)

    const count = contraption.countEnergizedTiles()
    if (count > maxEnergizedTiles) {
      maxEnergizedTiles = count
    }
  }

  console.log(maxEnergizedTiles)
}

export default [part1, part2]
