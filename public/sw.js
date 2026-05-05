/**
 * CashCast Service Worker for Push Notifications
 */

// Listen for push events
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('Push event but no data');
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    console.error('Failed to parse push data:', e);
    return;
  }

  const options = {
    body: data.body || '',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/badge-72.png',
    tag: data.tag || 'cashcast-notification',
    data: {
      url: data.actionUrl || '/dashboard',
    },
    // Vibration pattern: vibrate for 200ms, pause 100ms, vibrate 200ms
    vibrate: [200, 100, 200],
    // Keep the notification visible
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'CashCast', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there's already a CashCast tab open
      for (const client of windowClients) {
        if (client.url.includes('cashcast') && 'focus' in client) {
          client.focus();
          if ('navigate' in client) {
            client.navigate(url);
          }
          return;
        }
      }
      // Open a new tab if no existing one found
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  // Could track analytics here if needed
  console.log('Notification closed:', event.notification.tag);
});
