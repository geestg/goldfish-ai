export default function AnalysisDetailModal({
  item,
  onClose
}) {

  if (!item) return null;

  const originalImage =
    item.media_url;

  const detectionImage =
    item.detection_image_url;

  return (

    <div
      className="modal-backdrop"
      onClick={onClose}
    >

      <div
        className="analysis-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="modal-header">

          <h2>
            Analysis Detail
          </h2>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        {/* SUMMARY */}

        <div className="detail-grid">

          <div className="detail-item">
            <span>ID</span>
            <b>{item.id}</b>
          </div>

          <div className="detail-item">
            <span>Type</span>
            <b>{item.file_type}</b>
          </div>

          <div className="detail-item">
            <span>Fish Count</span>
            <b>{item.num_fish}</b>
          </div>

          <div className="detail-item">
            <span>Average Length</span>
            <b>{item.avg_length_cm} cm</b>
          </div>

          <div className="detail-item">
            <span>Feed Turns</span>
            <b>{item.feeding_turns}</b>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <b>{item.status}</b>
          </div>

        </div>

        {/* IMAGE PREVIEW */}

        <div className="dual-preview-grid">

          <div className="preview-card">

            <h3>
              Original Capture
            </h3>

            {

              originalImage

              ? (

                <img
                  src={originalImage}
                  className="preview-image"
                  alt="Original"
                />

              )

              : (

                <div className="preview-placeholder">
                  No Image
                </div>

              )

            }

          </div>

          <div className="preview-card">

            <h3>
              YOLO Detection
            </h3>

            {

              detectionImage

              ? (

                <img
                  src={detectionImage}
                  className="preview-image"
                  alt="Detection"
                />

              )

              : (

                <div className="preview-placeholder">
                  No Detection
                </div>

              )

            }

          </div>

        </div>

        {/* DETECTION SUMMARY */}

        {

          item.detections &&
          item.detections.length > 0 && (

            <div className="section">

              <h3>
                Detection Summary
              </h3>

              <table className="analysis-table">

                <thead>

                  <tr>

                    <th>#</th>

                    <th>
                      Length (cm)
                    </th>

                    <th>
                      Confidence
                    </th>

                    <th>
                      Bounding Box
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {

                    item.detections.map(
                      (
                        fish,
                        index
                      ) => (

                        <tr key={index}>

                          <td>
                            Fish {index + 1}
                          </td>

                          <td>
                            {fish.length_cm}
                          </td>

                          <td>

                            {

                              fish.confidence !==
                              undefined

                              ? `${fish.confidence}%`

                              : "-"

                            }

                          </td>

                          <td>

                            {

                              fish.x1 !== undefined

                              ? (

                                <>
                                  ({fish.x1},{fish.y1})
                                  {" → "}
                                  ({fish.x2},{fish.y2})
                                </>

                              )

                              : "-"

                            }

                          </td>

                        </tr>

                      )
                    )

                  }

                </tbody>

              </table>

            </div>

          )

        }

        {/* AI SYSTEM */}

        <div className="section">

          <h3>
            AI System Information
          </h3>

          <div className="detail-grid">

            <div className="detail-item">
              <span>Model</span>
              <b>best.pt</b>
            </div>

            <div className="detail-item">
              <span>Engine</span>
              <b>YOLOv8 Pose</b>
            </div>

            <div className="detail-item">
              <span>Backend</span>
              <b>Flask</b>
            </div>

            <div className="detail-item">
              <span>MQTT</span>
              <b>Mosquitto</b>
            </div>

            <div className="detail-item">
              <span>Device</span>
              <b>ESP32</b>
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}