import '@testing-library/jest-dom';

// Limpieza automática después de cada test (opcional pero recomendado)
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
    cleanup();
});