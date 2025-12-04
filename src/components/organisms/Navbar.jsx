import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Función mejorada para obtener todos los datos del usuario
    const getUserData = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            // Decodificamos el token para leer los datos que pusimos en el backend
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                role: payload.role,
                nombre: payload.nombre, // Ahora podemos leer el nombre
                email: payload.email
            };
        } catch (e) { return null; }
    };

    const user = getUserData();
    const isAdmin = user?.role === 'admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path
        ? "text-indigo-600 bg-indigo-50 font-bold"
        : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50 font-medium";

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">

                {/* LOGO */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                        T
                    </div>
                    <span className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">
                Tienda<span className="text-indigo-600">App</span>
            </span>
                </div>

                {/* MENÚ CENTRAL */}
                <div className="hidden md:flex gap-2 bg-slate-100/50 p-1 rounded-xl">
                    <Link to="/dashboard" className={`px-4 py-2 rounded-lg transition-all ${isActive('/dashboard')}`}>
                        Punto de Venta
                    </Link>
                    <Link to="/ventas" className={`px-4 py-2 rounded-lg transition-all ${isActive('/ventas')}`}>
                        Historial
                    </Link>

                    {isAdmin && (
                        <>
                            <Link to="/agregar-producto" className={`px-4 py-2 rounded-lg transition-all ${isActive('/agregar-producto')}`}>
                                + Producto
                            </Link>
                            <Link to="/crear-usuario" className={`px-4 py-2 rounded-lg transition-all ${isActive('/crear-usuario')}`}>
                                + Usuario
                            </Link>
                        </>
                    )}
                </div>

                {/* SECCIÓN DERECHA: USUARIO + SALIR */}
                <div className="flex items-center gap-4">

                    {/* Información del Usuario (Nuevo) */}
                    {user && (
                        <div className="text-right hidden sm:block leading-tight">
                            <p className="text-sm font-bold text-slate-700 block">
                                {user.nombre || user.email}
                            </p>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                    user.role === 'vendedor' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-600'
                            }`}>
                        {user.role}
                    </span>
                        </div>
                    )}

                    {/* Avatar (Inicial del nombre) */}
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                        {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="Cerrar Sesión"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                    </button>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;