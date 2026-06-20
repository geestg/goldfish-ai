import os
from flask import Blueprint, request, jsonify
from datetime import datetime
from services.worker import add_task

image_bp = Blueprint("image", __name__)

BASE_DIR = "D:/goldfish-ai/dataset"

@image_bp.route("/upload", methods=["POST"])
def upload():

    file = request.files.get("file")

    if not file:
        return jsonify({"error": "no file"}), 400

    now = datetime.now()
    date_folder = now.strftime("%Y-%m-%d")
    time_name = now.strftime("%H%M%S")

    ext = file.filename.split(".")[-1]

    if ext in ["mp4", "mov"]:
        folder_type = "videos"
        file_type = "video"
    else:
        folder_type = "images"
        file_type = "image"

    save_dir = os.path.join(BASE_DIR, date_folder, folder_type)
    os.makedirs(save_dir, exist_ok=True)

    file_path = os.path.join(save_dir, f"{time_name}.{ext}")
    file.save(file_path)

    print(f"[UPLOAD] {file_path}")

    # 🔥 kirim ke worker
    add_task({
        "path": file_path,
        "type": file_type
    })

    return jsonify({"status": "ok", "path": file_path})