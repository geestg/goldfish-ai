import { useEffect, useState } from "react";

import SummaryCards from "./SummaryCards";
import Alerts from "./Alerts";
import DeviceStatus from "./DeviceStatus";

import useHistory from "../hooks/useHistory";
import useRealtime from "../hooks/useRealtime";

export default function Dashboard() {

  // ================= HISTORY =================

  const historyData = useHistory();

  const [data, setData] = useState([]);

  // ================= SYSTEM STATUS =================
  const [systemStatus, setSystemStatus] = useState("waiting");

  // ================= DEVICE STATUS =================
  const [deviceStatus, setDeviceStatus] = useState({
    esp32: "offline",
    mqtt: "offline"
  });

  // ================= FEEDING STATUS =================
  const [feedingStatus, setFeedingStatus] = useState("idle");

  // ================= LAST UPDATE =================
  const [lastUpdate, setLastUpdate] = useState("-");

  // ================= INITIAL HISTORY =================
  useEffect(() => {

    if (historyData?.length > 0) {
      setData(historyData);
    }

  }, [historyData]);

  // ================= REALTIME =================
  useRealtime({

    onNewData: (newItem) => {

      setSystemStatus("processing");

      setTimeout(() => {

        setData(prev => {

          const updated = [
            newItem,
            ...prev
          ];

          return updated.map((item, index) => ({
            ...item,
            highlight: index === 0
          }));
        });

        setLastUpdate(
          new Date().toLocaleTimeString()
        );

        setSystemStatus("success");

      }, 300);
    },

    onDeviceStatus: (payload) => {

      const status = payload?.status || "";

      setDeviceStatus({
        esp32: "online",
        mqtt: "online"
      });

      if (status === "feeding") {
        setFeedingStatus("feeding");
      }

      else if (status === "feeding_done") {
        setFeedingStatus("done");
      }

      else if (
        status === "online" ||
        status === "alive"
      ) {

        setFeedingStatus(prev =>
          prev === "feeding"
            ? prev
            : "idle"
        );
      }
    }

  });

  // ================= AUTO RESET =================
  useEffect(() => {

    if (systemStatus === "success") {

      const timer = setTimeout(() => {
        setSystemStatus("waiting");
      }, 2000);

      return () => clearTimeout(timer);
    }

  }, [systemStatus]);

  // ================= RENDER =================
  return (
    <div className="page-container">

      <h1>Goldfish AI Dashboard</h1>

      {/* SUMMARY */}
      <SummaryCards data={data} />

      {/* SYSTEM STATUS */}
      <div className="section">

        <h3>System Status</h3>

        <div className="meta">

          <span>
            Backend :
            {" "}
            {systemStatus === "processing"
              ? "PROCESSING"
              : "ONLINE"}
          </span>

          <span>
            Last Update :
            {" "}
            {lastUpdate}
          </span>

        </div>

        {systemStatus === "waiting" && (
          <p className="status">
            Waiting for analysis...
          </p>
        )}

        {systemStatus === "processing" && (
          <p className="status processing">
            Processing AI analysis...
          </p>
        )}

        {systemStatus === "success" && (
          <p className="status success">
            Analysis completed
          </p>
        )}

      </div>

      {/* DEVICE STATUS */}
      <DeviceStatus
        deviceStatus={deviceStatus}
        feedingStatus={feedingStatus}
        lastUpdate={lastUpdate}
      />

      {/* AI DECISION */}
      <Alerts data={data} />

    </div>
  );
}