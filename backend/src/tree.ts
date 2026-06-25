
import type { Outcome, TrainingRow, Sample } from "./types";
import { dataset } from "./dataset";


export function gini(rows: TrainingRow[]): number {

if (rows.length === 0) return 0; 

const counts: Record<string, number> = {};

  for (const row of rows) {
    counts[row.outcome] = (counts[row.outcome] ?? 0) + 1;
}

let sumOfSquares = 0;
  for (const count of Object.values(counts)) {
    const p = count / rows.length;
    sumOfSquares += p * p;
  }

  return 1 - sumOfSquares;
}


////////////////////////////////////////////////////


// Object describing a split of the dataset into two halves.
export type Split = {
  feature: keyof Sample;
  threshold: number | string;
  gain: number;
  left: TrainingRow[];
  right: TrainingRow[];
};

// Splits rows into [left, right] for a given feature + threshold.
// Numeric: left = value < threshold.  Categorical: left = value === threshold.
function partition(rows: TrainingRow[], feature: keyof Sample, threshold: number | string): 
[TrainingRow[], TrainingRow[]] {
    
  const left: TrainingRow[] = [];
  const right: TrainingRow[] = [];
  for (const row of rows) {
    const value = row[feature];
    const goesLeft =
      typeof value === "number" ? value < (threshold as number) : value === threshold;
    if (goesLeft) left.push(row);
    else right.push(row);
  }
  return [left, right];
}

// Weighted impurity of a split: each side's Gini, weighted by its share of the rows.
function weightedGini(left: TrainingRow[], right: TrainingRow[]): number {
  const total = left.length + right.length;
  return (left.length/total)*gini(left) + (right.length/total)*gini(right)
}




// Tries every feature/threshold and returns the split with the highest information gain.
export function findBestSplit(rows: TrainingRow[]): Split | null {

  const parentGini = gini(rows);
  const features: (keyof Sample)[] = ["sleep", "meetings", "weekends", "stress"];

  let best: Split | null = null;

  for (const feature of features) {
    const candidates: (number | string)[] = [];
    const sampleValue = rows[0]![feature];

    if (typeof sampleValue === "number") {
      const values = [...new Set(rows.map((r) => r[feature] as number))].sort((a, b) => a - b);
      for (let i = 0; i < values.length - 1; i++) {
        candidates.push((values[i]! + values[i + 1]!) / 2); // midpoint
      }
    } else {
      candidates.push("Yes"); 
    }

    for (const threshold of candidates) {
      const [left, right] = partition(rows, feature, threshold);
      if (left.length === 0 || right.length === 0) continue; 
      const gain = parentGini - weightedGini(left, right);

      if (best === null || gain > best.gain)
        best = { feature, threshold, gain, left, right };
    }
  }

  return best;
}

