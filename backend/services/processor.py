from services.analyzer import analyze_image, analyze_video
from services.feeder import calculate_feeding
from services.mqtt_service import publish_feed

from models.db import SessionLocal, Analysis
from config.settings import ENABLE_MQTT
from utils.logger import logger
from services.socket_instance import socketio


def process(task):

    print("\n=========== PROCESS START ===========")
    print("TASK =", task)
    print("=====================================\n")

    path = task["path"]
    file_type = task["type"]

    logger.info(f"[PROCESS] {file_type} → {path}")

    print(f"[DEBUG] PATH={path}")
    print(f"[DEBUG] TYPE={file_type}")

    db = SessionLocal()

    try:

        print("[DEBUG] ANALYSIS START")

        # ================= ANALYSIS =================
        if file_type == "image":
            result = analyze_image(path)

        elif file_type == "video":
            result = analyze_video(path)

        else:
            raise Exception("Unknown file type")

        print("[DEBUG] ANALYSIS DONE")
        print(f"[DEBUG] RESULT={result}")

        num_fish = result.get("num_fish", 0)

        avg_length = result.get(
            "avg_length_cm",
            0
        )

        detections = result.get(
            "detections",
            []
        )

        logger.info(
            f"[AI] fish={num_fish}, avg={avg_length}"
        )

        print(
            f"[DEBUG] FISH={num_fish} AVG={avg_length}"
        )

        print(
            f"[DEBUG] DETECTIONS={len(detections)}"
        )

        # ================= FEEDING =================
        feeding_turns = calculate_feeding(
            num_fish,
            avg_length
        )

        print(
            f"[DEBUG] FEEDING_TURNS={feeding_turns}"
        )

        # ================= SCORE =================
        feeding_score = 0

        if num_fish > 0:

            feeding_score = round(
                feeding_turns / num_fish,
                3
            )

        logger.info(
            f"[FEED] turns={feeding_turns}, score={feeding_score}"
        )

        print(
            f"[DEBUG] SCORE={feeding_score}"
        )

        # ================= SAVE DB =================
        print("[DEBUG] CREATE RECORD")

        record = Analysis(
            file_type=file_type,
            file_path=path,
            num_fish=num_fish,
            avg_length_cm=avg_length,
            feeding_turns=feeding_turns,
            feeding_score=feeding_score,
            status="done"
        )

        print("[DEBUG] DB ADD")

        db.add(record)

        print("[DEBUG] DB COMMIT")

        db.commit()

        print("[DEBUG] DB REFRESH")

        db.refresh(record)

        print(
            f"[DEBUG] RECORD ID={record.id}"
        )

        # ================= MQTT =================
        if ENABLE_MQTT and feeding_turns > 0:

            print(
                f"[DEBUG] MQTT FEED turns={feeding_turns}"
            )

            publish_feed(
                feeding_turns
            )

        # ================= SOCKET =================
        print("[DEBUG] SOCKET EMIT")

        socketio.emit(
            "new_data",
            {
                "id": record.id,
                "type": file_type,

                "num_fish": num_fish,
                "avg_length_cm": avg_length,

                "feeding_turns": feeding_turns,
                "feeding_score": feeding_score,

                "detections": detections,

                "status": "success"
            }
        )

        print(
            "\n=========== PROCESS SUCCESS ===========\n"
        )

        return record

    except Exception as e:

        print(
            "\n=========== PROCESS ERROR ==========="
        )

        print(type(e))
        print(str(e))

        logger.error(
            f"[ERROR] {e}"
        )

        socketio.emit(
            "new_data",
            {
                "status": "failed",
                "error": str(e)
            }
        )

        return None

    finally:

        db.close()

        print(
            "[DEBUG] DB CLOSED"
        )