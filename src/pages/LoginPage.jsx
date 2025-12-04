import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.access_token);
            navigate('/dashboard');
        } catch (error) {
            setError('Credenciales inválidas, intenta nuevamente.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-white mb-2">Bienvenido</h1>
                    <p className="text-indigo-200">Ingresa a tu punto de venta</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-indigo-100 text-sm font-semibold mb-2 ml-1">Correo Electrónico</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-indigo-400/30 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                            placeholder="ejemplo@tienda.cl"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-indigo-100 text-sm font-semibold mb-2 ml-1">Contraseña</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-indigo-400/30 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold shadow-lg shadow-indigo-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;