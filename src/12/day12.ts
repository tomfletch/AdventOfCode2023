import { readInputLines } from "../utils/readInput.js"

type ConditionRecord = {
  row: string
  groups: number[]
}

const ConditionChar = {
  OPERATIONAL: ".",
  DAMAGED: "#",
  UNKNOWN: "?",
} as const

const part1 = () => {
  const conditionRecords = readConditionRecords()
  const validOptionCounts = conditionRecords.map(getValidOptionCount)
  const total = validOptionCounts.reduce((acc, c) => acc + c)
  console.log(total)
}

const part2 = () => {}

const readConditionRecords = (): ConditionRecord[] => {
  const lines = readInputLines(12)
  return lines.map(parseLine)
}

const parseLine = (line: string): ConditionRecord => {
  const [row, groupsString] = line.split(" ")

  const groups = groupsString!.split(",").map(Number)

  return {
    row: row!,
    groups,
  }
}

const getValidOptionCount = (conditionRecord: ConditionRecord): number => {
  const options = getOptions(conditionRecord.row.length, conditionRecord.groups)
  const validOptions = options.filter((o) =>
    isOptionValid(o, conditionRecord.row),
  )
  return validOptions.length
}

const getOptions = (length: number, groups: number[]): string[] => {
  const group = groups[0]!
  const remainingGroups = groups.slice(1)

  if (groups.length === 1) {
    const options: string[] = []

    for (let i = 0; i <= length - group; i++) {
      let option = ConditionChar.OPERATIONAL.repeat(i)
      option += ConditionChar.DAMAGED.repeat(group)
      option += ConditionChar.OPERATIONAL.repeat(length - group - i)
      options.push(option)
    }

    return options
  }

  const minRemaining =
    remainingGroups.reduce((acc, g) => acc + g) + remainingGroups.length - 1
  const options: string[] = []

  for (let i = 0; i < length - minRemaining; i++) {
    let optionStart = ConditionChar.OPERATIONAL.repeat(i)
    optionStart += ConditionChar.DAMAGED.repeat(group)
    optionStart += ConditionChar.OPERATIONAL

    const endOptions = getOptions(length - i - group - 1, remainingGroups)

    for (const endOption of endOptions) {
      options.push(`${optionStart}${endOption}`)
    }
  }

  return options
}

const isOptionValid = (option: string, record: string): boolean => {
  for (let i = 0; i < option.length; i++) {
    if (option[i] !== record[i] && record[i] !== ConditionChar.UNKNOWN) {
      return false
    }
  }

  return true
}

export default [part1, part2]
