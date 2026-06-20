from flask import Blueprint, request, jsonify

import services.mqtt_service as mqtt_service

feed_bp = Blueprint(
    "feed",
    __name__
)


@feed_bp.route(
    "/feed",
    methods=["POST"]
)
def feed():

    try:

        data = request.get_json(
            silent=True
        ) or {}

        turns = int(
            data.get("turns", 1)
        )

        if turns < 1:
            turns = 1

        if turns > 10:
            turns = 10

        print(
            f"[FEED DEBUG] MQTT MODULE={id(mqtt_service)}"
        )

        status = mqtt_service.get_connection_status()

        print(
            f"[FEED DEBUG] STATUS={status}"
        )

        if not status:

            return jsonify({
                "status": "error",
                "message": "MQTT not connected"
            }), 500

        result = mqtt_service.publish_feed(
            turns
        )

        print(
            f"[FEED DEBUG] PUBLISH RESULT={result}"
        )

        return jsonify({
            "status": "success",
            "turns": turns,
            "published": result
        })

    except Exception as e:

        print(
            f"[FEED ERROR] {e}"
        )

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500