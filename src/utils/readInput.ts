import fs from "fs"

export const readInputLines = (day: number) => {
  const input = readInput(day)
  return input.split("\n")
}

export const readInput = (day: number, filename: string = "input") => {
  const dayPadded = day.toString().padStart(2, "0")
  return fs.readFileSync(`./src/${dayPadded}/${filename}.txt`).toString().trim()
}
