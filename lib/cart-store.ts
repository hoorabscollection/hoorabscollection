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

interface PromoData {
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
}

interface CartStore {
  items: CartItem[]
  promoCode: string
  promoData: PromoData | null
  discount: number
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  setPromo: (code: string, discountAmount: number, promoData?: PromoData) => void
  clearPromo: () => void
  subtotal: () => number
  total: () => number
  itemCount: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: '',
      promoData: null,
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
        // Recalculate discount when item added
        const state = get()
        if (state.promoData) {
          const sub = get().subtotal()
          const disc = state.promoData.discount_type === 'percentage'
            ? (sub * state.promoData.discount_value) / 100
            : Math.min(state.promoData.discount_value, sub)
          set({ discount: Math.round(disc * 100) / 100 })
        }
      },

      removeItem: (id) => {
        const newItems = get().items.filter(i => i.id !== id)
        if (newItems.length === 0) {
          set({ items: [], promoCode: '', promoData: null, discount: 0 })
          return
        }
        set({ items: newItems })
        // Recalculate discount
        const state = get()
        if (state.promoData) {
          const sub = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          const disc = state.promoData.discount_type === 'percentage'
            ? (sub * state.promoData.discount_value) / 100
            : Math.min(state.promoData.discount_value, sub)
          set({ discount: Math.round(disc * 100) / 100 })
        }
      },

      updateQty: (id, qty) => {
        if (qty < 1) { get().removeItem(id); return }
        set(s => ({ items: s.items.map(i => i.id === id ? { ...i, quantity: qty } : i) }))
        // Recalculate discount
        const state = get()
        if (state.promoData) {
          const sub = get().subtotal()
          const disc = state.promoData.discount_type === 'percentage'
            ? (sub * state.promoData.discount_value) / 100
            : Math.min(state.promoData.discount_value, sub)
          set({ discount: Math.round(disc * 100) / 100 })
        }
      },

      clearCart: () => set({ items: [], promoCode: '', promoData: null, discount: 0 }),

      setPromo: (code, discountAmount, promoData) => set({
        promoCode: code,
        discount: discountAmount,
        promoData: promoData || null
      }),

      clearPromo: () => set({ promoCode: '', promoData: null, discount: 0 }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      total: () => {
        const sub = get().subtotal()
        const disc = Math.min(get().discount, sub)
        return Math.max(0, sub - disc)
      },

      itemCount: () => get().items.reduce((n, i) => n + i.quantity, 0),
    }),
    { name: 'hoorab-cart' }
  )
)
