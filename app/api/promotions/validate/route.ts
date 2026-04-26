import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const supabase = createServerSupabase()
  const { code, order_total, user_id } = await req.json()

  if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 })

  const { data: promo, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('is_active', true)
    .single()

  if (error || !promo) {
    return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 })
  }

  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return NextResponse.json({ error: 'This promo code has expired' }, { status: 400 })
  }

  if (promo.max_uses && promo.times_used >= promo.max_uses) {
    return NextResponse.json({ error: 'This promo code has reached its maximum uses' }, { status: 400 })
  }

  if (promo.min_order_amount && order_total < promo.min_order_amount) {
    return NextResponse.json({
      error: `Minimum order of £${promo.min_order_amount} required for this code`
    }, { status: 400 })
  }

  if (user_id) {
    const { data: existingUse } = await supabase
      .from('promo_usage')
      .select('id')
      .eq('promo_id', promo.id)
      .eq('user_id', user_id)
      .single()

    if (existingUse) {
      return NextResponse.json({ error: 'You have already used this promo code' }, { status: 400 })
    }
  }

  let discount = 0
  if (promo.discount_type === 'percentage') {
    discount = (order_total * promo.discount_value) / 100
  } else {
    discount = Math.min(promo.discount_value, order_total)
  }
  discount = Math.round(discount * 100) / 100

  return NextResponse.json({
    success: true,
    promo_id: promo.id,
    code: promo.code,
    discount_type: promo.discount_type,
    discount_value: promo.discount_value,
    discount_amount: discount,
    message: promo.discount_type === 'percentage'
      ? `${promo.discount_value}% discount applied — saving £${discount.toFixed(2)}`
      : `£${promo.discount_value} discount applied`,
  })
}
