import fs from "fs"

export const readInput = (day: number, filename: string = "input"): string => {
  const dayPadded = day.toString().padStart(2, "0")
  return fs.readFileSync(`./src/${dayPadded}/${filename}.txt`).toString().trim()
}

export const readInputLines = (
  day: number,
  filename: string = "input",
): string[] => {
  const input = readInput(day, filename)
  return input.split("\n")
}

export const readInputLineNumbers = (
  day: number,
  filename: string = "input",
): number[][] => {
  const lines = readInputLines(day, filename)
  return lines.map((line) => line.split(" ").map(Number))
}

export const readInputChunks = (
  day: number,
  filename: string = "input",
): string[][] => {
  const lines = readInputLines(day, filename)

  const chunks: string[][] = []
  let currentChunk: string[] = []

  for (const line of lines) {
    if (line === "") {
      if (currentChunk.length !== 0) {
        chunks.push(currentChunk)
        currentChunk = []
      }
    } else {
      currentChunk.push(line)
    }
  }

  if (currentChunk.length !== 0) {
    chunks.push(currentChunk)
  }

  return chunks
}
