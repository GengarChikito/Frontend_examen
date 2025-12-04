import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';

describe('API Service Configuration', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('debe tener definida la URL base correcta', () => {
        expect(api.defaults.baseURL).toBe('http://localhost:4000/api');
    });

    it('debe inyectar el token en los headers si existe en localStorage', async () => {

        const fakeToken = 'mi-token-secreto';
        localStorage.setItem('token', fakeToken);


        const requestConfig = { headers: {} };
        const interceptor = api.interceptors.request.handlers[0].fulfilled;


        const result = await interceptor(requestConfig);


        expect(result.headers.Authorization).toBe(`Bearer ${fakeToken}`);
    });

    it('no debe inyectar token si no hay sesión', async () => {
        const requestConfig = { headers: {} };
        const interceptor = api.interceptors.request.handlers[0].fulfilled;

        const result = await interceptor(requestConfig);

        expect(result.headers.Authorization).toBeUndefined();
    });
});