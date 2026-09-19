const FROM = 'cooltanwee@gmail.com'

const COPY = {
  Pending: 'We have your order and will confirm it shortly.',
  Confirmed: 'Your order is confirmed and is being packed with care.',
  Shipped: 'Your order is on its way. Please keep cash ready for delivery.',
  Delivered: 'Your order has been marked delivered. We hope you love it.',
  Cancelled: 'Your order has been cancelled. Write to us if this looks wrong.',
}

export function statusEmailText(order, status) {
  const name = order.customer?.name || 'there'
  const note = COPY[status] || `Your order status is now ${status}.`
  const items = (order.items || []).map((i) => `- ${i.name} ×${i.qty}`).join('\n')
  return [
    `Hi ${name},`,
    '',
    `Your Tanvi Loops order ${order.id} is now: ${status}.`,
    note,
    '',
    items ? `Items:\n${items}` : '',
    `Amount to pay on delivery: ₹${Number(order.total || 0).toFixed(0)}`,
    '',
    'With love,',
    'Tanvi Loops',
    FROM,
  ].filter(Boolean).join('\n')
}

export function customerEmail(order) {
  return String(order.email || order.customer?.email || '').trim()
}

export function openStatusEmail(order, status) {
  const to = customerEmail(order)
  if (!to || !to.includes('@')) return { ok: false, error: 'No customer email on this order' }
  const subject = `Tanvi Loops order ${order.id} is ${status}`
  const body = statusEmailText(order, status)
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.open(gmail, '_blank', 'noopener,noreferrer')
  return { ok: true, to }
}

export async function emailOrderStatus(order, status) {
  return openStatusEmail(order, status)
}
