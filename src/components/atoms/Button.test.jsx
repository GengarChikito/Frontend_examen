import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button Component', () => {
    it('debería renderizar el texto correctamente', () => {
        render(<Button>Hacer Click</Button>);
        expect(screen.getByText('Hacer Click')).toBeInTheDocument();
    });

    it('debería ejecutar la función onClick al hacer clic', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Acción</Button>);

        fireEvent.click(screen.getByText('Acción'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('debería estar deshabilitado si se pasa la prop disabled', () => {
        render(<Button disabled>Bloqueado</Button>);
        const btn = screen.getByRole('button', { name: /Bloqueado/i });
        expect(btn).toBeDisabled();
    });
});