import { Grid } from "../utils/Grid.js"
import { PriorityQueue } from "../utils/priorityQueue.js"
import { readInputLines } from "../utils/readInput.js"
import { Vector } from "../utils/vector.js"

type CompasDirection = "N" | "E" | "S" | "W"

type State = {
  position: Vector
  lastDirections: CompasDirection[]
}

type Neighbour = {
  state: State
  cost: number
}

const Directions = {
  N: new Vector(0, -1),
  E: new Vector(1, 0),
  S: new Vector(0, 1),
  W: new Vector(-1, 0),
} as const satisfies Record<CompasDirection, Vector>

const oppositeCompasDirection = {
  N: "S",
  S: "N",
  E: "W",
  W: "E",
} as const satisfies Record<CompasDirection, CompasDirection>

const part1 = () => {
  const map = readMap()

  const initialState: State = {
    position: new Vector(0, 0),
    lastDirections: [],
  }

  const queue = new PriorityQueue<State>()
  queue.insert(0, initialState)
  const stateCosts: Record<string, number> = {
    [JSON.stringify(initialState)]: 0,
  }
  const prevState: Record<string, string> = {}

  const goalPosition = new Vector(map.width - 1, map.height - 1)

  let state: State
  let stateStr: string

  while (queue.length !== 0) {
    state = queue.pop()!
    stateStr = JSON.stringify(state)

    const stateCost = stateCosts[stateStr]!

    if (state.position.equals(goalPosition)) {
      break
    }

    const neighbours = getNeighbours(map, state)

    for (const neighbour of neighbours) {
      const neighbourStateStr = JSON.stringify(neighbour.state)

      if (!(neighbourStateStr in stateCosts)) {
        const totalCost = stateCost + neighbour.cost
        queue.insert(totalCost, neighbour.state)
        stateCosts[neighbourStateStr] = totalCost
        prevState[neighbourStateStr] = stateStr
      }
    }
  }

  console.log(stateCosts[stateStr!])

  // let currentStateStr: string | undefined = stateStr!

  // while (currentStateStr && currentStateStr in prevState) {
  //   currentStateStr = prevState[currentStateStr]
  // }
}

const part2 = () => {}

const readMap = (): Grid<number> => {
  const lines = readInputLines(17)
  const numbers = lines.map((l) => l.split("").map((c) => Number(c)))
  const grid = new Grid(numbers)
  return grid
}

const getNeighbours = (map: Grid<number>, state: State): Neighbour[] => {
  const avoidDirections = allThreeEqual(state.lastDirections)
    ? [state.lastDirections[0]!]
    : []

  if (state.lastDirections.length !== 0) {
    const lastDirection = state.lastDirections[state.lastDirections.length - 1]!
    const oppositeDirection = oppositeCompasDirection[lastDirection]
    avoidDirections.push(oppositeDirection)
  }

  const neighbours: Neighbour[] = []

  const nextLastDirections = state.lastDirections.slice(-2)

  for (const [compasDirectionStr, delta] of Object.entries(Directions)) {
    const compasDirection = compasDirectionStr as CompasDirection

    if (avoidDirections.includes(compasDirection)) {
      continue
    }

    const position = state.position.add(delta)
    const cell = map.getCell(position)

    if (!cell) {
      continue
    }

    neighbours.push({
      state: {
        position,
        lastDirections: [...nextLastDirections, compasDirection],
      },
      cost: cell,
    })
  }

  return neighbours
}

const allThreeEqual = <T>(arr: T[]) => {
  if (arr.length !== 3) {
    return false
  }
  return arr.every((e) => e === arr[0])
}

export default [part1, part2]
