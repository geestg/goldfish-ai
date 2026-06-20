from sqlalchemy import desc

from models.db import (
    SessionLocal,
    Analysis
)


def get_recent_data(limit=10):

    db = SessionLocal()

    try:

        records = (
            db.query(Analysis)
            .order_by(
                desc(
                    Analysis.created_at
                )
            )
            .limit(limit)
            .all()
        )

        return records

    finally:

        db.close()