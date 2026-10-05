
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";

function App() {
  if (window.location.pathname === "/preview/admin") {
    return <DashboardPage role="Admin" />;
  }

  if (window.location.pathname === "/preview/cashier") {
    return <DashboardPage role="Cashier" />;
  }

  return <LoginPage />;

}

export default App;