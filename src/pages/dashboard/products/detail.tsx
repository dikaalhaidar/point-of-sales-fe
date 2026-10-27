
import { useEffect, useState } from "react";
import { getProductById } from "../../../api";
import "../../../style/ProductsList.css";

type Props = {
  id: string | number;
  onClose: () => void;
  onEdit: (id: string | number) => void;
};

export default function Detail({ id, onClose, onEdit }: Props) {
  const [product, setProduct] = useState<any>(null);
  const [message, setMessage] = useState("Memuat detail produk...");

  useEffect(() => {
    async function loadProduct() {
      try {
        setMessage("Memuat detail produk...");

        const result = await getProductById(id);
        const data = result?.data?.data ?? result?.data ?? result;

        setProduct(data);
        setMessage("");
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Gagal mengambil detail produk."
        );
      }
    }

    void loadProduct();
  }, [id]);

  return (
    <div className="add-product-overlay">
      <div className="add-product-modal">
        <div className="add-product-heading">
          <h2>Detail Produk</h2>
          <button type="button" onClick={onClose}>✕</button>
        </div>

        {message ? (
          <p>{message}</p>
        ) : product ? (
          <>
            <p><strong>Nama:</strong> {product.name ?? "—"}</p>
            <p><strong>ID:</strong> {product.id ?? "—"}</p>
            <p><strong>SKU:</strong> {product.sku ?? "—"}</p>
            <p>
              <strong>Kategori:</strong>{" "}
              {product.categoryName ?? product.category?.name ?? product.categoryId ?? "—"}
            </p>
            <p><strong>Stok:</strong> {product.stock ?? 0}</p>
            <p>
              <strong>Harga:</strong>{" "}
              Rp {Number(product.price ?? 0).toLocaleString("id-ID")}
            </p>
            <p><strong>Status:</strong> {product.status ?? "—"}</p>

            <div className="add-product-actions">
              <button type="button" onClick={() => onEdit(id)}>
                Edit Produk
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={onClose}
              >
                Tutup
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
