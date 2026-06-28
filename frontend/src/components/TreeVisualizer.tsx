import { useEffect, useState } from "react";
import Tree from "react-d3-tree";

type Outcome =
  | "Healthy"
  | "Risk of burnout"
  | "Vacation required"
  | "Critical condition";

type Distribution = Record<Outcome, number>;

type BackendTreeNode =
  | {
      kind: "leaf";
      prediction: Outcome;
      samples: number;
      distribution: Distribution;
    }
  | {
      kind: "decision";
      feature: string;
      threshold: number | string;
      samples: number;
      distribution: Distribution;
      left: BackendTreeNode;
      right: BackendTreeNode;
    };

type D3TreeNode = {
  name: string;
  attributes: {
    kind: "leaf" | "decision";
    prediction?: Outcome;
    samples: number;
    stats: string;
    branch?: "Yes" | "No";
  };
  children?: D3TreeNode[];
};

const API_URL = "http://localhost:3000/api";

function formatDistribution(distribution: Distribution): string {
  return [
    `Healthy: ${distribution["Healthy"]}`,
    `Risk of burnout: ${distribution["Risk of burnout"]}`,
    `Vacation required: ${distribution["Vacation required"]}`,
    `Critical condition: ${distribution["Critical condition"]}`,
  ].join("\n");
}

function formatStats(node: BackendTreeNode): string {
  return `Samples: ${node.samples}\n${formatDistribution(node.distribution)}`;
}

function formatCondition(node: Extract<BackendTreeNode, { kind: "decision" }>) {
  if (typeof node.threshold === "number") {
    return `${node.feature} < ${Number(node.threshold.toFixed(2))}`;
  }

  return `${node.feature} = ${node.threshold}`;
}

function convertToD3Tree(node: BackendTreeNode, branch?: "Yes" | "No"): D3TreeNode {
  if (node.kind === "leaf") {
    return {
      name: node.prediction,
      attributes: {
        kind: "leaf",
        prediction: node.prediction,
        samples: node.samples,
        stats: formatStats(node),
        branch, 
      },
    };
  }

  return {
    name: formatCondition(node),
    attributes: {
      kind: "decision",
      samples: node.samples,
      stats: formatStats(node),
      branch,
    },
    children: [convertToD3Tree(node.left, "Yes"), convertToD3Tree(node.right, "No")],
  };
}

function predictionClass(prediction?: Outcome) {
  if (!prediction) return "";

  return prediction.toLowerCase().replaceAll(" ", "-");
}

function TreeVisualizer() {
  const [treeData, setTreeData] = useState<D3TreeNode | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTree() {
      try {
        const response = await fetch(`${API_URL}/tree`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Could not load tree.");
          return;
        }

        setTreeData(convertToD3Tree(data));
      } catch {
        setError("Could not connect to the backend server.");
      } finally {
        setLoading(false);
      }
    }

    loadTree();
  }, []);

  if (loading) {
    return (
      <section className="tree-section">
        <h2>Decision Tree Visualizer</h2>
        <p>Loading tree...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="tree-section">
        <h2>Decision Tree Visualizer</h2>
        <div className="error">{error}</div>
      </section>
    );
  }

  if (!treeData) {
    return null;
  }

  return (
    <section className="tree-section">
      <div className="tree-header">
        <div>
          <span className="section-label">Model logic</span>
          <h2>Decision Tree Visualizer</h2>
          <p>
            Each decision node shows a condition. Leaf nodes are colored by
            burnout risk. Hover over any node to see training statistics.
          </p>
        </div>
      </div>

      <div className="tree-canvas">
        <Tree
          data={treeData}
          orientation="vertical"
          translate={{ x: 520, y: 120 }}
          zoom={0.70}
          nodeSize={{ x: 230, y: 155 }}
          separation={{ siblings: 1.15, nonSiblings: 1.35 }}
          pathFunc="step"
          collapsible
          zoomable
          draggable
          renderCustomNodeElement={({ nodeDatum, toggleNode }) => {
            const kind = nodeDatum.attributes?.kind;
            const prediction = nodeDatum.attributes?.prediction as
              | Outcome
              | undefined;

            return (
              <g>

                {nodeDatum.attributes?.branch && (
                  <text
                    className={`branch-label ${String(
                      nodeDatum.attributes.branch
                    ).toLowerCase()}`}
                    x={0}
                    y={-66}
                    textAnchor="middle"
                  >
                    {nodeDatum.attributes.branch}
                  </text>
                )}
                
                <foreignObject width={180} height={112} x={-90} y={-56}>
                  <div
                    className={`tree-node ${kind} ${predictionClass(
                      prediction
                    )}`}
                    title={String(nodeDatum.attributes?.stats)}
                    onClick={toggleNode}
                  >
                    <span className="node-type">
                      {kind === "leaf" ? "Leaf" : "Decision"}
                    </span>

                    <strong>{nodeDatum.name}</strong>

                    <small>{nodeDatum.attributes?.samples} samples</small>
                  </div>
                </foreignObject>
              </g>
            );
          }}
        />
      </div>
    </section>
  );
}

export default TreeVisualizer;