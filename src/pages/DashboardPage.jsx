import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/molecules/ProductCard';
import Cart from '../components/organisms/Card';
import Navbar from '../components/organisms/Navbar';
import ReceiptModal from '../components/organisms/ReceiptModal';
import Input from '../components/atoms/Input';
import Select from '../components/atoms/Select';

const DashboardPage = () => {
    // --- ESTADOS DE DATOS ---
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [lastSale, setLastSale] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);

    // --- ESTADOS DE FILTROS ---
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        priceRange: ''
    });

    const navigate = useNavigate();

    // Lógica Admin
    const checkAdmin = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
            const parts = token.split('.');
            return JSON.parse(atob(parts[1])).role === 'admin';
        } catch (e) { return false; }
    };
    const isAdmin = checkAdmin();

    // --- CARGA INICIAL ---
    const cargarProductos = async () => {
        try {
            const { data } = await api.get('/productos');
            setProductos(data);
            setProductosFiltrados(data);
        } catch (error) {
            if (error.response?.status === 401) navigate('/');
        }
    };

    useEffect(() => { cargarProductos(); }, []);

    // --- LÓGICA DE FILTRADO (EFECTO) ---
    useEffect(() => {
        let resultado = productos;

        // 1. Filtro por Búsqueda (Nombre)
        if (filters.search) {
            const term = filters.search.toLowerCase();
            resultado = resultado.filter(p =>
                p.nombre.toLowerCase().includes(term)
            );
        }

        // 2. Filtro por Categoría
        if (filters.category && filters.category !== 'Todas') {
            resultado = resultado.filter(p => p.categoria === filters.category);
        }

        // 3. Filtro por Precio
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            // Si es "500000+" el max será undefined o NaN, manejamos eso
            if (filters.priceRange.includes('+')) {
                const minVal = parseInt(filters.priceRange);
                resultado = resultado.filter(p => parseFloat(p.precio) >= minVal);
            } else {
                resultado = resultado.filter(p => {
                    const precio = parseFloat(p.precio);
                    return precio >= min && precio <= max;
                });
            }
        }

        setProductosFiltrados(resultado);
    }, [filters, productos]); // Se ejecuta cada vez que cambian los filtros o la lista base

    // --- HANDLERS DE FILTROS ---
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Opciones para Selects
    const categoriasUnicas = ['Todas', ...new Set(productos.map(p => p.categoria || 'Otros'))];
    const categoryOptions = categoriasUnicas.map(cat => ({ value: cat, label: cat }));

    const priceOptions = [
        { value: '', label: 'Todos los precios' },
        { value: '0-25000', label: '$0 - $25.000' },
        { value: '25000-50000', label: '$25.000 - $50.000' },
        { value: '50000-100000', label: '$50.000 - $100.000' },
        { value: '100000-500000', label: '$100.000 - $500.000' },
        { value: '500000+', label: '$500.000+' }
    ];

    // --- LÓGICA CARRITO ---
    const agregar = (prod) => {
        setCarrito(prev => {
            const existe = prev.find(item => item.id === prod.id);
            if (existe) {
                if (existe.cantidad >= prod.stock) return prev;
                return prev.map(item => item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item);
            }
            return [...prev, { ...prod, cantidad: 1 }];
        });
    };

    const quitar = (id) => setCarrito(prev => prev.filter(item => item.id !== id));

    const finalizarVenta = async (metodoPago) => {
        if (carrito.length === 0) return;
        const datosVenta = {
            detalles: carrito.map(item => ({ productoId: item.id, cantidad: item.cantidad })),
            metodoPago
        };
        try {
            const response = await api.post('/boletas', datosVenta);
            setLastSale({ ...response.data, metodoPago, items: [...carrito] });
            setShowReceipt(true);
            setCarrito([]);
            cargarProductos(); // Recargar stock
        } catch (error) {
            alert('❌ Error: ' + (error.response?.data?.message || 'Error desconocido'));
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col text-white">
            <Navbar />
            <ReceiptModal isOpen={showReceipt} onClose={() => setShowReceipt(false)} saleData={lastSale} />

            <div className="container mx-auto p-6 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* COLUMNA IZQUIERDA: CATÁLOGO */}
                    <div className="lg:col-span-8">

                        {/* PANEL DE FILTROS (Atomic Design) */}
                        <div className="mb-8 bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-lg">
                            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2 font-orbitron">
                                <span className="text-[#39FF14]">///</span> CATÁLOGO
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input
                                    placeholder="Buscar producto..."
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                />

                                <Select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    options={[{ value: '', label: 'Todas las Categorías' }, ...categoryOptions.filter(o => o.value !== 'Todas')]}
                                />

                                <Select
                                    name="priceRange"
                                    value={filters.priceRange}
                                    onChange={handleFilterChange}
                                    options={priceOptions}
                                />
                            </div>
                        </div>

                        {/* Grid de Productos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {productosFiltrados.map(prod => (
                                <ProductCard
                                    key={prod.id}
                                    producto={prod}
                                    onAddToCart={agregar}
                                    isAdmin={isAdmin}
                                    onDelete={async (id) => {
                                        if(confirm('¿Eliminar?')) {
                                            await api.delete(`/productos/${id}`);
                                            cargarProductos();
                                        }
                                    }}
                                />
                            ))}
                        </div>

                        {productosFiltrados.length === 0 && (
                            <div className="text-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-xl mt-4">
                                <p className="text-4xl mb-2">👾</p>
                                <p className="font-orbitron">No se encontraron productos con estos filtros.</p>
                                <button
                                    onClick={() => setFilters({ search: '', category: '', priceRange: '' })}
                                    className="mt-4 text-[#1E90FF] hover:underline cursor-pointer"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        )}
                    </div>

                    {/* COLUMNA DERECHA: CARRITO (Sticky) */}
                    <div className="lg:col-span-4 sticky top-24">
                        <div className="bg-[#111] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden h-[calc(100vh-8rem)]">
                            <Cart
                                items={carrito}
                                onRemove={quitar}
                                onCheckout={finalizarVenta}
                                total={carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer flotante */}
            <a
                href="https://wa.me/56912345678"
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform z-50 flex items-center gap-2 font-bold"
            >
                <span>💬 Soporte</span>
            </a>
        </div>
    );
};

export default DashboardPage;