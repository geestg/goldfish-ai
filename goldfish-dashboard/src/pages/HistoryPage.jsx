import { useMemo, useState } from "react";

import useHistory from "../hooks/useHistory";

import HistoryCard from "../components/HistoryCard";
import HistoryPreviewModal from "../components/HistoryPreviewModal";

export default function HistoryPage() {

  const { data } = useHistory();

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selected, setSelected] =
    useState(null);

  const filteredData =
    useMemo(() => {

      let result = [...(data || [])];

      if (
        statusFilter !== "all"
      ) {

        result =
          result.filter(item => {

            const status =
              (
                item.status || ""
              ).toLowerCase();

            return (
              status ===
              statusFilter
            );

          });

      }

      if (
        search.trim()
      ) {

        const keyword =
          search.toLowerCase();

        result =
          result.filter(item => {

            return (

              String(
                item.id || ""
              ).includes(
                keyword
              )

              ||

              String(
                item.num_fish || ""
              ).includes(
                keyword
              )

              ||

              String(
                item.file_type || ""
              )
              .toLowerCase()
              .includes(
                keyword
              )

              ||

              String(
                item.status || ""
              )
              .toLowerCase()
              .includes(
                keyword
              )

            );

          });

      }

      return result;

    }, [
      data,
      search,
      statusFilter
    ]);

  const exportCSV = () => {

    const headers = [

      "id",
      "file_type",
      "num_fish",
      "avg_length_cm",
      "feeding_turns",
      "status",
      "created_at"

    ];

    const rows =
      filteredData.map(
        item => [

          item.id,
          item.file_type,
          item.num_fish,
          item.avg_length_cm,
          item.feeding_turns,
          item.status,
          item.created_at

        ]
      );

    const csv = [

      headers.join(","),

      ...rows.map(
        row =>
          row.join(",")
      )

    ].join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "goldfish-history.csv";

    link.click();

    URL.revokeObjectURL(
      url
    );

  };

  return (

    <div className="page-container">

      <div className="page-header">

        <div>

          <div className="page-title">
            Analysis Archive Center
          </div>

          <div className="page-subtitle">
            Historical AI Analysis Records
          </div>

        </div>

      </div>

      <div className="section">

        <div
          className="history-toolbar"
        >

          <input
            type="text"
            placeholder="Search analysis..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <select
            value={
              statusFilter
            }
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="all">
              All Status
            </option>

            <option value="done">
              Done
            </option>

            <option value="success">
              Success
            </option>

            <option value="processing">
              Processing
            </option>

            <option value="failed">
              Failed
            </option>

          </select>

          <button
            onClick={
              exportCSV
            }
          >
            Export CSV
          </button>

          <div
            style={{
              marginLeft:
                "auto",
              color:
                "#94a3b8"
            }}
          >
            Total Records :
            {" "}
            {
              filteredData.length
            }
          </div>

        </div>

      </div>

      <div
        className="history-grid"
      >

        {

          filteredData.map(
            item => (

              <HistoryCard
                key={item.id}
                item={item}
                onPreview={
                  setSelected
                }
              />

            )
          )

        }

      </div>

      <HistoryPreviewModal

        item={selected}

        onClose={() =>
          setSelected(
            null
          )
        }

      />

    </div>

  );

}