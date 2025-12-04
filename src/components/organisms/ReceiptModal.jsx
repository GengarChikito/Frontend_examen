import React, { useState } from 'react';
import ReviewModal from './ReviewModal'; // 1. Importamos el nuevo modal

const ReceiptModal = ({ isOpen, onClose, saleData }) => {
    // Estado para controlar el modal de reseña
    const [reviewProduct, setReviewProduct] = useState(null);

    if (!isOpen || !saleData) return null;

    const { id, fecha, total, metodoPago, items, descuentoAplicado } = saleData;

    const totalFinal = parseInt(total);
    const descuento = parseInt(descuentoAplicado || 0);
    const subtotal = totalFinal + descuento;
    const neto = Math.round(totalFinal / 1.19);
    const iva = totalFinal - neto;

    return (
        <>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl overflow-hidden font-mono text-sm relative">

                    {/* Cabecera */}
                    <div className="bg-black text-white p-6 text-center border-b-4 border-[#39FF14]">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl border border-gray-600">
                            🧾
                        </div>
                        <h2 className="text-xl font-black font-orbitron uppercase tracking-widest text-white">
                            LEVEL-UP <span className="text-[#39FF14]">GAMER</span>
                        </h2>
                        <p className="text-gray-400 text-xs mt-1">Boleta Electrónica #{id.toString().padStart(6, '0')}</p>
                    </div>

                    {/* Cuerpo */}
                    <div className="p-6 bg-white relative text-slate-800">
                        {/* Info */}
                        <div className="flex justify-between mb-4 border-b border-dashed border-gray-300 pb-4 text-xs">
                            <span className="text-gray-500">{new Date(fecha).toLocaleDateString()} {new Date(fecha).toLocaleTimeString()}</span>
                            <span className="font-bold text-blue-600">{metodoPago}</span>
                        </div>

                        {/* Productos con Botón de Reseña */}
                        <div className="space-y-3 mb-6 border-b border-dashed border-gray-300 pb-6">
                            {items.map((item, index) => (
                                <div key={index} className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700 font-bold">
                                            {item.cantidad} x {item.nombre}
                                        </span>
                                        <span className="text-black">
                                            ${(item.precio * item.cantidad).toLocaleString()}
                                        </span>
                                    </div>

                                    {/* 2. Botón de Calificar (Solo si el producto existe/tiene ID) */}
                                    {item.id && (
                                        <button
                                            onClick={() => setReviewProduct(item)}
                                            className="self-start text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200 hover:bg-yellow-200 transition-colors flex items-center gap-1"
                                        >
                                            ⭐ Calificar producto
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Totales */}
                        <div className="space-y-1 text-right mb-6">
                            {descuento > 0 && (
                                <>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal:</span>
                                        <span>${subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-[#1E90FF] font-bold">
                                        <span>Desc. Duoc (20%):</span>
                                        <span>-${descuento.toLocaleString()}</span>
                                    </div>
                                    <div className="my-2 border-t border-gray-100"></div>
                                </>
                            )}

                            <div className="flex justify-between text-black font-black text-xl">
                                <span>TOTAL:</span>
                                <span>${totalFinal.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between text-gray-400 text-xs mt-1">
                                <span>(IVA Incluido: ${iva.toLocaleString()})</span>
                            </div>
                        </div>

                        <div className="text-center text-xs text-gray-400">
                            <p>¡GL & HF!</p>
                        </div>
                    </div>

                    <button onClick={onClose} className="w-full bg-[#1E90FF] hover:bg-blue-600 text-white py-4 font-bold uppercase tracking-wider transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>

            {/* 3. Renderizamos el Modal de Reseña si hay un producto seleccionado */}
            <ReviewModal
                isOpen={!!reviewProduct}
                onClose={() => setReviewProduct(null)}
                product={reviewProduct}
            />
        </>
    );
};

export default ReceiptModal;