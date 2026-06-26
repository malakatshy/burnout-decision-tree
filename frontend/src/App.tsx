import { useState } from "react";
import "./App.css";
import TreeVisualizer from "./components/TreeVisualizer";

type Outcome =
  | "Healthy"
  | "Risk of burnout"
  | "Vacation required"
  | "Critical condition";

type PredictionResponse = {
  prediction: Outcome;
};

const API_URL = "http://localhost:3000/api";

function App() {
  const [sleep, setSleep] = useState(7);
  const [meetings, setMeetings] = useState(4);
  const [weekends, setWeekends] = useState(false);
  const [stress, setStress] = useState(5);

  const [prediction, setPrediction] = useState<Outcome | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePredict() {
    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sleep,
          meetings,
          weekends: weekends ? "Yes" : "No",
          stress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      const result = data as PredictionResponse;
      setPrediction(result.prediction);
    } catch {
      setError("Could not connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }

  return (
  <main className="app">
    <section className="dashboard">
      <div className="intro-panel">
        <div className="badge">Burnout Risk Model</div>

        <h1>Developer Burnout Analyzer</h1>

        <p>
          Estimate burnout risk based on sleep, meetings, weekend work, and
          stress level using a manually implemented CART Decision Tree.
        </p>

        <div className="summary-box">
          <span>Current input</span>
          <strong>
            {sleep}h sleep · {meetings} meetings · stress {stress}
          </strong>
          <small>{weekends ? "Works on weekends" : "No weekend work"}</small>
        </div>
      </div>

      <div className="form-panel">
        <div className="field">
          <div className="field-header">
            <label>Sleep hours</label>
            <span>{sleep}</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={sleep}
            onChange={(e) => setSleep(Number(e.target.value))}
          />
        </div>

        <div className="field">
          <div className="field-header">
            <label>Meetings per day</label>
            <span>{meetings}</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            step="1"
            value={meetings}
            onChange={(e) => setMeetings(Number(e.target.value))}
          />
        </div>

        <div className="field">
          <div className="field-header">
            <label>Stress level</label>
            <span>{stress}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
          />
        </div>

        <label className="weekend-toggle">
          <input
            type="checkbox"
            checked={weekends}
            onChange={(e) => setWeekends(e.target.checked)}
          />
          <span>
            <strong>Weekend work</strong>
            <small>Do you usually work on weekends?</small>
          </span>
        </label>

        <button onClick={handlePredict} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Burnout Risk"}
        </button>

        {prediction && (
          <div className={`result ${prediction.toLowerCase().replaceAll(" ", "-")}`}>
            <span>Prediction</span>
            <strong>{prediction}</strong>
          </div>
        )}

        {error && <div className="error">{error}</div>}
      </div>
    </section>
    <TreeVisualizer />
  </main>
);
}

export default App;