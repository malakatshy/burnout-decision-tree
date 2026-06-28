"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dataset_1 = require("./dataset");
const tree_1 = require("./tree");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)()); // lets the frontend (a different origin) call this API
app.use(express_1.default.json()); // lets us read JSON sent in a request body
// The trained tree lives here in memory once it's built.
let tree = null;
// Endpoint 1 — build the tree from the built-in dataset.
app.post("/api/train", (req, res) => {
    tree = (0, tree_1.buildTree)(dataset_1.dataset);
    res.json({ message: "Model trained", rows: dataset_1.dataset.length });
});
// Endpoint 2 — hand back the tree as JSON, for the visualizer to draw.
app.get("/api/tree", (req, res) => {
    if (tree === null) {
        return res.status(400).json({ error: "Model not trained yet." });
    }
    res.json(tree);
});
// validation function to check if the request body is a valid Sample object
function isValidSample(body) {
    if (!body || typeof body !== "object") {
        return false;
    }
    return (typeof body.sleep === "number" &&
        body.sleep >= 0 &&
        body.sleep <= 12 &&
        typeof body.meetings === "number" &&
        body.meetings >= 0 &&
        body.meetings <= 15 &&
        (body.weekends === "Yes" || body.weekends === "No") &&
        typeof body.stress === "number" && body.stress >= 1 && body.stress <= 10);
}
// Endpoint 3 — classify one person's stats and return the verdict.
app.post("/api/predict", (req, res) => {
    if (tree === null) {
        return res.status(400).json({ error: "Model not trained yet." });
    }
    if (!isValidSample(req.body)) {
        return res.status(400).json({
            error: "Invalid input. Expected: sleep 0-12, meetings 0-15, weekends Yes/No, stress 1-10.",
        });
    }
    const result = (0, tree_1.predictWithPath)(tree, req.body);
    res.json(result);
});
app.listen(PORT, () => {
    tree = (0, tree_1.buildTree)(dataset_1.dataset); // train once on startup so the API is ready immediately
    console.log(`Server running on port ${PORT}, trained on ${dataset_1.dataset.length} rows`);
});
//# sourceMappingURL=server.js.map