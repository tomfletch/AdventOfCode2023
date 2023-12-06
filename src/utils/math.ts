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
