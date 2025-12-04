import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/organisms/Navbar';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await api.get('/resenas');
                setReviews(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchReviews();
    }, []);

    // Función para renderizar estrellas
    const renderStars = (count) => {
        return '⭐'.repeat(count) + '☆'.repeat(5 - count);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-10">
            <Navbar />

            <div className="container mx-auto p-6">
                <div className="mb-8 border-b border-gray-800 pb-6">
                    <h2 className="text-3xl font-black font-orbitron text-white flex items-center gap-2">
                        <span className="text-[#39FF14] animate-pulse">///</span> FEEDBACK DE LA COMUNIDAD
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Opiniones verificadas de nuestros jugadores</p>
                </div>

                {reviews.length === 0 ? (
                    <div className="text-center py-20 text-gray-600">
                        <span className="text-6xl block mb-4 opacity-30">💬</span>
                        <p className="uppercase tracking-widest text-sm">Aún no hay reseñas. ¡Sé el primero!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-[#111] p-6 rounded-2xl border border-gray-800 hover:border-[#39FF14]/50 transition-all hover:shadow-[0_0_15px_rgba(57,255,20,0.1)] group">

                                {/* Header Reseña */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center font-bold text-gray-400">
                                            {review.usuario?.nombre?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white">{review.usuario?.nombre}</h4>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                                                {new Date(review.fecha).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-[#39FF14] tracking-widest">
                                        {renderStars(review.calificacion)}
                                    </span>
                                </div>

                                {/* Producto asociado */}
                                <div className="mb-3">
                                    <span className="bg-[#1E90FF]/10 text-[#1E90FF] text-[10px] font-bold px-2 py-1 rounded border border-[#1E90FF]/30">
                                        ITEM: {review.producto?.nombre}
                                    </span>
                                </div>

                                {/* Texto */}
                                <div className="relative">
                                    <span className="absolute -top-2 -left-1 text-4xl text-gray-800 font-serif opacity-50">“</span>
                                    <p className="text-gray-300 text-sm italic pl-4 leading-relaxed">
                                        {review.texto}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsPage;