import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json()
  const supabase = createServerSupabase()

  const { data: promo } = await supabase.from('promotions')
    .select('*').eq('code', code.toUpperCase()).eq('is_active', true).single()

  if (!promo) return NextResponse.json({ valid: false, message: 'Invalid promo code' })

  const now = new Date()
  if (promo.valid_until && new Date(promo.valid_until) < now)
    return NextResponse.json({ valid: false, message: 'This promo code has expired' })
  if (promo.max_uses && promo.uses_count >= promo.max_uses)
    return NextResponse.json({ valid: false, message: 'This promo code has reached its limit' })
  if (subtotal < promo.min_order_amount)
    return NextResponse.json({ valid: false, message: `Minimum order £${promo.min_order_amount} required` })

  const discount = promo.type === 'percentage'
    ? (subtotal * promo.value / 100)
    : promo.value

  return NextResponse.json({ valid: true, discount: Math.min(discount, subtotal), type: promo.type, value: promo.value })
}
