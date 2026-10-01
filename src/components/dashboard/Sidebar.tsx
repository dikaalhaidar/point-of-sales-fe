import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo" aria-hidden="true">P</div>
        <h2>Point of Sale</h2>
      </div>

      <nav className="sidebar-menu" aria-label="Navigasi utama">
        <button className="sidebar-menu-item active" type="button" aria-current="page">
          Dashboard
        </button>

        <button className="sidebar-menu-item" type="button">
          Kategori
        </button>

        <section className="sidebar-section" aria-labelledby="sidebar-products">
          <h3 className="sidebar-section-title" id="sidebar-products">Produk</h3>
          <div className="sidebar-submenu">
            <button className="sidebar-submenu-item" type="button">Daftar produk</button>
            <button className="sidebar-submenu-item" type="button">Stok</button>
            <button className="sidebar-submenu-item" type="button">Riwayat stok</button>
          </div>
        </section>

        <section className="sidebar-section" aria-labelledby="sidebar-reports">
          <h3 className="sidebar-section-title" id="sidebar-reports">Laporan transaksi</h3>
          <div className="sidebar-submenu">
            <button className="sidebar-submenu-item" type="button">Ringkasan pembayaran</button>
            <button className="sidebar-submenu-item" type="button">Penjualan harian</button>
            <button className="sidebar-submenu-item" type="button">Produk terlaris</button>
          </div>
        </section>
      </nav>
    </aside>
  );
}