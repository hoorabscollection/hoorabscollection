import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function AdminProductsPage() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login')

  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1A0A0A] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-playfair text-xl font-black text-crimson">← Dashboard</Link>
          <span className="font-cinzel text-xs tracking-widest text-gold uppercase">Products</span>
        </div>
        <Link href="/admin/products/new" className="bg-crimson text-white font-cinzel text-xs tracking-widest px-4 py-2 uppercase hover:bg-red-800 transition-colors">
          + Add Product
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-playfair text-3xl font-black">Products ({products?.length || 0})</h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(products || []).map(p => (
            <Link key={p.id} href={`/admin/products/${p.id}`} className="bg-white border border-gray-100 rounded hover:shadow-md transition-shadow">
              <div className="relative aspect-[3/4] bg-gray-100">
                {p.images?.[0] ? (
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover rounded-t"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 font-cormorant text-sm">No image</div>
                )}
                {!p.is_active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="font-cinzel text-xs text-white tracking-widest bg-gray-800 px-2 py-1">HIDDEN</span>
                  </div>
                )}
                {p.is_featured && (
                  <span className="absolute top-2 right-2 bg-gold text-white font-cinzel text-[9px] px-2 py-1">FEATURED</span>
                )}
              </div>
              <div className="p-3">
                <p className="font-cinzel text-[9px] tracking-widest text-gold uppercase mb-1">{p.categories?.name}</p>
                <p className="font-playfair font-bold text-sm leading-tight mb-1">{p.name}</p>
                <p className="font-bold text-crimson text-sm">£{p.price.toFixed(2)}</p>
                <p className="text-gray-400 text-xs mt-1">Stock: {p.stock_quantity}</p>
              </div>
            </Link>
          ))}
        </div>

        {!products?.length && (
          <div className="text-center py-20">
            <p className="font-cormorant text-2xl text-gray-400 mb-4">No products yet</p>
            <Link href="/admin/products/new" className="btn-crimson">+ Add Your First Product</Link>
          </div>
        )}
      </div>
    </div>
  )
}
