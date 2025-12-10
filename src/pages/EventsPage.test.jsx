import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import EventsPage from './EventsPage';
import api from '../services/api';

vi.mock('../services/api');
vi.mock('../components/organisms/Navbar', () => ({ default: () => <div>Navbar</div> }));
window.alert = vi.fn();
window.confirm = vi.fn(() => true);

const mockEvents = [
    { id: 1, titulo: 'Torneo LOL', puntos: 100, ubicacion: 'Online', fecha: '2025-12-12', hora: '20:00', descripcion: 'Torneo épico' }
];

describe('EventsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        api.get.mockResolvedValue({ data: mockEvents });
        // Simular login admin para ver botones CRUD
        const payload = btoa(JSON.stringify({ sub: 1, role: 'admin' }));
        localStorage.setItem('token', `.${payload}.`);
    });

    it('debería listar los eventos', async () => {
        render(<BrowserRouter><EventsPage /></BrowserRouter>);
        await waitFor(() => {
            expect(screen.getByText('Torneo LOL')).toBeInTheDocument();
            expect(screen.getByText('+100 XP')).toBeInTheDocument();
        });
    });

    it('debería permitir inscribirse a un evento', async () => {
        // Mock get usuario actual y patch
        api.get.mockImplementation((url) => {
            if (url === '/eventos') return Promise.resolve({ data: mockEvents });
            if (url.includes('/usuarios/1')) return Promise.resolve({ data: { puntosLevelUp: 50 } });
        });
        api.patch.mockResolvedValue({});

        render(<BrowserRouter><EventsPage /></BrowserRouter>);

        const btnInscribir = await screen.findByText('INSCRIBIRSE');
        fireEvent.click(btnInscribir);

        await waitFor(() => {
            expect(api.patch).toHaveBeenCalledWith('/usuarios/1', { puntosLevelUp: 150 }); // 50 + 100
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('INSCRIPCIÓN EXITOSA'));
        });
    });

    it('debería abrir el modal de crear evento (Admin)', async () => {
        render(<BrowserRouter><EventsPage /></BrowserRouter>);

        const btnCrear = await screen.findByText(/Nuevo Evento/i);
        fireEvent.click(btnCrear);

        expect(screen.getByText('CREAR')).toBeInTheDocument();
        expect(screen.getByText('EVENTO')).toBeInTheDocument();
    });
});