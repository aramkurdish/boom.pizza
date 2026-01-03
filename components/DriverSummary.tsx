
import React from 'react';
import { OrderDetails } from '../types';
import { UI_TEXT, RESTAURANT_PHONE } from '../constants';

interface Props {
  order: OrderDetails;
  onBack: () => void;
}

const DriverSummary: React.FC<Props> = ({ order, onBack }) => {
  const mapsUrl = order.locationLink 
    ? order.locationLink
    : order.location 
      ? `https://www.google.com/maps?q=${order.location.lat},${order.location.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`;

  const generateWhatsAppMessage = () => {
    let itemsString = order.cartItems
      .map(item => `${item.name} (${item.quantity}x)`)
      .join('، ');

    let message = `🚀 *داواکارییەکی نوێ لای بومز پیتزا*\n\n`;
    message += `👤 *ناوی کڕیار:* ${order.customerName}\n`;
    message += `📞 *ژمارە:* ${order.phoneNumber}\n`;
    message += `📦 *خواردنەکان:* ${itemsString}\n`;
    message += `💰 *کۆی گشتی:* ${order.total.toLocaleString()} دینار\n`;
    message += `📍 *لۆکەیشن:* ${mapsUrl}`;
    
    return encodeURIComponent(message);
  };

  const handleWhatsApp = () => {
    const phone = RESTAURANT_PHONE.replace('+', '').replace(/\s/g, '');
    window.open(`https://wa.me/${phone}?text=${generateWhatsAppMessage()}`, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      <div className="glass rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF0000]/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter text-[#FF0000] uppercase neon-text">{UI_TEXT.driverSummary}</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Ready for delivery</p>
          </div>
          <div className="px-6 py-2 glass rounded-2xl border border-[#FF0000]/30 font-black text-[#FF0000] text-sm tracking-widest">
            #{Math.random().toString(36).substr(2, 6).toUpperCase()}
          </div>
        </div>

        <div className="space-y-8 relative text-right">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass p-6 rounded-3xl border border-white/10">
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">{UI_TEXT.fullName}</span>
              <span className="font-black text-2xl italic tracking-tight">{order.customerName}</span>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/10">
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">{UI_TEXT.phone}</span>
              <span className="font-black text-2xl text-[#FF0000] neon-text ltr block">{order.phoneNumber}</span>
            </div>
          </div>
          
          <div className="glass p-8 rounded-3xl border border-white/10 relative group">
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] block mb-3">{UI_TEXT.address}</span>
            <p className="font-bold text-xl leading-relaxed text-gray-200">{order.address}</p>
            
            <a 
              href={mapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center gap-4 bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {UI_TEXT.openInMaps}
            </a>
          </div>

          <div className="pt-8 border-t border-white/5">
            <h3 className="text-xl font-black mb-6 flex items-center justify-end gap-3 italic text-gray-400">
              {UI_TEXT.items}
              <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-[#FF0000]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </h3>
            <div className="space-y-4">
              {order.cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center glass p-4 rounded-2xl border border-white/5 transform hover:scale-[1.01] transition-transform">
                  <span className="text-gray-400 font-bold">{(item.price * item.quantity).toLocaleString()} <span className="text-[10px]">{UI_TEXT.currency}</span></span>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-lg italic tracking-tight">{item.name}</span>
                    <span className="bg-[#FF0000] text-white px-3 py-1 rounded-xl text-xs font-black neon-shadow">{item.quantity}x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-10 flex justify-between items-center border-t border-white/5 px-4">
            <span className="text-4xl font-black text-[#FF0000] neon-text italic">{order.total.toLocaleString()} {UI_TEXT.currency}</span>
            <span className="text-2xl font-black italic text-gray-500 uppercase tracking-tighter">TOTAL BILL</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <button 
          onClick={handleWhatsApp}
          className="w-full bg-[#25D366] hover:bg-[#1ebd5e] text-white py-7 rounded-3xl font-black text-2xl italic tracking-tighter uppercase flex items-center justify-center gap-5 transition-all active:scale-95 shadow-2xl shadow-[#25D366]/30"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.656zm6.29-4.143c1.565.933 3.176 1.423 4.842 1.425h.005c5.454 0 9.893-4.439 9.896-9.896.001-2.646-1.027-5.131-2.895-6.999-1.869-1.868-4.354-2.896-7.001-2.897-5.455 0-9.894 4.44-9.897 9.897-.001 1.756.463 3.467 1.341 4.966l-1.017 3.713 3.806-.999zm11.446-7.077c-.445-.224-2.633-1.298-3.042-1.447-.409-.149-.706-.224-.966.149-.26.374-1.003 1.268-1.226 1.529-.223.262-.445.299-.891.074-.44-.223-1.885-.694-3.591-2.217-1.327-1.184-2.222-2.646-2.482-3.093-.26-.446-.027-.688.196-.91.2-.199.446-.521.669-.783.223-.261.297-.446.446-.744.148-.297.074-.557-.038-.781-.112-.224-.966-2.325-1.323-3.187-.348-.84-.701-.726-.966-.739-.249-.012-.538-.014-.827-.014-.289 0-.759.108-1.154.539-.394.432-1.503 1.47-1.503 3.583 0 2.113 1.54 4.156 1.755 4.453.216.297 3.03 4.626 7.34 6.488 1.025.443 1.825.707 2.449.905 1.028.327 1.965.281 2.705.171.824-.123 2.633-1.077 3.003-2.122.37-1.045.37-1.936.26-2.122-.11-.187-.408-.297-.854-.521z"/>
          </svg>
          {UI_TEXT.orderNow}
        </button>

        <button 
          onClick={onBack}
          className="w-full glass border border-white/5 hover:bg-white/10 text-white py-6 rounded-3xl font-black italic tracking-tighter uppercase transition-all active:scale-95"
        >
          {UI_TEXT.backToMenu}
        </button>
      </div>
    </div>
  );
};

export default DriverSummary;
