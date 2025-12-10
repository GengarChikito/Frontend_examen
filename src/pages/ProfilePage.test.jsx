import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import api from '../services/api';

vi.mock('../services/api');
window.alert = vi.fn();

describe('ProfilePage', () => {
    const mockUser = {
        id: 1,
        email: 'test@test.com',
        nombre: 'Gamer1',
        puntosLevelUp: 1500,
        miCodigoReferido: 'CODE123',
        boletas: []
    };

    beforeEach(() => {
        vi.clearAllMocks();
        const payload = btoa(JSON.stringify({ sub: 1 }));
        localStorage.setItem('token', `.${payload}.`);
        api.get.mockResolvedValue({ data: mockUser });
    });

    it('debería cargar y mostrar datos del perfil y nivel', async () => {
        render(<BrowserRouter><ProfilePage /></BrowserRouter>);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Gamer1')).toBeInTheDocument();
            expect(screen.getByText('Pro Gamer')).toBeInTheDocument();
            expect(screen.getByText('1500 puntos')).toBeInTheDocument();
        });
    });

    it('debería permitir actualizar el perfil', async () => {
        api.patch.mockResolvedValue({ data: {} });
        render(<BrowserRouter><ProfilePage /></BrowserRouter>);

        // Esperar a que cargue el valor inicial
        await waitFor(() => screen.getByDisplayValue('Gamer1'));

        // CORRECCIÓN: Buscamos el input por su valor actual
        const nameInput = screen.getByDisplayValue('Gamer1');
        fireEvent.change(nameInput, { target: { value: 'GamerUpdated' } });

        fireEvent.click(screen.getByText(/Actualizar Perfil/i));

        await waitFor(() => {
            expect(api.patch).toHaveBeenCalledWith('/usuarios/1', expect.objectContaining({
                nombre: 'GamerUpdated'
            }));
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('actualizado'));
        });
    });
});