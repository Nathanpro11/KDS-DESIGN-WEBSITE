import { prisma } from '@/src/lib/prisma';
import ProductGrid from './ProductGrid';

// LIGNE MAGIQUE : Force le rechargement en temps réel depuis MySQL
export const dynamic = 'force-dynamic'; 

export default async function Home() {
  const rawProducts = await prisma.product.findMany();
  // ... le reste de votre code reste identique

  // On convertit les données proprement
  const products = rawProducts.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description || '',
    price: Number(product.price), 
    stock: product.stock,
    imageUrl: product.imageUrl,
  }));

  return (
    <main className="bg-gray-100 min-h-screen p-4 md:p-8 font-sans">
      
      {/* BANNIÈRE */}
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#00296b] to-[#0052d4] text-white rounded-xl p-6 mb-8 shadow-md relative overflow-hidden">
        <h2 className="text-2xl md:text-4xl font-black mt-2 mb-1">Éditions Limitées Sérigraphiées</h2>
        <p className="text-white/90 text-sm md:text-base">Maison Sérigraphie - Vente directe d'atelier</p>
      </div>

      {/* TITRE */}
      <div className="max-w-7xl mx-auto mb-6 border-b border-gray-200 pb-3">
        <h3 className="text-xl font-bold text-gray-800">Recommandé pour vous</h3>
      </div>

      {/* GRILLE INTERACTIVE */}
      <ProductGrid products={products} />

    </main>
  );
}