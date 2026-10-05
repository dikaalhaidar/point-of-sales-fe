import { useEffect, useState } from "react";
import "../POS/POS.css";
import { getProducts } from "../../api/api";
import type { Product } from "../../types/product";

type CartItem = Product & {
  quantity: number;
};

function POS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  // Sidebar
  const [activeMenu, setActiveMenu] = useState("POS");
  const [reportOpen, setReportOpen] = useState(true);

  // API state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET PRODUCTS FROM API
  // =====================================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();

        if (response.success) {
          setProducts(response.data);
        } else {
          setError(response.message || "Failed to load products");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to connect to Product API");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =====================================================
  // CATEGORY
  // =====================================================
  const categories = [
    "Semua",
    ...Array.from(
      new Set(products.map((product) => product.categoryName))
    ),
  ];

  // =====================================================
  // FILTER PRODUCT
  // =====================================================
  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      activeCategory === "Semua" ||
      product.categoryName === activeCategory;

    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  // =====================================================
  // FORMAT RUPIAH
  // =====================================================
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  // =====================================================
  // ADD TO CART
  // =====================================================
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      return;
    }

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        if (existing.quantity >= product.stock) {
          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // =====================================================
  // TOTAL
  // =====================================================
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // =====================================================
  // MENU CLICK
  // =====================================================
  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
  };

  return (
    <div className="pos-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside className="pos-sidebar">

        {/* =================================================
            LOGO + SYSTEM NAME
        ================================================= */}
        <div className="pos-logo">

          <div className="logo-icon">
            <span></span>
          </div>

          <div className="logo-text">
            Point of Sale!
          </div>

        </div>

        {/* =================================================
            WHITE DIVIDER
        ================================================= */}
        <div className="sidebar-divider"></div>

        {/* =================================================
            SIDEBAR MENU
        ================================================= */}
        <nav className="pos-menu">

          {/* =================================================
              POS
          ================================================= */}
          <button
            className={
              activeMenu === "POS"
                ? "pos-menu-item active"
                : "pos-menu-item"
            }
            onClick={() => handleMenuClick("POS")}
          >
            <span className="menu-icon">
              ▣
            </span>

            <span>
              POS
            </span>
          </button>


          {/* =================================================
              LAPORAN TRANSAKSI
          ================================================= */}
          <div className="menu-section">

            <button
              className="pos-menu-parent"
              onClick={() => setReportOpen(!reportOpen)}
            >

              <span className="menu-parent-left">

                <span className="menu-icon">
                  ▤
                </span>

                <span>
                  Laporan Transaksi
                </span>

              </span>

              <span
                className={
                  reportOpen
                    ? "menu-arrow open"
                    : "menu-arrow"
                }
              >
                ˅
              </span>

            </button>


            {/* =================================================
                SUB MENU
            ================================================= */}
            {reportOpen && (
              <div className="pos-submenu-list">

                <button
                  className={
                    activeMenu === "Ringkasan"
                      ? "pos-submenu-item active"
                      : "pos-submenu-item"
                  }
                  onClick={() =>
                    handleMenuClick("Ringkasan")
                  }
                >

                  <span className="submenu-icon">
                    ↳
                  </span>

                  <span>
                    Ringkasan Pembayaran
                  </span>

                </button>

              </div>
            )}

          </div>

        </nav>


        {/* =====================================================
            SIDEBAR BOTTOM
        ===================================================== */}
        <div className="sidebar-bottom">

          <div className="sidebar-bottom-divider"></div>

          <div className="user-profile">

            <div className="user-avatar">
              AD
            </div>

            <div className="user-info">

              <strong>
                Admin
              </strong>

              <span>
                Mode pratinjau
              </span>

            </div>

            <button
              className="logout-button"
              onClick={() => {
                console.log("Logout");
              }}
            >
              Keluar
            </button>

          </div>

        </div>

      </aside>


      {/* =====================================================
          MAIN AREA
      ===================================================== */}
      <main className="pos-main">

        {/* =================================================
            HEADER
        ================================================= */}
        <header className="pos-header">

          <h1>
            New Order!
          </h1>

          <div className="pos-date">
            ▣ &nbsp; Senin, 15 Apr 2026
          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}
        <div className="pos-content">


          {/* =================================================
              PRODUCT AREA
          ================================================= */}
          <section className="product-area">


            {/* =================================================
                TOOLBAR
            ================================================= */}
            <div className="product-toolbar">


              {/* =================================================
                  CATEGORY
              ================================================= */}
              <div className="category-area">

                <span className="category-title">
                  Category
                </span>

                <div className="category-list">

                  {categories.map((category) => (

                    <button
                      key={category}
                      onClick={() =>
                        setActiveCategory(category)
                      }
                      className={
                        activeCategory === category
                          ? "category-button active"
                          : "category-button"
                      }
                    >
                      {category}
                    </button>

                  ))}

                </div>

              </div>


              {/* =================================================
                  SEARCH
              ================================================= */}
              <div className="search-wrapper">

                <span>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search Menu Item Here"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </div>


            {/* =================================================
                LOADING
            ================================================= */}
            {loading && (
              <div className="product-message">
                Loading products...
              </div>
            )}


            {/* =================================================
                ERROR
            ================================================= */}
            {!loading && error && (
              <div className="product-message error">
                {error}
              </div>
            )}


            {/* =================================================
                PRODUCT NOT FOUND
            ================================================= */}
            {!loading &&
              !error &&
              filteredProducts.length === 0 && (
                <div className="product-message">
                  Product not found
                </div>
              )}


            {/* =================================================
                PRODUCT GRID
            ================================================= */}
            {!loading && !error && (
              <div className="product-grid">

                {filteredProducts.map((product) => (

                  <div
                    className="product-card"
                    key={product.id}
                  >

                    {/* STOCK */}
                    <span className="product-stock">
                      {product.stock}
                    </span>


                    {/* PRODUCT IMAGE */}
                    <div className="product-image">
                      <span>
                        ×
                      </span>
                    </div>


                    {/* PRODUCT INFORMATION */}
                    <div className="product-info">

                      <div>

                        <p className="product-name">
                          {product.name}
                        </p>

                        <p className="product-category">
                          {product.categoryName}
                        </p>

                        <p className="product-price">
                          {formatRupiah(product.price)}
                        </p>

                      </div>


                      {/* ADD TO CART */}
                      <button
                        className="add-product"
                        onClick={() =>
                          addToCart(product)
                        }
                        disabled={product.stock <= 0}
                      >
                        +
                      </button>

                    </div>

                  </div>

                ))}

              </div>
            )}

          </section>


          {/* =================================================
              ORDER PANEL
          ================================================= */}
          <aside className="order-panel">

            {cart.length === 0 ? (

              <div className="empty-order">

                <span>
                  Tap to Start Order
                </span>

              </div>

            ) : (

              <div className="order-content">

                <h2>
                  Current Order
                </h2>


                <div className="order-list">

                  {cart.map((item) => (

                    <div
                      className="order-item"
                      key={item.id}
                    >

                      <div>

                        <strong>
                          {item.name}
                        </strong>

                        <small>
                          {item.quantity} ×{" "}
                          {formatRupiah(item.price)}
                        </small>

                      </div>

                      <span>
                        {formatRupiah(
                          item.price * item.quantity
                        )}
                      </span>

                    </div>

                  ))}

                </div>


                {/* TOTAL */}
                <div className="order-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    {formatRupiah(total)}
                  </strong>

                </div>


                {/* BAYAR */}
                <button className="payment-button">
                  Bayar
                </button>

              </div>

            )}

          </aside>

        </div>

      </main>

    </div>
  );
}

export default POS;