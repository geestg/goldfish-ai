import os

from flask import Blueprint
from flask import jsonify

dataset_files_bp = Blueprint(
    "dataset_files",
    __name__
)

BASE_DIR = "D:/goldfish-ai/dataset"


@dataset_files_bp.route(
    "/dataset/<date>",
    methods=["GET"]
)
def get_dataset_files(date):

    folder = os.path.join(
        BASE_DIR,
        date
    )

    if not os.path.exists(folder):

        return jsonify([])

    files = []

    # images
    image_dir = os.path.join(
        folder,
        "images"
    )

    if os.path.exists(image_dir):

        for f in os.listdir(
            image_dir
        ):

            files.append({

                "type": "image",

                "name": f,

                "path":
                f"{date}/images/{f}"
            })

    # videos
    video_dir = os.path.join(
        folder,
        "videos"
    )

    if os.path.exists(video_dir):

        for f in os.listdir(
            video_dir
        ):

            files.append({

                "type": "video",

                "name": f,

                "path":
                f"{date}/videos/{f}"
            })

    return jsonify(files)