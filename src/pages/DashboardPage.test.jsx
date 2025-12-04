import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardPage from './DashboardPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

const { mockGet, mockPost, mockDelete } = vi.hoisted(() => ({
    mockGet: vi.fn(),
    mockPost: vi.fn(),
    mockDelete: vi.fn()
}));

vi.mock('../services/api', () => ({
    default: { get: mockGet, post: mockPost, delete: mockDelete }
}));

const mockProductos = [
    { id: 1, nombre: 'Mouse Gamer', precio: 10000, stock: 5, imagen: '' },
    { id: 2, nombre: 'Teclado Mecánico', precio: 50000, stock: 2, imagen: '' }
];

describe('DashboardPage (Integración)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.alert = vi.fn();
        window.confirm = () => true;
        // Setup por defecto (Admin)
        const tokenPayload = btoa(JSON.stringify({ role: 'admin', nombre: 'Admin' }));
        localStorage.setItem('token', `header.${tokenPayload}.firm`);
    });

    it('debe cargar productos y permitir agregarlos al carrito', async () => {
        mockGet.mockResolvedValueOnce({ data: mockProductos });
        render(<BrowserRouter><DashboardPage /></BrowserRouter>);

        await waitFor(() => {
            expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
        });

        const addButtons = screen.getAllByText('+');
        fireEvent.click(addButtons[0]);

        const cartTitle = screen.getByText('🛒 Tu Carrito');
        const cartSection = cartTitle.closest('div').parentElement;
        expect(cartSection).toHaveTextContent('Mouse Gamer');
    });

    it('debe realizar una venta correctamente', async () => {
        mockGet.mockResolvedValueOnce({ data: mockProductos });
        mockPost.mockResolvedValueOnce({
            data: { id: 999, fecha: new Date().toISOString(), total: 10000 }
        });

        render(<BrowserRouter><DashboardPage /></BrowserRouter>);
        await waitFor(() => screen.getByText('Mouse Gamer'));

        const addBtn = screen.getAllByText('+')[0];
        fireEvent.click(addBtn);

        const payBtn = screen.getByText(/Efectivo/i);
        fireEvent.click(payBtn);

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/boletas', expect.objectContaining({
                metodoPago: 'EFECTIVO'
            }));
            expect(screen.getByText('Boleta Electrónica')).toBeInTheDocument();
        });
    });

    it('debe permitir eliminar un producto si es admin', async () => {
        const tokenPayload = btoa(JSON.stringify({ role: 'admin', nombre: 'Admin' }));
        localStorage.setItem('token', `header.${tokenPayload}.firm`);

        mockGet.mockResolvedValueOnce({ data: mockProductos });
        mockDelete.mockResolvedValueOnce({});

        render(<BrowserRouter><DashboardPage /></BrowserRouter>);

        await waitFor(() => {
            expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
        });

        const deleteBtns = screen.getAllByTitle('Eliminar producto (Solo Admin)');
        expect(deleteBtns.length).toBeGreaterThan(0);

        fireEvent.click(deleteBtns[0]);

        await waitFor(() => {
            expect(mockDelete).toHaveBeenCalledWith('/productos/1');
        });
    });

    //  NUEVO TEST DE LÓGICA DE NEGOCIO
    it('no debe permitir agregar más unidades que el stock disponible', async () => {
        // Producto con stock limitado de 2
        const stockLimitProduct = [{ id: 3, nombre: 'Producto Escaso', precio: 100, stock: 2, imagen: '' }];
        mockGet.mockResolvedValueOnce({ data: stockLimitProduct });

        render(<BrowserRouter><DashboardPage /></BrowserRouter>);
        await waitFor(() => screen.getByText('Producto Escaso'));

        const addBtn = screen.getAllByText('+')[0];


        fireEvent.click(addBtn); // 1
        fireEvent.click(addBtn); // 2
        fireEvent.click(addBtn);


        const quantityInCart = screen.getByText('2', { selector: '.text-indigo-600' });
        expect(quantityInCart).toBeInTheDocument();


        expect(screen.queryByText('3', { selector: '.text-indigo-600' })).not.toBeInTheDocument();
    });
});