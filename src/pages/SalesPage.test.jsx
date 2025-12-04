import { render, screen, waitFor } from '@testing-library/react';
import SalesPage from './SalesPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }));

vi.mock('../services/api', () => ({
    default: { get: mockGet }
}));

const mockBoletas = [
    {
        id: 1,
        fecha: '2025-10-20T10:00:00Z',
        total: 50000,
        metodoPago: 'EFECTIVO',
        usuario: { nombre: 'Vendedor 1' },
        detalles: [{ id: 1, cantidad: 2, producto: { nombre: 'Mouse', precio: 25000 } }]
    }
];

describe('SalesPage', () => {
    beforeEach(() => vi.clearAllMocks());

    it('debe mostrar las ventas obtenidas de la API', async () => {
        mockGet.mockResolvedValueOnce({ data: mockBoletas });

        render(<BrowserRouter><SalesPage /></BrowserRouter>);

        await waitFor(() => {
            expect(screen.getByText('Vendedor 1')).toBeInTheDocument();
        });


        const prices = screen.getAllByText(/\$50[.,]000/);
        expect(prices.length).toBeGreaterThan(0);

        expect(screen.getByText('EFECTIVO')).toBeInTheDocument();
    });

    it('debe mostrar mensaje si no hay ventas', async () => {
        mockGet.mockResolvedValueOnce({ data: [] });

        render(<BrowserRouter><SalesPage /></BrowserRouter>);

        await waitFor(() => {
            expect(screen.getByText(/No hay ventas registradas/i)).toBeInTheDocument();
        });
    });
});