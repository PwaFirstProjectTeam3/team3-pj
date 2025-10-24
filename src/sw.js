import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', (e) => {
  console.log(`[서비스 워커] 설치 완료`, e);
});

self.addEventListener('activate', (e) => {
  console.log(`[서비스 워커] 활성화 중`, e);
});

self.addEventListener('fetch', (e) => {
  console.log(`[서비스 워커] 리소스 패치`, e);
});