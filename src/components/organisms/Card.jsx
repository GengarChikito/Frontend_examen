import React from 'react';

const Cart = ({ items, onRemove, onCheckout, total }) => {
    return (
        // CAMBIO: Fondo negro (#111) y texto blanco
        <div className="bg-[#111] p-6 h-full flex flex-col text-white border-l border-gray-800">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                {/* Fuente Orbitron para el título */}
                <h2 className="text-xl font-black font-orbitron tracking-widest text-white">
                    TU <span className="text-[#39FF14]">LOOT</span> 🛒
                </h2>
                <span className="bg-[#39FF14]/10 text-[#39FF14] text-xs font-bold px-2 py-1 rounded border border-[#39FF14]/30 shadow-[0_0_5px_rgba(57,255,20,0.2)]">
                    {items.length} ITEMS
                </span>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-grow text-gray-600 py-10">
                    <span className="text-5xl mb-4 grayscale opacity-30">🎒</span>
                    <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Inventario Vacío</p>
                </div>
            ) : (
                <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-gray-800 hover:border-[#1E90FF]/50 transition-all group">
                            <div>
                                <h4 className="font-bold text-gray-200 text-sm group-hover:text-[#1E90FF] transition-colors">{item.nombre}</h4>
                                <div className="text-xs text-gray-500 mt-1 font-mono">
                                    <span className="text-[#39FF14]">{item.cantidad}</span> x ${parseInt(item.precio).toLocaleString()}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-white text-sm font-mono">
                                    ${(item.cantidad * item.precio).toLocaleString()}
                                </span>
                                <button
                                    onClick={() => onRemove(item.id)}
                                    className="text-gray-600 hover:text-red-500 font-bold px-2 text-lg transition-colors"
                                    title="Eliminar item"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-auto pt-6 border-t border-dashed border-gray-800">
                <div className="flex justify-between items-end mb-6">
                    <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Total a pagar</span>
                    <span className="text-3xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] font-mono">
                        ${total.toLocaleString()}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => onCheckout('EFECTIVO')}
                        disabled={items.length === 0}
                        className={`py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex flex-col items-center justify-center gap-1 uppercase tracking-wider
                            ${items.length === 0
                            ? 'bg-gray-900 text-gray-700 cursor-not-allowed border border-gray-800'
                            : 'bg-[#39FF14] hover:bg-green-400 text-black shadow-[#39FF14]/20 hover:shadow-[#39FF14]/50 hover:-translate-y-1'
                        }`}
                    >
                        <span>💵 Efectivo</span>
                    </button>

                    <button
                        onClick={() => onCheckout('TARJETA')}
                        disabled={items.length === 0}
                        className={`py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex flex-col items-center justify-center gap-1 uppercase tracking-wider
                            ${items.length === 0
                            ? 'bg-gray-900 text-gray-700 cursor-not-allowed border border-gray-800'
                            : 'bg-[#1E90FF] hover:bg-blue-400 text-white shadow-[#1E90FF]/20 hover:shadow-[#1E90FF]/50 hover:-translate-y-1'
                        }`}
                    >
                        <span>💳 Tarjeta</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;