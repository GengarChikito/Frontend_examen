import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';


vi.mock('react-dom/client', () => ({
    default: {
        createRoot: vi.fn(() => ({
            render: vi.fn(),
        })),
    },
}));


vi.mock('./App', () => ({
    default: () => <div>Mocked App</div>,
}));


vi.mock('./index.css', () => ({}));

describe('Main Entry Point (main.jsx)', () => {
    beforeEach(() => {

        vi.resetModules();
        vi.clearAllMocks();


        document.body.innerHTML = '<div id="root"></div>';
    });

    afterEach(() => {
        // Limpiamos el DOM
        document.body.innerHTML = '';
    });

    it('debe buscar el elemento root y renderizar la aplicación', async () => {

        await import('./main.jsx');


        const ReactDOM = (await import('react-dom/client')).default;
        const rootElement = document.getElementById('root');

        // Verificaciones

        expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootElement);

        const rootInstance = ReactDOM.createRoot.mock.results[0].value;

        expect(rootInstance.render).toHaveBeenCalled();
    });
});