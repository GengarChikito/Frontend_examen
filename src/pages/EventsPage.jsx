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
        // 1. Obtener usuario para saber si es Admin
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setCurrentUser({
                    id: payload.sub || payload.id,
                    role: payload.role
                });
            } catch (e) { console.error(e); }
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

    // --- MANEJADORES DEL CRUD ---

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
        if (!confirm('⚠ ¿Estás seguro de eliminar este evento? Esta acción no se puede deshacer.')) return;
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
            // Convertir puntos a número
            const payload = { ...formData, puntos: parseInt(formData.puntos) };

            if (isEditing) {
                await api.patch(`/eventos/${editingId}`, payload);
                alert('✅ Evento actualizado correctamente');
            } else {
                await api.post('/eventos', payload);
                alert('🎉 Evento creado exitosamente');
            }
            setIsModalOpen(false);
            fetchEventos();
        } catch (error) {
            console.error(error);
            alert('❌ Error al guardar: ' + (error.response?.data?.message || 'Verifica los datos'));
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleInscribirse = () => {
        alert("¡Te has inscrito al evento! Revisa tu correo para más detalles.");
    };

    const isAdmin = currentUser?.role === 'admin';

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-orbitron">CARGANDO EVENTOS...</div>;

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-20">
            <Navbar />

            {/* --- MODAL CRUD (Overlay) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
                    <div className="bg-[#050505] border-2 border-[#39FF14] w-full max-w-lg rounded-2xl shadow-[0_0_30px_rgba(57,255,20,0.2)] p-8 relative max-h-[90vh] overflow-y-auto">

                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl">✕</button>

                        <h3 className="text-2xl font-black font-orbitron text-white mb-6 tracking-wide text-center">
                            {isEditing ? 'EDITAR' : 'CREAR'} <span className="text-[#39FF14]">EVENTO</span>
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input label="Título del Evento" name="titulo" value={formData.titulo} onChange={handleInputChange} placeholder="Ej: Torneo Valorant" />

                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Puntos LevelUp" type="number" name="puntos" value={formData.puntos} onChange={handleInputChange} placeholder="Ej: 100" />
                                <Input label="Fecha" name="fecha" value={formData.fecha} onChange={handleInputChange} placeholder="Ej: 20 Octubre 2025" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Hora" name="hora" value={formData.hora} onChange={handleInputChange} placeholder="Ej: 18:00 hrs" />
                                <Input label="Ubicación" name="ubicacion" value={formData.ubicacion} onChange={handleInputChange} placeholder="Ej: Santiago Centro" />
                            </div>

                            <div>
                                <label className="block text-white text-sm font-bold mb-2 font-roboto uppercase tracking-wider">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    rows="3"
                                    className="w-full bg-black border border-[#1E90FF] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-all font-roboto resize-none"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    placeholder="Detalles del evento..."
                                ></textarea>
                            </div>

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
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 border-b border-gray-800 pb-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl font-black font-orbitron text-white mb-2">EVENTOS GAMING</h2>
                        <p className="text-gray-400">Participa en eventos exclusivos y gana puntos Level-Up</p>
                    </div>

                    {/* Botón Crear (Solo Admin) */}
                    {isAdmin && (
                        <Button variant="gamer-green" onClick={handleOpenCreate} className="flex items-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.4)]">
                            <span className="text-xl">➕</span> Nuevo Evento
                        </Button>
                    )}
                </div>

                {eventos.length === 0 ? (
                    <div className="text-center text-gray-500 py-20 border-2 border-dashed border-gray-800 rounded-xl">
                        <p className="text-2xl mb-2">📅</p>
                        <p>No hay eventos próximos.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {eventos.map((evento) => (
                            <div key={evento.id} className="bg-[#111] border border-[#1E90FF] rounded-xl p-6 transition-all hover:-translate-y-2 hover:border-[#39FF14] hover:shadow-[0_10px_25px_rgba(57,255,20,0.1)] group flex flex-col relative">

                                {/* Botones Admin (Flotantes) */}
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/80 p-1 rounded-lg backdrop-blur-sm">
                                        <button onClick={() => handleOpenEdit(evento)} className="bg-blue-600/20 text-blue-400 p-2 rounded hover:bg-blue-600 hover:text-white transition-colors" title="Editar">✎</button>
                                        <button onClick={() => handleDelete(evento.id)} className="bg-red-600/20 text-red-400 p-2 rounded hover:bg-red-600 hover:text-white transition-colors" title="Eliminar">🗑️</button>
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-[#39FF14] font-bold text-xl group-hover:text-white transition-colors leading-tight font-orbitron pr-8">
                                        {evento.titulo}
                                    </h3>
                                    <span className="bg-gradient-to-br from-[#1E90FF] to-[#39FF14] text-black font-black text-xs px-3 py-1 rounded-full whitespace-nowrap">
                                        +{evento.puntos} XP
                                    </span>
                                </div>

                                <div className="space-y-3 mb-6 text-gray-400 text-sm flex-grow">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#1E90FF] text-lg">📍</span>
                                        <span className="font-bold text-gray-300">{evento.ubicacion}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#1E90FF] text-lg">📅</span>
                                        <span>{evento.fecha}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#1E90FF] text-lg">⏰</span>
                                        <span>{evento.hora}</span>
                                    </div>

                                    <div className="pt-4 border-t border-gray-800 mt-4">
                                        <p className="text-gray-300 text-sm leading-relaxed italic">
                                            "{evento.descripcion}"
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleInscribirse}
                                    className="w-full py-3 rounded-lg bg-transparent border-2 border-[#1E90FF] text-[#1E90FF] font-bold uppercase hover:bg-[#1E90FF] hover:text-white transition-all mt-auto cursor-pointer shadow-[0_0_10px_rgba(30,144,255,0.1)] hover:shadow-[0_0_20px_rgba(30,144,255,0.4)]"
                                >
                                    Inscribirse Ahora
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsPage;