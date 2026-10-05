import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import POS from "./pages/POS/POS";

function App() {
  if (window.location.pathname === "/preview/admin") {
    return <DashboardPage role="Admin" />;
  }

  if (window.location.pathname === "/preview/cashier") {
    return <DashboardPage role="Cashier" />;
  }

  if (window.location.pathname === "/preview/pos") {
    return <POS />;
  }

  return <LoginPage />;
}

export default App;