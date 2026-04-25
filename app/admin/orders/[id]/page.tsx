import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater'

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login')

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', params.id)
    .single()

  if (error || !order) redirect('/admin/orders')

  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1A0A0A] text-white px-6 py-4 flex items-center gap-6">
        <Link href="/admin/orders" className="font-playfair text-xl font-black text-crimson">Back to Orders</Link>
        <span className="font-cinzel text-xs tracking-widest text-gold uppercase">Order Detail</span>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-playfair text-3xl font-black mb-1">{order.order_number}</h1>
            <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-right">
            <span className={`font-cinzel text-xs tracking-widest px-3 py-1.5 rounded uppercase ${statusColor[order.status] || 'bg-gray-100'}`}>{order.status}</span>
            <p className="font-playfair text-2xl font-black text-crimson mt-2">£{order.total.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-100 rounded p-6">
            <h2 className="font-playfair text-lg font-bold mb-4">Customer Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2"><span className="text-gray-400 w-24 shrink-0">Name:</span><span className="font-medium">{order.customer_name}</span></div>
              <div className="flex gap-2"><span className="text-gray-400 w-24 shrink-0">Email:</span><a href={`mailto:${order.customer_email}`} className="text-crimson hover:underline">{order.customer_email}</a></div>
              <div className="flex gap-2"><span className="text-gray-400 w-24 shrink-0">Phone:</span><span>{order.customer_phone || 'Not provided'}</span></div>
            </div>
            <div className="flex gap-2 mt-4">
              <a href={`https://wa.me/${(order.customer_phone || '').replace(/\D/g, '')}`} target="_blank" className="bg-[#25D366] text-white font-cinzel text-xs tracking-widest px-3 py-2 uppercase hover:bg-green-600 transition-colors">💬 WhatsApp</a>
              <a href={`mailto:${order.customer_email}`} className="border border-gray-200 text-gray-600 font-cinzel text-xs tracking-widest px-3 py-2 uppercase hover:border-crimson hover:text-crimson transition-colors">✉ Email</a>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded p-6">
            <h2 className="font-playfair text-lg font-bold mb-4">Delivery Address</h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.customer_name}</p>
              <p>{order.shipping_address_line1}</p>
              {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
              <p>{order.shipping_city}</p>
              <p className="uppercase">{order.shipping_postcode}</p>
              <p>{order.shipping_country}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded p-6 mb-6">
          <h2 className="font-playfair text-lg font-bold mb-4">Items Ordered</h2>
          <div className="space-y-4">
            {(order.order_items || []).map((item: any) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0">
                {item.product_image && <img src={item.product_image} alt={item.product_name} className="w-16 h-20 object-cover rounded shrink-0"/>}
                <div className="flex-1">
                  <p className="font-playfair font-bold">{item.product_name}</p>
                  {item.selected_colour && <p className="text-sm text-gray-500">Colour: {item.selected_colour}</p>}
                  {item.selected_size && <p className="text-sm text-gray-500">Size: {item.selected_size}</p>}
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-crimson">£{(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">£{item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>£{order.subtotal.toFixed(2)}</span></div>
            {order.discount_amount > 0 && <div className="flex justify-between text-sm text-seagreen"><span>Discount</span><span>-£{order.discount_amount.toFixed(2)}</span></div>}
            <div className="flex justify-between text-sm text-gray-500"><span>Shipping</span><span>Free</span></div>
            <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2"><span>Total</span><span className="text-crimson">£{order.total.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded p-6 mb-6">
          <h2 className="font-playfair text-lg font-bold mb-2">Update Status</h2>
          <p className="text-sm text-gray-500 font-cormorant mb-4">Customer receives email when status changes</p>
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} statuses={statuses}/>
        </div>

        <div className="bg-white border border-gray-100 rounded p-6">
          <h2 className="font-playfair text-lg font-bold mb-2">Tracking Number</h2>
          {order.tracking_number && <p className="text-sm text-seagreen mb-3">Current: <strong>{order.tracking_number}</strong></p>}
          <div className="flex gap-3">
            <input id="tracking-input" defaultValue={order.tracking_number || ''} placeholder="Enter tracking number" className="input flex-1"/>
            <button className="btn-crimson" onClick={() => {}}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
