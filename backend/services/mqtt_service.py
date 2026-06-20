import json
import uuid
import traceback
import paho.mqtt.client as mqtt

from config.settings import MQTT_BROKER, MQTT_PORT
from utils.logger import logger
from services.socket_instance import socketio

from services.device_state import DEVICE_STATE
from datetime import datetime

TOPIC_CMD = "goldfish/feeder/cmd"
TOPIC_STATUS = "goldfish/feeder/status"

client = mqtt.Client()

connected = False


# ================= CONNECT =================
def on_connect(client, userdata, flags, rc):
    global connected

    print(f"[MQTT DEBUG] on_connect rc={rc}")

    print(
        f"[MQTT DEBUG] MODULE CONNECT={id(client)}"
    )

    if rc == 0:

        connected = True

        print(
            f"[MQTT DEBUG] CONNECTED FLAG={connected}"
        )

        logger.info("[MQTT] Connected")

        client.subscribe(TOPIC_STATUS)

        logger.info(
            f"[MQTT] Subscribed -> {TOPIC_STATUS}"
        )

        print(
            f"[MQTT DEBUG] SUBSCRIBED {TOPIC_STATUS}"
        )

    else:

        logger.error(
            f"[MQTT] Failed with code {rc}"
        )

        print(
            f"[MQTT DEBUG] FAILED rc={rc}"
        )


# ================= DISCONNECT =================
def on_disconnect(client, userdata, rc):
    global connected

    connected = False

    logger.warning(
        "[MQTT] Disconnected"
    )

    print(
        f"[MQTT DEBUG] DISCONNECTED rc={rc}"
    )


# ================= SUBSCRIBE =================
def on_subscribe(
    client,
    userdata,
    mid,
    granted_qos
):
    print(
        f"[MQTT DEBUG] SUBSCRIBE OK qos={granted_qos}"
    )


# ================= RECEIVE =================
def on_message(client, userdata, msg):

    payload = msg.payload.decode()

    print(
        f"[MQTT DEBUG] RX topic={msg.topic}"
    )

    print(
        f"[MQTT DEBUG] PAYLOAD={payload}"
    )

    logger.info(
        f"[MQTT] RX: {payload}"
    )

    try:

        data = json.loads(payload)

        DEVICE_STATE["esp32"] = True

        DEVICE_STATE["mqtt"] = True

        DEVICE_STATE["ip"] = data.get(
            "ip",
            "-"
        )

        DEVICE_STATE["status"] = data.get(
            "status",
            "-"
        )

        DEVICE_STATE["feeding"] = data.get(
            "feeding",
            False
        )

        DEVICE_STATE["turn"] = data.get(
            "turn",
            0
        )

        DEVICE_STATE["total"] = data.get(
            "total",
            0
        )

        DEVICE_STATE["last_update"] = (
            datetime.now()
            .strftime("%H:%M:%S")
        )


        socketio.emit(
            "device_status",
            data
        )

        print(
            "[MQTT DEBUG] SOCKET EMIT device_status"
        )

    except Exception as e:

        logger.error(
            f"[MQTT] Parse error: {e}"
        )

        traceback.print_exc()


# ================= INIT =================
def init_mqtt():

    print(
        f"[MQTT DEBUG] BROKER={MQTT_BROKER}"
    )

    print(
        f"[MQTT DEBUG] PORT={MQTT_PORT}"
    )

    print(
        f"[MQTT DEBUG] CLIENT ID={id(client)}"
    )

    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.on_message = on_message
    client.on_subscribe = on_subscribe

    try:

        print(
            "[MQTT DEBUG] CONNECTING..."
        )

        client.connect(
            MQTT_BROKER,
            MQTT_PORT,
            60
        )

        print(
            "[MQTT DEBUG] LOOP START"
        )

        client.loop_start()

        logger.info(
            "[MQTT] Started"
        )

        print(
            "[MQTT DEBUG] STARTED"
        )

    except Exception as e:

        print(
            f"[MQTT DEBUG] EXCEPTION {e}"
        )

        traceback.print_exc()


# ================= STATUS =================
def get_connection_status():

    print(
        f"[MQTT DEBUG] STATUS CHECK={connected}"
    )

    print(
        f"[MQTT DEBUG] CLIENT ID={id(client)}"
    )

    return connected

# ================= SAFE PUBLISH =================
def publish_feed(turns):

    print(
        f"[MQTT DEBUG] MODULE PUBLISH={id(client)}"
    )

    print(
        f"[MQTT DEBUG] PUBLISH REQUEST connected={connected}"
    )

    if not connected:

        logger.warning(
            "[MQTT] Not connected, skip publish"
        )

        return False

    payload = {
        "action": "feed",
        "run_id": str(uuid.uuid4()),
        "turns": turns,
        "duration": 700,
        "gap": 600
    }

    result = client.publish(
        TOPIC_CMD,
        json.dumps(payload)
    )

    if result.rc == 0:

        logger.info(
            f"[MQTT] Sent feed: {turns}"
        )

        print(
            f"[MQTT DEBUG] FEED SENT turns={turns}"
        )

        return True

    logger.error(
        f"[MQTT] Failed to send: {result.rc}"
    )

    print(
        f"[MQTT DEBUG] FEED FAILED rc={result.rc}"
    )

    return False