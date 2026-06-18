"use client";

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CommandePage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

 const handleCheckout = async () => {
    try {
      // 1. Envoi des articles du panier à l'API backend
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("🎉 Commande validée !.");
        clearCart(); // Vide le panier uniquement si le backend a réussi
      } else {
        alert(`Erreur : ${data.error}`);
      }
    } catch (error) {
      console.error("Erreur lors du paiement :", error);
      alert("Impossible de connecter le serveur. Vérifiez votre console.");
    }
  };

  if (cart.length === 0) {
    return (
      <main className="max-w-4xl mx-auto p-8 text-center font-sans">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Votre panier est vide</h2>
        <Link href="/catalogue" className="bg-[#0052d4] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#003da1]">
          Parcourir le catalogue
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 font-sans grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LISTE DES ARTICLES */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-bold border-b pb-3 mb-4 text-gray-800">Détails de votre commande</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex gap-4 border-b py-4 items-center justify-between">
            <img src={item.imageUrl || '/placeholder.png'} className="w-16 h-16 object-cover rounded" alt={item.title} />
            <div className="flex-grow">
              <h4 className="font-bold text-sm text-gray-800">{item.title}</h4>
              <span className="text-xs text-gray-400">{new Intl.NumberFormat('fr-FR').format(item.price)} FCFA / pièce</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 bg-gray-200 rounded">-</button>
              <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 bg-gray-200 rounded">+</button>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline ml-4">Supprimer</button>
          </div>
        ))}
      </div>

      {/* RECAPITULATIF ET PAIEMENT */}
      <div className="bg-white p-6 rounded-xl border shadow-sm h-fit">
        <h3 className="text-lg font-bold border-b pb-3 mb-4 text-gray-800">Résumé du paiement</h3>
        <div className="flex justify-between font-medium text-gray-600 mb-2">
          <span>Sous-total</span>
          <span>{new Intl.NumberFormat('fr-FR').format(cartTotal)} FCFA</span>
        </div>
        <div className="flex justify-between font-medium text-gray-600 mb-4">
          <span>Livraison</span>
          <span className="text-emerald-600 font-bold">Gratuite</span>
        </div>
        <div className="flex justify-between font-black text-xl text-gray-900 border-t pt-4 mb-6">
          <span>Total global</span>
          <span className="text-[#0052d4]">{new Intl.NumberFormat('fr-FR').format(cartTotal)} FCFA</span>
        </div>
        <button 
          onClick={handleCheckout}
          className="w-full bg-emerald-600 text-white font-bold py-3 rounded-full hover:bg-emerald-700 transition-colors shadow-md"
        >
          Procéder à l'achat immédiat
        </button>
      </div>
    </main>
  );
}