import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import KategoriCard from '../../components/dashboard/KategoriCard';
import './KategoriPage.css';

const KategoriPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // Data kategori di state (biar bisa dihapus)
  const [kategoriList, setKategoriList] = useState(
    Array(12).fill(null).map((_, i) => ({
      id: i + 1,
      title: 'Makanan Berat',
      productCount: 3,
      image: '',
    }))
  );

  // State modal konfirmasi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = kategoriList.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  // Klik tombol hapus → buka modal
  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  // Konfirmasi → hapus
  const handleConfirmDelete = () => {
    if (selectedId === null) return;

    console.log('DELETE:', selectedId);
    setKategoriList((prev) => prev.filter((k) => k.id !== selectedId));

    setIsModalOpen(false);
    setSelectedId(null);
  };

  // Batal → tutup modal
  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  return (
    <div className="app-container">
      <Sidebar role={'Admin'} />

      <main className="main-content">
        <header className="page-header">
          <h1>Kategori</h1>
        </header>

        <div className="toolbar">
          <div className="search-bar">
            <Search className="search-icon" size={18} strokeWidth={2} />
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <Link to="/preview/admin/kategori/tambah" className="btn-tambah">
            + Tambah Kategori
          </Link>
        </div>

        <div className="kategori-grid">
          {filtered.map((item) => (
            <KategoriCard
              key={item.id}
              id={item.id}
              title={item.title}
              productCount={item.productCount}
              image={item.image}
              onEdit={() =>
                navigate(`/preview/admin/kategori/${item.id}/edit`)
              }
              onDelete={() => handleDeleteClick(item.id)}
            />
          ))}
        </div>
      </main>

      {/* Modal Konfirmasi Hapus */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Hapus Kategori?</h2>
            <p className="modal-message">
              Kategori yang dihapus tidak bisa dikembalikan. Yakin ingin melanjutkan?
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn modal-btn-cancel"
                onClick={handleCancelDelete}
              >
                Batal
              </button>
              <button
                type="button"
                className="modal-btn modal-btn-confirm"
                onClick={handleConfirmDelete}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KategoriPage;