import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Layout from "./components/Layout";

import DashboardPage from "./pages/DashboardPage";
import DataCollectionPage from "./pages/DataCollectionPage";
import AnalysisPage from "./pages/AnalysisPage";
import FeedingPage from "./pages/FeedingPage";
import DevicePage from "./pages/DevicePage";
import HistoryPage from "./pages/HistoryPage";
import SystemPage from "./pages/SystemPage";
import AndroidMonitorPage from "./pages/AndroidMonitorPage";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Layout />}
        >

          <Route
            index
            element={<DashboardPage />}
          />

          <Route
            path="collection"
            element={<DataCollectionPage />}
          />

          <Route
            path="analysis"
            element={<AnalysisPage />}
          />

          <Route
            path="feeding"
            element={<FeedingPage />}
          />

          <Route
            path="device"
            element={<DevicePage />}
          />

          <Route
            path="history"
            element={<HistoryPage />}
          />

          <Route
            path="system"
            element={<SystemPage />}
          />

          <Route
            path="camera"
            element={<AndroidMonitorPage />}
          />

        </Route>

      </Routes>

    </BrowserRouter>

  );
}

export default App;