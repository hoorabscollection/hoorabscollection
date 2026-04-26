'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function EmailBlastPage() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    subject: '',
    heading: '',
    message: '',
    promoCode: '',
    promoDiscount: '',
    sendTo: 'marketing', // 'all' or 'marketing'
  })
  const supabase = createClient()

  useEffect(() => {
    supabase.from('profiles')
      .select('id, full_name, email, marketing_emails')
      .then(({ data }) => {
        setMembers(data || [])
        setLoading(false)
      })
  }, [])

  const marketingMembers = members.filter(m => m.marketing_emails && m.email)
  const allMembers = members.filter(m => m.email)
  const targetMembers = form.sendTo === 'marketing' ? marketingMembers : allMembers

  const sendBlast = async () => {
    if (!form.subject || !form.message) {
      toast.error('Please fill in subject and message')
      return
    }
    if (targetMembers.length === 0) {
      toast.error('No members to send to')
      return
    }
    if (!confirm(`Send email to ${targetMembers.length} members?`)) return

    setSending(true)
    try {
      const res = await fetch('/api/members/email-blast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          members: targetMembers,
          subject: form.subject,
          heading: form.heading || form.subject,
          message: form.message,
          promoCode: form.promoCode,
          promoDiscount: form.promoDiscount,
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Email sent to ${targetMembers.length} members! 🎉`)
        setSent(true)
      } else {
        toast.error('Failed to send emails')
      }
    } catch (err) {
      toast.error('Error sending emails')
    }
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1A0A0A] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-playfair text-xl font-black text-crimson">← Dashboard</Link>
          <span className="font-cinzel text-xs tracking-widest text-gold uppercase">Email Members</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="font-playfair text-3xl font-black mb-2">Email Members</h1>
        <p className="font-cormorant text-gray-500 mb-8">
          Send a marketing email to your members
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded p-4 text-center">
            <p className="font-playfair text-3xl font-black text-crimson">{allMembers.length}</p>
            <p className="font-cinzel text-xs tracking-widest text-gray-400 uppercase mt-1">Total Members</p>
          </div>
          <div className="bg-white border border-gray-100 rounded p-4 text-center">
            <p className="font-playfair text-3xl font-black text-seagreen">{marketingMembers.length}</p>
            <p className="font-cinzel text-xs tracking-widest text-gray-400 uppercase mt-1">Opted In to Marketing</p>
          </div>
        </div>

        {sent ? (
          <div className="bg-white border border-gray-100 rounded p-12 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-playfair text-2xl font-bold mb-2">Emails Sent!</h2>
            <p className="font-cormorant text-lg text-gray-500 mb-6">
              Your email was sent to {targetMembers.length} members successfully.
            </p>
            <button onClick={() => { setSent(false); setForm({ subject: '', heading: '', message: '', promoCode: '', promoDiscount: '', sendTo: 'marketing' }) }}
              className="btn-crimson">
              Send Another Email
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded p-8">
            <div className="space-y-5">

              {/* Send to */}
              <div>
                <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Send To</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="marketing" checked={form.sendTo === 'marketing'}
                      onChange={e => setForm(f => ({ ...f, sendTo: e.target.value }))}
                      className="accent-crimson"/>
                    <span className="font-cormorant text-base">Marketing opt-ins only ({marketingMembers.length} members)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="all" checked={form.sendTo === 'all'}
                      onChange={e => setForm(f => ({ ...f, sendTo: e.target.value }))}
                      className="accent-crimson"/>
                    <span className="font-cormorant text-base">All members ({allMembers.length} members)</span>
                  </label>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Email Subject *</label>
                <input className="input" value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="e.g. Eid Collection Now Live! 🌙"/>
              </div>

              {/* Heading */}
              <div>
                <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Email Heading</label>
                <input className="input" value={form.heading}
                  onChange={e => setForm(f => ({ ...f, heading: e.target.value }))}
                  placeholder="e.g. Our Eid 2026 Collection Has Arrived"/>
              </div>

              {/* Message */}
              <div>
                <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Message *</label>
                <textarea rows={6} className="input resize-none" value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Write your message here... You can include details about new products, sales, or special offers."/>
              </div>

              {/* Promo code (optional) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Promo Code (optional)</label>
                  <input className="input uppercase" value={form.promoCode}
                    onChange={e => setForm(f => ({ ...f, promoCode: e.target.value.toUpperCase() }))}
                    placeholder="e.g. EID25"/>
                </div>
                <div>
                  <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Discount (optional)</label>
                  <input className="input" value={form.promoDiscount}
                    onChange={e => setForm(f => ({ ...f, promoDiscount: e.target.value }))}
                    placeholder="e.g. 25% off"/>
                </div>
              </div>

              {/* Preview */}
              {form.message && (
                <div className="border border-gray-100 rounded p-5 bg-gray-50">
                  <p className="font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-3">Email Preview</p>
                  <div className="bg-white p-5 rounded border border-gray-100">
                    <h2 style={{color:'#C41E3A', fontFamily:'Georgia', fontSize:'24px', marginBottom:'4px'}}>
                      Hoorab's Collection
                    </h2>
                    <p style={{color:'#C9A84C', fontSize:'11px', letterSpacing:'3px'}}>LONDON, UK</p>
                    <hr style={{borderColor:'#C9A84C', opacity:0.3, margin:'16px 0'}}/>
                    {form.heading && <h3 className="font-playfair text-xl font-bold mb-3">{form.heading}</h3>}
                    <p className="font-cormorant text-base text-gray-600 whitespace-pre-wrap">{form.message}</p>
                    {form.promoCode && (
                      <div className="mt-4 bg-crimson/5 border border-crimson/20 rounded p-3">
                        <p className="font-bold text-crimson">Use code: {form.promoCode}</p>
                        {form.promoDiscount && <p className="text-sm text-gray-600">{form.promoDiscount}</p>}
                      </div>
                    )}
                    <div className="mt-4">
                      <a href="https://hoorabscollection.com/shop" 
                        className="inline-block bg-crimson text-white font-cinzel text-xs tracking-widest px-6 py-3 uppercase">
                        Shop Now →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={sendBlast} disabled={sending || loading}
                className="btn-crimson w-full text-center disabled:opacity-50">
                {sending ? `Sending to ${targetMembers.length} members...` : `Send to ${targetMembers.length} Members`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
