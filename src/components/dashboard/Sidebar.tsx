import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  role: 'Admin' | 'Cashier';
}

interface SubmenuItem {
  label: string;
  path: string;
}

interface SectionItem {
  title: string;
  items: SubmenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const isActive = (path: string) => location.pathname === path;

  // Data submenu
  const sections: SectionItem[] = [
    {
      title: 'Produk',
      items: [
        { label: 'Daftar produk', path: '/preview/admin/produk' },
        { label: 'Stok', path: '/preview/admin/stok' },
        { label: 'Riwayat stok', path: '/preview/admin/riwayat-stok' },
      ],
    },
    
    {
      title: 'Laporan transaksi',
      items: [
        { label: 'Ringkasan pembayaran', path: '/preview/admin/ringkasan-pembayaran' },
        { label: 'Penjualan harian', path: '/preview/admin/penjualan-harian' },
        { label: 'Produk terlaris', path: '/preview/admin/produk-terlaris' },
      ],
    },
  ];

  return (
    <aside className="dashboard-sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">P</div>
        <h2>Point of Sale</h2>
      </div>


      <nav className="sidebar-menu">
        <Link
          to="/preview/admin"
          className={`sidebar-menu-item ${isActive('/preview/admin') ? 'active' : ''}`}
        >
          Dashboard
        </Link>

        <Link
          to="/preview/admin/kategori"
          className={`sidebar-menu-item ${isActive('/preview/admin/kategori') ? 'active' : ''}`}
        >
          Kategori
        </Link>

        {/* Section dengan submenu */}
        {sections.map((section) => {
          const hasActivePage = section.items.some(({ path }) =>
            location.pathname === path || location.pathname.startsWith(`${path}/`),
          );
          const isOpen = hasActivePage || openSections[section.title] === true;

          return (
            <div className="sidebar-section" key={section.title}>
              <button
                type="button"
                className={`sidebar-section-title ${isOpen ? 'open' : ''}`}
                onClick={() => setOpenSections((previous) => ({
                  ...previous,
                  [section.title]: !isOpen,
                }))}
              >
                <span>{section.title}</span>
                <span className="chevron" />
              </button>

              {isOpen && (
                <div className="sidebar-submenu">
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`sidebar-submenu-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-preview-footer">
        <div className="sidebar-role-mark">
          {role === 'Admin' ? 'AD' : 'CS'}
        </div>

          <div className="sidebar-user-info">
          <strong>{role}</strong>
          <span>Mode pratinjau</span>
        </div>
        <a href="/">Keluar</a>
      </div>
    </aside>
  );
};

export default Sidebar;