"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import du routeur
import { useCart } from '@/context/CartContext';
import { deleteProduct } from '@/app/actions/product';

export default function ProductList({ initialProducts }: { initialProducts: any[] }) {
    const { addToCart, cart } = useCart();
    const router = useRouter(); // Initialisation
    const [search, setSearch] = useState('');

    const filteredProducts = initialProducts.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    const isProductDisabled = (product: any) => {
        if (product.stock <= 0) return true;
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity >= product.stock) return true;
        return false;
    };

    // Fonction simplifiée qui ajoute ET redirige
    const handleAddToCart = (product: any) => {
        addToCart(product);
        router.push('/commande');
    };

    const handleDelete = async (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer cet article ?")) {
            const res = await deleteProduct(id);
            if (!res.success) alert(res.error);
        }
    };

    return (
        <div className="font-sans">
            <input
                type="text"
                placeholder="Filtrer par nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md p-2.5 mb-6 border-2 border-gray-200 rounded-lg focus:outline-[#0052d4] text-sm"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                    const disabled = isProductDisabled(product);
                    const cartItem = cart.find(item => item.id === product.id);
                    const quantityInCart = cartItem ? cartItem.quantity : 0;

                    const formattedPrice = new Intl.NumberFormat('fr-FR').format(Number(product.price));

                    return (
                        <div key={product.id} className="bg-white p-3 border border-gray-200 rounded-lg flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="relative">
                                <img src={product.imageUrl || '/placeholder.png'} className="w-full aspect-square object-cover rounded" alt={product.title} />
                                {quantityInCart > 0 && (
                                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        Panier : {quantityInCart}
                                    </span>
                                )}
                            </div>

                            <h3 className="font-bold text-sm text-gray-800 mt-2 line-clamp-1">{product.title}</h3>

                            <span className="text-[#0052d4] font-black text-base my-1">
                                {formattedPrice} FCFA
                            </span>

                            <div className="text-[11px] text-gray-500 mb-2">
                                Stock : {product.stock}
                            </div>

                            <button
                                onClick={() => handleAddToCart(product)} // Appel de la nouvelle fonction
                                disabled={disabled}
                                className={`w-full text-xs py-2 rounded-full font-bold transition-all ${!disabled
                                        ? 'bg-[#0052d4] text-white hover:bg-[#003da1]'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {product.stock <= 0 ? 'Épuisé' : disabled ? 'Limite atteinte' : 'Ajouter'}
                            </button>

                         
                        </div>
                    );
                })}
            </div>
        </div>
    );
}