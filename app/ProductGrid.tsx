"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

// On sécurise l'arrivée des données en disant que par défaut, products est un tableau vide []
export default function ProductGrid({ products = [] }: { products: any[] }) {
  const { addToCart, cart } = useCart();
  const [search, setSearch] = useState('');

  // Sécurité absolue : si products est mal transmis, on s'assure que c'est un tableau avant de filtrer
  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts.filter(p => 
    p?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const isProductDisabled = (product: any) => {
    if (!product || product.stock <= 0) return true;
    const cartItem = cart.find(item => item.id === product.id);
    if (cartItem && cartItem.quantity >= product.stock) return true;
    return false;
  };

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
      {filteredProducts.map((product) => {
        const disabled = isProductDisabled(product);
        return (
          <div 
            key={product.id} 
            className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-[#0052d4] hover:shadow-md transition-all flex flex-col group"
          >
            {/* ZONE IMAGE */}
            <div className="w-full aspect-square bg-gray-50 overflow-hidden relative">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">Pas d'image</div>
              )}
              <span className="absolute top-2 left-2 bg-[#0052d4] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm">
                Hot
              </span>
            </div>
            
            {/* INFOS */}
            <div className="p-3 flex flex-col flex-grow">
              <Link href={`/product/${product.id}`} className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-[#0052d4] leading-snug mb-1 min-h-[40px]">
                {product.title} - {product.description}
              </Link>
              
              <div className="flex items-center gap-1 text-xs text-amber-500 mb-2">
                <span>★★★★★</span>
              </div>

              <div className="mt-auto">
                <div className="text-[#0052d4] text-lg font-black leading-none">
                  {new Intl.NumberFormat('fr-FR').format(Number(product.price))} FCFA
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className={product.stock > 0 ? 'text-emerald-600 font-medium' : 'text-rose-500 font-bold'}>
                  {product.stock > 0 ? `Stock: ${product.stock}` : 'Épuisé'}
                </span>
              </div>

              <button 
                onClick={() => addToCart(product)}
                disabled={disabled}
                className={`w-full mt-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  !disabled 
                    ? 'bg-[#0052d4] text-white hover:bg-[#003da1] cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {product.stock <= 0 ? 'Rupture' : disabled ? 'Limite atteinte' : 'Ajouter au panier'}
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
}