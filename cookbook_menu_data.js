// ================================================================
//  § 1 — CATEGORY DATA MAP
// ================================================================
const cookbook_data = {
  beverages: typeof beverages_data !== 'undefined' ? beverages_data : null,
  beans_and_legumes: typeof beans_and_legumes_data !== 'undefined' ? beans_and_legumes_data : null,
  breads_and_grains: typeof breads_and_grains_data !== 'undefined' ? breads_and_grains_data : null,
  candy: typeof candy_data !== 'undefined' ? candy_data : null,
  desserts: typeof desserts_data !== 'undefined' ? desserts_data : null,
  dips_sauces_and_gravies: typeof dips_sauces_and_gravies_data !== 'undefined' ? dips_sauces_and_gravies_data : null,
  side_dishes: typeof side_dishes_data !== 'undefined' ? side_dishes_data : null,
  meats: typeof meats_data !== 'undefined' ? meats_data : null,
  pastas: typeof pastas_data !== 'undefined' ? pastas_data : null,
  rice: typeof rice_data !== 'undefined' ? rice_data : null,
  salads: typeof salads_data !== 'undefined' ? salads_data : null,
  soups_and_stews: typeof soups_and_stews_data !== 'undefined' ? soups_and_stews_data : null,
  vegetables: typeof vegetables_data !== 'undefined' ? vegetables_data : null,
};

let active_category = null;
let current_recipe = null;
let current_cat_name = null;
// END § 1


// ================================================================
//  § 2 — TOGGLE CATEGORY
// ================================================================
function toggleCategory(cat_id) {
  const list_el = document.getElementById(cat_id);
  const header_el = document.getElementById(cat_id + '_header');
  if (!list_el) return;

  if (active_category && active_category !== cat_id) {
    const active_el = document.getElementById(active_category);
    const active_head_el = document.getElementById(active_category + '_header');
    if (active_el) { active_el.innerHTML = ''; active_el.style.display = 'none'; }
    if (active_head_el) active_head_el.innerHTML = '';
  }

  if (list_el.style.display === 'block') {
    list_el.innerHTML = '';
    list_el.style.display = 'none';
    if (header_el) header_el.innerHTML = '';
    active_category = null;
    return;
  }

  const cat_data = cookbook_data[cat_id];
  list_el.innerHTML = '';

  if (!cat_data || cat_data.length === 0) {
    const li = document.createElement('li');
    li.className = 'nested-li';
    li.textContent = 'Coming soon.';
    li.style.opacity = '0.5';
    list_el.appendChild(li);
  } else {
    cat_data.forEach(function (subcat, sub_idx) {
      const li = document.createElement('li');
      li.className = 'nested-li';
      li.innerHTML = '<span class="recipe-label">' + subcat.icon + ' ' + subcat.name + '</span><span class="recipe-arrow">›</span>';
      li.style.cursor = 'pointer';
      li.addEventListener('click', function () { show_recipes(cat_id, sub_idx); });
      list_el.appendChild(li);
    });
  }

  const header_text = cat_id.replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  if (header_el) header_el.innerHTML = '<span>' + header_text + '</span>';

  list_el.style.display = 'block';
  const card_el = list_el.closest('.card');
  if (card_el) card_el.scrollIntoView({ behavior: 'smooth', block: 'start' });

  active_category = cat_id;
}
// END § 2


function show_recipes(cat_id, sub_idx) {
  const list_el  = document.getElementById(cat_id);
  const cat_data = cookbook_data[cat_id];

  if (!list_el || !cat_data) return;

  const subcat = cat_data[sub_idx];

  if (!subcat || !Array.isArray(subcat.recipes)) return;

  list_el.innerHTML = '';

  const existing_sub_header = document.getElementById(cat_id + '_sub_header');
  if (existing_sub_header) existing_sub_header.remove();

  const sub_header = document.createElement('div');
  sub_header.id = cat_id + '_sub_header';
  sub_header.className = 'menu-header';
  sub_header.style.marginLeft = '20px';
  sub_header.innerHTML = subcat.icon + ' ' + subcat.name;

  list_el.parentNode.insertBefore(sub_header, list_el);

  const back_li = document.createElement('li');
  back_li.className = 'menu-back-btn';
  back_li.innerHTML = '← Back';
  back_li.style.cursor = 'pointer';

  back_li.onclick = function () {
    const sub_head = document.getElementById(cat_id + '_sub_header');
    if (sub_head) sub_head.remove();
    toggleCategory(cat_id);
  };

  list_el.appendChild(back_li);

// ── Build recipe list ──
subcat.recipes.forEach(function (recipe, index) {
  const li = document.createElement('li');
  li.className = 'menu-item';
  li.innerHTML = recipe.name;
  li.style.cursor = 'pointer';

  li.addEventListener('click', function () {
    console.log("RECIPE CLICKED:", recipe);

    open_recipe_modal(recipe, subcat.icon, subcat.name);
  });

  li.dataset.catId = cat_id;
  li.dataset.subIdx = String(sub_idx);
  li.dataset.recipeIndex = String(index);

  list_el.appendChild(li);
});
}


