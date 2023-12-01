import { exit } from "process"
const args = process.argv.slice(2)

const [dayStr, partStr] = args

if (!dayStr || !partStr) {
  console.error("Day and part are required")
  exit(1)
}

const day = parseInt(dayStr)
const part = parseInt(partStr)

if (![1, 2].includes(part)) {
  console.error("Part must be 1 or 2")
  exit(1)
}

const getDayFns = async (day: number): Promise<[() => void, () => void]> => {
  const dayPadded = day.toString().padStart(2, "0")

  try {
    const dayModule = await import(`./${dayPadded}/day${dayPadded}.ts`)
    return dayModule.default
  } catch (e) {
    console.error(`Failed to load day ${day}`)
    console.error(e)
    exit(1)
  }
}

const dayPartFns = await getDayFns(day)
const dayPartFn = dayPartFns[part - 1]!

dayPartFn()
