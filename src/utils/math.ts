export const solveQuadratic = (a: number, b: number, c: number): number[] => {
  const discriminant = b * b - 4 * a * c

  if (discriminant < 0) {
    return []
  }

  if (discriminant === 0) {
    return [-b / (2 * a)]
  }

  const discriminantSqrt = Math.sqrt(discriminant)

  return [(-b + discriminantSqrt) / (2 * a), (-b - discriminantSqrt) / (2 * a)]
}

export const gcd = (a: number, b: number): number => {
  return !b ? a : gcd(b, a % b)
}

export const lcm = (a: number, b: number): number => {
  return (a * b) / gcd(a, b)
}

export const lcmAll = (arr: number[]): number => {
  let multiple = arr[0]!
  for (const value of arr) {
    multiple = lcm(multiple, value)
  }
  return multiple
}
