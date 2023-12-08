import { lcmAll } from "../utils/math.js"
import { readInputChunks } from "../utils/readInput.js"

const part1 = () => {
  const { instructions, nodeMap } = readInstructionsAndNodeMap()

  const startNode = nodeMap["AAA"]!
  const endNode = nodeMap["ZZZ"]!

  let instructionCount = 0
  let currentNode = startNode

  while (currentNode !== endNode) {
    const instruction = instructions[instructionCount % instructions.length]

    if (instruction === "L") {
      currentNode = currentNode.left!
    } else {
      currentNode = currentNode.right!
    }

    instructionCount += 1
  }

  console.log(instructionCount)
}

const part2 = () => {
  const { instructions, nodeMap } = readInstructionsAndNodeMap()

  const startingNodes = Object.values(nodeMap).filter(isStartNode)

  let counts: number[] = []

  for (const startingNode of startingNodes) {
    let currentNode = startingNode

    let instructionCount = 0

    while (!isEndNode(currentNode)) {
      for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i]

        if (instruction === "L") {
          currentNode = currentNode!.left!
        } else {
          currentNode = currentNode!.right!
        }
      }

      instructionCount += instructions.length
    }

    counts.push(instructionCount)
  }

  const totalInstructionCount = lcmAll(counts)
  console.log(totalInstructionCount)
}

class Node {
  id: string
  leftId: string
  rightId: string
  left: Node | undefined
  right: Node | undefined

  constructor(id: string, leftId: string, rightId: string) {
    this.id = id
    this.leftId = leftId
    this.rightId = rightId
  }
}

const isStartNode = (node: Node) => node.id[2] === "A"
const isEndNode = (node: Node) => node.id[2] === "Z"

const readInstructionsAndNodeMap = () => {
  const [instructionsLines, networkLines] = readInputChunks(8)
  const instructions = instructionsLines![0]!

  const nodeMap: { [key: string]: Node } = {}

  networkLines!.forEach((nodeLine) => {
    const node = parseNodeLine(nodeLine)
    nodeMap[node.id] = node
  })

  for (const node of Object.values(nodeMap)) {
    node.left = nodeMap[node.leftId]
    node.right = nodeMap[node.rightId]
  }

  return { instructions, nodeMap }
}

const parseNodeLine = (line: string): Node => {
  const matches = line.match(/[A-Z0-9]{3}/g)
  return new Node(matches![0]!, matches![1]!, matches![2]!)
}

export default [part1, part2]
