import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardLayouts from "./layouts/DashboardLayouts";
import UsersPage from "./pages/users/UsersPage";
import CategoryPage from "./pages/category/CategoryPage";
import CoursePage from "./pages/course/CoursePage";
import CourseDetailPage from "./pages/course/CourseDetailPage";
import ModulePage from "./pages/module/ModulePage";
import LoginPage from "./pages/auth/LoginPage";
import { ToastProvider } from "./components/ui/Toast";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<DashboardLayouts />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/courses" element={<CoursePage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/modules" element={<ModulePage />} />
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
    </ToastProvider>
  );
}

export default App;
