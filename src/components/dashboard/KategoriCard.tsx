import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, ImageIcon } from 'lucide-react';
import './KategoriCard.css';

interface Props {
  id: number;
  title: string;
  productCount: number;
  image?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const KategoriCard: React.FC<Props> = ({
  id,
  title,
  productCount,
  image,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/preview/admin/kategori/${id}`);
  };

  return (
    <div className="kategori-card">
      <div className="kategori-card-image">
        {image ? (
          <img src={image} alt={title} />
        ) : (
          <ImageIcon size={28} strokeWidth={1.8} className="placeholder-icon" />
        )}
      </div>

      <h3 className="kategori-card-title">{title}</h3>
      <p className="kategori-card-count">{productCount} Produk</p>

      <div className="kategori-card-actions">
        <button className="btn-action btn-view" onClick={handleView} title="Lihat">
          <Eye size={15} strokeWidth={2} />
        </button>
        <button className="btn-action btn-edit" onClick={onEdit} title="Edit">
          <Pencil size={15} strokeWidth={2} />
        </button>
        <button className="btn-action btn-delete" onClick={onDelete} title="Hapus">
          <Trash2 size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default KategoriCard;