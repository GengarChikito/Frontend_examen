import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AddUserPage from './AddUserPage';
import api from '../services/api';

vi.mock('../services/api');
vi.mock('../components/organisms/Navbar', () => ({ default: () => <div>Navbar</div> }));
window.alert = vi.fn();
window.confirm = vi.fn(() => true);

const mockUsers = [
    { id: 1, nombre: 'User1', email: 'u1@test.com', role: 'cliente', puntosLevelUp: 100 }
];

describe('AddUserPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        api.get.mockResolvedValue({ data: mockUsers });
    });

    const renderPage = () => render(
        <BrowserRouter>
            <AddUserPage />
        </BrowserRouter>
    );

    it('debería listar los usuarios', async () => {
        renderPage();
        // Usamos findBy para esperar a que desaparezca el "CARGANDO..."
        expect(await screen.findByText('User1')).toBeInTheDocument();
        expect(screen.getByText('u1@test.com')).toBeInTheDocument();
    });

    it('debería crear un nuevo usuario', async () => {
        api.post.mockResolvedValue({ data: {} });
        renderPage();

        // CORRECCIÓN: Usamos findByPlaceholderText para esperar que el formulario aparezca
        const nameInput = await screen.findByPlaceholderText(/Ej: GamerOne/i);

        // Llenar formulario
        fireEvent.change(nameInput, { target: { value: 'NewUser' } });
        fireEvent.change(screen.getByPlaceholderText('correo@duoc.cl'), { target: { value: 'new@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('******'), { target: { value: '123456' } });

        // Buscar input de fecha (como no tiene placeholder, usamos el selector CSS seguro)
        const dateInput = document.querySelector('input[type="date"]');
        if (dateInput) fireEvent.change(dateInput, { target: { value: '2000-01-01' } });

        // Submit
        fireEvent.click(screen.getByText(/CREAR USUARIO/i));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/register', expect.objectContaining({
                nombre: 'NewUser',
                email: 'new@test.com'
            }));
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('creado'));
        });
    });

    it('debería eliminar un usuario', async () => {
        api.delete.mockResolvedValue({});
        renderPage();

        // Esperar a que se carguen los usuarios antes de intentar borrar
        const btnDelete = await screen.findByTitle('Eliminar');
        fireEvent.click(btnDelete);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith('/usuarios/1');
        });
    });
});