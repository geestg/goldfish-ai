export default function DeviceCard({
  title,
  online,
  rows = []
}) {

  return (

    <div className="device-card">

      <div className="device-header">

        <div className="device-title">
          {title}
        </div>

        <div
          className={`device-status ${
            online
              ? "online"
              : "offline"
          }`}
        >
          {online
            ? "ONLINE"
            : "OFFLINE"}
        </div>

      </div>

      <div className="device-info">

        {rows.map((row,index)=>(

          <div
            key={index}
            className="device-row"
          >

            <span className="device-key">
              {row.label}
            </span>

            <span className="device-value">
              {row.value}
            </span>

          </div>

        ))}

      </div>

    </div>

  );
}