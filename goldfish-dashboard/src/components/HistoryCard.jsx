export default function HistoryCard({
  item,
  onPreview
}) {

  const thumbnailUrl =

    item.detection_image_url ||

    item.media_url ||

    null;

  return (

    <div className="history-card">

      {

        thumbnailUrl

        ? (

          <img
            src={thumbnailUrl}
            className="history-thumb"
            alt={`Analysis ${item.id}`}
          />

        )

        : (

          <div
            className="history-thumb"
          >
            No Image
          </div>

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
          Fish : {item.num_fish}
        </div>

        <div
          className="history-meta"
        >
          Length : {item.avg_length_cm} cm
        </div>

        <div
          className="history-meta"
        >
          Feed : {item.feeding_turns}
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