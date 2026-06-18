import { prisma } from '@/src/lib/prisma';
import ProductList from './ProductList';

export default async function CataloguePage() {
  const products = await prisma.product.findMany();

  return (
    <main className="bg-gray-100 min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#0052d4] inline-block rounded-sm"></span>
          Tous nos produits disponibles
        </h1>
        <ProductList initialProducts={products} />
      </div>
    </main>
  );
}