import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import BlogPage from './BlogPage';
import api from '../services/api';

vi.mock('../services/api');
vi.mock('../components/organisms/Navbar', () => ({ default: () => <div>Navbar</div> }));
window.confirm = vi.fn(() => true);
window.alert = vi.fn();

const mockBlogs = [
    { id: 1, titulo: 'Noticia 1', categoria: 'Noticias', descripcion: 'Desc...', fecha: 'Hoy', icono: '📰' }
];

describe('BlogPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        api.get.mockResolvedValue({ data: mockBlogs });
        // Login Admin
        const payload = btoa(JSON.stringify({ sub: 1, role: 'admin' }));
        localStorage.setItem('token', `.${payload}.`);
    });

    it('debería mostrar las noticias', async () => {
        render(<BrowserRouter><BlogPage /></BrowserRouter>);
        await waitFor(() => {
            expect(screen.getByText('Noticia 1')).toBeInTheDocument();
            expect(screen.getByText('Desc...')).toBeInTheDocument();
        });
    });

    it('debería eliminar una noticia (Admin)', async () => {
        api.delete.mockResolvedValue({});
        render(<BrowserRouter><BlogPage /></BrowserRouter>);

        const btnDelete = await screen.findByText('🗑️'); // El botón dentro del map usa este emoji
        fireEvent.click(btnDelete);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/blogs/1');
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('eliminada'));
        });
    });
});