import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardLayouts from "./layouts/DashboardLayouts";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<DashboardLayouts />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route
            path="*"
            element={
              <div className="flex h-screen items-center justify-center text-2xl font-bold text-gray-500">
                404 - Halaman Tidak Ditemukan
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
