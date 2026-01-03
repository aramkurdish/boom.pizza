
import React, { useState, useEffect } from 'react';
import { MenuItem, Category, OrderDetails } from '../types';
import { CATEGORIES, UI_TEXT } from '../constants';
import { db } from '../firebase';
import { 
  ref, 
  onValue, 
  push, 
  set, 
  remove, 
  update
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

interface Props {
  menu: MenuItem[];
  onBack: () => void;
}

const AdminDashboard: React.FC<Props> = ({ menu, onBack }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders') {
      const ordersRef = ref(db, "orders");
      const unsubscribe = onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const orderList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })) as OrderDetails[];
          // Sort by timestamp descending
          orderList.sort((a, b) => b.timestamp - a.timestamp);
          setOrders(orderList);
        } else {
          setOrders([]);
        }
      });
      return () => unsubscribe();
    }
  }, [activeTab]);

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);

    try {
      if (editingItem.id) {
        // Edit existing item
        const itemRef = ref(db, `menu/${editingItem.id}`);
        await update(itemRef, editingItem);
      } else {
        // Add new item
        const menuRef = ref(db, "menu");
        const newItemRef = push(menuRef);
        await set(newItemRef, {
          ...editingItem,
          timestamp: Date.now()
        });
      }
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving menu item:", error);
      alert("نەتوانرا گۆڕانکارییەکە پاشەکەوت بکرێت.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('دڵنیای لە سڕینەوەی ئەم خواردنە؟')) {
      try {
        await remove(ref(db, `menu/${id}`));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const seedDatabase = async () => {
    if (window.confirm('ئەمە هەموو لیستەکە لێرە جێگیر دەکات، دڵنیای؟')) {
      try {
        const { MENU_ITEMS } = await import('../constants');
        const menuRef = ref(db, "menu");
        // Using set to replace the entire menu or merging
        for (const item of MENU_ITEMS) {
            const newItemRef = push(menuRef);
            await set(newItemRef, item);
        }
        alert("لیستەکە بە سەرکەوتوویی جێگیر کرا.");
      } catch (error) {
        console.error("Error seeding database:", error);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 glass rounded-xl text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Admin <span className="text-[#FF0000]">Panel</span></h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'menu' ? 'bg-[#FF0000] text-white neon-shadow' : 'bg-white/5 text-gray-500 hover:text-white'}`}
          >
            بەڕێوەبردنی لیست
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-[#FF0000] text-white neon-shadow' : 'bg-white/5 text-gray-500 hover:text-white'}`}
          >
            داواکارییەکان
          </button>
        </div>
      </div>

      {activeTab === 'menu' && (
        <div className="space-y-8">
          <div className="flex gap-4">
            <button 
              onClick={() => setEditingItem({ category: 'Pizza', price: 0, name: '', description: '', image: '' })}
              className="flex-1 py-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 hover:border-[#FF0000] hover:text-[#FF0000] transition-all font-bold uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              زیادکردنی خواردنی نوێ
            </button>
            <button 
              onClick={seedDatabase}
              className="px-6 glass border border-white/10 text-gray-500 hover:text-[#FF0000] transition-colors rounded-2xl font-bold uppercase text-[10px]"
            >
              Seed Data
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menu.map(item => (
              <div key={item.id} className="glass p-6 rounded-3xl border border-white/10 flex gap-6 items-center group">
                <img src={item.image} className="w-24 h-24 rounded-2xl object-cover" alt={item.name} />
                <div className="flex-1">
                  <h4 className="text-xl font-bold italic">{item.name}</h4>
                  <p className="text-[#FF0000] font-black">{item.price.toLocaleString()} {UI_TEXT.currency}</p>
                  <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-bold">{item.category}</p>
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingItem(item)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-500 uppercase tracking-widest">مێژووی داواکارییەکان ({orders.length})</h3>
          </div>
          
          <div className="glass rounded-3xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-white/5 text-gray-400 text-xs font-black uppercase tracking-widest border-b border-white/10">
                    <th className="px-6 py-4">کڕیار</th>
                    <th className="px-6 py-4">ژمارە</th>
                    <th className="px-6 py-4">خواردنەکان</th>
                    <th className="px-6 py-4">بڕی پارە</th>
                    <th className="px-6 py-4">کاتی داواکاری</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold">{order.customerName}</td>
                      <td className="px-6 py-4 text-[#FF0000] font-black ltr">{order.phoneNumber}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {order.cartItems.map(i => `${i.name} (${i.quantity}x)`).join('، ')}
                      </td>
                      <td className="px-6 py-4 font-black">{order.total.toLocaleString()} د.ع</td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(order.timestamp).toLocaleString('ku-IQ')}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-600 italic font-bold">هیچ داواکارییەک نییە</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Overlay */}
      {editingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setEditingItem(null)} />
          <form onSubmit={handleSaveItem} className="relative glass w-full max-w-lg p-8 rounded-[2.5rem] border border-[#FF0000]/20 space-y-6 text-right">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase text-[#FF0000]">{editingItem.id ? 'Edit Item' : 'New Item'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase mb-2">ناوی خواردن</label>
                <input 
                  type="text" 
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF0000] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-[10px] font-black uppercase mb-2">نرخ</label>
                  <input 
                    type="number" 
                    required
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF0000] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-[10px] font-black uppercase mb-2">پۆلێن</label>
                  <select 
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as Category })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF0000] outline-none"
                  >
                    {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase mb-2">وێنە (URL)</label>
                <input 
                  type="url" 
                  required
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF0000] outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase mb-2">وەسف</label>
                <textarea 
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF0000] outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-[#FF0000] text-white py-4 rounded-2xl font-black uppercase italic tracking-widest neon-shadow-strong disabled:opacity-50"
              >
                {isSaving ? '...' : 'پاشەکەوتکردن'}
              </button>
              <button 
                type="button"
                onClick={() => setEditingItem(null)}
                className="flex-1 glass border border-white/10 text-white py-4 rounded-2xl font-black uppercase italic tracking-widest"
              >
                پاشگەزبوونەوە
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
