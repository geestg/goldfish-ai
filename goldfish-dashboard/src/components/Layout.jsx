import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {

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

    </div>
  );
}