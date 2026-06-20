import {
  useEffect,
  useState
} from "react";

import {
  getAndroidStatus
} from "../services/api";

import AndroidLiveStream
  from "../components/AndroidLiveStream";

export default function AndroidMonitorPage() {

  const [
    data,
    setData
  ] = useState(null);

  useEffect(() => {

    load();

    const timer =
      setInterval(
        load,
        3000
      );

    return () =>
      clearInterval(
        timer
      );

  }, []);

  const load = async () => {

    try {

      const res =
        await getAndroidStatus();

      setData(
        res.data
      );

    } catch (err) {

      console.error(
        err
      );
    }
  };

  return (

    <div className="page-container">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>

          <div className="page-title">
            Android Camera Monitor
          </div>

          <div className="page-subtitle">
            Camera Acquisition Device
          </div>

        </div>

      </div>

      {/* ================= DEVICE INFO ================= */}

      <div className="device-grid">

        <div className="device-card">

          <div className="device-title">
            Device
          </div>

          <div className="device-value">
            {
              data?.device_name
              || "-"
            }
          </div>

        </div>

        <div className="device-card">

          <div className="device-title">
            Battery
          </div>

          <div className="device-value">
            {
              data?.battery ?? 0
            }%
          </div>

        </div>

        <div className="device-card">

          <div className="device-title">
            Storage
          </div>

          <div className="device-value">
            {
              data?.storage
              || "-"
            }
          </div>

        </div>

        <div className="device-card">

          <div className="device-title">
            IP Address
          </div>

          <div className="device-value">
            {
              data?.ip
              || "-"
            }
          </div>

        </div>

      </div>

      {/* ================= STATUS ================= */}

      <div className="section">

        <h3>
          Device Status
        </h3>

        <div className="device-grid">

          <div className="device-card">

            <div className="device-title">
              Connection
            </div>

            <div
              className={
                data?.online
                ? "device-value success"
                : "device-value failed"
              }
            >

              {
                data?.online
                ? "ONLINE"
                : "OFFLINE"
              }

            </div>

          </div>

          <div className="device-card">

            <div className="device-title">
              Last Poll
            </div>

            <div className="device-value">
              {
                data?.last_poll
                || "-"
              }
            </div>

          </div>

          <div className="device-card">

            <div className="device-title">
              Last Upload
            </div>

            <div className="device-value">
              {
                data?.last_upload
                || "-"
              }
            </div>

          </div>

          <div className="device-card">

            <div className="device-title">
              Capture Mode
            </div>

            <div className="device-value">
              {
                data?.capture_mode
                || "-"
              }
            </div>

          </div>

        </div>

      </div>

      {/* ================= LIVE STREAM ================= */}

      <AndroidLiveStream />

    </div>

  );

}