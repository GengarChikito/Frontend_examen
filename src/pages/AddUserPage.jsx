import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/organisms/Navbar';

const AddProductPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        categoria: 'Accesorios', // Valor por defecto
        descripcion: '',
        precio: '',
        stock: '',
        imagen: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            precio: parseFloat(formData.precio),
            stock: parseInt(formData.stock)
        };

        try {
            await api.post('/productos', payload);
            alert('✅ Producto agregado al inventario');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('❌ Error al guardar');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-10">
            <Navbar />

            <div className="container mx-auto p-6 flex justify-center">
                <div className="w-full max-w-lg bg-[#111] rounded-2xl shadow-xl border border-gray-800 p-8 mt-10">
                    <h2 className="text-2xl font-black font-orbitron text-white mb-6 text-center border-b border-gray-800 pb-4">
                        AGREGAR PRODUCTO
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                            <input type="text" name="nombre" required className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:border-[#1E90FF] outline-none" placeholder="Ej: Teclado Mecánico" onChange={handleChange} />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoría</label>
                            <select name="categoria" className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:border-[#1E90FF] outline-none" onChange={handleChange}>
                                <option>Accesorios</option>
                                <option>Consolas</option>
                                <option>Juegos de Mesa</option>
                                <option>Sillas Gamers</option>
                                <option>Computadores Gamers</option>
                                <option>Mouse</option>
                                <option>Mousepad</option>
                                <option>Poleras Personalizadas</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
                            <textarea name="descripcion" rows="2" className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:border-[#1E90FF] outline-none" placeholder="Detalles del producto..." onChange={handleChange}></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Precio</label>
                                <input type="number" name="precio" required className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:border-[#1E90FF] outline-none" placeholder="15000" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
                                <input type="number" name="stock" required className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:border-[#1E90FF] outline-none" placeholder="10" onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Imagen (URL)</label>
                            <input type="url" name="imagen" className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:border-[#1E90FF] outline-none" placeholder="https://..." onChange={handleChange} />
                        </div>

                        <button type="submit" className="w-full py-4 rounded-xl bg-[#39FF14] hover:bg-green-400 text-black font-black uppercase tracking-widest shadow-lg shadow-green-900/50 transition-transform hover:-translate-y-1 mt-4">
                            GUARDAR
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;