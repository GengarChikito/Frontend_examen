import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Mock simple de useNavigate
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
        localStorage.clear();
        vi.clearAllMocks();
    });

    const renderNavbar = () => render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );

    it('debería renderizar enlaces públicos y nombre de usuario', () => {
        const payload = JSON.stringify({ role: 'cliente', nombre: 'TestUser' });
        localStorage.setItem('token', `header.${btoa(payload)}.sig`);

        renderNavbar();

        expect(screen.getByText('TestUser')).toBeInTheDocument();
        expect(screen.getByText(/CATÁLOGO/i)).toBeInTheDocument();
        // No debe mostrar admin
        expect(screen.queryByText(/Admin Zone/i)).not.toBeInTheDocument();
    });

    it('debería mostrar zona de administración si el rol es admin', () => {
        const payload = JSON.stringify({ role: 'admin', nombre: 'AdminUser' });
        localStorage.setItem('token', `header.${btoa(payload)}.sig`);

        renderNavbar();

        expect(screen.getByText(/Admin Zone/i)).toBeInTheDocument();
        expect(screen.getByTitle('Agregar Nuevo Producto')).toBeInTheDocument();
    });

    it('debería cerrar sesión correctamente', () => {
        const payload = JSON.stringify({ role: 'cliente', nombre: 'User' });
        localStorage.setItem('token', `header.${btoa(payload)}.sig`);

        renderNavbar();

        const logoutBtn = screen.getByTitle('Cerrar Sesión');
        fireEvent.click(logoutBtn);

        expect(localStorage.getItem('token')).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});