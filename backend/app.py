from flask import Flask, send_from_directory, abort
from flask_cors import CORS
import os

# ================= ROUTES =================
from routes.image import image_bp
from routes.video import video_bp
from routes.history import history_bp
from routes.device import device_bp
from routes.schedule import schedule_bp
from routes.feed import feed_bp
from routes.collection import collection_bp
from routes.dataset import dataset_bp
from routes.dataset_files import dataset_files_bp
from routes.device_status import device_status_bp
from routes.camera import camera_bp
from routes.android import android_bp
from routes.report import report_bp

# ================= CONFIG =================
from config.settings import (
    UPLOAD_DIR,
    OUTPUT_IMAGE_DIR,
    OUTPUT_VIDEO_DIR,
    ENABLE_MQTT
)

# ================= CORE =================
from utils.logger import logger
from utils.helpers import ensure_dirs
from models.db import init_db

# ================= SERVICES =================
from services.worker import start_worker
from services.socket_instance import socketio
from services.mqtt_service import init_mqtt

DATASET_BASE = "D:/goldfish-ai/dataset"


def create_app():

    print("APP CREATE START")

    app = Flask(__name__)

    print("FLASK CREATED")

    # ================= CORS =================
    CORS(
        app,
        resources={
            r"/*": {
                "origins": "*"
            }
        }
    )

    logger.info("[CORS] Enabled")
    print("[DEBUG] CORS ENABLED")

    # ================= INIT FOLDER =================
    ensure_dirs([
        UPLOAD_DIR,
        OUTPUT_IMAGE_DIR,
        OUTPUT_VIDEO_DIR
    ])

    logger.info("[INIT] Folder ready")
    print("[DEBUG] FOLDER READY")

    # ================= DATABASE =================
    init_db()

    logger.info("[DB] Initialized")
    print("[DEBUG] DATABASE INITIALIZED")

    # ================= SOCKET =================
    socketio.init_app(
        app,
        cors_allowed_origins="*"
    )

    logger.info("[SOCKET] Initialized")
    print("[DEBUG] SOCKET INITIALIZED")

    # ================= MQTT =================
    print(f"[DEBUG] ENABLE_MQTT = {ENABLE_MQTT}")

    if ENABLE_MQTT:

        print("[DEBUG] MQTT INIT START")

        try:

            init_mqtt()

            logger.info("[MQTT] Initialized")

            print("MQTT INIT DONE")

        except Exception as e:

            print(f"[MQTT ERROR] {e}")

            logger.error(
                f"[MQTT ERROR] {e}"
            )

    else:

        print("[DEBUG] MQTT DISABLED")

    # ================= WORKER =================
    start_worker()

    logger.info("[WORKER] Started")

    print("WORKER STARTED")

    # ================= ROUTES =================
    app.register_blueprint(
        image_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        video_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        history_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        device_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        schedule_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        feed_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        collection_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        dataset_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        dataset_files_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        device_status_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        camera_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        android_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        report_bp,
        url_prefix="/api"
    )

    print("[DEBUG] ROUTES REGISTERED")

    # =====================================================
    # DATASET MEDIA
    # =====================================================

    @app.route("/media/<path:filename>")
    def media(filename):

        try:

            full_path = os.path.join(
                DATASET_BASE,
                filename
            )

            if not os.path.exists(
                full_path
            ):
                abort(404)

            directory = os.path.dirname(
                full_path
            )

            file_name = os.path.basename(
                full_path
            )

            return send_from_directory(
                directory,
                file_name
            )

        except Exception as e:

            logger.error(
                f"[MEDIA ERROR] {e}"
            )

            abort(404)

    # =====================================================
    # YOLO DETECTION IMAGE
    # =====================================================

    @app.route(
        "/detection/<path:filename>"
    )
    def detection_image(filename):

        try:

            full_path = os.path.join(
                OUTPUT_IMAGE_DIR,
                filename
            )

            if not os.path.exists(
                full_path
            ):
                abort(404)

            return send_from_directory(
                OUTPUT_IMAGE_DIR,
                filename
            )

        except Exception as e:

            logger.error(
                f"[DETECTION IMAGE ERROR] {e}"
            )

            abort(404)

    # ================= HEALTH =================

    @app.route("/health")
    def health():

        return {
            "status": "ok"
        }

    # ================= ROOT =================

    @app.route("/")
    def root():

        return {
            "message": "Goldfish AI Backend Running",
            "port": 8000,
            "status": "online"
        }

    # ================= DEBUG ROUTES =================

    @app.route("/routes")
    def routes():

        return {
            "routes": [
                {
                    "rule": str(rule),
                    "methods": sorted(
                        list(rule.methods)
                    )
                }
                for rule in app.url_map.iter_rules()
            ]
        }

    print("APP CREATE DONE")

    return app


# ================= RUN =================

app = create_app()

if __name__ == "__main__":

    logger.info(
        "[START] Server running on http://0.0.0.0:8000"
    )

    print("[DEBUG] SERVER STARTING")

    socketio.run(
        app,
        host="0.0.0.0",
        port=8000,
        debug=True,
        use_reloader=False
    )