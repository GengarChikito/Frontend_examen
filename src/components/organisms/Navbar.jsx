import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Obtener datos del usuario desde el Token
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

    const isActive = (path) => location.pathname === path
        ? "text-[#39FF14] border-b-2 border-[#39FF14] shadow-[0_5px_15px_rgba(57,255,20,0.3)]"
        : "text-gray-300 hover:text-[#1E90FF] transition-colors hover:border-b-2 hover:border-[#1E90FF]";

    return (
        <nav className="bg-black/95 backdrop-blur-md border-b-2 border-[#1E90FF] sticky top-0 z-50 shadow-2xl">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">

                {/* LOGO */}
                <Link to="/dashboard" className="flex items-center gap-2 group text-decoration-none">
                    <div className="text-[#1E90FF] text-2xl group-hover:rotate-12 transition-transform filter drop-shadow-[0_0_5px_#1E90FF]">
                        <i className="fas fa-gamepad"></i> 🎮
                    </div>
                    <span className="text-xl font-black text-white tracking-wider font-orbitron">
                        LEVEL-UP <span className="text-[#39FF14]">GAMER</span>
                    </span>
                </Link>

                {/* MENÚ PRINCIPAL */}
                <div className="hidden lg:flex gap-8 items-center">
                    <Link to="/dashboard" className={`font-bold text-sm uppercase py-1 ${isActive('/dashboard')}`}>Catálogo</Link>
                    <Link to="/eventos" className={`font-bold text-sm uppercase py-1 ${isActive('/eventos')}`}>Eventos</Link>
                    <Link to="/blog" className={`font-bold text-sm uppercase py-1 ${isActive('/blog')}`}>Blog</Link>
                    <Link to="/resenas" className={`font-bold text-sm uppercase py-1 ${isActive('/resenas')}`}>Reseñas</Link>

                    {/* SECCIÓN ADMIN (Separada visualmente) */}
                    {isAdmin && (
                        <div className="flex items-center gap-4 ml-4 pl-6 border-l border-gray-700">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hidden xl:block">Admin Zone</span>

                            <Link to="/ventas" className={`font-bold text-sm uppercase py-1 ${isActive('/ventas')}`} title="Historial de Ventas">
                                📜 Ventas
                            </Link>

                            {/* NUEVOS ENLACES SOLICITADOS */}
                            <Link to="/agregar-producto" className={`font-bold text-sm uppercase py-1 ${isActive('/agregar-producto')}`} title="Agregar Nuevo Producto">
                                📦 +Producto
                            </Link>

                            <Link to="/crear-usuario" className={`font-bold text-sm uppercase py-1 ${isActive('/crear-usuario')}`} title="Crear Nuevo Usuario">
                                👤 +Usuario
                            </Link>
                        </div>
                    )}
                </div>

                {/* PERFIL Y LOGOUT */}
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="flex items-center gap-3 bg-[#1E90FF]/10 px-4 py-2 rounded-full border border-[#1E90FF]/50">
                            <span className="text-sm font-bold text-white font-orbitron">{user.nombre}</span>
                            <Link to="/perfil" className="text-[#39FF14] hover:text-white transition-colors hover:scale-110 transform" title="Mi Perfil">
                                ⚙️
                            </Link>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-red-500 transition-colors transform hover:scale-110 text-xl"
                        title="Cerrar Sesión"
                    >
                        🛑
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;