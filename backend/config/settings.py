import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

UPLOAD_DIR = os.path.join(BASE_DIR, "data/uploads")
OUTPUT_IMAGE_DIR = os.path.join(BASE_DIR, "data/analisa_gambar")
OUTPUT_VIDEO_DIR = os.path.join(BASE_DIR, "data/analisa_video")

MODEL_PATH = os.path.join(BASE_DIR, "models/best.pt")

# ================= MQTT =================

MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC_FEED = "goldfish/feeder/cmd"

ENABLE_MQTT = True

# ================= CV PARAM =================

PX_PER_CM = 15
CONF_THRESHOLD = 0.45
MIN_LENGTH_PX = 30.0

# ================= AUTO FEED =================

FEED_COOLDOWN = 1800

# ================= DEBUG =================

print("\n================ SETTINGS LOADED ================")
print("SETTINGS FILE :", __file__)
print("BASE_DIR      :", BASE_DIR)
print("ENABLE_MQTT   :", ENABLE_MQTT)
print("MQTT_BROKER   :", MQTT_BROKER)
print("MQTT_PORT     :", MQTT_PORT)
print("=================================================\n")