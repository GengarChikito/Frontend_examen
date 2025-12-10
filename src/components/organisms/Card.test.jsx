import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Card from './Card';

describe('Card (Carrito) Component', () => {
    const mockItems = [
        { id: 1, nombre: 'Producto A', precio: 10000, cantidad: 2 } // Subtotal: 20000
    ];
    const mockOnRemove = vi.fn();
    const mockOnCheckout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('debería mostrar los items y calcular el total correctamente', () => {
        render(<Card items={mockItems} onRemove={mockOnRemove} onCheckout={mockOnCheckout} />);

        expect(screen.getByText('Producto A')).toBeInTheDocument();
        // Verifica que aparezca el precio formateado (puede ser $20.000 o 20.000)
        const totalElements = screen.getAllByText(/20\.000/);
        expect(totalElements.length).toBeGreaterThan(0);
    });

    it('debería mostrar mensaje de Descuento si es estudiante Duoc', () => {
        // Simulamos token JWT con payload { esEstudianteDuoc: true }
        const payload = JSON.stringify({ esEstudianteDuoc: true });
        const token = `header.${btoa(payload)}.signature`;
        localStorage.setItem('token', token);

        render(<Card items={mockItems} onRemove={mockOnRemove} onCheckout={mockOnCheckout} />);

        expect(screen.getByText(/Dcto. Duoc/i)).toBeInTheDocument();
        // Total esperado: 20000 - 20% = 16000
        expect(screen.getByText('$16.000')).toBeInTheDocument();
    });

    it('debería ejecutar onCheckout con el medio de pago seleccionado', () => {
        render(<Card items={mockItems} onRemove={mockOnRemove} onCheckout={mockOnCheckout} />);

        const btnEfectivo = screen.getByText(/EFECTIVO/i);
        fireEvent.click(btnEfectivo);

        expect(mockOnCheckout).toHaveBeenCalledWith('EFECTIVO');
    });

    it('debería ejecutar onRemove al eliminar un item', () => {
        render(<Card items={mockItems} onRemove={mockOnRemove} onCheckout={mockOnCheckout} />);

        // Buscamos el botón de eliminar (que es un icono en tu código, normalmente dentro de un button)
        const deleteButtons = screen.getAllByRole('button');
        // El primer botón suele ser el de eliminar en la lista
        fireEvent.click(deleteButtons[0]);

        expect(mockOnRemove).toHaveBeenCalledWith(1);
    });
});