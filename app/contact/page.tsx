'use client'
import { useState } from 'react'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('enquiries').insert(form)
    if (error) {
      toast.error('Failed to send. Please try WhatsApp instead.')
    } else {
      setSent(true)
      toast.success('Message sent! We\'ll be in touch soon 🌹')
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <div className="section-eyebrow justify-center mb-3">
            <span className="w-10 h-px bg-gold opacity-50"/>Get in Touch<span className="w-10 h-px bg-gold opacity-50"/>
          </div>
          <h1 className="section-title mb-4">Contact <em className="text-crimson italic">Us</em></h1>
          <p className="font-cormorant text-xl text-gray-500">We'd love to hear from you. Send us a message or WhatsApp us directly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="font-playfair font-bold text-lg mb-2">WhatsApp (Fastest)</h3>
                <a href="https://wa.me/447876621936" target="_blank"
                  className="flex items-center gap-3 text-seagreen hover:underline font-cormorant text-lg">
                  💬 +44 787 662 1936
                </a>
                <p className="text-sm text-gray-400 mt-1">Usually replies within a few hours</p>
              </div>
              <div>
                <h3 className="font-playfair font-bold text-lg mb-2">Email</h3>
                <a href="mailto:info@hoorabscollection.com" className="text-crimson hover:underline font-cormorant text-lg">
                  info@hoorabscollection.com
                </a>
              </div>
              <div>
                <h3 className="font-playfair font-bold text-lg mb-2">Location</h3>
                <p className="font-cormorant text-lg text-gray-600">London, United Kingdom 🇬🇧</p>
                <p className="text-sm text-gray-400 mt-1">Delivering across the UK</p>
              </div>
            </div>

            <div className="bg-crimson/5 border border-crimson/10 rounded p-5">
              <h3 className="font-playfair font-bold mb-2">Opening Hours</h3>
              <div className="space-y-1 font-cormorant text-base text-gray-600">
                <p>Monday — Friday: 10am — 6pm</p>
                <p>Saturday: 10am — 4pm</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🌹</div>
                <h2 className="font-playfair text-2xl font-bold mb-3">Message Received!</h2>
                <p className="font-cormorant text-lg text-gray-500">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
                <a href="https://wa.me/447876621936" target="_blank"
                  className="inline-flex items-center gap-2 mt-6 bg-[#25D366] text-white font-cinzel text-xs tracking-widest px-6 py-3 uppercase hover:bg-green-600 transition-colors">
                  💬 Also WhatsApp Us
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Full Name *</label>
                  <input required className="input" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"/>
                </div>
                <div>
                  <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Email *</label>
                  <input required type="email" className="input" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"/>
                </div>
                <div>
                  <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Phone / WhatsApp</label>
                  <input className="input" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+44 7XX XXX XXXX"/>
                </div>
                <div>
                  <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Subject</label>
                  <select className="input" value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                    <option value="">Select a subject</option>
                    <option value="Product Enquiry">Product Enquiry</option>
                    <option value="Order Query">Order Query</option>
                    <option value="Custom Order">Custom Order</option>
                    <option value="Returns">Returns</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Message *</label>
                  <textarea required rows={5} className="input resize-none" value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="How can we help you?"/>
                </div>
                <button type="submit" disabled={loading} className="btn-crimson w-full text-center disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
