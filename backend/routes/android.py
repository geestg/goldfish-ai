from flask import Blueprint
from flask import request
from flask import jsonify

from datetime import datetime

android_bp = Blueprint(
    "android",
    __name__
)

ANDROID_STATE = {

    "device_name": "-",

    "ip": "-",

    "battery": 0,

    "storage": "-",

    "last_poll": "-",

    "last_upload": "-",

    "capture_mode": "image",

    "stream_url": "",

    "online": False
}


# =====================================
# STATUS
# =====================================

@android_bp.route(
    "/android/status"
)
def android_status():

    return jsonify(
        ANDROID_STATE
    )


# =====================================
# HEARTBEAT
# =====================================

@android_bp.route(
    "/android/heartbeat",
    methods=["POST"]
)
def heartbeat():

    data = request.json or {}

    ANDROID_STATE.update({

        "online": True,

        "device_name":
            data.get(
                "device_name",
                "-"
            ),

        "battery":
            data.get(
                "battery",
                0
            ),

        "storage":
            data.get(
                "storage",
                "-"
            ),

        "ip":
            data.get(
                "ip",
                "-"
            ),

        "capture_mode":
            data.get(
                "capture_mode",
                "image"
            ),

        "last_upload":
            data.get(
                "last_upload",
                "-"
            ),

        "stream_url":
            data.get(
                "stream_url",
                ""
            ),

        "last_poll":
            datetime.now()
            .strftime(
                "%H:%M:%S"
            )

    })

    return jsonify({
        "status": "ok"
    })


# =====================================
# STREAM URL
# =====================================

@android_bp.route(
    "/android/stream"
)
def android_stream():

    return jsonify({

        "url":
            ANDROID_STATE.get(
                "stream_url",
                ""
            )

    })