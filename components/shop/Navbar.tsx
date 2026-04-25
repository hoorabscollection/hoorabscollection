'use client'
import Link from 'next/link'
import { useCart } from '@/lib/cart-store'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const count = useCart(s => s.itemCount())
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className="font-playfair text-2xl font-black text-crimson leading-none">Hoorab's Collection</span>
          <span className="font-cinzel text-[9px] tracking-widest text-gray-500 uppercase">Pakistani Couture · London</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[['Shop', '/shop'], ['Bridal', '/shop?category=bridal'], ['Casual', '/shop?category=casual'], ['Accessories', '/shop?category=accessories'], ['Contact', '/contact']].map(([l, h]) => (
            <Link key={l} href={h} className="font-cinzel text-[11px] tracking-widest text-gray-900 hover:text-crimson uppercase transition-colors font-semibold">{l}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/account" className="text-gray-700 hover:text-crimson transition-colors">
            <User size={20}/>
          </Link>
          <Link href="/cart" className="relative text-gray-700 hover:text-crimson transition-colors">
            <ShoppingBag size={20}/>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-crimson text-white text-[10px] rounded-full flex items-center justify-center font-bold">{count}</span>
            )}
          </Link>
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank"
            className="hidden md:block bg-crimson text-white font-cinzel text-[10px] tracking-widest px-4 py-2 uppercase hover:bg-crimson-deep transition-colors">
            Order Now
          </a>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {[['Shop All', '/shop'], ['Bridal Wear', '/shop?category=bridal'], ['Casual Wear', '/shop?category=casual'], ['Formal Wear', '/shop?category=formal'], ['Accessories', '/shop?category=accessories'], ['Contact Us', '/contact'], ['My Account', '/account']].map(([l, h]) => (
            <Link key={l} href={h} onClick={() => setOpen(false)}
              className="font-cinzel text-xs tracking-widest text-gray-700 uppercase">{l}</Link>
          ))}
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank"
            className="bg-crimson text-white font-cinzel text-xs tracking-widest px-4 py-3 uppercase text-center">💬 WhatsApp Order</a>
        </div>
      )}
    </header>
  )
}
