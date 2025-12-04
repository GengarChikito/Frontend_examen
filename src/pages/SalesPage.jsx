import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/organisms/Navbar';
import ReceiptModal from '../components/organisms/ReceiptModal';

const SalesPage = () => {
    const [boletas, setBoletas] = useState([]);
    const [selectedSale, setSelectedSale] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchBoletas = async () => {
            try {
                const { data } = await api.get('/boletas');
                setBoletas(data);
            } catch (error) {
                console.error('Error al cargar boletas', error);
            }
        };
        fetchBoletas();
    }, []);

    const handleViewReceipt = (boleta) => {
        const saleData = {
            ...boleta,
            items: boleta.detalles.map(detalle => ({
                id: detalle.producto?.id, // <--- CAMBIO CRÍTICO: ID necesario para la reseña
                nombre: detalle.producto?.nombre || 'Producto eliminado',
                precio: detalle.producto?.precio || 0,
                cantidad: detalle.cantidad
            }))
        };
        setSelectedSale(saleData);
        setIsModalOpen(true);
    };

    const totalIngresos = boletas.reduce((acc, boleta) => acc + Number(boleta.total), 0);

    return (
        <div className="min-h-screen bg-[#050505] pb-10 text-white">
            <Navbar />
            <ReceiptModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} saleData={selectedSale} />

            <div className="container mx-auto p-6">

                {/* Encabezado */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-800 pb-6">
                    <div>
                        <h2 className="text-3xl font-black font-orbitron text-white flex items-center gap-2">
                            <span className="text-[#1E90FF] animate-pulse">///</span> HISTORIAL DE PARTIDAS
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Registro completo de transacciones</p>
                    </div>

                    <div className="bg-[#111] px-6 py-4 rounded-xl shadow-lg border border-gray-800 flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-[#39FF14]/20 to-green-900/20 text-[#39FF14] rounded-full border border-[#39FF14]/30">
                            <span className="text-2xl">🏆</span>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ingresos Totales</p>
                            <p className="text-2xl font-black text-white font-mono">
                                ${totalIngresos.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabla Gamer */}
                <div className="bg-[#111] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden relative">
                    {/* Efecto de borde superior brillante */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#1E90FF] to-transparent opacity-50"></div>

                    <table className="w-full text-left border-collapse">
                        <thead className="bg-black text-gray-500">
                        <tr>
                            <th className="p-5 font-bold text-xs uppercase tracking-wider border-b border-gray-800">ID</th>
                            <th className="p-5 font-bold text-xs uppercase tracking-wider border-b border-gray-800">Fecha</th>
                            <th className="p-5 font-bold text-xs uppercase tracking-wider border-b border-gray-800">Jugador (Cliente)</th>
                            <th className="p-5 font-bold text-xs uppercase tracking-wider border-b border-gray-800">Modo Pago</th>
                            <th className="p-5 font-bold text-xs uppercase tracking-wider border-b border-gray-800 text-right">Score (Total)</th>
                            <th className="p-5 font-bold text-xs uppercase tracking-wider border-b border-gray-800 text-center">Loot</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                        {boletas.map((boleta) => (
                            <tr key={boleta.id} className="hover:bg-[#1E90FF]/5 transition-colors group">
                                <td className="p-5 font-bold text-[#1E90FF] font-mono">
                                    #{boleta.id.toString().padStart(4, '0')}
                                </td>
                                <td className="p-5 text-gray-300 text-sm">
                                    {new Date(boleta.fecha).toLocaleDateString()}
                                    <span className="text-xs text-gray-600 block mt-0.5">{new Date(boleta.fecha).toLocaleTimeString()}</span>
                                </td>
                                <td className="p-5 text-gray-300 font-medium text-sm flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-400">👤</div>
                                    {boleta.usuario?.nombre || 'Desconocido'}
                                </td>
                                <td className="p-5">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wider ${
                                        boleta.metodoPago === 'TARJETA'
                                            ? 'bg-blue-900/20 text-blue-400 border-blue-800/50'
                                            : 'bg-green-900/20 text-green-400 border-green-800/50'
                                    }`}>
                                        {boleta.metodoPago || 'EFECTIVO'}
                                    </span>
                                </td>
                                <td className="p-5 text-right font-black text-white font-mono">
                                    ${parseInt(boleta.total).toLocaleString()}
                                </td>
                                <td className="p-5 text-center">
                                    <button
                                        onClick={() => handleViewReceipt(boleta)}
                                        className="p-2 rounded-lg bg-black border border-gray-700 text-gray-400 hover:text-[#39FF14] hover:border-[#39FF14] shadow-sm transition-all transform active:scale-95"
                                        title="Ver Detalle"
                                    >
                                        📜
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {boletas.length === 0 && (
                        <div className="p-16 text-center text-gray-600">
                            <span className="text-5xl block mb-4 opacity-20">🕹️</span>
                            <p className="uppercase tracking-widest text-sm">No hay partidas registradas</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesPage;