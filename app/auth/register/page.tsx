'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '', marketing: true })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } }
    })
    if (error) {
      toast.error(error.message)
    } else {
      // Update marketing preference
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').update({ marketing_emails: form.marketing }).eq('id', user.id)
      }
      toast.success('Account created! Welcome to Hoorab\'s Collection 🌹')
      router.push('/account')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/">
            <h1 className="font-playfair text-4xl font-black text-crimson">Hoorab's Collection</h1>
            <p className="font-cinzel text-xs tracking-widest text-gold mt-1">LONDON · UK</p>
          </Link>
        </div>
        <div className="bg-white border border-gray-100 p-8 shadow-sm">
          <h2 className="font-playfair text-2xl font-bold mb-2">Create Account</h2>
          <p className="font-cormorant text-gray-500 mb-6">Join Hoorab's Collection for exclusive offers and order tracking</p>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Full Name</label>
              <input type="text" required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                className="input" placeholder="Your full name"/>
            </div>
            <div>
              <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input" placeholder="your@email.com"/>
            </div>
            <div>
              <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Password</label>
              <input type="password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input" placeholder="Min 6 characters"/>
            </div>
            <div>
              <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Confirm Password</label>
              <input type="password" required value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                className="input" placeholder="Repeat password"/>
            </div>
            <label className="flex items-start gap-3 cursor-pointer mt-2">
              <input type="checkbox" checked={form.marketing} onChange={e => setForm(f => ({ ...f, marketing: e.target.checked }))}
                className="mt-1 accent-crimson w-4 h-4"/>
              <span className="font-cormorant text-sm text-gray-600">
                I'd like to receive exclusive offers, new arrivals and promotions from Hoorab's Collection
              </span>
            </label>
            <button type="submit" disabled={loading}
              className="btn-crimson w-full text-center disabled:opacity-50 mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-crimson hover:underline">Sign in here</Link>
          </p>
        </div>
        <div className="text-center mt-6">
          <Link href="/" className="font-cinzel text-xs tracking-widest text-gray-400 hover:text-crimson uppercase">
            ← Back to Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
