import fs from "fs"
import { exit } from "process"
import { Readable } from "stream"
import { finished } from "stream/promises"
import dotenv from "dotenv"

dotenv.config()

const USER_AGENT =
  "https://github.com/tomfletch/AdventOfCode2023 by thomasmatthewfletcher@gmail.com"
const YEAR = 2023
const SESSION_ID = process.env.SESSION_ID

if (!SESSION_ID) {
  console.error("SESSION_ID is not specified")
}

const dayStr = process.argv[2]

if (!dayStr) {
  console.error("Must specify for which day to download input")
  exit(1)
}

const day = parseInt(dayStr)

if (day < 1 || day > 25) {
  console.error("Day must be between 1 and 25")
  exit(1)
}

const inputUrl = `https://adventofcode.com/${YEAR}/day/${dayStr}/input`

const dayPadded = day.toString().padStart(2, "0")
const directory = `src/${dayPadded}`

fs.mkdirSync(directory, { recursive: true })
const stream = fs.createWriteStream(`${directory}/input.txt`)

const { body } = await fetch(inputUrl, {
  headers: {
    Cookie: `session=${SESSION_ID}`,
    "User-Agent": USER_AGENT,
  },
})

if (!body) {
  console.error("Failed to download input")
  exit(1)
}

await finished(Readable.fromWeb(body).pipe(stream))
