import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// --- MOCKS ---

// 1. Mock de react-dom/client
// CORRECCIÓN: Ahora devolvemos un objeto que contiene "default"
vi.mock('react-dom/client', () => {
    const renderMock = vi.fn();
    const createRootMock = vi.fn(() => ({
        render: renderMock,
    }));

    return {
        // Esto satisface: import ReactDOM from 'react-dom/client'
        default: {
            createRoot: createRootMock,
        },
        // Esto satisface: import { createRoot } from 'react-dom/client' (por si acaso)
        createRoot: createRootMock,
    };
});

// 2. Mock del componente App
vi.mock('./App.jsx', () => ({
    default: () => <div data-testid="mock-app">Mock App</div>,
}));

// 3. Mock del CSS
vi.mock('./index.css', () => ({}));

describe('Main Entry Point (main.jsx)', () => {

    beforeEach(() => {
        // Antes de cada test, creamos el div 'root' necesario para que main.jsx no falle
        const root = document.createElement('div');
        root.id = 'root';
        document.body.appendChild(root);
    });

    afterEach(() => {
        // Limpieza total
        document.body.innerHTML = '';
        vi.clearAllMocks();
        // Importante: Reseteamos los módulos para que el siguiente import vuelva a ejecutar el código
        vi.resetModules();
    });

    it('debería encontrar el elemento root y montar la aplicación', async () => {
        // Importación dinámica que ejecuta el código de main.jsx
        await import('./main.jsx');

        // 1. Verificar que el elemento root existe
        const rootElement = document.getElementById('root');
        expect(rootElement).toBeInTheDocument();

        // 2. Acceder al mock para verificar llamadas
        // Nota: Accedemos a .default porque así lo definimos en el mock
        const ReactDOM = (await import('react-dom/client')).default;

        // Verificar que createRoot fue llamado con el elemento correcto
        expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootElement);

        // 3. Verificar que .render() fue llamado en la instancia creada
        const mockRootInstance = ReactDOM.createRoot.mock.results[0].value;
        expect(mockRootInstance.render).toHaveBeenCalled();
    });
});