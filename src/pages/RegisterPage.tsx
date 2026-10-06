import { useState, type FormEvent } from 'react'
import piclogin from '../assets/pictlogin.png'

function RegisterPage() {
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    if (formData.get('password') !== formData.get('confirmPassword')) {
      setMessage('Konfirmasi password belum cocok.')
      return
    }

    setMessage('Pendaftaran belum terhubung ke server.')
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
          <p className="form-eyebrow">BUAT AKUN</p>
          <h2>Daftar akun</h2>
          <p className="form-intro">Lengkapi data berikut untuk membuat akun Point of Sale.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="fullName">Nama lengkap</label>
            <input id="fullName" name="fullName" type="text" placeholder="Masukkan nama lengkap" autoComplete="name" required />

            <div className="password-label"><label htmlFor="email">Email</label></div>
            <input id="email" name="email" type="email" placeholder="nama@email.com" autoComplete="email" required />

            <div className="password-label"><label htmlFor="username">Username</label></div>
            <input id="username" name="username" type="text" placeholder="Buat username" autoComplete="username" required />

            <div className="password-label"><label htmlFor="password">Password</label></div>
            <input id="password" name="password" type="password" placeholder="Buat password" autoComplete="new-password" required />

            <div className="password-label"><label htmlFor="confirmPassword">Konfirmasi password</label></div>
            <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Ulangi password" autoComplete="new-password" required />

            <button className="login-button" type="submit">Daftar</button>
            {message && <p className="form-message" role="status">{message}</p>}
          </form>

          <p className="form-footer">Sudah punya akun? <a href="/">Masuk</a></p>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage