import { API_URL } from "../services/api";

export default function HistoryCard({
  item,
  onPreview
}) {

  const imageUrl =

    item.file_path

    ? `${API_URL}/media/${item.file_path}`

    : null;

  return (

    <div className="history-card">

      {

        imageUrl

        ? (

          <img
            src={imageUrl}
            className="history-thumb"
          />

        )

        : (

          <div
            className="history-thumb"
          />
        )

      }

      <div
        className="history-content"
      >

        <div
          className="history-title"
        >
          Analysis #{item.id}
        </div>

        <div
          className="history-meta"
        >
          Fish :
          {item.num_fish}
        </div>

        <div
          className="history-meta"
        >
          Length :
          {item.avg_length_cm}
          cm
        </div>

        <div
          className="history-meta"
        >
          Feed :
          {item.feeding_turns}
        </div>

        <div
          className="history-meta"
        >
          {
            new Date(
              item.created_at
            ).toLocaleString()
          }
        </div>

        <div
          className="history-actions"
        >

          <button
            onClick={() =>
              onPreview(item)
            }
          >
            View
          </button>

        </div>

      </div>

    </div>

  );
}