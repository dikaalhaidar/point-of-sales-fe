import { useEffect, useState } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import { getProducts } from "../../../api";
import "../../../style/ProductsList.css";
import { Eye, Pencil, Trash2 } from "lucide-react";

type Product = {
  id: string;
  name: string;
  sku: string;
  categoryName: string;
  stock: number;
  price: number;
  status: string;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.data || []))
      .catch(console.error);
  }, []);

  return (
    <div className="product-page">
      <Sidebar role="Admin" />

      <main className="product-content">
        <div className="product-header">
          <h1>Daftar Produk</h1>
          <button>+ Tambah Produk</button>
        </div>

        <div className="product-filter">
          <input placeholder="Cari produk..." />
          <select>
            <option>Semua</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Gambar</th>
              <th>Produk</th>
              <th>Kategori</th>
              <th>Stok</th>
              <th>Harga</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>—</td>
                <td>{p.name}</td>
                <td>{p.categoryName}</td>
                <td>{p.stock}</td>
                <td>Rp. {p.price.toLocaleString("id-ID")}</td>
                <td>
                  {p.status === "active" ? "Aktif" : "Tidak Aktif"}
                </td>
               <td className="action-icons">
  <button title="Lihat">
    <Eye size={15} strokeWidth={2} />
  </button>

  <button title="Edit">
    <Pencil size={15} strokeWidth={2} />
  </button>

  <button title="Hapus">
    <Trash2 size={15} strokeWidth={2} />
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}