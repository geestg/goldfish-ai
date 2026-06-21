export default function ExecutionTimeline({
  analysis
}) {

  if (!analysis) return null;

  const time =
    analysis.created_at
      ? new Date(
          analysis.created_at
        ).toLocaleString()
      : "-";

  return (

    <div className="section">

      <h3>
        Feeding Execution Timeline
      </h3>

      <div className="timeline">

        <div className="timeline-item">

          <div className="timeline-icon">
            📷
          </div>

          <div>

            <b>
              Capture Received
            </b>

            <div>
              {time}
            </div>

          </div>

        </div>

        <div className="timeline-item">

          <div className="timeline-icon">
            🤖
          </div>

          <div>

            <b>
              AI Analysis Complete
            </b>

            <div>
              Fish Count :
              {" "}
              {analysis.num_fish}
            </div>

          </div>

        </div>

        <div className="timeline-item">

          <div className="timeline-icon">
            📏
          </div>

          <div>

            <b>
              Length Estimation
            </b>

            <div>
              {analysis.avg_length_cm}
              {" "}cm
            </div>

          </div>

        </div>

        <div className="timeline-item">

          <div className="timeline-icon">
            🍽
          </div>

          <div>

            <b>
              Feed Decision
            </b>

            <div>
              {analysis.feeding_turns}
              {" "}Turns
            </div>

          </div>

        </div>

        <div className="timeline-item">

          <div className="timeline-icon">
            📡
          </div>

          <div>

            <b>
              MQTT Publish
            </b>

            <div>
              goldfish/feeder/cmd
            </div>

          </div>

        </div>

        <div className="timeline-item">

          <div className="timeline-icon">
            ✅
          </div>

          <div>

            <b>
              Process Finished
            </b>

            <div>
              {analysis.status}
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}