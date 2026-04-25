'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  image: string
  quantity: number
  selected_colour?: string
  selected_size?: string
}

interface CartStore {
  items: CartItem[]
  promoCode: string
  discount: number
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  setPromo: (code: string, discount: number) => void
  subtotal: () => number
  total: () => number
  itemCount: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: '',
      discount: 0,

      addItem: (item) => {
        const existing = get().items.find(
          i => i.product_id === item.product_id &&
               i.selected_colour === item.selected_colour &&
               i.selected_size === item.selected_size
        )
        if (existing) {
          set(s => ({ items: s.items.map(i =>
            i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
          )}))
        } else {
          set(s => ({ items: [...s.items, { ...item, id: crypto.randomUUID() }] }))
        }
      },

      removeItem: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),

      updateQty: (id, qty) => {
        if (qty < 1) { get().removeItem(id); return }
        set(s => ({ items: s.items.map(i => i.id === id ? { ...i, quantity: qty } : i) }))
      },

      clearCart: () => set({ items: [], promoCode: '', discount: 0 }),

      setPromo: (code, discount) => set({ promoCode: code, discount }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      total: () => {
        const sub = get().subtotal()
        return Math.max(0, sub - get().discount)
      },

      itemCount: () => get().items.reduce((n, i) => n + i.quantity, 0),
    }),
    { name: 'hoorab-cart' }
  )
)
