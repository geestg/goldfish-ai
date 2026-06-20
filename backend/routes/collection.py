from flask import Blueprint, jsonify
import os

collection_bp = Blueprint(
    "collection",
    __name__
)

BASE_DIR = "D:/goldfish-ai/dataset"


@collection_bp.route(
    "/collection",
    methods=["GET"]
)
def get_collection():

    result = []

    if not os.path.exists(BASE_DIR):
        return jsonify([])

    for date_folder in sorted(
        os.listdir(BASE_DIR),
        reverse=True
    ):

        date_path = os.path.join(
            BASE_DIR,
            date_folder
        )

        if not os.path.isdir(date_path):
            continue

        images = []
        videos = []

        image_dir = os.path.join(
            date_path,
            "images"
        )

        video_dir = os.path.join(
            date_path,
            "videos"
        )

        if os.path.exists(image_dir):

            for f in os.listdir(image_dir):

                images.append({
                    "name": f,
                    "path":
                    f"{date_folder}/images/{f}"
                })

        if os.path.exists(video_dir):

            for f in os.listdir(video_dir):

                videos.append({
                    "name": f,
                    "path":
                    f"{date_folder}/videos/{f}"
                })

        result.append({
            "date": date_folder,
            "images": images,
            "videos": videos
        })

    return jsonify(result)