'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('Invalid credentials')
    } else if (data.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      await supabase.auth.signOut()
      toast.error('Access denied — admin only')
    } else {
      toast.success('Welcome, Hoorab! 🌹')
      router.push('/admin')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#1A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-playfair text-3xl font-black text-crimson">Hoorab's Collection</h1>
          <p className="font-cinzel text-xs tracking-widest text-gold mt-2 uppercase">Admin Portal</p>
        </div>
        <div className="bg-[#2D1515] border border-gold/20 p-8">
          <h2 className="font-playfair text-xl font-bold text-white mb-6">Admin Sign In</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#1A0A0A] border border-gray-700 px-4 py-3 text-white text-sm outline-none focus:border-crimson transition-colors"
                placeholder="admin email"/>
            </div>
            <div>
              <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#1A0A0A] border border-gray-700 px-4 py-3 text-white text-sm outline-none focus:border-crimson transition-colors"
                placeholder="••••••••"/>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-crimson text-white font-cinzel text-xs tracking-widest py-4 uppercase hover:bg-crimson-deep transition-colors disabled:opacity-50 mt-4">
              {loading ? 'Signing in...' : 'Enter Admin Portal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
