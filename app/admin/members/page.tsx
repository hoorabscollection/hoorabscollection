import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminMembersPage() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login')

  const { data: members, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1A0A0A] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-playfair text-xl font-black text-crimson">← Dashboard</Link>
          <span className="font-cinzel text-xs tracking-widest text-gold uppercase">Members</span>
        </div>
        <span className="font-cinzel text-xs tracking-widest text-gold/60">{count || 0} total members</span>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-playfair text-3xl font-black">Members ({count || 0})</h1>
        </div>

        <div className="bg-white border border-gray-100 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Email', 'Phone', 'City', 'Postcode', 'Marketing', 'Joined'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-cinzel text-[10px] tracking-widest text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(members || []).map(member => (
                <tr key={member.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{member.full_name || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${member.email}`} className="text-crimson hover:underline">
                      {member.email || '—'}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {member.phone ? (
                      <a href={`https://wa.me/${member.phone.replace(/\D/g, '')}`} target="_blank"
                        className="text-seagreen hover:underline">
                        {member.phone}
                      </a>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{member.city || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 uppercase">{member.postcode || '—'}</td>
                  <td className="px-4 py-3">
                    {member.marketing_emails ? (
                      <span className="bg-seagreen/10 text-seagreen font-cinzel text-[9px] tracking-widest px-2 py-1 rounded">YES</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-400 font-cinzel text-[9px] tracking-widest px-2 py-1 rounded">NO</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {member.created_at ? new Date(member.created_at).toLocaleDateString('en-GB') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!members?.length && (
            <div className="text-center py-16">
              <p className="font-cormorant text-2xl text-gray-400">No members yet</p>
              <p className="font-cormorant text-gray-400 mt-2">Members will appear here when customers register</p>
            </div>
          )}
        </div>

        {/* Marketing summary */}
        {members && members.length > 0 && (
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-100 rounded p-4">
              <p className="font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-1">Total Members</p>
              <p className="font-playfair text-3xl font-black text-crimson">{count || 0}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded p-4">
              <p className="font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-1">Marketing Opted In</p>
              <p className="font-playfair text-3xl font-black text-seagreen">
                {members.filter(m => m.marketing_emails).length}
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded p-4">
              <p className="font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-1">With Phone</p>
              <p className="font-playfair text-3xl font-black text-gold">
                {members.filter(m => m.phone).length}
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded p-4">
              <p className="font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-1">With Address</p>
              <p className="font-playfair text-3xl font-black">
                {members.filter(m => m.city).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
