import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddProductPage from './AddProductPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

const { mockPost, mockNavigate } = vi.hoisted(() => ({
    mockPost: vi.fn(),
    mockNavigate: vi.fn()
}));

vi.mock('../services/api', () => ({ default: { post: mockPost } }));
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

describe('AddProductPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'alert').mockImplementation(() => {}); // Ignorar alerts
    });

    it('debe enviar el formulario correctamente', async () => {
        mockPost.mockResolvedValueOnce({}); // Éxito

        render(<BrowserRouter><AddProductPage /></BrowserRouter>);

        // Llenar inputs
        fireEvent.change(screen.getByPlaceholderText('Ej: Teclado Gamer'), { target: { value: 'Nuevo Mouse' } });
        fireEvent.change(screen.getByPlaceholderText('Ej: 15000'), { target: { value: '2000' } });
        fireEvent.change(screen.getByPlaceholderText('Ej: 10'), { target: { value: '50' } });
        fireEvent.change(screen.getByPlaceholderText('https://...'), { target: { value: 'http://img.com/img.png' } });

        // Enviar
        fireEvent.click(screen.getByText('Guardar Producto'));

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/productos', {
                nombre: 'Nuevo Mouse',
                precio: 2000,
                stock: 50,
                imagen: 'http://img.com/img.png'
            });
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });
});