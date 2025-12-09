import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/organisms/Navbar';
import Button from '../components/atoms/Button';
import Select from '../components/atoms/Select';

const ReviewsPage = () => {
    // --- ESTADOS DE DATOS ---
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    // --- ESTADOS DEL FORMULARIO (MODAL INTEGRADO) ---
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Valores del formulario
    const [formValues, setFormValues] = useState({
        productId: '',
        rating: 5,
        comment: ''
    });

    // --- EFECTOS ---
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
        fetchReviews();
        fetchProducts();
    }, []);

    // --- FUNCIONES API ---
    const fetchReviews = async () => {
        try {
            const { data } = await api.get('/resenas');
            setReviews(data);
        } catch (error) {
            console.error("Error cargando reseñas", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/productos');
            setProducts(data);
        } catch (error) {
            console.error("Error cargando productos", error);
        }
    };

    // --- MANEJADORES DEL FORMULARIO ---
    const openCreateForm = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormValues({
            productId: products.length > 0 ? products[0].id : '',
            rating: 5,
            comment: ''
        });
        setIsFormOpen(true);
    };

    const openEditForm = (review) => {
        setIsEditing(true);
        setEditingId(review.id);
        setFormValues({
            productId: review.producto.id,
            rating: review.calificacion,
            comment: review.texto
        });
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setLoadingSubmit(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);

        try {
            if (isEditing) {
                // EDITAR
                await api.patch(`/resenas/${editingId}`, {
                    texto: formValues.comment,
                    calificacion: formValues.rating
                });
                alert('✅ Reseña actualizada');
            } else {
                // CREAR
                if (!formValues.productId) {
                    alert('❌ Debes seleccionar un producto');
                    setLoadingSubmit(false);
                    return;
                }
                await api.post('/resenas', {
                    productoId: formValues.productId,
                    texto: formValues.comment,
                    calificacion: formValues.rating
                });
                alert('✅ Reseña publicada');
            }

            fetchReviews(); // Recargar lista
            closeForm();
        } catch (error) {
            console.error(error);
            alert('❌ Error: ' + (error.response?.data?.message || 'Algo salió mal'));
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta reseña?')) return;
        try {
            await api.delete(`/resenas/${id}`);
            fetchReviews();
        } catch (error) {
            alert('❌ Error: ' + (error.response?.data?.message || 'No autorizado'));
        }
    };

    // Helper para estrellas
    const renderStars = (count) => '⭐'.repeat(count) + '☆'.repeat(5 - count);

    // Opciones para el Select de productos
    const productOptions = products.map(p => ({ value: p.id, label: p.nombre }));

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-10">
            <Navbar />

            {/* --- MODAL INTEGRADO (Overlay) --- */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
                    <div className="bg-[#050505] border-2 border-[#1E90FF] w-full max-w-md rounded-2xl shadow-[0_0_30px_rgba(30,144,255,0.2)] p-8 relative">

                        <button onClick={closeForm} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors text-xl">✕</button>

                        <h3 className="text-2xl font-black font-orbitron text-white mb-6 tracking-wide text-center">
                            {isEditing ? 'EDITAR' : 'NUEVA'} <span className="text-[#1E90FF]">RESEÑA</span>
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Selector de Producto (Solo si es creación o para ver cuál es) */}
                            {isEditing ? (
                                <div className="mb-4">
                                    <label className="block text-gray-400 text-sm font-bold mb-2 font-roboto uppercase">Producto</label>
                                    <div className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-3 text-[#39FF14] font-bold">
                                        {products.find(p => p.id === formValues.productId)?.nombre || 'Desconocido'}
                                    </div>
                                </div>
                            ) : (
                                <Select
                                    label="Selecciona el Producto"
                                    name="productId"
                                    value={formValues.productId}
                                    onChange={(e) => setFormValues({...formValues, productId: e.target.value})}
                                    options={productOptions}
                                />
                            )}

                            {/* Selector de Estrellas */}
                            <div>
                                <label className="block text-white text-sm font-bold mb-2 font-roboto uppercase tracking-wider">
                                    Puntuación
                                </label>
                                <div className="flex gap-2 bg-[#111] p-4 rounded-lg border border-[#1E90FF] justify-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormValues({...formValues, rating: star})}
                                            className={`text-3xl transition-transform hover:scale-125 focus:outline-none ${star <= formValues.rating ? 'grayscale-0' : 'grayscale opacity-30'}`}
                                        >
                                            ⭐
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comentario */}
                            <div>
                                <label className="block text-white text-sm font-bold mb-2 font-roboto uppercase tracking-wider">
                                    Tu Opinión
                                </label>
                                <textarea
                                    rows="4"
                                    className="w-full bg-black border border-[#1E90FF] rounded-lg px-4 py-3 text-white focus:outline-none focus:shadow-[0_0_15px_#1E90FF] focus:border-[#39FF14] transition-all duration-300 font-roboto resize-none"
                                    placeholder="Cuéntanos tu experiencia..."
                                    value={formValues.comment}
                                    onChange={(e) => setFormValues({...formValues, comment: e.target.value})}
                                    required
                                ></textarea>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Button
                                    onClick={closeForm}
                                    variant="gamer-outline"
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="gamer-blue"
                                    className="flex-1"
                                    disabled={loadingSubmit}
                                >
                                    {loadingSubmit ? 'Guardando...' : 'Confirmar'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="container mx-auto p-6 mt-8">

                {/* Cabecera */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-800 pb-6 gap-6">
                    <div>
                        <h2 className="text-4xl font-black font-orbitron text-white flex items-center gap-3">
                            <span className="text-[#39FF14] animate-pulse">///</span> FEEDBACK
                        </h2>
                        <p className="text-gray-400 text-sm mt-2 font-roboto">Opiniones de la comunidad Level-Up</p>
                    </div>

                    {currentUser && (
                        <Button
                            variant="gamer-green"
                            onClick={openCreateForm}
                            className="flex items-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.4)]"
                        >
                            <span className="text-xl">💬</span> Escribir Reseña
                        </Button>
                    )}
                </div>

                {/* Grid de Reseñas */}
                {reviews.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl bg-[#0a0a0a]">
                        <span className="text-7xl block mb-6 opacity-20">💬</span>
                        <p className="uppercase tracking-widest text-lg mb-2 font-orbitron">Aún no hay reseñas</p>
                        <p className="text-sm">¡Sé el primero en opinar sobre nuestros productos!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review) => {
                            const isOwner = currentUser && review.usuario?.id === currentUser.id;
                            const isAdmin = currentUser && currentUser.role === 'admin';

                            return (
                                <div key={review.id} className="bg-[#111] p-6 rounded-2xl border border-gray-800 hover:border-[#39FF14] transition-all hover:shadow-[0_0_20px_rgba(57,255,20,0.15)] group flex flex-col relative h-full">

                                    {/* Botones de Acción (Flotantes) */}
                                    {(isOwner || isAdmin) && (
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/80 p-1 rounded-lg backdrop-blur-sm">
                                            {isOwner && (
                                                <button
                                                    onClick={() => openEditForm(review)}
                                                    className="bg-blue-600/20 text-blue-400 p-2 rounded hover:bg-blue-600 hover:text-white transition-colors"
                                                    title="Editar"
                                                >
                                                    ✎
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                className="bg-red-600/20 text-red-400 p-2 rounded hover:bg-red-600 hover:text-white transition-colors"
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}

                                    {/* Header Usuario */}
                                    <div className="flex justify-between items-start mb-4 border-b border-gray-800 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E90FF] to-[#000] border border-[#1E90FF] flex items-center justify-center font-bold text-white text-lg shadow-[0_0_10px_#1E90FF]">
                                                {review.usuario?.nombre?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-white flex items-center gap-2 font-orbitron">
                                                    {review.usuario?.nombre}
                                                    {isOwner && <span className="text-[10px] bg-[#39FF14] text-black px-2 py-0.5 rounded font-black">TÚ</span>}
                                                </h4>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                                                    {new Date(review.fecha).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Producto y Rating */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-mono text-[#39FF14] tracking-widest text-lg drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">
                                                {renderStars(review.calificacion)}
                                            </span>
                                        </div>
                                        <div className="inline-block bg-[#1E90FF]/10 text-[#1E90FF] text-[10px] font-bold px-3 py-1 rounded-full border border-[#1E90FF]/30">
                                            ITEM: {review.producto?.nombre}
                                        </div>
                                    </div>

                                    {/* Comentario */}
                                    <div className="relative flex-grow bg-[#0a0a0a] p-4 rounded-lg border border-gray-800">
                                        <span className="absolute top-2 left-2 text-4xl text-gray-800 font-serif opacity-50 z-0">“</span>
                                        <p className="text-gray-300 text-sm italic leading-relaxed relative z-10 pl-2">
                                            {review.texto}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsPage;