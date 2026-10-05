// src/components/dashboard/KategoriCard.tsx
import React from 'react';
import './KategoriCard.css';

interface KategoriCardProps {
  title: string;
  productCount: number;
}

const KategoriCard: React.FC<KategoriCardProps> = ({ title, productCount }) => {
  return (
    <div className="kategori-card">
      <div className="card-image-placeholder">
        <span>X</span>
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-subtitle">{productCount} Produk</p>
      
      <div className="card-actions">
        <button className="action-btn" title="Lihat">👁️</button>
        <button className="action-btn" title="Edit">✏️</button>
        <button className="action-btn" title="Hapus">🗑️</button>
      </div>
    </div>
  );
};

export default KategoriCard;