import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1A0A0A] text-white pt-14 pb-8 mt-auto">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-10 border-b border-gold/15">
          <div>
            <div className="font-playfair text-2xl font-black text-crimson mb-2">Hoorab's Collection</div>
            <p className="font-cormorant text-white/50 leading-relaxed font-light mb-5">
              Bringing the finest Pakistani bridal and casual wear to London. Elegance, quality and personal service — always.
            </p>
            <div className="space-y-2">
              <a href="https://wa.me/4487662193" target="_blank" className="block text-gold-light font-dm-sans text-sm hover:text-white transition-colors">💬 WhatsApp: +44 876 621 936</a>
              <a href="tel:+4487662193" className="block text-gold-light text-sm hover:text-white transition-colors">📞 +44 876 621 936</a>
              <span className="block text-white/40 text-sm">📍 London, United Kingdom</span>
            </div>
          </div>
          <div>
            <h4 className="font-cinzel text-xs tracking-widest text-gold uppercase mb-5">Collections</h4>
            <ul className="space-y-2.5">
              {[['Bridal Wear', '/shop?category=bridal'], ['Casual Wear', '/shop?category=casual'], ['Formal Wear', '/shop?category=formal'], ['Accessories', '/shop?category=accessories']].map(([l, h]) => (
                <li key={l}><Link href={h} className="text-white/50 text-sm hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-cinzel text-xs tracking-widest text-gold uppercase mb-5">Account</h4>
            <ul className="space-y-2.5">
              {[['My Account', '/account'], ['My Orders', '/account'], ['Register', '/auth/register'], ['Login', '/auth/login']].map(([l, h]) => (
                <li key={l}><Link href={h} className="text-white/50 text-sm hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-white/25 text-xs">© 2026 Hoorab's Collection · London, United Kingdom</p>
          <div className="flex gap-4">
            <a href="/terms" className="text-white/25 text-xs hover:text-white/50 transition-colors">Terms & Conditions</a>
            <a href="/privacy" className="text-white/25 text-xs hover:text-white/50 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
