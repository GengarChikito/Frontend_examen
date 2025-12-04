import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/organisms/Navbar';

const AddUserPage = () => {
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null); // ID del usuario que se está editando (null = creando)

    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        role: 'vendedor'
    });

    // 1. Cargar usuarios al entrar
    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/usuarios');
            setUsers(data);
        } catch (error) {
            console.error('Error cargando usuarios', error);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // Manejar inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. ENVIAR FORMULARIO (Crear o Editar)
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                // MODO EDICIÓN: Usamos PATCH
                // Si la contraseña está vacía, la quitamos para no sobrescribirla
                const payload = { ...formData };
                if (!payload.password) delete payload.password;

                await api.patch(`/usuarios/${editingId}`, payload);
                alert('✅ Usuario actualizado correctamente');
            } else {
                // MODO CREACIÓN: Usamos POST
                await api.post('/auth/register', formData);
                alert('✅ Usuario creado exitosamente');
            }

            // Resetear formulario y recargar lista
            setFormData({ nombre: '', email: '', password: '', role: 'vendedor' });
            setEditingId(null);
            fetchUsers();

        } catch (error) {
            console.error(error);
            alert('❌ Error: ' + (error.response?.data?.message || 'Verifica los datos'));
        }
    };

    // 3. PREPARAR EDICIÓN (Llenar formulario)
    const handleEdit = (user) => {
        setEditingId(user.id);
        setFormData({
            nombre: user.nombre,
            email: user.email,
            password: '', // Dejar vacía por seguridad
            role: user.role
        });
        // Scroll suave hacia arriba
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 4. ELIMINAR USUARIO
    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
        try {
            await api.delete(`/usuarios/${id}`);
            alert('Usuario eliminado');
            fetchUsers();
        } catch (error) {
            alert('Error al eliminar');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({ nombre: '', email: '', password: '', role: 'vendedor' });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <Navbar />

            <div className="container mx-auto p-6 max-w-4xl">

                {/* === SECCIÓN FORMULARIO === */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-10">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                        {editingId ? '✏️ Editar Usuario' : '👤 Registrar Nuevo Usuario'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Nombre</label>
                                <input
                                    type="text" name="nombre" required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    value={formData.nombre} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Email</label>
                                <input
                                    type="email" name="email" required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    value={formData.email} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">
                                    {editingId ? 'Nueva Contraseña (Opcional)' : 'Contraseña'}
                                </label>
                                <input
                                    type="password" name="password"
                                    required={!editingId} // Solo obligatoria al crear
                                    minLength="4"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder={editingId ? "Dejar en blanco para mantener" : "••••••••"}
                                    value={formData.password} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Rol</label>
                                <select
                                    name="role"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    onChange={handleChange} value={formData.role}
                                >
                                    <option value="vendedor">Vendedor</option>
                                    <option value="admin">Administrador</option>

                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                type="submit"
                                className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${
                                    editingId ? 'bg-orange-500 hover:bg-orange-400' : 'bg-indigo-600 hover:bg-indigo-500'
                                }`}
                            >
                                {editingId ? 'Actualizar Usuario' : 'Crear Usuario'}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-3 rounded-xl font-bold bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* === SECCIÓN LISTA DE USUARIOS === */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800">📋 Usuarios Registrados</h3>
                    </div>

                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="p-4 font-semibold text-sm">ID</th>
                            <th className="p-4 font-semibold text-sm">Nombre</th>
                            <th className="p-4 font-semibold text-sm">Email</th>
                            <th className="p-4 font-semibold text-sm">Rol</th>
                            <th className="p-4 font-semibold text-sm text-right">Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-slate-500">#{user.id}</td>
                                <td className="p-4 font-medium text-slate-800">{user.nombre}</td>
                                <td className="p-4 text-slate-600">{user.email}</td>
                                <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'vendedor' ? 'bg-blue-100 text-blue-700' :
                                            'bg-green-100 text-green-700'
                                }`}>
                                    {user.role.toUpperCase()}
                                </span>
                                </td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default AddUserPage;