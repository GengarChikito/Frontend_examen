import React from 'react';

const ReceiptModal = ({ isOpen, onClose, saleData }) => {
    if (!isOpen || !saleData) return null;

    const { id, fecha, total, metodoPago, items } = saleData;

    // Cálculos matemáticos (IVA Chile 19%)
    const totalNum = parseInt(total);
    const neto = Math.round(totalNum / 1.19);
    const iva = totalNum - neto;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl overflow-hidden font-mono text-sm relative">

                {/* Cabecera Tipo Ticket */}
                <div className="bg-slate-800 text-white p-6 text-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                        🧾
                    </div>
                    <h2 className="text-xl font-bold uppercase tracking-widest">Boleta Electrónica</h2>
                    <p className="text-slate-400 text-xs mt-1">TiendaApp S.A.</p>
                </div>

                {/* Cuerpo del Ticket */}
                <div className="p-6 bg-white relative">
                    {/* Decoración de dientes de sierra (CSS puro) */}
                    <div className="absolute top-0 left-0 right-0 h-4 -mt-2 bg-transparent"
                         style={{
                             backgroundImage: 'linear-gradient(45deg, white 25%, transparent 25%), linear-gradient(-45deg, white 25%, transparent 25%)',
                             backgroundSize: '16px 16px'
                         }}
                    />

                    {/* Info General */}
                    <div className="flex justify-between mb-4 border-b border-dashed border-slate-300 pb-4">
                        <div className="text-slate-500">
                            <p>Folio: <span className="text-slate-800 font-bold">#{id.toString().padStart(6, '0')}</span></p>
                            <p>Fecha: {new Date(fecha).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right text-slate-500">
                            <p>Hora: {new Date(fecha).toLocaleTimeString()}</p>
                            <p className="font-bold text-indigo-600">{metodoPago}</p>
                        </div>
                    </div>

                    {/* Lista de Productos */}
                    <div className="space-y-2 mb-4 border-b border-dashed border-slate-300 pb-4">
                        {items.map((item, index) => (
                            <div key={index} className="flex justify-between">
                <span className="text-slate-700">
                  {item.cantidad} x {item.nombre}
                </span>
                                <span className="text-slate-900 font-medium">
                  ${(item.precio * item.cantidad).toLocaleString()}
                </span>
                            </div>
                        ))}
                    </div>

                    {/* Totales Desglosados */}
                    <div className="space-y-1 text-right mb-6">
                        <div className="flex justify-between text-slate-500">
                            <span>Monto Neto:</span>
                            <span>${neto.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>I.V.A (19%):</span>
                            <span>${iva.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-900 font-bold text-lg mt-2 pt-2 border-t border-slate-200">
                            <span>TOTAL:</span>
                            <span>${totalNum.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Mensaje Final */}
                    <div className="text-center text-xs text-slate-400 mt-6">
                        <p>¡Gracias por su compra!</p>
                        <p>Conserve este documento.</p>
                    </div>
                </div>

                {/* Botón Cerrar */}
                <button
                    onClick={onClose}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 font-bold uppercase tracking-wider transition-colors"
                >
                    Cerrar e Imprimir
                </button>
            </div>
        </div>
    );
};

export default ReceiptModal;