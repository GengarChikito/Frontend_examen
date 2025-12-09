import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Atomic Design Components
import ProductCard from '../components/molecules/ProductCard';
import Cart from '../components/organisms/Card'; // Asumo que este es el componente del carrito lateral
import Navbar from '../components/organisms/Navbar';
import ReceiptModal from '../components/organisms/ReceiptModal';
import Input from '../components/atoms/Input';
import Select from '../components/atoms/Select';

const DashboardPage = () => {
    // --- ESTADOS ---
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [lastSale, setLastSale] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);

    // --- FILTROS ---
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        priceRange: ''
    });

    const navigate = useNavigate();

    // --- LÓGICA ADMIN (JWT PARSING) ---
    const isAdmin = React.useMemo(() => {
        const token = localStorage.getItem('token'); // O access_token según tu auth
        if (!token) return false;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
            return JSON.parse(jsonPayload).role === 'admin';
        } catch (e) {
            return false;
        }
    }, []);

    // --- CARGA INICIAL ---
    const cargarProductos = async () => {
        try {
            const { data } = await api.get('/productos');
            setProductos(data);
            setProductosFiltrados(data);
        } catch (error) {
            console.error('Error cargando productos:', error);
            if (error.response?.status === 401) navigate('/login');
        }
    };

    useEffect(() => { cargarProductos(); }, [navigate]);

    // --- LÓGICA DE FILTRADO ---
    useEffect(() => {
        let resultado = [...productos];

        // 1. Búsqueda por nombre
        if (filters.search) {
            const term = filters.search.toLowerCase();
            resultado = resultado.filter(p => p.nombre.toLowerCase().includes(term));
        }

        // 2. Categoría
        if (filters.category && filters.category !== 'Todas') {
            resultado = resultado.filter(p => p.categoria === filters.category);
        }

        // 3. Rango de Precio (Lógica corregida)
        if (filters.priceRange) {
            if (filters.priceRange.includes('+')) {
                // Caso "500000+"
                const min = parseInt(filters.priceRange);
                resultado = resultado.filter(p => parseFloat(p.precio) >= min);
            } else {
                // Caso "0-25000"
                const [min, max] = filters.priceRange.split('-').map(Number);
                resultado = resultado.filter(p => {
                    const precio = parseFloat(p.precio);
                    return precio >= min && precio <= max;
                });
            }
        }

        setProductosFiltrados(resultado);
    }, [filters, productos]);

    // --- HANDLERS ---
    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const agregarAlCarrito = (prod) => {
        setCarrito(prev => {
            const itemExistente = prev.find(item => item.id === prod.id);
            if (itemExistente) {
                if (itemExistente.cantidad >= prod.stock) return prev; // Validar stock máximo
                return prev.map(item =>
                    item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            return [...prev, { ...prod, cantidad: 1 }];
        });
    };

    const quitarDelCarrito = (id) => {
        setCarrito(prev => prev.filter(item => item.id !== id));
    };

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
            setCarrito([]); // Limpiar carrito
            cargarProductos(); // Recargar stock actualizado
        } catch (error) {
            alert('❌ Error al procesar venta: ' + (error.response?.data?.message || 'Intente nuevamente'));
        }
    };

    const eliminarProducto = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await api.delete(`/productos/${id}`);
                cargarProductos();
            } catch (error) {
                alert('No se pudo eliminar el producto.');
            }
        }
    };

    // --- OPCIONES PARA SELECTS ---
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

    return (
        <div className="min-h-screen bg-[#000000] flex flex-col text-white font-roboto">
            <Navbar />
            <ReceiptModal isOpen={showReceipt} onClose={() => setShowReceipt(false)} saleData={lastSale} />

            <div className="container mx-auto p-6 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* --- COLUMNA IZQUIERDA: CATÁLOGO --- */}
                    <div className="lg:col-span-8">

                        {/* Panel de Filtros */}
                        <div className="mb-8 bg-[#1a1a1a] p-6 rounded-2xl border border-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.1)]">
                            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2 font-orbitron tracking-wider">
                                <span className="text-[#1E90FF]">///</span> CATÁLOGO DE MISIONES
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input
                                    placeholder="Buscar Item..."
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
                                    onAddToCart={agregarAlCarrito}
                                    isAdmin={isAdmin}
                                    onDelete={() => eliminarProducto(prod.id)}
                                />
                            ))}
                        </div>

                        {/* Estado Vacío */}
                        {productosFiltrados.length === 0 && (
                            <div className="text-center py-20 text-gray-500 border border-dashed border-[#333] rounded-xl mt-4 bg-[#111]">
                                <p className="text-4xl mb-2">👾</p>
                                <p className="font-orbitron">GAME OVER: No se encontraron items.</p>
                                <button
                                    onClick={() => setFilters({ search: '', category: '', priceRange: '' })}
                                    className="mt-4 text-[#1E90FF] hover:text-[#39FF14] transition-colors cursor-pointer font-bold"
                                >
                                    REINICIAR BÚSQUEDA
                                </button>
                            </div>
                        )}
                    </div>

                    {/* --- COLUMNA DERECHA: CARRITO --- */}
                    <div className="lg:col-span-4 sticky top-24">
                        <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl border border-[#1E90FF] overflow-hidden h-[calc(100vh-8rem)]">
                            <Cart
                                items={carrito}
                                onRemove={quitarDelCarrito}
                                onCheckout={finalizarVenta}
                                // Si tu componente Cart calcula descuento internamente, este total es referencial
                                total={carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Soporte Flotante */}
            <a
                href="https://wa.me/56912345678"
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.6)] hover:scale-110 transition-transform z-50 flex items-center gap-2 font-bold border-2 border-white"
            >
                <span>💬 Soporte</span>
            </a>
        </div>
    );
};

export default DashboardPage;