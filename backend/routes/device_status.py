from flask import Blueprint
from flask import jsonify

from services.device_state import (
    DEVICE_STATE
)

device_status_bp = Blueprint(
    "device_status",
    __name__
)


@device_status_bp.route(
    "/device/status",
    methods=["GET"]
)
def status():

    return jsonify(
        DEVICE_STATE
    )