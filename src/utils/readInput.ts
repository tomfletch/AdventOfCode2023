import fs from "fs"

export const readInputLines = (day: number) => {
  const input = readInput(day)
  return input.split("\n")
}

export const readInput = (day: number) => {
  const dayPadded = day.toString().padStart(2, "0")
  return fs.readFileSync(`./src/${dayPadded}/input.txt`).toString().trim()
}
