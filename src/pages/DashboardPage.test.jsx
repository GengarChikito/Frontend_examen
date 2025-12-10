import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import api from '../services/api';

// Mocks
vi.mock('../services/api');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => vi.fn() };
});
window.alert = vi.fn();
window.confirm = vi.fn(() => true);

const mockProducts = [
    { id: 1, nombre: 'PS5', precio: 500000, stock: 5, categoria: 'Consolas' },
    { id: 2, nombre: 'Mouse Gamer', precio: 20000, stock: 10, categoria: 'Accesorios' }
];

describe('DashboardPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        api.get.mockResolvedValue({ data: mockProducts });

        // Mock de un token válido para evitar errores en Cart.jsx al decodificar
        // Esto simula un payload { sub: 1, role: 'cliente' }
        const dummyToken = `header.${btoa(JSON.stringify({ sub: 1, role: 'cliente' }))}.signature`;
        localStorage.setItem('token', dummyToken);
    });

    const renderComponent = () => render(
        <BrowserRouter>
            <DashboardPage />
        </BrowserRouter>
    );

    it('debería cargar y mostrar los productos', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('PS5')).toBeInTheDocument();
            expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
        });
    });

    it('debería filtrar productos por búsqueda', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('PS5'));

        const searchInput = screen.getByPlaceholderText(/Buscar producto.../i);
        fireEvent.change(searchInput, { target: { value: 'Mouse' } });

        await waitFor(() => {
            expect(screen.queryByText('PS5')).not.toBeInTheDocument();
            expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
        });
    });

    it('debería agregar productos al carrito y finalizar compra', async () => {
        api.post.mockResolvedValue({ data: { id: 100, total: 500000 } });
        renderComponent();
        await waitFor(() => screen.getByText('PS5'));

        // Agregar al carrito (Botón "+" en la tarjeta)
        const addButtons = screen.getAllByText('+');
        fireEvent.click(addButtons[0]); // Agregar PS5

        // Verificar que aparece en el carrito
        // Cart.jsx muestra "1 ITEMS" cuando hay un producto
        expect(screen.getByText(/1 ITEMS/i)).toBeInTheDocument();

        // Simular checkout seleccionando un método de pago
        // CORRECCIÓN: Buscamos el botón "EFECTIVO" específicamente
        const payButton = screen.getByRole('button', { name: /EFECTIVO/i });
        fireEvent.click(payButton);

        await waitFor(() => {
            // Verificamos que se llamó a la API con los detalles y el método de pago
            expect(api.post).toHaveBeenCalledWith('/boletas', expect.objectContaining({
                detalles: [{ productoId: 1, cantidad: 1 }],
                metodoPago: 'EFECTIVO'
            }));
        });
    });
});