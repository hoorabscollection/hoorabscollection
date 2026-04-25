'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function OrderStatusUpdater({ orderId, currentStatus, statuses }: { orderId: string; currentStatus: string; statuses: string[] }) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const update = async (newStatus: string) => {
    setSaving(true)
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    if (!error) {
      setStatus(newStatus)
      // Trigger email notification via API
      await fetch('/api/orders/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      })
      toast.success(`Order updated to ${newStatus}`)
    } else {
      toast.error('Update failed')
    }
    setSaving(false)
  }

  return (
    <select value={status} onChange={e => update(e.target.value)} disabled={saving}
      className="border border-gray-200 text-xs font-cinzel tracking-widest px-2 py-1.5 bg-white focus:border-crimson outline-none uppercase disabled:opacity-50 cursor-pointer">
      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  )
}
