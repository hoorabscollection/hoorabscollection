'use client'
import { useState } from 'react'
import { useCart } from '@/lib/cart-store'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, subtotal, total, discount, promoCode, itemCount } = useCart()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          discount: discount,
          promoCode,
        })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch (err) {
      toast.error('Payment error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-8">
          <div className="section-eyebrow mb-2">
            <span className="w-8 h-px bg-gold opacity-50"/>Checkout
          </div>
          <h1 className="section-title">Review Your Order</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Order items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-playfair text-xl font-bold mb-4">
              Your Items ({itemCount()} items)
            </h2>
            {items.map(item => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100">
                <div className="relative w-20 h-24 shrink-0 bg-gray-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover"/>
                </div>
                <div className="flex-1">
                  <h3 className="font-playfair font-bold">{item.name}</h3>
                  {item.selected_colour && (
                    <p className="text-sm text-gray-500">Colour: {item.selected_colour}</p>
                  )}
                  {item.selected_size && (
                    <p className="text-sm text-gray-500">Size: {item.selected_size}</p>
                  )}
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="font-bold text-crimson">
                  £{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            {/* What happens next */}
            <div className="bg-gold-pale border border-gold/20 rounded p-5 mt-6">
              <h3 className="font-playfair font-bold mb-3">What happens next?</h3>
              <div className="space-y-2 text-sm text-gray-600 font-cormorant text-base">
                <p>✓ You'll be taken to our secure Stripe payment page</p>
                <p>✓ Enter your delivery address and card details</p>
                <p>✓ You'll receive an order confirmation email instantly</p>
                <p>✓ We'll process and dispatch your order within 2-3 days</p>
                <p>✓ Track your order from your account page</p>
              </div>
            </div>

            {/* WhatsApp alternative */}
            <div className="bg-white border border-gray-100 rounded p-5">
              <p className="font-cormorant text-base text-gray-600 mb-3">
                Prefer to order via WhatsApp? We're happy to help!
              </p>
              <a
                href={`https://wa.me/447876621936?text=Assalamu%20Alaikum!%20I%20would%20like%20to%20place%20an%20order.`}
                target="_blank"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-cinzel text-xs tracking-widest px-5 py-3 uppercase hover:bg-green-600 transition-colors"
              >
                💬 Order via WhatsApp Instead
              </a>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white border border-gray-100 p-6 h-fit shadow-sm">
            <h2 className="font-playfair text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>£{subtotal().toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-seagreen">
                  <span>Discount ({promoCode})</span>
                  <span>-£{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="text-seagreen font-medium">Free 🇬🇧</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-3">
                <span>Total</span>
                <span className="text-crimson text-lg">£{total().toFixed(2)}</span>
              </div>
            </div>

            {/* Security badges */}
            <div className="flex items-center gap-2 mb-5 text-xs text-gray-400 font-cinzel tracking-widest">
              <span>🔒</span>
              <span>SECURE CHECKOUT VIA STRIPE</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-crimson text-white font-cinzel text-xs tracking-widest py-4 uppercase hover:bg-crimson-deep transition-colors disabled:opacity-50 mb-3"
            >
              {loading ? 'Redirecting to payment...' : `Pay £${total().toFixed(2)} Securely`}
            </button>

            <Link
              href="/cart"
              className="block text-center text-sm text-gray-400 hover:text-crimson transition-colors font-cinzel text-xs tracking-widest uppercase"
            >
              ← Back to Cart
            </Link>

            <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center space-y-1">
              <p>Accepted: Visa, Mastercard, Amex</p>
              <p>Free UK delivery on all orders</p>
              <p>14-day returns policy</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
