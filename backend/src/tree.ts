
import type { Outcome, TrainingRow } from "./types";

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

import { dataset } from "./dataset";

console.log("Gini:", gini(dataset));
