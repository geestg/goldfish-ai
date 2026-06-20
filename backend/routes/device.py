from flask import Blueprint, jsonify
import json
import os
from datetime import datetime

device_bp = Blueprint(
    "device",
    __name__
)

SCHEDULE_FILE = "data/schedule.json"

EXECUTED = set()


@device_bp.route(
    "/device/command",
    methods=["GET"]
)
def get_command():

    if not os.path.exists(
        SCHEDULE_FILE
    ):
        return jsonify({
            "action": "none"
        })

    with open(
        SCHEDULE_FILE,
        "r"
    ) as f:

        data = json.load(f)

    enabled = data.get(
        "enabled",
        False
    )

    if not enabled:

        return jsonify({
            "action": "none"
        })

    capture_type = data.get(
        "type",
        "image"
    )

    schedules = data.get(
        "times",
        []
    )

    now = datetime.now()

    current = now.strftime(
        "%H:%M"
    )

    today_key = now.strftime(
        "%Y-%m-%d"
    )

    for t in schedules:

        execution_key = (
            f"{today_key}_{t}"
        )

        if (
            current == t
            and execution_key
            not in EXECUTED
        ):

            EXECUTED.add(
                execution_key
            )

            return jsonify({
                "action": "capture",
                "type": capture_type
            })

    return jsonify({
        "action": "none"
    })