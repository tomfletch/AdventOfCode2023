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

const part2 = () => {
  const conditionRecords = readConditionRecords()
  const unfoldedConditionRecords = conditionRecords.map(unfoldConditionRecord)
  const validOptionCounts = unfoldedConditionRecords.map(getValidOptionCount)
  const total = validOptionCounts.reduce((acc, c) => acc + c)
  console.log(total)
}

const readConditionRecords = (): ConditionRecord[] => {
  const lines = readInputLines(12)
  return lines.map(parseLine)
}

const unfoldConditionRecord = (
  conditionRecord: ConditionRecord,
): ConditionRecord => {
  let rowParts: string[] = []
  const groups: number[] = []

  for (let i = 0; i < 5; i++) {
    rowParts.push(conditionRecord.row)
    groups.push(...conditionRecord.groups)
  }

  return {
    row: rowParts.join(ConditionChar.UNKNOWN),
    groups,
  }
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
  return getOptionCount(conditionRecord.groups, conditionRecord.row)
}

const optionCountCache: Record<string, number> = {}

const getOptionCount = (groups: number[], target: string): number => {
  const key = `${target}-${groups}`

  if (key in optionCountCache) {
    return optionCountCache[key]!
  }

  const group = groups[0]!
  const remainingGroups = groups.slice(1)

  if (groups.length === 1) {
    let count = 0

    for (let i = 0; i <= target.length - group; i++) {
      let option = ConditionChar.OPERATIONAL.repeat(i)
      option += ConditionChar.DAMAGED.repeat(group)
      option += ConditionChar.OPERATIONAL.repeat(target.length - group - i)

      if (isOptionValid(option, target)) {
        count += 1
      }
    }

    optionCountCache[key] = count
    return count
  }

  const minRemaining =
    remainingGroups.reduce((acc, g) => acc + g) + remainingGroups.length - 1
  let count = 0

  for (let i = 0; i < target.length - minRemaining; i++) {
    let optionStart = ConditionChar.OPERATIONAL.repeat(i)
    optionStart += ConditionChar.DAMAGED.repeat(group)
    optionStart += ConditionChar.OPERATIONAL

    if (!isOptionValid(optionStart, target)) {
      continue
    }

    count += getOptionCount(remainingGroups, target.substring(i + group + 1))
  }

  optionCountCache[key] = count
  return count
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
