import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Select from './Select';

describe('Select Component', () => {
    const options = [
        { value: 'opcion1', label: 'Opción 1' },
        { value: 'opcion2', label: 'Opción 2' }
    ];

    it('debería renderizar el label y las opciones', () => {
        render(<Select label="Elige una opción" options={options} />);

        expect(screen.getByText('Elige una opción')).toBeInTheDocument();
        expect(screen.getByText('Opción 1')).toBeInTheDocument();
        expect(screen.getByText('Opción 2')).toBeInTheDocument();
    });

    it('debería llamar a onChange al seleccionar una opción', () => {
        const handleChange = vi.fn();
        render(<Select label="Test" options={options} onChange={handleChange} />);

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'opcion2' } });

        expect(handleChange).toHaveBeenCalled();
        expect(select.value).toBe('opcion2');
    });
});