import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Package, Users, Tag, TrendingUp, MessageSquare } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login')

  // Fetch stats
  const [
    { count: totalOrders }, { count: pendingOrders },
    { count: totalProducts }, { count: totalMembers },
    { count: newEnquiries }, { data: recentOrders }
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('orders').select('id, order_number, customer_name, customer_email, customer_phone, total, status, created_at, shipping_city, shipping_postcode').order('created_at', { ascending: false }).limit(8),
  ])

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-[#1A0A0A] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <span className="font-playfair text-xl font-black text-crimson">Hoorab's</span>
          <span className="font-cinzel text-xs tracking-widest text-gold ml-2">Admin Portal</span>
        </div>
        <div className="flex items-center gap-6">
          {[['Dashboard', '/admin'], ['Products', '/admin/products'], ['Orders', '/admin/orders'], ['Members', '/admin/members'], ['Promotions', '/admin/promotions'], ['Enquiries', '/admin/enquiries']].map(([l, h]) => (
            <Link key={l} href={h} className="font-cinzel text-xs tracking-widest text-gray-300 hover:text-white uppercase">{l}</Link>
          ))}
          <Link href="/" className="font-cinzel text-xs text-gold hover:text-gold-light">← View Site</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="font-playfair text-3xl font-black mb-2">Dashboard</h1>
        <p className="text-gray-500 text-sm mb-8">Welcome back! Here's what's happening today.</p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-crimson', href: '/admin/orders' },
            { label: 'Pending Orders', value: pendingOrders, icon: Package, color: 'text-amber-600', href: '/admin/orders?status=pending' },
            { label: 'Active Products', value: totalProducts, icon: Tag, color: 'text-seagreen', href: '/admin/products' },
            { label: 'Members', value: totalMembers, icon: Users, color: 'text-seablue', href: '/admin/members' },
            { label: 'New Enquiries', value: newEnquiries, icon: MessageSquare, color: 'text-purple-600', href: '/admin/enquiries' },
          ].map(s => (
            <Link key={s.label} href={s.href} className="bg-white border border-gray-100 rounded p-5 hover:shadow-md transition-shadow">
              <s.icon className={`${s.color} mb-3`} size={22}/>
              <div className="font-playfair text-3xl font-black">{s.value ?? 0}</div>
              <div className="font-cinzel text-[10px] tracking-widest text-gray-400 uppercase mt-1">{s.label}</div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Link href="/admin/products/new" className="btn-crimson text-center text-xs py-3">+ Add Product</Link>
          <Link href="/admin/promotions" className="btn-outline text-center text-xs py-3">+ Create Promo</Link>
          <Link href="/admin/members/email" className="bg-seagreen text-white font-cinzel text-xs tracking-widest py-3 text-center uppercase hover:bg-seagreen-light transition-colors">📧 Email Members</Link>
          <Link href="/admin/orders" className="bg-seablue text-white font-cinzel text-xs tracking-widest py-3 text-center uppercase hover:bg-seablue-light transition-colors">📦 View All Orders</Link>
        </div>

        {/* Recent orders */}
        <div className="bg-white border border-gray-100 rounded">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-playfair text-lg font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="font-cinzel text-xs text-crimson tracking-widest">View All →</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Order', 'Customer', 'Date', 'Total', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-6 py-3 font-cinzel text-[10px] tracking-widest text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentOrders || []).map(o => (
                <tr key={o.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-crimson font-bold">{o.order_number}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{o.customer_name}</div>
                    <div className="text-gray-400 text-xs">{o.customer_email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{new Date(o.created_at).toLocaleDateString('en-GB')}</td>
                  <td className="px-6 py-4 font-bold text-crimson">£{o.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`font-cinzel text-[9px] tracking-widest px-2 py-1 rounded uppercase ${statusColor[o.status] || 'bg-gray-100'}`}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${o.id}`} className="font-cinzel text-xs text-seablue tracking-widest hover:underline">Manage →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
