'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase'

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
  syncToDb: (userId: string) => Promise<void>
  loadFromDb: (userId: string) => Promise<void>
  subtotal: () => number
  total: () => number
  itemCount: () => number
}

const syncCartToDb = async (userId: string, items: CartItem[], promoCode: string, discount: number) => {
  try {
    const supabase = createClient()
    await supabase.from('carts').upsert({
      user_id: userId,
      items: items,
      promo_code: promoCode || null,
      discount_amount: discount || 0,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
  } catch (err) {
    console.error('Cart sync error:', err)
  }
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
        let newItems: CartItem[]
        if (existing) {
          newItems = get().items.map(i =>
            i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
          )
        } else {
          newItems = [...get().items, { ...item, id: crypto.randomUUID() }]
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

        // Sync to DB if user logged in
        createClient().auth.getUser().then(({ data: { user } }) => {
          if (user) syncCartToDb(user.id, get().items, get().promoCode, get().discount)
        })
      },

      removeItem: (id) => {
        const newItems = get().items.filter(i => i.id !== id)
        if (newItems.length === 0) {
          set({ items: [], promoCode: '', promoData: null, discount: 0 })
        } else {
          set({ items: newItems })
          const state = get()
          if (state.promoData) {
            const sub = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
            const disc = state.promoData.discount_type === 'percentage'
              ? (sub * state.promoData.discount_value) / 100
              : Math.min(state.promoData.discount_value, sub)
            set({ discount: Math.round(disc * 100) / 100 })
          }
        }
        createClient().auth.getUser().then(({ data: { user } }) => {
          if (user) syncCartToDb(user.id, get().items, get().promoCode, get().discount)
        })
      },

      updateQty: (id, qty) => {
        if (qty < 1) { get().removeItem(id); return }
        const newItems = get().items.map(i => i.id === id ? { ...i, quantity: qty } : i)
        set({ items: newItems })
        const state = get()
        if (state.promoData) {
          const sub = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          const disc = state.promoData.discount_type === 'percentage'
            ? (sub * state.promoData.discount_value) / 100
            : Math.min(state.promoData.discount_value, sub)
          set({ discount: Math.round(disc * 100) / 100 })
        }
        createClient().auth.getUser().then(({ data: { user } }) => {
          if (user) syncCartToDb(user.id, get().items, get().promoCode, get().discount)
        })
      },

      clearCart: () => {
        set({ items: [], promoCode: '', promoData: null, discount: 0 })
        createClient().auth.getUser().then(({ data: { user } }) => {
          if (user) syncCartToDb(user.id, [], '', 0)
        })
      },

      setPromo: (code, discountAmount, promoData) => {
        set({ promoCode: code, discount: discountAmount, promoData: promoData || null })
        createClient().auth.getUser().then(({ data: { user } }) => {
          if (user) syncCartToDb(user.id, get().items, code, discountAmount)
        })
      },

      clearPromo: () => set({ promoCode: '', promoData: null, discount: 0 }),

      syncToDb: async (userId: string) => {
        await syncCartToDb(userId, get().items, get().promoCode, get().discount)
      },

      loadFromDb: async (userId: string) => {
        try {
          const supabase = createClient()
          const { data } = await supabase
            .from('carts')
            .select('*')
            .eq('user_id', userId)
            .single()

          if (data && data.items && data.items.length > 0) {
            set({
              items: data.items,
              promoCode: data.promo_code || '',
              discount: data.discount_amount || 0,
            })
          }
        } catch (err) {
          console.error('Cart load error:', err)
        }
      },

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
