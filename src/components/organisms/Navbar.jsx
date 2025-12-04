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
            return { role: payload.role, nombre: payload.nombre, email: payload.email };
        } catch (e) { return null; }
    };

    const user = getUserData();
    const isAdmin = user?.role === 'admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path
        ? "text-[#39FF14] border-b-2 border-[#39FF14] pb-1 shadow-[0_0_10px_#39FF14]"
        : "text-gray-300 hover:text-[#1E90FF] transition-colors";

    return (
        <nav className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 shadow-lg shadow-blue-900/10">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">

                {/* LOGO */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1E90FF] to-blue-800 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/50 transform rotate-3">
                        L
                    </div>
                    <span className="text-xl font-black text-white tracking-wider hidden sm:block">
                        LEVEL-UP <span className="text-[#39FF14]">GAMER</span>
                    </span>
                </div>

                {/* MENÚ */}
                <div className="hidden md:flex gap-6 items-center">
                    <Link to="/dashboard" className={`font-bold text-sm uppercase ${isActive('/dashboard')}`}>Catálogo</Link>
                    <Link to="/ventas" className={`font-bold text-sm uppercase ${isActive('/ventas')}`}>Historial</Link>

                    {/* 1. LINK AGREGADO */}
                    <Link to="/resenas" className={`font-bold text-sm uppercase ${isActive('/resenas')}`}>Reseñas</Link>

                    {isAdmin && (
                        <>
                            <div className="h-6 w-px bg-gray-700 mx-2"></div> {/* Separador */}
                            <Link to="/agregar-producto" className={`font-bold text-sm uppercase ${isActive('/agregar-producto')}`}>+ Producto</Link>
                            <Link to="/crear-usuario" className={`font-bold text-sm uppercase ${isActive('/crear-usuario')}`}>+ Usuario</Link>
                        </>
                    )}
                </div>

                {/* USUARIO */}
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white">{user.nombre}</p>
                            <span className="text-[10px] uppercase font-bold text-[#1E90FF] tracking-widest">
                                {user.role}
                            </span>
                        </div>
                    )}
                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Salir">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;