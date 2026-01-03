
import React from 'react';
import { CartItem } from '../types';
import { UI_TEXT } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  total: number;
  onCheckout: () => void;
}

const CartDrawer: React.FC<Props> = ({ isOpen, onClose, cart, onUpdateQty, onRemove, total, onCheckout }) => {
  return (
    <>
      <div className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-all ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#050505] z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-white/10 flex flex-col`}>
        <div className="p-6 flex justify-between items-center border-b border-white/5">
          <h2 className="text-xl font-black text-white">{UI_TEXT.cart}</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-[#FF6600] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <p className="text-lg font-bold">{UI_TEXT.emptyCart}</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-white/5 p-4 rounded-2xl flex gap-4 border border-white/5 group">
                <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">{item.name}</h4>
                  <p className="text-[#FF6600] font-black text-xs mb-2">{(item.price * item.quantity).toLocaleString()} {UI_TEXT.currency}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-white/10 rounded-lg overflow-hidden">
                      <button onClick={() => onUpdateQty(item.id, -1)} className="px-2 py-1 hover:bg-white/20">-</button>
                      <span className="px-3 py-1 text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} className="px-2 py-1 hover:bg-white/20">+</button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-gray-600 hover:text-red-500 text-[10px] font-bold">لابردن</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-black/50 border-t border-white/10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-bold">{UI_TEXT.total}</span>
              <span className="text-2xl font-black text-[#FF6600]">{total.toLocaleString()} {UI_TEXT.currency}</span>
            </div>
            <button onClick={onCheckout} className="w-full bg-[#FF6600] text-white py-4 rounded-2xl font-black text-lg neon-shadow active:scale-95 transition-all">
              {UI_TEXT.checkout}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
