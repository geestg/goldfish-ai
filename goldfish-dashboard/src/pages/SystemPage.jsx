import { useEffect, useState } from "react";

import {
  getHealth,
  getRootStatus,
  getHistory
} from "../services/api";

export default function SystemPage() {

  const [backendStatus, setBackendStatus] =
    useState("checking");

  const [healthStatus, setHealthStatus] =
    useState("checking");

  const [analysisCount, setAnalysisCount] =
    useState(0);

  const [latestAnalysis, setLatestAnalysis] =
    useState("-");

  const [healthScore, setHealthScore] =
    useState(0);

  useEffect(() => {

    loadSystem();

    const interval = setInterval(
      loadSystem,
      5000
    );

    return () =>
      clearInterval(interval);

  }, []);

  const loadSystem = async () => {

    let score = 0;

    try {

      const root =
        await getRootStatus();

      if (
        root.data.status === "online"
      ) {

        setBackendStatus(
          "online"
        );

        score += 30;

      } else {

        setBackendStatus(
          "offline"
        );

      }

    } catch {

      setBackendStatus(
        "offline"
      );

    }

    try {

      const health =
        await getHealth();

      if (
        health.data.status === "ok"
      ) {

        setHealthStatus(
          "healthy"
        );

        score += 30;

      } else {

        setHealthStatus(
          "unhealthy"
        );

      }

    } catch {

      setHealthStatus(
        "unhealthy"
      );

    }

    try {

      const history =
        await getHistory();

      const records =
        history.data || [];

      setAnalysisCount(
        records.length
      );

      if (
        records.length > 0
      ) {

        const latest =
          records[0];

        setLatestAnalysis(

          new Date(
            latest.created_at
          ).toLocaleString()

        );

      }

      score += 40;

    } catch {

      setAnalysisCount(0);

    }

    setHealthScore(score);

  };

  return (

    <div className="page-container">

      <h1>System Status</h1>

      <div className="cards">

        <div className="card">
          <p>Backend</p>

          <h2
            className={
              backendStatus === "online"
                ? "success"
                : "failed"
            }
          >
            {backendStatus}
          </h2>
        </div>

        <div className="card">
          <p>Health</p>

          <h2
            className={
              healthStatus === "healthy"
                ? "success"
                : "failed"
            }
          >
            {healthStatus}
          </h2>
        </div>

        <div className="card">
          <p>Analysis Records</p>

          <h2>
            {analysisCount}
          </h2>
        </div>

        <div className="card">
          <p>Health Score</p>

          <h2>
            {healthScore}%
          </h2>
        </div>

      </div>

      <div className="section">

        <h3>
          System Information
        </h3>

        <div className="meta">

          <span>
            Backend :
            {" "}
            {backendStatus}
          </span>

          <span>
            Health :
            {" "}
            {healthStatus}
          </span>

        </div>

      </div>

      <div className="section">

        <h3>
          Latest Activity
        </h3>

        <p className="status">

          Latest Analysis:

          {" "}

          {latestAnalysis}

        </p>

      </div>

    </div>

  );

}