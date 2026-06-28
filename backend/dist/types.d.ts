export type Outcome = "Healthy" | "Risk of burnout" | "Vacation required" | "Critical condition";
export type Sample = {
    sleep: number;
    meetings: number;
    weekends: "Yes" | "No";
    stress: number;
};
export type TrainingRow = Sample & {
    outcome: Outcome;
};
export type TreeNode = {
    kind: "leaf";
    prediction: Outcome;
    samples: number;
    distribution: Record<Outcome, number>;
} | {
    kind: "decision";
    feature: keyof Sample;
    threshold: number | string;
    samples: number;
    distribution: Record<Outcome, number>;
    left: TreeNode;
    right: TreeNode;
};
//# sourceMappingURL=types.d.ts.map