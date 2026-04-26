'use client'
import { useCart } from '@/lib/cart-store'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, total, discount, promoCode, setPromo } = useCart()
  const [promo, setPromoInput] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)

  const applyPromo = async () => {
    setPromoLoading(true)
    const res = await fetch('/api/promotions/validate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: promo, order_total: subtotal() })
    })
    const data = await res.json()
    if (data.success) {
      setPromo(promo.toUpperCase(), data.discount_amount, {
        code: data.code,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
      })
      toast.success(data.message || `Promo applied!`)
    } else {
      toast.error(data.error || 'Invalid promo code')
    }
    setPromoLoading(false)
  }

  if (items.length === 0) return (
    <>
      <Navbar />
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <p className="font-playfair text-3xl text-gray-400">Your cart is empty</p>
        <Link href="/shop" className="btn-crimson">Continue Shopping</Link>
      </div>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-8 py-12">
        <h1 className="section-title mb-10">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-100">
                <div className="relative w-24 h-32 shrink-0 bg-gray-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover"/>
                </div>
                <div className="flex-1">
                  <h3 className="font-playfair font-bold text-lg">{item.name}</h3>
                  {item.selected_colour && <p className="text-sm text-gray-500">Colour: {item.selected_colour}</p>}
                  {item.selected_size && <p className="text-sm text-gray-500">Size: {item.selected_size}</p>}
                  <p className="font-bold text-crimson mt-1">£{item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:border-crimson transition-colors"><Minus size={12}/></button>
                    <span className="font-mono text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:border-crimson transition-colors"><Plus size={12}/></button>
                    <button onClick={() => removeItem(item.id)} className="ml-2 text-gray-400 hover:text-crimson transition-colors"><Trash2 size={14}/></button>
                  </div>
                </div>
                <div className="text-right font-bold">£{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white p-6 border border-gray-100 h-fit">
            <h2 className="font-playfair text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>£{subtotal().toFixed(2)}</span></div>
              {discount > 0 && <div className="flex justify-between text-seagreen"><span>Discount ({promoCode})</span><span>-£{discount.toFixed(2)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-seagreen">Free</span></div>
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-3"><span>Total</span><span className="text-crimson">£{total().toFixed(2)}</span></div>
            </div>

            {/* Promo code */}
            <div className="flex gap-2 mb-6">
              <input value={promo} onChange={e => setPromoInput(e.target.value.toUpperCase())}
                placeholder="Promo code" className="input flex-1 text-sm"/>
              <button onClick={applyPromo} disabled={promoLoading}
                className="bg-gray-900 text-white font-cinzel text-xs tracking-widest px-4 uppercase hover:bg-crimson transition-colors disabled:opacity-50">
                {promoLoading ? '...' : 'Apply'}
              </button>
            </div>

            <Link href="/checkout" className="btn-crimson w-full text-center block">
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="block text-center text-sm text-gray-500 hover:text-crimson mt-4 transition-colors">Continue Shopping</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
