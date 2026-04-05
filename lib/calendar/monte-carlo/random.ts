/**
 * Random number generation utilities for Monte Carlo simulation.
 *
 * Uses seeded PRNG for reproducibility and Box-Muller transform
 * for normal distribution sampling.
 */

/**
 * Create a seeded pseudo-random number generator using mulberry32 algorithm.
 * Fast and produces good quality random numbers for simulation purposes.
 *
 * @param seed - Initial seed value (uses current timestamp if not provided)
 * @returns Function that returns random numbers in [0, 1)
 */
export function createRNG(seed?: number): () => number {
  let state = seed ?? Date.now();

  return function mulberry32(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Sample from a normal (Gaussian) distribution using Box-Muller transform.
 *
 * @param rng - Random number generator function
 * @param mean - Mean of the distribution
 * @param stdDev - Standard deviation of the distribution
 * @returns A random sample from the normal distribution
 */
export function normalRandom(
  rng: () => number,
  mean: number,
  stdDev: number
): number {
  // Box-Muller transform
  const u1 = rng();
  const u2 = rng();

  // Avoid log(0)
  const safeU1 = Math.max(u1, 1e-10);

  const z0 = Math.sqrt(-2 * Math.log(safeU1)) * Math.cos(2 * Math.PI * u2);
  return mean + z0 * stdDev;
}

/**
 * Sample an integer shift in days for timing variance.
 * Uses uniform distribution over [-maxDays, +maxDays].
 *
 * @param rng - Random number generator function
 * @param maxDays - Maximum days to shift (positive or negative)
 * @returns Integer number of days to shift
 */
export function shiftDays(rng: () => number, maxDays: number): number {
  if (maxDays === 0) return 0;

  // Uniform integer in range [-maxDays, maxDays]
  const range = 2 * maxDays + 1;
  return Math.floor(rng() * range) - maxDays;
}

/**
 * Apply variance to an amount using normal distribution.
 * Ensures result is never negative.
 *
 * @param rng - Random number generator function
 * @param amount - Base amount
 * @param cv - Coefficient of variation (stdDev/mean)
 * @returns Varied amount (always >= 0)
 */
export function varyAmount(
  rng: () => number,
  amount: number,
  cv: number
): number {
  if (cv === 0 || amount === 0) return amount;

  const stdDev = Math.abs(amount) * cv;
  const varied = normalRandom(rng, amount, stdDev);

  // Ensure non-negative for amounts
  return Math.max(0, varied);
}
