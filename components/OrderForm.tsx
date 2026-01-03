
import React, { useState } from 'react';
import { CartItem, OrderDetails } from '../types';
import { UI_TEXT } from '../constants';

interface Props {
  cartItems: CartItem[];
  total: number;
  onBack: () => void;
  onComplete: (order: OrderDetails) => void;
}

const OrderForm: React.FC<Props> = ({ cartItems, total, onBack, onComplete }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [locationLink, setLocationLink] = useState('');
  const [isLoadingLoc, setIsLoadingLoc] = useState(false);

  const handleGetLocation = () => {
    setIsLoadingLoc(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const link = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
          setLocationLink(link);
          setIsLoadingLoc(false);
        },
        () => {
          alert("تکایە دەستگەیشتن بە لۆکەیشن چالاك بکە.");
          setIsLoadingLoc(false);
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) return alert("تکایە خانەکان پڕ بکەرەوە");
    onComplete({
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerName: name,
      phoneNumber: phone,
      address,
      locationLink,
      cartItems,
      total,
      timestamp: Date.now()
    });
  };

  return (
    <div className="max-w-2xl mx-auto glass rounded-[2rem] p-8 border border-white/5 animate-in fade-in zoom-in-95">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-3 glass rounded-xl text-gray-500 hover:text-white transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
        <h2 className="text-2xl font-black italic">{UI_TEXT.checkout}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-right">
        <div className="space-y-4">
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2 group-focus-within:text-[#FF6600]">{UI_TEXT.fullName}</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="ناوی تەواو" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#FF6600] outline-none transition-all font-bold" />
          </div>
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2 group-focus-within:text-[#FF6600]">{UI_TEXT.phone}</label>
            <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="0750 XXX XXXX" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#FF6600] outline-none transition-all font-bold ltr" />
          </div>
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2 group-focus-within:text-[#FF6600]">{UI_TEXT.address}</label>
            <textarea required rows={2} value={address} onChange={e => setAddress(e.target.value)} placeholder="ناونیشانی ورد..." className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#FF6600] outline-none transition-all font-bold" />
          </div>
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2 group-focus-within:text-[#FF6600]">{UI_TEXT.locationLink}</label>
            <div className="relative">
              <input type="url" value={locationLink} onChange={e => setLocationLink(e.target.value)} placeholder="لینک لۆکەیشن..." className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-[#FF6600] outline-none transition-all font-bold ltr" />
              <button type="button" onClick={handleGetLocation} className="absolute left-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#FF6600]/10 text-[#FF6600] rounded-lg text-[10px] font-black hover:bg-[#FF6600]/20 transition-all">
                {isLoadingLoc ? '...' : UI_TEXT.getLocation}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 glass rounded-2xl border border-white/5 mt-8 flex justify-between items-center">
          <span className="text-gray-500 font-bold">بڕی گشتی پارە</span>
          <span className="text-2xl font-black text-[#FF6600] neon-text">{total.toLocaleString()} {UI_TEXT.currency}</span>
        </div>

        <button type="submit" className="w-full bg-[#FF6600] text-white py-5 rounded-2xl font-black text-xl italic uppercase neon-shadow-strong active:scale-95 transition-all">
          {UI_TEXT.orderNow}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
