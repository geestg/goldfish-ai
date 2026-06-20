import { useState, useMemo } from "react";

export default function HistoryTable({ data }) {

  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  const paginatedData =
    useMemo(() => {

      const start =
        (page - 1) * PAGE_SIZE;

      return data.slice(
        start,
        start + PAGE_SIZE
      );

    }, [data, page]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        data.length /
        PAGE_SIZE
      )
    );

  if (!data || data.length === 0) {

    return (
      <div className="section">
        <h3>History</h3>
        <p className="status">
          No data recorded
        </p>
      </div>
    );

  }

  return (

    <div className="section">

      <h3>
        Analysis History
      </h3>

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>ID</th>
              <th>Time</th>
              <th>Type</th>
              <th>Fish</th>
              <th>Avg Length</th>
              <th>Feed</th>
              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            {paginatedData.map(
              (item, index) => {

                const status =
                  item.status ||
                  "done";

                return (

                  <tr
                    key={index}
                  >

                    <td>{item.id}</td>

                    <td>
                      {
                        new Date(
                          item.created_at
                        ).toLocaleString()
                      }
                    </td>

                    <td>
                      {item.file_type}
                    </td>

                    <td>
                      {item.num_fish}
                    </td>

                    <td>
                      {item.avg_length_cm} cm
                    </td>

                    <td>
                      {item.feeding_turns}
                    </td>

                    <td
                      className={`status ${status}`}
                    >
                      {status}
                    </td>

                  </tr>

                );

              }
            )}

          </tbody>

        </table>

      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px"
        }}
      >

        <button
          disabled={page <= 1}
          onClick={() =>
            setPage(page - 1)
          }
        >
          Previous
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={
            page >= totalPages
          }
          onClick={() =>
            setPage(page + 1)
          }
        >
          Next
        </button>

      </div>

    </div>

  );

}