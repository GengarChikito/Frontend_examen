import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AddProductPage from './AddProductPage';
import api from '../services/api';

vi.mock('../services/api');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});
window.alert = vi.fn();

describe('AddProductPage', () => {
    beforeEach(() => vi.clearAllMocks());

    const renderPage = () => render(
        <BrowserRouter>
            <AddProductPage />
        </BrowserRouter>
    );

    it('debería enviar el formulario correctamente', async () => {
        api.post.mockResolvedValue({ data: {} });
        renderPage();

        // CORRECCIÓN: Usamos getByPlaceholderText porque los labels no están vinculados por ID
        fireEvent.change(screen.getByPlaceholderText(/Ej: PS5 Pro/i), { target: { value: 'Nuevo Juego' } });
        fireEvent.change(screen.getByPlaceholderText('99990'), { target: { value: '50000' } }); // Precio
        fireEvent.change(screen.getByPlaceholderText('10'), { target: { value: '20' } }); // Stock
        fireEvent.change(screen.getByPlaceholderText('https://...'), { target: { value: 'http://img.com' } }); // Imagen

        // Simular submit
        fireEvent.click(screen.getByText(/AGREGAR AL CATÁLOGO/i));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/productos', expect.objectContaining({
                nombre: 'Nuevo Juego',
                precio: 50000,
                stock: 20
            }));
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('debería manejar errores del servidor', async () => {
        api.post.mockRejectedValue(new Error('Error de servidor'));
        renderPage();

        fireEvent.click(screen.getByText(/AGREGAR AL CATÁLOGO/i));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Error'));
        });
    });
});