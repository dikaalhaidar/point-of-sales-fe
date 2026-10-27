
import { useEffect, useState, type FormEvent } from "react";
import { createProduct, getCategories } from "../../../api";
import "../../../style/ProductsList.css";
type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

type Category = {
  id: string | number;
  name: string;
  status?: string;
};

export default function Tambah({ onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await getCategories();

        const data = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.data?.content)
              ? result.data.content
              : Array.isArray(result?.content)
                ? result.content
                : [];

        setCategories(
          data.filter(
            (item: Category) =>
              item.id != null &&
              item.name &&
              (!item.status || item.status.toLowerCase() === "active")
          )
        );
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Gagal memuat kategori."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadCategories();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const stockNumber = Number(stock);
    const priceNumber = Number(price);

    if (!name.trim() || !categoryId || stock === "" || price === "") {
      setMessage("Semua data wajib diisi.");
      return;
    }

    if (!Number.isInteger(stockNumber) || stockNumber < 0) {
      setMessage("Stok harus bilangan bulat minimal 0.");
      return;
    }

    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      setMessage("Harga tidak valid.");
      return;
    }

    try {
      setSaving(true);

      await createProduct({
        name: name.trim(),
        categoryId,
        stock: stockNumber,
        price: priceNumber,
      });

      onSuccess();
      onClose();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Gagal menambahkan produk."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="add-product-overlay">
      <div className="add-product-modal">
        <div className="add-product-heading">
          <h2>Tambah Produk</h2>
          <button type="button" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="product-name">Nama Produk</label>
          <input
            id="product-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama produk"
            required
          />

          <label htmlFor="product-category">Kategori</label>
          <select
            id="product-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={loading || categories.length === 0}
            required
          >
            <option value="">
              {loading ? "Memuat kategori..." : "Pilih kategori"}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label htmlFor="product-stock">Stok</label>
          <input
            id="product-stock"
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />

          <label htmlFor="product-price">Harga</label>
          <input
            id="product-price"
            type="number"
            min="0"
            step="any"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          {message && <p className="form-message">{message}</p>}

          <div className="add-product-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={saving}
            >
              Batal
            </button>
            <button type="submit" disabled={saving || loading}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
