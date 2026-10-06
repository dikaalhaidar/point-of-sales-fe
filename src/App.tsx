import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import KategoriPage from "./pages/dashboard/KategoriPage";
import KategoriDetailPage from "./pages/dashboard/KategoriDetailPage";
import EditKategoriPage from "./pages/dashboard/EditKategoriPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/preview/admin" element={<DashboardPage role="Admin" />} />
        <Route path="/preview/admin/kategori" element={<KategoriPage />} />

        <Route path="/preview/admin/kategori/tambah" element={<EditKategoriPage />} />
        <Route path="/preview/admin/kategori/:id/edit" element={<EditKategoriPage />} />
        <Route path="/preview/admin/kategori/:id" element={<KategoriDetailPage />} />

        <Route path="/preview/cashier" element={<DashboardPage role="Cashier" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;