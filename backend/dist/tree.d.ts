import type { Outcome, TrainingRow, Sample, TreeNode } from "./types";
export declare function gini(rows: TrainingRow[]): number;
export type Split = {
    feature: keyof Sample;
    threshold: number | string;
    gain: number;
    left: TrainingRow[];
    right: TrainingRow[];
};
export declare function findBestSplit(rows: TrainingRow[]): Split | null;
export declare function buildTree(rows: TrainingRow[], depth?: number): TreeNode;
export declare function predict(node: TreeNode, sample: Sample): Outcome;
export declare function predictWithPath(node: TreeNode, sample: Sample, nodeId?: string): {
    prediction: Outcome;
    path: string[];
};
//# sourceMappingURL=tree.d.ts.map