import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ReviewsPage from './ReviewsPage';
import api from '../services/api';

vi.mock('../services/api');
vi.mock('../components/organisms/Navbar', () => ({ default: () => <div>Navbar</div> }));
window.alert = vi.fn();
window.confirm = vi.fn(() => true);

const mockReviews = [
    { id: 1, texto: 'Buen producto', calificacion: 5, fecha: '2025-01-01', usuario: { id: 1, nombre: 'Gamer' }, producto: { id: 10, nombre: 'Mouse' } }
];
const mockProducts = [{ id: 10, nombre: 'Mouse' }];

describe('ReviewsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock de usuario logueado (ID 1) para poder editar/borrar
        const payload = btoa(JSON.stringify({ sub: 1, role: 'cliente' }));
        localStorage.setItem('token', `.${payload}.`);

        api.get.mockImplementation((url) => {
            if (url === '/resenas') return Promise.resolve({ data: mockReviews });
            if (url === '/productos') return Promise.resolve({ data: mockProducts });
            return Promise.resolve({ data: [] });
        });
    });

    it('debería mostrar las reseñas existentes', async () => {
        render(<BrowserRouter><ReviewsPage /></BrowserRouter>);

        await waitFor(() => {
            expect(screen.getByText('Buen producto')).toBeInTheDocument();
            expect(screen.getByText('ITEM: Mouse')).toBeInTheDocument();
        });
    });

    it('debería permitir escribir una nueva reseña', async () => {
        api.post.mockResolvedValue({ data: {} });
        render(<BrowserRouter><ReviewsPage /></BrowserRouter>);

        // Abrir formulario
        const btnNew = await screen.findByText(/Escribir Reseña/i);
        fireEvent.click(btnNew);

        // Llenar datos
        const commentInput = screen.getByPlaceholderText('Cuéntanos tu experiencia...');
        fireEvent.change(commentInput, { target: { value: 'Nueva Opinión' } });

        // Enviar
        fireEvent.click(screen.getByText('Confirmar'));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/resenas', expect.objectContaining({
                texto: 'Nueva Opinión',
                calificacion: 5 // Default
            }));
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('publicada'));
        });
    });

    it('debería permitir eliminar una reseña propia', async () => {
        api.delete.mockResolvedValue({});
        render(<BrowserRouter><ReviewsPage /></BrowserRouter>);

        const btnDelete = await screen.findByTitle('Eliminar');
        fireEvent.click(btnDelete);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/resenas/1');
        });
    });
});