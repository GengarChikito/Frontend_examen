import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
    const mockProduct = {
        id: 1,
        nombre: 'Producto Test',
        precio: 1000,
        stock: 5,
        categoria: 'Test',
        imagen: 'img.jpg'
    };

    const mockAddToCart = vi.fn();
    const mockDelete = vi.fn();

    it('debería renderizar la información del producto', () => {
        render(<ProductCard producto={mockProduct} onAddToCart={mockAddToCart} />);

        expect(screen.getByText('Producto Test')).toBeInTheDocument();
        expect(screen.getByText('$1.000')).toBeInTheDocument();
        expect(screen.getByText(/STOCK: 5/i)).toBeInTheDocument();
    });

    it('debería mostrar AGOTADO si no hay stock', () => {
        const outOfStockProduct = { ...mockProduct, stock: 0 };
        render(<ProductCard producto={outOfStockProduct} onAddToCart={mockAddToCart} />);

        expect(screen.getByText('AGOTADO')).toBeInTheDocument();

        // CORRECCIÓN: Buscamos el botón explícitamente por su rol y nombre
        const addBtn = screen.getByRole('button', { name: '+' });
        expect(addBtn).toBeDisabled();
    });

    it('debería mostrar botón de eliminar solo si es admin', () => {
        const { rerender } = render(
            <ProductCard producto={mockProduct} onDelete={mockDelete} isAdmin={true} />
        );
        expect(screen.getByText('🗑️')).toBeInTheDocument();

        rerender(<ProductCard producto={mockProduct} onDelete={mockDelete} isAdmin={false} />);
        expect(screen.queryByText('🗑️')).not.toBeInTheDocument();
    });

    it('debería llamar a onAddToCart al hacer clic en +', () => {
        render(<ProductCard producto={mockProduct} onAddToCart={mockAddToCart} />);
        fireEvent.click(screen.getByRole('button', { name: '+' }));
        expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    });
});