import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SalesPage from './SalesPage';
import api from '../services/api';

vi.mock('../services/api');
vi.mock('../components/organisms/Navbar', () => ({ default: () => <div data-testid="navbar">Navbar</div> }));
vi.mock('../components/organisms/ReceiptModal', () => ({
    default: ({ isOpen, onClose }) => isOpen ? (
        <div data-testid="receipt-modal">
            Modal Abierto
            <button onClick={onClose}>Cerrar</button>
        </div>
    ) : null
}));

const mockBoletas = [
    {
        id: 1,
        fecha: '2025-10-15T10:00:00.000Z',
        total: '50000',
        metodoPago: 'EFECTIVO',
        usuario: { nombre: 'Juan' },
        detalles: [{ producto: { nombre: 'Juego' }, cantidad: 1 }]
    }
];

describe('SalesPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        api.get.mockResolvedValue({ data: mockBoletas });
    });

    const renderPage = () => render(
        <BrowserRouter>
            <SalesPage />
        </BrowserRouter>
    );

    it('debería cargar y mostrar el historial de ventas', async () => {
        renderPage();

        await waitFor(() => {
            expect(screen.getByText(/HISTORIAL DE PARTIDAS/i)).toBeInTheDocument();
            expect(screen.getByText('#0001')).toBeInTheDocument(); // ID formateado
            expect(screen.getByText('Juan')).toBeInTheDocument();

            // CORRECCIÓN: Usamos getAllByText porque el precio aparece en "Ingresos Totales" y en la tabla
            const precios = screen.getAllByText('$50.000');
            expect(precios.length).toBeGreaterThan(0);
        });
    });

    it('debería abrir el modal al ver detalle', async () => {
        renderPage();
        // Esperamos a que cargue la tabla buscando el ID
        await waitFor(() => screen.getByText('#0001'));

        const btnDetalle = screen.getByTitle('Ver Detalle');
        fireEvent.click(btnDetalle);

        expect(screen.getByTestId('receipt-modal')).toBeInTheDocument();
    });
});