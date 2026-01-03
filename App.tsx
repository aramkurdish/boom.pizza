
import React, { useState, useEffect } from 'react';
import { MenuItem, CartItem, Category, OrderDetails } from './types.js';
import { MENU_ITEMS, CATEGORIES, UI_TEXT } from './constants.js';
import ProductCard from './components/ProductCard.js';
import CartDrawer from './components/CartDrawer.js';
import OrderForm from './components/OrderForm.js';
import DriverSummary from './components/DriverSummary.js';
import AdminDashboard from './components/AdminDashboard.js';
import { db } from './firebase.js';

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = [
    { label: 'لیستی خواردن' },
    { label: 'زانیارییەکان' },
    { label: 'تەواوکردن' }
  ];
  
  return (
    <div className="flex items-center justify-center gap-4 mb-10 mt-4 px-4">
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${idx + 1 <= currentStep ? 'bg-[#FF6600] text-white neon-shadow' : 'bg-white/10 text-gray-500 border border-white/10'}`}>
              {idx + 1}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${idx + 1 <= currentStep ? 'text-[#FF6600]' : 'text-gray-600'}`}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`h-[2px] w-12 rounded-full transition-all duration-700 ${idx + 1 < currentStep ? 'bg-[#FF6600]' : 'bg-white/5'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<'menu' | 'checkout' | 'summary' | 'admin'>('menu');
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const menuRef = db.ref("menu");
    const handleData = (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })) as MenuItem[];
        setMenu(items);
      } else {
        setMenu(MENU_ITEMS);
      }
      setIsLoading(false);
    };
    menuRef.on("value", handleData);
    return () => menuRef.off("value", handleData);
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0);
  const filteredItems = activeCategory === 'All' ? menu : menu.filter(i => i.category === activeCategory);

  const handleOrderComplete = async (order: OrderDetails) => {
    try {
      const newOrderRef = db.ref("orders").push();
      await newOrderRef.set({ ...order, timestamp: Date.now() });
      setCompletedOrder(order);
      setCart([]);
      setView('summary');
    } catch (e) {
      setCompletedOrder(order);
      setView('summary');
    }
  };

  const currentStep = view === 'menu' ? 1 : view === 'checkout' ? 2 : 3;

  return (
    <div className="min-h-screen bg-[#000000] text-white pb-24 md:pb-0 selection:bg-[#FF6600]/30 selection:text-[#FF6600]">
      <header className="sticky top-0 z-40 glass border-b border-white/5 px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button onClick={() => setView('menu')} className="group flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6600] rounded-xl flex items-center justify-center neon-shadow-strong group-hover:scale-110 transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div className="flex flex-col items-start leading-none">
              <h1 className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase neon-text">
                BOOM'S <span className="text-[#FF6600]">PIZZA</span>
              </h1>
            </div>
          </button>
          
          <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-90 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF6600]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF6600] text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-black">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        {view !== 'admin' && <StepIndicator currentStep={currentStep} />}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="pizza-loader"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest animate-pulse">بەستنەوە...</p>
          </div>
        ) : (
          <>
            {view === 'menu' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="mb-12 text-center">
                  <h2 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter italic uppercase">
                    TASTE THE <br/> <span className="text-[#FF6600] neon-text">ORANGE FIRE</span>
                  </h2>
                  <p className="text-gray-500 max-w-lg mx-auto">باشترین جۆرەکانی پیتزا و بەرگر بە تامی ڕاستەقینە</p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar sticky top-[80px] z-30 bg-black/80 backdrop-blur-md -mx-4 px-4 py-2">
                  <button onClick={() => setActiveCategory('All')} className={`px-6 py-3 rounded-xl font-bold transition-all border ${activeCategory === 'All' ? 'bg-[#FF6600] border-[#FF6600] text-white neon-shadow' : 'bg-white/5 border-white/10 text-gray-500'}`}>هەمووی</button>
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setActiveCategory(cat.id as Category)} className={`px-6 py-3 rounded-xl font-bold transition-all border whitespace-nowrap ${activeCategory === cat.id ? 'bg-[#FF6600] border-[#FF6600] text-white neon-shadow' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 mt-4">
                  {filteredItems.map(item => <ProductCard key={item.id} item={item} onAdd={addToCart} />)}
                </div>
              </div>
            )}

            {view === 'checkout' && <OrderForm cartItems={cart} total={cartTotal} onBack={() => setView('menu')} onComplete={handleOrderComplete} />}
            {view === 'summary' && completedOrder && <DriverSummary order={completedOrder} onBack={() => setView('menu')} />}
            {view === 'admin' && <AdminDashboard menu={menu} onBack={() => setView('menu')} />}
          </>
        )}
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onUpdateQty={updateQuantity} onRemove={(id) => setCart(c => c.filter(i => i.id !== id))} total={cartTotal} onCheckout={() => { setIsCartOpen(false); setView('checkout'); }} />

      <nav className="fixed bottom-0 left-0 right-0 z-[60] glass border-t border-white/10 md:hidden">
        <div className="flex justify-around items-center h-20 px-4">
          <button onClick={() => setView('menu')} className={`flex flex-col items-center gap-1 transition-all ${view === 'menu' ? 'text-[#FF6600]' : 'text-gray-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="text-[10px] font-bold">لیست</span>
          </button>
          <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 text-gray-500 relative">
            <div className="w-12 h-12 bg-[#FF6600] rounded-full flex items-center justify-center -mt-8 neon-shadow-strong border-4 border-black text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
          </button>
          <button onClick={() => setView('admin')} className={`flex flex-col items-center gap-1 transition-all ${view === 'admin' ? 'text-[#FF6600]' : 'text-gray-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span className="text-[10px] font-bold">ئەدمین</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
