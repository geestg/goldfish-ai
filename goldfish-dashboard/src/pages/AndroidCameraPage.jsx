import { useEffect, useState } from "react";
import { getCameraStatus } from "../services/api";

export default function AndroidCameraPage() {

  const [camera,setCamera] =
    useState(null);

  useEffect(() => {

    load();

    const timer =
      setInterval(
        load,
        3000
      );

    return () =>
      clearInterval(timer);

  }, []);

  const load = async () => {

    try {

      const res =
        await getCameraStatus();

      setCamera(
        res.data
      );

    } catch {}
  };

  return (

    <div className="page-container">

      <div className="page-header">

        <div>

          <div className="page-title">
            Android Camera Monitor
          </div>

          <div className="page-subtitle">
            Realtime Android Device Monitoring
          </div>

        </div>

      </div>

      <div className="device-grid">

        <div className="device-card">
          <div className="device-title">
            Status
          </div>

          <div className="device-value">
            {
              camera?.online
              ? "ONLINE"
              : "OFFLINE"
            }
          </div>
        </div>

        <div className="device-card">
          <div className="device-title">
            IP Address
          </div>

          <div className="device-value">
            {camera?.ip}
          </div>
        </div>

        <div className="device-card">
          <div className="device-title">
            Battery
          </div>

          <div className="device-value">
            {camera?.battery}%
          </div>
        </div>

        <div className="device-card">
          <div className="device-title">
            Resolution
          </div>

          <div className="device-value">
            {camera?.resolution}
          </div>
        </div>

      </div>

    </div>
  );
}