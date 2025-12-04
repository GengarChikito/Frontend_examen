import { render, screen, fireEvent } from '@testing-library/react';
import ReceiptModal from './ReceiptModal';
import { describe, it, expect, vi } from 'vitest';

describe('ReceiptModal Component', () => {
    const mockSaleData = {
        id: 123,
        fecha: '2023-11-25T10:30:00',
        total: 11900,
        metodoPago: 'EFECTIVO',
        items: [
            { nombre: 'Producto A', precio: 5000, cantidad: 2 }
        ]
    };

    it('no debe renderizarse si isOpen es false', () => {
        render(<ReceiptModal isOpen={false} onClose={() => {}} saleData={mockSaleData} />);
        expect(screen.queryByText('Boleta Electrónica')).not.toBeInTheDocument();
    });

    it('debe renderizarse y mostrar los datos correctamente cuando isOpen es true', () => {
        render(<ReceiptModal isOpen={true} onClose={() => {}} saleData={mockSaleData} />);

        expect(screen.getByText('Boleta Electrónica')).toBeInTheDocument();
        // Regex flexible para el ID (con ceros a la izquierda)
        expect(screen.getByText(/#\s*0*123/)).toBeInTheDocument();
        expect(screen.getByText('EFECTIVO')).toBeInTheDocument();
        expect(screen.getByText(/2 x Producto A/)).toBeInTheDocument();
    });

    it('debe calcular correctamente el Neto y el IVA', () => {
        render(<ReceiptModal isOpen={true} onClose={() => {}} saleData={mockSaleData} />);


        const moneyRegex = (amount) => new RegExp(`\\$\\s?${amount}[.,]000`);


        const netos = screen.getAllByText(moneyRegex('10'));
        expect(netos.length).toBeGreaterThanOrEqual(1);


        expect(screen.getByText(/\$\s?1[.,]900/)).toBeInTheDocument();
        expect(screen.getByText(/\$\s?11[.,]900/)).toBeInTheDocument();
    });

    it('debe ejecutar onClose al cerrar', () => {
        const handleClose = vi.fn();
        render(<ReceiptModal isOpen={true} onClose={handleClose} saleData={mockSaleData} />);

        fireEvent.click(screen.getByText(/Cerrar e Imprimir/i));
        expect(handleClose).toHaveBeenCalled();
    });
});