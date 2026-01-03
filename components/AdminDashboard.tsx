
import React, { useState, useEffect } from 'react';
import { MenuItem, Category, OrderDetails } from '../types.js';
import { CATEGORIES, UI_TEXT } from '../constants.js';
import { db } from '../firebase.js';

interface Props {
  menu: MenuItem[];
  onBack: () => void;
}

const AdminDashboard: React.FC<Props> = ({ menu, onBack }) => {
  const [tab, setTab] = useState<'menu' | 'orders'>('menu');
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);

  useEffect(() => {
    if (tab === 'orders') {
      const ordersRef = db.ref("orders");
      const handle = (snapshot: any) => {
        const data = snapshot.val();
        setOrders(data ? Object.keys(data).map(k => ({ id: k, ...data[k] })).sort((a: any, b: any) => b.timestamp - a.timestamp) : []);
      };
      ordersRef.on('value', handle);
      return () => ordersRef.off('value', handle);
    }
  }, [tab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      if (editingItem.id) {
        await db.ref(`menu/${editingItem.id}`).update(editingItem);
      } else {
        await db.ref("menu").push().set({ ...editingItem, timestamp: Date.now() });
      }
      setEditingItem(null);
    } catch (err) { alert("هەڵەیەك ڕوویدا لە کاتی پاشەکەوتکردن"); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="p-2 glass rounded-xl text-gray-400 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></button>
        <div className="flex gap-2">
          <button onClick={() => setTab('menu')} className={`px-5 py-2 rounded-xl font-bold ${tab === 'menu' ? 'bg-[#FF6600] text-white neon-shadow' : 'bg-white/5 text-gray-500'}`}>لیست</button>
          <button onClick={() => setTab('orders')} className={`px-5 py-2 rounded-xl font-bold ${tab === 'orders' ? 'bg-[#FF6600] text-white neon-shadow' : 'bg-white/5 text-gray-500'}`}>داواکارییەکان</button>
        </div>
      </div>

      {tab === 'menu' ? (
        <div className="space-y-4">
          <button onClick={() => setEditingItem({ category: 'Pizza', price: 0, name: '', image: '', description: '' })} className="w-full py-6 border-2 border-dashed border-white/10 rounded-2xl text-gray-600 hover:border-[#FF6600] hover:text-[#FF6600] transition-all font-bold">+ زیادکردنی خواردن</button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menu.map(item => (
              <div key={item.id} className="glass p-4 rounded-2xl border border-white/5 flex gap-4 items-center">
                <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-[#FF6600] font-black text-xs">{item.price.toLocaleString()} د.ع</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingItem(item)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                  <button onClick={async () => { if (confirm('دڵنیای؟')) await db.ref(`menu/${item.id}`).remove(); }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden border border-white/5">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="bg-white/5 text-gray-500 font-bold border-b border-white/5">
                <th className="px-6 py-4">کڕیار</th>
                <th className="px-6 py-4">مۆبایل</th>
                <th className="px-6 py-4">پارە</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-4 font-bold">{order.customerName}</td>
                  <td className="px-6 py-4 text-[#FF6600] ltr">{order.phoneNumber}</td>
                  <td className="px-6 py-4 font-black">{order.total.toLocaleString()} د.ع</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <form onSubmit={handleSave} className="glass w-full max-w-md p-8 rounded-3xl border border-[#FF6600]/20 space-y-4 text-right">
            <h3 className="text-xl font-black text-[#FF6600]">{editingItem.id ? 'دەستکاری' : 'زیادکردن'}</h3>
            <input type="text" placeholder="ناوی خواردن" required value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF6600]" />
            <input type="number" placeholder="نرخ" required value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF6600]" />
            <select value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value as Category})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF6600]">
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <input type="url" placeholder="وێنە URL" required value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#FF6600]" />
            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-1 bg-[#FF6600] py-4 rounded-xl font-black">پاشەکەوت</button>
              <button type="button" onClick={() => setEditingItem(null)} className="flex-1 glass py-4 rounded-xl font-black">پاشگەزبوونەوە</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
