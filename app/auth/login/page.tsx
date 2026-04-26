'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Welcome back!')
      await new Promise(resolve => setTimeout(resolve, 500))
      if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        window.location.href = '/admin'
      } else {
        window.location.href = '/account'
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/">
            <h1 className="font-playfair text-4xl font-black text-crimson">Hoorab's Collection</h1>
            <p className="font-cinzel text-xs tracking-widest text-gold mt-1">LONDON · UK</p>
          </Link>
        </div>
        <div className="bg-white border border-gray-100 p-8 shadow-sm">
          <h2 className="font-playfair text-2xl font-bold mb-6">Sign In</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="input" placeholder="your@email.com"/>
            </div>
            <div>
              <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="input" placeholder="••••••••"/>
            </div>
            <button type="submit" disabled={loading}
              className="btn-crimson w-full text-center disabled:opacity-50 mt-6">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-crimson hover:underline">Register here</Link>
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
