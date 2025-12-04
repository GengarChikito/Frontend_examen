import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary' }) => {
    const styles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        success: 'bg-green-500 text-white hover:bg-green-600',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 rounded shadow ${styles[variant]} transition-colors`}
        >
            {children}
        </button>
    );
};

export default Button;