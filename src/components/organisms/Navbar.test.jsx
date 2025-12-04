import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';


const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

describe('Navbar Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('debe mostrar el nombre de la tienda', () => {
        render(<BrowserRouter><Navbar /></BrowserRouter>);
        expect(screen.getByText(/Tienda/i)).toBeInTheDocument();
    });

    it('debe cerrar sesión y redirigir al login', () => {
        const token = btoa(JSON.stringify({ role: 'admin', nombre: 'Juan' }));
        localStorage.setItem('token', `JH.${token}.S`);

        render(<BrowserRouter><Navbar /></BrowserRouter>);

        const logoutBtn = screen.getByTitle('Cerrar Sesión');
        fireEvent.click(logoutBtn);

        expect(localStorage.getItem('token')).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });


    it('NO debe mostrar enlaces de administración si el usuario es Vendedor', () => {
        // Simulamos token de VENDEDOR
        const token = btoa(JSON.stringify({ role: 'vendedor', nombre: 'Vendedor' }));
        localStorage.setItem('token', `H.${token}.S`);

        render(<BrowserRouter><Navbar /></BrowserRouter>);


        expect(screen.queryByText('+ Producto')).not.toBeInTheDocument();
        expect(screen.queryByText('+ Usuario')).not.toBeInTheDocument();


        expect(screen.getByText('Historial')).toBeInTheDocument();
        expect(screen.getByText('Punto de Venta')).toBeInTheDocument();
    });
});