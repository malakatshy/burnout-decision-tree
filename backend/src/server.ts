
import express from "express";
import cors from "cors";
import { dataset } from "./dataset";
import { buildTree, predictWithPath } from "./tree";
import type { TreeNode } from "./types";

const app = express();
const PORT = 3000;

app.use(cors());          // lets the frontend (a different origin) call this API
app.use(express.json());  // lets us read JSON sent in a request body

// The trained tree lives here in memory once it's built.
let tree: TreeNode | null = null;

// Endpoint 1 — build the tree from the built-in dataset.
app.post("/api/train", (req, res) => {
  tree = buildTree(dataset);
  res.json({ message: "Model trained", rows: dataset.length });
});

// Endpoint 2 — hand back the tree as JSON, for the visualizer to draw.
app.get("/api/tree", (req, res) => {
  if (tree === null) {
    return res.status(400).json({ error: "Model not trained yet." });
  }
  res.json(tree);
});




// validation function to check if the request body is a valid Sample object
function isValidSample(body: any): boolean {

  if (!body || typeof body !== "object") {
    return false;
  }
  
  return (
    typeof body.sleep === "number" &&
    body.sleep >= 0 &&
    body.sleep <= 12 &&
    typeof body.meetings === "number" &&
    body.meetings >= 0 &&
    body.meetings <= 15 &&
    (body.weekends === "Yes" || body.weekends === "No") &&
    typeof body.stress === "number" && body.stress >= 1 && body.stress <= 10
  );
}



// Endpoint 3 — classify one person's stats and return the verdict.
app.post("/api/predict", (req, res) => {
  if (tree === null) {
    return res.status(400).json({ error: "Model not trained yet." });
  }

  if (!isValidSample(req.body)) {
    return res.status(400).json({
      error:
        "Invalid input. Expected: sleep 0-12, meetings 0-15, weekends Yes/No, stress 1-10.",
    });
  }

  const result = predictWithPath(tree, req.body);
  res.json(result);
});



app.listen(PORT, () => {
  tree = buildTree(dataset);   // train once on startup so the API is ready immediately
  console.log(`Server running on port ${PORT}, trained on ${dataset.length} rows`);
});




