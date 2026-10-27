import { useEffect, useState } from "react";
import {
  getProducts,
  getCategories,
  deactivateProduct,
} from "../../../api";
import Sidebar from "../../../components/dashboard/Sidebar";
import Tambah from "./tambah";
import Edit from "./edit";
import Detail from "./detail";
import "../../../style/ProductsList.css";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Product = {
  id: string | number;
  name: string;
  sku?: string;
  categoryName?: string;
  categoryId?: string | number;
  category?: { id?: string | number; name?: string };
  stock?: number;
  price?: number;
  status?: string;
};

type Category = {
  id: string | number;
  name: string;
};

const ITEMS_PER_PAGE = 10;

function getArray(result: any): any[] {
  const candidates = [
    result?.data?.content,
    result?.data?.data,
    result?.data,
    result?.content,
    result,
  ];

  return candidates.find(Array.isArray) ?? [];
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [refresh, setRefresh] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [actionLoadingId, setActionLoadingId] =
    useState<string | number | null>(null);

  const [modal, setModal] = useState<
    "tambah" | "edit" | "detail" | null
  >(null);

  const [selectedId, setSelectedId] =
    useState<string | number | null>(null);

  // Ambil produk dari API sesuai halaman
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const result = await getProducts(currentPage, ITEMS_PER_PAGE);

        if (cancelled) return;

        const data = getArray(result);

        const pagination =
          result?.data?.pagination ??
          result?.data?.meta ??
          result?.pagination ??
          result?.meta ??
          result?.data ??
          result;

        const total = Number(
          pagination?.totalElements ??
            pagination?.total_elements ??
            pagination?.total ??
            data.length
        );

        setProducts(data);
        setTotalElements(
          Number.isFinite(total) ? total : data.length
        );
      } catch (err) {
        if (cancelled) return;

        setProducts([]);
        setTotalElements(0);
        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat produk."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [currentPage, refresh]);

  // Ambil kategori dari API untuk dropdown
  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const result = await getCategories();

        if (cancelled) return;

        const data = getArray(result);

        setCategories(
          data
            .filter(
              (item: any) => item?.id != null && item?.name
            )
            .filter(
              (item: any) =>
                !item.status ||
                String(item.status).toLowerCase() === "active"
            )
            .map((item: any) => ({
              id: item.id,
              name: item.name,
            }))
        );
      } catch (err) {
        if (cancelled) return;

        setMessage(
          err instanceof Error
            ? err.message
            : "Gagal memuat kategori."
        );
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.ceil(
    totalElements / ITEMS_PER_PAGE
  );

  const filteredProducts = products.filter((product) => {
    const keyword = search.trim().toLowerCase();

    const name = String(product.name ?? "").toLowerCase();
    const sku = String(product.sku ?? "").toLowerCase();

    const categoryName =
      product.categoryName ??
      product.category?.name ??
      categories.find(
        (category) =>
          String(category.id) ===
          String(product.categoryId ?? product.category?.id)
      )?.name ??
      "";

    return (
      (name.includes(keyword) || sku.includes(keyword)) &&
      (selectedCategory === "Semua" ||
        categoryName === selectedCategory)
    );
  });

  const refreshList = () => {
    setRefresh((value) => value + 1);
  };

  function changePage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  // Nonaktifkan produk melalui API
  async function handleDeactivate(
    id: string | number,
    name: string
  ) {
    if (
      !window.confirm(
        `Yakin ingin menonaktifkan produk "${name}"?`
      )
    ) {
      return;
    }

    try {
      setActionLoadingId(id);
      setMessage("");

      const result = await deactivateProduct(id);

      setMessage(
        result?.message || "Produk berhasil dinonaktifkan."
      );

      refreshList();
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Gagal menonaktifkan produk."
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="product-page">
      <Sidebar role="Admin" />

      <main className="product-content">
        <div className="product-header">
          <h1>Daftar Produk</h1>

          <button
            type="button"
            onClick={() => setModal("tambah")}
          >
            <Plus size={18} /> Tambah Produk
          </button>
        </div>

        {message && (
          <p className="form-message">{message}</p>
        )}

        {/* Pencarian dan dropdown kategori */}
        <div className="product-filter">
          <input
            type="text"
            placeholder="Cari nama produk atau SKU..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="Semua">Semua Kategori</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.name}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tabel produk */}
        <div className="product-table-wrapper">
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
              {loading ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    Memuat produk...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    {error}
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    Produk tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => {
                  const categoryName =
                    product.categoryName ??
                    product.category?.name ??
                    categories.find(
                      (category) =>
                        String(category.id) ===
                        String(
                          product.categoryId ??
                            product.category?.id
                        )
                    )?.name ??
                    "—";

                  return (
                    <tr key={product.id}>
                      <td>
                        {(currentPage - 1) *
                          ITEMS_PER_PAGE +
                          index +
                          1}
                      </td>

                      <td>—</td>

                      <td>{product.name}</td>

                      <td>{categoryName}</td>

                      <td>{product.stock ?? 0}</td>

                      <td>
                        Rp{" "}
                        {Number(
                          product.price ?? 0
                        ).toLocaleString("id-ID")}
                      </td>

                      <td>
                        {product.status === "active"
                          ? "Aktif"
                          : product.status === "inactive"
                            ? "Tidak Aktif"
                            : product.status ?? "—"}
                      </td>

                      <td className="action-icons">
                        <button
                          type="button"
                          title="Detail"
                          onClick={() => {
                            setSelectedId(product.id);
                            setModal("detail");
                          }}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          title="Edit"
                          onClick={() => {
                            setSelectedId(product.id);
                            setModal("edit");
                          }}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          title="Nonaktifkan"
                          disabled={
                            actionLoadingId === product.id
                          }
                          onClick={() =>
                            void handleDeactivate(
                              product.id,
                              product.name
                            )
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && !error && totalElements > 0 && (
          <div className="product-pagination">
            <p className="product-count">
              Menampilkan{" "}
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                totalElements
              )}{" "}
              dari {totalElements} produk
            </p>

            <div className="pagination-buttons">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  changePage(currentPage - 1)
                }
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={
                    currentPage === page ? "active" : ""
                  }
                  aria-current={
                    currentPage === page ? "page" : undefined
                  }
                  onClick={() => changePage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  changePage(currentPage + 1)
                }
                aria-label="Halaman berikutnya"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Modal tambah */}
        {modal === "tambah" && (
          <Tambah
            onClose={() => setModal(null)}
            onSuccess={refreshList}
          />
        )}

        {/* Modal edit */}
        {modal === "edit" && selectedId !== null && (
          <Edit
            id={selectedId}
            onClose={() => setModal(null)}
            onSuccess={refreshList}
          />
        )}

        {/* Modal detail */}
        {modal === "detail" && selectedId !== null && (
          <Detail
            id={selectedId}
            onClose={() => setModal(null)}
            onEdit={(id) => {
              setSelectedId(id);
              setModal("edit");
            }}
          />
        )}
      </main>
    </div>
  );
}