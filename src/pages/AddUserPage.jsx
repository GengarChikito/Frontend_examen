import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/organisms/Navbar';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import { DeleteOutlined, EditOutlined, UserAddOutlined, TrophyOutlined } from '@ant-design/icons';

const AddUserPage = () => {
    // --- ESTADOS ---
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estado para saber si estamos editando o creando
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Estado del Formulario
    const initialFormState = {
        nombre: '',
        email: '',
        password: '', // Solo obligatorio al crear
        fechaNacimiento: '',
        role: 'cliente',
        puntosLevelUp: 0
    };
    const [formData, setFormData] = useState(initialFormState);

    // --- CARGAR USUARIOS (READ) ---
    const fetchUsuarios = async () => {
        try {
            const { data } = await api.get('/usuarios');
            setUsuarios(data);
        } catch (error) {
            console.error("Error al cargar usuarios", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsuarios(); }, []);

    // --- MANEJADORES DEL FORMULARIO ---
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // ACTUALIZAR (PATCH)
                // Quitamos la password del objeto si está vacía para no sobrescribirla
                const { password, ...updateData } = formData;
                await api.patch(`/usuarios/${editingId}`, updateData);
                alert('✅ Usuario actualizado correctamente');
            } else {
                // CREAR (POST)
                // Usamos el endpoint de registro que ya tienes configurado
                await api.post('/auth/register', formData);
                alert('🎉 Usuario creado exitosamente');
            }

            // Limpiar y recargar
            setFormData(initialFormState);
            setIsEditing(false);
            fetchUsuarios();
        } catch (error) {
            console.error(error);
            alert('❌ Error: ' + (error.response?.data?.message || 'Verifica los datos'));
        }
    };

    // --- MANEJADORES DE LA TABLA ---
    const handleEdit = (user) => {
        setIsEditing(true);
        setEditingId(user.id);

        // Rellenar formulario con datos del usuario seleccionado
        setFormData({
            nombre: user.nombre,
            email: user.email,
            password: '', // La contraseña no se trae por seguridad
            fechaNacimiento: user.fechaNacimiento ? user.fechaNacimiento.split('T')[0] : '',
            role: user.role,
            puntosLevelUp: user.puntosLevelUp
        });

        // Scroll suave hacia el formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('⚠ ¿Estás seguro de eliminar este usuario permanentemente?')) return;
        try {
            await api.delete(`/usuarios/${id}`);
            alert('🗑️ Usuario eliminado');
            fetchUsuarios();
        } catch (error) {
            alert('❌ Error al eliminar usuario');
        }
    };

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-orbitron">CARGANDO...</div>;

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-20">
            <Navbar />

            <div className="container mx-auto px-4 mt-8">

                {/* --- SECCIÓN SUPERIOR: FORMULARIO --- */}
                <div className="max-w-4xl mx-auto bg-[#111] border border-[#1E90FF] rounded-2xl p-8 shadow-[0_0_20px_rgba(30,144,255,0.2)] mb-16">
                    <h2 className="text-3xl font-black font-orbitron text-white mb-6 text-center border-b border-gray-800 pb-4">
                        {isEditing ? 'EDITAR' : 'REGISTRAR'} <span className="text-[#1E90FF]">USUARIO</span>
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Nombre de Usuario" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Ej: GamerOne" />
                        <Input label="Correo Electrónico" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="correo@duoc.cl" disabled={isEditing} />

                        {/* El campo password solo es obligatorio al crear */}
                        {!isEditing && (
                            <Input label="Contraseña" type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="******" />
                        )}

                        <Input label="Fecha Nacimiento" type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} />

                        {/* Select de Rol */}
                        <div>
                            <label className="block text-white text-sm font-bold mb-2 font-roboto uppercase tracking-wider">Rol</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full bg-black border border-[#1E90FF] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                            >
                                <option value="cliente">Cliente</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>

                        <Input label="Puntos XP Iniciales" type="number" name="puntosLevelUp" value={formData.puntosLevelUp} onChange={handleInputChange} />

                        <div className="md:col-span-2 flex gap-4 mt-4">
                            {isEditing && (
                                <Button type="button" onClick={() => { setIsEditing(false); setFormData(initialFormState); }} variant="gamer-outline" className="flex-1">
                                    CANCELAR EDICIÓN
                                </Button>
                            )}
                            <Button type="submit" variant="gamer-green" className="flex-1 flex justify-center items-center gap-2">
                                {isEditing ? <EditOutlined /> : <UserAddOutlined />}
                                {isEditing ? 'GUARDAR CAMBIOS' : 'CREAR USUARIO'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* --- SECCIÓN INFERIOR: LISTA DE USUARIOS --- */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-4xl font-black font-orbitron text-white flex items-center gap-3">
                            <span className="text-[#39FF14]">///</span> LISTA DE JUGADORES
                        </h2>
                        <span className="bg-[#39FF14] text-black font-bold px-4 py-1 rounded-full border border-white">
                            Total: {usuarios.length}
                        </span>
                    </div>

                    {/* TABLA DE DATOS */}
                    <div className="overflow-x-auto rounded-xl border border-gray-800 shadow-2xl bg-[#0a0a0a]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-[#1a1a1a] text-[#1E90FF] font-orbitron text-sm uppercase tracking-wider">
                                <th className="p-4 border-b border-gray-700">ID</th>
                                <th className="p-4 border-b border-gray-700">Usuario</th>
                                <th className="p-4 border-b border-gray-700">Correo</th>
                                <th className="p-4 border-b border-gray-700">Rol</th>
                                <th className="p-4 border-b border-gray-700 text-center">Nivel XP</th>
                                <th className="p-4 border-b border-gray-700 text-center">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                            {usuarios.map((user) => (
                                <tr key={user.id} className="hover:bg-[#111] transition-colors group">
                                    <td className="p-4 text-gray-500 font-mono">#{user.id}</td>

                                    <td className="p-4 font-bold text-white">
                                        {user.nombre}
                                        {user.esEstudianteDuoc && (
                                            <span className="ml-2 text-[#39FF14] text-[10px] border border-[#39FF14] px-1 rounded uppercase">
                                                    Duoc
                                                </span>
                                        )}
                                    </td>

                                    <td className="p-4 text-gray-400">{user.email}</td>

                                    <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                                                user.role === 'admin'
                                                    ? 'border-red-500 text-red-400 bg-red-900/20'
                                                    : 'border-blue-500 text-blue-400 bg-blue-900/20'
                                            }`}>
                                                {user.role}
                                            </span>
                                    </td>

                                    <td className="p-4 text-center text-[#39FF14] font-mono font-bold">
                                        <TrophyOutlined /> {user.puntosLevelUp}
                                    </td>

                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-blue-500 hover:text-white bg-blue-500/10 p-2 rounded transition-colors"
                                                title="Editar"
                                            >
                                                <EditOutlined />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-500 hover:text-white bg-red-500/10 p-2 rounded transition-colors"
                                                title="Eliminar"
                                            >
                                                <DeleteOutlined />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {usuarios.length === 0 && (
                        <div className="text-center py-10 text-gray-500 border border-dashed border-gray-800 mt-4 rounded-xl">
                            No hay usuarios registrados.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddUserPage;