import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase, createServerSupabase } from '@/lib/supabase-server'
import { sendPromoEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { subject, body, includePromo, promoCode } = await req.json()
  const adminSupabase = createAdminSupabase()

  // Get all members who opted in
  const { data: profiles } = await adminSupabase
    .from('profiles')
    .select('id, full_name')
    .eq('marketing_emails', true)

  // Get their emails from auth.users
  const { data: users } = await adminSupabase.auth.admin.listUsers()
  const memberEmails = (users?.users || [])
    .filter(u => profiles?.some(p => p.id === u.id))
    .map(u => ({ email: u.email!, name: profiles?.find(p => p.id === u.id)?.full_name || u.email }))

  const fullBody = body + (includePromo && promoCode
    ? `<div style="text-align:center;margin:24px 0"><p style="font-size:14px;color:#555">Use code at checkout:</p><div style="background:#C41E3A;color:#fff;padding:16px 32px;font-size:24px;font-weight:bold;letter-spacing:4px;display:inline-block">${promoCode}</div></div>`
    : '')

  await sendPromoEmail(memberEmails, { subject, body: fullBody })
  return NextResponse.json({ sent: memberEmails.length })
}
