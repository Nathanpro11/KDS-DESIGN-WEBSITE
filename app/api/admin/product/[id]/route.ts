import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const productId = isNaN(Number(id)) ? id : Number(id);

    await prisma.product.delete({
      // @ts-ignore
      where: { id: productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Échec de la suppression du produit" }, { status: 500 });
  }
}