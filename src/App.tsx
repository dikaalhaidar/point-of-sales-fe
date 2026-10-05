import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import KategoriPage from './pages/dashboard/KategoriPage';
import Sidebar from './components/dashboard/Sidebar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/kategori" element={<KategoriPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;