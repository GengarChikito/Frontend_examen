import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/organisms/Navbar';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Select from '../components/atoms/Select';

const AddUserPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        password: '',
        fechaNacimiento: '',
        role: 'cliente'
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', form);
            alert('✅ Usuario creado exitosamente');
            navigate('/dashboard'); // Opcional: navegar a una lista de usuarios si existiera
        } catch (error) {
            console.error(error);
            alert('❌ Error: ' + (error.response?.data?.message || 'No se pudo crear el usuario'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-20">
            <Navbar />
            <div className="container mx-auto p-6 flex justify-center mt-10">
                <div className="w-full max-w-xl bg-[#111] border-2 border-[#39FF14] rounded-2xl p-8 shadow-[0_0_30px_rgba(57,255,20,0.15)] relative overflow-hidden">

                    {/* Efecto decorativo */}
                    <div className="absolute top-0 left-0 w-40 h-40 bg-[#39FF14] opacity-5 blur-[80px] rounded-full pointer-events-none"></div>

                    <h2 className="text-3xl font-black font-orbitron text-white mb-8 text-center">
                        REGISTRAR <span className="text-[#1E90FF]">JUGADOR</span>
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input label="Nombre de Usuario" name="nombre" value={form.nombre} onChange={handleChange} placeholder="GamerTag" />

                        <Input label="Correo Electrónico" type="email" name="email" value={form.email} onChange={handleChange} placeholder="usuario@ejemplo.com" />

                        <Input label="Contraseña" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" />

                        <Input label="Fecha de Nacimiento" type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} />

                        <Select
                            label="Rol del Usuario"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            options={[
                                { value: 'cliente', label: 'Cliente (Jugador)' },
                                { value: 'admin', label: 'Administrador (Game Master)' }
                            ]}
                        />

                        <div className="pt-4">
                            <Button type="submit" variant="gamer-blue" className="w-full py-4 text-lg" disabled={loading}>
                                {loading ? 'Registrando...' : 'CREAR USUARIO'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUserPage;