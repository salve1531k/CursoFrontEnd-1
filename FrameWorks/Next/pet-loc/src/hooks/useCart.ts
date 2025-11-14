import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CartItem {
  id: string;
  productId: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
  userId: string;
}

export function useCart(userId?: string) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart items
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadCart = async () => {
      try {
        const q = query(collection(db, 'cart'), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CartItem[];
        setCartItems(items);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [userId]);

  const addToCart = async (product: any) => {
    if (!userId) return;

    try {
      // Check if item already exists
      const existingItem = cartItems.find(item => item.productId === product.id);

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantidade + 1;
        await updateDoc(doc(db, 'cart', existingItem.id), {
          quantidade: newQuantity,
          updatedAt: new Date()
        });
        setCartItems(prev =>
          prev.map(item =>
            item.id === existingItem.id
              ? { ...item, quantidade: newQuantity }
              : item
          )
        );
      } else {
        // Add new item
        const cartItem = {
          productId: product.id,
          nome: product.nome,
          preco: product.preco,
          quantidade: 1,
          imagem: product.imagem,
          userId,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const docRef = await addDoc(collection(db, 'cart'), cartItem);
        setCartItems(prev => [...prev, { id: docRef.id, ...cartItem }]);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateQuantity = async (itemId: string, quantidade: number) => {
    if (quantidade <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      await updateDoc(doc(db, 'cart', itemId), {
        quantidade: quantidade,
        updatedAt: new Date()
      });
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantidade: quantidade } : item
        )
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, 'cart', itemId));
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      const deletePromises = cartItems.map(item =>
        deleteDoc(doc(db, 'cart', item.id))
      );
      await Promise.all(deletePromises);
      setCartItems([]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantidade, 0);
  };

  return {
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getItemCount
  };
}
