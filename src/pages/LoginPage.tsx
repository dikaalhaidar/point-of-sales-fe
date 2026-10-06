import { useState, type FormEvent } from 'react'
import piclogin from '../assets/pictlogin.png'
function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('Password atau username salah. Silakan coba lagi.')
  }

  return (
    <main className="login-page">
      <section className="visual-panel" aria-label="Point of sale di toko">
        <img className="pos-photo" src={piclogin} alt="Kasir menggunakan sistem point of sale di toko" />
        <header className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Point<span className="brand-light"> Of Sales</span></span>
          <span className="brand-tag">POINT OF SALE</span>
        </header>

      </section>

      <section className="form-panel">
        <div className="form-content">
          <p className="form-eyebrow">Login Page</p>
          <h2>Selamat datang</h2>
          <p className="form-intro">Welcome to the login page.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input id="username" name="username" type="text" placeholder="Masukkan username" autoComplete="username" required />

            <div className="password-label"><label htmlFor="password">Password</label><a href="#bantuan">Lupa password?</a></div>
            <div className="password-field">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Masukkan password" autoComplete="current-password" required />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} aria-pressed={showPassword}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {showPassword ? <><path d="m3 3 18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5 0 8.5 5 8.5 7a8.8 8.8 0 0 1-2 3.1" /><path d="M6.2 6.2C3.9 7.7 2.5 10.1 2.5 12c0 2 3.5 7 9.5 7a10 10 0 0 0 4-.8" /></> : <><path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="2.5" /></>}
                </svg>
              </button>
            </div>

            <button className="login-button " type="submit">Masuk</button>
            {message && <p className="form-message" role="status">{message}</p>}
          </form>

          <p className="form-footer">Belum punya akun? <a href="/register">Daftar</a></p>

          <div className="demo-access">
            <span>Pratinjau dashboard</span>
            <a href="/preview/admin">Admin</a>
            <a href="/preview/cashier">Kasir</a>
          </div>

        </div>
      </section>
    </main>
  )
}

export default LoginPage
