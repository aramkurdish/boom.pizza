
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
  const [location, setLocation] = useState<{ lat: number, lng: number } | undefined>();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleGetLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLocation({ lat, lng });
          setIsLoadingLocation(false);
          const link = `https://www.google.com/maps?q=${lat},${lng}`;
          if (!locationLink) setLocationLink(link);
        },
        (err) => {
          alert("نەتوانرا لۆکەیشنەکەت وەرگیرێت. تکایە لینکەکە لێرە کۆپی بکە.");
          setIsLoadingLocation(false);
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert("تکایە هەموو خانەکان پڕ بکەرەوە");
      return;
    }

    const order: OrderDetails = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerName: name,
      phoneNumber: phone,
      address,
      locationLink: locationLink || undefined,
      location,
      cartItems,
      total,
      timestamp: Date.now()
    };

    onComplete(order);
  };

  return (
    <div className="max-w-3xl mx-auto glass rounded-[2.5rem] p-8 md:p-12 border border-white/5 neon-shadow overflow-hidden relative">
      <div className="absolute top-0 left-0 w-2 h-full bg-[#FF0000]"></div>
      
      <div className="flex items-center gap-6 mb-12">
        <button onClick={onBack} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all transform hover:-translate-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">{UI_TEXT.checkout}</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Fill in your delivery details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-right">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group">
            <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 group-focus-within:text-[#FF0000] transition-colors">{UI_TEXT.fullName}</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ناوی تەواو"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#FF0000] focus:bg-white/10 outline-none transition-all font-bold placeholder:text-gray-700"
            />
          </div>

          <div className="group">
            <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 group-focus-within:text-[#FF0000] transition-colors">{UI_TEXT.phone}</label>
            <input 
              type="tel" 
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07XX XXX XXXX"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#FF0000] focus:bg-white/10 outline-none transition-all font-bold placeholder:text-gray-700 ltr"
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 group-focus-within:text-[#FF0000] transition-colors">{UI_TEXT.address}</label>
          <textarea 
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="ناونیشانی نیشتەجێبوون..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#FF0000] focus:bg-white/10 outline-none transition-all font-bold placeholder:text-gray-700"
          />
        </div>

        <div className="group">
          <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 group-focus-within:text-[#FF0000] transition-colors">{UI_TEXT.locationLink}</label>
          <div className="relative">
            <input 
              type="url" 
              value={locationLink}
              onChange={(e) => setLocationLink(e.target.value)}
              placeholder="Google Maps Link"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#FF0000] focus:bg-white/10 outline-none transition-all font-bold placeholder:text-gray-700 ltr"
            />
            <button 
              type="button"
              onClick={handleGetLocation}
              disabled={isLoadingLocation}
              className="absolute left-3 top-1/2 -translate-y-1/2 glass px-4 py-2 rounded-xl text-[10px] font-black text-[#FF0000] border border-[#FF0000]/20 hover:bg-[#FF0000]/10 transition-colors uppercase"
            >
              {isLoadingLocation ? 'Loading...' : UI_TEXT.getLocation}
            </button>
          </div>
        </div>

        <div className="glass rounded-[2rem] p-8 border border-white/5 mt-10">
          <div className="flex justify-between items-center mb-6 text-gray-500 font-bold uppercase tracking-wider text-sm">
            <span>کۆی خواردنەکان</span>
            <span className="text-white bg-white/10 px-4 py-1 rounded-full">{cartItems.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <div className="flex justify-between items-center text-3xl font-black italic">
            <span className="text-white uppercase tracking-tighter">TOTAL</span>
            <span className="text-[#FF0000] neon-text">{total.toLocaleString()} {UI_TEXT.currency}</span>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#FF0000] hover:bg-red-700 text-white py-6 rounded-3xl font-black text-2xl italic tracking-tighter uppercase transition-all active:scale-95 shadow-2xl shadow-[#FF0000]/40 neon-shadow-strong"
        >
          {UI_TEXT.orderNow}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
