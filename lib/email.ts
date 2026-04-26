import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || 'orders@hoorabscollection.com'

export async function sendOrderConfirmationToCustomer(order: any) {
  const items = order.order_items?.map((i: any) =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${i.product_name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${i.selected_colour || '—'} / ${i.selected_size || '—'}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">x${i.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">£${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`
  ).join('')

  await resend.emails.send({
    from: `Hoorab's Collection <${FROM}>`,
    to: order.customer_email,
    subject: `Order Confirmed — ${order.order_number} 🎉`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#FAF7F0;padding:40px">
        <h1 style="color:#C41E3A;font-size:28px;margin-bottom:4px">Hoorab's Collection</h1>
        <p style="color:#C9A84C;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-top:0">LONDON, UK</p>
        <hr style="border:1px solid #C9A84C;opacity:0.3;margin:24px 0"/>
        <h2 style="color:#1A0A0A">Thank you, ${order.customer_name}! 🌹</h2>
        <p style="color:#555">Your order <strong>${order.order_number}</strong> has been confirmed. We'll process it shortly and keep you updated.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">
          <thead><tr style="background:#C41E3A;color:#fff">
            <th style="padding:10px;text-align:left">Item</th>
            <th style="padding:10px;text-align:left">Options</th>
            <th style="padding:10px">Qty</th>
            <th style="padding:10px">Price</th>
          </tr></thead>
          <tbody>${items}</tbody>
        </table>
        <p style="text-align:right;font-size:18px;color:#1A0A0A"><strong>Total: £${order.total.toFixed(2)}</strong></p>
        <hr style="border:1px solid #C9A84C;opacity:0.3;margin:24px 0"/>
        <p style="color:#555">Questions? WhatsApp us at <strong>+44 787 662 1936</strong></p>
        <p style="color:#C9A84C;font-size:11px;text-align:center;margin-top:30px">© Hoorab's Collection · London, UK</p>
      </div>
    `
  })
}

export async function sendNewOrderAlertToAdmin(order: any) {
  await resend.emails.send({
    from: `Hoorab's System <${FROM}>`,
    to: process.env.ADMIN_EMAIL!,
    subject: `🛍️ New Order ${order.order_number} — £${order.total.toFixed(2)}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:30px">
        <h2 style="color:#C41E3A">New Order Received!</h2>
        <p><strong>Order:</strong> ${order.order_number}</p>
        <p><strong>Customer:</strong> ${order.customer_name} (${order.customer_email})</p>
        <p><strong>Phone:</strong> ${order.customer_phone || 'Not provided'}</p>
        <p><strong>Total:</strong> £${order.total.toFixed(2)}</p>
        <p><strong>Address:</strong> ${order.shipping_address_line1}, ${order.shipping_city}, ${order.shipping_postcode}</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders/${order.id}"
           style="display:inline-block;background:#C41E3A;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;margin-top:16px">
          View Order in Admin →
        </a>
      </div>
    `
  })
}

export async function sendOrderStatusUpdate(order: any) {
  const statusMessages: Record<string, string> = {
    confirmed:  'Your order has been confirmed and is being prepared.',
    processing: 'Your order is being packed and prepared for dispatch.',
    shipped:    `Your order is on its way! Tracking: ${order.tracking_number || 'Will be updated soon'}`,
    delivered:  'Your order has been delivered. We hope you love it! 🌹',
    cancelled:  'Your order has been cancelled. Please contact us if you have questions.',
  }
  const msg = statusMessages[order.status]
  if (!msg) return

  await resend.emails.send({
    from: `Hoorab's Collection <${FROM}>`,
    to: order.customer_email,
    subject: `Order Update — ${order.order_number}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#FAF7F0;padding:40px">
        <h1 style="color:#C41E3A">Hoorab's Collection</h1>
        <h2>Order Update 📦</h2>
        <p>Hi ${order.customer_name},</p>
        <p style="font-size:18px;color:#1A0A0A">${msg}</p>
        <p><strong>Order:</strong> ${order.order_number}</p>
        <p style="color:#555">Questions? WhatsApp us at <strong>+44 787 662 1936</strong></p>
      </div>
    `
  })
}

export async function sendPromoEmail(members: any[], promo: { subject: string; body: string }) {
  // Send in batches of 50
  for (let i = 0; i < members.length; i += 50) {
    const batch = members.slice(i, i + 50)
    await Promise.all(batch.map((m: any) =>
      resend.emails.send({
        from: `Hoorab's Collection <${FROM}>`,
        to: m.email,
        subject: promo.subject,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#FAF7F0;padding:40px">
            <h1 style="color:#C41E3A">Hoorab's Collection</h1>
            ${promo.body}
            <hr style="border:1px solid #C9A84C;opacity:0.3;margin:24px 0"/>
            <p style="font-size:11px;color:#aaa">
              You're receiving this because you're a member of Hoorab's Collection.
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/unsubscribe?email=${m.email}">Unsubscribe</a>
            </p>
          </div>
        `
      })
    ))
  }
}
