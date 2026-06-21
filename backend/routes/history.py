from flask import Blueprint
from flask import jsonify
from flask import request

from sqlalchemy import desc

import os
import json

from models.db import (
    SessionLocal,
    Analysis
)

history_bp = Blueprint(
    "history",
    __name__
)

DATASET_BASE = "D:/goldfish-ai/dataset"

ANALYSIS_IMAGE_DIR = (
    "D:/goldfish-ai/backend/data/analisa_gambar"
)


@history_bp.route(
    "/history",
    methods=["GET"]
)
def get_history():

    db = SessionLocal()

    try:

        records = (
            db.query(Analysis)
            .order_by(
                desc(
                    Analysis.created_at
                )
            )
            .limit(100)
            .all()
        )

        host = request.host_url.rstrip("/")

        result = []

        for r in records:

            media_url = None

            detection_image_url = None

            detections = []

            # ================= DETECTIONS JSON =================

            if getattr(
                r,
                "detections_json",
                None
            ):

                try:

                    detections = json.loads(
                        r.detections_json
                    )

                except Exception:

                    detections = []

            # ================= ORIGINAL FILE =================

            if r.file_path:

                try:

                    normalized = (
                        r.file_path
                        .replace("\\", "/")
                    )

                    dataset_root = (
                        DATASET_BASE
                        .replace("\\", "/")
                    )

                    if normalized.startswith(
                        dataset_root
                    ):

                        relative_path = normalized.replace(
                            dataset_root + "/",
                            ""
                        )

                        media_url = (
                            f"{host}/media/{relative_path}"
                        )

                except Exception:

                    media_url = None

            # ================= DETECTION IMAGE =================

            if r.detection_image:

                try:

                    detection_name = (
                        os.path.basename(
                            r.detection_image
                        )
                    )

                    detection_image_url = (
                        f"{host}/detection/{detection_name}"
                    )

                except Exception:

                    detection_image_url = None

            result.append({

                "id":
                    r.id,

                "file_type":
                    r.file_type,

                "file_path":
                    r.file_path,

                "media_url":
                    media_url,

                "detection_image":
                    r.detection_image,

                "detection_image_url":
                    detection_image_url,

                "detections":
                    detections,

                "num_fish":
                    r.num_fish,

                "avg_length_cm":
                    r.avg_length_cm,

                "feeding_turns":
                    r.feeding_turns,

                "feeding_score":
                    r.feeding_score,

                "status":
                    r.status,

                "created_at":
                    (
                        r.created_at.isoformat()
                        if r.created_at
                        else None
                    )
            })

        return jsonify(
            result
        )

    except Exception as e:

        return jsonify({

            "status":
                "error",

            "message":
                str(e)

        }), 500

    finally:

        db.close()