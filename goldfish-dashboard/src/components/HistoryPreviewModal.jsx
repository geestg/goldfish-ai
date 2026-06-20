import { API_URL } from "../services/api";

export default function HistoryPreviewModal({
  item,
  onClose
}) {

  if (!item) return null;

  const imageUrl =
  `${API_URL}/media/${item.file_path}`;

  return (

    <div className="modal-backdrop">

      <div className="modal">

        <img
          src={imageUrl}
          style={{
            width:"100%"
          }}
        />

        <h3>
          Analysis Detail
        </h3>

        <p>
          Fish :
          {item.num_fish}
        </p>

        <p>
          Length :
          {item.avg_length_cm}
        </p>

        <p>
          Feed :
          {item.feeding_turns}
        </p>

        <button
          onClick={onClose}
        >
          Close
        </button>

      </div>

    </div>

  );
}