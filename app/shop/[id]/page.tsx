'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useCart } from '@/lib/cart-store'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ShoppingBag, ChevronLeft } from 'lucide-react'

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [selectedImg, setSelectedImg] = useState(0)
  const [selectedColour, setSelectedColour] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const addItem = useCart(s => s.addItem)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('products').select('*, categories(name,slug)').eq('id', params.id).single()
      .then(({ data }) => { if (data) setProduct(data) })
  }, [params.id])

  if (!product) return (
    <>
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="font-cormorant text-2xl text-gray-400">Loading...</div>
      </div>
      <Footer />
    </>
  )

  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600']

  const handleAdd = () => {
    if (product.colours?.length > 0 && !selectedColour) { toast.error('Please select a colour'); return }
    if (product.sizes?.length > 0 && !selectedSize) { toast.error('Please select a size'); return }
    addItem({
      product_id: product.id, name: product.name,
      price: product.price, image: images[0],
      quantity: qty, selected_colour: selectedColour, selected_size: selectedSize
    })
    toast.success(`${product.name} added to cart! 🌹`)
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-8 py-12">
        <Link href="/shop" className="flex items-center gap-2 font-cinzel text-xs tracking-widest text-gray-400 hover:text-crimson uppercase mb-8 transition-colors">
          <ChevronLeft size={14}/> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Images */}
          <div>
            <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
              <Image src={images[selectedImg]} alt={product.name} fill className="object-cover"/>
              {product.compare_price && (
                <span className="absolute top-4 left-4 bg-crimson text-white font-cinzel text-xs tracking-widest px-3 py-1">SALE</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImg(i)}
                    className={`relative w-16 h-20 overflow-hidden border-2 transition-colors ${selectedImg === i ? 'border-crimson' : 'border-transparent'}`}>
                    <Image src={img} alt="" fill className="object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="font-cinzel text-xs tracking-widest text-gold uppercase mb-2">{product.categories?.name}</p>
            <h1 className="font-playfair text-4xl font-black text-gray-900 leading-tight mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-playfair text-3xl font-bold text-crimson">£{product.price.toFixed(2)}</span>
              {product.compare_price && (
                <span className="text-gray-400 line-through text-xl">£{product.compare_price.toFixed(2)}</span>
              )}
              {product.compare_price && (
                <span className="bg-crimson/10 text-crimson font-cinzel text-xs px-2 py-1">
                  Save £{(product.compare_price - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="font-cormorant text-lg text-gray-600 leading-relaxed mb-8">{product.description}</p>
            )}

            {/* Colours */}
            {product.colours?.length > 0 && (
              <div className="mb-6">
                <p className="font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-3">
                  Colour {selectedColour && <span className="text-crimson">— {selectedColour}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colours.map((c: string) => (
                    <button key={c} onClick={() => setSelectedColour(c)}
                      className={`font-cinzel text-xs px-4 py-2 border transition-all ${selectedColour === c ? 'bg-crimson text-white border-crimson' : 'border-gray-300 hover:border-crimson'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <p className="font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-3">
                  Size {selectedSize && <span className="text-crimson">— {selectedSize}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s: string) => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`font-cinzel text-xs px-4 py-2 border transition-all ${selectedSize === s ? 'bg-crimson text-white border-crimson' : 'border-gray-300 hover:border-crimson'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center border border-gray-200">
                <button onClick={() => setQty(q => Math.max(1, q-1))} className="px-4 py-3 hover:bg-gray-50 transition-colors">−</button>
                <span className="px-4 py-3 font-mono text-sm min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(q => q+1)} className="px-4 py-3 hover:bg-gray-50 transition-colors">+</button>
              </div>
              <button onClick={handleAdd} className="flex-1 btn-crimson flex items-center justify-center gap-2">
                <ShoppingBag size={16}/> Add to Cart
              </button>
            </div>

            {/* WhatsApp */}
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi! I'm interested in: ${product.name} (£${product.price})`}
              target="_blank"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-cinzel text-xs tracking-widest py-4 uppercase hover:bg-green-600 transition-colors mb-8">
              💬 Order via WhatsApp Instead
            </a>

            <div className="border-t border-gray-100 pt-6 space-y-2 text-sm text-gray-500 font-cormorant">
              <p>✓ Free UK delivery</p>
              <p>✓ Authentic Pakistani designs</p>
              <p>✓ Personal service via WhatsApp</p>
              <p>✓ Easy returns within 14 days</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
