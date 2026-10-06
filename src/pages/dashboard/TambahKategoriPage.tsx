import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import '../../style/TambahKategoriPage.css';

const TambahKategoriPage: React.FC = () => {
  const navigate = useNavigate();

  const [namaKategori, setNamaKategori] = useState('');
  const [gambar, setGambar] = useState<File | null>(null);
  const [gambarName, setGambarName] = useState('Pilih untuk diunggah');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGambar(file);
      setGambarName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaKategori.trim()) {
      alert('Nama kategori wajib diisi');
      return;
    }

    // TODO: kirim ke API
    console.log('Submit:', { namaKategori, gambar });

    // Balik ke halaman kategori setelah simpan
    navigate('/preview/admin/kategori');
  };

  return (
    <div className="app-container">
      <Sidebar role={'Admin'} />

      <main className="main-content">
        <header className="page-header">
          <h1>Tambah Kategori</h1>
        </header>

        <div className="form-card">
          <h2 className="form-card-title">Informasi Produk</h2>

          <form onSubmit={handleSubmit} className="kategori-form">
            {/* Nama Kategori */}
            <div className="form-row">
              <label htmlFor="nama">
                Nama Kategori <span className="required">*</span>
              </label>
              <input
                id="nama"
                type="text"
                placeholder="Masukkan nama produk"
                value={namaKategori}
                onChange={(e) => setNamaKategori(e.target.value)}
              />
            </div>

            {/* Gambar Kategori */}
            <div className="form-row">
              <label htmlFor="gambar">
                Gambar Kategori <span className="required">*</span>
              </label>
              <div className="file-input-wrap">
                <label htmlFor="gambar" className="file-btn">
                  Choose File
                </label>
                <span className="file-name">{gambarName}</span>
                <input
                  id="gambar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Tombol */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-batal"
                onClick={() => navigate('/preview/admin/kategori')}
              >
                Batal
              </button>
              <button type="submit" className="btn-simpan">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TambahKategoriPage;