
import React from 'react';
import { OrderDetails } from '../types';
import { UI_TEXT, RESTAURANT_PHONE } from '../constants';

interface Props {
  order: OrderDetails;
  onBack: () => void;
}

const DriverSummary: React.FC<Props> = ({ order, onBack }) => {
  const mapsUrl = order.locationLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`;

  const handleWhatsApp = () => {
    const items = order.cartItems.map(i => `${i.name} (${i.quantity}x)`).join('، ');
    const msg = `🍕 *داواکاری بومز پیتزا*\n👤 *کڕیار:* ${order.customerName}\n📞 *مۆبایل:* ${order.phoneNumber}\n📦 *خواردنەکان:* ${items}\n💰 *کۆی گشتی:* ${order.total.toLocaleString()} دینار\n📍 *شوێن:* ${mapsUrl}`;
    window.open(`https://wa.me/${RESTAURANT_PHONE.replace('+', '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20 animate-in zoom-in-95 duration-500">
      <div className="glass rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6600]/10 blur-[50px]" />
        
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black italic text-[#FF6600] neon-text">{UI_TEXT.driverSummary}</h2>
          <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full text-gray-500 uppercase">#{order.id.slice(-6)}</span>
        </div>

        <div className="space-y-6 text-right">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 rounded-2xl border border-white/5">
              <span className="text-[8px] font-black text-gray-600 block mb-1 uppercase tracking-widest">{UI_TEXT.fullName}</span>
              <span className="font-black text-lg">{order.customerName}</span>
            </div>
            <div className="glass p-4 rounded-2xl border border-white/5">
              <span className="text-[8px] font-black text-gray-600 block mb-1 uppercase tracking-widest">{UI_TEXT.phone}</span>
              <span className="font-black text-lg text-[#FF6600] ltr block">{order.phoneNumber}</span>
            </div>
          </div>
          
          <div className="glass p-5 rounded-2xl border border-white/5">
            <span className="text-[8px] font-black text-gray-600 block mb-2 uppercase tracking-widest">{UI_TEXT.address}</span>
            <p className="font-bold text-sm text-gray-300 mb-4 leading-relaxed">{order.address}</p>
            <a href={mapsUrl} target="_blank" className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black transition-all active:scale-95 shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
              {UI_TEXT.openInMaps}
            </a>
          </div>

          <div className="pt-6 border-t border-white/5">
            <h3 className="text-sm font-black text-gray-500 mb-4">{UI_TEXT.items}</h3>
            <div className="space-y-3">
              {order.cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center glass p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 font-bold text-xs">{(item.price * item.quantity).toLocaleString()} <span className="text-[8px]">{UI_TEXT.currency}</span></span>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm italic">{item.name}</span>
                    <span className="bg-[#FF6600] text-white px-2 py-0.5 rounded-lg text-[10px] font-black neon-shadow">{item.quantity}x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 flex justify-between items-center border-t border-white/5">
            <span className="text-3xl font-black text-[#FF6600] neon-text italic">{order.total.toLocaleString()} {UI_TEXT.currency}</span>
            <span className="text-sm font-black text-gray-600 italic uppercase">{UI_TEXT.total}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button onClick={handleWhatsApp} className="w-full bg-[#25D366] hover:bg-[#1ebd5e] text-white py-6 rounded-2xl font-black text-xl italic uppercase flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95">
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.656zm6.29-4.143c1.565.933 3.176 1.423 4.842 1.425h.005c5.454 0 9.893-4.439 9.896-9.896.001-2.646-1.027-5.131-2.895-6.999-1.869-1.868-4.354-2.896-7.001-2.897-5.455 0-9.894 4.44-9.897 9.897-.001 1.756.463 3.467 1.341 4.966l-1.017 3.713 3.806-.999zm11.446-7.077c-.445-.224-2.633-1.298-3.042-1.447-.409-.149-.706-.224-.966.149-.26.374-1.003 1.268-1.226 1.529-.223.262-.445.299-.891.074-.44-.223-1.885-.694-3.591-2.217-1.327-1.184-2.222-2.646-2.482-3.093-.26-.446-.027-.688.196-.91.2-.199.446-.521.669-.783.223-.261.297-.446.446-.744.148-.297.074-.557-.038-.781-.112-.224-.966-2.325-1.323-3.187-.348-.84-.701-.726-.966-.739-.249-.012-.538-.014-.827-.014-.289 0-.759.108-1.154.539-.394.432-1.503 1.47-1.503 3.583 0 2.113 1.54 4.156 1.755 4.453.216.297 3.03 4.626 7.34 6.488 1.025.443 1.825.707 2.449.905 1.028.327 1.965.281 2.705.171.824-.123 2.633-1.077 3.003-2.122.37-1.045.37-1.936.26-2.122-.11-.187-.408-.297-.854-.521z"/></svg>
          {UI_TEXT.whatsappOrder}
        </button>
        <button onClick={onBack} className="w-full glass border border-white/10 text-white py-5 rounded-2xl font-black italic transition-all active:scale-95">{UI_TEXT.backToMenu}</button>
      </div>
    </div>
  );
};

export default DriverSummary;
