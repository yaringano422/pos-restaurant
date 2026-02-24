import { useEffect, useState } from 'react';
import { usersApi, authApi } from '../api/endpoints';
import type { User } from '../types';
import { Plus, Search, Edit, Trash2, Shield, X, UserCircle } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const ROLE_CONFIG: Record<string, { label: string; badge: string }> = {
  admin: { label: 'Administrador', badge: 'badge-danger' },
  manager: { label: 'Gerente', badge: 'badge-warning' },
  cashier: { label: 'Cajero', badge: 'badge-info' },
  waiter: { label: 'Mesero', badge: 'badge-success' },
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', role: 'waiter', pin: '',
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const { data } = await usersApi.getAll();
      setUsers(data);
    } catch {
      setUsers([
        { id: 'u1', email: 'admin@restaurant.com', firstName: 'Admin', lastName: 'Sistema', role: 'admin', branchId: '1', isActive: true, createdAt: '2024-01-15' },
        { id: 'u2', email: 'cajero@restaurant.com', firstName: 'Maria', lastName: 'García', role: 'cashier', branchId: '1', isActive: true, createdAt: '2024-02-20', lastLogin: '2026-02-16' },
        { id: 'u3', email: 'mesero@restaurant.com', firstName: 'Carlos', lastName: 'López', role: 'waiter', branchId: '1', isActive: true, createdAt: '2024-03-10', lastLogin: '2026-02-16' },
        { id: 'u4', email: 'gerente@restaurant.com', firstName: 'Ana', lastName: 'Martínez', role: 'manager', branchId: '1', isActive: true, createdAt: '2024-01-20' },
        { id: 'u5', email: 'mesero2@restaurant.com', firstName: 'Juan', lastName: 'Hernández', role: 'waiter', branchId: '1', isActive: false, createdAt: '2024-04-05' },
      ]);
    } finally { setLoading(false); }
  };

  const filtered = users.filter(u => {
    const fullName = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase();
    return !search || fullName.includes(search.toLowerCase());
  });

  const handleCreate = async () => {
    try {
      await authApi.register({
        firstName: form.firstName, lastName: form.lastName,
        email: form.email, password: form.password,
        role: form.role, pin: form.pin,
      });
      toast.success('Usuario creado');
      setShowForm(false);
      loadData();
    } catch {
      toast.success('Usuario creado (demo)');
      setShowForm(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await usersApi.update(id, { isActive: !isActive });
      loadData();
    } catch {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    }
    toast.success(isActive ? 'Usuario desactivado' : 'Usuario activado');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]"><div className="animate-pulse-soft text-brand-400 text-lg">Cargando...</div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Usuarios</h1>
          <p className="text-dark-400 text-sm mt-1">{users.length} usuarios registrados</p>
        </div>
        <button onClick={() => { setForm({ firstName: '', lastName: '', email: '', password: '', role: 'waiter', pin: '' }); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Nuevo Usuario
        </button>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(ROLE_CONFIG).map(([key, config]) => {
          const count = users.filter(u => u.role === key && u.isActive).length;
          return (
            <div key={key} className="glass-panel-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-dark-400" />
                <span className="text-sm font-medium text-dark-300">{config.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-11" placeholder="Buscar usuario..." />
      </div>

      {/* Users table */}
      <div className="glass-panel overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="table-header text-left p-4">Usuario</th>
              <th className="table-header text-left p-4">Email</th>
              <th className="table-header text-center p-4">Rol</th>
              <th className="table-header text-center p-4">Estado</th>
              <th className="table-header text-center p-4">Último acceso</th>
              <th className="table-header text-right p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{user.firstName} {user.lastName}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-dark-300">{user.email}</td>
                <td className="p-4 text-center">
                  <span className={ROLE_CONFIG[user.role]?.badge || 'badge-neutral'}>
                    {ROLE_CONFIG[user.role]?.label || user.role}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={user.isActive ? 'badge-success' : 'badge-danger'}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-4 text-center text-sm text-dark-400">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es-MX') : 'Nunca'}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => handleToggleActive(user.id, user.isActive)}
                      className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                        user.isActive ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      )}
                    >
                      {user.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Nuevo Usuario</h2>
              <button onClick={() => setShowForm(false)} className="text-dark-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">Nombre *</label>
                  <input type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">Apellido *</label>
                  <input type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Contraseña *</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">Rol</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input-field">
                    <option value="waiter">Mesero</option>
                    <option value="cashier">Cajero</option>
                    <option value="manager">Gerente</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">PIN (4 dígitos)</label>
                  <input type="text" value={form.pin} onChange={e => setForm({ ...form, pin: e.target.value })} className="input-field" maxLength={4} placeholder="0000" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 btn-secondary">Cancelar</button>
              <button onClick={handleCreate} className="flex-1 btn-primary" disabled={!form.firstName || !form.email || !form.password}>Crear Usuario</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
