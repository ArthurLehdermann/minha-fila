self.addEventListener('message', (event) => {
  if (event.data?.type !== 'ORDER_READY') return

  const { number, label, orderId } = event.data

  self.registration.showNotification('🔔 Pedido pronto!', {
    body: label
      ? `Pedido #${number} (${label}) está pronto para retirada.`
      : `Pedido #${number} está pronto para retirada.`,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: `order-ready-${orderId}`,
    requireInteraction: true,
    renotify: true,
    vibrate: [300, 100, 300, 100, 300],
  })
})
