import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mocks de las páginas
vi.mock('./pages/LoginPage', () => ({ default: () => <div data-testid="login-page">Login Page</div> }));
vi.mock('./pages/DashboardPage', () => ({ default: () => <div data-testid="dashboard-page">Dashboard Page</div> }));
vi.mock('./pages/AddUserPage', () => ({ default: () => <div data-testid="admin-page">Admin Page</div> }));
vi.mock('./pages/SalesPage', () => ({ default: () => <div>Sales Page</div> }));
vi.mock('./pages/AddProductPage', () => ({ default: () => <div>Add Product Page</div> }));

describe('App Routing & Security', () => {
    beforeEach(() => {
        localStorage.clear();
        window.history.pushState({}, 'Test page', '/');
    });

    it('debe mostrar Login en la ruta raíz /', () => {
        render(<App />);
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('debe redirigir a Login si intento entrar a /dashboard sin token', async () => {
        window.history.pushState({}, 'Test page', '/dashboard');
        render(<App />);

        await waitFor(() => {
            expect(screen.getByTestId('login-page')).toBeInTheDocument();
            expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();
        });
    });

    it('debe permitir entrar a /dashboard con un token válido', () => {

        localStorage.setItem('token', 'fake-token-content');
        window.history.pushState({}, 'Test page', '/dashboard');

        render(<App />);
        expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });

    it('debe bloquear a un vendedor de entrar a rutas de admin', () => {
        // Token con payload decodificable simulado
        const payload = JSON.stringify({ role: 'vendedor' });
        const token = `header.${btoa(payload)}.signature`;
        localStorage.setItem('token', token);

        window.history.pushState({}, 'Test page', '/crear-usuario');

        render(<App />);


        expect(screen.queryByTestId('admin-page')).not.toBeInTheDocument();

        expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });

    it('debe permitir a un admin entrar a rutas de admin', () => {
        const payload = JSON.stringify({ role: 'admin' });
        const token = `header.${btoa(payload)}.signature`;
        localStorage.setItem('token', token);

        window.history.pushState({}, 'Test page', '/crear-usuario');

        render(<App />);
        expect(screen.getByTestId('admin-page')).toBeInTheDocument();
    });
});