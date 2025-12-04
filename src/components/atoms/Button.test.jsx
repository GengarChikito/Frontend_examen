import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import { describe, it, expect, vi } from 'vitest';

describe('Componente Button', () => {
    it('debe renderizar el texto correctamente', () => {
        render(<Button>Click aquí</Button>);
        expect(screen.getByText('Click aquí')).toBeInTheDocument();
    });
 //PROFE TENGO SUEÑO !
    it('debe ejecutar la función onClick cuando se hace click', () => {
        const handleClick = vi.fn(); // Mock function
        render(<Button onClick={handleClick}>Click Me</Button>);

        const button = screen.getByText('Click Me');
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('debe aplicar la clase de variante danger correctamente', () => {
        render(<Button variant="danger">Eliminar</Button>);
        const button = screen.getByText('Eliminar');
        expect(button.className).toContain('bg-red-500');
    });
});