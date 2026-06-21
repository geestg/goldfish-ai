# test_yolo.py

from ultralytics import YOLO

model = YOLO("backend/models/best.pt")

image_path = r"D:\goldfish-ai\dataset\mas.jpg"

res = model(image_path)[0]

print("\n===== RESULT =====")
print(res)

print("\n===== BOXES =====")
print(res.boxes)

print("\n===== CONF =====")
if res.boxes is not None:
    print(res.boxes.conf)

print("\n===== XYXY =====")
if res.boxes is not None:
    print(res.boxes.xyxy)

print("\n===== KEYPOINTS =====")
if res.keypoints is not None:
    print(res.keypoints.xy)