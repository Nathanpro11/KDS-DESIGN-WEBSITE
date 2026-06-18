import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, stock } = body; // On récupère l'ID directement depuis le JSON !

    const nouveauStock = parseInt(stock, 10);
    const productId = isNaN(Number(id)) ? id : Number(id);

    const updatedProduct = await prisma.product.update({
      // @ts-ignore
      where: { id: productId },
      data: { stock: nouveauStock }
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Échec de la mise à jour" }, { status: 500 });
  }
}
