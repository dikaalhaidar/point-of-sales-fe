import { useEffect, useMemo, useState, type FormEvent } from "react";
import Sidebar from "../../../components/dashboard/Sidebar";
import "../../../style/ProductsList.css";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";

type Product = {
  id: string | number;
  name: string;
  sku?: string;
  categoryName?: string;
  categoryId?: string;
  stock: number;
  price: number;
  status?: string;
  [key: string]: unknown;
};

type Category = {
  id: string;
  name: string;
  status?: string;
};

type ProductForm = {
  name: string;
  categoryId: string;
  stock: string;
  price: string;
};

const BASE_URL = "https://q24t6dq3-8080.asse.devtunnels.ms";
const ITEMS_PER_PAGE = 10;

const EMPTY_PRODUCT: ProductForm = {
  name: "",
  categoryId: "",
  stock: "",
  price: "",
};

// Membaca data produk dari beberapa kemungkinan format response API
function unwrapProduct(result: any): any {
  let data = result?.data ?? result;

  if (data?.data && !data?.id) {
    data = data.data;
  }

  return data;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const [currentPage, setCurrentPage] = useState(1);
  const [refreshProducts, setRefreshProducts] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState<ProductForm>(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const [actionMessage, setActionMessage] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<
    string | number | null
  >(null);

  // GET /products
  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token login tidak ditemukan. Silakan login kembali.");
        }

        const response = await fetch(
          `${BASE_URL}/products?page=${currentPage}&size=${ITEMS_PER_PAGE}`,
          {
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json().catch(() => null);

        if (!response.ok || result?.success === false) {
          throw new Error(
            result?.message ||
            `Gagal mengambil produk. HTTP ${response.status}`
          );
        }

        if (cancelled) return;

        const rawProducts = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.content)
              ? result.content
              : Array.isArray(result?.data?.content)
                ? result.data.content
                : [];

        const pagination =
          result?.pagination ??
          result?.meta ??
          result?.data?.pagination ??
          result?.data?.meta ??
          result;

        const total =
          pagination?.totalElements ??
          pagination?.total_elements ??
          pagination?.total ??
          result?.data?.totalElements ??
          result?.data?.total_elements ??
          rawProducts.length;

        setProducts(rawProducts);
        setTotalElements(Number(total));
      } catch (err) {
        if (cancelled) return;

        setProducts([]);
        setTotalElements(0);
        setError(
          err instanceof Error ? err.message : "Gagal memuat produk."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [currentPage, refreshProducts]);

  // GET /categories
  useEffect(() => {
    let cancelled = false;

    async function fetchCategories() {
      setCategoryLoading(true);
      setCategoryError("");

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token login tidak ditemukan.");
        }

        const response = await fetch(`${BASE_URL}/categories`, {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json().catch(() => null);

        if (!response.ok || result?.success === false) {
          throw new Error(
            result?.message ||
            `Gagal mengambil kategori. HTTP ${response.status}`
          );
        }

        if (cancelled) return;

        const rawCategories = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.data?.content)
              ? result.data.content
              : Array.isArray(result?.content)
                ? result.content
                : result?.data?.id
                  ? [result.data]
                  : [];

        const mapped: Category[] = rawCategories
          .filter(
            (item: any) =>
              item?.id != null && typeof item?.name === "string"
          )
          .map((item: any) => ({
            id: String(item.id),
            name: item.name,
            status: item.status,
          }))
          .filter(
            (category: Category) =>
              !category.status ||
              category.status.toLowerCase() === "active"
          );

        setCategories(mapped);

        if (mapped.length === 0) {
          setCategoryError("Kategori belum ditemukan.");
        }
      } catch (err) {
        if (cancelled) return;

        setCategories([]);
        setCategoryError(
          err instanceof Error ? err.message : "Gagal memuat kategori."
        );
      } finally {
        if (!cancelled) setCategoryLoading(false);
      }
    }

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const filterCategories = useMemo(() => {
    const names = products
      .map((product) => product.categoryName)
      .filter(
        (name): name is string =>
          typeof name === "string" && name.trim() !== ""
      );

    return [...new Set(names)].sort((a, b) => a.localeCompare(b, "id"));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const name = String(product.name ?? "").toLowerCase();
      const sku = String(product.sku ?? "").toLowerCase();

      const matchesSearch =
        name.includes(keyword) || sku.includes(keyword);

      const matchesCategory =
        selectedCategory === "Semua" ||
        product.categoryName === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(totalElements / ITEMS_PER_PAGE);

  const startItem =
    products.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endItem =
    products.length === 0
      ? 0
      : startItem + products.length - 1;

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  const refreshList = () => {
    setRefreshProducts((previous) => previous + 1);
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(EMPTY_PRODUCT);
    setFormMessage("");
    setShowForm(true);
  };

  // POST /products dan PUT /products/{id}
  const handleSubmitProduct = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setFormMessage("");

    if (!formData.name.trim()) {
      setFormMessage("Nama produk wajib diisi.");
      return;
    }

    if (!formData.categoryId) {
      setFormMessage("Silakan pilih kategori produk.");
      return;
    }

    if (formData.stock.trim() === "" || formData.price.trim() === "") {
      setFormMessage("Stok dan harga wajib diisi.");
      return;
    }

    const stock = Number(formData.stock);
    const price = Number(formData.price);

    if (!Number.isInteger(stock) || stock < 0) {
      setFormMessage("Stok harus bilangan bulat minimal 0.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setFormMessage("Harga harus berupa angka minimal 0.");
      return;
    }

    // Mengikuti schema POST /products yang kamu kirim.
    const payload = {
      name: formData.name.trim(),
      categoryId: formData.categoryId,
      price,
      stock,
    };

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token login tidak ditemukan. Silakan login kembali.");
      }

      const isEditing = editingId !== null;
      const url = isEditing
        ? `${BASE_URL}/products/${editingId}`
        : `${BASE_URL}/products`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ||
          `Gagal ${isEditing ? "mengedit" : "menambahkan"} produk. HTTP ${response.status}`
        );
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(EMPTY_PRODUCT);
      setActionMessage(
        result?.message ||
        (isEditing
          ? "Produk berhasil diperbarui."
          : "Produk berhasil ditambahkan.")
      );

      setCurrentPage(1);
      refreshList();
    } catch (err) {
      setFormMessage(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan produk."
      );
    } finally {
      setSaving(false);
    }
  };

  // GET /products/{id} untuk detail produk
  const handleViewProduct = async (id: string | number) => {
    setDetailProduct(null);
    setDetailError("");
    setDetailLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token login tidak ditemukan.");
      }

      const response = await fetch(`${BASE_URL}/products/${id}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ||
          `Gagal mengambil detail produk. HTTP ${response.status}`
        );
      }

      const product = unwrapProduct(result);

      if (!product || product.id == null) {
        throw new Error("Data detail produk tidak sesuai format API.");
      }

      setDetailProduct(product as Product);
    } catch (err) {
      setDetailError(
        err instanceof Error ? err.message : "Gagal mengambil detail produk."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  // Ambil detail terbaru sebelum membuka form edit
  const handleEditProduct = async (id: string | number) => {
    setFormMessage("");
    setActionMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token login tidak ditemukan.");
      }

      const response = await fetch(`${BASE_URL}/products/${id}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ||
          `Gagal mengambil produk untuk diedit. HTTP ${response.status}`
        );
      }

      const product = unwrapProduct(result);

      if (!product) {
        throw new Error("Data produk tidak ditemukan.");
      }

      const categoryId = String(
        product.categoryId ??
        product.category?.id ??
        products.find((item) => String(item.id) === String(id))
          ?.categoryId ??
        ""
      );

      setEditingId(id);
      setFormData({
        name: String(product.name ?? ""),
        categoryId,
        stock: String(product.stock ?? ""),
        price: String(product.price ?? ""),
      });
      setShowForm(true);

      if (!categoryId) {
        setFormMessage(
          "Pilih kembali kategori produk sebelum menyimpan perubahan."
        );
      }
    } catch (err) {
      setActionMessage(
        err instanceof Error ? err.message : "Gagal membuka form edit."
      );
    }
  };

  // PATCH /products/{id}/deactivate
  // Endpoint ini menonaktifkan produk, bukan menghapus permanen.
  const handleDeactivateProduct = async (
    id: string | number,
    name: string
  ) => {
    const confirmed = window.confirm(
      `Yakin ingin menonaktifkan produk "${name}"?`
    );

    if (!confirmed) return;

    setActionMessage("");

    try {
      setActionLoadingId(id);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token login tidak ditemukan.");
      }

      const response = await fetch(
        `${BASE_URL}/products/${id}/deactivate`,
        {
          method: "PATCH",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ||
          `Gagal menonaktifkan produk. HTTP ${response.status}`
        );
      }

      setActionMessage(
        result?.message || `Produk "${name}" berhasil dinonaktifkan.`
      );

      refreshList();
    } catch (err) {
      setActionMessage(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menonaktifkan produk."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="product-page">
      <Sidebar role="Admin" />

      <main className="product-content">
        <div className="product-header">
          <h1>Daftar Produk</h1>

          <button type="button" onClick={openAddForm}>
            <Plus size={18} />
            Tambah Produk
          </button>
        </div>

        {actionMessage && (
          <p className="form-message" role="status">
            {actionMessage}
          </p>
        )}

        {/* Modal tambah dan edit */}
        {showForm && (
          <div className="add-product-overlay">
            <div
              className="add-product-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-form-title"
            >
              <div className="add-product-heading">
                <h2 id="product-form-title">
                  {editingId !== null ? "Edit Produk" : "Tambah Produk"}
                </h2>

                <button
                  type="button"
                  aria-label="Tutup form"
                  onClick={() => {
                    if (saving) return;
                    setShowForm(false);
                    setEditingId(null);
                    setFormMessage("");
                  }}
                  disabled={saving}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitProduct}>
                <label htmlFor="product-name">Nama Produk</label>
                <input
                  id="product-name"
                  type="text"
                  placeholder="Masukkan nama produk"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      name: event.target.value,
                    })
                  }
                  required
                />

                <label htmlFor="product-category">Kategori</label>
                <select
                  id="product-category"
                  value={formData.categoryId}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      categoryId: event.target.value,
                    })
                  }
                  disabled={categoryLoading || categories.length === 0}
                  required
                >
                  <option value="">
                    {categoryLoading
                      ? "Memuat kategori..."
                      : "Pilih kategori"}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {categoryError && (
                  <p className="form-message">{categoryError}</p>
                )}

                <label htmlFor="product-stock">Stok</label>
                <input
                  id="product-stock"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Masukkan stok"
                  value={formData.stock}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      stock: event.target.value,
                    })
                  }
                  required
                />

                <label htmlFor="product-price">Harga</label>
                <input
                  id="product-price"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Masukkan harga"
                  value={formData.price}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      price: event.target.value,
                    })
                  }
                  required
                />

                {formMessage && (
                  <p className="form-message">{formMessage}</p>
                )}

                <div className="add-product-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormMessage("");
                    }}
                    disabled={saving}
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={saving || categoryLoading}
                  >
                    {saving
                      ? "Menyimpan..."
                      : editingId !== null
                        ? "Simpan Perubahan"
                        : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal detail produk */}
        {(detailLoading || detailProduct || detailError) && (
          <div className="add-product-overlay">
            <div
              className="add-product-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-detail-title"
            >
              <div className="add-product-heading">
                <h2 id="product-detail-title">Detail Produk</h2>

                <button
                  type="button"
                  aria-label="Tutup detail"
                  onClick={() => {
                    setDetailProduct(null);
                    setDetailError("");
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {detailLoading ? (
                <p>Memuat detail produk...</p>
              ) : detailError ? (
                <p className="form-message">{detailError}</p>
              ) : detailProduct ? (
                <div>
                  <p>
                    <strong>Nama:</strong> {detailProduct.name || "—"}
                  </p>
                  <p>
                    <strong>ID:</strong> {detailProduct.id}
                  </p>
                  <p>
                    <strong>SKU:</strong> {detailProduct.sku || "—"}
                  </p>
                  <p>
                    <strong>Kategori:</strong>{" "}
                    {detailProduct.categoryName ||
                      String(detailProduct.categoryId ?? "—")}
                  </p>
                  <p>
                    <strong>Stok:</strong> {detailProduct.stock ?? 0}
                  </p>
                  <p>
                    <strong>Harga:</strong>{" "}
                    Rp{" "}
                    {Number(detailProduct.price || 0).toLocaleString("id-ID")}
                  </p>
                  <p>
                    <strong>Status:</strong> {detailProduct.status || "—"}
                  </p>

                  <div className="add-product-actions">
                    <button
                      type="button"
                      onClick={() => {
                        const id = detailProduct.id;
                        setDetailProduct(null);
                        void handleEditProduct(id);
                      }}
                    >
                      Edit Produk
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setDetailProduct(null)}
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Pencarian dan filter */}
        <div className="product-filter">
          <input
            type="text"
            placeholder="Cari nama produk atau SKU..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="Semua">Semua Kategori</option>

            {filterCategories.map((category) => (
              <option key={category} value={category}>
                {category}
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
                    Memuat data produk...
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
                    {products.length === 0
                      ? "Belum ada data produk."
                      : "Produk tidak ditemukan pada halaman ini."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>

                    <td>—</td>

                    <td>{product.name || "—"}</td>

                    <td>{product.categoryName || "—"}</td>

                    <td>{product.stock ?? 0}</td>

                    <td>
                      Rp{" "}
                      {Number(product.price || 0).toLocaleString("id-ID")}
                    </td>

                    <td>
                      {product.status === "active"
                        ? "Aktif"
                        : product.status === "inactive"
                          ? "Tidak Aktif"
                          : product.status || "—"}
                    </td>

                    <td className="action-icons">
                      <button
                        type="button"
                        title="Detail"
                        aria-label={`Detail ${product.name}`}
                        onClick={() => void handleViewProduct(product.id)}
                      >
                        <Eye size={15} strokeWidth={2} />
                      </button>

                      <button
                        type="button"
                        title="Edit"
                        aria-label={`Edit ${product.name}`}
                        onClick={() => void handleEditProduct(product.id)}
                      >
                        <Pencil size={15} strokeWidth={2} />
                      </button>

                      <button
                        type="button"
                        title="Nonaktifkan"
                        aria-label={`Nonaktifkan ${product.name}`}
                        disabled={actionLoadingId === product.id}
                        onClick={() =>
                          void handleDeactivateProduct(
                            product.id,
                            product.name
                          )
                        }
                      >
                        <Trash2 size={15} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && !error && totalElements > 0 && (
          <div className="product-pagination">
            <p className="product-count">
              Menampilkan {startItem}–{endItem} dari {totalElements} produk
            </p>

            <div className="pagination-buttons">
              <button
                type="button"
                title="Halaman sebelumnya"
                aria-label="Halaman sebelumnya"
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  aria-label={`Halaman ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={currentPage === page ? "active" : ""}
                  onClick={() => changePage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                title="Halaman berikutnya"
                aria-label="Halaman berikutnya"
                disabled={
                  totalPages === 0 || currentPage === totalPages
                }
                onClick={() => changePage(currentPage + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}