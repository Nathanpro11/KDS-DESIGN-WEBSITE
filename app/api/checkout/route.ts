import { NextResponse } from 'next/server';
import { prisma } from '../../../src/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // On extrait les données du corps de la requête
    const { userId, total, items } = body;

    // Sécurité : On s'assure d'avoir un ID utilisateur par défaut s'il est manquant ou NaN
    const cleanUserId = isNaN(Number(userId)) || userId === undefined ? 1 : Number(userId);
    
    // Sécurité : On nettoie le prix total
    const cleanTotal = isNaN(parseFloat(total)) ? 10.00 : parseFloat(total);

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Le panier est vide" }, { status: 400 });
    }

    // Création de la commande adaptée pour Prisma 7
    // ... dans ton try { ... } après avoir vérifié les items
const order = await prisma.$transaction(async (tx) => {
  // 1. Créer la commande
  const newOrder = await tx.order.create({
    data: {
      total: cleanTotal,
      status: "PENDING",
      user: { connect: { id: cleanUserId } },
      items: {
        create: items.map((item: any) => ({
          productId: Number(item.id),
          quantity: Number(item.quantity),
          price: parseFloat(item.price),
        })),
      },
    },
  });

  // 2. Mettre à jour les stocks pour chaque produit
  for (const item of items) {
    const product = await tx.product.findUnique({ where: { id: Number(item.id) } });
    
    if (!product || product.stock < Number(item.quantity)) {
      throw new Error(`Stock insuffisant pour le produit: ${item.id}`);
    }

    await tx.product.update({
      where: { id: Number(item.id) },
      data: { stock: { decrement: Number(item.quantity) } }, // La ligne magique !
    });
  }

  return newOrder;
});

return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("ERREUR CRASH CHECKOUT :", error);
    return NextResponse.json({ 
      error: "Impossible de valider la commande", 
      details: error.message 
    }, { status: 500 });
  }
}