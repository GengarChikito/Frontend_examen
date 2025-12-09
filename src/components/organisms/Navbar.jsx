import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getUserData = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return { role: payload.role, nombre: payload.nombre };
        } catch (e) { return null; }
    };

    const user = getUserData();
    const isAdmin = user?.role === 'admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    // Estilo activo basado en el diseño de referencia (borde inferior neón)
    const isActive = (path) => location.pathname === path
        ? "text-[#39FF14] border-b-2 border-[#39FF14]"
        : "text-gray-300 hover:text-[#1E90FF] transition-colors hover:border-b-2 hover:border-[#1E90FF]";

    return (
        <nav className="bg-black/95 backdrop-blur-md border-b-2 border-[#1E90FF] sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">

                {/* LOGO */}
                <Link to="/dashboard" className="flex items-center gap-2 group text-decoration-none">
                    <div className="text-[#1E90FF] text-2xl group-hover:rotate-12 transition-transform">
                        <i className="fas fa-gamepad"></i> 🎮
                    </div>
                    <span className="text-xl font-black text-white tracking-wider font-orbitron">
                        LEVEL-UP <span className="text-[#39FF14]">GAMER</span>
                    </span>
                </Link>

                {/* MENÚ */}
                <div className="hidden md:flex gap-8 items-center">
                    <Link to="/dashboard" className={`font-bold text-sm uppercase py-1 ${isActive('/dashboard')}`}>Catálogo</Link>
                    <Link to="/eventos" className={`font-bold text-sm uppercase py-1 ${isActive('/eventos')}`}>Eventos</Link>
                    <Link to="/blog" className={`font-bold text-sm uppercase py-1 ${isActive('/blog')}`}>Blog</Link>

                    {isAdmin && (
                        <Link to="/ventas" className={`font-bold text-sm uppercase py-1 ${isActive('/ventas')}`}>Historial</Link>
                    )}

                    <Link to="/resenas" className={`font-bold text-sm uppercase py-1 ${isActive('/resenas')}`}>Reseñas</Link>
                </div>

                {/* USUARIO */}
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="flex items-center gap-3 bg-[#1E90FF]/10 px-4 py-2 rounded-full border border-[#1E90FF]/50">
                            <span className="text-sm font-bold text-white">{user.nombre}</span>
                            <Link to="/perfil" className="text-[#39FF14] hover:text-white transition-colors" title="Mi Perfil">
                                👤
                            </Link>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-red-500 transition-colors transform hover:scale-110"
                        title="Cerrar Sesión"
                    >
                        🚪
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;