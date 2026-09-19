const FROM = 'cooltanwee@gmail.com'
const WEBHOOK = import.meta.env.VITE_ORDER_WEBHOOK_URL || ''

export function customerEmail(order) {
  return String(order.email || order.customer?.email || '').trim()
}

export function orderMailPayload(order, status, event = 'status') {
  return {
    event,
    to: customerEmail(order),
    status,
    orderId: order.id,
    name: order.customer?.name || '',
    total: Number(order.total || 0).toFixed(0),
    items: (order.items || []).map((i) => `${i.name} x${i.qty}`).join(', '),
  }
}

export async function emailOrderStatus(order, status, event = 'status') {
  const payload = orderMailPayload(order, status, event)
  if (!payload.to || !payload.to.includes('@')) {
    return { ok: false, error: 'No customer email on this order' }
  }
  if (!WEBHOOK) {
    return { ok: false, error: 'Order email bot webhook is not connected yet' }
  }
  const res = await fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return { ok: false, error: text || 'Bot did not accept the webhook' }
  }
  return { ok: true, to: payload.to }
}

export function openStatusEmail() {
  return { ok: false, error: 'Use the connected mailer bot instead' }
}
