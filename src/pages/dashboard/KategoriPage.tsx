// src/pages/dashboard/KategoriPage.tsx
import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar'; // Sesuaikan path
import KategoriCard from '../../components/dashboard/KategoriCard';
import './KategoriPage.css';

const KategoriPage: React.FC = () => {
  // Data dummy untuk simulasi tampilan
  const dummyData = Array(12).fill({
    title: 'Makanan Berat',
    productCount: 3,
  });

  return (
    <div className="app-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="page-header">
          <h1>Kategori</h1>
        </header>

        <div className="toolbar">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search" />
          </div>
          <button className="btn-tambah">
            + Tambah Kategori
          </button>
        </div>

        <div className="kategori-grid">
          {dummyData.map((item, index) => (
            <KategoriCard 
              key={index} 
              title={item.title} 
              productCount={item.productCount} 
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default KategoriPage;