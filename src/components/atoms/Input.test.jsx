import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from './Input';

describe('Input Component', () => {
    it('debería mostrar el label correctamente', () => {
        render(<Input label="Nombre de Usuario" name="user" />);
        expect(screen.getByText('Nombre de Usuario')).toBeInTheDocument();
    });

    it('debería permitir escribir y llamar a onChange', () => {
        const handleChange = vi.fn();
        render(<Input label="Test" placeholder="Escribe aquí" onChange={handleChange} />);

        const input = screen.getByPlaceholderText('Escribe aquí');
        fireEvent.change(input, { target: { value: 'Nuevo Valor' } });

        expect(handleChange).toHaveBeenCalled();
        expect(input.value).toBe('Nuevo Valor');
    });

    it('debería respetar el tipo de input (password)', () => {
        render(<Input label="Password" type="password" placeholder="***" />);
        const input = screen.getByPlaceholderText('***');
        expect(input).toHaveAttribute('type', 'password');
    });
});