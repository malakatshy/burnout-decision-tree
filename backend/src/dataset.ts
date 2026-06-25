import type { TrainingRow } from "./types";

export const dataset: TrainingRow[] = [

  // Healthy
  { sleep: 8.0, meetings: 2, weekends: "Yes", stress: 2, outcome: "Healthy" },
  { sleep: 7.5, meetings: 4, weekends: "No", stress: 3, outcome: "Healthy" },
  { sleep: 8.5, meetings: 6, weekends: "No", stress: 2, outcome: "Healthy" },
  { sleep: 7.0, meetings: 5, weekends: "No", stress: 4, outcome: "Healthy" },
  { sleep: 7.5, meetings: 3, weekends: "Yes", stress: 3, outcome: "Healthy" },
  { sleep: 8.0, meetings: 7, weekends: "No", stress: 4, outcome: "Healthy" },
  { sleep: 6.5, meetings: 3, weekends: "No", stress: 4, outcome: "Healthy" },
  { sleep: 5.0, meetings: 4, weekends: "No", stress: 3, outcome: "Healthy" },
  { sleep: 8.5, meetings: 4, weekends: "Yes", stress: 2, outcome: "Healthy" },
  { sleep: 7.5, meetings: 8, weekends: "No", stress: 3, outcome: "Healthy" },
  { sleep: 6.8, meetings: 5, weekends: "No", stress: 5, outcome: "Healthy" },
  { sleep: 8.2, meetings: 2, weekends: "No", stress: 5, outcome: "Healthy" },

  // Risk of burnout
  { sleep: 6.5, meetings: 5, weekends: "No", stress: 6, outcome: "Risk of burnout" },
  { sleep: 6.0, meetings: 7, weekends: "Yes", stress: 6, outcome: "Risk of burnout" },
  { sleep: 5.5, meetings: 4, weekends: "Yes", stress: 7, outcome: "Risk of burnout" },
  { sleep: 6.5, meetings: 8, weekends: "No", stress: 5, outcome: "Risk of burnout" },
  { sleep: 5.5, meetings: 6, weekends: "Yes", stress: 6, outcome: "Risk of burnout" },
  { sleep: 6.0, meetings: 3, weekends: "No", stress: 7, outcome: "Risk of burnout" },
  { sleep: 7.0, meetings: 9, weekends: "Yes", stress: 5, outcome: "Risk of burnout" },
  { sleep: 5.8, meetings: 7, weekends: "No", stress: 6, outcome: "Risk of burnout" },
  { sleep: 6.2, meetings: 10, weekends: "No", stress: 5, outcome: "Risk of burnout" },
  { sleep: 5.0, meetings: 5, weekends: "No", stress: 7, outcome: "Risk of burnout" },
  { sleep: 6.8, meetings: 6, weekends: "Yes", stress: 6, outcome: "Risk of burnout" },
  { sleep: 5.7, meetings: 8, weekends: "Yes", stress: 7, outcome: "Risk of burnout" },
  { sleep: 6.3, meetings: 4, weekends: "No", stress: 6, outcome: "Risk of burnout" },

  // Vacation required
  { sleep: 7.0, meetings: 8, weekends: "Yes", stress: 8, outcome: "Vacation required" },
  { sleep: 6.5, meetings: 9, weekends: "Yes", stress: 8, outcome: "Vacation required" },
  { sleep: 5.5, meetings: 7, weekends: "Yes", stress: 9, outcome: "Vacation required" },
  { sleep: 6.0, meetings: 10, weekends: "No", stress: 9, outcome: "Vacation required" },
  { sleep: 5.0, meetings: 8, weekends: "Yes", stress: 8, outcome: "Vacation required" },
  { sleep: 6.8, meetings: 11, weekends: "Yes", stress: 7, outcome: "Vacation required" },
  { sleep: 5.8, meetings: 6, weekends: "Yes", stress: 9, outcome: "Vacation required" },
  { sleep: 7.2, meetings: 10, weekends: "No", stress: 8, outcome: "Vacation required" },
  { sleep: 6.0, meetings: 5, weekends: "Yes", stress: 8, outcome: "Vacation required" },
  { sleep: 5.2, meetings: 9, weekends: "No", stress: 9, outcome: "Vacation required" },
  { sleep: 6.5, meetings: 12, weekends: "Yes", stress: 8, outcome: "Vacation required" },
  { sleep: 4.0, meetings: 10, weekends: "Yes", stress: 7, outcome: "Vacation required" },

  // Critical condition
  { sleep: 4.0, meetings: 9, weekends: "Yes", stress: 10, outcome: "Critical condition" },
  { sleep: 3.5, meetings: 6, weekends: "Yes", stress: 8, outcome: "Critical condition" },
  { sleep: 4.5, meetings: 11, weekends: "Yes", stress: 9, outcome: "Critical condition" },
  { sleep: 2.5, meetings: 3, weekends: "Yes", stress: 10, outcome: "Critical condition" },
  { sleep: 3.0, meetings: 5, weekends: "No", stress: 9, outcome: "Critical condition" },
  { sleep: 4.8, meetings: 8, weekends: "Yes", stress: 10, outcome: "Critical condition" },
  { sleep: 3.8, meetings: 12, weekends: "Yes", stress: 9, outcome: "Critical condition" },
  { sleep: 4.2, meetings: 4, weekends: "No", stress: 10, outcome: "Critical condition" },
  { sleep: 2.8, meetings: 7, weekends: "Yes", stress: 8.5, outcome: "Critical condition" },
  { sleep: 4.5, meetings: 10, weekends: "No", stress: 7, outcome: "Critical condition" },
  { sleep: 3.2, meetings: 9, weekends: "Yes", stress: 10, outcome: "Critical condition" },
  { sleep: 4.0, meetings: 6, weekends: "Yes", stress: 9, outcome: "Critical condition" },
  { sleep: 5.0, meetings: 11, weekends: "Yes", stress: 9.5, outcome: "Critical condition" },
  

];