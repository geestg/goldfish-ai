from flask import Blueprint, request, jsonify
import json
import os

schedule_bp = Blueprint(
    "schedule",
    __name__
)

SCHEDULE_FILE = "data/schedule.json"


@schedule_bp.route(
    "/schedule",
    methods=["POST"]
)
def set_schedule():

    data = request.json

    os.makedirs(
        "data",
        exist_ok=True
    )

    with open(
        SCHEDULE_FILE,
        "w"
    ) as f:

        json.dump(
            data,
            f,
            indent=2
        )

    return jsonify({
        "status": "saved"
    })


@schedule_bp.route(
    "/schedule",
    methods=["GET"]
)
def get_schedule():

    if not os.path.exists(
        SCHEDULE_FILE
    ):

        return jsonify({
            "enabled": False,
            "type": "image",
            "times": []
        })

    with open(
        SCHEDULE_FILE,
        "r"
    ) as f:

        data = json.load(f)

    return jsonify(data)