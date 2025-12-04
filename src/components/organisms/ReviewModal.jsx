import React, { useState } from 'react';
import api from '../../services/api';

const ReviewModal = ({ isOpen, onClose, product }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !product) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/resenas', {
                productoId: product.id,
                texto: comment,
                calificacion: rating
            });
            alert('✅ ¡Reseña enviada! Gracias por tu feedback.');
            onClose();
            setComment('');
            setRating(5);
        } catch (error) {
            console.error(error);
            alert('❌ Error al enviar reseña. ' + (error.response?.data?.message || ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
            <div className="bg-[#111] border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">

                <h3 className="text-xl font-black font-orbitron text-white mb-1">
                    CALIFICAR <span className="text-[#1E90FF]">LOOT</span>
                </h3>
                <p className="text-gray-400 text-sm mb-6">Producto: <span className="text-[#39FF14]">{product.nombre}</span></p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Estrellas */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Puntuación</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-3xl transition-transform hover:scale-110 ${star <= rating ? 'grayscale-0' : 'grayscale opacity-30'}`}
                                >
                                    ⭐
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comentario */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tu Opinión</label>
                        <textarea
                            rows="3"
                            className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-[#1E90FF] outline-none resize-none"
                            placeholder="¿Qué tal funciona? Cuéntanos..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 font-bold transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl bg-[#1E90FF] hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/50 transition-all"
                        >
                            {loading ? 'Enviando...' : 'Publicar Reseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;