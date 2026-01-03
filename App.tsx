
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${idx + 1 <= currentStep ? 'bg-[#FF0000] text-white neon-shadow' : 'bg-white/10 text-gray-500 border border-white/10'}`}>
              {idx + 1}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${idx + 1 <= currentStep ? 'text-[#FF0000]' : 'text-gray-600'}`}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`h-[2px] w-12 rounded-full transition-all duration-700 ${idx + 1 < currentStep ? 'bg-[#FF0000]' : 'bg-white/5'}`} />
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
    // Using Compat syntax: db.ref('path').on('value', ...)
    const menuRef = db.ref("menu");
    
    menuRef.on("value", (snapshot: any) => {
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
    }, (error: any) => {
      console.error("Firebase Read Error:", error);
      setMenu(MENU_ITEMS);
      setIsLoading(false);
    });

    return () => menuRef.off();
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

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
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

  const filteredItems = activeCategory === 'All' 
    ? menu 
    : menu.filter(i => i.category === activeCategory);

  const handleOrderComplete = async (order: OrderDetails) => {
    try {
      const newOrderRef = db.ref("orders").push();
      await newOrderRef.set({ ...order, timestamp: Date.now() });
      setCompletedOrder(order);
      setCart([]);
      setView('summary');
    } catch (error) {
      console.error("Failed to save order:", error);
      setCompletedOrder(order);
      setCart([]);
      setView('summary');
    }
  };

  const navigateToMenu = () => {
    setView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentStep = view === 'menu' ? 1 : view === 'checkout' ? 2 : 3;

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#FF0000]/30 selection:text-[#FF0000] pb-24 md:pb-0">
      <div className="fixed top-0 left-0 w-full h-1 bg-[#FF0000] z-[100]"></div>
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-[#FF0000]/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      
      <header className="sticky top-0 z-40 glass border-b border-white/5 px-4 py-3 md:py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button onClick={navigateToMenu} className="group flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FF0000] rounded-xl md:rounded-2xl flex items-center justify-center neon-shadow-strong group-hover:scale-110 transition-all duration-300 transform group-active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div className="flex flex-col items-start leading-none">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic neon-text">
                BOOM'S <span className="text-[#FF0000]">PIZZA</span>
              </h1>
              <span className="text-[8px] md:text-[10px] text-gray-500 font-black tracking-[0.4em] mr-1 uppercase">{UI_TEXT.appName}</span>
            </div>
          </button>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-90 group hidden md:block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF0000] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF0000] text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full neon-shadow border-2 border-black">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-4 md:pt-0">
        {view !== 'admin' && <StepIndicator currentStep={currentStep} />}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-16 h-16 border-4 border-[#FF0000]/20 border-t-[#FF0000] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest animate-pulse">بەستنەوە بە فایەربەیس...</p>
          </div>
        ) : (
          <div className="will-change-contents">
            {view === 'menu' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="mb-10 md:mb-16 text-center">
                  <div className="inline-block px-4 py-1 rounded-full bg-[#FF0000]/10 border border-[#FF0000]/20 text-[#FF0000] text-[10px] font-black tracking-widest uppercase mb-6 animate-float">
                    خۆشترین تام لێرەیە
                  </div>
                  <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none italic uppercase">
                    TASTE THE <br/> <span className="text-[#FF0000] neon-text">FIRE</span>
                  </h2>
                  <p className="text-gray-500 text-base md:text-xl font-medium max-w-xl mx-auto leading-relaxed px-4">
                    باشترین جۆرەکانی پیتزا و بەرگر بە کوالێتییەکی ناوازە و تامی ڕاستەقینە
                  </p>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar sticky top-[65px] md:top-[89px] z-30 bg-black/60 backdrop-blur-xl -mx-4 px-4 pt-2">
                  <button
                    onClick={() => setActiveCategory('All')}
                    className={`px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl whitespace-nowrap font-black transition-all duration-300 border uppercase tracking-wider text-sm md:text-base ${activeCategory === 'All' ? 'bg-[#FF0000] border-[#FF0000] text-white neon-shadow-strong scale-105' : 'bg-white/5 border-white/10 text-gray-500'}`}
                  >
                    هەمووی
                  </button>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id as Category)}
                      className={`px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl whitespace-nowrap font-black transition-all duration-300 border uppercase tracking-wider text-sm md:text-base ${activeCategory === cat.id ? 'bg-[#FF0000] border-[#FF0000] text-white neon-shadow-strong scale-105' : 'bg-white/5 border-white/10 text-gray-500'}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-6 pb-20">
                  {filteredItems.map(item => (
                    <ProductCard key={item.id} item={item} onAdd={addToCart} />
                  ))}
                </div>
              </div>
            )}

            {view === 'checkout' && (
              <div className="animate-in fade-in slide-in-from-left-8 duration-500 pb-20">
                <OrderForm 
                  cartItems={cart} 
                  total={cartTotal} 
                  onBack={() => setView('menu')} 
                  onComplete={handleOrderComplete}
                />
              </div>
            )}

            {view === 'summary' && completedOrder && (
              <div className="animate-in zoom-in-95 duration-500 pb-20">
                <DriverSummary 
                  order={completedOrder} 
                  onBack={navigateToMenu} 
                />
              </div>
            )}

            {view === 'admin' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 pb-20">
                <AdminDashboard 
                  menu={menu} 
                  onBack={navigateToMenu}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onUpdateQty={updateQuantity}
        onRemove={removeFromCart}
        total={cartTotal}
        onCheckout={() => {
          setIsCartOpen(false);
          setView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <nav className="fixed bottom-0 left-0 right-0 z-[60] glass border-t border-white/10 md:hidden pb-safe">
        <div className="flex justify-around items-center h-20 px-6">
          <button 
            onClick={() => setView('menu')}
            className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${view === 'menu' ? 'text-[#FF0000]' : 'text-gray-500'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 ${view === 'menu' ? 'neon-text' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-bold">لیست</span>
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center gap-1 transition-all active:scale-90 text-gray-500"
          >
            <div className={`p-3 rounded-full -mt-12 border-4 border-black glass transition-all ${cartItemCount > 0 ? 'bg-[#FF0000] text-white neon-shadow-strong scale-110' : 'bg-white/5 text-gray-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </button>

          <button 
            onClick={() => setView('admin')}
            className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${view === 'admin' ? 'text-[#FF0000]' : 'text-gray-500'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 ${view === 'admin' ? 'neon-text' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-bold">ئەدمین</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
