


// The possible outcomes of the decision tree.
export type Outcome =
  | "Healthy"
  | "Risk of burnout"
  | "Vacation required"
  | "Critical condition";

// A sample is a set of features for one person.  The tree uses these to make a prediction.
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
      samples: number;                        
      distribution: Record<Outcome, number>;  
    }
  | {
      kind: "decision";
      feature: keyof Sample;                   
      threshold: number | string;              
      samples: number;
      distribution: Record<Outcome, number>;
      left: TreeNode;                           
      right: TreeNode;                        
    }; 