#define MQTT_MAX_PACKET_SIZE 512

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>

/* ================= WIFI ================= */
const char* WIFI_SSID = "Efeeder";
const char* WIFI_PASS = "11111111";

/* ================= MQTT ================= */
const char* MQTT_BROKER = "192.168.137.1";
const int MQTT_PORT = 1883;

const char* TOPIC_CMD    = "goldfish/feeder/cmd";
const char* TOPIC_STATUS = "goldfish/feeder/status";

/* ================= SERVO ================= */
#define SERVO_PIN 18

#define SERVO_OPEN  120
#define SERVO_CLOSE 10

Servo feeder;

/* ================= MQTT ================= */
WiFiClient espClient;
PubSubClient client(espClient);

/* ================= FEED ================= */
bool feeding = false;

int turns = 1;
int currentTurn = 0;

unsigned long feedTimer = 0;
unsigned long feedDelay = 800;

/* ================= HEARTBEAT ================= */
unsigned long lastHeartbeat = 0;
const unsigned long heartbeatInterval = 5000;

/* ================= RUN ID ================= */
String lastRunId = "";

/* ================= STATUS ================= */
void publishStatus(String statusMsg) {

  StaticJsonDocument<256> doc;

  doc["device"]   = "esp32_feeder";
  doc["status"]   = statusMsg;
  doc["feeding"]  = feeding;
  doc["turn"]     = currentTurn;
  doc["total"]    = turns;
  doc["ip"]       = WiFi.localIP().toString();

  char buffer[256];
  serializeJson(doc, buffer);

  client.publish(TOPIC_STATUS, buffer);

  Serial.print("[STATUS] ");
  Serial.println(buffer);
}

/* ================= WIFI ================= */
void connectWiFi() {

  WiFi.mode(WIFI_STA);

  WiFi.begin(WIFI_SSID, WIFI_PASS);

  Serial.print("[WIFI] Connecting");

  while (WiFi.status() != WL_CONNECTED) {

    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("[WIFI] CONNECTED");

  Serial.print("[IP] ");
  Serial.println(WiFi.localIP());
}

/* ================= MQTT ================= */
void reconnectMQTT() {

  while (!client.connected()) {

    Serial.print("[MQTT] Connecting...");

    String clientId = "ESP32_FEEDER_";
    clientId += String(random(0xffff), HEX);

    bool connected = client.connect(
      clientId.c_str(),
      nullptr,
      nullptr,
      TOPIC_STATUS,
      0,
      false,
      "offline"
    );

    if (connected) {

      Serial.println("CONNECTED");

      client.subscribe(TOPIC_CMD);

      publishStatus("online");

    } else {

      Serial.print("FAILED: ");
      Serial.println(client.state());

      delay(3000);
    }
  }
}

/* ================= CALLBACK ================= */
void callback(char* topic, byte* payload, unsigned int length) {

  char buffer[512];

  if (length >= sizeof(buffer)) {
    Serial.println("[ERROR] PAYLOAD TOO LARGE");
    return;
  }

  memcpy(buffer, payload, length);

  buffer[length] = '\0';

  Serial.println();
  Serial.println("========== MQTT ==========");
  Serial.println(buffer);

  StaticJsonDocument<256> doc;

  DeserializationError error = deserializeJson(doc, buffer);

  if (error) {

    Serial.println("[ERROR] JSON INVALID");

    publishStatus("json_error");

    return;
  }

  /* ===== VALIDATE ===== */

  if (!doc.containsKey("action")) return;

  String action = doc["action"];

  if (action != "feed") return;

  /* ===== DEDUP ===== */

  if (doc.containsKey("run_id")) {

    String runId = doc["run_id"].as<String>();

    if (runId == lastRunId) {

      Serial.println("[SKIP] DUPLICATE RUN");
      return;
    }

    lastRunId = runId;
  }

  if (feeding) {

    Serial.println("[SKIP] STILL FEEDING");
    return;
  }

  /* ===== PARSE ===== */

  turns = doc["turns"] | 1;

  if (turns < 1) turns = 1;
  if (turns > 10) turns = 10;

  feedDelay = doc["gap"] | 800;

  currentTurn = 0;

  feeding = true;

  publishStatus("feeding_start");

  Serial.println("[FEED] START");
}

/* ================= SETUP ================= */
void setup() {

  Serial.begin(115200);

  delay(1000);

  feeder.setPeriodHertz(50);

  feeder.attach(SERVO_PIN, 500, 2400);

  feeder.write(SERVO_CLOSE);

  delay(500);

  connectWiFi();

  client.setServer(MQTT_BROKER, MQTT_PORT);

  client.setCallback(callback);

  client.setBufferSize(512);

  client.setKeepAlive(60);

  client.setSocketTimeout(60);

  Serial.println("[SYSTEM] READY");
}

/* ================= LOOP ================= */
void loop() {

  /* MQTT RECONNECT */
  if (!client.connected()) {
    reconnectMQTT();
  }

  client.loop();

  /* WIFI RECONNECT */
  if (WiFi.status() != WL_CONNECTED) {

    Serial.println("[WIFI] RECONNECTING");

    connectWiFi();
  }

  /* HEARTBEAT */
  if (millis() - lastHeartbeat > heartbeatInterval) {

    publishStatus("alive");

    lastHeartbeat = millis();
  }

  /* FEEDING */
  if (!feeding) return;

  unsigned long now = millis();

  if (now - feedTimer > feedDelay) {

    feedTimer = now;

    if (currentTurn < turns) {

      Serial.print("[FEED] TURN ");
      Serial.println(currentTurn + 1);

      feeder.write(SERVO_OPEN);

      delay(700);

      feeder.write(SERVO_CLOSE);

      currentTurn++;

      publishStatus("feeding");

    } else {

      feeding = false;

      publishStatus("feeding_done");

      Serial.println("[FEED] DONE");
    }
  }
}