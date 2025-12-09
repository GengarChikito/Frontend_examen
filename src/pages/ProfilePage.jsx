import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/organisms/Navbar';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Select from '../components/atoms/Select';

// Lógica de Niveles (Gamificación)
const NIVELES = [
    { nivel: 1, titulo: "Rookie Gamer", min: 0, max: 99 },
    { nivel: 2, titulo: "Casual Player", min: 100, max: 249 },
    { nivel: 3, titulo: "Gaming Enthusiast", min: 250, max: 499 },
    { nivel: 4, titulo: "Dedicated Gamer", min: 500, max: 999 },
    { nivel: 5, titulo: "Pro Gamer", min: 1000, max: 1999 },
    { nivel: 6, titulo: "Elite Player", min: 2000, max: 3999 },
    { nivel: 7, titulo: "Gaming Legend", min: 4000, max: 7999 },
    { nivel: 8, titulo: "Master Gamer", min: 8000, max: Infinity }
];

const ProfilePage = () => {
    const [loading, setLoading] = useState(true);

    // Estado del formulario
    const [formData, setFormData] = useState({
        email: '',
        nombre: '',
        fechaNacimiento: '',
        plataforma: 'PC',
        genero: 'RPG'
    });

    // Estado de estadísticas
    const [stats, setStats] = useState({
        puntos: 0,
        compras: 0,
        referidos: 0,
        codigo: '...'
    });

    // Obtener ID del usuario
    const getUserId = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub || payload.id;
        } catch (e) { return null; }
    };

    // Cargar datos
    useEffect(() => {
        const fetchProfile = async () => {
            const userId = getUserId();
            if (!userId) return;

            try {
                const { data } = await api.get(`/usuarios/${userId}`);

                setFormData({
                    email: data.email,
                    nombre: data.nombre,
                    fechaNacimiento: data.fechaNacimiento ? data.fechaNacimiento.split('T')[0] : '',
                    plataforma: 'PC', // Valor por defecto visual
                    genero: 'RPG'     // Valor por defecto visual
                });

                setStats({
                    puntos: data.puntosLevelUp || 0,
                    compras: data.boletas ? data.boletas.length : 0,
                    referidos: 2, // Dato simulado por ahora
                    codigo: data.miCodigoReferido || 'N/A'
                });

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // --- CÁLCULOS DE NIVEL ---
    const obtenerNivelActual = (puntos) => {
        // Busca el nivel más alto que cumple con el mínimo de puntos
        return [...NIVELES].reverse().find(n => puntos >= n.min) || NIVELES[0];
    };

    const nivelActual = obtenerNivelActual(stats.puntos);

    // Calcular siguiente nivel
    const siguienteNivel = NIVELES.find(n => n.nivel === nivelActual.nivel + 1);
    const puntosFaltantes = siguienteNivel ? siguienteNivel.min - stats.puntos : 0;

    // Calcular porcentaje de barra (evitar división por cero)
    const rangoPuntos = siguienteNivel ? (siguienteNivel.min - nivelActual.min) : 1;
    const progresoPuntos = stats.puntos - nivelActual.min;
    const porcentajeBarra = siguienteNivel ? Math.min((progresoPuntos / rangoPuntos) * 100, 100) : 100;


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(stats.codigo);
        alert('¡Código copiado!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = getUserId();
        try {
            await api.patch(`/usuarios/${userId}`, {
                nombre: formData.nombre,
                fechaNacimiento: formData.fechaNacimiento
            });
            alert('✅ Perfil actualizado');
        } catch (error) {
            alert('❌ Error al actualizar');
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-orbitron">CARGANDO...</div>;

    // Estilos base
    const cardBase = "bg-black border border-[#1E90FF] rounded-xl p-6 shadow-[0_0_15px_rgba(30,144,255,0.15)] relative overflow-hidden";
    const titleGreen = "text-[#39FF14] font-black font-orbitron text-2xl mb-6 tracking-wide";

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-20">
            <Navbar />

            <div className="container mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- COLUMNA IZQUIERDA: FORMULARIO --- */}
                    <div className={`lg:col-span-2 ${cardBase}`}>
                        <h2 className={titleGreen}>Información Personal</h2>

                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Email"
                                name="email"
                                value={formData.email}
                                disabled={true}
                            />

                            <Input
                                label="Nombre de Usuario"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                            />

                            <Input
                                label="Fecha de Nacimiento"
                                type="date"
                                name="fechaNacimiento"
                                value={formData.fechaNacimiento}
                                onChange={handleChange}
                            />

                            <Select
                                label="Plataforma Favorita"
                                name="plataforma"
                                value={formData.plataforma}
                                onChange={handleChange}
                                options={[
                                    { value: 'PC', label: 'PC' },
                                    { value: 'PS5', label: 'PlayStation 5' },
                                    { value: 'Xbox', label: 'Xbox Series X' },
                                    { value: 'Switch', label: 'Nintendo Switch' }
                                ]}
                            />

                            <Select
                                label="Género Favorito"
                                name="genero"
                                value={formData.genero}
                                onChange={handleChange}
                                options={[
                                    { value: 'RPG', label: 'RPG' },
                                    { value: 'FPS', label: 'FPS' },
                                    { value: 'Action', label: 'Acción' },
                                    { value: 'Sports', label: 'Deportes' }
                                ]}
                            />

                            <div className="mt-6">
                                <Button type="submit" variant="gamer-green" className="rounded-full px-8">
                                    Actualizar Perfil
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* --- COLUMNA DERECHA: ESTADÍSTICAS Y NIVEL --- */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* 1. TARJETA DE NIVEL (Nuevo componente basado en tu imagen) */}
                        <div className="bg-black border-2 border-[#39FF14] rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(57,255,20,0.2)]">
                            <h3 className="text-[#39FF14] font-orbitron text-2xl font-bold mb-2">
                                {nivelActual.titulo}
                            </h3>
                            <p className="text-[#1E90FF] font-bold text-xl mb-4">
                                {stats.puntos} puntos
                            </p>

                            {/* Barra de Progreso */}
                            <div className="w-full bg-[#222] rounded-full h-4 mb-3 border border-gray-700 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#1E90FF] to-[#39FF14] transition-all duration-1000 ease-out"
                                    style={{ width: `${porcentajeBarra}%` }}
                                ></div>
                            </div>

                            <p className="text-gray-300 text-sm">
                                {siguienteNivel
                                    ? `Faltan ${puntosFaltantes} puntos para el siguiente nivel`
                                    : "¡Has alcanzado el nivel máximo!"}
                            </p>
                        </div>

                        {/* 2. ESTADÍSTICAS GENERALES */}
                        <div className={cardBase}>
                            <h2 className={titleGreen}>Estadísticas Level-Up</h2>
                            <div className="space-y-4 font-orbitron text-sm">
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-400">Puntos Totales:</span>
                                    <span className="text-[#1E90FF] font-bold">{stats.puntos}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-400">Compras Realizadas:</span>
                                    <span className="text-[#1E90FF] font-bold">{stats.compras}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-400">Referidos Exitosos:</span>
                                    <span className="text-[#1E90FF] font-bold">{stats.referidos}</span>
                                </div>
                            </div>

                            {/* CÓDIGO REFERIDO */}
                            <div className="mt-8 text-center">
                                <h3 className="text-[#39FF14] font-bold text-lg mb-2 font-orbitron">
                                    Tu Código de Referido
                                </h3>
                                <div
                                    onClick={handleCopyCode}
                                    className="bg-[#050505] border border-[#1E90FF] rounded-lg p-3 flex justify-between items-center cursor-pointer group hover:border-[#39FF14] transition-colors"
                                >
                                    <span className="text-[#39FF14] font-mono tracking-widest text-lg ml-2">
                                        {stats.codigo}
                                    </span>
                                    <button className="text-[#1E90FF] bg-[#1E90FF]/10 p-2 rounded group-hover:text-[#39FF14] group-hover:bg-[#39FF14]/10 transition-colors">
                                        📋
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* WhatsApp Float */}
            <a
                href="https://wa.me/56912345678"
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-[0_0_15px_#25D366] hover:scale-110 transition-transform z-50"
            >
                <i className="fab fa-whatsapp"></i>
            </a>
        </div>
    );
};

export default ProfilePage;