import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import KategoriPage from "./pages/dashboard/KategoriPage";
import KategoriDetailPage from "./pages/dashboard/KategoriDetailPage";
import TambahKategoriPage from "./pages/dashboard/TambahKategoriPage";
import ProductsList from "./pages/dashboard/products/ProductsList";
import StockPage from "./pages/dashboard/stock/StockPages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default → Login */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin */}
        <Route
          path="/preview/admin"
          element={<DashboardPage role="Admin" />}
        />

        {/* Kategori */}
        <Route
          path="/preview/admin/kategori"
          element={<KategoriPage />}
        />
        <Route
          path="/preview/admin/kategori/tambah"
          element={<TambahKategoriPage />}
        />
        <Route
          path="/preview/admin/kategori/:id"
          element={<KategoriDetailPage />}
        />

        {/* Produk */}
        <Route
          path="/preview/admin/produk"
          element={<ProductsList />}
        />

        {/* Stock */}
        <Route
          path="/preview/admin/stock"
          element={<StockPage />}
        />

        {/* Cashier */}
        <Route
          path="/preview/cashier"
          element={<DashboardPage role="Cashier" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;