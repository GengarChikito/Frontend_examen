import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/organisms/Navbar';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Select from '../components/atoms/Select';

const AddProductPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        nombre: '',
        precio: '',
        stock: '',
        categoria: 'Consolas',
        imagen: '',
        descripcion: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/productos', {
                ...form,
                precio: parseInt(form.precio),
                stock: parseInt(form.stock)
            });
            alert('✅ Producto agregado al inventario exitosamente');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('❌ Error al crear producto');
        } finally {
            setLoading(false);
        }
    };

    const categorias = [
        { value: 'Consolas', label: 'Consolas' },
        { value: 'Juegos de Mesa', label: 'Juegos de Mesa' },
        { value: 'Accesorios', label: 'Accesorios' },
        { value: 'Computadores Gamers', label: 'Computadores Gamers' },
        { value: 'Sillas Gamers', label: 'Sillas Gamers' },
        { value: 'Mouse', label: 'Mouse' },
        { value: 'Mousepad', label: 'Mousepad' },
        { value: 'Poleras Personalizadas', label: 'Poleras Personalizadas' },
        { value: 'Polerones Gamers Personalizados', label: 'Polerones Gamers' },
        { value: 'Servicio Técnico', label: 'Servicio Técnico' }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-20">
            <Navbar />
            <div className="container mx-auto p-6 flex justify-center mt-10">
                <div className="w-full max-w-2xl bg-[#111] border-2 border-[#1E90FF] rounded-2xl p-8 shadow-[0_0_30px_rgba(30,144,255,0.15)] relative overflow-hidden">

                    {/* Efecto decorativo */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#1E90FF] opacity-10 blur-[80px] rounded-full pointer-events-none"></div>

                    <h2 className="text-3xl font-black font-orbitron text-white mb-8 text-center">
                        NUEVO <span className="text-[#39FF14]">ITEM</span>
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input label="Nombre del Producto" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: PS5 Pro" />

                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Precio ($)" type="number" name="precio" value={form.precio} onChange={handleChange} placeholder="99990" />
                            <Input label="Stock Inicial" type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="10" />
                        </div>

                        <Select label="Categoría" name="categoria" value={form.categoria} onChange={handleChange} options={categorias} />

                        <Input label="URL Imagen" name="imagen" value={form.imagen} onChange={handleChange} placeholder="https://..." />

                        <div>
                            <label className="block text-white text-sm font-bold mb-2 font-roboto uppercase tracking-wider">Descripción</label>
                            <textarea
                                name="descripcion"
                                rows="3"
                                value={form.descripcion}
                                onChange={handleChange}
                                className="w-full bg-black border border-[#1E90FF] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] transition-all font-roboto resize-none"
                                placeholder="Detalles del producto..."
                            ></textarea>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" variant="gamer-green" className="w-full py-4 text-lg" disabled={loading}>
                                {loading ? 'Procesando...' : 'AGREGAR AL CATÁLOGO'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;