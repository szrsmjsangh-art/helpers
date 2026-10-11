Call2Local public assets (symbol-only; no website name in the logo)

Copy every file in this folder into your Vite project's public/ folder.

Header:
  /call2local-symbol.png

PWA manifest:
  /pwa-192x192.png
  /pwa-512x512.png

Browser favicon:
  /favicon.ico
  Optional PNGs: favicon-16.png, favicon-32.png, favicon-48.png

Example VitePWA manifest:
manifest: {
  name: 'Call2Local - Local Services',
  short_name: 'Call2Local',
  description: 'Connect Locally. Easily.',
  theme_color: '#fffdf8',
  background_color: '#fffdf8',
  display: 'standalone',
  start_url: '/',
  icons: [
    { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' }
  ]
}
