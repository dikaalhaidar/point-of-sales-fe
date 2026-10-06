import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  if (window.location.pathname === "/register") {
    return <RegisterPage />;
  }

  if (window.location.pathname === "/preview/admin") {
    return <DashboardPage role="Admin" />;
  }

  if (window.location.pathname === "/preview/cashier") {
    return <DashboardPage role="Cashier" />;
  }

  return <LoginPage />;
}

export default App;