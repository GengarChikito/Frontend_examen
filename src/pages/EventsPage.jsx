import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/organisms/Navbar';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';

const EventsPage = () => {
    // --- ESTADOS ---
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Estados para el Modal de CRUD
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Estado del Formulario
    const [formData, setFormData] = useState({
        titulo: '',
        puntos: '',
        ubicacion: '',
        fecha: '',
        hora: '',
        descripcion: ''
    });

    // --- CARGA INICIAL ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decodificar token para obtener ID y Rol
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(c =>
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join('')));

                setCurrentUser({
                    id: payload.sub || payload.id,
                    role: payload.role
                });
            } catch (e) { console.error("Error al leer token:", e); }
        }
        fetchEventos();
    }, []);

    const fetchEventos = async () => {
        try {
            const { data } = await api.get('/eventos');
            setEventos(data);
        } catch (error) {
            console.error("Error cargando eventos", error);
        } finally {
            setLoading(false);
        }
    };

    // --- LÓGICA DE INSCRIPCIÓN (SUMAR PUNTOS) ---
    const handleInscribirse = async (puntosEvento) => {
        if (!currentUser || !currentUser.id) {
            alert("🔒 Debes iniciar sesión para inscribirte y ganar puntos.");
            return;
        }

        try {
            // 1. Obtener los puntos actuales del usuario desde la BD
            const { data: usuarioActual } = await api.get(`/usuarios/${currentUser.id}`);

            // 2. Calcular la suma
            const puntosActuales = usuarioActual.puntosLevelUp || 0;
            const nuevosPuntos = puntosActuales + puntosEvento;

            // 3. Actualizar el usuario en la BD (PATCH)
            await api.patch(`/usuarios/${currentUser.id}`, {
                puntosLevelUp: nuevosPuntos
            });

            alert(`✅ ¡INSCRIPCIÓN EXITOSA!\n\nHas ganado +${puntosEvento} XP.\nTienes un total de ${nuevosPuntos} XP.`);

        } catch (error) {
            console.error("Error al inscribirse:", error);
            alert(`❌ Error al inscribirse: ${error.response?.data?.message || 'Inténtalo de nuevo'}`);
        }
    };

    // --- MANEJADORES DEL CRUD (ADMIN) ---
    const handleOpenCreate = () => {
        setIsEditing(false);
        setFormData({ titulo: '', puntos: '', ubicacion: '', fecha: '', hora: '', descripcion: '' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (evento) => {
        setIsEditing(true);
        setEditingId(evento.id);
        setFormData({
            titulo: evento.titulo,
            puntos: evento.puntos,
            ubicacion: evento.ubicacion,
            fecha: evento.fecha,
            hora: evento.hora,
            descripcion: evento.descripcion
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('⚠ ¿Estás seguro de eliminar este evento?')) return;
        try {
            await api.delete(`/eventos/${id}`);
            alert('🗑️ Evento eliminado');
            fetchEventos();
        } catch (error) {
            alert('❌ Error: ' + (error.response?.data?.message || 'No autorizado'));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, puntos: parseInt(formData.puntos) };
            if (isEditing) {
                await api.patch(`/eventos/${editingId}`, payload);
                alert('✅ Evento actualizado');
            } else {
                await api.post('/eventos', payload);
                alert('🎉 Evento creado');
            }
            setIsModalOpen(false);
            fetchEventos();
        } catch (error) {
            alert('❌ Error al guardar');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isAdmin = currentUser?.role === 'admin';

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-orbitron">CARGANDO...</div>;

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-20">
            <Navbar />

            {/* --- MODAL CRUD --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-[#050505] border-2 border-[#39FF14] w-full max-w-lg rounded-2xl shadow-[0_0_30px_rgba(57,255,20,0.2)] p-8 relative overflow-y-auto max-h-[90vh]">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl">✕</button>
                        <h3 className="text-2xl font-black font-orbitron text-white mb-6 text-center">
                            {isEditing ? 'EDITAR' : 'CREAR'} <span className="text-[#39FF14]">EVENTO</span>
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input label="Título" name="titulo" value={formData.titulo} onChange={handleInputChange} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Puntos" type="number" name="puntos" value={formData.puntos} onChange={handleInputChange} />
                                <Input label="Fecha" name="fecha" value={formData.fecha} onChange={handleInputChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Hora" name="hora" value={formData.hora} onChange={handleInputChange} />
                                <Input label="Ubicación" name="ubicacion" value={formData.ubicacion} onChange={handleInputChange} />
                            </div>
                            <textarea
                                name="descripcion" rows="3"
                                className="w-full bg-black border border-[#1E90FF] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                                value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción..."
                            ></textarea>
                            <div className="flex gap-4 mt-6">
                                <Button onClick={() => setIsModalOpen(false)} variant="gamer-outline" className="flex-1">Cancelar</Button>
                                <Button type="submit" variant="gamer-green" className="flex-1">Guardar</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="container mx-auto p-6 mt-8">

                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 border-b border-gray-800 pb-8">
                    <div>
                        <h2 className="text-4xl font-black font-orbitron text-white mb-2">EVENTOS GAMING</h2>
                        <p className="text-gray-400">Participa y gana puntos Level-Up</p>
                    </div>
                    {isAdmin && (
                        <Button variant="gamer-green" onClick={handleOpenCreate}>
                            <span className="text-xl mr-2">➕</span> Nuevo Evento
                        </Button>
                    )}
                </div>

                {/* --- GRID: 2 COLUMNAS EVENTOS | 1 COLUMNA MAPA --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* COLUMNA IZQUIERDA: LISTA DE EVENTOS */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        {eventos.length === 0 ? (
                            <div className="text-center text-gray-500 py-20 border-2 border-dashed border-gray-800 rounded-xl">
                                <p className="text-2xl mb-2">📅</p>
                                <p>No hay eventos próximos.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {eventos.map((evento) => (
                                    <div key={evento.id} className="bg-[#111] border border-[#1E90FF] rounded-xl p-5 hover:border-[#39FF14] transition-all group relative flex flex-col">

                                        {/* Botones Admin */}
                                        {isAdmin && (
                                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded p-1 backdrop-blur-sm z-10">
                                                <button onClick={() => handleOpenEdit(evento)} className="text-blue-400 hover:text-white px-2">✎</button>
                                                <button onClick={() => handleDelete(evento.id)} className="text-red-400 hover:text-white px-2">🗑️</button>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-[#39FF14] font-bold text-lg font-orbitron leading-tight pr-6">{evento.titulo}</h3>
                                            <span className="bg-[#1E90FF]/20 text-[#1E90FF] text-xs font-bold px-2 py-1 rounded border border-[#1E90FF] whitespace-nowrap">
                                                +{evento.puntos} XP
                                            </span>
                                        </div>

                                        <div className="space-y-2 mb-4 text-gray-400 text-sm flex-grow">
                                            <div className="flex gap-2"><span className="text-[#1E90FF]">📍</span> {evento.ubicacion}</div>
                                            <div className="flex gap-2"><span className="text-[#1E90FF]">📅</span> {evento.fecha}</div>
                                            <div className="flex gap-2"><span className="text-[#1E90FF]">⏰</span> {evento.hora}</div>
                                            <p className="text-gray-500 text-xs mt-2 italic line-clamp-2">"{evento.descripcion}"</p>
                                        </div>

                                        <button
                                            // AQUÍ SE LLAMA A LA FUNCIÓN CORREGIDA
                                            onClick={() => handleInscribirse(evento.puntos)}
                                            className="w-full py-2 rounded bg-transparent border border-[#1E90FF] text-[#1E90FF] text-sm font-bold hover:bg-[#1E90FF] hover:text-white transition-all cursor-pointer shadow-[0_0_10px_rgba(30,144,255,0.1)] hover:shadow-[0_0_20px_rgba(30,144,255,0.4)]"
                                        >
                                            INSCRIBIRSE
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* COLUMNA DERECHA: MAPA */}
                    <div className="lg:col-span-1 order-1 lg:order-2 sticky top-24">
                        <div className="w-full h-[500px] bg-white rounded-xl overflow-hidden shadow-lg border-2 border-gray-700 relative">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3329.8547477322687!2d-70.66!3d-33.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2scl!4v1620000000000!5m2!1ses!2scl"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Mapa de Eventos"
                            ></iframe>
                            <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 rounded font-bold shadow text-xs font-orbitron border border-gray-300">
                                📍 LIVE MAP
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EventsPage;