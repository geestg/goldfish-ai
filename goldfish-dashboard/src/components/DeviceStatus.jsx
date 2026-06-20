export default function DeviceStatus({
  deviceStatus,
  feedingStatus,
  lastUpdate
}) {

  const getStatusClass = (status) => {

    switch (status) {

      case "online":
        return "success";

      case "feeding":
        return "processing";

      case "done":
        return "success";

      default:
        return "failed";
    }
  };

  return (
    <div className="section">

      <h3>Device Monitoring</h3>

      <div className="cards">

        <div className="card">

          <p>ESP32</p>

          <h2
            className={
              getStatusClass(deviceStatus.esp32)
            }
          >
            {deviceStatus.esp32.toUpperCase()}
          </h2>

        </div>

        <div className="card">

          <p>MQTT</p>

          <h2
            className={
              getStatusClass(deviceStatus.mqtt)
            }
          >
            {deviceStatus.mqtt.toUpperCase()}
          </h2>

        </div>

        <div className="card">

          <p>Feeding Status</p>

          <h2
            className={
              getStatusClass(feedingStatus)
            }
          >
            {feedingStatus.toUpperCase()}
          </h2>

        </div>

        <div className="card">

          <p>Last Update</p>

          <h2>
            {lastUpdate || "-"}
          </h2>

        </div>

      </div>

    </div>
  );
}