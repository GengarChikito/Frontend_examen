import React from 'react';

const ProductCard = ({ producto, onAddToCart, onDelete, isAdmin }) => {
    const sinStock = producto.stock <= 0;

    return (
        <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col h-full relative overflow-hidden">

            {/* Indicador de Stock */}
            <div className="absolute top-3 right-3 z-10 flex gap-2">
                {/* 🔒 BOTÓN DE ELIMINAR (Solo Admin) */}
                {isAdmin && (
                    <button
                        onClick={() => onDelete(producto.id)}
                        className="bg-white/90 text-red-500 p-1.5 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-all backdrop-blur-md"
                        title="Eliminar producto (Solo Admin)"
                    >
                        🗑️
                    </button>
                )}

                <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-md flex items-center ${
                    sinStock
                        ? 'bg-red-500/90 text-white'
                        : 'bg-white/90 text-emerald-600'
                }`}>
                    {sinStock ? 'Agotado' : `${producto.stock} un.`}
                </span>
            </div>

            {/* IMAGEN */}
            <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                {producto.imagen ? (
                    <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                )}
            </div>

            {/* CONTENIDO */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="font-bold text-lg text-slate-800 mb-1 leading-tight">
                        {producto.nombre}
                    </h3>
                    <p className="text-slate-400 text-xs font-medium">
                        COD: #{producto.id.toString().padStart(4, '0')}
                    </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium uppercase">Precio</span>
                        <span className="text-xl font-extrabold text-indigo-600">
                            ${parseInt(producto.precio).toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={() => onAddToCart(producto)}
                        disabled={sinStock}
                        className={`
                            w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95
                            ${sinStock
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:-translate-y-1 shadow-indigo-500/30'
                        }
                        `}
                    >
                        <span className="text-2xl font-light pb-1">+</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;