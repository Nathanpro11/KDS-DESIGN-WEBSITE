"use client";

import { useState } from 'react';

export default function AdminProductTable({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);

  // Fonction pour mettre à jour le stock en direct dans MySQL
const handleUpdateStock = async (id: any, newStock: number) => {
    if (newStock < 0) return;

    try {
      // L'URL devient fixe, plus de risque de 404 HTML !
      const response = await fetch('/api/admin/product', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, stock: newStock }), // On passe l'id ici
      });

      if (response.ok) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
      } else {
        const errorText = await response.text();
        alert(`Erreur serveur : ${errorText}`);
      }
    } catch (error) {
      console.error(error);
      alert("Impossible de joindre le serveur.");
    }
  };
  // Fonction pour supprimer un produit définitivement
  const handleDelete = async (id: any, title: string) => {
    if (!confirm(`Voulez-vous vraiment supprimer "${title}" du catalogue ?`)) return;

    try {
      const response = await fetch(`/api/admin/product/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        alert("Produit supprimé.");
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
              <th className="p-4">Visuel</th>
              <th className="p-4">Désignation</th>
              <th className="p-4">Prix Unitaire</th>
              <th className="p-4 text-center">Ajuster le Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <img src={product.imageUrl || '/placeholder.png'} className="w-12 h-12 object-cover rounded border" alt="" />
                </td>
                <td className="p-4">
                  <div className="font-bold text-gray-900">{product.title}</div>
                  <div className="text-xs text-gray-400 line-clamp-1 max-w-xs">{product.description}</div>
                </td>
                <td className="p-4 font-semibold text-[#0052d4]">
                  {new Intl.NumberFormat('fr-FR').format(product.price)} FCFA
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-3">
                    <button 
                      onClick={() => handleUpdateStock(product.id, product.stock - 1)}
                      className="w-7 h-7 bg-gray-100 rounded hover:bg-gray-200 font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className={`font-black w-8 text-center text-base ${product.stock === 0 ? 'text-red-500' : 'text-gray-800'}`}>
                      {product.stock}
                    </span>
                    <button 
                      onClick={() => handleUpdateStock(product.id, product.stock + 1)}
                      className="w-7 h-7 bg-gray-100 rounded hover:bg-gray-200 font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDelete(product.id, product.title)}
                    className="text-xs text-red-500 font-bold hover:underline cursor-pointer bg-red-50 px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  Aucun produit dans le catalogue pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}