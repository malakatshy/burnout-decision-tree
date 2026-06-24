

import { dataset } from "./dataset";

const counts: Record<string, number> = {};
for (const row of dataset) counts[row.outcome] = (counts[row.outcome] ?? 0) + 1;

console.log("Rows:", dataset.length);
console.log("By outcome:", counts);