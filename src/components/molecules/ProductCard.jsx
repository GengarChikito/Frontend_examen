import React from 'react';

const ProductCard = ({ producto, onAddToCart, onDelete, isAdmin }) => {
    const sinStock = producto.stock <= 0;

    return (
        <div className="group bg-[#111] rounded-2xl border border-gray-800 shadow-lg hover:shadow-[#1E90FF]/20 hover:border-[#1E90FF]/50 transition-all duration-300 flex flex-col h-full relative overflow-hidden">

            {/* Badge de Categoría */}
            <div className="absolute top-3 left-3 z-10">
                <span className="bg-black/80 backdrop-blur text-[#1E90FF] text-[10px] font-bold px-2 py-1 rounded border border-blue-900/50 uppercase">
                    {producto.categoria || 'Gamer'}
                </span>
            </div>

            {/* Stock / Eliminar */}
            <div className="absolute top-3 right-3 z-10 flex gap-2">
                {isAdmin && (
                    <button onClick={() => onDelete(producto.id)} className="bg-red-500/90 text-white p-1.5 rounded-full hover:scale-110 transition-transform">
                        🗑️
                    </button>
                )}
                <span className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md border ${
                    sinStock ? 'bg-red-900/80 text-white border-red-500' : 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/30'
                }`}>
                    {sinStock ? 'AGOTADO' : `STOCK: ${producto.stock}`}
                </span>
            </div>

            {/* Imagen con efecto Zoom */}
            <div className="h-48 w-full overflow-hidden bg-gray-900 relative">
                {producto.imagen ? (
                    <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl grayscale">🎮</div>
                )}
                {/* Gradiente inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#111] to-transparent"></div>
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col flex-grow relative">
                <div className="flex-grow">
                    <h3 className="font-bold text-lg text-white mb-1 leading-tight group-hover:text-[#1E90FF] transition-colors font-orbitron">
                        {producto.nombre}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-2 mb-2">
                        {producto.descripcion || 'Sin descripción disponible.'}
                    </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase font-bold">Precio</span>
                        <span className="text-xl font-black text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                            ${parseInt(producto.precio).toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={() => onAddToCart(producto)}
                        disabled={sinStock}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${
                            sinStock
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                : 'bg-[#1E90FF] hover:bg-blue-600 text-white shadow-blue-500/40 hover:shadow-blue-500/60'
                        }`}
                    >
                        <span className="text-2xl font-bold">+</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;