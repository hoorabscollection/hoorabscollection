'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ShopFilters({ categories, current, sort }: { categories: any[]; current?: string; sort?: string }) {
  const router = useRouter()
  const sp = useSearchParams()

  const setSort = (s: string) => {
    const params = new URLSearchParams(sp.toString())
    params.set('sort', s)
    router.push(`/shop?${params}`)
  }

  return (
    <aside className="hidden md:block w-52 shrink-0">
      <div className="mb-8">
        <h3 className="font-cinzel text-xs tracking-widest text-gray-500 uppercase mb-4">Categories</h3>
        <ul className="space-y-2">
          <li>
            <Link href="/shop" className={`font-cormorant text-base ${!current ? 'text-crimson font-semibold' : 'text-gray-600 hover:text-crimson'} transition-colors`}>
              All Collections
            </Link>
          </li>
          {categories.map(c => (
            <li key={c.id}>
              <Link href={`/shop?category=${c.slug}`}
                className={`font-cormorant text-base ${current === c.slug ? 'text-crimson font-semibold' : 'text-gray-600 hover:text-crimson'} transition-colors`}>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-cinzel text-xs tracking-widest text-gray-500 uppercase mb-4">Sort By</h3>
        <ul className="space-y-2">
          {[['Newest', ''], ['Price: Low → High', 'price_asc'], ['Price: High → Low', 'price_desc']].map(([l, v]) => (
            <li key={v}>
              <button onClick={() => setSort(v)}
                className={`font-cormorant text-base ${(sort || '') === v ? 'text-crimson font-semibold' : 'text-gray-600 hover:text-crimson'} transition-colors`}>
                {l}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
