from flask import Blueprint, jsonify, request
from sqlalchemy import desc
import os

from models.db import SessionLocal, Analysis

history_bp = Blueprint("history", __name__)

DATASET_BASE = "D:/goldfish-ai/dataset"


@history_bp.route("/history", methods=["GET"])
def get_history():

    db = SessionLocal()

    try:

        records = (
            db.query(Analysis)
            .order_by(desc(Analysis.created_at))
            .limit(100)
            .all()
        )

        host = request.host_url.rstrip("/")

        result = []

        for r in records:

            media_url = None

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

                    if normalized.startswith(dataset_root):

                        relative_path = normalized.replace(
                            dataset_root + "/",
                            ""
                        )

                        media_url = (
                            f"{host}/media/{relative_path}"
                        )

                except Exception:
                    media_url = None

            result.append({

                "id": r.id,

                # dataset
                "file_type": r.file_type,
                "file_path": r.file_path,
                "media_url": media_url,

                # analysis
                "num_fish": r.num_fish,
                "avg_length_cm": r.avg_length_cm,
                "feeding_turns": r.feeding_turns,

                # process
                "status": r.status,

                # timestamp
                "created_at": (
                    r.created_at.isoformat()
                    if r.created_at
                    else None
                )
            })

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:

        db.close()