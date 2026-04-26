// ============================================================
// SERVICE WORKER — Meal Planner PWA
// Auto-updating: always fetches fresh files, cache is backup only
// ============================================================

const CACHE_NAME = 'meal-planner';

const FILES_TO_CACHE = [
  '/meal-planner-app/index.html',
  '/meal-planner-app/index.js',
  '/meal-planner-app/index.css',
  '/meal-planner-app/login.html',
  '/meal-planner-app/login.css',
  '/meal-planner-app/meal_planner.html',
  '/meal-planner-app/recipe_builder.html',
  '/meal-planner-app/cookbook_menu.html',
  '/meal-planner-app/favorites_list.html',
  '/meal-planner-app/grocery_list.html',
  '/meal-planner-app/firebase_config.js',
  '/meal-planner-app/firebase_login_auth.js',
  '/meal-planner-app/login_data.js',
  '/meal-planner-app/meal_planner.js',
  '/meal-planner-app/recipe_builder.js',
  '/meal-planner-app/cookbook_menu_data.js',
  '/meal-planner-app/meats_data.js',
  '/meal-planner-app/dips_and_sauces_data.js',
  '/meal-planner-app/desserts_data.js',
  '/meal-planner-app/pastas_data.js',
  '/meal-planner-app/beans_and_legumes_data.js',
  '/meal-planner-app/beverages_data.js',
  '/meal-planner-app/breads_and_grains_data.js',
  '/meal-planner-app/candy_data.js',
  '/meal-planner-app/salads_data.js',
  '/meal-planner-app/seafood_data.js',
  '/meal-planner-app/vegetables_data.js',
  '/meal-planner-app/icon_192.png',
  '/meal-planner-app/icon_512.png'
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
