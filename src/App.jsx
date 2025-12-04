import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SalesPage from './pages/SalesPage';
import AddProductPage from './pages/AddProductPage';
import AddUserPage from './pages/AddUserPage'; // 1. IMPORTAR NUEVA PÁGINA

// Helper para leer token
const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch (e) { return null; }
};

const RutaPrivada = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
};

const RutaAdmin = ({ children }) => {
    const role = getUserRole();
    return role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />

                <Route path="/dashboard" element={<RutaPrivada><DashboardPage /></RutaPrivada>} />
                <Route path="/ventas" element={<RutaPrivada><SalesPage /></RutaPrivada>} />

                {/* 🔒 Rutas de Admin */}
                <Route path="/agregar-producto" element={<RutaAdmin><AddProductPage /></RutaAdmin>} />

                {/* 2. NUEVA RUTA REGISTRADA */}
                <Route path="/crear-usuario" element={<RutaAdmin><AddUserPage /></RutaAdmin>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;