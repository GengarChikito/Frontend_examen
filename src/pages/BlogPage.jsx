import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/organisms/Navbar';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Select from '../components/atoms/Select';

const BlogPage = () => {
    // --- ESTADOS ---
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Estados Modal CRUD
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Estado Formulario
    const [formData, setFormData] = useState({
        titulo: '',
        categoria: 'Guías',
        descripcion: '',
        fecha: '',
        icono: '🎮'
    });

    // --- CARGA INICIAL ---
    useEffect(() => {
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
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const { data } = await api.get('/blogs');
            setBlogs(data);
        } catch (error) {
            console.error("Error cargando blogs", error);
        } finally {
            setLoading(false);
        }
    };

    // --- MANEJADORES ---
    const handleOpenCreate = () => {
        setIsEditing(false);
        setFormData({
            titulo: '',
            categoria: 'Guías',
            descripcion: '',
            fecha: new Date().toLocaleDateString(), // Fecha de hoy por defecto
            icono: '🎮'
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (blog) => {
        setIsEditing(true);
        setEditingId(blog.id);
        setFormData({
            titulo: blog.titulo,
            categoria: blog.categoria,
            descripcion: blog.descripcion,
            fecha: blog.fecha,
            icono: blog.icono
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('⚠ ¿Eliminar esta noticia?')) return;
        try {
            await api.delete(`/blogs/${id}`);
            alert('🗑️ Noticia eliminada');
            fetchBlogs();
        } catch (error) {
            alert('❌ Error: No autorizado');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.patch(`/blogs/${editingId}`, formData);
                alert('✅ Noticia actualizada');
            } else {
                await api.post('/blogs', formData);
                alert('🎉 Noticia creada');
            }
            setIsModalOpen(false);
            fetchBlogs();
        } catch (error) {
            alert('❌ Error al guardar');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isAdmin = currentUser?.role === 'admin';

    // Opciones de Categoría e Icono
    const categoryOptions = [
        { value: 'Guías', label: 'Guías' },
        { value: 'Esports', label: 'Esports' },
        { value: 'Setup', label: 'Setup' },
        { value: 'Noticias', label: 'Noticias' }
    ];

    const iconOptions = [
        { value: '🎮', label: '🎮 Control' },
        { value: '🏆', label: '🏆 Trofeo' },
        { value: '💺', label: '💺 Silla' },
        { value: '💻', label: '💻 PC' },
        { value: '🔥', label: '🔥 Fuego' }
    ];

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-orbitron">CARGANDO NOTICIAS...</div>;

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-10">
            <Navbar />

            {/* --- MODAL CRUD --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
                    <div className="bg-[#050505] border-2 border-[#1E90FF] w-full max-w-lg rounded-2xl shadow-[0_0_30px_rgba(30,144,255,0.2)] p-8 relative max-h-[90vh] overflow-y-auto">

                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl">✕</button>

                        <h3 className="text-2xl font-black font-orbitron text-white mb-6 tracking-wide text-center">
                            {isEditing ? 'EDITAR' : 'CREAR'} <span className="text-[#1E90FF]">BLOG</span>
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input label="Título" name="titulo" value={formData.titulo} onChange={handleInputChange} placeholder="Título de la noticia" />

                            <div className="grid grid-cols-2 gap-4">
                                <Select label="Categoría" name="categoria" value={formData.categoria} onChange={handleInputChange} options={categoryOptions} />
                                <Select label="Icono" name="icono" value={formData.icono} onChange={handleInputChange} options={iconOptions} />
                            </div>

                            <Input label="Fecha Publicación" name="fecha" value={formData.fecha} onChange={handleInputChange} placeholder="Ej: 10 Octubre 2025" />

                            <div>
                                <label className="block text-white text-sm font-bold mb-2 font-roboto uppercase tracking-wider">Contenido</label>
                                <textarea
                                    name="descripcion"
                                    rows="5"
                                    className="w-full bg-black border border-[#1E90FF] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-all font-roboto resize-none"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    placeholder="Escribe el contenido aquí..."
                                ></textarea>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <Button onClick={() => setIsModalOpen(false)} variant="gamer-outline" className="flex-1">Cancelar</Button>
                                <Button type="submit" variant="gamer-blue" className="flex-1">Guardar</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="container mx-auto p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 mt-8 gap-6 border-b border-gray-800 pb-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl font-black font-orbitron text-white mb-2">BLOG GAMING</h2>
                        <p className="text-gray-400">Las últimas noticias y guías del mundo gaming</p>
                    </div>

                    {isAdmin && (
                        <Button variant="gamer-blue" onClick={handleOpenCreate} className="flex items-center gap-2 shadow-[0_0_15px_rgba(30,144,255,0.4)]">
                            <span className="text-xl">📝</span> Nueva Noticia
                        </Button>
                    )}
                </div>

                {blogs.length === 0 ? (
                    <div className="text-center text-gray-500 py-20 border-2 border-dashed border-gray-800 rounded-xl">
                        <p className="text-2xl mb-2">📰</p>
                        <p>No hay noticias publicadas.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {blogs.map((art) => (
                            <article key={art.id} className="bg-[#111] border border-[#1E90FF] rounded-xl overflow-hidden hover:border-[#39FF14] hover:-translate-y-2 transition-all duration-300 flex flex-col relative group">

                                {/* Botones Admin */}
                                {isAdmin && (
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/80 p-1 rounded backdrop-blur-sm">
                                        <button onClick={() => handleOpenEdit(art)} className="text-blue-400 hover:text-white p-1">✎</button>
                                        <button onClick={() => handleDelete(art.id)} className="text-red-400 hover:text-white p-1">🗑️</button>
                                    </div>
                                )}

                                <div className="h-48 bg-[#1E90FF]/10 flex items-center justify-center border-b border-[#1E90FF]/30">
                                    <span className="text-6xl filter drop-shadow-[0_0_10px_#1E90FF]">{art.icono}</span>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div>
                                        <span className="bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold px-2 py-1 rounded-full uppercase mb-2 inline-block border border-[#39FF14]/30">
                                            {art.categoria}
                                        </span>
                                        <h3 className="text-white font-bold text-xl mb-3 mt-2 leading-tight hover:text-[#1E90FF] transition-colors cursor-pointer font-orbitron">
                                            {art.titulo}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                                            {art.descripcion}
                                        </p>
                                    </div>
                                    <div className="mt-auto flex justify-between items-center text-xs text-[#1E90FF] font-medium border-t border-gray-800 pt-4">
                                        <span>{art.fecha}</span>
                                        <span>Por Level-Up Team</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;