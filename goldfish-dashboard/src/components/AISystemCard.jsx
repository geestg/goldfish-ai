export default function AISystemCard() {

  const systems = [

    {
      label: "Model",
      value: "best.pt"
    },

    {
      label: "Engine",
      value: "YOLOv8"
    },

    {
      label: "Backend",
      value: "Flask"
    },

    {
      label: "Database",
      value: "SQLite"
    },

    {
      label: "MQTT",
      value: "Mosquitto"
    },

    {
      label: "Device",
      value: "ESP32"
    },

    {
      label: "Android",
      value: "CameraX"
    },

    {
      label: "Dashboard",
      value: "React + Vite"
    }

  ];

  return (

    <div className="section">

      <h3>
        AI System Information
      </h3>

      <table>

        <tbody>

          {

            systems.map(
              (
                item,
                index
              ) => (

                <tr key={index}>

                  <td>
                    {item.label}
                  </td>

                  <td>
                    {item.value}
                  </td>

                </tr>

              )
            )

          }

        </tbody>

      </table>

    </div>

  );

}