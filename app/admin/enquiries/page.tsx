import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminEnquiriesPage() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login')

  const { data: enquiries, count } = await supabase
    .from('enquiries')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1A0A0A] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-playfair text-xl font-black text-crimson">← Dashboard</Link>
          <span className="font-cinzel text-xs tracking-widest text-gold uppercase">Enquiries</span>
        </div>
        <span className="font-cinzel text-xs tracking-widest text-gold/60">{count || 0} total enquiries</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="font-playfair text-3xl font-black mb-8">Enquiries ({count || 0})</h1>

        <div className="space-y-4">
          {(enquiries || []).map(enq => (
            <div key={enq.id} className="bg-white border border-gray-100 rounded p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-playfair font-bold text-lg">{enq.name}</p>
                  <div className="flex gap-4 mt-1">
                    <a href={`mailto:${enq.email}`} className="text-crimson text-sm hover:underline">{enq.email}</a>
                    {enq.phone && (
                      <a href={`https://wa.me/${enq.phone.replace(/\D/g, '')}`} target="_blank"
                        className="text-seagreen text-sm hover:underline">
                        💬 {enq.phone}
                      </a>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-cinzel tracking-widest">
                    {new Date(enq.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  {enq.subject && (
                    <span className="mt-1 inline-block bg-gold/10 text-gold font-cinzel text-[9px] tracking-widest px-2 py-1 rounded uppercase">
                      {enq.subject}
                    </span>
                  )}
                </div>
              </div>
              <p className="font-cormorant text-base text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                {enq.message}
              </p>
              <div className="flex gap-3 mt-4">
                <a href={`mailto:${enq.email}?subject=Re: Your enquiry to Hoorab's Collection`}
                  className="border border-gray-200 text-gray-600 font-cinzel text-xs tracking-widest px-4 py-2 uppercase hover:border-crimson hover:text-crimson transition-colors">
                  ✉ Reply by Email
                </a>
                {enq.phone && (
                  <a href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=Assalamu%20Alaikum%20${enq.name}!%20Thank%20you%20for%20your%20enquiry%20to%20Hoorab's%20Collection.`}
                    target="_blank"
                    className="bg-[#25D366] text-white font-cinzel text-xs tracking-widest px-4 py-2 uppercase hover:bg-green-600 transition-colors">
                    💬 Reply on WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))}

          {!enquiries?.length && (
            <div className="text-center py-20 bg-white border border-gray-100 rounded">
              <p className="font-cormorant text-2xl text-gray-400">No enquiries yet</p>
              <p className="font-cormorant text-gray-400 mt-2">Customer enquiries will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
