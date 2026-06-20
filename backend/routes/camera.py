import os

from datetime import datetime

from flask import Blueprint
from flask import jsonify
from flask import request
from flask import send_file


camera_bp = Blueprint(
    "camera",
    __name__
)

LIVE_DIR = os.path.join(
    "data",
    "live"
)

LATEST_FRAME = os.path.join(
    LIVE_DIR,
    "latest.jpg"
)

os.makedirs(
    LIVE_DIR,
    exist_ok=True
)

CAMERA_STATE = {

    "online": False,

    "ip": "-",

    "battery": 0,

    "resolution": "-",

    "last_capture": "-",

    "last_frame": "-"
}


# =====================================
# STATUS
# =====================================

@camera_bp.route(
    "/camera/status",
    methods=["GET"]
)
def camera_status():

    return jsonify(
        CAMERA_STATE
    )


# =====================================
# FRAME UPLOAD
# =====================================

@camera_bp.route(
    "/camera/frame",
    methods=["POST"]
)
def upload_frame():

    file = request.files.get(
        "frame"
    )

    if not file:

        return jsonify({
            "status": "error",
            "message": "frame not found"
        }), 400

    file.save(
        LATEST_FRAME
    )

    CAMERA_STATE["online"] = True

    CAMERA_STATE["last_frame"] = (
        datetime.now()
        .strftime(
            "%H:%M:%S"
        )
    )

    return jsonify({
        "status": "ok"
    })


# =====================================
# GET LATEST FRAME
# =====================================

@camera_bp.route(
    "/camera/latest",
    methods=["GET"]
)
def latest_frame():

    if not os.path.exists(
        LATEST_FRAME
    ):

        return jsonify({
            "status": "offline"
        }), 404

    return send_file(
        LATEST_FRAME,
        mimetype="image/jpeg"
    )