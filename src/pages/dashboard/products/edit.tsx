
import { useEffect, useState, type FormEvent } from "react";
import { getCategories, getProductById, updateProduct } from "../../../api";
import "../../../style/ProductsList.css";
type Props = {
  id: string | number;
  onClose: () => void;
  onSuccess: () => void;
};

type Category = {
  id: string | number;
  name: string;
};

export default function Edit({ id, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [productResult, categoryResult] = await Promise.all([
          getProductById(id),
          getCategories(),
        ]);

        const product =
          productResult?.data?.data ??
          productResult?.data ??
          productResult;

        setName(product.name ?? "");
        setCategoryId(
          String(product.categoryId ?? product.category?.id ?? "")
        );
        setStock(String(product.stock ?? ""));
        setPrice(String(product.price ?? ""));

        const data = Array.isArray(categoryResult)
          ? categoryResult
          : Array.isArray(categoryResult?.data)
            ? categoryResult.data
            : Array.isArray(categoryResult?.data?.content)
              ? categoryResult.data.content
              : Array.isArray(categoryResult?.content)
                ? categoryResult.content
                : [];

        setCategories(data);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Gagal memuat data."
        );
      }
    }

    void loadData();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!name.trim() || !categoryId || price === "") {
      setMessage("Nama, kategori, dan harga wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      await updateProduct(id, {
        name: name.trim(),
        categoryId,
        price: Number(price),
      });

      onSuccess();
      onClose();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Gagal mengedit produk."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="add-product-overlay">
      <div className="add-product-modal">
        <div className="add-product-heading">
          <h2>Edit Produk</h2>
          <button type="button" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Nama Produk</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Kategori</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Pilih kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label>Stok</label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />

          <label>Harga</label>
          <input
            type="number"
            min="0"
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

            <button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
