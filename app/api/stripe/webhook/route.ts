import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminSupabase } from '@/lib/supabase-server'
import { sendOrderConfirmationToCustomer, sendNewOrderAlertToAdmin } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const supabase = createAdminSupabase()

    const shipping = session.shipping_details || (session as any).collected_information?.shipping_details
    const items = JSON.parse(session.metadata?.items || '[]')

    // Generate order number
    const { data: orderNumData } = await supabase.rpc('generate_order_number') as any
    const orderNumber = orderNumData || `HC-${Date.now()}`

    const subtotal = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0)
    const discount = session.metadata?.promo_code ? subtotal - (session.amount_total! / 100) : 0

    // Create order
    const { data: order, error } = await supabase.from('orders').insert({
      user_id: session.metadata?.user_id || null,
      order_number: orderNumber,
      status: 'confirmed',
      payment_status: 'paid',
      stripe_payment_intent_id: session.payment_intent as string,
      subtotal,
      discount_amount: Math.max(0, discount),
      total: session.amount_total! / 100,
      promo_code: session.metadata?.promo_code || null,
      customer_name: shipping?.name || session.customer_details?.name || '',
      customer_email: session.customer_email || session.customer_details?.email || '',
      customer_phone: session.customer_details?.phone || '',
      shipping_address_line1: shipping?.address?.line1 || '',
      shipping_address_line2: shipping?.address?.line2 || '',
      shipping_city: shipping?.address?.city || '',
      shipping_postcode: shipping?.address?.postal_code || '',
      shipping_country: 'United Kingdom',
    }).select().single()

    if (error) {
      console.error('Order creation error:', error)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Create order items
    await supabase.from('order_items').insert(
      items.map((i: any) => ({
        order_id: order.id,
        product_id: i.product_id,
        product_name: i.name,
        product_image: i.image,
        price: i.price,
        quantity: i.quantity,
        selected_colour: i.colour,
        selected_size: i.size,
      }))
    )

    // Update promo code usage
    if (session.metadata?.promo_code) {
      await supabase.from('promotions').rpc('increment', {
        x: 1, row_id: session.metadata.promo_code
      }).eq('code', session.metadata.promo_code)
    }

    // Send emails
    const fullOrder = { ...order, order_items: items.map((i: any) => ({
      product_name: i.name, price: i.price, quantity: i.quantity,
      selected_colour: i.colour, selected_size: i.size
    }))}

    await Promise.all([
      sendOrderConfirmationToCustomer(fullOrder),
      sendNewOrderAlertToAdmin(fullOrder),
    ])
  }

  return NextResponse.json({ received: true })
}
