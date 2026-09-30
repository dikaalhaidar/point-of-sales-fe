import Sidebar from "../../components/dashboard/Sidebar.tsx";
import "./DashboardPage.css";

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <Sidebar />

      <main className="dashboard-main">
        <h1>Dashboard</h1>
      </main>
    </div>
  );
}