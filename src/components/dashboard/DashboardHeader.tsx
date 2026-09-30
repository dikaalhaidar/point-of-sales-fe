import "./DashboardHeader.css";

export default function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-top">
        <h1>Dashboard</h1>

        <button className="notification-button" aria-label="Notifikasi">
          ♧
        </button>
      </div>

      <div className="dashboard-header-greeting">
        <h2>Hallo, Admin</h2>
        <p>Berikut ringkasan aktivitas toko hari ini</p>
      </div>
    </header>
  );
}