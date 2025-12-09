import React from 'react';

const Input = ({ label, type = "text", name, value, onChange, disabled = false, placeholder = "" }) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-white text-sm font-bold mb-2 font-roboto uppercase tracking-wider">
                    {label}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full bg-black border border-[#1E90FF] rounded-lg px-4 py-3 text-white 
                    focus:outline-none focus:shadow-[0_0_15px_#1E90FF] focus:border-[#39FF14] 
                    transition-all duration-300 font-roboto
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-700`}
            />
        </div>
    );
};

export default Input;