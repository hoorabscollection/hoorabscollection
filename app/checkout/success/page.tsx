'use client'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart-store'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import Link from 'next/link'

export default function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: { session_id?: string }
}) {
  const clearCart = useCart(s => s.clearCart)
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    if (!cleared) {
      clearCart()
      setCleared(true)
    }
  }, [clearCart, cleared])

  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* Success icon */}
          <div className="w-20 h-20 bg-seagreen/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>

          <h1 className="font-playfair text-4xl font-black text-gray-900 mb-3">
            Order Confirmed!
          </h1>
          <p className="font-playfair text-xl text-crimson italic mb-6">
            JazakAllah Khair 🌹
          </p>

          <div className="bg-white border border-gray-100 rounded p-6 mb-8 text-left shadow-sm">
            <h2 className="font-playfair font-bold text-lg mb-4">What happens next?</h2>
            <div className="space-y-3 font-cormorant text-base text-gray-600">
              <div className="flex gap-3">
                <span className="text-crimson font-bold">1.</span>
                <p>You'll receive a confirmation email shortly with your order details</p>
              </div>
              <div className="flex gap-3">
                <span className="text-crimson font-bold">2.</span>
                <p>We'll prepare your order within 1-2 business days</p>
              </div>
              <div className="flex gap-3">
                <span className="text-crimson font-bold">3.</span>
                <p>You'll receive a shipping notification with tracking details</p>
              </div>
              <div className="flex gap-3">
                <span className="text-crimson font-bold">4.</span>
                <p>Your beautiful outfit will arrive at your door!</p>
              </div>
            </div>
          </div>

          <div className="bg-gold-pale border border-gold/20 rounded p-5 mb-8">
            <p className="font-cormorant text-base text-gray-700">
              Questions about your order? WhatsApp us at{' '}
              <a
                href="https://wa.me/447876621936"
                target="_blank"
                className="text-crimson font-semibold hover:underline"
              >
                +44 787 662 1936
              </a>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account" className="btn-crimson">
              View My Orders
            </Link>
            <Link href="/shop" className="btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
