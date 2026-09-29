import { useState, type FormEvent } from 'react'
import './LoginPage.css'

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('Tampilan demo: sambungkan form ini ke autentikasi untuk mulai masuk.')
  }

  return (
    <main className="login-page">
      <section className="visual-panel" aria-label="Ringkasan Point of Sale">
        <header className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">K</span>
          <span>kasa<span className="brand-light">rasa</span></span>
          <span className="brand-tag">POINT OF SALE</span>
        </header>

        <div className="visual-copy">
          <p className="eyebrow">OPERASIONAL TOKO, LEBIH RINGKAS</p>
          <h1>Semua transaksi,<br />dalam kendali.</h1>
          <p className="visual-description">Pantau penjualan dan kelola toko dari satu tempat.</p>
        </div>

        <div className="dashboard-preview" aria-hidden="true">
          <div className="preview-sidebar">
            <span className="sidebar-brand">K</span>
            <span className="sidebar-icon active"><i /></span>
            <span className="sidebar-icon"><i /></span>
            <span className="sidebar-icon"><i /></span>
            <span className="sidebar-icon"><i /></span>
          </div>
          <div className="preview-content">
            <div className="preview-topline">
              <div><span className="preview-kicker">RINGKASAN HARI INI</span><strong>Selamat pagi, Admin</strong></div>
              <span className="preview-date">29 Sep 2026</span>
            </div>
            <div className="stat-row">
              <div className="stat-card"><span>Total penjualan</span><strong>Rp 4.280.000</strong><small>↗ 12,8% minggu ini</small></div>
              <div className="stat-card"><span>Transaksi</span><strong>128</strong><small>Hari ini</small></div>
            </div>
            <div className="chart-card">
              <div className="chart-heading"><strong>Performa penjualan</strong><span>7 hari terakhir</span></div>
              <div className="chart-grid"><div className="chart-bars"><i /><i /><i /><i /><i /><i /><i /></div></div>
              <div className="chart-labels"><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span></div>
            </div>
            <div className="preview-bottom"><span><i /> Toko buka</span><span>Data diperbarui barusan</span></div>
          </div>
        </div>
      </section>

      <section className="form-panel">
        <div className="form-content">
          <div className="mobile-brand"><span className="brand-mark">K</span><span>kasarasa</span></div>
          <p className="form-eyebrow">PORTAL ADMIN</p>
          <h2>Selamat datang</h2>
          <p className="form-intro">Masuk untuk mengelola toko dan melihat laporan penjualan.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input id="username" name="username" type="text" placeholder="Masukkan username" autoComplete="username" required />

            <div className="password-label"><label htmlFor="password">Password</label><a href="#bantuan">Lupa password?</a></div>
            <div className="password-field">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Masukkan password" autoComplete="current-password" required />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>{showPassword ? 'Sembunyikan' : 'Lihat'}</button>
            </div>

            <label className="remember-option"><input type="checkbox" name="remember" /><span>Ingat saya</span></label>
            <button className="login-button" type="submit">Masuk <span aria-hidden="true">→</span></button>
            {message && <p className="form-message" role="status">{message}</p>}
          </form>

          <p className="form-footer">Butuh bantuan? <a href="#bantuan">Hubungi administrator</a></p>
        </div>
        <footer className="copyright">© 2026 Kasarasa POS</footer>
      </section>
    </main>
  )
}

export default LoginPage
