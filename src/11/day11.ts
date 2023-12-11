import { readInputLines } from "../utils/readInput.js"
import { Vector } from "../utils/vector.js"

const part1 = () => {
  const lines = readInputLines(11)
  const galaxyPositions: Vector[] = []

  const imageHeight = lines.length
  const imageWidth = lines[0]!.length

  for (let y = 0; y < imageHeight; y++) {
    for (let x = 0; x < imageWidth; x++) {
      if (lines[y]![x] === "#") {
        galaxyPositions.push(new Vector(x, y))
      }
    }
  }

  // Expand rows
  for (let y = imageHeight - 1; y >= 0; y--) {
    const areGalaxiesOnRow = galaxyPositions.some((p) => p.y === y)

    if (!areGalaxiesOnRow) {
      const galaxiesAfterRow = galaxyPositions.filter((p) => p.y > y)
      for (const galaxy of galaxiesAfterRow) {
        galaxy.y += 1
      }
    }
  }

  // Expand columns
  for (let x = imageWidth - 1; x >= 0; x--) {
    const areGalaxiesOnColumn = galaxyPositions.some((p) => p.x === x)

    if (!areGalaxiesOnColumn) {
      const galaxiesAfterColumn = galaxyPositions.filter((p) => p.x > x)
      for (const galaxy of galaxiesAfterColumn) {
        galaxy.x += 1
      }
    }
  }

  let distanceSum = 0

  for (let i = 0; i < galaxyPositions.length - 1; i++) {
    for (let j = i + 1; j < galaxyPositions.length; j++) {
      const g1 = galaxyPositions[i]!
      const g2 = galaxyPositions[j]!
      const distance = Math.abs(g1.y - g2.y) + Math.abs(g1.x - g2.x)
      distanceSum += distance
    }
  }

  console.log(distanceSum)
}

const part2 = () => {}

export default [part1, part2]
