import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
    const baseStyles = "font-bold font-orbitron py-2 px-6 rounded shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        success: 'bg-green-500 text-white hover:bg-green-600',
        // Nuevas variantes para el diseño Gamer
        'gamer-green': 'bg-[#39FF14] text-black hover:bg-green-400 shadow-[#39FF14]/30',
        'gamer-blue': 'bg-[#1E90FF] text-white hover:bg-blue-600 shadow-[#1E90FF]/30',
        'gamer-outline': 'bg-transparent border border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-black'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;