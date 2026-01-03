
import React from 'react';
import { MenuItem } from '../types';
import { UI_TEXT } from '../constants';

interface Props {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

const ProductCard: React.FC<Props> = ({ item, onAdd }) => {
  return (
    <div className="glass rounded-[2rem] overflow-hidden group hover:border-[#FF0000]/60 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-2 hover:neon-shadow">
      <div className="relative h-60 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
        
        {/* Quick Add Button (+) */}
        <button 
          onClick={() => onAdd(item)}
          className="absolute bottom-4 left-4 w-12 h-12 bg-[#FF0000] rounded-2xl flex items-center justify-center neon-shadow-strong transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>

        <div className="absolute top-4 right-4 glass px-4 py-2 rounded-2xl text-sm font-black border border-white/20">
          {item.price.toLocaleString()} <span className="text-[#FF0000]">{UI_TEXT.currency}</span>
        </div>
      </div>
      
      <div className="p-7 flex-1 flex flex-col">
        <h3 className="text-2xl font-black text-white mb-3 italic tracking-tight">{item.name}</h3>
        <p className="text-gray-500 text-sm mb-8 flex-1 leading-relaxed line-clamp-2">{item.description}</p>
        
        <button 
          onClick={() => onAdd(item)}
          className="w-full bg-white/5 border border-white/10 group-hover:bg-[#FF0000] group-hover:border-[#FF0000] text-white py-4 rounded-2xl font-black transition-all duration-300 flex items-center justify-center gap-3 uppercase italic tracking-widest text-sm"
        >
          {UI_TEXT.addToCart}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
