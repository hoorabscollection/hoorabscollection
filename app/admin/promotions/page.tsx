'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Trash2, Plus } from 'lucide-react'

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showing, setShowing] = useState(false)
  const [form, setForm] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_amount: '',
    max_uses: '',
    expires_at: '',
    is_active: true,
  })
  const supabase = createClient()

  const fetchPromotions = async () => {
    const { data } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false })
    setPromotions(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchPromotions() }, [])

  const createPromo = async () => {
    if (!form.code || !form.discount_value) {
      toast.error('Please fill in code and discount value')
      return
    }
    const { error } = await supabase.from('promotions').insert({
      code: form.code.toUpperCase().trim(),
      discount_type: form.discount_type,
      discount_value: +form.discount_value,
      min_order_amount: form.min_order_amount ? +form.min_order_amount : null,
      max_uses: form.max_uses ? +form.max_uses : null,
      expires_at: form.expires_at || null,
      is_active: true,
      times_used: 0,
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Promo code created! 🎉')
      setShowing(false)
      setForm({ code: '', discount_type: 'percentage', discount_value: '', min_order_amount: '', max_uses: '', expires_at: '', is_active: true })
      fetchPromotions()
    }
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('promotions').update({ is_active: !current }).eq('id', id)
    toast.success(current ? 'Promo deactivated' : 'Promo activated')
    fetchPromotions()
  }

  const deletePromo = async (id: string) => {
    if (!confirm('Delete this promo code?')) return
    await supabase.from('promotions').delete().eq('id', id)
    toast.success('Promo code deleted')
    fetchPromotions()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1A0A0A] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-playfair text-xl font-black text-crimson">← Dashboard</Link>
          <span className="font-cinzel text-xs tracking-widest text-gold uppercase">Promotions</span>
        </div>
        <button onClick={() => setShowing(true)}
          className="bg-crimson text-white font-cinzel text-xs tracking-widest px-4 py-2 uppercase hover:bg-red-800 transition-colors flex items-center gap-2">
          <Plus size={14}/> Create Promo Code
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="font-playfair text-3xl font-black mb-8">Promo Codes ({promotions.length})</h1>

        {/* Create form */}
        {showing && (
          <div className="bg-white border border-gray-100 rounded p-6 mb-8 shadow-sm">
            <h2 className="font-playfair text-xl font-bold mb-6">Create New Promo Code</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Promo Code *</label>
                <input className="input uppercase" value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. EID25 or SAVE10"/>
                <p className="text-xs text-gray-400 mt-1">Customers will type this at checkout</p>
              </div>
              <div>
                <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Discount Type *</label>
                <select className="input" value={form.discount_type}
                  onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))}>
                  <option value="percentage">Percentage (e.g. 10% off)</option>
                  <option value="fixed">Fixed Amount (e.g. £20 off)</option>
                </select>
              </div>
              <div>
                <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">
                  Discount Value * {form.discount_type === 'percentage' ? '(%)' : '(£)'}
                </label>
                <input className="input" type="number" step="0.01" value={form.discount_value}
                  onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))}
                  placeholder={form.discount_type === 'percentage' ? '10' : '20'}/>
              </div>
              <div>
                <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Minimum Order Amount (£)</label>
                <input className="input" type="number" step="0.01" value={form.min_order_amount}
                  onChange={e => setForm(f => ({ ...f, min_order_amount: e.target.value }))}
                  placeholder="e.g. 50 (leave blank for no minimum)"/>
              </div>
              <div>
                <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Max Uses (optional)</label>
                <input className="input" type="number" value={form.max_uses}
                  onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                  placeholder="e.g. 100 (leave blank for unlimited)"/>
              </div>
              <div>
                <label className="block font-cinzel text-xs tracking-widest text-gray-400 uppercase mb-2">Expiry Date (optional)</label>
                <input className="input" type="date" value={form.expires_at}
                  onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}/>
              </div>
            </div>

            {/* Preview */}
            {form.code && form.discount_value && (
              <div className="bg-crimson/5 border border-crimson/20 rounded p-4 mb-4">
                <p className="font-cinzel text-xs tracking-widest text-crimson uppercase mb-1">Preview</p>
                <p className="font-playfair text-lg font-bold">
                  Code: <span className="text-crimson">{form.code.toUpperCase()}</span>
                  {' '}— {form.discount_type === 'percentage' ? `${form.discount_value}% off` : `£${form.discount_value} off`}
                  {form.min_order_amount ? ` on orders over £${form.min_order_amount}` : ''}
                  {form.expires_at ? ` · expires ${new Date(form.expires_at).toLocaleDateString('en-GB')}` : ''}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={createPromo} className="btn-crimson">Create Promo Code</button>
              <button onClick={() => setShowing(false)} className="btn-outline">Cancel</button>
            </div>
          </div>
        )}

        {/* Promo list */}
        {loading ? (
          <p className="font-cormorant text-xl text-gray-400">Loading...</p>
        ) : promotions.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 rounded">
            <p className="font-cormorant text-2xl text-gray-400 mb-2">No promo codes yet</p>
            <p className="font-cormorant text-gray-400">Create your first promo code above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {promotions.map(promo => (
              <div key={promo.id} className={`bg-white border rounded p-5 flex items-center justify-between ${promo.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-playfair text-2xl font-black text-crimson tracking-wider">{promo.code}</span>
                      {promo.is_active ? (
                        <span className="bg-seagreen/10 text-seagreen font-cinzel text-[9px] tracking-widest px-2 py-1 rounded uppercase">Active</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-400 font-cinzel text-[9px] tracking-widest px-2 py-1 rounded uppercase">Inactive</span>
                      )}
                    </div>
                    <p className="font-cormorant text-base text-gray-600">
                      {promo.discount_type === 'percentage' ? `${promo.discount_value}% off` : `£${promo.discount_value} off`}
                      {promo.min_order_amount ? ` · min order £${promo.min_order_amount}` : ''}
                      {promo.expires_at ? ` · expires ${new Date(promo.expires_at).toLocaleDateString('en-GB')}` : ' · no expiry'}
                      {promo.max_uses ? ` · max ${promo.max_uses} uses` : ' · unlimited uses'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-playfair text-2xl font-black">{promo.times_used || 0}</p>
                    <p className="font-cinzel text-[9px] tracking-widest text-gray-400 uppercase">Times Used</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleActive(promo.id, promo.is_active)}
                    className={`font-cinzel text-xs tracking-widest px-3 py-2 uppercase border transition-colors ${promo.is_active ? 'border-gray-200 text-gray-500 hover:border-crimson hover:text-crimson' : 'border-seagreen text-seagreen hover:bg-seagreen hover:text-white'}`}>
                    {promo.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => deletePromo(promo.id)}
                    className="text-gray-300 hover:text-crimson transition-colors">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
