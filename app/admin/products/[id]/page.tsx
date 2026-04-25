import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login')

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', params.id).single(),
    supabase.from('categories').select('*').order('sort_order')
  ])

  if (!product) redirect('/admin/products')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1A0A0A] text-white px-6 py-4 flex items-center gap-6">
        <Link href="/admin/products" className="font-playfair text-xl font-black text-crimson">← Products</Link>
        <span className="font-cinzel text-xs tracking-widest text-gold uppercase">Edit Product</span>
        <a href={`/shop/${params.id}`} target="_blank"
          className="ml-auto font-cinzel text-xs tracking-widest text-gold/60 hover:text-gold uppercase">
          View on Site →
        </a>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="font-playfair text-3xl font-black mb-8">Edit: {product.name}</h1>
        <div className="bg-white border border-gray-100 rounded p-8">
          <ProductForm product={product} categories={categories || []}/>
        </div>
      </div>
    </div>
  )
}
