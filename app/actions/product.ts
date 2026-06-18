'use server'

import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: { id: id },
    });
    revalidatePath('/catalogue'); // Rafraîchit la page pour enlever le produit
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression:", error);
    return { success: false, error: "Impossible de supprimer le produit" };
  }
}

export async function addProduct(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string);
  const imageUrl = formData.get('imageUrl') as string;

  try {
    await prisma.product.create({
      data: { title, description, price, stock, imageUrl }
    });
    
    // Rafraîchit la page pour afficher le nouveau produit
    revalidatePath('/'); 
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Erreur lors de la création' };
  }

  
}