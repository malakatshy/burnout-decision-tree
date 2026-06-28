````bash
cat > README.md <<'EOF'
# Developer Burnout Decision Tree

A full-stack web application for analyzing developer burnout risk using a manually implemented Decision Tree algorithm.

The application receives developer work-life signals such as sleep, meetings, weekend work, and stress level, predicts the burnout risk level, and visualizes the decision-making process in an interactive tree graph.

---

## Live Links

- Frontend Deployment: TODO - add Vercel / Netlify / Cloudflare link
- Backend Deployment: TODO - add Render / Railway / Fly.io link
- GitHub Repository: TODO - add repository link

---

## Project Goal

The goal of this project is to build a web application that predicts developer burnout levels using a Decision Tree classifier and explains the model logic visually.

The system predicts one of four possible outcomes:

- Healthy
- Risk of burnout
- Vacation required
- Critical condition

In addition to returning a prediction, the application displays the constructed decision tree so the user can understand which conditions led to the final result.

---

## Main Features

### Dashboard

The frontend includes a dashboard where the user can enter:

- Average sleep hours
- Number of meetings per day
- Whether they work on weekends
- Stress level from 1 to 10

The user receives a burnout prediction based on the current input values.

### Interactive Tree Visualizer

The decision tree is rendered as an interactive graph.

The visualizer includes:

- Decision nodes that show conditions such as `sleep < 6`
- Leaf nodes that show the final predicted burnout level
- Colored leaf nodes according to burnout risk
- Hover tooltips that show training statistics for each node
- Yes / No labels on the tree branches
- Zoom and drag support for exploring the tree
- Highlighted prediction path: after the user submits input, the path that led to the specific prediction is highlighted in green

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- react-d3-tree
- CSS

### Backend

- Node.js
- Express
- TypeScript
- CORS

### Algorithm

- Manually implemented CART-style Decision Tree
- Gini Index as the splitting criterion
- No machine learning libraries were used

---

## Decision Tree Algorithm

This project uses a CART-style Decision Tree classifier.

I chose CART because it is simple, interpretable, and works naturally with binary splits. It is also a good fit for this project because the tree can be visualized clearly as a set of Yes / No decisions.

The algorithm was implemented manually in TypeScript.

The implementation includes:

- Gini impurity calculation
- Weighted Gini calculation for candidate splits
- Search for the best feature and threshold
- Support for numerical features using threshold search
- Support for categorical Yes / No features
- Recursive tree construction
- Prediction traversal
- Prediction path tracking for visualization

---

## Gini Index

The tree uses the Gini Index to measure how mixed a group of training rows is.

The formula is:

