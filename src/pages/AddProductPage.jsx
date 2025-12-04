import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/organisms/Navbar';

const AddProductPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        stock: '',
        imagen: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convertir precio y stock a números para el backend
        const payload = {
            ...formData,
            precio: parseFloat(formData.precio),
            stock: parseInt(formData.stock)
        };

        try {
            await api.post('/productos', payload);
            alert('✅ Producto agregado correctamente a la Base de Datos');
            navigate('/dashboard'); // Volver al catálogo
        } catch (error) {
            console.error(error);
            alert('❌ Error: ' + (error.response?.data?.message || 'No tienes permisos de Admin o faltan datos'));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto p-6 flex justify-center">
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mt-10">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">✨ Agregar Nuevo Producto</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Nombre del Producto</label>
                            <input
                                type="text" name="nombre" required
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="Ej: Teclado Gamer"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Precio */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Precio</label>
                                <input
                                    type="number" name="precio" required min="0"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="Ej: 15000"
                                    onChange={handleChange}
                                />
                            </div>
                            {/* Stock */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Stock Inicial</label>
                                <input
                                    type="number" name="stock" required min="0"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="Ej: 10"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* URL Imagen */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">URL de la Imagen</label>
                            <input
                                type="url" name="imagen" required
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="https://..."
                                onChange={handleChange}
                            />
                            <p className="text-xs text-slate-400 mt-1">Copia una URL de imagen de Google o Unsplash.</p>
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1 mt-4"
                        >
                            Guardar Producto
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;