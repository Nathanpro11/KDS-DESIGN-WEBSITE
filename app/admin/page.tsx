import { prisma } from '@/src/lib/prisma';
import Link from 'next/link';
import AdminProductTable from './AdminProductTable';

// LIGNE MAGIQUE : Force le rechargement en temps réel pour l'admin
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' }
  });
  // ... le reste de votre code reste identique

    // Conversion des prix pour TypeScript
    const safeProducts = products.map(p => ({
        ...p,
        price: Number(p.price)
    }));

    return (
        <main className="bg-gray-100 min-h-screen p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* EN-TÊTE DU DASHBOARD */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
                    <div>
                        <span className="text-xs font-bold text-[#0052d4] uppercase tracking-wider">Espace Gestionnaire</span>
                        <h1 className="text-2xl font-black text-gray-900 mt-1">Catalogue de la Sérigraphie</h1>
                    </div>
                    <Link
                        href="/admin/ajouter"
                        className="bg-[#0052d4] text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#003da1] transition-colors shadow-sm cursor-pointer"
                    >
                        + Ajouter un produit
                    </Link>
                </div>

                {/* COMPOSANT DE LA TABLE INTERACTIVE */}
                <AdminProductTable initialProducts={safeProducts} />

            </div>
        </main>
    );
}