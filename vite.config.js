import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      includeAssets: [
        '/icons/icon-180.png',
        '/icons/icon-192.png',
        '/icons/icon-512.png',
        '/icons/bicycleshed-icon-n',
        '/icons/bicycleshed-icon-y',
        '/icons/elevator-icon-n',
        '/icons/elevator-icon-y',
        '/icons/expansion-icon',
        '/icons/nursingroom-icon-n',
        '/icons/nursingroom-icon-y',
        '/icons/parking-icon-n',
        '/icons/parking-icon-y',
        '/icons/wheelchairlift-icon-n',
        '/icons/wheelchairlift-icon-y',
        '/btn/back-btn',
        '/btn/dropbox-btn',
        '/btn/reverse-btn',
        '/btn/search-btn',
        '/btn/refresh-btn',
        '/base/header.svg',
        '/base/main-header.svg',
        '/base/main-train-icon.svg',
      ],
      manifest: {
        name: 'Metro인서울',
        short_name: 'Metro인서울',
        description: '서울 지하철의 호선 별 노선도와 역 별 상세정보 및 경로 탐색, 비상 시 대피도 이미지를 제공하는 서비스입니다.',
        theme_color: '#F5F5F5',
        lang: 'ko',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
      }
    })
  ],
})
