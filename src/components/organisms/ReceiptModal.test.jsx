import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReceiptModal from './ReceiptModal';

describe('ReceiptModal Component', () => {
    const mockSaleData = {
        id: 1,
        total: 50000,
        fecha: '2025-01-01',
        metodoPago: 'EFECTIVO',
        usuario: { nombre: 'Gamer' },
        items: [
            { nombre: 'Juego PS5', cantidad: 1, precio: 50000 }
        ]
    };

    const mockOnClose = vi.fn();

    it('no debería mostrarse si isOpen es false', () => {
        render(<ReceiptModal isOpen={false} saleData={mockSaleData} onClose={mockOnClose} />);

        // Buscamos textos que solo aparecen cuando está abierto
        expect(screen.queryByText(/LEVEL-UP/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Boleta Electrónica/i)).not.toBeInTheDocument();
    });

    it('debería mostrar los detalles de la boleta cuando está abierto', () => {
        render(<ReceiptModal isOpen={true} saleData={mockSaleData} onClose={mockOnClose} />);

        // 1. Verificar títulos correctos (según el DOM real visto en el error)
        expect(screen.getByText(/LEVEL-UP/i)).toBeInTheDocument();
        expect(screen.getByText(/GAMER/i)).toBeInTheDocument();
        expect(screen.getByText(/Boleta Electrónica/i)).toBeInTheDocument();

        // 2. Verificar datos de la boleta
        expect(screen.getByText(/Juego PS5/i)).toBeInTheDocument();

        // El precio aparece formateado. Usamos getAllByText para evitar errores de duplicados
        // El log muestra que aparece tanto en el total como en el detalle
        const precios = screen.getAllByText(/\$50.000/); // Buscamos formateado $50.000 (o 50.000 según locale)
        // Nota: Si falla por el formato exacto, usa una regex más laxa como /50\.000/
        expect(precios.length).toBeGreaterThan(0);

        // Verificar método de pago
        expect(screen.getByText('EFECTIVO')).toBeInTheDocument();
    });

    it('debería llamar a onClose al hacer clic en cerrar', () => {
        render(<ReceiptModal isOpen={true} saleData={mockSaleData} onClose={mockOnClose} />);

        // El botón tiene el texto "Cerrar" (Title Case) según el log
        // <button ...> Cerrar </button>
        const closeBtn = screen.getByRole('button', { name: /Cerrar/i });
        fireEvent.click(closeBtn);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});