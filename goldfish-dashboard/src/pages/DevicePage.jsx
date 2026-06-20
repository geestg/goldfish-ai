import {
  useEffect,
  useState
} from "react";

import {
  getDeviceStatus
} from "../services/api";

import DeviceCard from "../components/DeviceCard";

export default function DevicePage() {

  const [device, setDevice] =
    useState(null);

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

  const load =
    async () => {

      try {

        const res =
          await getDeviceStatus();

        setDevice(
          res.data
        );

      } catch (e) {

        console.error(e);

      }
    };

  const progress =
    device?.total
      ? (
          (device.turn || 0)
          /
          device.total
        ) * 100
      : 0;

  return (

    <div className="page-container">

      <div className="page-header">

        <div>

          <div className="page-title">
            Device Operations Center
          </div>

          <div className="page-subtitle">
            IoT & Embedded Monitoring
          </div>

        </div>

      </div>

      {/* =========================
          DEVICE STATUS GRID
      ========================= */}

      <div className="device-grid">

        <DeviceCard
          title="ESP32 Controller"
          online={device?.esp32}
          rows={[
            {
              label: "IP Address",
              value:
                device?.ip || "-"
            },
            {
              label: "Last Seen",
              value:
                device?.last_update || "-"
            }
          ]}
        />

        <DeviceCard
          title="MQTT Broker"
          online={device?.mqtt}
          rows={[
            {
              label: "Topic",
              value:
                "goldfish/feed"
            },
            {
              label: "Status",
              value:
                device?.mqtt
                  ? "Connected"
                  : "Offline"
            }
          ]}
        />

        <DeviceCard
          title="Android Camera"
          online={true}
          rows={[
            {
              label: "Resolution",
              value:
                "1920x1080"
            },
            {
              label: "Mode",
              value:
                "Dataset Capture"
            }
          ]}
        />

        <DeviceCard
          title="AI Backend"
          online={true}
          rows={[
            {
              label: "Inference",
              value:
                "YOLO Detection"
            },
            {
              label: "Status",
              value:
                "Ready"
            }
          ]}
        />

      </div>

      {/* =========================
          FEEDING OPERATIONS
      ========================= */}

      <div className="section">

        <h3>
          Feeding Operations
        </h3>

        <div className="device-row">

          <span>
            Feed Status
          </span>

          <span>
            {
              device?.feeding
                ? "RUNNING"
                : "IDLE"
            }
          </span>

        </div>

        <div className="device-row">

          <span>
            Current Turn
          </span>

          <span>
            {
              device?.turn || 0
            }
          </span>

        </div>

        <div className="device-row">

          <span>
            Target Turn
          </span>

          <span>
            {
              device?.total || 0
            }
          </span>

        </div>

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width:
                `${progress}%`
            }}
          />

        </div>

      </div>

      {/* =========================
          DEVICE EVENTS
      ========================= */}

      <div className="section">

        <h3>
          Latest Device Events
        </h3>

        <div className="event-list">

          <div className="event-item">
            <span>
              Android Camera Connected
            </span>
            <span>
              Recent
            </span>
          </div>

          <div className="event-item">
            <span>
              Dataset Capture Ready
            </span>
            <span>
              Active
            </span>
          </div>

          <div className="event-item">
            <span>
              MQTT Topic Listening
            </span>
            <span>
              goldfish/feed
            </span>
          </div>

          <div className="event-item">
            <span>
              AI Backend Ready
            </span>
            <span>
              YOLO
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}