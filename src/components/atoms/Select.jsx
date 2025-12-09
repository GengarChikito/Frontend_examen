import React from 'react';

const Select = ({ label, name, value, onChange, options = [], disabled = false }) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-white text-sm font-bold mb-2 font-roboto uppercase tracking-wider">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`w-full bg-black border border-[#1E90FF] rounded-lg px-4 py-3 text-white appearance-none
                        focus:outline-none focus:shadow-[0_0_15px_#1E90FF] focus:border-[#39FF14] 
                        transition-all duration-300 font-roboto cursor-pointer
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {/* Flecha personalizada */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#1E90FF]">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Select;