```text
Gini = 1 - sum(p_i^2)
````

Where `p_i` is the proportion of rows belonging to class `i`.

A Gini score of `0` means the node is pure, meaning all rows belong to the same class.

For every possible split, the algorithm calculates the weighted Gini of the left and right branches. The split with the highest gain is selected.

```text
Gain = Parent Gini - Weighted Child Gini
```

---

## Numerical and Categorical Splits

The dataset contains both numerical and categorical features.

### Numerical Features

Numerical features include:

* sleep
* meetings
* stress

For numerical values, the algorithm searches for the best threshold automatically.

Example:

```text
sleep < 6
stress < 7.5
meetings < 5.5
```

The algorithm sorts the unique values and tries midpoint thresholds between neighboring values.

### Categorical Feature

The categorical feature is:

```text
weekends: Yes / No
```

For this feature, the tree uses a binary split:

```text
weekends = Yes
```

Rows that match the condition go to the left branch. Other rows go to the right branch.

---

## Dataset

The model is trained on a built-in generated dataset.

Each training row contains:

| Feature  | Type     | Description                             |
| -------- | -------- | --------------------------------------- |
| sleep    | number   | Average sleep hours                     |
| meetings | number   | Number of calls / meetings per day      |
| weekends | Yes / No | Whether the developer works on weekends |
| stress   | number   | Subjective stress level from 1 to 10    |
| outcome  | string   | Burnout risk label                      |

The possible outcomes are:

* Healthy
* Risk of burnout
* Vacation required
* Critical condition

The dataset is generated using a transparent burnout scoring rule. This rule combines all four features into a single burnout score, then maps that score to one of the four outcomes.

This approach makes the dataset consistent and ensures that each feature can influence the final prediction.

---

## Backend API

The backend exposes three main API endpoints.

### Train Model

```http
POST /api/train
```

Trains the decision tree using the built-in dataset.

Example response:

```json
{
  "message": "Model trained",
  "rows": 96
}
```

---

### Get Tree JSON

```http
GET /api/tree
```

Returns the trained tree structure as JSON so the frontend can render it.

Example decision node:

```json
{
  "kind": "decision",
  "feature": "stress",
  "threshold": 7.5,
  "samples": 96,
  "distribution": {
    "Healthy": 20,
    "Risk of burnout": 30,
    "Vacation required": 25,
    "Critical condition": 21
  }
}
```

---

### Predict Burnout Risk

```http
POST /api/predict
```

Receives user input and returns a prediction together with the decision path.

Example request:

```json
{
  "sleep": 6,
  "meetings": 7,
  "weekends": "Yes",
  "stress": 8
}
```

Example response:

```json
{
  "prediction": "Vacation required",
  "path": ["root", "root-no", "root-no-yes"]
}
```

The `path` is used by the frontend to highlight the route that led to the final prediction in the tree visualizer.

---

## Error Handling

The backend validates incoming prediction requests.

Valid input ranges:

| Field    | Valid Range |
| -------- | ----------- |
| sleep    | 0 to 12     |
| meetings | 0 to 15     |
| weekends | Yes or No   |
| stress   | 1 to 10     |

If invalid data is sent, the API returns a clear error message instead of crashing.

Example error response:

```json
{
  "error": "Invalid input. Expected: sleep 0-12, meetings 0-15, weekends Yes/No, stress 1-10."
}
```

---

## Project Structure

```text
burnout-decision-tree/
│
├── backend/
│   └── src/
│       ├── dataset.ts
│       ├── server.ts
│       ├── tree.ts
│       └── types.ts
│
├── frontend/
│   └── src/
│       ├── components/
│       │   └── TreeVisualizer.tsx
│       ├── App.tsx
│       └── App.css
│
└── README.md
```

---

## How to Run Locally

### 1. Clone the repository

```bash
git clone TODO_REPOSITORY_LINK
cd burnout-decision-tree
```

---

### 2. Run the backend

```bash
cd backend
npm install
npx ts-node src/server.ts
```

The backend runs on:

```text
http://localhost:3000
```

---

### 3. Run the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

or another Vite port shown in the terminal.

---

## AI Collaboration

AI tools were used as part of the development process, as required by the assignment.

I used AI mainly for:

* Understanding the Decision Tree algorithm
* Breaking down the Gini Index formula
* Planning the CART-style tree structure
* Debugging TypeScript issues
* Reviewing recursion logic
* Improving backend validation
* Designing the frontend dashboard
* Improving the tree visualizer layout
* Adding hover statistics and prediction path highlighting
* Writing and improving the README structure

AI was used as a learning and development assistant, not as a replacement for understanding the project.

The core implementation decisions remained mine:

* Choosing a CART-style Decision Tree
* Using the Gini Index
* Building the dataset structure
* Implementing the backend endpoints
* Connecting the frontend to the backend
* Adding the interactive tree visualization
* Testing and adjusting the UI and prediction behavior

All generated code suggestions were reviewed, tested, modified, and integrated manually.

---

## Notes About the Implementation

This project intentionally focuses on clarity, explainability, and manual implementation rather than using a ready-made machine learning library.

The decision tree is not built with Scikit-learn or any similar ML package. The algorithmic logic is implemented from scratch in TypeScript.

The tree visualizer is used only for rendering the model structure. It does not perform the machine learning logic.

---

## Future Improvements

Possible future improvements include:

* Supporting CSV upload for custom training datasets
* Adding automatic prediction updates when sliders change
* Adding train/test split evaluation
* Displaying model accuracy on a validation set
* Improving mobile layout for the tree visualizer
* Adding more developer work-life features

---

## Author

Created as part of a FullStack and AI assignment.

EOF

```
```
