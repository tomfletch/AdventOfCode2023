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
  getLeastHeatLoss(false)
}

const part2 = () => {
  getLeastHeatLoss(true)
}

const getLeastHeatLoss = (ultra: boolean) => {
  const map = readMap()

  const goalPosition = new Vector(map.width - 1, map.height - 1)

  const initialState: State = {
    position: new Vector(0, 0),
    lastDirections: [],
  }

  const queue = new PriorityQueue<State>()
  const initialCost = goalPosition.manhattenDist(initialState.position)
  queue.insert(initialCost, initialState)

  const stateCostsG: Record<string, number> = {
    [JSON.stringify(initialState)]: 0,
  }

  const stateCostsF: Record<string, number> = {
    [JSON.stringify(initialState)]: initialCost,
  }

  const prevState: Record<string, string> = {}

  let state: State
  let stateStr: string

  while (queue.length !== 0) {
    state = queue.pop()!
    stateStr = JSON.stringify(state)

    if (state.position.equals(goalPosition)) {
      break
    }

    const neighbours = getNeighbours(map, state, ultra)

    for (const neighbour of neighbours) {
      const neighbourStateStr = JSON.stringify(neighbour.state)

      const tentativeGScore = stateCostsG[stateStr]! + neighbour.cost

      if (tentativeGScore < (stateCostsG[neighbourStateStr] ?? Infinity)) {
        const fScore =
          tentativeGScore + goalPosition.manhattenDist(neighbour.state.position)

        queue.insert(fScore, neighbour.state)
        stateCostsF[neighbourStateStr] = fScore
        stateCostsG[neighbourStateStr] = tentativeGScore
        prevState[neighbourStateStr] = stateStr
      }
    }
  }

  console.log(stateCostsG[stateStr!])

  let currentStateStr: string | undefined = stateStr!

  while (currentStateStr && currentStateStr in prevState) {
    // console.log(currentStateStr)
    currentStateStr = prevState[currentStateStr]
  }
}

const readMap = (): Grid<number> => {
  const lines = readInputLines(17)
  const numbers = lines.map((l) => l.split("").map((c) => Number(c)))
  const grid = new Grid(numbers)
  return grid
}

const getNeighbours = (
  map: Grid<number>,
  state: State,
  ultra: boolean,
): Neighbour[] => {
  const lastDirection = state.lastDirections[state.lastDirections.length - 1]

  const avoidDirections = lastEqual(ultra ? 10 : 3, state.lastDirections)
    ? [lastDirection!]
    : []

  if (state.lastDirections.length !== 0) {
    const oppositeDirection = oppositeCompasDirection[lastDirection!]
    avoidDirections.push(oppositeDirection)
  }

  const mustDirection = !ultra
    ? null
    : !lastEqual(4, state.lastDirections)
      ? lastDirection
      : null

  const neighbours: Neighbour[] = []

  const nextLastDirections = state.lastDirections.slice(ultra ? -9 : -2)

  for (const [compasDirectionStr, delta] of Object.entries(Directions)) {
    const compasDirection = compasDirectionStr as CompasDirection

    if (mustDirection && mustDirection !== compasDirection) {
      continue
    }

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

const lastEqual = <T>(len: number, arr: T[]) => {
  if (arr.length < len) {
    return false
  }

  const lastElement = arr[arr.length - 1]!

  for (let i = arr.length - len; i < arr.length; i++) {
    if (arr[i] !== lastElement) {
      return false
    }
  }

  return true
}

export default [part1, part2]
