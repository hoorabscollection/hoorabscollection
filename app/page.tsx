import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import ProductCard from '@/components/shop/ProductCard'

export default async function HomePage() {
  const supabase = createServerSupabase()
  const { data: featured } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(8)

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  const catOverlay: Record<string, string> = {
    bridal: 'from-crimson-deep/70 to-transparent',
    casual: 'from-seagreen/70 to-transparent',
    formal: 'from-seablue/70 to-transparent',
    accessories: 'from-yellow-900/70 to-transparent',
  }
  const catFallback: Record<string, string> = {
    bridal: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80',
    casual: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    formal: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
    accessories: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80',
  }

  return (
    <>
      <Navbar />

      {/* ── MARQUEE ── */}
      <div className="bg-crimson text-white overflow-hidden py-2">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="font-cinzel text-xs tracking-widest px-10">
              ✦ Hoorab's Collection &nbsp;◆&nbsp; Pakistani Bridal Wear &nbsp;◆&nbsp; Casual Lawn &nbsp;◆&nbsp; Premium Accessories &nbsp;◆&nbsp; London, UK &nbsp;◆&nbsp; Order via WhatsApp
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#1A0A0A] via-[#2D1515] to-[#3D1010] overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg,rgba(201,168,76,0.5) 0px,rgba(201,168,76,0.5) 1px,transparent 1px,transparent 40px)' }}/>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-crimson rounded-full blur-[100px] opacity-30"/>
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-gold rounded-full blur-[120px] opacity-10"/>

        <div className="relative z-10 max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div>
            <div className="font-cinzel text-xs tracking-widest text-gold flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-gold"/>Pakistani Couture · London<span className="w-8 h-px bg-gold"/>
            </div>
            <h1 className="font-playfair text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
              Elegance Woven<br/>in Every <em className="text-gold-light italic">Thread</em>
            </h1>
            <p className="font-cormorant text-xl text-white/70 leading-relaxed mb-10 font-light">
              Exquisite Pakistani bridal and casual wear, handpicked and delivered to your door across the UK.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-crimson">Shop Collection</Link>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                className="border-2 border-gold text-gold-light font-cinzel text-xs tracking-widest px-6 py-3 uppercase hover:bg-gold hover:text-[#1A0A0A] transition-all">
                💬 WhatsApp Order
              </a>
            </div>
          </div>

          {/* Category cards grid */}
          <div className="hidden lg:grid grid-cols-2 gap-3">
            {(categories || []).map((cat, i) => (
              <Link key={cat.id} href={`/shop?category=${cat.slug}`}
                className={`rounded relative overflow-hidden aspect-[3/4] flex items-end p-5 bg-gradient-to-b ${catColors[cat.slug] || 'from-gray-700 to-gray-900'} group ${i % 2 === 0 ? 'mt-8' : ''}`}>
                <div>
                  <p className="font-playfair text-white font-bold text-lg">{cat.name}</p>
                  <p className="font-cinzel text-white/60 text-xs tracking-widest mt-1 group-hover:text-white transition-colors">Shop Now →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 bg-ivory" id="collections">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-14">
            <div className="section-eyebrow justify-center mb-3">
              <span className="w-10 h-px bg-gold opacity-50"/>Our Collections<span className="w-10 h-px bg-gold opacity-50"/>
            </div>
            <h2 className="section-title">Dressed for Every <em className="text-crimson italic">Occasion</em></h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {(categories || []).map(cat => (
              <Link key={cat.id} href={`/shop?category=${cat.slug}`}
                className="relative overflow-hidden rounded aspect-[2/3] flex items-end group">
                {/* Background image — uses image_url from Supabase, fallback to default */}
                <div className="absolute inset-0 bg-gray-900">
                  <img
                    src={cat.image_url || catFallback[cat.slug] || ''}
                    alt={cat.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                </div>
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${catOverlay[cat.slug] || 'from-gray-900/80 to-transparent'}`}/>
                {/* Content */}
                <div className="relative z-10 p-6">
                  <span className="inline-block bg-white/15 border border-white/30 rounded-full px-3 py-1 font-cinzel text-white text-[9px] tracking-widest mb-2 uppercase">Collection</span>
                  <p className="font-playfair text-white font-bold text-2xl leading-tight drop-shadow-lg">{cat.name}</p>
                  <p className="font-cormorant text-white/80 text-sm mt-1 font-light">{cat.description}</p>
                  <p className="font-cinzel text-white/70 text-[10px] tracking-widest mt-3 group-hover:text-white transition-all">Explore →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {featured && featured.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-14">
              <div className="section-eyebrow justify-center mb-3">
                <span className="w-10 h-px bg-gold opacity-50"/>Featured<span className="w-10 h-px bg-gold opacity-50"/>
              </div>
              <h2 className="section-title">New <em className="text-crimson italic">Arrivals</em></h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(p => <ProductCard key={p.id} product={p}/>)}
            </div>
            <div className="text-center mt-12">
              <Link href="/shop" className="btn-outline">View All Products</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── HOW TO ORDER ── */}
      <section className="py-20 bg-ivory">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="section-eyebrow justify-center mb-3">
            <span className="w-10 h-px bg-gold opacity-50"/>Simple Process<span className="w-10 h-px bg-gold opacity-50"/>
          </div>
          <h2 className="section-title mb-14">How to <em className="text-crimson italic">Order</em></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { n: '1', t: 'Browse & Choose', d: 'Browse our collection online and pick your favourite piece. Filter by category, colour or price.' },
              { n: '2', t: 'Add to Cart', d: 'Add items to your cart. Sign up for member benefits, faster checkout and order tracking.' },
              { n: '3', t: 'Pay & Receive', d: 'Pay securely via card through Stripe. We\'ll confirm your order and dispatch to your UK address.' },
            ].map(s => (
              <div key={s.n} className="relative">
                <div className="w-14 h-14 rounded-full bg-crimson text-white font-playfair text-2xl font-black flex items-center justify-center mx-auto mb-5 shadow-lg shadow-crimson/30">{s.n}</div>
                <h3 className="font-playfair text-xl font-bold mb-3">{s.t}</h3>
                <p className="font-cormorant text-gray-600 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-crimson relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 30px)' }}/>
        <div className="relative z-10 max-w-2xl mx-auto px-8">
          <h2 className="font-playfair text-4xl lg:text-5xl font-black text-white mb-4">Ready to Find Your Perfect Outfit?</h2>
          <p className="font-cormorant text-white/80 text-xl mb-10 font-light">Shop online or message us directly on WhatsApp</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/shop" className="bg-white text-crimson font-cinzel text-xs tracking-widest px-8 py-4 uppercase hover:bg-gold-pale transition-all">Shop Now</Link>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Assalamu%20Alaikum!%20I%20would%20like%20to%20enquire%20about%20your%20collection.`}
              target="_blank"
              className="bg-[#25D366] text-white font-cinzel text-xs tracking-widest px-8 py-4 uppercase hover:bg-green-600 transition-all">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating WhatsApp */}
      <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-2xl shadow-xl hover:scale-110 transition-transform z-50"
        title="Order on WhatsApp">💬</a>
    </>
  )
}
