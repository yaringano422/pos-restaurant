import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/endpoints';
import type { DashboardSummary } from '../types';
import {
  DollarSign, ShoppingCart, TrendingUp, AlertTriangle,
  Users, CreditCard, Banknote, BarChart3,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: summary } = await dashboardApi.getSummary();
      setData(summary);
    } catch (error) {
      // Use mock data when API is unavailable
      setData({
        today: { totalOrders: 47, totalRevenue: 28450.50, totalTax: 4552.08, totalTips: 2845.00, avgTicket: 605.33 },
        ordersByStatus: { paid: 42, open: 3, in_progress: 2 },
        topProducts: [
          { name: 'Tacos al Pastor', quantity: 32, revenue: 5120 },
          { name: 'Arrachera', quantity: 18, revenue: 5040 },
          { name: 'Margarita', quantity: 28, revenue: 3360 },
          { name: 'Enchiladas Suizas', quantity: 15, revenue: 2175 },
          { name: 'Guacamole', quantity: 20, revenue: 2400 },
        ],
        hourlySales: [
          { hour: 11, orders: 3, revenue: 1800 },
          { hour: 12, orders: 8, revenue: 4800 },
          { hour: 13, orders: 12, revenue: 7200 },
          { hour: 14, orders: 9, revenue: 5400 },
          { hour: 15, orders: 4, revenue: 2400 },
          { hour: 18, orders: 5, revenue: 3000 },
          { hour: 19, orders: 8, revenue: 4800 },
          { hour: 20, orders: 10, revenue: 6000 },
          { hour: 21, orders: 7, revenue: 4200 },
        ],
        paymentBreakdown: [
          { method: 'cash', count: 20, total: 12100 },
          { method: 'card', count: 25, total: 15350 },
          { method: 'mixed', count: 2, total: 1000 },
        ],
        tablesStatus: { available: 6, occupied: 3, reserved: 1 },
        lowStockCount: 3,
        weeklyRevenue: [
          { date: '2026-02-10', orders: 38, revenue: 22800 },
          { date: '2026-02-11', orders: 42, revenue: 25200 },
          { date: '2026-02-12', orders: 35, revenue: 21000 },
          { date: '2026-02-13', orders: 50, revenue: 30000 },
          { date: '2026-02-14', orders: 65, revenue: 39000 },
          { date: '2026-02-15', orders: 48, revenue: 28800 },
          { date: '2026-02-16', orders: 47, revenue: 28450 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-pulse-soft text-brand-400 text-lg">Cargando dashboard...</div>
      </div>
    );
  }

  if (!data) return null;

  const formatCurrency = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-dark-400 text-sm mt-1">Resumen de ventas del día</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-brand-500/10 rounded-xl flex items-center justify-center">
              <DollarSign size={22} className="text-brand-400" />
            </div>
            <span className="badge-success">Hoy</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(data.today.totalRevenue)}</p>
          <p className="text-sm text-dark-400 mt-1">Ingresos Totales</p>
        </div>

        <div className="stat-card animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <ShoppingCart size={22} className="text-purple-400" />
            </div>
            <span className="badge-info">{data.ordersByStatus.open || 0} abiertas</span>
          </div>
          <p className="text-2xl font-bold text-white">{data.today.totalOrders}</p>
          <p className="text-sm text-dark-400 mt-1">Órdenes del Día</p>
        </div>

        <div className="stat-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp size={22} className="text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(data.today.avgTicket)}</p>
          <p className="text-sm text-dark-400 mt-1">Ticket Promedio</p>
        </div>

        <div className="stat-card animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <AlertTriangle size={22} className="text-amber-400" />
            </div>
            {data.lowStockCount > 0 && <span className="badge-warning">{data.lowStockCount} alertas</span>}
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(data.today.totalTips)}</p>
          <p className="text-sm text-dark-400 mt-1">Propinas Totales</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Revenue */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-brand-400" />
            Ingresos de la Semana
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.weeklyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={(v) => new Date(v).toLocaleDateString('es-MX', { weekday: 'short' })}
                stroke="#475569"
                fontSize={12}
              />
              <YAxis stroke="#475569" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }}
                formatter={(value: number) => [formatCurrency(value), 'Ingresos']}
                labelFormatter={(v) => new Date(v).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' })}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment breakdown */}
        <div className="glass-panel p-6">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-purple-400" />
            Métodos de Pago
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data.paymentBreakdown}
                dataKey="total"
                nameKey="method"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
              >
                {data.paymentBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }}
                formatter={(value: number) => [formatCurrency(value)]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {data.paymentBreakdown.map((p, i) => (
              <div key={p.method} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-dark-300 capitalize flex items-center gap-1">
                    {p.method === 'cash' ? <><Banknote size={14} /> Efectivo</> :
                     p.method === 'card' ? <><CreditCard size={14} /> Tarjeta</> : 'Mixto'}
                  </span>
                </div>
                <span className="text-white font-medium">{formatCurrency(p.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top products */}
        <div className="glass-panel p-6">
          <h3 className="text-base font-semibold text-white mb-4">🔥 Productos Más Vendidos</h3>
          <div className="space-y-3">
            {data.topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center text-sm font-bold text-dark-300">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-dark-400">{p.quantity} vendidos</p>
                </div>
                <p className="text-sm font-semibold text-emerald-400">{formatCurrency(p.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly sales */}
        <div className="glass-panel p-6">
          <h3 className="text-base font-semibold text-white mb-4">📊 Ventas por Hora</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.hourlySales}>
              <XAxis dataKey="hour" stroke="#475569" fontSize={12} tickFormatter={(h) => `${h}:00`} />
              <YAxis stroke="#475569" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }}
                formatter={(value: number) => [formatCurrency(value), 'Ingresos']}
                labelFormatter={(h) => `${h}:00 hrs`}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables status */}
      <div className="glass-panel p-6">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Users size={18} className="text-cyan-400" />
          Estado de Mesas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-dark-700/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-emerald-400">{data.tablesStatus.available || 0}</p>
            <p className="text-sm text-dark-400 mt-1">Disponibles</p>
          </div>
          <div className="bg-dark-700/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-amber-400">{data.tablesStatus.occupied || 0}</p>
            <p className="text-sm text-dark-400 mt-1">Ocupadas</p>
          </div>
          <div className="bg-dark-700/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">{data.tablesStatus.reserved || 0}</p>
            <p className="text-sm text-dark-400 mt-1">Reservadas</p>
          </div>
          <div className="bg-dark-700/50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-dark-400">{data.tablesStatus.maintenance || 0}</p>
            <p className="text-sm text-dark-400 mt-1">Mantenimiento</p>
          </div>
        </div>
      </div>
    </div>
  );
}
