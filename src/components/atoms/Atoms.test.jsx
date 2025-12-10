import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';
import Input from './Input';
import Select from './Select';

describe('Componentes Atómicos', () => {

    // --- TEST PARA BUTTON ---
    describe('Button', () => {
        it('debería renderizar el texto y manejar el click', () => {
            const handleClick = vi.fn();
            render(<Button onClick={handleClick}>Acción</Button>);

            const btn = screen.getByRole('button', { name: /Acción/i });
            expect(btn).toBeInTheDocument();

            fireEvent.click(btn);
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('debería aplicar estilos de deshabilitado si disabled es true', () => {
            render(<Button disabled>Bloqueado</Button>);
            const btn = screen.getByRole('button', { name: /Bloqueado/i });
            expect(btn).toBeDisabled();
        });
    });

    // --- TEST PARA INPUT ---
    describe('Input', () => {
        it('debería mostrar el label y permitir escribir', () => {
            const handleChange = vi.fn();
            render(
                <Input
                    label="Usuario"
                    name="user"
                    placeholder="Escribe aquí"
                    onChange={handleChange}
                />
            );

            // Verificar Label
            expect(screen.getByText('Usuario')).toBeInTheDocument();

            // Verificar Input por placeholder
            const input = screen.getByPlaceholderText('Escribe aquí');
            fireEvent.change(input, { target: { value: 'Gamer123' } });

            expect(handleChange).toHaveBeenCalled();
            expect(input.value).toBe('Gamer123');
        });

        it('debería ser del tipo correcto (password/number)', () => {
            render(<Input label="Pass" type="password" placeholder="***" />);
            const input = screen.getByPlaceholderText('***');
            expect(input).toHaveAttribute('type', 'password');
        });
    });

    // --- TEST PARA SELECT ---
    describe('Select', () => {
        const options = [
            { value: 'cat1', label: 'Categoría 1' },
            { value: 'cat2', label: 'Categoría 2' }
        ];

        it('debería renderizar las opciones y detectar cambios', () => {
            const handleChange = vi.fn();
            render(
                <Select
                    label="Selecciona"
                    name="categoria"
                    options={options}
                    onChange={handleChange}
                />
            );

            expect(screen.getByText('Selecciona')).toBeInTheDocument();

            // Buscar el combobox (select)
            // Nota: Si tu componente Select usa un <select> nativo HTML:
            const selectElement = screen.getByRole('combobox');

            // Verificar que las opciones están dentro
            expect(screen.getByText('Categoría 1')).toBeInTheDocument();
            expect(screen.getByText('Categoría 2')).toBeInTheDocument();

            // Simular cambio
            fireEvent.change(selectElement, { target: { value: 'cat2' } });
            expect(handleChange).toHaveBeenCalled();
            expect(selectElement.value).toBe('cat2');
        });
    });
});