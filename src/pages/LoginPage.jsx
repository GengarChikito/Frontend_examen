import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LoginPage = () => {
    // Estado para saber si estamos en Login o Registro
    const [isRegister, setIsRegister] = useState(false);

    // Datos del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isRegister) {
                // Lógica de REGISTRO
                await api.post('/auth/register', {
                    nombre,
                    email,
                    password,
                    fechaNacimiento, // Requerido por el backend
                    role: 'cliente'  // Por defecto cliente
                });
                alert('¡Registro exitoso! Ahora inicia sesión.');
                setIsRegister(false); // Volver al login
            } else {
                // Lógica de LOGIN
                const response = await api.post('/auth/login', { email, password });
                localStorage.setItem('token', response.data.access_token);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Ocurrió un error. Intenta nuevamente.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-[#050505] relative overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#050505] z-0"></div>

            <div className="bg-[#111]/80 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 relative">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white font-orbitron tracking-wider mb-2">
                        LEVEL-UP <span className="text-[#39FF14]">GAMER</span>
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {isRegister ? 'Crea tu cuenta de jugador' : 'Ingresa al sistema'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Campos extra solo para Registro */}
                    {isRegister && (
                        <>
                            <div>
                                <label className="block text-gray-400 text-xs font-bold mb-1 uppercase">Nombre de Usuario</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all"
                                    placeholder="Ej: MasterChief"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-xs font-bold mb-1 uppercase">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all"
                                    value={fechaNacimiento}
                                    onChange={(e) => setFechaNacimiento(e.target.value)}
                                    required
                                />
                                <p className="text-[10px] text-gray-500 mt-1">* Debes ser mayor de 18 años.</p>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-gray-400 text-xs font-bold mb-1 uppercase">Correo Electrónico</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all"
                            placeholder="usuario@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs font-bold mb-1 uppercase">Contraseña</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-xs text-center font-bold">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-[#1E90FF] hover:bg-blue-600 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-900/50 transition-all transform hover:-translate-y-1"
                    >
                        {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                        <button
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setError('');
                            }}
                            className="ml-2 text-[#39FF14] font-bold hover:underline"
                        >
                            {isRegister ? 'Inicia Sesión' : 'Regístrate aquí'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;