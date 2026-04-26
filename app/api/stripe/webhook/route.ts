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
    try {
      const session = event.data.object as Stripe.Checkout.Session
      const supabase = createAdminSupabase()

      // Prevent duplicate orders
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('stripe_payment_intent_id', session.payment_intent as string)
        .single()

      if (existingOrder) {
        console.log('Order already exists, skipping duplicate')
        return NextResponse.json({ received: true })
      }

      const shipping = session.shipping_details || (session as any).collected_information?.shipping_details
      const items = JSON.parse(session.metadata?.items || '[]')
      const subtotal = items.reduce((s: number, i: any) => s + (i.price * i.quantity), 0)
      const discount = parseFloat(session.metadata?.discount_amount || '0') || 0
      const total = session.amount_total! / 100

      // Generate order number
      const timestamp = Date.now().toString().slice(-5)
      const orderNumber = `HC-${timestamp}`

      // Create order
      const { data: order, error } = await supabase.from('orders').insert({
        user_id: session.metadata?.user_id || null,
        order_number: orderNumber,
        status: 'confirmed',
        payment_status: 'paid',
        stripe_payment_intent_id: session.payment_intent as string,
        subtotal,
        discount_amount: discount,
        total,
        promo_code: session.metadata?.promo_code || null,
        customer_name: shipping?.name || session.customer_details?.name || '',
        customer_email: session.customer_details?.email || session.customer_email || '',
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
      if (items.length > 0) {
        await supabase.from('order_items').insert(
          items.map((i: any) => ({
            order_id: order.id,
            product_id: i.product_id,
            product_name: i.name,
            product_image: i.image,
            price: i.price,
            quantity: i.quantity,
            selected_colour: i.selected_colour || i.colour || '',
            selected_size: i.selected_size || i.size || '',
          }))
        )
      }

      // Update promo code times_used
      if (session.metadata?.promo_code) {
        await supabase
          .from('promotions')
          .update({ times_used: supabase.rpc('coalesce', {}) })
          .eq('code', session.metadata.promo_code)

        // Simpler approach - just increment
        const { data: promo } = await supabase
          .from('promotions')
          .select('times_used')
          .eq('code', session.metadata.promo_code)
          .single()

        if (promo) {
          await supabase
            .from('promotions')
            .update({ times_used: (promo.times_used || 0) + 1 })
            .eq('code', session.metadata.promo_code)
        }

        // Record promo usage per customer
        if (session.metadata?.user_id) {
          const { data: promoRecord } = await supabase
            .from('promotions')
            .select('id')
            .eq('code', session.metadata.promo_code)
            .single()

          if (promoRecord) {
            await supabase.from('promo_usage').insert({
              promo_id: promoRecord.id,
              user_id: session.metadata.user_id,
              order_id: order.id,
            })
          }
        }
      }

      // Send emails
      try {
        const fullOrder = {
          ...order,
          order_items: items.map((i: any) => ({
            product_name: i.name,
            price: i.price,
            quantity: i.quantity,
            selected_colour: i.selected_colour || i.colour || '',
            selected_size: i.selected_size || i.size || '',
          }))
        }
        await Promise.all([
          sendOrderConfirmationToCustomer(fullOrder),
          sendNewOrderAlertToAdmin(fullOrder),
        ])
      } catch (emailErr) {
        console.error('Email error:', emailErr)
        // Don't fail the webhook if email fails
      }

    } catch (err: any) {
      console.error('Webhook processing error:', err)
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
