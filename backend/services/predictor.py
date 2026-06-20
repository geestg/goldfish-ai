from models.db import SessionLocal, Analysis
import numpy as np


def predict_feeding():

    db = SessionLocal()

    try:
        records = db.query(Analysis).order_by(Analysis.timestamp).all()

        if len(records) < 5:
            return None  # data belum cukup

        # ===== ambil data =====
        X = []
        y = []

        for i, r in enumerate(records):
            X.append([i, r.num_fish, r.avg_length_cm])
            y.append(r.feeding_turns)

        X = np.array(X)
        y = np.array(y)

        # ===== simple linear regression =====
        coef = np.linalg.lstsq(X, y, rcond=None)[0]

        # ===== prediksi next step =====
        next_index = len(records)
        last = records[-1]

        pred = np.dot(
            [next_index, last.num_fish, last.avg_length_cm],
            coef
        )

        return max(round(float(pred), 2), 0)

    finally:
        db.close()