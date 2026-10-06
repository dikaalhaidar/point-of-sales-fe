import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import '../../style/KategoriDetailPage.css';

interface ProdukRow {
  id: number;
  gambar: string;
  nama: string;
  stok: number;
  status: 'Aktif' | 'Nonaktif';
}

const KategoriDetailPage: React.FC = () => {
//   const { id } = useParams();

  // Dummy data
  const namaKategori = 'Makanan Berat';
  const produkList: ProdukRow[] = Array(6).fill(null).map((_, i) => ({
    id: i + 1,
    gambar: '', // kosongin dulu, nanti diisi path gambar
    nama: 'Cendol',
    stok: 16,
    status: 'Aktif',
  }));
  

  return (
    <div className="app-container">
      <Sidebar role={'Admin'} />

      <main className="main-content">
        {/* Header */}
        <div className="detail-header">
          <h1>{namaKategori}</h1>
          <p>Daftar produk dalam kategori ini</p>
        </div>

        {/* Table */}
        <div className="produk-table-wrap">
          <table className="produk-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Gambar</th>
                <th>Nama Produk</th>
                <th>Jumlah Stok</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {produkList.map((item, index) => (
                <tr key={item.id}>
                  <td className="td-center">{index + 1}</td>
                  <td>
                    <div className="produk-thumb">
                      {item.gambar ? (
                        <img src={item.gambar} alt={item.nama} />
                      ) : null}
                    </div>
                  </td>
                  <td>{item.nama}</td>
                  <td className="td-center">{item.stok}</td>
                  <td className="td-center">
                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="td-center">
                    <div className="aksi-wrap">
                      <button className="btn-icon" title="Lihat">
                        <Eye size={16} strokeWidth={2} />
                      </button>
                      <button className="btn-icon danger" title="Hapus">
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button className="page-btn" disabled>‹</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">›</button>
        </div>
      </main>
    </div>
  );
};

export default KategoriDetailPage;