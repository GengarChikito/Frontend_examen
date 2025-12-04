import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';
import { describe, it, expect, vi } from 'vitest';

const mockProduct = {
    id: 1,
    nombre: 'Teclado Gamer',
    precio: 15000,
    stock: 5,
    imagen: 'https://via.placeholder.com/150'
};

describe('ProductCard', () => {
    it('debe mostrar la información del producto', () => {
        render(<ProductCard producto={mockProduct} isAdmin={false} />);

        expect(screen.getByText('Teclado Gamer')).toBeInTheDocument();

        expect(screen.getByText(/\$15[.,]000/)).toBeInTheDocument();

        // Usamos una buqueda
        expect(screen.getByText(/5 un/i)).toBeInTheDocument();
    });

    it('debe llamar a onAddToCart cuando se presiona el botón +', () => {
        const handleAdd = vi.fn();
        render(<ProductCard producto={mockProduct} onAddToCart={handleAdd} isAdmin={false} />);

        const addButton = screen.getByText('+');
        fireEvent.click(addButton);

        expect(handleAdd).toHaveBeenCalledWith(mockProduct);
    });

    it('NO debe mostrar el botón de eliminar si no es Admin', () => {
        render(<ProductCard producto={mockProduct} isAdmin={false} />);
        // Buscamos el botón por su título
        const deleteButton = screen.queryByTitle('Eliminar producto (Solo Admin)');
        expect(deleteButton).not.toBeInTheDocument();
    });

    it('debe mostrar el botón de eliminar si es Admin y llamar a onDelete', () => {
        const handleDelete = vi.fn();
        render(<ProductCard producto={mockProduct} isAdmin={true} onDelete={handleDelete} />);

        const deleteButton = screen.getByTitle('Eliminar producto (Solo Admin)');
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);
        expect(handleDelete).toHaveBeenCalledWith(mockProduct.id);
    });

    it('debe deshabilitar el botón si no hay stock', () => {
        const noStockProduct = { ...mockProduct, stock: 0 };
        render(<ProductCard producto={noStockProduct} />);

        expect(screen.getByText('Agotado')).toBeInTheDocument();
        const addButton = screen.getByText('+').closest('button');
        expect(addButton).toBeDisabled();
    });
});