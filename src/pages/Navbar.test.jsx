import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
// CORRECCIÓN: Ruta ajustada para apuntar a components/organisms
import Navbar from '../components/organisms/Navbar';

// --- MOCKS ---
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Navbar Component', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    const renderNavbar = () => {
        return render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
    };

    it('debería mostrar enlaces básicos para usuario normal', () => {
        const payload = JSON.stringify({ role: 'cliente', nombre: 'Juan' });
        const base64Payload = btoa(payload);
        const fakeToken = `header.${base64Payload}.signature`;

        localStorage.setItem('token', fakeToken);

        renderNavbar();

        expect(screen.getByText('Juan')).toBeInTheDocument();
        expect(screen.getByText(/Catálogo/i)).toBeInTheDocument();
        expect(screen.queryByText(/Admin Zone/i)).not.toBeInTheDocument();
    });

    it('debería mostrar enlaces de administrador si el rol es admin', () => {
        const payload = JSON.stringify({ role: 'admin', nombre: 'Jefe' });
        const base64Payload = btoa(payload);
        const fakeToken = `header.${base64Payload}.signature`;

        localStorage.setItem('token', fakeToken);

        renderNavbar();

        expect(screen.getByText('Jefe')).toBeInTheDocument();
        expect(screen.getByText(/Admin Zone/i)).toBeInTheDocument();
        expect(screen.getByTitle('Historial de Ventas')).toBeInTheDocument();
    });

    it('debería cerrar sesión correctamente', () => {
        const payload = JSON.stringify({ role: 'cliente', nombre: 'Juan' });
        localStorage.setItem('token', `header.${btoa(payload)}.signature`);

        renderNavbar();

        const logoutBtn = screen.getByTitle('Cerrar Sesión');
        fireEvent.click(logoutBtn);

        expect(localStorage.getItem('token')).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});