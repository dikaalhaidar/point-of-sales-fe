import { useState } from "react";
import "../POS/POS.css";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

type CartItem = Product & {
  quantity: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Cendol",
    price: 15000,
    category: "Minuman",
  },
  {
    id: 2,
    name: "Es Teh",
    price: 7000,
    category: "Minuman",
  },
  {
    id: 3,
    name: "Cola",
    price: 12000,
    category: "Minuman",
  },
  {
    id: 4,
    name: "Yakult",
    price: 20000,
    category: "Minuman",
  },
  {
    id: 5,
    name: "Cendol",
    price: 15000,
    category: "Minuman",
  },
  {
    id: 6,
    name: "Es Teh",
    price: 7000,
    category: "Minuman",
  },
  {
    id: 7,
    name: "Cola",
    price: 12000,
    category: "Minuman",
  },
  {
    id: 8,
    name: "Yakult",
    price: 20000,
    category: "Minuman",
  },
  {
    id: 9,
    name: "Cendol",
    price: 15000,
    category: "Minuman",
  },
  {
    id: 10,
    name: "Es Teh",
    price: 7000,
    category: "Minuman",
  },
  {
    id: 11,
    name: "Cola",
    price: 12000,
    category: "Minuman",
  },
  {
    id: 12,
    name: "Yakult",
    price: 20000,
    category: "Minuman",
  },
  {
    id: 13,
    name: "Cendol",
    price: 15000,
    category: "Minuman",
  },
  {
    id: 14,
    name: "Es Teh",
    price: 7000,
    category: "Minuman",
  },
  {
    id: 15,
    name: "Cola",
    price: 12000,
    category: "Minuman",
  },
  {
    id: 16,
    name: "Yakult",
    price: 20000,
    category: "Minuman",
  },
];

function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  const categories = ["Semua", "Minuman", "Makanan"];
  const [activeMenu, setActiveMenu] = useState("POS");

  // =========================
  // FILTER PRODUK
  // =========================

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      activeCategory === "Semua" ||
      product.category === activeCategory;

    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  // =========================
  // FORMAT RUPIAH
  // =========================

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  // =========================
  // TAMBAH PRODUK
  // =========================

  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
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

  // =========================
  // TOTAL
  // =========================

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="pos-page">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="pos-sidebar">

        {/* LOGO */}
        <div className="pos-logo">

          <div className="logo-icon">
            <span></span>
          </div>

          <span>Point of Sale</span>

        </div>


        {/* MENU */}
       <nav className="pos-menu">

  <button
    className={
      activeMenu === "POS"
        ? "pos-menu-item active"
        : "pos-menu-item"
    }
    onClick={() => setActiveMenu("POS")}
  >
    <span className="menu-icon">▣</span>
    POS
  </button>


  <button
    className={
      activeMenu === "Laporan"
        ? "pos-menu-item active"
        : "pos-menu-item"
    }
    onClick={() => setActiveMenu("Laporan")}
  >
    <span className="menu-icon">▤</span>
    Laporan Transaksi
  </button>


  <button
    className={
      activeMenu === "Ringkasan"
        ? "pos-submenu active-submenu"
        : "pos-submenu"
    }
    onClick={() => setActiveMenu("Ringkasan")}
  >
    ↳ Ringkasan Pembayaran
  </button>

</nav>

      </aside>


      {/* =====================================
          MAIN AREA
      ===================================== */}

      <main className="pos-main">

        {/* HEADER */}

        <header className="pos-header">

          <h1>New Order!</h1>

          <div className="pos-date">
            ▣ &nbsp; Senin, 15 Apr 2026
          </div>

        </header>


        {/* CONTENT */}

        <div className="pos-content">


          {/* =====================================
              PRODUCT AREA
          ===================================== */}

          <section className="product-area">


            {/* TOOLBAR */}

            <div className="product-toolbar">


              {/* CATEGORY */}

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


              {/* SEARCH */}

              <div className="search-wrapper">

                <span>⌕</span>

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


            {/* =====================================
                PRODUCT GRID
            ===================================== */}

            <div className="product-grid">

              {filteredProducts.map((product) => (

                <div
                  className="product-card"
                  key={product.id}
                >

                  {/* FOTO PRODUK */}

                  <div className="product-image">

                    {/* SEMENTARA X */}
                    <span>×</span>

                    {/*

                    NANTI KALAU FOTO SUDAH ADA:

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    */}

                  </div>


                  {/* INFO PRODUK */}

                  <div className="product-info">

                    <div>

                      <p className="product-name">
                        {product.name}
                      </p>

                      <p className="product-price">
                        {formatRupiah(product.price)}
                      </p>

                    </div>


                    {/* TOMBOL PLUS */}

                    <button
                      className="add-product"
                      onClick={() =>
                        addToCart(product)
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </section>


          {/* =====================================
              ORDER PANEL
          ===================================== */}

          <aside className="order-panel">


            {cart.length === 0 ? (

              /* BELUM ADA PESANAN */

              <div className="empty-order">

                <span>
                  Tap to Start Order
                </span>

              </div>

            ) : (

              /* ADA PESANAN */

              <div className="order-content">

                <h2>Current Order</h2>


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
                          item.price *
                            item.quantity
                        )}
                      </span>

                    </div>

                  ))}

                </div>


                {/* TOTAL */}

                <div className="order-total">

                  <span>Total</span>

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