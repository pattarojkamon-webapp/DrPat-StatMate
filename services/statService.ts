import { StatResult, HistogramBin } from '../types';

export const calculateDescriptives = (data: number[]): StatResult => {
  if (data.length === 0) {
    return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0, n: 0 };
  }

  const n = data.length;
  const sorted = [...data].sort((a, b) => a - b);
  const sum = data.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;
  const min = sorted[0];
  const max = sorted[n - 1];

  // Median
  let median = 0;
  if (n % 2 === 0) {
    median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  } else {
    median = sorted[Math.floor(n / 2)];
  }

  // Std Dev (Sample)
  const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1 || 1);
  const stdDev = Math.sqrt(variance);

  return { mean, median, stdDev, min, max, n };
};

export const generateHistogramData = (data: number[], binCount: number = 5): HistogramBin[] => {
  if (data.length === 0) return [];

  const min = Math.min(...data);
  const max = Math.max(...data);
  
  // If all values are the same
  if (min === max) {
      return [{
          binStart: min,
          binEnd: max,
          count: data.length,
          label: `${min}`
      }];
  }

  const range = max - min;
  const binWidth = range / binCount;
  const bins: HistogramBin[] = [];

  for (let i = 0; i < binCount; i++) {
    const binStart = min + i * binWidth;
    const binEnd = min + (i + 1) * binWidth;
    // Handle floating point precision slightly
    const label = `${binStart.toFixed(1)} - ${binEnd.toFixed(1)}`;
    
    let count = 0;
    if (i === binCount - 1) {
        // Include upper bound for last bin
        count = data.filter(d => d >= binStart && d <= binEnd).length;
    } else {
        count = data.filter(d => d >= binStart && d < binEnd).length;
    }

    bins.push({ binStart, binEnd, count, label });
  }

  return bins;
};

export const calculateTTest = (groupA: number[], groupB: number[]) => {
    const statA = calculateDescriptives(groupA);
    const statB = calculateDescriptives(groupB);

    if (statA.n < 2 || statB.n < 2) return null;

    // Welch's t-test (assumes unequal variances)
    const varA = Math.pow(statA.stdDev, 2);
    const varB = Math.pow(statB.stdDev, 2);
    
    const num = statA.mean - statB.mean;
    const denom = Math.sqrt((varA / statA.n) + (varB / statB.n));
    const tValue = num / denom;

    // Degrees of freedom (Welch-Satterthwaite equation)
    const dfNum = Math.pow((varA / statA.n) + (varB / statB.n), 2);
    const dfDenom = (Math.pow(varA / statA.n, 2) / (statA.n - 1)) + (Math.pow(varB / statB.n, 2) / (statB.n - 1));
    const df = dfNum / dfDenom;

    return {
        tValue,
        df,
        meanDiff: statA.mean - statB.mean,
        statA,
        statB
    };
};

/**
 * Calculate Sample Size using Taro Yamane formula
 * Formula: n = N / (1 + N*e^2)
 * @param N Population Size
 * @param e Error Margin (default 0.05)
 */
export const calculateYamane = (N: number, e: number = 0.05): number => {
  if (N <= 0) return 0;
  const result = N / (1 + N * Math.pow(e, 2));
  return Math.ceil(result); // Always round up for sample size
};

/**
 * Calculate Sample Size using Krejcie & Morgan formula
 * Formula: S = (X^2 * N * P * (1-P)) / (d^2 * (N-1) + X^2 * P * (1-P))
 * Assumes: 
 *  - 95% Confidence (Chi-square X^2 = 3.841)
 *  - P = 0.5 (Maximum variability)
 *  - d = Error Margin (default 0.05)
 * @param N Population Size
 */
export const calculateKrejcieMorgan = (N: number, d: number = 0.05): number => {
  if (N <= 0) return 0;
  
  const chiSquare = 3.841; // Chi-square for 1 df at 95% confidence
  const p = 0.5; // Population proportion (assumed 0.5 for max sample)
  
  const numerator = chiSquare * N * p * (1 - p);
  const denominator = (Math.pow(d, 2) * (N - 1)) + (chiSquare * p * (1 - p));
  
  const result = numerator / denominator;
  return Math.ceil(result);
};