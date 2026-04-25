'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Send } from 'lucide-react'

export default function EmailBlastForm({ memberCount }: { memberCount: number }) {
  const [form, setForm] = useState({ subject: '', body: '', includePromo: false, promoCode: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const send = async () => {
    if (!form.subject || !form.body) { toast.error('Subject and body required'); return }
    if (!confirm(`Send this email to all ${memberCount} members who opted in?`)) return
    setSending(true)
    const res = await fetch('/api/members/email-blast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) { setSent(true); toast.success(`Email sent to ${memberCount} members!`) }
    else toast.error('Failed to send')
    setSending(false)
  }

  if (sent) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="font-playfair text-2xl font-bold mb-2">Email Sent!</h2>
      <p className="text-gray-500">Your email was sent to {memberCount} members.</p>
      <button onClick={() => { setForm({ subject: '', body: '', includePromo: false, promoCode: '' }); setSent(false) }}
        className="btn-crimson mt-6">Send Another</button>
    </div>
  )

  return (
    <div className="max-w-2xl">
      <div className="bg-gold-pale border border-gold/30 rounded p-4 mb-6">
        <p className="font-cormorant text-base">📧 This will send to <strong>{memberCount}</strong> members who opted in to marketing emails.</p>
      </div>

      <div className="mb-4">
        <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Email Subject</label>
        <input className="input" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
          placeholder="e.g. ✨ New Eid Collection Just Arrived!"/>
      </div>

      <div className="mb-4">
        <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Email Body (HTML supported)</label>
        <textarea className="input min-h-[200px] resize-y font-mono text-sm" value={form.body}
          onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
          placeholder="<h2>Assalamu Alaikum!</h2><p>We have exciting new arrivals just in time for Eid...</p>"/>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer mb-3">
          <input type="checkbox" checked={form.includePromo} onChange={e => setForm(f => ({ ...f, includePromo: e.target.checked }))} className="w-4 h-4 accent-crimson"/>
          <span className="font-cormorant text-base">Include a promo code</span>
        </label>
        {form.includePromo && (
          <input className="input" value={form.promoCode} onChange={e => setForm(f => ({ ...f, promoCode: e.target.value.toUpperCase() }))}
            placeholder="e.g. EID20 (must already exist in Promotions)"/>
        )}
      </div>

      {/* Preview */}
      {(form.subject || form.body) && (
        <div className="bg-white border border-gray-200 rounded p-6 mb-6">
          <p className="font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-3">Preview</p>
          <p className="font-bold mb-2 text-crimson">{form.subject || '(no subject)'}</p>
          <div className="text-sm text-gray-600 border-t border-gray-100 pt-3" dangerouslySetInnerHTML={{ __html: form.body || '<em>No body yet</em>' }}/>
          {form.includePromo && form.promoCode && (
            <div className="mt-4 bg-crimson text-white text-center py-3 font-bold tracking-widest">{form.promoCode}</div>
          )}
        </div>
      )}

      <button onClick={send} disabled={sending} className="btn-crimson flex items-center gap-2 disabled:opacity-50">
        <Send size={14}/> {sending ? 'Sending...' : `Send to ${memberCount} Members`}
      </button>
    </div>
  )
}
