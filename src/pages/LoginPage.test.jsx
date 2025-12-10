// src/pages/LoginPage.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import api from '../services/api';

// --- MOCKS ---

// 1. Mock de react-router-dom para interceptar useNavigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});

// 2. Mock del servicio API (axios instance)
vi.mock('../services/api', () => ({
    default: {
        post: vi.fn(),
        interceptors: {
            request: { use: vi.fn() },
        },
    },
}));

// 3. Mock de window.alert para evitar errores en consola durante tests
vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('LoginPage Component', () => {

    // Limpiar mocks antes de cada test para evitar contaminación entre pruebas
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    // Función helper para renderizar con Router (necesario por useNavigate)
    const renderComponent = () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
    };

    it('debería renderizar el formulario de Inicio de Sesión por defecto', () => {
        renderComponent();

        // Verificar textos clave del login
        expect(screen.getByText(/Ingresa al sistema/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /INICIAR SESIÓN/i })).toBeInTheDocument();

        // Verificar que campos de registro NO estén presentes
        expect(screen.queryByPlaceholderText(/Ej: MasterChief/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Código de Referido/i)).not.toBeInTheDocument();
    });

    it('debería cambiar al formulario de Registro al hacer clic en el enlace', () => {
        renderComponent();

        // Buscar el botón para cambiar a registro y hacer clic
        const toggleBtn = screen.getByText(/Regístrate aquí/i);
        fireEvent.click(toggleBtn);

        // Verificar que ahora aparezcan los campos de registro
        expect(screen.getByText(/Crea tu cuenta de jugador/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Ej: MasterChief/i)).toBeInTheDocument(); // Input Nombre
        expect(screen.getByText(/Fecha de Nacimiento/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /REGISTRARSE/i })).toBeInTheDocument();
    });

    it('debería realizar el LOGIN exitosamente y redirigir', async () => {
        // Configurar respuesta simulada exitosa del backend
        const fakeToken = 'fake-jwt-token-123';
        api.post.mockResolvedValueOnce({ data: { access_token: fakeToken } });

        renderComponent();

        // Simular escritura de usuario
        fireEvent.change(screen.getByPlaceholderText(/usuario@ejemplo.com/i), { target: { value: 'test@duoc.cl' } });
        fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: '123456' } });

        // Simular clic en Login
        fireEvent.click(screen.getByRole('button', { name: /INICIAR SESIÓN/i }));

        // Esperar a que se llame a la API y ocurran los efectos
        await waitFor(() => {
            // Verificar llamada a la API con los datos correctos
            expect(api.post).toHaveBeenCalledWith('/auth/login', {
                email: 'test@duoc.cl',
                password: '123456',
            });

            // Verificar guardado en localStorage
            expect(localStorage.getItem('token')).toBe(fakeToken);

            // Verificar redirección
            expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('debería mostrar un error si el LOGIN falla', async () => {
        // Configurar error simulado del backend
        const errorMessage = 'Credenciales incorrectas';
        api.post.mockRejectedValueOnce({
            response: { data: { message: errorMessage } }
        });

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText(/usuario@ejemplo.com/i), { target: { value: 'fail@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: /INICIAR SESIÓN/i }));

        // Verificar que aparezca el mensaje de error en pantalla
        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    it('debería realizar el REGISTRO exitosamente', async () => {
        // Configurar respuesta exitosa
        api.post.mockResolvedValueOnce({ data: { id: 1, nombre: 'Nuevo User' } });

        renderComponent();

        // Ir a modo registro
        fireEvent.click(screen.getByText(/Regístrate aquí/i));

        // Llenar formulario completo
        fireEvent.change(screen.getByPlaceholderText(/Ej: MasterChief/i), { target: { value: 'GamerPro' } });

        // Para el input date, seleccionamos por selector CSS ya que no tiene placeholder
        // El orden en tu código es: Nombre -> Fecha -> Código -> Email
        const dateInput = screen.getAllByRole('textbox').find(input => input.type === 'date') || document.querySelector('input[type="date"]');
        // Nota: Testing Library a veces no trata 'date' como textbox, usamos querySelector como fallback seguro
        if(dateInput) fireEvent.change(dateInput, { target: { value: '2000-01-01' } });

        fireEvent.change(screen.getByPlaceholderText(/Ej: JUAN01/i), { target: { value: 'REFERIDO123' } });
        fireEvent.change(screen.getByPlaceholderText(/usuario@ejemplo.com/i), { target: { value: 'gamer@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /REGISTRARSE/i }));

        await waitFor(() => {
            // Verificar payload de registro
            expect(api.post).toHaveBeenCalledWith('/auth/register', {
                nombre: 'GamerPro',
                email: 'gamer@test.com',
                password: 'password123',
                fechaNacimiento: '2000-01-01',
                role: 'cliente',
                codigoReferidoUsado: 'REFERIDO123'
            });

            // Verificar alerta de éxito
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Registro exitoso'));

            // Verificar que volvió al login (el texto cambia)
            expect(screen.getByText(/Ingresa al sistema/i)).toBeInTheDocument();
        });
    });

    it('debería manejar el LOGIN DE INVITADO correctamente', async () => {
        const fakeToken = 'guest-token';
        api.post.mockResolvedValueOnce({ data: { access_token: fakeToken } });

        renderComponent();

        const guestBtn = screen.getByText(/INGRESAR COMO INVITADO/i);
        fireEvent.click(guestBtn);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/login', {
                email: 'invitado@levelup.com',
                password: '123'
            });
            expect(localStorage.getItem('token')).toBe(fakeToken);
            expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });
});