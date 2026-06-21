import {
  useEffect,
  useState,
  useRef
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

  const [
    imageSize,
    setImageSize
  ] = useState({
    width: 1280,
    height: 720
  });

  const imageRef =
    useRef(null);

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

  const getScaleX = () => {

    if (!imageRef.current) {
      return 1;
    }

    return (
      imageRef.current.clientWidth /
      imageSize.width
    );
  };

  const getScaleY = () => {

    if (!imageRef.current) {
      return 1;
    }

    return (
      imageRef.current.clientHeight /
      imageSize.height
    );
  };

  const scaleX =
    getScaleX();

  const scaleY =
    getScaleY();

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
              style={{
                position: "relative"
              }}
            >

              <img
                ref={imageRef}
                src={frameUrl}
                alt="live-camera"
                className="live-stream"
                onLoad={(e) => {

                  setImageSize({

                    width:
                      e.target.naturalWidth,

                    height:
                      e.target.naturalHeight

                  });

                }}
              />

              <div
                className="overlay-layer"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none"
                }}
              >

                {

                  detections.map(
                    (
                      fish,
                      index
                    ) => {

                      const left =
                        fish.x1 * scaleX;

                      const top =
                        fish.y1 * scaleY;

                      const width =
                        (fish.x2 - fish.x1)
                        * scaleX;

                      const height =
                        (fish.y2 - fish.y1)
                        * scaleY;

                      return (

                        <div
                          key={index}
                          className="fish-box"
                          style={{

                            position:
                              "absolute",

                            left:
                              `${left}px`,

                            top:
                              `${top}px`,

                            width:
                              `${width}px`,

                            height:
                              `${height}px`,

                            border:
                              "2px solid #00ff88",

                            boxSizing:
                              "border-box"
                          }}
                        >

                          <div
                            className="fish-label"
                            style={{

                              position:
                                "absolute",

                              top: "-55px",

                              left: 0,

                              background:
                                "#00ff88",

                              color:
                                "#000",

                              padding:
                                "4px 8px",

                              fontSize:
                                "12px",

                              fontWeight:
                                "bold",

                              borderRadius:
                                "6px"
                            }}
                          >

                            Fish #{index + 1}

                            <br />

                            Length:
                            {" "}
                            {fish.length_cm}
                            cm

                            <br />

                            Confidence:
                            {" "}

                            {
                              fish.confidence
                              || 0
                            }
                            %

                          </div>

                        </div>

                      );

                    }
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