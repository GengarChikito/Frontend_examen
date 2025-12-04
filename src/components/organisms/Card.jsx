import React from 'react';

const Cart = ({ items, onRemove, onCheckout, total }) => {
    return (
        <div className="bg-white p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">🛒 Tu Carrito</h2>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                    {items.length} items
                </span>
            </div>

            {/* ... (La sección de items se mantiene igual) ... */}
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-grow text-slate-400 py-10">
                    <span className="text-4xl mb-2">🛍️</span>
                    <p>El carrito está vacío</p>
                </div>
            ) : (
                <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                            <div>
                                <h4 className="font-bold text-slate-700 text-sm">{item.nombre}</h4>
                                <div className="text-xs text-slate-500 mt-1">
                                    <span className="font-semibold text-indigo-600">{item.cantidad}</span> x ${item.precio.toLocaleString()}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-700 text-sm">
                                    ${(item.cantidad * item.precio).toLocaleString()}
                                </span>
                                <button onClick={() => onRemove(item.id)} className="text-red-500 font-bold px-2">✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-auto pt-6 border-t border-dashed border-slate-200">
                <div className="flex justify-between items-end mb-6">
                    <span className="text-slate-500 font-medium">Total a pagar</span>
                    <span className="text-3xl font-extrabold text-slate-800">
                        ${total.toLocaleString()}
                    </span>
                </div>

                {/* 4. AQUÍ CAMBIAMOS EL BOTÓN ÚNICO POR DOS BOTONES */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => onCheckout('EFECTIVO')}
                        disabled={items.length === 0}
                        className={`
                            py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex flex-col items-center justify-center gap-1
                            ${items.length === 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30 hover:-translate-y-1'
                        }
                        `}
                    >
                        <span>💵 Efectivo</span>
                    </button>

                    <button
                        onClick={() => onCheckout('TARJETA')}
                        disabled={items.length === 0}
                        className={`
                            py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex flex-col items-center justify-center gap-1
                            ${items.length === 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30 hover:-translate-y-1'
                        }
                        `}
                    >
                        <span>💳 Tarjeta</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;