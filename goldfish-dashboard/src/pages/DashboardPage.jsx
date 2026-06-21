import { useEffect, useState } from "react";
import { getHistory } from "../services/api";

import useRealtime from "../hooks/useRealtime";
import RealtimeToast from "../components/RealtimeToast";

export default function DashboardPage() {

  const [latest, setLatest] =
    useState(null);

  const [toast, setToast] =
    useState(null);

  useEffect(() => {

    load();

  }, []);

  const load = async () => {

    try {

      const res =
        await getHistory();

      const rows =
        res.data || [];

      if (rows.length > 0) {

        setLatest(rows[0]);

      }

    } catch (error) {

      console.error(
        "[DASHBOARD]",
        error
      );

    }
  };

  // ================= REALTIME =================

  useRealtime({

    onNewData: (payload) => {

      console.log(
        "[DASHBOARD REALTIME]",
        payload
      );

      setLatest(payload);

      setToast({

        num_fish:
          payload.num_fish,

        avg_length_cm:
          payload.avg_length_cm,

        feeding_turns:
          payload.feeding_turns

      });

    }

  });

  // ================= AUTO CLOSE TOAST =================

  useEffect(() => {

    if (!toast) return;

    const timer =
      setTimeout(() => {

        setToast(null);

      }, 5000);

    return () =>
      clearTimeout(timer);

  }, [toast]);

  return (

    <div className="page-container">

      <RealtimeToast
        toast={toast}
        onClose={() =>
          setToast(null)
        }
      />

      <div className="page-header">

        <div>

          <div className="page-title">
            Goldfish AI Operations
          </div>

          <div className="page-subtitle">
            Realtime Monitoring & Feeding Platform
          </div>

        </div>

      </div>

      <div className="pipeline-board">

        <div className="pipeline-node">
          Android Camera
        </div>

        <div className="pipeline-arrow">
          ↓
        </div>

        <div className="pipeline-node">
          Dataset Collection
        </div>

        <div className="pipeline-arrow">
          ↓
        </div>

        <div className="pipeline-node">
          AI Analysis
        </div>

        <div className="pipeline-arrow">
          ↓
        </div>

        <div className="pipeline-node">
          Feeding Decision
        </div>

        <div className="pipeline-arrow">
          ↓
        </div>

        <div className="pipeline-node">
          ESP32 Feeder
        </div>

      </div>

      <div className="metrics-grid">

        <div className="metric-card">

          <div className="metric-title">
            Latest Fish Count
          </div>

          <div className="metric-value">
            {latest?.num_fish || 0}
          </div>

        </div>

        <div className="metric-card">

          <div className="metric-title">
            Average Length
          </div>

          <div className="metric-value">
            {latest?.avg_length_cm || 0} cm
          </div>

        </div>

        <div className="metric-card">

          <div className="metric-title">
            Feeding Turns
          </div>

          <div className="metric-value">
            {latest?.feeding_turns || 0}
          </div>

        </div>

        <div className="metric-card">

          <div className="metric-title">
            Analysis Status
          </div>

          <div className="metric-value">
            {latest?.status || "-"}
          </div>

        </div>

      </div>

      <div className="section">

        <h3>
          Current Operation
        </h3>

        <table>

          <tbody>

            <tr>

              <td>
                Capture Type
              </td>

              <td>
                {latest?.file_type || "-"}
              </td>

            </tr>

            <tr>

              <td>
                Fish Count
              </td>

              <td>
                {latest?.num_fish || 0}
              </td>

            </tr>

            <tr>

              <td>
                Average Length
              </td>

              <td>
                {latest?.avg_length_cm || 0} cm
              </td>

            </tr>

            <tr>

              <td>
                Feed Command
              </td>

              <td>
                {latest?.feeding_turns || 0}
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>

  );

}