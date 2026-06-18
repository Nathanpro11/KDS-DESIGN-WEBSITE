"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <nav className="bg-white border-b-2 border-[#0052d4] sticky top-0 z-50 font-sans shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center gap-4">
        <Link href="/" className="text-xl md:text-2xl font-black text-[#0052d4] tracking-tight shrink-0">
          Maison<span className="text-gray-900">Sérigraphie</span>
        </Link>

        {/* Bouton Hamburger (visible seulement sur mobile) */}
        <button 
          className="md:hidden p-2 text-gray-700" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>

        {/* Menu (Desktop: ligne, Mobile: menu déroulant) */}
        <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 border-b md:border-none shadow-lg md:shadow-none items-center gap-6 text-sm`}>
          <Link href="/" onClick={() => setIsOpen(false)} className="font-medium text-gray-700 hover:text-[#0052d4]">Accueil</Link>
          <Link href="/catalogue" onClick={() => setIsOpen(false)} className="font-medium text-gray-700 hover:text-[#0052d4]">Catalogue</Link>
          <Link href="/commande" onClick={() => setIsOpen(false)} className="font-medium text-gray-700 hover:text-[#0052d4] relative">
            Commande
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-4 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}