
import { useEffect, useState } from "react";
import { X, Package, RefreshCw } from "lucide-react";
import {
  getStockByProductId,
  type StockItem,
} from "../../../../api";

interface StockDetailModalProps {
  productId: string;
  onClose: () => void;
}

export default function StockDetailModal({
  productId,
  onClose,
}: StockDetailModalProps) {
  const [detail, setDetail] = useState<StockItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchDetail = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getStockByProductId(productId);

        if (active) {
          setDetail(result.data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil detail stok."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchDetail();

    return () => {
      active = false;
    };
  }, [productId]);

  const formatDate = (value?: string) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div
      className="stock-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="stock-modal stock-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-detail-title"
      >
        <div className="stock-modal-header">
          <div className="stock-modal-title-icon">
            <Package size={22} />
          </div>

          <div className="stock-modal-heading">
            <h2 id="stock-detail-title">Detail Stok</h2>
            <p>Informasi stok produk secara lengkap.</p>
          </div>

          <button
            type="button"
            className="stock-modal-close"
            onClick={onClose}
            aria-label="Tutup detail stok"
          >
            <X size={21} />
          </button>
        </div>

        <div className="stock-modal-body">
          {loading ? (
            <div className="stock-modal-state">
              <span className="stock-loader" />
              <p>Memuat detail produk...</p>
            </div>
          ) : error ? (
            <div className="stock-modal-error">
              <p>{error}</p>
              <button
                type="button"
                className="stock-secondary-button"
                onClick={() => window.location.reload()}
              >
                <RefreshCw size={16} />
                Muat ulang halaman
              </button>
            </div>
          ) : detail ? (
            <>
              <div className="stock-detail-product">
                <div className="stock-detail-product-icon">
                  <Package size={34} />
                </div>

                <div>
                  <h3>{detail.productName || "Tanpa nama"}</h3>
                  <p>SKU: {detail.sku || "-"}</p>
                </div>
              </div>

              <div className="stock-detail-quantity-card">
                <span>Jumlah Stok Saat Ini</span>
                <strong>{detail.stock ?? 0}</strong>
                <small>unit tersedia dalam catatan stok</small>
              </div>

              <div className="stock-detail-fields">
                <div className="stock-detail-field">
                  <span>ID Produk</span>
                  <strong className="stock-detail-id">
                    {detail.productId}
                  </strong>
                </div>

                <div className="stock-detail-field">
                  <span>SKU</span>
                  <strong>{detail.sku || "-"}</strong>
                </div>

                <div className="stock-detail-field">
                  <span>Status Produk</span>
                  <strong>
                    {detail.status
                      ? detail.status.charAt(0).toUpperCase() +
                        detail.status.slice(1)
                      : "-"}
                  </strong>
                </div>

                <div className="stock-detail-field">
                  <span>Terakhir Diperbarui</span>
                  <strong>{formatDate(detail.updatedAt)}</strong>
                </div>
              </div>
            </>
          ) : (
            <div className="stock-modal-state">
              <p>Detail produk tidak ditemukan.</p>
            </div>
          )}
        </div>

        <div className="stock-modal-footer">
          <button
            type="button"
            className="stock-secondary-button"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </section>
    </div>
  );
}
