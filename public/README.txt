Call2Local larger PWA icons

Copy these PNG files into your project's public/ folder, replacing the old pwa-192x192.png and pwa-512x512.png.

- pwa-192x192.png and pwa-512x512.png: mark fills more of the square, reducing oversized white margins.
- pwa-maskable-192x192.png and pwa-maskable-512x512.png: mark is kept within the safe area for launchers that crop icons.
- call2local-symbol.png: symbol-only header logo.

Recommended manifest icons:
{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
{ src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
{ src: '/pwa-maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
{ src: '/pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }

After replacing files, rebuild and redeploy. Installed apps may need to be removed and installed again to refresh their icon.
