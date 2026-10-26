import { useState, type FormEvent } from 'react'
import piclogin from '../assets/pictlogin.png'
import { register } from '../api' // sesuaikan path

function RegisterPage() {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    const form = event.currentTarget
    const formData = new FormData(form)

    const password = String(formData.get('password') ?? '')
    const confirmPassword = String(formData.get('confirmPassword') ?? '')

    if (password !== confirmPassword) {
      setMessage('Konfirmasi password belum cocok.')
      return
    }

    setIsSubmitting(true)
    try {
      await register({
        username: String(formData.get('username') ?? '').trim(),
        password,
        fullName: String(formData.get('fullName') ?? '').trim(),
        address: String(formData.get('address') ?? '').trim(),
        phoneNumber: String(formData.get('phoneNumber') ?? '').trim(),
      })

      setIsSuccess(true)
      setMessage('Pendaftaran berhasil! Silakan masuk dengan akun Anda.')
      form.reset()

      // opsional: redirect ke login setelah 1.5 detik
      // setTimeout(() => { window.location.href = '/' }, 1500)
    } catch (err) {
      setMessage((err as Error).message)
    } finally {
      setIsSubmitting(false)
    }
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

            <div className="password-label"><label htmlFor="username">Username</label></div>
            <input id="username" name="username" type="text" placeholder="Buat username" autoComplete="username" required />

            <div className="password-label"><label htmlFor="address">Alamat</label></div>
            <input id="address" name="address" type="text" placeholder="Masukkan alamat" autoComplete="street-address" required />

            <div className="password-label"><label htmlFor="phoneNumber">Nomor telepon</label></div>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+628123456789"
              autoComplete="tel"
              pattern="^\+[1-9]\d{7,14}$"
              title="Gunakan format internasional, contoh +628123456789"
              required
            />

            <div className="password-label"><label htmlFor="password">Password</label></div>
            <input id="password" name="password" type="password" placeholder="Buat password" autoComplete="new-password" required />

            <div className="password-label"><label htmlFor="confirmPassword">Konfirmasi password</label></div>
            <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Ulangi password" autoComplete="new-password" required />

            <button className="login-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : 'Daftar'}
            </button>

            {message && (
              <p className="form-message" role="status" style={{ color: isSuccess ? 'green' : undefined }}>
                {message}
              </p>
            )}
          </form>

          <p className="form-footer">Sudah punya akun? <a href="/">Masuk</a></p>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage