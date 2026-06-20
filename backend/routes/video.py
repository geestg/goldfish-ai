from flask import Blueprint, request, jsonify
from services.storage import save_file
from services.worker import add_task

video_bp = Blueprint("video", __name__)

@video_bp.route("/video/upload", methods=["POST"])
def upload_video():
    file = request.files.get("file")  # 🔥 HARUS SAMA

    if not file:
        return jsonify({"status": "error", "message": "No file"}), 400

    path = save_file(file, "video")

    add_task({
        "type": "video",
        "path": path
    })

    return jsonify({
        "status": "queued",
        "path": path
    })