import { prisma } from '@/src/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // 1. On attend proprement la promesse des paramètres de Next.js 15
  const resolvedParams = await params;

  // 2. SÉCURITÉ : Si ton ID en base de données est un NOMBRE (Int) :
  // On convertit la chaîne "1" en vrai nombre 1.
  const productId = parseInt(resolvedParams.id, 10);

  // Si la conversion échoue (l'ID dans l'URL n'est pas un chiffre), on stoppe direct
  if (isNaN(productId)) {
    notFound();
  }

  // 3. Requête Prisma : Plus aucun rouge ici car productId est un "number" pur
  const product = await prisma.product.findUnique({
    where: { id: productId }, 
  });

  // Note : Si ton ID en BDD est un TEXTE (String / UUID), remplace les lignes du dessus par :
  // const product = await prisma.product.findUnique({
  //   where: { id: resolvedParams.id },
  // });

  if (!product) {
    notFound();
  }

  // 4. Conversion du prix pour le composant Client
  const safeProduct = {
    id: product.id,
    title: product.title,
    description: product.description || '',
    price: Number(product.price),
    stock: product.stock,
    imageUrl: product.imageUrl,
  };

  return (
    <main className="bg-gray-100 min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-xs text-gray-500 mb-4">
          Accueil &gt; Catalogue &gt; <span className="text-gray-800 font-medium">{safeProduct.title}</span>
        </div>
        
        <ProductDetailClient product={safeProduct} />
      </div>
    </main>
  );
}