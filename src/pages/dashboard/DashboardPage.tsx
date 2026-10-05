import Sidebar from "../../components/dashboard/Sidebar.tsx";

type DashboardRole = "Admin" | "Cashier";

type DashboardData = {
  description: string;
  metrics: { label: string; value: string; note: string }[];
  transactions: { id: string; time: string; customer: string; payment: string; total: string; status: string }[];
  sidePanelTitle: string;
  sidePanelItems: { label: string; value: string }[];
};

const demoData: Record<DashboardRole, DashboardData> = {
  Admin: {
    description: "Pantau penjualan dan aktivitas toko hari ini.",
    metrics: [
      { label: "Penjualan hari ini", value: "Rp 12.480.000", note: "+12,8% dari kemarin" },
      { label: "Transaksi", value: "86", note: "12 transaksi per jam" },
      { label: "Produk aktif", value: "124", note: "8 produk stok menipis" },
    ],
    transactions: [
      { id: "TRX-240518", time: "10:42", customer: "Nadia Putri", payment: "QRIS", total: "Rp 485.000", status: "Selesai" },
      { id: "TRX-240517", time: "10:35", customer: "Budi Santoso", payment: "Tunai", total: "Rp 126.000", status: "Selesai" },
      { id: "TRX-240516", time: "10:21", customer: "Rina Amelia", payment: "Kartu debit", total: "Rp 312.500", status: "Selesai" },
      { id: "TRX-240515", time: "10:08", customer: "Dimas Pratama", payment: "QRIS", total: "Rp 78.000", status: "Selesai" },
    ],
    sidePanelTitle: "Produk terlaris",
    sidePanelItems: [
      { label: "Kopi susu gula aren", value: "48 terjual" },
      { label: "Roti sourdough", value: "36 terjual" },
      { label: "Es cokelat", value: "29 terjual" },
      { label: "Croissant butter", value: "24 terjual" },
    ],
  },
  Cashier: {
    description: "Ringkasan aktivitas kasir pada shift pagi.",
    metrics: [
      { label: "Penjualan saya", value: "Rp 2.840.000", note: "Shift pagi" },
      { label: "Transaksi saya", value: "18", note: "3 transaksi terakhir" },
      { label: "Rata-rata transaksi", value: "Rp 157.778", note: "Dari 18 transaksi" },
    ],
    transactions: [
      { id: "TRX-240518", time: "10:42", customer: "Nadia Putri", payment: "QRIS", total: "Rp 485.000", status: "Selesai" },
      { id: "TRX-240512", time: "10:16", customer: "Pelanggan umum", payment: "Tunai", total: "Rp 92.000", status: "Selesai" },
      { id: "TRX-240509", time: "09:54", customer: "Pelanggan umum", payment: "QRIS", total: "Rp 164.000", status: "Selesai" },
      { id: "TRX-240503", time: "09:31", customer: "Agus Setiawan", payment: "Tunai", total: "Rp 56.000", status: "Selesai" },
    ],
    sidePanelTitle: "Ringkasan pembayaran",
    sidePanelItems: [
      { label: "QRIS", value: "10 transaksi" },
      { label: "Tunai", value: "6 transaksi" },
      { label: "Kartu debit", value: "2 transaksi" },
    ],
  },
};

type DashboardPageProps = {
  role: DashboardRole;
};

export default function DashboardPage({ role }: DashboardPageProps) {
  const data = demoData[role];

  return (
    <div className="dashboard-page">
      <Sidebar role={role} />

      <main className="dashboard-main">
        <header className="dashboard-heading">
          <div>
            <span className="dashboard-eyebrow">Ringkasan toko</span>
            <h1>Dashboard</h1>
            <p>{data.description}</p>
          </div>
          <span className="dashboard-role-badge">{role === "Cashier" ? "Kasir" : role}</span>
        </header>

        <section className="dashboard-metrics" aria-label="Metrik utama">
          {data.metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <h2>{metric.label}</h2>
              <p className="metric-value">{metric.value}</p>
              <p className="metric-note">{metric.note}</p>
            </article>
          ))}
        </section>

        <div className="dashboard-content-grid">
          <section className="dashboard-section" aria-labelledby="recent-transactions-title">
            <div className="section-heading">
              <div>
                <h2 id="recent-transactions-title">Transaksi terbaru</h2>
                <p>{role === "Admin" ? "Aktivitas dari semua kasir" : "Aktivitas pada shift ini"}</p>
              </div>
              <span className="section-count">{data.transactions.length} transaksi</span>
            </div>
            <div className="transaction-table-wrap">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th scope="col">Transaksi</th>
                    <th scope="col">Pelanggan</th>
                    <th scope="col">Pembayaran</th>
                    <th scope="col">Total</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td><span>{transaction.id}</span><small>{transaction.time}</small></td>
                      <td>{transaction.customer}</td>
                      <td>{transaction.payment}</td>
                      <td className="transaction-total">{transaction.total}</td>
                      <td><span className="transaction-status">{transaction.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="dashboard-section side-summary" aria-labelledby="side-summary-title">
            <div className="section-heading">
              <div>
                <h2 id="side-summary-title">{data.sidePanelTitle}</h2>
                <p>Hari ini</p>
              </div>
            </div>
            <ul className="summary-list">
              {data.sidePanelItems.map((item, index) => (
                <li key={item.label}>
                  <span className="summary-rank">{String(index + 1).padStart(2, "0")}</span>
                  <span className="summary-label">{item.label}</span>
                  <strong>{item.value}</strong>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}