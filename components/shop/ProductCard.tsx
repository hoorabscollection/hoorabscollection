'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cart-store'
import toast from 'react-hot-toast'
import { ShoppingBag } from 'lucide-react'

export default function ProductCard({ product }: { product: any }) {
  const addItem = useCart(s => s.addItem)
  const img = product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400'

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: img,
      quantity: 1,
    })
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-3">
        <Image src={img} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
        {product.compare_price && (
          <span className="absolute top-3 left-3 bg-crimson text-white font-cinzel text-[9px] tracking-widest px-2 py-1 uppercase">
            Sale
          </span>
        )}
        {product.is_featured && (
          <span className="absolute top-3 right-3 bg-gold text-white font-cinzel text-[9px] tracking-widest px-2 py-1 uppercase">
            New
          </span>
        )}
        <button onClick={handleAdd}
          className="absolute bottom-0 left-0 right-0 bg-crimson/95 text-white font-cinzel text-xs tracking-widest py-3 uppercase translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-center gap-2">
          <ShoppingBag size={14}/> Add to Cart
        </button>
      </div>
      <div className="px-1">
        <p className="font-cinzel text-[9px] tracking-widest text-gold uppercase mb-1">{product.categories?.name}</p>
        <h3 className="font-playfair text-base font-bold text-gray-900 leading-tight mb-2">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-bold text-crimson">£{product.price.toFixed(2)}</span>
          {product.compare_price && (
            <span className="text-gray-400 line-through text-sm">£{product.compare_price.toFixed(2)}</span>
          )}
        </div>
        {product.colours?.length > 0 && (
          <div className="flex gap-1 mt-2">
            {product.colours.slice(0,4).map((c: string) => (
              <span key={c} className="font-cinzel text-[8px] tracking-widest text-gray-500 bg-gray-100 px-1.5 py-0.5">{c}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
