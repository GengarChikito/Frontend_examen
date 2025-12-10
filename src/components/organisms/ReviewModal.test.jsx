import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewModal from './ReviewModal';
import api from '../../services/api';

vi.mock('../../services/api');
window.alert = vi.fn();

describe('ReviewModal Component', () => {
    const mockProduct = { id: 10, nombre: 'Silla Gamer' };
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();

    beforeEach(() => vi.clearAllMocks());

    it('no debería mostrarse si isOpen es false', () => {
        render(<ReviewModal isOpen={false} product={mockProduct} onClose={mockOnClose} />);
        expect(screen.queryByText(/CALIFICAR/i)).not.toBeInTheDocument();
    });

    it('debería permitir crear una reseña (POST)', async () => {
        api.post.mockResolvedValue({});

        render(
            <ReviewModal
                isOpen={true}
                product={mockProduct}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        // Verificar textos del modal
        expect(screen.getByText(/CALIFICAR/i)).toBeInTheDocument();
        expect(screen.getByText(/LOOT/i)).toBeInTheDocument();
        expect(screen.getByText('Silla Gamer')).toBeInTheDocument();

        // Escribir comentario
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: 'Muy cómoda' } });

        // Enviar
        const submitBtn = screen.getByText(/Publicar/i); // Botón dice 'Publicar' al crear
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/resenas', expect.objectContaining({
                productoId: 10,
                texto: 'Muy cómoda',
                calificacion: 5 // Default
            }));
            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('debería permitir editar una reseña (PATCH)', async () => {
        api.patch.mockResolvedValue({});
        const initialData = { id: 55, texto: 'Texto anterior', calificacion: 4 };

        render(
            <ReviewModal
                isOpen={true}
                product={mockProduct}
                initialData={initialData}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText(/EDITAR/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue('Texto anterior')).toBeInTheDocument();

        // Cambiar texto
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Texto nuevo' } });

        // Enviar (Botón dice 'Actualizar' al editar)
        const updateBtn = screen.getByText(/Actualizar/i);
        fireEvent.click(updateBtn);

        await waitFor(() => {
            expect(api.patch).toHaveBeenCalledWith('/resenas/55', expect.objectContaining({
                texto: 'Texto nuevo',
                calificacion: 4
            }));
        });
    });
});