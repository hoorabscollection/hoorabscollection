import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater'

export default async function AdminOrders({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login')

  let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (searchParams.status) query = query.eq('status', searchParams.status)
  const { data: orders } = await query

  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
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
      <nav className="bg-[#1A0A0A] text-white px-6 py-4 flex items-center gap-6">
        <Link href="/admin" className="font-playfair text-xl font-black text-crimson">← Dashboard</Link>
        <span className="font-cinzel text-xs tracking-widest text-gold uppercase">Order Management</span>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-playfair text-3xl font-black">Orders</h1>
          <span className="font-cinzel text-sm text-gray-500">{orders?.length || 0} orders</span>
        </div>

        {/* Status filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          <Link href="/admin/orders" className={`font-cinzel text-xs tracking-widest px-4 py-2 uppercase border ${!searchParams.status ? 'bg-crimson text-white border-crimson' : 'border-gray-300 text-gray-600 hover:border-crimson'}`}>All</Link>
          {statuses.map(s => (
            <Link key={s} href={`/admin/orders?status=${s}`}
              className={`font-cinzel text-xs tracking-widest px-4 py-2 uppercase border ${searchParams.status === s ? 'bg-crimson text-white border-crimson' : 'border-gray-300 text-gray-600 hover:border-crimson'}`}>{s}</Link>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Order #', 'Customer', 'Items', 'Total', 'Date', 'Status', 'Update Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-cinzel text-[10px] tracking-widest text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(orders || []).map(o => (
                <tr key={o.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs text-crimson font-bold hover:underline">{o.order_number}</Link>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-sm">{o.customer_name}</div>
                    <div className="text-gray-400 text-xs">{o.customer_email}</div>
                    <div className="text-gray-400 text-xs">{o.customer_phone}</div>
                  </td>
                  <td className="px-4 py-4 text-gray-500 text-xs">{o.shipping_city}, {o.shipping_postcode}</td>
                  <td className="px-4 py-4 font-bold text-crimson">£{o.total.toFixed(2)}</td>
                  <td className="px-4 py-4 text-gray-500 text-xs">{new Date(o.created_at).toLocaleDateString('en-GB')}</td>
                  <td className="px-4 py-4">
                    <span className={`font-cinzel text-[9px] tracking-widest px-2 py-1 rounded uppercase ${statusColor[o.status] || ''}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-4">
                    <OrderStatusUpdater orderId={o.id} currentStatus={o.status} statuses={statuses}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!orders?.length && (
            <div className="text-center py-16 text-gray-400 font-cormorant text-xl">No orders found</div>
          )}
        </div>
      </div>
    </div>
  )
}
