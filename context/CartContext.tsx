"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  stock: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Charger le panier depuis le stockage local au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Sauvegarder automatiquement le panier à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    // Si le stock initial est déjà à 0
    if (product.stock <= 0) {
      alert(`Désolé, le produit "${product.title}" est épuisé !`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        // Validation : Si la quantité dans le panier atteint déjà le stock max
        if (existing.quantity >= product.stock) {
          alert(`Stock limité ! Vous ne pouvez pas commander plus de ${product.stock} exemplaires de "${product.title}".`);
          return prevCart;
        }
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { id: product.id, title: product.title, price: product.price, imageUrl: product.imageUrl, quantity: 1, stock: product.stock }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return;
    
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        // Validation pour le bouton "+" dans la page Commande
        if (quantity > item.stock) {
          alert(`Stock limité ! Seulement ${item.stock} pièces disponibles pour "${item.title}".`);
          return item; // On n'augmente pas
        }
        return { ...item, quantity };
      }
      return item;
    }));
  };
  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans un CartProvider");
  return context;
}