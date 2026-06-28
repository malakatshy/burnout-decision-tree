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
  path: string[];
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const OUTCOME_ORDER: Outcome[] = [
  "Healthy",
  "Risk of burnout",
  "Vacation required",
  "Critical condition",
];

const BANDS: { outcome: Outcome; label: string; key: string }[] = [
  { outcome: "Healthy", label: "Healthy", key: "healthy" },
  { outcome: "Risk of burnout", label: "At risk", key: "risk-of-burnout" },
  { outcome: "Vacation required", label: "Overdrawn", key: "vacation-required" },
  { outcome: "Critical condition", label: "Critical", key: "critical-condition" },
];

const READINGS: Record<Outcome, string> = {
  Healthy: "Sustainable pace. Keep your guardrails up.",
  "Risk of burnout": "Early warning. Trim the load before it compounds.",
  "Vacation required": "You're overdrawn. Book real time off.",
  "Critical condition": "Running on fumes. Stop and get support.",
};

function outcomeKey(outcome: Outcome) {
  return outcome.toLowerCase().replaceAll(" ", "-");
}


// Converts an outcome string to a CSS-friendly class name.
function App() {
  const [sleep, setSleep] = useState(7);
  const [meetings, setMeetings] = useState(4);
  const [weekends, setWeekends] = useState(false); 
  const [stress, setStress] = useState(5);

  const [prediction, setPrediction] = useState<Outcome | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [activePath, setActivePath] = useState<string[]>([]);

  async function handlePredict() {
    setLoading(true);
    setError("");
    setPrediction(null);
    setActivePath([]);

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
      setActivePath(result.path);
    } catch {
      setError("Could not reach the model server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  const predictionIndex = prediction ? OUTCOME_ORDER.indexOf(prediction) : -1;
  const needleLeft =
    predictionIndex >= 0 ? ((predictionIndex + 0.5) / BANDS.length) * 100 : 0;

  return (
    <main className="app">
      <header className="masthead">
        <div className="masthead-bar">
          <span className="wordmark">
            BURNOUT<span className="wordmark-slash">//</span>INDEX
          </span>
          <span className="eyebrow">Hand-built CART decision tree</span>
        </div>
        <h1>
          What’s your <span className="hot">burnout risk?</span>
        </h1>
        <p className="lede">
          Four signals — sleep, meetings, weekend work, and stress — run through a
          decision tree to read your burnout risk. Adjust the dials, then take a
          reading.
        </p>
      </header>

      <section className="console-grid">
        <div className="panel controls">
          <div className="panel-tab">
            <span className="tab-no">01</span>
            <span className="tab-name">Your week, on the dials</span>
          </div>

          <div className="field">
            <div className="field-header">
              <label htmlFor="sleep">Sleep</label>
              <span className="readout">
                {sleep.toFixed(1)}
                <em>hrs / night</em>
              </span>
            </div>
            <input
              id="sleep"
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
              <label htmlFor="meetings">Meetings</label>
              <span className="readout">
                {meetings}
                <em>per day</em>
              </span>
            </div>
            <input
              id="meetings"
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
              <label htmlFor="stress">Stress</label>
              <span className="readout">
                {stress}
                <em>/ 10</em>
              </span>
            </div>
            <input
              id="stress"
              type="range"
              min="1"
              max="10"
              step="1"
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
            <span className="toggle-track" aria-hidden="true">
              <span className="toggle-thumb" />
            </span>
            <span className="toggle-text">
              <strong>Weekend work</strong>
              <small>Do you usually work on weekends?</small>
            </span>
          </label>

          <button onClick={handlePredict} disabled={loading}>
            {loading ? "Reading…" : "Take the reading"}
          </button>

          {error && <div className="error">{error}</div>}
        </div>

        <div className="panel readout-panel">
          <div className="panel-tab">
            <span className="tab-no">02</span>
            <span className="tab-name">The reading</span>
          </div>

          <div
            className={`verdict ${prediction ? outcomeKey(prediction) : "idle"}`}
          >
            <span className="verdict-label">
              {prediction ? "Diagnosis" : "Awaiting input"}
            </span>
            <strong className="verdict-name">
              {prediction ?? "———"}
            </strong>
            <p className="verdict-note">
              {prediction
                ? READINGS[prediction]
                : "Set your dials and take a reading to see where you land."}
            </p>
          </div>

          <div
            className={`spectrum ${prediction ? "live" : "idle"}`}
            role="img"
            aria-label={
              prediction
                ? `Burnout reading: ${prediction}`
                : "Burnout spectrum, no reading yet"
            }
          >
            <div className="spectrum-scale">
              {BANDS.map((band) => (
                <div
                  key={band.key}
                  className={`band ${band.key} ${
                    prediction === band.outcome ? "active" : ""
                  }`}
                >
                  <span className="band-label">{band.label}</span>
                </div>
              ))}
            </div>
            {predictionIndex >= 0 && (
              <div
                className={`needle ${outcomeKey(prediction!)}`}
                style={{ left: `${needleLeft}%` }}
              >
                <span className="needle-stem" />
                <span className="needle-dot" />
              </div>
            )}
          </div>

          <dl className="inputs-recap">
            <div>
              <dt>Sleep</dt>
              <dd>{sleep.toFixed(1)}h</dd>
            </div>
            <div>
              <dt>Meetings</dt>
              <dd>{meetings}/day</dd>
            </div>
            <div>
              <dt>Stress</dt>
              <dd>{stress}/10</dd>
            </div>
            <div>
              <dt>Weekends</dt>
              <dd>{weekends ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </div>
      </section>

      <TreeVisualizer activePath={activePath} />
    </main>
  );
}

export default App;
