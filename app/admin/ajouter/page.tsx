'use client'

import { useState } from 'react';
import { addProduct } from '@/app/actions/product';
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function AjouterPage() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  async function actionHandler(formData: FormData) {
    // On ajoute l'URL de l'image récupérée au formulaire avant l'envoi
    formData.append('imageUrl', imageUrl);
    
    const result = await addProduct(formData);
    
    if (result?.success) {
      alert("Produit ajouté avec succès !");
      // Optionnel : réinitialiser le formulaire ici
    } else {
      alert(result?.error || "Une erreur est survenue");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Ajouter un produit</h1>
            <p className="text-gray-500 mt-2">Configurez les informations de votre nouvel article.</p>
          </div>

          <form action={actionHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Nom du produit</label>
                <input name="title" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
              </div>

              {/* Prix et Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Prix (FCFA)</label>
                <input name="price" type="number" step="0.01" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Stock initial</label>
                <input name="stock" type="number" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
              </div>

              {/* Image Upload */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image du produit</label>
                <UploadButton<OurFileRouter, "imageUploader">
                  endpoint="imageUploader"
                  onUploadBegin={() => setIsUploading(true)}
                  onClientUploadComplete={(res) => {
                    setImageUrl(res[0].url);
                    setIsUploading(false);
                    alert("Image téléchargée avec succès !");
                  }}
                  onUploadError={(error: Error) => {
                    setIsUploading(false);
                    alert(`Erreur d'upload : ${error.message}`);
                  }}
                />
                {imageUrl && <p className="text-green-600 text-sm mt-2">Image prête à être enregistrée.</p>}
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description détaillée</label>
                <textarea name="description" rows={4} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isUploading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02]"
            >
              {isUploading ? "En cours d'upload..." : "Enregistrer le produit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}