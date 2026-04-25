import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import Link from 'next/link'

export default async function AccountPage() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('orders').select('*, order_items(*)').eq('user_id', user.id).order('created_at', { ascending: false })
  ])

  const statusColor: Record<string, string> = {
    pending: 'text-yellow-600', confirmed: 'text-blue-600',
    shipped: 'text-indigo-600', delivered: 'text-green-600', cancelled: 'text-red-600',
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="section-eyebrow mb-2"><span className="w-8 h-px bg-gold opacity-50"/>My Account</div>
            <h1 className="section-title">Welcome, {profile?.full_name?.split(' ')[0] || 'there'} 👋</h1>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="font-cinzel text-xs tracking-widest text-gray-400 hover:text-crimson uppercase transition-colors">Sign Out</button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile */}
          <div className="bg-white border border-gray-100 rounded p-6">
            <h2 className="font-playfair text-lg font-bold mb-4">My Details</h2>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Name:</span> {profile?.full_name || '—'}</p>
              <p><span className="font-medium">Phone:</span> {profile?.phone || '—'}</p>
              <p><span className="font-medium">City:</span> {profile?.city || '—'}</p>
              <p><span className="font-medium">Postcode:</span> {profile?.postcode || '—'}</p>
            </div>
            <Link href="/account/edit" className="btn-outline text-xs py-2 mt-4 inline-block">Edit Details</Link>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <h2 className="font-playfair text-lg font-bold mb-4">My Orders</h2>
            {orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(o => (
                  <div key={o.id} className="bg-white border border-gray-100 rounded p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-mono text-sm font-bold text-crimson">{o.order_number}</span>
                        <span className="text-gray-400 text-xs ml-3">{new Date(o.created_at).toLocaleDateString('en-GB')}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-cinzel text-xs tracking-widest uppercase ${statusColor[o.status] || 'text-gray-500'}`}>{o.status}</span>
                        <p className="font-bold text-crimson mt-1">£{o.total.toFixed(2)}</p>
                      </div>
                    </div>
                    {o.tracking_number && (
                      <p className="text-sm text-seagreen font-medium">📦 Tracking: {o.tracking_number}</p>
                    )}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">{(o.order_items || []).length} item(s) · {o.shipping_city}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-gray-100 rounded">
                <p className="font-cormorant text-2xl text-gray-400 mb-4">No orders yet</p>
                <Link href="/shop" className="btn-crimson">Start Shopping</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
