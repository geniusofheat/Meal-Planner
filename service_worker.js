// ============================================================
// SERVICE WORKER — Meal Planner PWA
// Auto-updating: always fetches fresh files, cache is backup only
// ============================================================

const CACHE_NAME = 'Meal-Planner';
const FILES_TO_CACHE = [
  './index.css',	
  './index.html',
  './index_data.js',
  './login.css',  
  './login.html',
  './login_data.js',
  './free_version_index.html',
  './full_version_index.html',  
  './meal_planner_icon_192.png',
  './meal_planner_icon_512.png',
  './meal_planner.html',
  './meal_planner_data.js',  
  './cookbook_menu.html',
  './cookbook_menu_data.js',  
  './favorites_list.html',
  './grocery_list.html',
  './firebase_config.js',
  './firebase_login_auth.js',
  './dips_and_sauces_and_gravies_data.js',
  './desserts_data.js',
  './pastas_data.js',
  './beans_and_legumes_data.js',
  './beverages_data.js',
  './breads_and_grains_data.js',
  './candy_data.js',
  './meats_data.js',
  './salads_data.js',
  './seafood_data.js',
  './vegetables_data.js',
];


// Install — cache all files
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// Activate — take control immediately
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Fetch — network first, fall back to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
