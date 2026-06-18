"use client";

import { useCart } from '@/context/CartContext';

export default function ProductDetailClient({ product }: { product: any }) {
  const { addToCart, cart } = useCart();

  // Vérification de la quantité déjà présente dans le panier
  const cartItem = cart.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const disabled = product.stock <= 0 || quantityInCart >= product.stock;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* BLOC GAUCHE : GRANDE IMAGE DE MARQUE */}
      <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center relative">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-sm">Aucune image disponible</div>
        )}
        
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white font-black px-6 py-2 rounded-md uppercase tracking-wider text-sm">
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      {/* BLOC DROIT : ACHAT ET LOGISTIQUE STYLE ALIBABA */}
      <div className="flex flex-col justify-between">
        <div>
          <span className="bg-blue-50 text-[#0052d4] text-[11px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider border border-blue-100">
            Vérifié par l'Atelier
          </span>
          
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-3 mb-2">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-amber-500 mb-4">
            <span>★★★★★ 4.9</span>
            <span className="text-gray-400">| 24 Avis clients</span>
            <span className="text-gray-400">| 100+ Commandes</span>
          </div>

          {/* BANDEAU DE PRIX DE GROS */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-400 block">Prix Direct Atelier</span>
                <span className="text-[#0052d4] text-3xl font-black">{new Intl.NumberFormat('fr-FR').format(product.price)} FCFA</span>
              </div>
              <div className="border-l border-gray-200 pl-4">
                <span className="text-xs text-gray-400 block">Commande Minimum</span>
                <span className="text-gray-800 font-bold text-sm">1 pièce</span>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Détails du produit</h3>
            <p className="text-gray-600 text-sm leading-relaxed bg-blue-50/30 p-3 rounded-lg border border-blue-50/50">
              {product.description || "Aucune description fournie pour cette pièce exclusive d'impression artisanale."}
            </p>
          </div>

          {/* CAPACITÉ LOGISTIQUE */}
          <div className="text-xs text-gray-500 space-y-2 mb-6">
            <div className="flex justify-between border-b pb-1">
              <span>Disponibilité :</span>
              <span className={product.stock > 0 ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                {product.stock > 0 ? `${product.stock} pièces en stock` : 'Épuisé'}
              </span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span>Expédition :</span>
              <span className="text-gray-800 font-medium">Depuis la France sous 48h</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span>Paiement :</span>
              <span className="text-gray-800 font-medium">Sécurisé (SSL / Stripe Mock)</span>
            </div>
          </div>
        </div>

        {/* COMPTEUR INTERNE DANS LE BOUTON */}
        <div className="space-y-2">
          {quantityInCart > 0 && (
            <div className="text-xs text-center text-amber-600 font-bold bg-amber-50 py-1 rounded border border-amber-200">
              🛒 Vous avez déjà {quantityInCart} exemplaire(s) de cet article dans votre panier.
            </div>
          )}

          <button
            onClick={() => addToCart(product)}
            disabled={disabled}
            className={`w-full py-3.5 rounded-full font-bold text-sm shadow-sm transition-all ${
              !disabled 
                ? 'bg-[#0052d4] text-white hover:bg-[#003da1] cursor-pointer active:scale-[0.99]' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {product.stock <= 0 
              ? 'Rupture définitive' 
              : disabled 
                ? 'Limite du stock atteinte' 
                : 'Ajouter au panier instantanément'
            }
          </button>
        </div>

      </div>
    </div>
  );
}