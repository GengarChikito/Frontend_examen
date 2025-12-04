import { render, screen, fireEvent } from '@testing-library/react';
import Cart from './Card'; // Asegúrate que el archivo se llame Card.jsx
import { describe, it, expect, vi } from 'vitest';

describe('Componente Cart (Carrito)', () => {
    const mockItems = [
        { id: 1, nombre: 'Producto A', precio: 1000, cantidad: 2 },
        { id: 2, nombre: 'Producto B', precio: 2000, cantidad: 1 },
    ];
    // Total

    it('debe mostrar mensaje cuando el carrito está vacío', () => {
        render(<Cart items={[]} total={0} />);
        expect(screen.getByText('El carrito está vacío')).toBeInTheDocument();

        // Botones deben estar deshabilitados
        expect(screen.getByText(/Efectivo/i).closest('button')).toBeDisabled();
    });

    it('debe listar los items y mostrar el total correcto', () => {
        render(<Cart items={mockItems} total={4000} />);

        expect(screen.getByText('Producto A')).toBeInTheDocument();
        expect(screen.getByText('Producto B')).toBeInTheDocument();


        expect(screen.getByText(/\$4[.,]000/)).toBeInTheDocument();


        expect(screen.getByText('2 items')).toBeInTheDocument();
    });

    it('debe llamar a onRemove cuando se elimina un item', () => {
        const handleRemove = vi.fn();
        render(<Cart items={mockItems} total={4000} onRemove={handleRemove} />);

        const deleteButtons = screen.getAllByText('✕');
        fireEvent.click(deleteButtons[0]);

        expect(handleRemove).toHaveBeenCalledWith(1);
    });

    it('debe emitir el método de pago correcto al pagar', () => {
        const handleCheckout = vi.fn();
        render(<Cart items={mockItems} total={4000} onCheckout={handleCheckout} />);

        fireEvent.click(screen.getByText(/Tarjeta/i));
        expect(handleCheckout).toHaveBeenCalledWith('TARJETA');

        fireEvent.click(screen.getByText(/Efectivo/i));
        expect(handleCheckout).toHaveBeenCalledWith('EFECTIVO');
    });
});