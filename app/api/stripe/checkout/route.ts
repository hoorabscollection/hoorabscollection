import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabase } from '@/lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

export async function POST(req: NextRequest) {
  try {
    const { items, customer, promoCode, discount } = await req.json()

    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    // Build line items for Stripe
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

    // Add discount as a negative line item if applicable
    if (discount > 0) {
      lineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: { name: `Promo Code: ${promoCode}` },
          unit_amount: -Math.round(discount * 100),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer?.email,
      shipping_address_collection: { allowed_countries: ['GB'] },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      metadata: {
        user_id: user?.id || '',
        promo_code: promoCode || '',
        items: JSON.stringify(items.map((i: any) => ({
          product_id: i.product_id, name: i.name, price: i.price,
          quantity: i.quantity, colour: i.selected_colour, size: i.selected_size, image: i.image
        })))
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
