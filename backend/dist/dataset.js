"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataset = void 0;
// combines all four features into a single "burnout score". This guarantees
// every feature genuinely affects the outcome, so the tree has a real reason
// to split on each one — including weekends and meetings.
function burnoutScore(sleep, meetings, weekends, stress) {
    const stressLoad = stress; // 1–10, the main driver
    const sleepDebt = Math.max(0, 8 - sleep) * 0.9; // every hour below 8 adds load
    const meetingLoad = Math.max(0, meetings - 4) * 0.4; // meetings above 4 add load
    const weekendPenalty = weekends === "Yes" ? 2 : 0; // working weekends adds fixed load
    return stressLoad + sleepDebt + meetingLoad + weekendPenalty;
}
// Maps a burnout score to one of the four outcomes.
function scoreToOutcome(score) {
    if (score < 8)
        return "Healthy";
    if (score < 11.5)
        return "Risk of burnout";
    if (score < 14.5)
        return "Vacation required";
    return "Critical condition";
}
// Generate the dataset by sweeping a grid of feature values
function generateDataset() {
    const sleepValues = [3, 4.5, 6, 7.5];
    const meetingsValues = [2, 6, 10];
    const weekendsValues = ["No", "Yes"];
    const stressValues = [3, 5, 7, 9];
    const rows = [];
    for (const sleep of sleepValues) {
        for (const meetings of meetingsValues) {
            for (const weekends of weekendsValues) {
                for (const stress of stressValues) {
                    const score = burnoutScore(sleep, meetings, weekends, stress);
                    rows.push({ sleep, meetings, weekends, stress, outcome: scoreToOutcome(score) });
                }
            }
        }
    }
    return rows;
}
exports.dataset = generateDataset();
//# sourceMappingURL=dataset.js.map