import os
import tempfile
import zipfile

from flask import Blueprint
from flask import jsonify
from flask import send_file

dataset_bp = Blueprint(
    "dataset",
    __name__
)

BASE_DIR = "D:/goldfish-ai/dataset"


# =====================================
# DATASET LIST
# =====================================

@dataset_bp.route(
    "/dataset",
    methods=["GET"]
)
def dataset():

    result = []

    if not os.path.exists(
        BASE_DIR
    ):
        return jsonify([])

    for date_folder in sorted(
        os.listdir(BASE_DIR),
        reverse=True
    ):

        path = os.path.join(
            BASE_DIR,
            date_folder
        )

        if not os.path.isdir(path):
            continue

        image_count = 0
        video_count = 0

        image_dir = os.path.join(
            path,
            "images"
        )

        video_dir = os.path.join(
            path,
            "videos"
        )

        if os.path.exists(
            image_dir
        ):
            image_count = len(
                os.listdir(image_dir)
            )

        if os.path.exists(
            video_dir
        ):
            video_count = len(
                os.listdir(video_dir)
            )

        result.append({

            "date":
                date_folder,

            "images":
                image_count,

            "videos":
                video_count

        })

    return jsonify(result)


# =====================================
# DATASET ZIP EXPORT
# =====================================

@dataset_bp.route(
    "/dataset/export/<date>",
    methods=["GET"]
)
def export_dataset(date):

    folder = os.path.join(
        BASE_DIR,
        date
    )

    if not os.path.exists(folder):

        return jsonify({
            "status": "error",
            "message": "Dataset not found"
        }), 404

    temp_zip = os.path.join(
        tempfile.gettempdir(),
        f"{date}.zip"
    )

    with zipfile.ZipFile(
        temp_zip,
        "w",
        zipfile.ZIP_DEFLATED
    ) as zipf:

        for root, dirs, files in os.walk(folder):

            for file in files:

                file_path = os.path.join(
                    root,
                    file
                )

                arcname = os.path.relpath(
                    file_path,
                    folder
                )

                zipf.write(
                    file_path,
                    arcname
                )

    return send_file(
        temp_zip,
        as_attachment=True,
        download_name=f"{date}.zip",
        mimetype="application/zip"
    )