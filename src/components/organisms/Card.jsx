import React, { useState, useEffect } from 'react';
import { DeleteOutlined, ShoppingCartOutlined, WalletOutlined, CreditCardOutlined } from '@ant-design/icons';


const Cart = ({ items, onRemove, onCheckout }) => {

    // 2. NUEVA LÓGICA: Leemos el estado Duoc directamente del token guardado
    const [esEstudianteDuoc, setEsEstudianteDuoc] = useState(false);

    useEffect(() => {
        const verificarDuoc = () => {
            // Revisa si en tu localStorage se llama 'token' o 'access_token'
            const token = localStorage.getItem('token') || localStorage.getItem('access_token');

            if (!token) return;

            try {
                // Decodificamos el JWT manualmente (parte 2 del token)
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const payload = JSON.parse(jsonPayload);

                // Si el backend guardó este dato en el token, lo usamos:
                if (payload.esEstudianteDuoc) {
                    setEsEstudianteDuoc(true);
                }
            } catch (error) {
                console.error("Error al leer el token en el carrito", error);
            }
        };

        verificarDuoc();
    }, [items]); // Se ejecuta al cargar o cambiar items

    // 3. Cálculos matemáticos usando la variable local
    const subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    // Aplicar descuento solo si detectamos que es estudiante
    const descuento = esEstudianteDuoc ? Math.round(subtotal * 0.2) : 0;
    const totalFinal = subtotal - descuento;

    return (
        <div className="flex flex-col h-full bg-[#050505] text-white p-4 font-roboto">

            {/* ENCABEZADO */}
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-4">
                <h2 className="text-xl font-black font-orbitron flex items-center gap-2">
                    TU <span className="text-[#39FF14]">LOOT</span>
                    <ShoppingCartOutlined className="text-gray-400"/>
                </h2>
                <span className="bg-[#39FF14] text-black text-xs font-bold px-2 py-1 rounded">
                    {items.length} ITEMS
                </span>
            </div>

            {/* LISTA DE ITEMS */}
            <div className="flex-grow overflow-y-auto mb-4 space-y-3 pr-2 custom-scrollbar">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                        <span className="text-4xl mb-2">🎒</span>
                        <p className="font-orbitron text-sm">INVENTARIO VACÍO</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-[#111] p-3 rounded border border-gray-800 hover:border-[#39FF14] transition-colors group">
                            <div className="flex items-center gap-3">
                                <img src={item.imagen || 'https://via.placeholder.com/40'} alt="item" className="w-10 h-10 object-cover rounded bg-gray-800"/>
                                <div>
                                    <p className="font-bold text-sm text-gray-200">{item.nombre}</p>
                                    <p className="text-xs text-[#1E90FF]">${parseInt(item.precio).toLocaleString('es-CL')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-xs">x{item.cantidad}</span>
                                <button
                                    onClick={() => onRemove(item.id)}
                                    className="text-gray-600 hover:text-red-500 transition-colors"
                                >
                                    <DeleteOutlined />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* SECCIÓN DE TOTALES */}
            <div className="border-t border-dashed border-gray-700 pt-4 mb-4">
                {items.length > 0 && (
                    <div className="space-y-1 mb-3 text-sm">
                        <div className="flex justify-between text-gray-400">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString('es-CL')}</span>
                        </div>

                        {/* DESCUENTO VISIBLE */}
                        {esEstudianteDuoc && (
                            <div className="flex justify-between text-[#39FF14]">
                                <span className="flex items-center gap-1">
                                    🎓 Dcto. Duoc (20%)
                                </span>
                                <span>- ${descuento.toLocaleString('es-CL')}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-between items-end">
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total a Pagar</span>
                    <span className="text-3xl font-black font-orbitron text-white">
                        ${totalFinal.toLocaleString('es-CL')}
                    </span>
                </div>
            </div>

            {/* BOTONES */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => onCheckout('EFECTIVO')}
                    disabled={items.length === 0}
                    className="flex items-center justify-center gap-2 py-3 rounded bg-[#111] border border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF] hover:text-white transition-all font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <WalletOutlined /> EFECTIVO
                </button>
                <button
                    onClick={() => onCheckout('TARJETA')}
                    disabled={items.length === 0}
                    className="flex items-center justify-center gap-2 py-3 rounded bg-[#111] border border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF] hover:text-white transition-all font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <CreditCardOutlined /> TARJETA
                </button>
            </div>
        </div>
    );
};

export default Cart;