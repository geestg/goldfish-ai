import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import socket from "../services/socket";

export default function Layout() {

  const [
    toast,
    setToast
  ] = useState(null);

  useEffect(() => {

    const handleNewData = (
      payload
    ) => {

      if (
        payload?.status === "failed"
      ) {
        return;
      }

      setToast({

        fish:
          payload.num_fish || 0,

        avg:
          payload.avg_length_cm || 0,

        feed:
          payload.feeding_turns || 0

      });

      setTimeout(() => {

        setToast(null);

      }, 5000);
    };

    socket.on(
      "new_data",
      handleNewData
    );

    return () => {

      socket.off(
        "new_data",
        handleNewData
      );
    };

  }, []);

  return (

    <div className="app-layout">

      <aside className="sidebar">

        <div className="logo">
          Goldfish AI
        </div>

        <nav>

          <NavLink to="/">
            Dashboard
          </NavLink>

          <NavLink to="/collection">
            Data Collection
          </NavLink>

          <NavLink to="/analysis">
            AI Analysis
          </NavLink>

          <NavLink to="/feeding">
            Feeding Control
          </NavLink>

          <NavLink to="/device">
            Device Monitor
          </NavLink>

          <NavLink to="/history">
            History
          </NavLink>

          <NavLink to="/system">
            System
          </NavLink>

          <NavLink to="/camera">
            Android Camera
          </NavLink>

        </nav>

      </aside>

      <main className="content">

        <Outlet />

      </main>

      {

        toast && (

          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              zIndex: 9999,
              background: "#0f172a",
              color: "#fff",
              padding: "16px 20px",
              borderRadius: "12px",
              boxShadow:
                "0 10px 25px rgba(0,0,0,.3)",
              minWidth: "260px",
              border:
                "1px solid #22c55e"
            }}
          >

            <div
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                color: "#22c55e"
              }}
            >
              New Analysis Received
            </div>

            <div>
              Fish Count :
              {" "}
              {toast.fish}
            </div>

            <div>
              Avg Length :
              {" "}
              {toast.avg}
              {" "}
              cm
            </div>

            <div>
              Feed Turns :
              {" "}
              {toast.feed}
            </div>

          </div>

        )

      }

    </div>

  );
}