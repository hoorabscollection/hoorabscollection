import { createServerSupabase } from '@/lib/supabase-server'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import ProductCard from '@/components/shop/ProductCard'
import ShopFilters from '@/components/shop/ShopFilters'

export default async function ShopPage({ searchParams }: { searchParams: { category?: string; sort?: string; q?: string } }) {
  const supabase = createServerSupabase()

  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true)

  if (searchParams.category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', searchParams.category).single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (searchParams.q) {
    query = query.ilike('name', `%${searchParams.q}%`)
  }

  if (searchParams.sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (searchParams.sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data: products } = await query
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order')

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-baseline justify-between mb-10">
          <div>
            <div className="section-eyebrow mb-2">
              <span className="w-8 h-px bg-gold opacity-50"/>Shop<span className="w-8 h-px bg-gold opacity-50"/>
            </div>
            <h1 className="section-title">
              {searchParams.category
                ? categories?.find(c => c.slug === searchParams.category)?.name || 'Collection'
                : 'All Collections'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{products?.length || 0} items</p>
          </div>
        </div>

        <div className="flex gap-8">
          <ShopFilters categories={categories || []} current={searchParams.category} sort={searchParams.sort} />

          <div className="flex-1">
            {products && products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <p className="font-cormorant text-2xl">No products found</p>
                <p className="text-sm mt-2">Try a different category or search term</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
