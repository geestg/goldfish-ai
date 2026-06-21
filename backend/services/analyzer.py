import cv2
import numpy as np
import os
import uuid

from ultralytics import YOLO

from config.settings import *

# ================= LOAD MODEL =================

model = YOLO(MODEL_PATH)

# ================= SAVE DETECTION =================

def save_detection_image(
    frame,
    result
):

    os.makedirs(
        OUTPUT_IMAGE_DIR,
        exist_ok=True
    )

    plotted = result.plot()

    filename = (
        f"{uuid.uuid4().hex}.jpg"
    )

    output_path = os.path.join(
        OUTPUT_IMAGE_DIR,
        filename
    )

    cv2.imwrite(
        output_path,
        plotted
    )

    return output_path


# ================= CORE =================

def _process_frame(frame):

    res = model(frame)[0]

    lengths = []

    detections = []

    boxes = None
    confidences = None

    if res.boxes is not None:

        try:

            boxes = (
                res.boxes.xyxy
                .cpu()
                .numpy()
            )

            confidences = (
                res.boxes.conf
                .cpu()
                .numpy()
            )

        except Exception:

            boxes = None
            confidences = None

    if res.keypoints is not None:

        kpts = (
            res.keypoints.xy
            .cpu()
            .numpy()
        )

        for i in range(len(kpts)):

            try:

                head = kpts[i][0]

                tail = kpts[i][1]

                length_px = np.linalg.norm(
                    head - tail
                )

                if length_px < MIN_LENGTH_PX:

                    continue

                length_cm = (
                    length_px / PX_PER_CM
                )

                lengths.append(
                    length_cm
                )

                detection = {

                    "length_cm":
                        round(
                            float(length_cm),
                            2
                        ),

                    "confidence":
                        0.0
                }

                if (
                    boxes is not None
                    and i < len(boxes)
                ):

                    x1, y1, x2, y2 = boxes[i]

                    detection.update({

                        "x1":
                            int(x1),

                        "y1":
                            int(y1),

                        "x2":
                            int(x2),

                        "y2":
                            int(y2)
                    })

                    if (
                        confidences is not None
                        and i < len(confidences)
                    ):

                        detection[
                            "confidence"
                        ] = round(
                            float(
                                confidences[i]
                            ) * 100,
                            2
                        )

                else:

                    detection.update({

                        "x1":
                            int(
                                min(
                                    head[0],
                                    tail[0]
                                )
                            ),

                        "y1":
                            int(
                                min(
                                    head[1],
                                    tail[1]
                                )
                            ),

                        "x2":
                            int(
                                max(
                                    head[0],
                                    tail[0]
                                )
                            ),

                        "y2":
                            int(
                                max(
                                    head[1],
                                    tail[1]
                                )
                            )
                    })

                detections.append(
                    detection
                )

            except Exception:

                continue

    num_fish = len(lengths)

    avg_length = (
        float(np.mean(lengths))
        if lengths
        else 0.0
    )

    return {

        "num_fish":
            int(num_fish),

        "avg_length_cm":
            round(
                avg_length,
                2
            ),

        "detections":
            detections,

        "result":
            res
    }


# ================= IMAGE =================

def analyze_image(path):

    if not os.path.exists(path):

        raise Exception(
            f"Image tidak ditemukan: {path}"
        )

    img = cv2.imread(path)

    if img is None:

        raise Exception(
            "Gagal baca image"
        )

    result = _process_frame(
        img
    )

    detection_image = (
        save_detection_image(
            img,
            result["result"]
        )
    )

    result.pop(
        "result",
        None
    )

    result[
        "detection_image"
    ] = detection_image

    return result


# ================= VIDEO =================

def analyze_video(path):

    if not os.path.exists(path):

        raise Exception(
            f"Video tidak ditemukan: {path}"
        )

    cap = cv2.VideoCapture(
        path
    )

    results = []

    frame_count = 0

    last_frame = None

    last_result = None

    while cap.isOpened():

        ret, frame = cap.read()

        if not ret:

            break

        if frame_count % 10 == 0:

            try:

                result = _process_frame(
                    frame
                )

                results.append(
                    result
                )

                last_frame = frame

                last_result = result

            except Exception:

                pass

        frame_count += 1

    cap.release()

    if not results:

        return {

            "num_fish": 0,

            "avg_length_cm": 0,

            "detections": [],

            "detection_image": None
        }

    detection_image = None

    if (
        last_frame is not None
        and last_result is not None
    ):

        detection_image = (
            save_detection_image(
                last_frame,
                last_result["result"]
            )
        )

    return {

        "num_fish":
            int(
                np.mean([
                    r["num_fish"]
                    for r in results
                ])
            ),

        "avg_length_cm":
            round(
                float(
                    np.mean([
                        r["avg_length_cm"]
                        for r in results
                    ])
                ),
                2
            ),

        "detections":
            last_result.get(
                "detections",
                []
            ),

        "detection_image":
            detection_image
    }