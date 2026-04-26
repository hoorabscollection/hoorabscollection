'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { Trash2, Plus, X } from 'lucide-react'

const COLOURS = ['Crimson Red', 'Sea Green', 'Sea Blue', 'Gold', 'Black', 'White', 'Navy', 'Pink', 'Purple', 'Maroon', 'Teal', 'Ivory']
const SIZES   = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Custom']

export default function ProductForm({ product, categories }: { product?: any; categories: any[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    compare_price: product?.compare_price || '',
    category_id: product?.category_id || '',
    stock_quantity: product?.stock_quantity || 0,
    is_featured: product?.is_featured || false,
    is_active: product?.is_active ?? true,
    images: product?.images || [],
    colours: product?.colours || [],
    sizes: product?.sizes || [],
    tags: product?.tags || [],
    size_prices: product?.size_prices || {},
  })

  const setField = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    const path = `products/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('product-images').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(path)
      setField('images', [...form.images, data.publicUrl])
      toast.success('Image uploaded!')
    } else {
      toast.error('Image upload failed')
    }
    setImageUploading(false)
  }

  const toggleArr = (key: string, val: string) => {
    const arr = form[key as keyof typeof form] as string[]
    setField(key, arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
  }

  const save = async () => {
    if (!form.name || !form.price || !form.category_id) {
      toast.error('Please fill in name, price and category'); return
    }
    setSaving(true)
    const payload = { ...form, slug: form.slug || autoSlug(form.name), price: +form.price, compare_price: form.compare_price ? +form.compare_price : null }

    const { error } = product?.id
      ? await supabase.from('products').update(payload).eq('id', product.id)
      : await supabase.from('products').insert(payload)

    if (error) { toast.error(error.message) }
    else {
      toast.success(product?.id ? 'Product updated!' : 'Product created!')
      router.push('/admin/products')
    }
    setSaving(false)
  }

  const deleteProduct = async () => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    await supabase.from('products').update({ is_active: false }).eq('id', product.id)
    toast.success('Product deactivated')
    router.push('/admin/products')
  }

  return (
    <div className="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-cinzel text-xs tracking-widest text-gray-500 uppercase mb-2">Product Name *</label>
          <input className="input" value={form.name} onChange={e => { setField('name', e.target.value); setField('slug', autoSlug(e.target.value)) }} placeholder="e.g. Crimson Bridal Lehenga"/>
        </div>
        <div>
          <label className="block font-cinzel text-xs tracking-widest text-gray-500 uppercase mb-2">Category *</label>
          <select className="input" value={form.category_id} onChange={e => setField('category_id', e.target.value)}>
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-cinzel text-xs tracking-widest text-gray-500 uppercase mb-2">Price (£) *</label>
          <input className="input" type="number" step="0.01" value={form.price} onChange={e => setField('price', e.target.value)} placeholder="0.00"/>
        </div>
        <div>
          <label className="block font-cinzel text-xs tracking-widest text-gray-500 uppercase mb-2">Compare Price (£)</label>
          <input className="input" type="number" step="0.01" value={form.compare_price} onChange={e => setField('compare_price', e.target.value)} placeholder="Original price for sale badge"/>
        </div>
        <div>
          <label className="block font-cinzel text-xs tracking-widest text-gray-500 uppercase mb-2">Stock Quantity</label>
          <input className="input" type="number" value={form.stock_quantity} onChange={e => setField('stock_quantity', +e.target.value)}/>
        </div>
        <div>
          <label className="block font-cinzel text-xs tracking-widest text-gray-500 uppercase mb-2">URL Slug</label>
          <input className="input" value={form.slug} onChange={e => setField('slug', e.target.value)} placeholder="auto-generated"/>
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-cinzel text-xs tracking-widest text-gray-500 uppercase mb-2">Description</label>
        <textarea className="input min-h-[100px] resize-y" value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Describe the product — fabric, embroidery, occasion..."/>
      </div>

      {/* Images */}
      <div className="mb-6">
        <label className="block font-cinzel text-xs tracking-widest text-gray-500 uppercase mb-2">Product Images</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {form.images.map((img: string, i: number) => (
            <div key={i} className="relative w-20 h-24 bg-gray-100">
              <img src={img} alt="" className="w-full h-full object-cover"/>
              <button onClick={() => setField('images', form.images.filter((_: any, j: number) => j !== i))}
                className="absolute top-0 right-0 bg-crimson text-white w-5 h-5 flex items-center justify-center">
                <X size={10}/>
              </button>
            </div>
          ))}
          <label className="w-20 h-24 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-crimson transition-colors">
            {imageUploading ? <span className="text-xs text-gray-400">...</span> : <><Plus size={16} className="text-gray-400"/><span className="text-xs text-gray-400 mt-1">Upload</span></>}
            <input type="file" accept="image/*" className="hidden" onChange={uploadImage}/>
          </label>
        </div>
      </div>

      {/* Colours */}
      <div className="mb-6">
        <label className="block font-cinzel text-xs tracking-widest text-gray-500 uppercase mb-2">Available Colours</label>
        <div className="flex flex-wrap gap-2">
          {COLOURS.map(c => (
            <button key={c} onClick={() => toggleArr('colours', c)}
              className={`font-cinzel text-xs px-3 py-1.5 border transition-all ${form.colours.includes(c) ? 'bg-crimson text-white border-crimson' : 'border-gray-300 text-gray-600 hover:border-crimson'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-6">
        <label className="block font-cinzel text-xs tracking-widest text-gray-500 uppercase mb-2">Available Sizes</label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(s => (
            <button key={s} onClick={() => toggleArr('sizes', s)}
              className={`font-cinzel text-xs px-3 py-1.5 border transition-all ${form.sizes.includes(s) ? 'bg-crimson text-white border-crimson' : 'border-gray-300 text-gray-600 hover:border-crimson'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Size Prices */}
      {form.sizes.length > 0 && (
        <div className="mb-6">
          <label className="block font-cinzel text-xs tracking-widest text-gray-500 uppercase mb-2">
            Size-Based Pricing (optional — leave blank to use default price)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {form.sizes.map((size: string) => (
              <div key={size}>
                <label className="block font-cinzel text-[10px] tracking-widest text-gray-400 uppercase mb-1">{size} — £</label>
                <input
                  type="number"
                  step="0.01"
                  className="input text-sm"
                  value={form.size_prices[size] || ''}
                  placeholder={form.price || '0.00'}
                  onChange={e => setField('size_prices', { ...form.size_prices, [size]: e.target.value ? +e.target.value : undefined })}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 font-cormorant mt-2">If a size has no price set, the default price above will be used</p>
        </div>
      )}

      {/* Toggles */}
      <div className="flex gap-8 mb-8">
        {[['is_featured', 'Featured product'], ['is_active', 'Active (visible on site)']].map(([k, l]) => (
          <label key={k} className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setField(k, !form[k as keyof typeof form])}
              className={`w-11 h-6 rounded-full relative transition-colors ${form[k as keyof typeof form] ? 'bg-crimson' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form[k as keyof typeof form] ? 'translate-x-5' : 'translate-x-0.5'}`}/>
            </div>
            <span className="font-cormorant text-base">{l}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-4">
        <button onClick={save} disabled={saving} className="btn-crimson disabled:opacity-50">
          {saving ? 'Saving...' : product?.id ? 'Save Changes' : 'Create Product'}
        </button>
        <button onClick={() => router.push('/admin/products')} className="btn-outline">Cancel</button>
        {product?.id && (
          <button onClick={deleteProduct} className="ml-auto flex items-center gap-2 text-crimson hover:text-crimson-deep font-cinzel text-xs tracking-widest">
            <Trash2 size={14}/> Deactivate
          </button>
        )}
      </div>
    </div>
  )
}
