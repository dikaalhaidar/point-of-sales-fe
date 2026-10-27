import { useState, type FormEvent } from "react";
import {
  X,
  PackagePlus,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import {
  adjustStock,
  type AdjustStockPayload,
  type StockItem,
} from "../../../../api";

interface StockCreateModalProps {
  stocks: StockItem[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function StockCreateModal({
  stocks,
  onClose,
  onSuccess,
}: StockCreateModalProps) {
  const [productId, setProductId] = useState("");
  const [type, setType] = useState<AdjustStockPayload["type"]>("in");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedProduct = stocks.find(
    (item) => item.productId === productId
  );

  const isAdjustment = type === "adjustment";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!productId) {
      setError("Silakan pilih produk terlebih dahulu.");
      return;
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity)) {
      setError("Jumlah stok harus berupa bilangan bulat.");
      return;
    }

    if (isAdjustment) {
      if (parsedQuantity === 0) {
        setError("Adjustment stock tidak boleh bernilai 0.");
        return;
      }

      if (
        parsedQuantity < 0 &&
        selectedProduct &&
        Math.abs(parsedQuantity) > selectedProduct.stock
      ) {
        setError(
          `Stok tidak cukup. Stok saat ini hanya ${selectedProduct.stock}.`
        );
        return;
      }
    } else if (parsedQuantity <= 0) {
      setError("Stok masuk harus berupa bilangan bulat lebih dari 0.");
      return;
    }

    setLoading(true);

    try {
      await adjustStock(productId, {
        type,
        quantity: parsedQuantity,
        note: note.trim(),
      });

      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui stok produk."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="stock-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <section
        className="stock-modal stock-create-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-create-title"
      >
        <div className="stock-modal-header">
          <div className="stock-modal-title-icon">
            <PackagePlus size={22} />
          </div>

          <div className="stock-modal-heading">
            <h2 id="stock-create-title">Tambah / Sesuaikan Stok</h2>
            <p>Catat stok masuk atau lakukan penyesuaian jumlah stok.</p>
          </div>

          <button
            type="button"
            className="stock-modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Tutup popup"
          >
            <X size={21} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="stock-modal-body">
            {error && (
              <div className="stock-form-error" role="alert">
                {error}
              </div>
            )}

            <div className="stock-form-field">
              <label htmlFor="stock-product">Pilih Produk</label>

              <select
                id="stock-product"
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                required
                disabled={loading}
              >
                <option value="">-- Pilih produk --</option>

                {stocks.map((item) => (
                  <option key={item.productId} value={item.productId}>
                    {item.productName} {item.sku ? `(${item.sku})` : ""}
                  </option>
                ))}
              </select>

              {stocks.length === 0 && (
                <small className="stock-form-hint">
                  Belum ada data produk yang dapat dipilih. Muat data stok
                  terlebih dahulu.
                </small>
              )}

              {selectedProduct && (
                <small className="stock-form-hint">
                  Stok saat ini: <strong>{selectedProduct.stock}</strong>
                </small>
              )}
            </div>

            <div className="stock-form-field">
              <label>Jenis Transaksi</label>

              <div className="stock-type-options">
                <button
                  type="button"
                  className={`stock-type-option ${
                    type === "in" ? "stock-type-selected" : ""
                  }`}
                  onClick={() => {
                    setType("in");
                    setError("");
                  }}
                  disabled={loading}
                >
                  <ArrowDownToLine size={19} />

                  <span>
                    <strong>Stok Masuk</strong>
                    <small>Menambah jumlah stok</small>
                  </span>

                  <span className="stock-type-radio">
                    {type === "in" ? "✓" : ""}
                  </span>
                </button>

                <button
                  type="button"
                  className={`stock-type-option ${
                    isAdjustment ? "stock-type-selected" : ""
                  }`}
                  onClick={() => {
                    setType("adjustment");
                    setError("");
                  }}
                  disabled={loading}
                >
                  <ArrowUpFromLine size={19} />

                  <span>
                    <strong>Adjustment Stock</strong>
                    <small>
                      Gunakan angka positif untuk menambah dan negatif untuk
                      mengurangi stok
                    </small>
                  </span>

                  <span className="stock-type-radio">
                    {isAdjustment ? "✓" : ""}
                  </span>
                </button>
              </div>
            </div>

            <div className="stock-form-field">
              <label htmlFor="stock-quantity">Jumlah Stok</label>

              <input
                id="stock-quantity"
                type="number"
                step="1"
                placeholder={
                  isAdjustment
                    ? "Contoh: 1 atau -1"
                    : "Masukkan jumlah stok masuk"
                }
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required
                disabled={loading}
              />

              <small className="stock-form-hint">
                {isAdjustment
                  ? "Nilai negatif mengurangi stok, nilai positif menambah stok."
                  : "Masukkan jumlah stok masuk dalam bilangan bulat positif."}
              </small>
            </div>

            <div className="stock-form-field">
              <label htmlFor="stock-note">
                Catatan <span>(opsional)</span>
              </label>

              <textarea
                id="stock-note"
                rows={3}
                placeholder="Contoh: Restock dari pemasok atau koreksi stok"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="stock-modal-footer">
            <button
              type="button"
              className="stock-secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>

            <button
              type="submit"
              className="stock-primary-button"
              disabled={loading || stocks.length === 0}
            >
              {loading ? "Menyimpan..." : "Simpan Stok"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}