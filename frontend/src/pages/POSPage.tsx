import { useEffect, useState } from 'react';
import { productsApi, categoriesApi, ordersApi } from '../api/endpoints';
import { useCartStore } from '../store/cartStore';
import type { Product, Category } from '../types';
import {
  Search, Plus, Minus, Trash2, ShoppingBag, X,
  CreditCard, Banknote, Receipt, CheckCircle,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function POSPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mixed'>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [loading, setLoading] = useState(true);

  const cart = useCartStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        categoriesApi.getAll(),
        productsApi.getAll(),
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch {
      // Mock data
      setCategories([
        { id: '1', name: 'Entradas', icon: 'utensils', color: '#F59E0B', sortOrder: 1, productCount: 3, isActive: true },
        { id: '2', name: 'Platos Fuertes', icon: 'beef', color: '#EF4444', sortOrder: 2, productCount: 5, isActive: true },
        { id: '3', name: 'Bebidas', icon: 'coffee', color: '#3B82F6', sortOrder: 3, productCount: 5, isActive: true },
        { id: '4', name: 'Postres', icon: 'cake', color: '#EC4899', sortOrder: 4, productCount: 3, isActive: true },
        { id: '5', name: 'Ensaladas', icon: 'leaf', color: '#10B981', sortOrder: 5, productCount: 2, isActive: true },
      ]);
      setProducts([
        { id: 'p1', categoryId: '1', categoryName: 'Entradas', name: 'Guacamole con Totopos', price: 120, cost: 35, taxRate: 16, isAvailable: true, preparationTime: 10, variants: [], description: 'Guacamole fresco' },
        { id: 'p2', categoryId: '1', categoryName: 'Entradas', name: 'Quesadillas', price: 95, cost: 25, taxRate: 16, isAvailable: true, preparationTime: 8, variants: [], description: 'Con queso Oaxaca' },
        { id: 'p3', categoryId: '1', categoryName: 'Entradas', name: 'Sopa de Tortilla', price: 85, cost: 20, taxRate: 16, isAvailable: true, preparationTime: 5, variants: [], description: 'Con aguacate y crema' },
        { id: 'p4', categoryId: '2', categoryName: 'Platos Fuertes', name: 'Tacos al Pastor', price: 160, cost: 45, taxRate: 16, isAvailable: true, preparationTime: 15, variants: [], description: 'Orden de 4 tacos' },
        { id: 'p5', categoryId: '2', categoryName: 'Platos Fuertes', name: 'Enchiladas Suizas', price: 145, cost: 40, taxRate: 16, isAvailable: true, preparationTime: 12, variants: [], description: 'Enchiladas verdes' },
        { id: 'p6', categoryId: '2', categoryName: 'Platos Fuertes', name: 'Arrachera', price: 280, cost: 100, taxRate: 16, isAvailable: true, preparationTime: 20, variants: [], description: 'A la parrilla' },
        { id: 'p7', categoryId: '2', categoryName: 'Platos Fuertes', name: 'Salmón a la Plancha', price: 320, cost: 140, taxRate: 16, isAvailable: true, preparationTime: 18, variants: [], description: 'Con vegetales asados' },
        { id: 'p8', categoryId: '2', categoryName: 'Platos Fuertes', name: 'Mole Poblano', price: 195, cost: 55, taxRate: 16, isAvailable: true, preparationTime: 15, variants: [], description: 'Mole tradicional' },
        { id: 'p9', categoryId: '3', categoryName: 'Bebidas', name: 'Agua Fresca', price: 45, cost: 8, taxRate: 16, isAvailable: true, preparationTime: 2, variants: [], description: 'Horchata, Jamaica' },
        { id: 'p10', categoryId: '3', categoryName: 'Bebidas', name: 'Refresco', price: 35, cost: 10, taxRate: 16, isAvailable: true, preparationTime: 1, variants: [], description: 'Coca-Cola, Sprite' },
        { id: 'p11', categoryId: '3', categoryName: 'Bebidas', name: 'Cerveza Artesanal', price: 85, cost: 30, taxRate: 16, isAvailable: true, preparationTime: 1, variants: [], description: 'De barril' },
        { id: 'p12', categoryId: '3', categoryName: 'Bebidas', name: 'Margarita', price: 120, cost: 35, taxRate: 16, isAvailable: true, preparationTime: 5, variants: [], description: 'Clásica de limón' },
        { id: 'p13', categoryId: '3', categoryName: 'Bebidas', name: 'Café Americano', price: 45, cost: 8, taxRate: 16, isAvailable: true, preparationTime: 3, variants: [], description: 'De altura' },
        { id: 'p14', categoryId: '4', categoryName: 'Postres', name: 'Flan Napolitano', price: 75, cost: 18, taxRate: 16, isAvailable: true, preparationTime: 3, variants: [], description: 'Casero' },
        { id: 'p15', categoryId: '4', categoryName: 'Postres', name: 'Churros con Chocolate', price: 85, cost: 20, taxRate: 16, isAvailable: true, preparationTime: 8, variants: [], description: 'Con chocolate' },
        { id: 'p16', categoryId: '5', categoryName: 'Ensaladas', name: 'Ensalada César', price: 110, cost: 30, taxRate: 16, isAvailable: true, preparationTime: 5, variants: [], description: 'Con parmesano' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = !activeCategory || p.categoryId === activeCategory;
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch && p.isAvailable;
  });

  const formatCurrency = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  const handleAddToCart = (product: Product) => {
    cart.addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      taxRate: product.taxRate,
      variants: [],
    });
  };

  const handlePayment = async () => {
    if (cart.items.length === 0) return;

    try {
      const orderData = {
        tableId: cart.tableId,
        customerName: cart.customerName || 'Cliente',
        customerCount: cart.customerCount,
        notes: cart.notes,
        discountAmount: cart.discountAmount,
        items: cart.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          taxRate: item.taxRate,
          notes: item.notes,
          variants: item.variants,
        })),
      };

      const { data: order } = await ordersApi.create(orderData);

      // Process payment
      await ordersApi.pay(order.id, {
        paymentMethod,
        cashReceived: paymentMethod === 'cash' ? parseFloat(cashReceived) : undefined,
        changeAmount: paymentMethod === 'cash' ? parseFloat(cashReceived) - cart.getTotal() : undefined,
      });

      toast.success('¡Orden completada!');
      cart.clearCart();
      setShowPayment(false);
      setCashReceived('');
    } catch (error) {
      toast.success('¡Venta registrada! (modo demo)');
      cart.clearCart();
      setShowPayment(false);
      setCashReceived('');
    }
  };

  const changeAmount = paymentMethod === 'cash' && cashReceived
    ? parseFloat(cashReceived) - cart.getTotal()
    : 0;

  return (
    <div className="flex gap-4 h-[calc(100vh-7rem)] animate-fade-in">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search and categories */}
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-11"
              placeholder="Buscar producto..."
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveCategory(null)}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200',
                !activeCategory
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
              )}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200',
                  activeCategory === cat.id
                    ? 'text-white shadow-lg'
                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                )}
                style={activeCategory === cat.id ? { backgroundColor: cat.color || '#3b82f6', boxShadow: `0 4px 14px ${cat.color}33` } : {}}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 content-start">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => handleAddToCart(product)}
              className="glass-panel-sm p-4 text-left hover:border-brand-500/30 transition-all duration-200 active:scale-[0.97] group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-2 leading-tight">
                  {product.name}
                </h3>
              </div>
              {product.description && (
                <p className="text-xs text-dark-400 mb-3 line-clamp-1">{product.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-brand-400">{formatCurrency(product.price)}</span>
                <div className="w-8 h-8 bg-brand-600/20 rounded-lg flex items-center justify-center group-hover:bg-brand-600 transition-colors">
                  <Plus size={16} className="text-brand-400 group-hover:text-white" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-80 xl:w-96 glass-panel flex flex-col shrink-0">
        <div className="p-4 border-b border-dark-700">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white flex items-center gap-2">
              <ShoppingBag size={18} className="text-brand-400" />
              Orden Actual
            </h2>
            {cart.items.length > 0 && (
              <button onClick={cart.clearCart} className="text-xs text-dark-400 hover:text-red-400 transition-colors">
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-dark-500">
              <ShoppingBag size={48} className="mb-3 opacity-30" />
              <p className="text-sm">Agrega productos</p>
            </div>
          ) : (
            cart.items.map(item => (
              <div key={item.productId} className="bg-dark-700/50 rounded-xl p-3 animate-scale-in">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-white flex-1 pr-2">{item.productName}</h4>
                  <button
                    onClick={() => cart.removeItem(item.productId)}
                    className="text-dark-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => cart.updateQuantity(item.productId, item.quantity - 1)}
                      className="w-7 h-7 bg-dark-600 hover:bg-dark-500 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold text-white w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => cart.updateQuantity(item.productId, item.quantity + 1)}
                      className="w-7 h-7 bg-dark-600 hover:bg-dark-500 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-brand-400">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart totals */}
        {cart.items.length > 0 && (
          <div className="p-4 border-t border-dark-700 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Subtotal</span>
                <span className="text-white">{formatCurrency(cart.getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">IVA (16%)</span>
                <span className="text-white">{formatCurrency(cart.getTaxAmount())}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Descuento</span>
                  <span className="text-red-400">-{formatCurrency(cart.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-dark-600">
                <span className="text-white">Total</span>
                <span className="text-brand-400">{formatCurrency(cart.getTotal())}</span>
              </div>
            </div>

            <button
              onClick={() => setShowPayment(true)}
              className="w-full btn-success py-3 text-base flex items-center justify-center gap-2"
            >
              <Receipt size={18} />
              Cobrar
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Procesar Pago</h2>
              <button onClick={() => setShowPayment(false)} className="text-dark-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-dark-400 text-sm">Total a cobrar</p>
              <p className="text-4xl font-bold text-brand-400 mt-1">{formatCurrency(cart.getTotal())}</p>
            </div>

            {/* Payment method selection */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { id: 'cash' as const, icon: Banknote, label: 'Efectivo' },
                { id: 'card' as const, icon: CreditCard, label: 'Tarjeta' },
                { id: 'mixed' as const, icon: Receipt, label: 'Mixto' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={clsx(
                    'p-4 rounded-xl border transition-all duration-200 text-center',
                    paymentMethod === method.id
                      ? 'bg-brand-600/10 border-brand-500 text-brand-400'
                      : 'bg-dark-800 border-dark-600 text-dark-300 hover:border-dark-500'
                  )}
                >
                  <method.icon size={24} className="mx-auto mb-2" />
                  <span className="text-xs font-medium">{method.label}</span>
                </button>
              ))}
            </div>

            {/* Cash input */}
            {paymentMethod === 'cash' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-300 mb-2">Efectivo recibido</label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={e => setCashReceived(e.target.value)}
                  className="input-field text-2xl text-center font-bold"
                  placeholder="$0.00"
                  autoFocus
                />
                {cashReceived && changeAmount >= 0 && (
                  <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                    <p className="text-sm text-dark-300">Cambio:</p>
                    <p className="text-2xl font-bold text-emerald-400">{formatCurrency(changeAmount)}</p>
                  </div>
                )}

                {/* Quick amounts */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[50, 100, 200, 500].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setCashReceived(String(Math.ceil(cart.getTotal() / amount) * amount))}
                      className="py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm font-medium text-dark-200 transition-colors"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < cart.getTotal())}
              className="w-full btn-success py-3 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={18} />
              Confirmar Pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
