import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import api from '../services/api';


vi.mock('../services/api', () => ({
    default: {
        post: vi.fn()
    }
}));


const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('debe renderizar el formulario de login', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        expect(screen.getByPlaceholderText('ejemplo@tienda.cl')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('debe manejar un login exitoso', async () => {

        api.post.mockResolvedValueOnce({
            data: { access_token: 'fake-jwt-token' }
        });

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );


        fireEvent.change(screen.getByPlaceholderText('ejemplo@tienda.cl'), { target: { value: 'admin@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: '1234' } });


        fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));


        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/login', {
                email: 'admin@test.com',
                password: '1234'
            });
            expect(localStorage.getItem('token')).toBe('fake-jwt-token');
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('debe mostrar error con credenciales inválidas', async () => {

        api.post.mockRejectedValueOnce(new Error('Credenciales inválidas'));

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('ejemplo@tienda.cl'), { target: { value: 'fail@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));


        await waitFor(() => {
            expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
        });
    });
});