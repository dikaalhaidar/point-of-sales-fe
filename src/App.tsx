import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import KategoriPage from "./pages/dashboard/KategoriPage";
import KategoriDetailPage from "./pages/dashboard/KategoriDetailPage";
import TambahKategoriPage from "./pages/dashboard/TambahKategoriPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default → Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Admin */}
        <Route path="/preview/admin" element={<DashboardPage role="Admin" />} />
        <Route path="/preview/admin/kategori" element={<KategoriPage />} />
        <Route path="/preview/admin/kategori/tambah" element={<TambahKategoriPage />} />
        <Route path="/preview/admin/kategori/:id" element={<KategoriDetailPage />} />

        {/* Cashier */}
        <Route path="/preview/cashier" element={<DashboardPage role="Cashier" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;