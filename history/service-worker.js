// 📦 設定快取名稱與需快取的檔案清單
const CACHE_NAME = "smart-sign-cache-v1";
const urlsToCache = [
  "/",             // 網站根目錄
  "/index.html",   // 主 HTML 頁面
  "/styles.css",   // CSS 樣式檔
  "/script.js"     // JavaScript 功能腳本
];

// 📥 安裝階段：開啟快取並儲存指定檔案
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 將檔案加入快取清單中
      return cache.addAll(urlsToCache);
    })
  );
});

// 🌐 擷取階段：攔截所有網路請求，先檢查快取是否有資源
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果快取中有資源就回傳，否則從網路抓取
      return response || fetch(event.request);
    })
  );
});
