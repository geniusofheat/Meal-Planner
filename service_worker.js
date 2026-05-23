// ============================================================
// SERVICE WORKER — Meal Planner PWA
// Auto-updating: always fetches fresh files, cache is backup only
// ============================================================

const CACHE_NAME = 'Meal-Planner';

const FILES_TO_CACHE = [
  '/Meal-Planner/index.html',
  '/Meal-Planner/index.js',
  '/Meal-Planner/index.css',
  '/Meal-Planner/login.html',
  '/Meal-Planner/login.css',
  '/Meal-Planner/meal_planner.html',
  '/Meal-Planner/recipe_builder.html',
  '/Meal-Planner/cookbook_menu.html',
  '/Meal-Planner/favorites_list.html',
  '/Meal-Planner/grocery_list.html',
  '/Meal-Planner/firebase_config.js',
  '/Meal-Planner/firebase_login_auth.js',
  '/Meal-Planner/login_data.js',
  '/Meal-Planner/meal_planner.js',
  '/Meal-Planner/recipe_builder.js',
  '/Meal-Planner/cookbook_menu_data.js',
  '/Meal-Planner/meats_data.js',
  '/Meal-Planner/dips_and_sauces_data.js',
  '/Meal-Planner/desserts_data.js',
  '/Meal-Planner/pastas_data.js',
  '/Meal-Planner/beans_and_legumes_data.js',
  '/Meal-Planner/beverages_data.js',
  '/Meal-Planner/breads_and_grains_data.js',
  '/Meal-Planner/candy_data.js',
  '/Meal-Planner/salads_data.js',
  '/Meal-Planner/seafood_data.js',
  '/Meal-Planner/vegetables_data.js',
  '/Meal-Planner/meal_planner_icon_192.png',
  '/Meal-Planner/meal_planner_icon_512.png'
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
