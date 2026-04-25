import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'

export default async function NewProductPage() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login')

  const { data: categories } = await supabase.from('categories').select('*').order('sort_order')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1A0A0A] text-white px-6 py-4 flex items-center gap-6">
        <Link href="/admin/products" className="font-playfair text-xl font-black text-crimson">← Products</Link>
        <span className="font-cinzel text-xs tracking-widest text-gold uppercase">Add New Product</span>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="font-playfair text-3xl font-black mb-8">Add New Product</h1>
        <div className="bg-white border border-gray-100 rounded p-8">
          <ProductForm categories={categories || []}/>
        </div>
      </div>
    </div>
  )
}
