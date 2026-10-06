import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import KategoriCard from '../../components/dashboard/KategoriCard';
import './KategoriPage.css';

const KategoriPage: React.FC = () => {
  const dummyData = Array(12).fill({
    title: 'Makanan Berat',
    productCount: 3,
    image: '',
  });

  return (
    <div className="app-container">
      <Sidebar role={'Admin'} />

      <main className="main-content">
        <header className="page-header">
          <h1>Kategori</h1>
        </header>

        {/* Toolbar: search + tombol tambah */}
        <div className="toolbar">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search" />
          </div>
          <Link to="/preview/admin/kategori/tambah" className="btn-tambah">
            + Tambah Kategori
          </Link>
        </div>

        {/* Grid kategori (DI LUAR toolbar) */}
        <div className="kategori-grid">
          {dummyData.map((item, index) => (
            <KategoriCard
              key={index}
              id={index + 1}
              title={item.title}
              productCount={item.productCount}
              image={item.image}
              onEdit={() => console.log('edit', index)}
              onDelete={() => console.log('delete', index)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default KategoriPage;