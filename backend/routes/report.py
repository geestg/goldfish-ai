from io import BytesIO

from flask import Blueprint
from flask import send_file
from flask import jsonify

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import (
    getSampleStyleSheet
)

from models.db import (
    SessionLocal,
    Analysis
)

report_bp = Blueprint(
    "report",
    __name__
)


@report_bp.route(
    "/report/<int:analysis_id>"
)
def generate_report(
    analysis_id
):

    db = SessionLocal()

    try:

        record = (
            db.query(Analysis)
            .filter(
                Analysis.id == analysis_id
            )
            .first()
        )

        if not record:

            return jsonify({
                "status": "error",
                "message": "Analysis not found"
            }), 404

        buffer = BytesIO()

        doc = SimpleDocTemplate(
            buffer
        )

        styles = (
            getSampleStyleSheet()
        )

        content = []

        content.append(
            Paragraph(
                "Goldfish AI Feeding System",
                styles["Title"]
            )
        )

        content.append(
            Spacer(
                1,
                20
            )
        )

        content.append(
            Paragraph(
                "Analysis Report",
                styles["Heading2"]
            )
        )

        content.append(
            Spacer(
                1,
                12
            )
        )

        content.append(
            Paragraph(
                f"<b>Analysis ID:</b> {record.id}",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"<b>Capture Type:</b> {record.file_type}",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"<b>Fish Count:</b> {record.num_fish}",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"<b>Average Length:</b> {record.avg_length_cm} cm",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"<b>Feeding Turns:</b> {record.feeding_turns}",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"<b>Status:</b> {record.status}",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"<b>Dataset File:</b> {record.file_path}",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"<b>Created At:</b> {record.created_at}",
                styles["BodyText"]
            )
        )

        doc.build(
            content
        )

        buffer.seek(0)

        return send_file(
            buffer,
            as_attachment=True,
            download_name=
            f"goldfish_report_{record.id}.pdf",
            mimetype="application/pdf"
        )

    finally:

        db.close()