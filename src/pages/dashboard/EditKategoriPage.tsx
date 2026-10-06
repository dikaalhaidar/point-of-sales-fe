import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import './EditKategoriPage.css';

type FormMode = 'tambah' | 'edit';

const EditKategoriPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Deteksi mode dari URL
  const isTambah = location.pathname.endsWith('/tambah');
  const mode: FormMode = isTambah ? 'tambah' : 'edit';

  const pageTitle = mode === 'tambah' ? 'Tambah Kategori' : 'Edit Kategori';
  const buttonLabel = mode === 'tambah' ? 'Simpan' : 'Update';

  // State form
  const [namaKategori, setNamaKategori] = useState('');
  const [jenisKategori, setJenisKategori] = useState('Makanan');
  const [gambar, setGambar] = useState<File | null>(null);
  const [gambarName, setGambarName] = useState('Pilih untuk diunggah');

  // Kalau mode edit → prefill data (dummy dulu)
  useEffect(() => {
    if (mode === 'edit' && id) {
      // Nanti ganti dengan fetch API: fetch(`/api/kategori/${id}`)
      setNamaKategori('Cendol');
      setJenisKategori('Makanan');
    } else {
      // Reset form untuk mode tambah
      setNamaKategori('');
      setJenisKategori('Makanan');
      setGambar(null);
      setGambarName('Pilih untuk diunggah');
    }
  }, [mode, id]);

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

    if (mode === 'tambah') {
      // TODO: POST /api/kategori
      console.log('CREATE:', { namaKategori, jenisKategori, gambar });
    } else {
      // TODO: PUT /api/kategori/:id
      console.log('UPDATE:', { id, namaKategori, jenisKategori, gambar });
    }

    navigate('/preview/admin/kategori');
  };

  const handleHapus = () => {
    if (!id) return;

    const yakin = confirm('Yakin ingin menghapus kategori ini?');
    if (!yakin) return;

    // TODO: DELETE /api/kategori/:id
    console.log('DELETE:', id);

    navigate('/preview/admin/kategori');
  };

  return (
    <div className="app-container">
      <Sidebar role={'Admin'} />

      <main className="main-content">
        <header className="page-header">
          <h1>{pageTitle}</h1>
        </header>

        <div className="form-card">
          <h2 className="form-card-title">Informasi Kategori</h2>

          <form onSubmit={handleSubmit} className="kategori-form">
            {/* Nama Kategori */}
            <div className="form-row">
              <label htmlFor="nama">
                Nama Kategori <span className="required">*</span>
              </label>
              <input
                id="nama"
                type="text"
                placeholder="Cendol"
                value={namaKategori}
                onChange={(e) => setNamaKategori(e.target.value)}
              />
            </div>

            {/* Jenis Kategori (cuma muncul di mode edit) */}
            {mode === 'edit' && (
              <div className="form-row">
                <label htmlFor="jenis">
                  Jenis Kategori <span className="required">*</span>
                </label>
                <div className="select-wrap">
                  <select
                    id="jenis"
                    value={jenisKategori}
                    onChange={(e) => setJenisKategori(e.target.value)}
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Snack">Snack</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                  <span className="select-chevron">⌄</span>
                </div>
              </div>
            )}

            {/* Gambar */}
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

            {/* Tombol Aksi */}
            <div className="form-actions">
              {/* Tombol Hapus — cuma muncul di mode edit */}
              {mode === 'edit' && (
                <button
                  type="button"
                  className="btn-hapus"
                  onClick={handleHapus}
                >
                  Hapus
                </button>
              )}

              <button
                type="button"
                className="btn-batal"
                onClick={() => navigate('/preview/admin/kategori')}
              >
                Batal
              </button>

              <button type="submit" className="btn-simpan">
                {buttonLabel}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditKategoriPage;