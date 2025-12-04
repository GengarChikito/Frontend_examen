import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddUserPage from './AddUserPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

const { mockGet, mockPost, mockDelete } = vi.hoisted(() => ({
    mockGet: vi.fn(),
    mockPost: vi.fn(),
    mockDelete: vi.fn()
}));

vi.mock('../services/api', () => ({
    default: { get: mockGet, post: mockPost, delete: mockDelete, patch: vi.fn() }
}));

const mockUsers = [
    { id: 1, nombre: 'Admin User', email: 'admin@test.com', role: 'admin' }
];

describe('AddUserPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        vi.spyOn(window, 'confirm').mockReturnValue(true);
    });

    it('debe listar usuarios y permitir crear uno nuevo', async () => {
        mockGet.mockResolvedValueOnce({ data: mockUsers });
        mockPost.mockResolvedValueOnce({});
        // Segunda llamada a GET para recargar lista tras crear
        mockGet.mockResolvedValueOnce({ data: [...mockUsers, { id: 2, nombre: 'Nuevo', email: 'n@t.com', role: 'vendedor' }] });

        render(<BrowserRouter><AddUserPage /></BrowserRouter>);

        await waitFor(() => expect(screen.getByText('Admin User')).toBeInTheDocument());

        const container = screen.getByText('👤 Registrar Nuevo Usuario').closest('div');
        fireEvent.change(container.querySelector('input[name="nombre"]'), { target: { value: 'Nuevo Vendedor' } });
        fireEvent.change(container.querySelector('input[name="email"]'), { target: { value: 'new@vendor.com' } });
        fireEvent.change(container.querySelector('input[name="password"]'), { target: { value: '123456' } });

        fireEvent.click(screen.getByText('Crear Usuario'));

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
        });
    });

    // === NUEVO TEST DE ELIMINACIÓN ===
    it('debe eliminar un usuario correctamente tras confirmar', async () => {
        // Carga inicial
        mockGet.mockResolvedValueOnce({ data: mockUsers });
        // Respuesta de eliminación
        mockDelete.mockResolvedValueOnce({});
        // Recarga tras eliminar (lista vacía)
        mockGet.mockResolvedValueOnce({ data: [] });

        render(<BrowserRouter><AddUserPage /></BrowserRouter>);
        await waitFor(() => screen.getByText('Admin User'));

        // Buscamos el botón de eliminar (el trash emoji)
        const deleteBtns = screen.getAllByTitle('Eliminar');
        fireEvent.click(deleteBtns[0]);

        await waitFor(() => {
            // Verificamos que se llamó a la API con el ID correcto
            expect(mockDelete).toHaveBeenCalledWith('/usuarios/1');
            // Verificamos el alert de éxito
            expect(window.alert).toHaveBeenCalledWith('Usuario eliminado');
        });
    });
});