import { useEffect, useState } from 'react';
import { ordersApi } from '../api/endpoints';
import type { Order } from '../types';
import { Search, Receipt, Clock, CheckCircle, XCircle, Eye, X, DollarSign } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const STATUS_CONFIG: Record<string, { label: string; badge: string; icon: any }> = {
  open: { label: 'Abierta', badge: 'badge-info', icon: Clock },
  in_progress: { label: 'En progreso', badge: 'badge-warning', icon: Clock },
  ready: { label: 'Lista', badge: 'badge-success', icon: CheckCircle },
  delivered: { label: 'Entregada', badge: 'badge-success', icon: CheckCircle },
  paid: { label: 'Pagada', badge: 'badge-success', icon: DollarSign },
  cancelled: { label: 'Cancelada', badge: 'badge-danger', icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const { data } = await ordersApi.getAll();
      setOrders(data);
    } catch {
      setOrders([
        { id: 'o1', orderNumber: 42, tableNumber: 2, tableName: 'Mesa 2', waiterName: 'Carlos López', status: 'in_progress', subtotal: 585.34, taxAmount: 93.65, discountAmount: 0, tipAmount: 0, total: 678.99, customerName: 'Juan Pérez', customerCount: 2, items: [
          { id: 'oi1', productId: 'p4', productName: 'Tacos al Pastor', quantity: 2, unitPrice: 160, taxRate: 16, taxAmount: 51.2, subtotal: 320, total: 371.2, status: 'pending', variants: [] },
          { id: 'oi2', productId: 'p12', productName: 'Margarita', quantity: 2, unitPrice: 120, taxRate: 16, taxAmount: 38.4, subtotal: 240, total: 278.4, status: 'pending', variants: [] },
        ], createdAt: '2026-02-16T19:30:00Z' },
        { id: 'o2', orderNumber: 43, tableNumber: 4, tableName: 'Mesa 4', waiterName: 'Carlos López', status: 'delivered', subtotal: 1077.59, taxAmount: 172.41, discountAmount: 0, tipAmount: 0, total: 1250, customerName: 'Familia Rodríguez', customerCount: 4, items: [
          { id: 'oi3', productId: 'p6', productName: 'Arrachera', quantity: 2, unitPrice: 280, taxRate: 16, taxAmount: 89.6, subtotal: 560, total: 649.6, status: 'pending', variants: [] },
          { id: 'oi4', productId: 'p1', productName: 'Guacamole con Totopos', quantity: 2, unitPrice: 120, taxRate: 16, taxAmount: 38.4, subtotal: 240, total: 278.4, status: 'pending', variants: [] },
        ], createdAt: '2026-02-16T18:45:00Z' },
        { id: 'o3', orderNumber: 44, tableNumber: 8, tableName: 'Mesa 8', waiterName: 'Maria García', status: 'open', subtotal: 293.10, taxAmount: 46.90, discountAmount: 0, tipAmount: 0, total: 340, customerCount: 1, items: [
          { id: 'oi5', productId: 'p7', productName: 'Salmón a la Plancha', quantity: 1, unitPrice: 320, taxRate: 16, taxAmount: 51.2, subtotal: 320, total: 371.2, status: 'pending', variants: [] },
        ], createdAt: '2026-02-16T20:00:00Z' },
        { id: 'o4', orderNumber: 41, status: 'paid', subtotal: 475, taxAmount: 76, discountAmount: 0, tipAmount: 50, total: 601, paymentMethod: 'card', customerName: 'Ana López', customerCount: 2, items: [], createdAt: '2026-02-16T14:20:00Z', paidAt: '2026-02-16T15:30:00Z' },
        { id: 'o5', orderNumber: 40, status: 'paid', subtotal: 890, taxAmount: 142.4, discountAmount: 50, tipAmount: 100, total: 1082.4, paymentMethod: 'cash', customerName: 'Roberto Díaz', customerCount: 3, items: [], createdAt: '2026-02-16T13:00:00Z', paidAt: '2026-02-16T14:15:00Z' },
      ]);
    } finally { setLoading(false); }
  };

  const filtered = orders.filter(o => {
    const matchesSearch = !search || `#${o.orderNumber} ${o.customerName || ''} ${o.tableName || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filterStatus || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  const formatTime = (date: string) => new Date(date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]"><div className="animate-pulse-soft text-brand-400 text-lg">Cargando...</div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Órdenes</h1>
          <p className="text-dark-400 text-sm mt-1">{orders.length} órdenes hoy</p>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus(null)}
          className={clsx('px-4 py-2 rounded-xl text-sm font-medium transition-all',
            !filterStatus ? 'bg-brand-600 text-white' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
          )}
        >
          Todas ({orders.length})
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const count = orders.filter(o => o.status === key).length;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={clsx('px-4 py-2 rounded-xl text-sm font-medium transition-all',
                filterStatus === key ? 'bg-brand-600 text-white' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
              )}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-11" placeholder="Buscar orden..." />
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map(order => {
          const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.open;
          const StatusIcon = config.icon;
          return (
            <div
              key={order.id}
              className="glass-panel-sm p-4 hover:border-dark-600 transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center">
                    <Receipt size={20} className="text-dark-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">Orden #{order.orderNumber}</h3>
                      <span className={config.badge}>{config.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-dark-400 mt-1">
                      {order.tableName && <span>🪑 {order.tableName}</span>}
                      {order.customerName && <span>👤 {order.customerName}</span>}
                      {order.waiterName && <span>🧑‍🍳 {order.waiterName}</span>}
                      <span>🕐 {formatTime(order.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-brand-400">{formatCurrency(order.total)}</p>
                  {order.paymentMethod && (
                    <p className="text-xs text-dark-400 capitalize mt-1">
                      {order.paymentMethod === 'cash' ? '💵 Efectivo' : order.paymentMethod === 'card' ? '💳 Tarjeta' : '🔄 Mixto'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 animate-scale-in max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Orden #{selectedOrder.orderNumber}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-dark-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <span className={STATUS_CONFIG[selectedOrder.status]?.badge}>{STATUS_CONFIG[selectedOrder.status]?.label}</span>
                {selectedOrder.tableName && <span className="badge-neutral">🪑 {selectedOrder.tableName}</span>}
                {selectedOrder.customerName && <span className="badge-neutral">👤 {selectedOrder.customerName}</span>}
              </div>

              {selectedOrder.items.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-dark-300">Productos</h3>
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between bg-dark-700/50 rounded-lg p-3">
                      <div>
                        <p className="text-sm font-medium text-white">{item.productName}</p>
                        <p className="text-xs text-dark-400">x{item.quantity} @ {formatCurrency(item.unitPrice)}</p>
                      </div>
                      <p className="text-sm font-semibold text-white">{formatCurrency(item.total)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-dark-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Subtotal</span>
                  <span className="text-white">{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">IVA</span>
                  <span className="text-white">{formatCurrency(selectedOrder.taxAmount)}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Descuento</span>
                    <span className="text-red-400">-{formatCurrency(selectedOrder.discountAmount)}</span>
                  </div>
                )}
                {selectedOrder.tipAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Propina</span>
                    <span className="text-emerald-400">{formatCurrency(selectedOrder.tipAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-dark-600">
                  <span className="text-white">Total</span>
                  <span className="text-brand-400">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedOrder(null)} className="w-full btn-secondary mt-6">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
