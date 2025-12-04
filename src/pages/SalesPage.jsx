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
                nombre: detalle.producto?.nombre || 'Producto eliminado',
                precio: detalle.producto?.precio || 0,
                cantidad: detalle.cantidad
            }))
        };
        setSelectedSale(saleData);
        setIsModalOpen(true);
    };

    // 1. CÁLCULO DE INGRESOS TOTALES
    const totalIngresos = boletas.reduce((acc, boleta) => acc + Number(boleta.total), 0);

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <Navbar />

            <ReceiptModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                saleData={selectedSale}
            />

            <div className="container mx-auto p-6">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h2 className="text-3xl font-bold text-gray-800">Historial de Ventas</h2>

                    {/* 2. TARJETA DE RESUMEN DE INGRESOS */}
                    <div className="bg-white px-6 py-4 rounded-xl shadow-md border border-slate-100 flex items-center gap-4 animate-in fade-in slide-in-from-right duration-500">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                            <span className="text-2xl">💰</span>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Ingresos Totales</p>
                            <p className="text-2xl font-extrabold text-slate-800">
                                ${totalIngresos.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">ID</th>
                            <th className="p-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Fecha</th>
                            <th className="p-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Vendedor</th>
                            <th className="p-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Pago</th>
                            <th className="p-4 font-semibold text-slate-600 text-xs uppercase tracking-wider text-right">Total</th>
                            <th className="p-4 font-semibold text-slate-600 text-xs uppercase tracking-wider text-center">Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {boletas.map((boleta) => (
                            <tr key={boleta.id} className="hover:bg-indigo-50/30 transition-colors group">
                                <td className="p-4 font-bold text-indigo-600">
                                    #{boleta.id.toString().padStart(4, '0')}
                                </td>
                                <td className="p-4 text-slate-600 text-sm">
                                    {new Date(boleta.fecha).toLocaleDateString()} <br/>
                                    <span className="text-xs text-slate-400">{new Date(boleta.fecha).toLocaleTimeString()}</span>
                                </td>
                                <td className="p-4 text-slate-700 font-medium text-sm">
                                    {boleta.usuario?.nombre || 'Desconocido'}
                                </td>
                                <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border uppercase ${
                        boleta.metodoPago === 'TARJETA'
                            ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}>
                        {boleta.metodoPago || 'EFECTIVO'}
                    </span>
                                </td>
                                <td className="p-4 text-right font-bold text-slate-800">
                                    ${parseInt(boleta.total).toLocaleString()}
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => handleViewReceipt(boleta)}
                                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition-all transform active:scale-95 group-hover:bg-indigo-50"
                                        title="Ver Boleta Detallada"
                                    >
                                        👁️
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {boletas.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-12 text-center text-slate-400">
                                    <span className="text-4xl block mb-2">📭</span>
                                    No hay ventas registradas aún.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesPage;