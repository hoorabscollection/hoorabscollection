import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || 'info@hoorabscollection.com'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hoorabscollection.com'

export async function POST(req: NextRequest) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { members, subject, heading, message, promoCode, promoDiscount } = await req.json()

  if (!members?.length) {
    return NextResponse.json({ error: 'No members' }, { status: 400 })
  }

  try {
    for (let i = 0; i < members.length; i += 50) {
      const batch = members.slice(i, i + 50)
      await Promise.all(batch.map((m: any) =>
        resend.emails.send({
          from: `Hoorab's Collection <${FROM}>`,
          to: m.email,
          subject,
          html: `
            <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#FAF7F0;padding:40px">
              <h1 style="color:#C41E3A;font-size:28px;margin-bottom:4px">Hoorab's Collection</h1>
              <p style="color:#C9A84C;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:0">LONDON, UK</p>
              <hr style="border:1px solid #C9A84C;opacity:0.3;margin:24px 0"/>
              
              ${m.full_name ? `<p style="color:#555;font-size:14px">Dear ${m.full_name},</p>` : ''}
              ${heading ? `<h2 style="color:#1A0A0A;font-size:22px">${heading}</h2>` : ''}
              
              <p style="color:#555;font-size:16px;line-height:1.7;white-space:pre-wrap">${message}</p>

              ${promoCode ? `
                <div style="background:#FFF0F0;border:1px solid #C41E3A;border-radius:4px;padding:16px;margin:24px 0">
                  <p style="color:#C41E3A;font-weight:bold;font-size:18px;margin:0">Use code: ${promoCode}</p>
                  ${promoDiscount ? `<p style="color:#555;margin:4px 0 0">${promoDiscount}</p>` : ''}
                </div>
              ` : ''}

              <a href="${SITE_URL}/shop" 
                style="display:inline-block;background:#C41E3A;color:#fff;padding:14px 28px;text-decoration:none;font-family:Arial;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:16px 0">
                Shop Now →
              </a>

              <hr style="border:1px solid #C9A84C;opacity:0.3;margin:24px 0"/>
              <p style="color:#aaa;font-size:11px;text-align:center">
                You're receiving this because you opted in as a member of Hoorab's Collection, London.<br/>
                <a href="${SITE_URL}" style="color:#C9A84C">hoorabscollection.com</a>
                &nbsp;·&nbsp;
                <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(m.email)}" style="color:#aaa">Unsubscribe</a>
              </p>
            </div>
          `
        })
      ))
    }

    return NextResponse.json({ success: true, sent: members.length })
  } catch (err: any) {
    console.error('Email blast error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
