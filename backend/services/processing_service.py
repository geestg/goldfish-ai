from services.analyzer import analyze_image, analyze_video
from services.feeder import calculate_feeding
from services.predictor import predict_feeding
from services.mqtt_service import publish_feed

from models.db import SessionLocal, Analysis
from config.settings import ENABLE_MQTT
from utils.logger import logger
from services.socket_instance import socketio


def process(task):

    path = task["path"]
    file_type = task["type"]

    logger.info(f"[PROCESS] {file_type} → {path}")

    db = SessionLocal()

    try:
        # ================= ANALYSIS =================
        if file_type == "image":
            result = analyze_image(path)
        elif file_type == "video":
            result = analyze_video(path)
        else:
            raise Exception("Unknown file type")

        num_fish = result.get("num_fish", 0)
        avg_length = result.get("avg_length_cm", 0)

        logger.info(f"[AI] fish={num_fish}, avg={avg_length}")

        # ================= PREDICTIVE FEEDING =================
        predicted = predict_feeding()

        if predicted is not None:
            feeding_turns = predicted
            logger.info(f"[AI-PREDICT] feeding={feeding_turns}")
        else:
            feeding_turns = calculate_feeding(num_fish, avg_length)
            logger.info(f"[AI-RULE] fallback feeding={feeding_turns}")

        # ================= FEEDING SCORE =================
        feeding_score = 0
        if num_fish > 0:
            feeding_score = round(feeding_turns / num_fish, 3)

        logger.info(f"[FEED] turns={feeding_turns}, score={feeding_score}")

        # ================= SAVE DB =================
        record = Analysis(
            file_type=file_type,
            file_path=path,
            num_fish=num_fish,
            avg_length_cm=avg_length,
            feeding_turns=feeding_turns,
            feeding_score=feeding_score,
            status="done"
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        # ================= MQTT =================
        if ENABLE_MQTT and feeding_turns > 0:
            logger.info(f"[MQTT] publish feed={feeding_turns}")
            publish_feed(feeding_turns)

        # ================= REALTIME SOCKET =================
        socketio.emit("new_data", {
            "id": record.id,
            "type": file_type,
            "num_fish": num_fish,
            "avg_length_cm": avg_length,
            "feeding_turns": feeding_turns,
            "feeding_score": feeding_score,
            "status": "success"
        })

        return record

    except Exception as e:
        logger.error(f"[ERROR] {e}")

        socketio.emit("new_data", {
            "status": "failed",
            "error": str(e)
        })

        return None

    finally:
        db.close()