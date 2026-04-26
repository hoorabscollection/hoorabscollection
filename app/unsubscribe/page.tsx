'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'
import Link from 'next/link'

export default function UnsubscribePage({
  searchParams
}: {
  searchParams: { email?: string }
}) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resubscribed'>('loading')
  const email = searchParams.email
  const supabase = createClient()

  useEffect(() => {
    if (!email) { setStatus('error'); return }

    // Unsubscribe the email
    supabase
      .from('profiles')
      .update({ marketing_emails: false })
      .eq('email', email)
      .then(({ error }) => {
        if (error) setStatus('error')
        else setStatus('success')
      })
  }, [email])

  const resubscribe = async () => {
    await supabase
      .from('profiles')
      .update({ marketing_emails: true })
      .eq('email', email)
    setStatus('resubscribed')
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {status === 'loading' && (
            <p className="font-cormorant text-2xl text-gray-400">Processing...</p>
          )}

          {status === 'success' && (
            <>
              <div className="text-5xl mb-6">✅</div>
              <h1 className="font-playfair text-3xl font-black mb-3">Unsubscribed</h1>
              <p className="font-cormorant text-lg text-gray-500 mb-6">
                <strong>{email}</strong> has been removed from our marketing emails.
                You'll still receive order confirmations and important updates.
              </p>
              <button onClick={resubscribe}
                className="font-cinzel text-xs tracking-widest text-crimson underline uppercase">
                Changed your mind? Re-subscribe
              </button>
              <div className="mt-8">
                <Link href="/shop" className="btn-crimson">Continue Shopping</Link>
              </div>
            </>
          )}

          {status === 'resubscribed' && (
            <>
              <div className="text-5xl mb-6">🌹</div>
              <h1 className="font-playfair text-3xl font-black mb-3">You're back!</h1>
              <p className="font-cormorant text-lg text-gray-500 mb-8">
                You've been re-subscribed to Hoorab's Collection marketing emails.
              </p>
              <Link href="/shop" className="btn-crimson">Continue Shopping</Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-5xl mb-6">❌</div>
              <h1 className="font-playfair text-3xl font-black mb-3">Something went wrong</h1>
              <p className="font-cormorant text-lg text-gray-500 mb-8">
                Please contact us at info@hoorabscollection.com to unsubscribe.
              </p>
              <Link href="/" className="btn-crimson">Go Home</Link>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
