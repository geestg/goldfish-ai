# services/storage.py
import os
from datetime import datetime

BASE = "data/uploads"

def save_file(file, prefix):
    folder = os.path.join(BASE, prefix)
    os.makedirs(folder, exist_ok=True)

    filename = f"{datetime.now().timestamp()}_{file.filename}"
    path = os.path.join(folder, filename)

    file.save(path)

    return path