

export type Outcome =
  | "Healthy"
  | "Risk of burnout"
  | "Vacation required"
  | "Critical condition";

// status 
export type Sample = {
  sleep: number;            
  meetings: number;         
  weekends: "Yes" | "No";  
  stress: number;         
};

// A training row = the features PLUS the known correct answer.
export type TrainingRow = Sample & { outcome: Outcome };

// A node in the tree. It's either a leaf (final verdict) or a decision (a test)
export type TreeNode =
  | {
      kind: "leaf";
      prediction: Outcome;
      samples: number;                         // how many training rows reached here
      distribution: Record<Outcome, number>;   // class counts (this powers the hover stats)
    }
  | {
      kind: "decision";
      feature: keyof Sample;                    // which feature is tested
      threshold: number | string;              // numeric cutoff, or "Yes"/"No" for categorical
      samples: number;
      distribution: Record<Outcome, number>;
      left: TreeNode;                           // rows where the condition is TRUE
      right: TreeNode;                          // rows where it's FALSE
    };