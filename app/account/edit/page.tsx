'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AccountEditPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    marketing_emails: true,
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setForm({
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          address_line1: profile.address_line1 || '',
          address_line2: profile.address_line2 || '',
          city: profile.city || '',
          postcode: profile.postcode || '',
          country: profile.country || 'United Kingdom',
          marketing_emails: profile.marketing_emails ?? true,
        })
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update(form)
      .eq('id', user.id)

    if (error) {
      toast.error('Failed to save. Please try again.')
    } else {
      toast.success('Details saved! 🌹')
      router.push('/account')
    }
    setSaving(false)
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-cormorant text-2xl text-gray-400">Loading...</p>
      </div>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="mb-8">
          <div className="section-eyebrow mb-2">
            <span className="w-8 h-px bg-gold opacity-50"/>My Account
          </div>
          <h1 className="section-title">Edit My Details</h1>
        </div>

        <div className="bg-white border border-gray-100 rounded p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="md:col-span-2">
              <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Full Name</label>
              <input className="input" value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                placeholder="Your full name"/>
            </div>

            <div>
              <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Phone Number</label>
              <input className="input" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+44 7XX XXX XXXX"/>
            </div>

            <div>
              <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Country</label>
              <input className="input" value={form.country}
                onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                placeholder="United Kingdom"/>
            </div>

            <div className="md:col-span-2">
              <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Address Line 1</label>
              <input className="input" value={form.address_line1}
                onChange={e => setForm(f => ({ ...f, address_line1: e.target.value }))}
                placeholder="House number and street name"/>
            </div>

            <div className="md:col-span-2">
              <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Address Line 2 (Optional)</label>
              <input className="input" value={form.address_line2}
                onChange={e => setForm(f => ({ ...f, address_line2: e.target.value }))}
                placeholder="Apartment, flat, etc."/>
            </div>

            <div>
              <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">City</label>
              <input className="input" value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                placeholder="London"/>
            </div>

            <div>
              <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Postcode</label>
              <input className="input" value={form.postcode}
                onChange={e => setForm(f => ({ ...f, postcode: e.target.value }))}
                placeholder="SW1A 1AA"/>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.marketing_emails}
                  onChange={e => setForm(f => ({ ...f, marketing_emails: e.target.checked }))}
                  className="w-4 h-4 accent-crimson"/>
                <span className="font-cormorant text-base text-gray-600">
                  Receive exclusive offers and new arrivals from Hoorab's Collection
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button onClick={handleSave} disabled={saving}
              className="btn-crimson disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Details'}
            </button>
            <Link href="/account" className="btn-outline">Cancel</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
