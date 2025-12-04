import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/molecules/ProductCard';
import Cart from '../components/organisms/Card';
import Navbar from '../components/organisms/Navbar';
import ReceiptModal from '../components/organisms/ReceiptModal';

const DashboardPage = () => {
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]); // Estado para filtros
    const [categoriaActiva, setCategoriaActiva] = useState('Todas'); // Categoría seleccionada

    const [carrito, setCarrito] = useState([]);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastSale, setLastSale] = useState(null);
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

    const cargarProductos = async () => {
        try {
            const { data } = await api.get('/productos');
            setProductos(data);
            setProductosFiltrados(data); // Inicialmente mostramos todos
        } catch (error) {
            if (error.response?.status === 401) navigate('/');
        }
    };

    useEffect(() => { cargarProductos(); }, []);

    // --- LÓGICA DE FILTRADO ---
    const filtrarPorCategoria = (categoria) => {
        setCategoriaActiva(categoria);
        if (categoria === 'Todas') {
            setProductosFiltrados(productos);
        } else {
            setProductosFiltrados(productos.filter(p => p.categoria === categoria));
        }
    };

    // Extraer categorías únicas
    const categorias = ['Todas', ...new Set(productos.map(p => p.categoria || 'Otros'))];

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
                        {/* Encabezado y Filtros */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-white mb-4 flex items-center gap-2">
                                <span className="text-[#39FF14]">///</span> CATÁLOGO
                            </h2>

                            {/* Botones de Filtro */}
                            <div className="flex flex-wrap gap-2">
                                {categorias.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => filtrarPorCategoria(cat)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                                            categoriaActiva === cat
                                                ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-[0_0_10px_#1E90FF]'
                                                : 'bg-black text-gray-400 border-gray-800 hover:border-gray-500 hover:text-white'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
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
                            <div className="text-center py-20 text-gray-500">
                                <p className="text-2xl">👾</p>
                                <p>No se encontraron productos en esta categoría.</p>
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

            {/* Footer flotante con WhatsApp (Soporte) */}
            <a
                href="https://wa.me/56912345678"
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50 flex items-center gap-2 font-bold"
            >
                <span>💬 Soporte</span>
            </a>
        </div>
    );
};

export default DashboardPage;