// ================================================================
//  § 4 — OPEN RECIPE MODAL
// ================================================================
function open_recipe_modal(recipe, icon, cat_name) {
  current_recipe = recipe;
  current_cat_name = cat_name;

  const title = document.getElementById('recipe_modal_title');
  const body = document.getElementById('recipe_modal_body');
  const modal = document.getElementById('recipe_modal');

  if (!title || !body || !modal) return;

  title.textContent = icon + ' ' + recipe.name;

  let html = '';
  html += '<p>' + recipe.servings + '</p>';
  html += '<p>Ingredients</p><ul>';

  recipe.ingredients.forEach(function (ing) {
    html += '<li>' + ing + '</li>';
  });

  html += '</ul>';
  html += '<p>Preparation</p>';
  html += '<p>' + recipe.prep + '</p>';

  html += '<button onclick="save_to_favorites()">Save</button>';
  html += '<button onclick="open_plan_popup()">Plan</button>';

  body.innerHTML = html;
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}
// END § 4

// ================================================================
//  § 4b — PLAN RECIPE (save to localStorage + return to planner)
// ================================================================
function open_plan_popup() {
  if (!current_recipe) return;

  localStorage.setItem('mealplanner_pending_recipe', JSON.stringify({
    name:        current_recipe.name,
    ingredients: current_recipe.ingredients,
    steps:       current_recipe.prep
  }));

  window.location.href = 'meal_planner.html';
}
// END § 4b


// ================================================================
//  § 5 — CLOSE RECIPE MODAL
// ================================================================
function close_recipe_modal() {
  document.getElementById('recipe_modal').style.display = 'none';
  document.body.style.overflow = '';
}
// END § 5


// ================================================================
//  § 6 — SAVE TO FAVORITES
// ================================================================
function save_to_favorites() {
  if (!current_recipe) return;

  let favs = JSON.parse(localStorage.getItem('mealplanner_favorites') || '[]');
  const exists = favs.find(f => f.name === current_recipe.name);

  if (!exists) {
    favs.push({
      name: current_recipe.name,
      catName: current_cat_name,
      ingredients: current_recipe.ingredients,
      prep: current_recipe.prep
    });

    localStorage.setItem('mealplanner_favorites', JSON.stringify(favs));
  }
}
// END § 6


// ================================================================
//  § 7 — PLAN POPUP
// ================================================================
const PLAN_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const PLAN_DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

let plan_year = new Date().getFullYear();
let plan_month = new Date().getMonth();
let plan_highlighted_dow = null;
let plan_selected_day = null;
let plan_selected_dow = null;

// (unchanged section 7 logic retained)
// ================================================================


// ================================================================
//  § 8 — INIT
// ================================================================
document.addEventListener('DOMContentLoaded', function () {
  ['beverages','beans_and_legumes','breads_and_grains','desserts','side_dishes','meats','pastas','salads','soups_and_stews','candy','rice','dips_sauces_and_gravies','vegetables']
    .forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

  const modal = document.getElementById('recipe_modal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === this) close_recipe_modal();
    });
  }
});
// END § 8


// ================================================================
//  § 9 — SEARCH
// ================================================================
function search_cookbook() {
  const input = document.getElementById('search_input');
  const q = input ? input.value.trim().toLowerCase() : '';
  if (q.length < 2) return;

  let found = null;

  Object.keys(cookbook_data).some(function (cat_id) {
    const cat = cookbook_data[cat_id];
    if (!cat) return false;

    return cat.some(function (subcat, sub_idx) {
      return subcat.recipes.some(function (recipe) {
        if (recipe.name.toLowerCase().includes(q)) {
          found = { cat_id, sub_idx };
          return true;
        }
        return false;
      });
    });
  });

  if (found) {
    toggleCategory(found.cat_id);
    show_recipes(found.cat_id, found.sub_idx);
  }
}
// END § 9