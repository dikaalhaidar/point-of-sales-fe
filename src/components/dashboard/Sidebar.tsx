import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">×</div>

        <div>
          <h2>Point of Sale!</h2>
        </div>
      </div>

      <nav className="sidebar-menu">
        <button className="sidebar-menu-item active">
          <span>⌂</span>
          Dashboard
        </button>

        <button className="sidebar-menu-item">
          <span>▤</span>
          Kategori
        </button>

        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <span>♧</span>
            Produk
          </div>

          <button className="sidebar-submenu-item">
            Daftar Produk
          </button>

          <button className="sidebar-submenu-item">
            Stok
          </button>

          <button className="sidebar-submenu-item">
            Histori Stok
          </button>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <span>▣</span>
            Laporan Transaksi
          </div>

          <button className="sidebar-submenu-item">
            Ringkasan Pembayaran
          </button>

          <button className="sidebar-submenu-item">
            Penjualan Harian
          </button>
    
          <button className="sidebar-submenu-item">
            Produk Terlaris
          </button>
        </div>
      </nav>
    </aside>
  );
}