'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'

export default function PromotionsManager({ promotions: initial }: { promotions: any[] }) {
  const [promos, setPromos] = useState(initial)
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', min_order_amount: '', max_uses: '', valid_until: '' })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const create = async () => {
    if (!form.code || !form.value) { toast.error('Code and value required'); return }
    setSaving(true)
    const { data, error } = await supabase.from('promotions').insert({
      code: form.code.toUpperCase(),
      type: form.type,
      value: +form.value,
      min_order_amount: form.min_order_amount ? +form.min_order_amount : 0,
      max_uses: form.max_uses ? +form.max_uses : null,
      valid_until: form.valid_until || null,
    }).select().single()
    if (!error) { setPromos(p => [data, ...p]); setForm({ code: '', type: 'percentage', value: '', min_order_amount: '', max_uses: '', valid_until: '' }); toast.success('Promo created!') }
    else toast.error(error.message)
    setSaving(false)
  }

  const toggle = async (id: string, active: boolean) => {
    await supabase.from('promotions').update({ is_active: !active }).eq('id', id)
    setPromos(p => p.map(x => x.id === id ? { ...x, is_active: !active } : x))
    toast.success(active ? 'Promo deactivated' : 'Promo activated')
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this promo?')) return
    await supabase.from('promotions').delete().eq('id', id)
    setPromos(p => p.filter(x => x.id !== id))
    toast.success('Deleted')
  }

  return (
    <div>
      {/* Create form */}
      <div className="bg-white border border-gray-100 rounded p-6 mb-8">
        <h2 className="font-playfair text-xl font-bold mb-6">Create Promotion</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Promo Code</label>
            <input className="input uppercase" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. EID20"/>
          </div>
          <div>
            <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Type</label>
            <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (£)</option>
            </select>
          </div>
          <div>
            <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Value {form.type === 'percentage' ? '(%)' : '(£)'}</label>
            <input className="input" type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder={form.type === 'percentage' ? '20' : '10'}/>
          </div>
          <div>
            <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Min Order (£)</label>
            <input className="input" type="number" value={form.min_order_amount} onChange={e => setForm(f => ({ ...f, min_order_amount: e.target.value }))} placeholder="0 = no minimum"/>
          </div>
          <div>
            <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Max Uses</label>
            <input className="input" type="number" value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))} placeholder="Leave blank = unlimited"/>
          </div>
          <div>
            <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Valid Until</label>
            <input className="input" type="date" value={form.valid_until} onChange={e => setForm(f => ({ ...f, valid_until: e.target.value }))}/>
          </div>
        </div>
        <button onClick={create} disabled={saving} className="btn-crimson disabled:opacity-50">
          {saving ? 'Creating...' : '+ Create Promo'}
        </button>
      </div>

      {/* Promos table */}
      <div className="bg-white border border-gray-100 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Code', 'Type', 'Value', 'Min Order', 'Uses', 'Expires', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-cinzel text-[10px] tracking-widest text-gray-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {promos.map(p => (
              <tr key={p.id} className="border-t border-gray-50">
                <td className="px-4 py-3 font-mono font-bold text-crimson">{p.code}</td>
                <td className="px-4 py-3 text-gray-500 capitalize">{p.type}</td>
                <td className="px-4 py-3 font-bold">{p.type === 'percentage' ? `${p.value}%` : `£${p.value}`}</td>
                <td className="px-4 py-3 text-gray-500">£{p.min_order_amount}</td>
                <td className="px-4 py-3 text-gray-500">{p.uses_count}{p.max_uses ? `/${p.max_uses}` : ' / ∞'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{p.valid_until ? new Date(p.valid_until).toLocaleDateString('en-GB') : 'No expiry'}</td>
                <td className="px-4 py-3">
                  <span className={`font-cinzel text-[9px] tracking-widest px-2 py-1 rounded uppercase ${p.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <button onClick={() => toggle(p.id, p.is_active)} className="font-cinzel text-xs text-seablue hover:underline">
                    {p.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => remove(p.id)} className="text-crimson hover:text-crimson-deep"><Trash2 size={13}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!promos.length && <div className="text-center py-12 text-gray-400 font-cormorant text-xl">No promotions yet</div>}
      </div>
    </div>
  )
}
