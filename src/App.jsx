import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SalesPage from './pages/SalesPage';
import ReviewsPage from './pages/ReviewsPage';
import AddProductPage from './pages/AddProductPage';
import AddUserPage from './pages/AddUserPage';
import ProfilePage from './pages/ProfilePage';
import EventsPage from './pages/EventsPage'; // NUEVO
import BlogPage from './pages/BlogPage';     // NUEVO

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

                {/* Rutas Principales */}
                <Route path="/dashboard" element={<RutaPrivada><DashboardPage /></RutaPrivada>} />
                <Route path="/perfil" element={<RutaPrivada><ProfilePage /></RutaPrivada>} />

                {/* Nuevas Funcionalidades */}
                <Route path="/eventos" element={<RutaPrivada><EventsPage /></RutaPrivada>} />
                <Route path="/blog" element={<RutaPrivada><BlogPage /></RutaPrivada>} />

                {/* Historial y Reseñas */}
                <Route path="/ventas" element={<RutaAdmin><SalesPage /></RutaAdmin>} />
                <Route path="/resenas" element={<RutaPrivada><ReviewsPage /></RutaPrivada>} />

                {/* Administración */}
                <Route path="/agregar-producto" element={<RutaAdmin><AddProductPage /></RutaAdmin>} />
                <Route path="/crear-usuario" element={<RutaAdmin><AddUserPage /></RutaAdmin>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;