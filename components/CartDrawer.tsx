
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
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#050505] z-50 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-white/10`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">{UI_TEXT.cart}</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#FF0000] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-xl">{UI_TEXT.emptyCart}</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="bg-white/5 p-4 rounded-xl flex gap-4 border border-white/5">
                  <img src={item.image} className="w-20 h-20 rounded-lg object-cover" alt={item.name} />
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg">{item.name}</h4>
                    <p className="text-[#FF0000] font-bold mb-2">{(item.price * item.quantity).toLocaleString()} {UI_TEXT.currency}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-white/10 rounded-lg overflow-hidden border border-white/5">
                        <button onClick={() => onUpdateQty(item.id, -1)} className="px-3 py-1 hover:bg-white/20 transition-colors">-</button>
                        <span className="px-3 py-1 bg-white/10 font-bold">{item.quantity}</span>
                        <button onClick={() => onUpdateQty(item.id, 1)} className="px-3 py-1 hover:bg-white/20 transition-colors">+</button>
                      </div>
                      <button onClick={() => onRemove(item.id)} className="text-gray-500 hover:text-red-500 text-sm transition-colors">لابردن</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400 text-lg">{UI_TEXT.total}</span>
                <span className="text-3xl font-bold text-white">{total.toLocaleString()} {UI_TEXT.currency}</span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-[#FF0000] hover:bg-red-700 text-white py-5 rounded-2xl font-bold text-xl transition-all active:scale-95 shadow-lg shadow-[#FF0000]/20"
              >
                {UI_TEXT.checkout}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
