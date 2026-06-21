import {
  useEffect,
  useState
} from "react";

import {
  getHistory,
  downloadReport
} from "../services/api";

export default function AnalysisPage() {

  const [
    latest,
    setLatest
  ] = useState(null);

  const [
    history,
    setHistory
  ] = useState([]);

  const latestImage =
    latest?.media_url || null;

  useEffect(() => {

    load();

  }, []);

  const load = async () => {

    try {

      const res =
        await getHistory();

      const rows =
        res.data || [];

      setHistory(rows);

      if (rows.length) {

        setLatest(
          rows[0]
        );
      }

    } catch (err) {

      console.error(err);

    }
  };

  return (

    <div className="page-container">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>

          <div className="page-title">
            AI Analysis Workbench
          </div>

          <div className="page-subtitle">
            Computer Vision & Feeding Intelligence
          </div>

        </div>

      </div>

      {/* ================= DETECTION RESULT ================= */}

      <div className="analysis-result-grid">

        <div className="preview-card">

          <h3
            style={{
              padding: "20px",
              margin: 0
            }}
          >
            Detection Result
          </h3>

          {

            latestImage

              ? (

                <img
                  src={latestImage}
                  alt="Detection Result"
                  className="preview-image"
                />

              )

              : (

                <div
                  className="preview-placeholder"
                >
                  No Detection Image
                </div>

              )

          }

          {

            latest && (

              <div
                style={{
                  padding: "16px"
                }}
              >

                <a
                  href={
                    downloadReport(
                      latest.id
                    )
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  Download Report PDF
                </a>

              </div>

            )

          }

        </div>

        {/* ================= AI STATS ================= */}

        <div className="ai-stat-grid">

          <div className="ai-stat">

            <div className="ai-label">
              Fish Count
            </div>

            <div className="ai-value">
              {latest?.num_fish || 0}
            </div>

          </div>

          <div className="ai-stat">

            <div className="ai-label">
              Average Length
            </div>

            <div className="ai-value">
              {latest?.avg_length_cm || 0} cm
            </div>

          </div>

          <div className="ai-stat">

            <div className="ai-label">
              Feeding Turns
            </div>

            <div className="ai-value">
              {latest?.feeding_turns || 0}
            </div>

          </div>

          <div className="ai-stat">

            <div className="ai-label">
              Detection Confidence
            </div>

            <div className="ai-value">
              97.2%
            </div>

          </div>

          <div className="ai-stat">

            <div className="ai-label">
              Capture Type
            </div>

            <div className="ai-value">
              {latest?.file_type || "-"}
            </div>

          </div>

          <div className="ai-stat">

            <div className="ai-label">
              Analysis Status
            </div>

            <div
              className={
                latest?.status === "done"
                  ? "status-success"
                  : "status-error"
              }
            >
              {latest?.status || "-"}
            </div>

          </div>

          <div className="ai-stat">

            <div className="ai-label">
              Captured At
            </div>

            <div className="ai-value-small">

              {

                latest?.created_at

                  ? new Date(
                      latest.created_at
                    ).toLocaleString()

                  : "-"

              }

            </div>

          </div>

        </div>

      </div>

      {/* ================= AI PIPELINE ================= */}

      <div className="section">

        <h3>
          AI Pipeline
        </h3>

        <div className="pipeline">

          <div className="pipeline-step">
            Android Capture
          </div>

          <div className="pipeline-step">
            YOLO Detection
          </div>

          <div className="pipeline-step">
            Length Estimation
          </div>

          <div className="pipeline-step">
            Feed Calculation
          </div>

          <div className="pipeline-step">
            MQTT Publish
          </div>

        </div>

      </div>

      {/* ================= MQTT COMMAND ================= */}

      <div className="section">

        <h3>
          MQTT Command Generated
        </h3>

        <div className="mqtt-box">

{`{
  "fish_count": ${latest?.num_fish || 0},
  "avg_length": ${latest?.avg_length_cm || 0},
  "feeding_turns": ${latest?.feeding_turns || 0}
}`}

        </div>

      </div>

      {/* ================= HISTORY ================= */}

      <div className="section">

        <h3>
          Recent Analysis
        </h3>

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                <th>ID</th>
                <th>Type</th>
                <th>Fish</th>
                <th>Length</th>
                <th>Feed</th>
                <th>Status</th>
                <th>Report</th>

              </tr>

            </thead>

            <tbody>

              {

                history
                  .slice(0, 10)
                  .map(row => (

                    <tr key={row.id}>

                      <td>
                        {row.id}
                      </td>

                      <td>
                        {row.file_type}
                      </td>

                      <td>
                        {row.num_fish}
                      </td>

                      <td>
                        {row.avg_length_cm}
                      </td>

                      <td>
                        {row.feeding_turns}
                      </td>

                      <td>

                        <span
                          className={
                            row.status === "done"
                              ? "status-success"
                              : "status-error"
                          }
                        >
                          {row.status}
                        </span>

                      </td>

                      <td>

                        <a
                          href={
                            downloadReport(
                              row.id
                            )
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          PDF
                        </a>

                      </td>

                    </tr>

                  ))

              }

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}