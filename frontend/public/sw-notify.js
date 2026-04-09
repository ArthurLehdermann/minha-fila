self.addEventListener('message', (event) => {
  if (event.data?.type !== 'ORDER_READY') return

  const { number, label, orderId } = event.data

  self.registration.showNotification('🔔 Senha chamada!', {
    body: label
      ? `Senha #${number} (${label}) foi chamada.`
      : `Senha #${number} foi chamada.`,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: `order-ready-${orderId}`,
    requireInteraction: true,
    renotify: true,
    vibrate: [300, 100, 300, 100, 300],
  })
})
