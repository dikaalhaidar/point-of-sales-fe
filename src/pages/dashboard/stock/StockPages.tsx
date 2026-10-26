import Sidebar from "../../../components/dashboard/Sidebar";

export default function StockPages() {
  return (
    <div className="app-container">
      <Sidebar role="Admin" />

      <main className="main-content">
        <header className="page-header">
          <h1>Stok</h1>
        </header>
      </main>
    </div>
  );
}
