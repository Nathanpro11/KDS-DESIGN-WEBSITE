import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar'; // Importe ton composant ici
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <CartProvider>
          <Navbar /> {/* Appel du composant ici */}
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}