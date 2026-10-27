
import { ChevronLeft, ChevronRight, Eye, Package } from "lucide-react";
import type { StockItem } from "../../../../api";

interface StockTableProps {
  stocks: StockItem[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDetail: (item: StockItem) => void;
}

export default function StockTable({
  stocks,
  loading,
  page,
  totalPages,
  onPageChange,
  onDetail,
}: StockTableProps) {
  const getStatus = (item: StockItem) => {
    if (item.status?.toLowerCase() !== "active") {
      return {
        label: "Nonaktif",
        className: "stock-status-inactive",
      };
    }

    if (item.stock <= 0) {
      return {
        label: "Stok Habis",
        className: "stock-status-empty",
      };
    }

    return {
      label: "Tersedia",
      className: "stock-status-available",
    };
  };

  return (
    <>
      <div className="stock-table-wrapper">
        <table className="stock-table">
          <thead>
            <tr>
              <th className="stock-number-column">No.</th>
              <th>Gambar</th>
              <th>Nama Produk</th>
              <th>SKU</th>
              <th>Jumlah Stok</th>
              <th>Status</th>
              <th className="stock-action-column">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="stock-table-message">
                  <span className="stock-loader" />
                  <p>Memuat data stok...</p>
                </td>
              </tr>
            ) : stocks.length === 0 ? (
              <tr>
                <td colSpan={7} className="stock-table-message">
                  <Package size={36} />
                  <strong>Data stok belum tersedia</strong>
                  <p>Produk tidak ditemukan atau belum tersedia.</p>
                </td>
              </tr>
            ) : (
              stocks.map((item, index) => {
                const status = getStatus(item);

                return (
                  <tr key={item.productId}>
                    <td className="stock-number-column">
                      {(page - 1) * 10 + index + 1}
                    </td>

                    <td>—</td>
                    <td>
                      <div className="stock-product-name">
                        <strong>{item.productName || "Tanpa nama"}</strong>
                        <span>{item.sku || "-"}</span>
                      </div>
                    </td>

                    <td className="stock-sku">{item.sku || "-"}</td>

                    <td>
                      <span
                        className={`stock-quantity ${
                          item.stock <= 0
                            ? "stock-quantity-zero"
                            : item.stock <= 10
                              ? "stock-quantity-low"
                              : ""
                        }`}
                      >
                        {item.stock ?? 0}
                      </span>
                    </td>

                    <td>
                      <span className={`stock-status ${status.className}`}>
                        <span className="stock-status-dot" />
                        {status.label}
                      </span>
                    </td>

                    <td className="stock-action-column">
                      <button
                        type="button"
                        className="stock-detail-button"
                        onClick={() => onDetail(item)}
                        title="Lihat detail stok"
                        aria-label={`Lihat detail ${item.productName}`}
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="stock-pagination">
        <span>
          Halaman <strong>{page}</strong> dari{" "}
          <strong>{totalPages}</strong>
        </span>

        <div className="stock-pagination-actions">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={loading || page <= 1}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="stock-pagination-current">{page}</span>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={loading || page >= totalPages}
            aria-label="Halaman selanjutnya"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
