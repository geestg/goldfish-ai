import {
  useEffect,
  useState
} from "react";

import {
  getLiveFrameUrl
} from "../services/api";

import socket
  from "../services/socket";

export default function AndroidLiveStream() {

  const [
    frameUrl,
    setFrameUrl
  ] = useState("");

  const [
    detections,
    setDetections
  ] = useState([]);

  useEffect(() => {

    const updateFrame = () => {

      const url =
        `${getLiveFrameUrl()}?t=${Date.now()}`;

      setFrameUrl(url);
    };

    updateFrame();

    const timer =
      setInterval(
        updateFrame,
        1000
      );

    return () =>
      clearInterval(timer);

  }, []);

  useEffect(() => {

    const handleNewData = (
      payload
    ) => {

      if (
        payload?.detections
      ) {

        setDetections(
          payload.detections
        );
      }
    };

    socket.on(
      "new_data",
      handleNewData
    );

    return () => {

      socket.off(
        "new_data",
        handleNewData
      );
    };

  }, []);

  return (

    <div className="section">

      <h3>
        Live Camera Monitor
      </h3>

      {

        frameUrl

          ? (

            <div
              className="stream-container"
            >

              <img
                src={frameUrl}
                alt="live-camera"
                className="live-stream"
              />

              <div
                className="overlay-layer"
              >

                {

                  detections.map(
                    (
                      fish,
                      index
                    ) => (

                      <div
                        key={index}
                        className="fish-box"
                        style={{

                          left:
                            `${fish.x1}px`,

                          top:
                            `${fish.y1}px`,

                          width:
                            `${fish.x2 - fish.x1}px`,

                          height:
                            `${fish.y2 - fish.y1}px`
                        }}
                      >

                        <div
                          className="fish-label"
                        >

                          Fish #{index + 1}

                          <br />

                          {
                            fish.length_cm
                          } cm

                        </div>

                      </div>

                    )
                  )

                }

              </div>

            </div>

          )

          : (

            <div
              className="stream-offline"
            >
              Waiting Android Camera...
            </div>

          )

      }

    </div>

  );

}