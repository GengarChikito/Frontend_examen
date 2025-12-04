import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/molecules/ProductCard';
import Cart from '../components/organisms/Card';
import Navbar from '../components/organisms/Navbar';
import ReceiptModal from '../components/organisms/ReceiptModal';

const DashboardPage = () => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastSale, setLastSale] = useState(null);
    const navigate = useNavigate();

    // 1. Lógica SEGURA para detectar Admin
    const checkAdmin = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
            // Dividimos el token y decodificamos la parte del payload (índice 1)
            const parts = token.split('.');
            if (parts.length < 2) return false;

            const payload = JSON.parse(atob(parts[1]));
            return payload.role === 'admin';
        } catch (e) {
            console.error('Error decodificando token:', e);
            return false;
        }
    };

    const isAdmin = checkAdmin();

    const cargarProductos = async () => {
        try {
            const { data } = await api.get('/productos');
            setProductos(data);
        } catch (error) {
            if (error.response?.status === 401) navigate('/');
        }
    };

    useEffect(() => { cargarProductos(); }, []);

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

    const quitar = (id) => {
        setCarrito(prev => prev.filter(item => item.id !== id));
    };

    const finalizarVenta = async (metodoPago) => {
        if (carrito.length === 0) return;

        const datosVenta = {
            detalles: carrito.map(item => ({
                productoId: item.id,
                cantidad: item.cantidad
            })),
            metodoPago: metodoPago
        };

        try {
            const response = await api.post('/boletas', datosVenta);
            const datosBoleta = {
                ...response.data,
                metodoPago,
                items: [...carrito]
            };
            setLastSale(datosBoleta);
            setShowReceipt(true);
            setCarrito([]);
            cargarProductos();
        } catch (error) {
            alert('❌ Error: ' + (error.response?.data?.message || 'Revisa el stock'));
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await api.delete(`/productos/${id}`);
            alert('Producto eliminado');
            cargarProductos();
        } catch (error) {
            alert('Error al eliminar');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <ReceiptModal
                isOpen={showReceipt}
                onClose={() => setShowReceipt(false)}
                saleData={lastSale}
            />

            <div className="container mx-auto p-6 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Catálogo de Productos</h2>
                            <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-sm font-semibold">
                                {productos.length} Disponibles
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {productos.map(prod => (
                                <ProductCard
                                    key={prod.id}
                                    producto={prod}
                                    onAddToCart={agregar}
                                    isAdmin={isAdmin} // Pasamos la prop calculada
                                    onDelete={handleDeleteProduct}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4 sticky top-24">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden h-[calc(100vh-8rem)]">
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
        </div>
    );
};

export default DashboardPage;