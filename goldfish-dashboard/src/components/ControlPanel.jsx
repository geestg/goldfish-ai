import { useEffect, useState } from "react";
import { setSchedule } from "../services/api";

export default function ControlPanel() {

  const [type, setType] = useState("image");

  const [time, setTime] = useState("");

  const [times, setTimes] = useState([]);

  const [status, setStatus] = useState("");

  const [lastCapture, setLastCapture] =
    useState("-");

  const [nextExecution, setNextExecution] =
    useState("-");

  useEffect(() => {

    if (times.length) {

      const sorted =
        [...times].sort();

      setNextExecution(
        sorted[0]
      );

    } else {

      setNextExecution("-");
    }

  }, [times]);

  const addTime = () => {

    if (!time) return;

    if (times.includes(time)) return;

    setTimes([
      ...times,
      time
    ]);

    setTime("");
  };

  const removeTime = (t) => {

    setTimes(
      times.filter(
        x => x !== t
      )
    );
  };

  const saveSchedule = async () => {

    try {

      await setSchedule({
        enabled: true,
        type,
        times
      });

      setStatus("saved");

    } catch {

      setStatus("error");
    }
  };

  const manualCaptureImage = () => {

    setLastCapture(
      new Date()
        .toLocaleString()
    );

    alert(
      "Manual Image Capture Triggered"
    );
  };

  const manualCaptureVideo = () => {

    setLastCapture(
      new Date()
        .toLocaleString()
    );

    alert(
      "Manual Video Capture Triggered"
    );
  };

  return (

    <>

      <div className="section">

        <h3>
          Capture Scheduler
        </h3>

        <div className="scheduler-form">

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >

            <option value="image">
              Image
            </option>

            <option value="video">
              Video
            </option>

          </select>

          <input
            type="time"
            value={time}
            onChange={(e) =>
              setTime(e.target.value)
            }
          />

          <button
            onClick={addTime}
          >
            Add Time
          </button>

        </div>

        <div className="scheduler-grid">

          <div className="scheduler-panel">

            <div className="scheduler-title">
              Schedule Queue
            </div>

            {
              times.length === 0 &&
              (
                <p className="status">
                  No schedule added
                </p>
              )
            }

            {times.map(t => (

              <div
                key={t}
                className="schedule-chip"
              >

                <span>
                  {t}
                </span>

                <button
                  className="danger-btn"
                  onClick={() =>
                    removeTime(t)
                  }
                >
                  Delete
                </button>

              </div>

            ))}

          </div>

          <div className="scheduler-panel">

            <div className="scheduler-title">
              Scheduler Status
            </div>

            <div className="scheduler-stat">

              <span>
                Next Execution
              </span>

              <span
                className="scheduler-value"
              >
                {nextExecution}
              </span>

            </div>

            <div className="scheduler-stat">

              <span>
                Status
              </span>

              <span
                className={
                  times.length
                    ? "badge-active"
                    : "badge-idle"
                }
              >

                {
                  times.length
                    ? "ACTIVE"
                    : "IDLE"
                }

              </span>

            </div>

            <div className="scheduler-stat">

              <span>
                Capture Type
              </span>

              <span>
                {type.toUpperCase()}
              </span>

            </div>

            <div className="scheduler-stat">

              <span>
                Total Schedule
              </span>

              <span>
                {times.length}
              </span>

            </div>

            <div className="scheduler-stat">

              <span>
                Last Capture
              </span>

              <span>
                {lastCapture}
              </span>

            </div>

          </div>

        </div>

        <button
          className="save-btn"
          onClick={saveSchedule}
        >
          Save Schedule
        </button>

        {
          status === "saved" &&
          (
            <p className="status success">
              Schedule Saved Successfully
            </p>
          )
        }

        {
          status === "error" &&
          (
            <p className="status failed">
              Failed To Save Schedule
            </p>
          )
        }

      </div>

      <div className="section">

        <h3>
          Manual Operation
        </h3>

        <div
          className="scheduler-action"
        >

          <button
            onClick={
              manualCaptureImage
            }
          >
            Capture Image
          </button>

          <button
            onClick={
              manualCaptureVideo
            }
          >
            Capture Video
          </button>

        </div>

      </div>

    </>

  );
}