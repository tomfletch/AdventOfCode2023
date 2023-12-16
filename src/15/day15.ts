import { readInput } from "../utils/readInput.js"

const BOX_COUNT = 256

const Operation = {
  ADD: "=",
  REMOVE: "-",
} as const

type Lens = {
  label: string
  focalLength: number
}

type Step = {
  label: string
  labelHash: number
} & (
  | { operation: typeof Operation.REMOVE }
  | { operation: typeof Operation.ADD; focalLength: number }
)

class Box {
  lenses: Lens[]

  constructor() {
    this.lenses = []
  }

  add(lens: Lens) {
    const existingLens = this.lenses.find((l) => l.label === lens.label)

    if (existingLens) {
      existingLens.focalLength = lens.focalLength
    } else {
      this.lenses.push(lens)
    }
  }

  remove(lensLabel: string) {
    this.lenses = this.lenses.filter((l) => l.label !== lensLabel)
  }

  getProcessingPower() {
    let power = 0

    for (let slot = 0; slot < this.lenses.length; slot++) {
      const lens = this.lenses[slot]!
      power += (slot + 1) * lens.focalLength
    }

    return power
  }

  toString() {
    return this.lenses.map((l) => `[${l.label} ${l.focalLength}]`).join(" ")
  }
}

class BoxSystem {
  boxes: Box[]
  constructor(boxCount: number) {
    this.boxes = Array(boxCount)
      .fill(null)
      .map(() => new Box())
  }

  add(boxNumber: number, lens: Lens) {
    const box = this.boxes[boxNumber]!
    box.add(lens)
  }

  remove(boxNumber: number, lensLabel: string) {
    const box = this.boxes[boxNumber]!
    box.remove(lensLabel)
  }

  getProcessingPower() {
    let power = 0

    for (let i = 0; i < this.boxes.length; i++) {
      const box = this.boxes[i]!
      power += (i + 1) * box.getProcessingPower()
    }

    return power
  }

  toString() {
    let str = ""

    for (let i = 0; i < this.boxes.length; i++) {
      const box = this.boxes[i]!
      const lensesString = box.toString()

      if (lensesString) {
        str += `Box ${i}: ${lensesString}\n`
      }
    }

    return str
  }
}

const part1 = () => {
  const steps = readStepStrings()
  const hashes = steps.map(hash)
  const hashSum = hashes.reduce((acc, h) => acc + h)
  console.log(hashSum)
}

const part2 = () => {
  const stepStrings = readStepStrings()
  const steps = stepStrings.map(parseStep)

  const boxSystem = new BoxSystem(BOX_COUNT)

  for (const step of steps) {
    if (step.operation === Operation.ADD) {
      boxSystem.add(step.labelHash, {
        label: step.label,
        focalLength: step.focalLength,
      })
    } else if (step.operation === Operation.REMOVE) {
      boxSystem.remove(step.labelHash, step.label)
    }
  }

  console.log(boxSystem.getProcessingPower())
}

const readStepStrings = (): string[] => {
  const input = readInput(15)
  return input.trim().split(",")
}

const parseStep = (stepString: string): Step => {
  const matches = stepString.match(/^([a-z]+)(=|-)(\d+)?$/)!

  const label = matches[1]!
  const labelHash = hash(label)
  const operation = matches[2]! as (typeof Operation)[keyof typeof Operation]

  if (operation === Operation.ADD) {
    const focalLength = Number(matches[3])

    return {
      label,
      labelHash,
      operation,
      focalLength,
    }
  } else {
    return {
      label,
      labelHash,
      operation,
    }
  }
}

const hash = (text: string): number => {
  let value = 0

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i)
    value += charCode
    value *= 17
    value %= 256
  }

  return value
}

export default [part1, part2]
