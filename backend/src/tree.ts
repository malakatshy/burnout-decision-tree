
import type { Outcome, TrainingRow, Sample, TreeNode } from "./types";


// Gini function: measures how "mixed" the outcomes are in a set of rows. 0 = pure, 1 = maximally mixed
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

// Counts how many rows fall into each outcome.
//  leaf's prediction + "hover stats" 
function countByOutcome(rows: TrainingRow[]): Record<Outcome, number> {
  const counts: Record<Outcome, number> = {
    "Healthy": 0,
    "Risk of burnout": 0,
    "Vacation required": 0,
    "Critical condition": 0,
  };

  for (const row of rows) 
    counts[row.outcome]++;
  return counts;
}

// Picks the most common outcome — used when a leaf isn't perfectly pure.
function majorityOutcome(rows: TrainingRow[]): Outcome {
  const counts = countByOutcome(rows);
  let best: Outcome = "Healthy";
  let bestCount = -1;
  for (const outcome of Object.keys(counts) as Outcome[]) {
    if (counts[outcome] > bestCount) {
      bestCount = counts[outcome];
      best = outcome;
    }
  }
  return best;
}


// builds the decision tree recursively.  Returns a TreeNode (either a leaf or a decision node).
export function buildTree(rows: TrainingRow[], depth: number = 0): TreeNode {
  const distribution = countByOutcome(rows);
  const samples = rows.length;

  //Base cases
  const uniqueOutcomes = new Set(rows.map((r) => r.outcome));
  if (uniqueOutcomes.size === 1) {
    return { kind: "leaf", prediction: rows[0]!.outcome, samples, distribution };
  }

  if (samples < 2 || depth >= 5) {
    return { kind: "leaf", prediction: majorityOutcome(rows), samples, distribution };
  }

  //Recursive case
  const split = findBestSplit(rows);

  // Safety: if no useful split exists, fall back to a leaf.
  if (split === null || split.gain <= 0) {
    return { kind: "leaf", prediction: majorityOutcome(rows), samples, distribution };
  }

  return {
    kind: "decision",
    feature: split.feature,
    threshold: split.threshold,
    samples,
    distribution,
    left:  buildTree(split.left,  depth + 1),   // ← recursive call
    right: buildTree(split.right, depth + 1),   // ← recursive call
  };
}




// Basic prediction function. ***Kept for clarity***
// The API currently uses predictWithPath because the frontend also needs the decision path.

export function predict(node: TreeNode, sample: Sample): Outcome {
  // Base case: reached a leaf → that's the answer.
  if (node.kind === "leaf") {
    return node.prediction;
  }

  // Decision node: check its condition on this person's value.
  const value = sample[node.feature];
  const goesLeft =
    typeof value === "number" // number ?
      ? value < (node.threshold as number)   // numeric: left = value < threshold
      : value === node.threshold;             // categorical: left = value === threshold

  // Move to the matching side and repeat.
  return goesLeft
    ? predict(node.left, sample)    
    : predict(node.right, sample);
}



// Prediction function that also returns the path of node IDs taken to reach the leaf.
export function predictWithPath(
  node: TreeNode,
  sample: Sample,
  nodeId: string = "root"
): { prediction: Outcome; path: string[] } {
  if (node.kind === "leaf") {
    return {
      prediction: node.prediction,
      path: [nodeId],
    };
  }

  const value = sample[node.feature];

  const goesLeft =
    typeof value === "number"
      ? value < (node.threshold as number)
      : value === node.threshold;

  const nextNode = goesLeft ? node.left : node.right;
  const nextId = goesLeft ? `${nodeId}-yes` : `${nodeId}-no`;

  const result = predictWithPath(nextNode, sample, nextId);

  return {
    prediction: result.prediction,
    path: [nodeId, ...result.path],
  };
}
