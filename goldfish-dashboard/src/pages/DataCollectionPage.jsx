import {
  useEffect,
  useState
} from "react";

import {
  getDataset,
  getDatasetFiles,
  API_URL
} from "../services/api";

export default function DataCollectionPage() {

  const [folders, setFolders] =
    useState([]);

  const [selectedDate, setSelectedDate] =
    useState(null);

  const [files, setFiles] =
    useState([]);

  const [selectedFile, setSelectedFile] =
    useState(null);

  useEffect(() => {

    loadFolders();

  }, []);

  const loadFolders =
    async () => {

      try {

        const res =
          await getDataset();

        setFolders(
          res.data
        );

        if (
          res.data.length
        ) {

          openFolder(
            res.data[0].date
          );
        }

      } catch (err) {

        console.error(
          err
        );

      }
    };

  const openFolder =
    async (date) => {

      try {

        setSelectedDate(
          date
        );

        const res =
          await getDatasetFiles(
            date
          );

        setFiles(
          res.data
        );

      } catch (err) {

        console.error(
          err
        );

      }
    };

  const openPreview =
    (file) => {

      setSelectedFile(
        file
      );
    };

  const closePreview =
    () => {

      setSelectedFile(
        null
      );
    };

  return (

    <div className="page-container">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>

          <div className="page-title">
            Dataset Explorer
          </div>

          <div className="page-subtitle">
            AI Image & Video Collection
          </div>

        </div>

      </div>

      <div className="analysis-grid">

        {/* ================= LEFT ================= */}

        <div className="section">

          <h3>
            Dataset Folder
          </h3>

          {

            folders.map(
              (
                item,
                index
              ) => (

                <div
                  key={index}
                  className="schedule-item"
                  onClick={() =>
                    openFolder(
                      item.date
                    )
                  }
                  style={{
                    cursor: "pointer"
                  }}
                >

                  <div
                    style={{
                      width: "100%"
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center"
                      }}
                    >

                      <b>
                        {item.date}
                      </b>

                      <a
                        href={
                          `${API_URL}/api/dataset/export/${item.date}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >
                        ZIP
                      </a>

                    </div>

                    <div>

                      IMG :
                      {" "}
                      {item.images}

                      {" | "}

                      VID :
                      {" "}
                      {item.videos}

                    </div>

                  </div>

                </div>

              )
            )

          }

        </div>

        {/* ================= RIGHT ================= */}

        <div className="section">

          <h3>

            {
              selectedDate
              || "Select Folder"
            }

          </h3>

          <div
            className="gallery-grid"
          >

            {

              files.map(
                (
                  file,
                  index
                ) => {

                  const mediaUrl =
                    `${API_URL}/media/${file.path}`;

                  return (

                    <div
                      key={index}
                      className="gallery-card"
                      onClick={() =>
                        openPreview(
                          file
                        )
                      }
                      style={{
                        cursor: "pointer"
                      }}
                    >

                      {

                        file.type ===
                        "image"

                          ? (

                            <img
                              src={mediaUrl}
                              alt={file.name}
                            />

                          )

                          : (

                            <video>

                              <source
                                src={mediaUrl}
                              />

                            </video>

                          )

                      }

                      <div
                        className="gallery-meta"
                      >

                        <div
                          className="gallery-name"
                        >
                          {file.name}
                        </div>

                        <div
                          className="gallery-time"
                        >
                          {file.type}
                        </div>

                      </div>

                    </div>

                  );

                }
              )

            }

          </div>

        </div>

      </div>

      {/* ================= PREVIEW MODAL ================= */}

      {

        selectedFile && (

          <div
            className="modal-backdrop"
            onClick={
              closePreview
            }
          >

            <div
              className="modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <h2>
                Dataset Preview
              </h2>

              {

                selectedFile.type ===
                "image"

                  ? (

                    <img
                      src={
                        `${API_URL}/media/${selectedFile.path}`
                      }
                      alt={
                        selectedFile.name
                      }
                      style={{
                        width: "100%",
                        borderRadius:
                          "12px"
                      }}
                    />

                  )

                  : (

                    <video
                      controls
                      style={{
                        width: "100%"
                      }}
                    >

                      <source
                        src={
                          `${API_URL}/media/${selectedFile.path}`
                        }
                      />

                    </video>

                  )

              }

              <div
                style={{
                  marginTop:
                    "20px"
                }}
              >

                <p>

                  <b>
                    File Name:
                  </b>

                  {" "}

                  {
                    selectedFile.name
                  }

                </p>

                <p>

                  <b>
                    Type:
                  </b>

                  {" "}

                  {
                    selectedFile.type
                  }

                </p>

                <p>

                  <b>
                    Dataset Path:
                  </b>

                  {" "}

                  {
                    selectedFile.path
                  }

                </p>

                <p>

                  <b>
                    Capture Date:
                  </b>

                  {" "}

                  {
                    selectedDate
                  }

                </p>

              </div>

              <button
                onClick={
                  closePreview
                }
                className="btn-primary"
              >
                Close
              </button>

            </div>

          </div>

        )

      }

    </div>

  );

}