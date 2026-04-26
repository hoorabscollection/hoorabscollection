import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabase } from '@/lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

export async function POST(req: NextRequest) {
  try {
    const { items, promoCode, discount } = await req.json()

    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: { colour: item.selected_colour || '', size: item.selected_size || '' }
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    // Create Stripe coupon for discount
    let discounts = []
    if (discount > 0 && promoCode) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(discount * 100),
        currency: 'gbp',
        name: `Promo: ${promoCode}`,
        max_redemptions: 1,
        duration: 'once',
      })
      discounts = [{ coupon: coupon.id }]
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      discounts: discounts.length > 0 ? discounts : undefined,
      shipping_address_collection: { allowed_countries: ['GB'] },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      metadata: {
        user_id: user?.id || '',
        promo_code: promoCode || '',
        discount_amount: discount ? discount.toString() : '0',
        items: JSON.stringify(items.map((i: any) => ({
          product_id: i.product_id, name: i.name, price: i.price,
          quantity: i.quantity, selected_colour: i.selected_colour, selected_size: i.selected_size, image: i.image
        })))
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Checkout error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
