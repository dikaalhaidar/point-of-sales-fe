
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";

import Sidebar from "../../../components/dashboard/Sidebar";
import "../../../style/StockPage.css";

import { getAllStock, type StockItem } from "../../../api";

import StockTable from "./components/StockTable";
import StockDetailModal from "./components/StockDetailModal";
import StockCreateModal from "./components/StockCreateModal";

export default function StockPage() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const pageSize = 10;

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAllStock({
        search,
        page,
        size: pageSize,
        sortBy: "updatedAt",
        direction: "desc",
      });

      setStocks(result.data);
      setTotalElements(
        result.pagination?.totalElements ?? result.data.length
      );
      setTotalPages(Math.max(1, result.pagination?.totalPages ?? 1));
    } catch (err) {
      setStocks([]);
      setTotalElements(0);
      setTotalPages(1);

      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data stok."
      );
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => {
        void fetchStock();
      },
      search.trim() ? 300 : 0
    );

    return () => window.clearTimeout(timeout);
  }, [fetchStock, search]);

  const activeStockCount = useMemo(
    () =>
      stocks.filter(
        (item) => item.status?.toLowerCase() === "active"
      ).length,
    [stocks]
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCreateSuccess = () => {
    setShowCreate(false);
    void fetchStock();
  };

  return (
    <div className="stock-layout">
      <Sidebar role={"Admin"} />

      <main className="stock-main">
        <header className="stock-heading">
          <div>
            <h1>Stok Produk</h1>
          </div>

          <button
            type="button"
            className="stock-primary-button"
            onClick={() => setShowCreate(true)}
          >
            <Plus size={18} />
            <span>Update Stok</span>
          </button>
        </header>

        <section className="stock-summary">


          <div>
            <p>Total produk</p>
            <strong>{totalElements}</strong>
          </div>

          <div className="stock-summary-divider" />

          <div>
            <p>Produk aktif di halaman ini</p>
            <strong>{activeStockCount}</strong>
          </div>
        </section>

        <section className="stock-card">
          <div className="stock-card-heading">
            <div>
              <h2>Daftar Stok</h2>
              <p>Pantau jumlah stok setiap produk.</p>
            </div>

            <button
              type="button"
              className="stock-refresh-button"
              onClick={() => void fetchStock()}
              disabled={loading}
            >
              <RefreshCw
                size={17}
                className={loading ? "stock-spinning" : ""}
              />
              <span>Muat ulang</span>
            </button>
          </div>

          <div className="stock-toolbar">
            <div className="stock-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Cari nama produk..."
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
              />

              {search && (
                <button
                  type="button"
                  className="stock-clear-search"
                  onClick={() => handleSearch("")}
                  aria-label="Hapus pencarian"
                >
                  ×
                </button>
              )}
            </div>

            <span className="stock-result-count">
              {totalElements} produk
            </span>
          </div>

          {error && (
            <div className="stock-error" role="alert">
              <strong>Gagal memuat stok</strong>
              <span>{error}</span>

              <button type="button" onClick={() => void fetchStock()}>
                Coba lagi
              </button>
            </div>
          )}

          <StockTable
            stocks={stocks}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onDetail={(item) => {
              setSelectedStock(item);
              setShowDetail(true);
            }}
          />
        </section>
      </main>

      {showDetail && selectedStock && (
        <StockDetailModal
          productId={selectedStock.productId}
          onClose={() => {
            setShowDetail(false);
            setSelectedStock(null);
          }}
        />
      )}

      {showCreate && (
        <StockCreateModal
          stocks={stocks}
          onClose={() => setShowCreate(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}
