// ================================================================
//  § 1 — CATEGORY DATA MAP
// ================================================================
const cookbook_data = {
  beverages: typeof beverages_data !== 'undefined' ? beverages_data : null,
  beans_and_legumes:     typeof beans_and_legumes_data     !== 'undefined' ? beans_and_legumes_data     : null,
  breads_and_grains:    typeof breads_and_grains_data    !== 'undefined' ? breads_and_grains_data    : null,
  candy:     typeof candy_data     !== 'undefined' ? candy_data     : null,
  desserts:  typeof desserts_data  !== 'undefined' ? desserts_data  : null,
  dips_sauces_and_gravies:      typeof dips_sauces_and_gravies_data      !== 
      'undefined' ? dips_sauces_and_gravies_data      : null,
  finger_foods:     typeof finger_foods_data     !== 'undefined' ? finger_foods_data     : null,
  meats:     typeof meats_data     !== 'undefined' ? meats_data     : null,
  pastas:    typeof pastas_data    !== 'undefined' ? pastas_data    : null,
  rice:      typeof rice_data      !== 'undefined' ? rice_data      : null,
  salads:    typeof salads_data    !== 'undefined' ? salads_data    : null,
  soups_and_stews:     typeof soups_and_stews_data     !== 'undefined' ? soups_and_stews_data     : null,
  vegetables:     typeof vegetables_data     !== 'undefined' ? vegetables_data     : null,
};

let active_category  = null;
let current_recipe   = null;
let current_cat_name = null;
// END § 1


// ================================================================
//  § 2 — TOGGLE CATEGORY
// ================================================================
function toggleCategory(cat_id) {
  const list_el = document.getElementById(cat_id);
  if (!list_el) return;

  // Collapse any previously active category
  if (active_category && active_category !== cat_id) {
    const active_el = document.getElementById(active_category);
    if (active_el) { active_el.innerHTML = ''; active_el.style.display = 'none'; }
  }

  // If clicking the same category, toggle it closed
  if (list_el.style.display === 'block') {
    list_el.innerHTML = ''; 
    list_el.style.display = 'none';
    active_category = null; 
    return;
  }

  // Get category data
  const cat_data = cookbook_data[cat_id];
  list_el.innerHTML = '';

  // Add placeholder if no data
  if (!cat_data || cat_data.length === 0) {
    const li = document.createElement('li');
    li.className = 'nested-li';
    li.textContent = 'Coming soon.';
    li.style.opacity = '0.5';
    list_el.appendChild(li);
  } else {
    cat_data.forEach(function(subcat, sub_idx) {
      const li = document.createElement('li');
      li.className = 'nested-li';
      li.innerHTML = '<span class="recipe-label">' + subcat.icon + ' ' + subcat.name + '</span><span class="recipe-arrow">›</span>';
      li.style.cursor = 'pointer';
      li.addEventListener('click', function() { show_recipes(cat_id, sub_idx); });
      list_el.appendChild(li);
    });
  }

  // Show the list and scroll the card into view
  list_el.style.display = 'block';
  const card_el = list_el.closest('.card');
  if (card_el) card_el.scrollIntoView({ behavior: 'smooth', block: 'start' });

  active_category = cat_id;
}
// END § 2

// ================================================================
//  § 3 — SHOW RECIPE TITLES
// ================================================================
function show_recipes(cat_id, sub_idx) {
  const list_el  = document.getElementById(cat_id);
  const cat_data = cookbook_data[cat_id];
  const subcat   = cat_data[sub_idx];
  list_el.innerHTML = '';

  // ── Back button ──
  const back_li = document.createElement('li');
  back_li.className = 'nested-li';
  back_li.innerHTML = '<span class="recipe-label" style="opacity:0.6;">← Back</span>';
  back_li.style.cursor = 'pointer';
  back_li.addEventListener('click', function() {
    list_el.innerHTML = '';
    cat_data.forEach(function(subcat, idx) {
      const li = document.createElement('li');
      li.className = 'nested-li';
      li.innerHTML = '<span class="recipe-label">' + subcat.icon + ' ' + subcat.name + '</span><span class="recipe-arrow">›</span>';
      li.style.cursor = 'pointer';
      li.addEventListener('click', function() { show_recipes(cat_id, idx); });
      list_el.appendChild(li);
    });
  });
  list_el.appendChild(back_li);

  // ── Recipe items ──
  subcat.recipes.forEach(function(recipe) {
    const li = document.createElement('li');
    li.className = 'nested-li';
    li.innerHTML = '<span class="recipe-label">' + recipe.name + '</span><span class="recipe-arrow">›</span>';
    li.style.cursor = 'pointer';
    li.addEventListener('click', function() { open_recipe_modal(recipe, subcat.icon, subcat.name); });
    list_el.appendChild(li);
  });
}
// END § 3

// ================================================================
//  § 4 — OPEN RECIPE MODAL
// ================================================================
function open_recipe_modal(recipe, icon, cat_name) {
  current_recipe   = recipe;
  current_cat_name = cat_name;
  document.getElementById('recipe_modal_title').textContent = icon + ' ' + recipe.name;

  let html = '';
  html += '<p style="font-family:\'Space Mono\',monospace;font-size:11px;color:rgba(200,169,110,0.7);margin:0 0 16px 0;">' + recipe.servings + '</p>';
  html += '<p style="font-family:\'Playfair Display\',serif;font-size:15px;color:gold;margin:0 0 8px 0;">Ingredients</p>';
  html += '<ul style="margin:0 0 20px 0;padding-left:18px;">';
  recipe.ingredients.forEach(function(ing) {
    html += '<li style="font-family:\'Crimson Pro\',serif;color:#e8dcc8;font-size:15px;margin-bottom:5px;">' + ing + '</li>';
  });
  html += '</ul>';
  html += '<p style="font-family:\'Playfair Display\',serif;font-size:15px;color:gold;margin:0 0 8px 0;">Preparation</p>';
  html += '<p style="font-family:\'Crimson Pro\',serif;color:#e8dcc8;font-size:15px;line-height:1.7;margin:0 0 24px 0;">' + recipe.prep + '</p>';

  // ── Action buttons ──
  html += '<div style="display:flex;flex-direction:column;gap:10px;">';

  // Save to Favorites
  html += '<button onclick="save_to_favorites()" style="width:100%;padding:12px;background:transparent;border:1px solid rgba(200,169,110,0.5);color:gold;font-family:\'Space Mono\',monospace;font-size:12px;border-radius:8px;cursor:pointer;">♡ Save to Favorites</button>';

  // Plan This Meal
  html += '<button onclick="open_plan_popup()" style="width:100%;padding:12px;background:rgba(26,95,212,0.2);border:1px solid rgba(74,159,255,0.4);color:#a8c8ff;font-family:\'Space Mono\',monospace;font-size:12px;border-radius:8px;cursor:pointer;">📅 Plan This Meal</button>';

  html += '</div>';

  document.getElementById('recipe_modal_body').innerHTML = html;
  document.getElementById('recipe_modal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}
// END § 4


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
  try {
    let favs = JSON.parse(localStorage.getItem('mealplanner_favorites') || '[]');
    const exists = favs.find(function(f) { return f.name === current_recipe.name; });
    if (!exists) {
      favs.push({
        name:        current_recipe.name,
        catName:     current_cat_name,
        ingredients: current_recipe.ingredients,
        prep:        current_recipe.prep
      });
      localStorage.setItem('mealplanner_favorites', JSON.stringify(favs));
      alert('"' + current_recipe.name + '" saved to favorites!');
    } else {
      alert('"' + current_recipe.name + '" is already in your favorites.');
    }
  } catch(e) {}
}
// END § 6


// ================================================================
//  § 7 — PLAN POPUP
// ================================================================

// -- Plan popup state --
const PLAN_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const PLAN_DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
let plan_year  = new Date().getFullYear();
let plan_month = new Date().getMonth();
let plan_highlighted_dow = null;
let plan_selected_day    = null;
let plan_selected_dow    = null;

// -- BEGIN: open_plan_popup --
function open_plan_popup() {
  if (!current_recipe) return;
  plan_year            = new Date().getFullYear();
  plan_month           = new Date().getMonth();
  plan_highlighted_dow = null;
  plan_selected_day    = null;
  plan_selected_dow    = null;

  // Create overlay if it doesn't exist
  let overlay = document.getElementById('plan_popup_overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'plan_popup_overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(2,8,16,0.92);z-index:9999;overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;padding:20px;box-sizing:border-box;';
    document.body.appendChild(overlay);
  }

  render_plan_step_confirm(overlay);
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
// -- END: open_plan_popup --

// -- BEGIN: close_plan_popup --
function close_plan_popup() {
  const overlay = document.getElementById('plan_popup_overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}
// -- END: close_plan_popup --

// -- BEGIN: render_plan_step_confirm --
// Step 1 — confirm they want to add to meal planner
function render_plan_step_confirm(overlay) {
  overlay.innerHTML = plan_popup_shell(
    'Add to Meal Planner',
    '<p style="' + plan_body_style() + '">Would you like to add <strong style="color:#7ec8ff;">' + current_recipe.name + '</strong> to the meal planner?</p>' +
    '<div style="display:flex;gap:10px;margin-top:20px;">' +
      plan_btn('Yes', 'render_plan_step_pick_day(document.getElementById(\'plan_popup_overlay\'))', true) +
      plan_btn('No',  'close_plan_popup()', false) +
    '</div>'
  );
}
// -- END: render_plan_step_confirm --

// -- BEGIN: render_plan_step_pick_day --
// Step 2 — pick a day from the 7 day strip, then a date from the calendar
function render_plan_step_pick_day(overlay) {
  plan_highlighted_dow = null;
  plan_selected_day    = null;

  overlay.innerHTML = plan_popup_shell(
    'Step 1 — Pick a Day',
    '<p style="' + plan_body_style() + '">Pick a day of the week.</p>' +
    render_plan_strip() +
    '<div id="plan_cal_section" style="margin-top:14px;display:none;">' +
      '<p style="' + plan_body_style() + '" id="plan_cal_msg">Please pick a date from the calendar below.</p>' +
      render_plan_calendar() +
    '</div>' +
    '<div style="margin-top:16px;">' +
      plan_btn('Cancel', 'close_plan_popup()', false) +
    '</div>'
  );
  plan_draw_calendar();
}
// -- END: render_plan_step_pick_day --

// -- BEGIN: plan_tap_strip --
function plan_tap_strip(i, day_name) {
  plan_highlighted_dow = i;
  plan_selected_dow    = day_name;
  plan_selected_day    = null;
  // Highlight strip cell
  for (let j = 0; j < 7; j++) {
    const c = document.getElementById('plan_strip_cell_' + j);
    if (c) c.style.background = (j === i) ? 'rgba(26,95,212,0.3)' : 'transparent';
  }
  // Show calendar section
  const cal_section = document.getElementById('plan_cal_section');
  if (cal_section) cal_section.style.display = 'block';
  plan_draw_calendar();
  // Scroll to calendar
  const cal = document.getElementById('plan_calendar_grid');
  if (cal) cal.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
// -- END: plan_tap_strip --

// -- BEGIN: plan_tap_date --
function plan_tap_date(d) {
  if (plan_highlighted_dow === null) return;
  const dow = new Date(plan_year, plan_month, d).getDay();
  if (dow !== plan_highlighted_dow) return; // only highlighted column is tappable
  plan_selected_day = d;
  plan_highlighted_dow = null;
  plan_draw_calendar();
  // Show confirm step
  const overlay = document.getElementById('plan_popup_overlay');
  render_plan_step_confirm_date(overlay);
}
// -- END: plan_tap_date --

// -- BEGIN: render_plan_step_confirm_date --
// Step 3 — confirm chosen date
function render_plan_step_confirm_date(overlay) {
  const full_date = plan_selected_dow + ', ' + PLAN_MONTHS[plan_month] + ' ' + plan_selected_day;
  overlay.innerHTML = plan_popup_shell(
    'Step 3 — Confirm Date',
    '<p style="' + plan_body_style() + '">You chose:</p>' +
    '<p style="font-family:\'Cormorant Garamond\',serif;font-size:22px;font-weight:500;color:#7ec8ff;margin:8px 0 20px 0;">' + full_date + '</p>' +
    '<p style="' + plan_body_style() + '">Is this correct?</p>' +
    '<div style="display:flex;gap:10px;margin-top:16px;">' +
      plan_btn('Yes — Add to Planner', 'confirm_plan_and_navigate()', true) +
      plan_btn('No — Go Back', 'render_plan_step_pick_day(document.getElementById(\'plan_popup_overlay\'))', false) +
    '</div>'
  );
}
// -- END: render_plan_step_confirm_date --

// -- BEGIN: confirm_plan_and_navigate --
function confirm_plan_and_navigate() {
  if (!current_recipe || !plan_selected_day) return;
  const pending = {
    recipe_name:  current_recipe.name,
    ingredients:  current_recipe.ingredients,
    prep:         current_recipe.prep,
    year:         plan_year,
    month:        plan_month,
    day:          plan_selected_day,
    dow:          plan_selected_dow
  };
  localStorage.setItem('mealplanner_pending', JSON.stringify(pending));
  window.location.href = 'meal_planner.html';
}
// -- END: confirm_plan_and_navigate --


// ── Calendar helpers ─────────────────────────────────────────

// -- BEGIN: plan_prev_month --
function plan_prev_month() {
  if (plan_month === 0) { plan_month = 11; plan_year--; } else plan_month--;
  plan_draw_calendar();
}
// -- END: plan_prev_month --

// -- BEGIN: plan_next_month --
function plan_next_month() {
  if (plan_month === 11) { plan_month = 0; plan_year++; } else plan_month++;
  plan_draw_calendar();
}
// -- END: plan_next_month --

// -- BEGIN: plan_draw_calendar --
function plan_draw_calendar() {
  const grid = document.getElementById('plan_cal_grid');
  const mn   = document.getElementById('plan_month_name');
  const yr   = document.getElementById('plan_year_label');
  if (!grid || !mn || !yr) return;
  mn.textContent = PLAN_MONTHS[plan_month];
  yr.textContent = plan_year;
  grid.innerHTML = '';
  const today      = new Date();
  const first_dow  = new Date(plan_year, plan_month, 1).getDay();
  const days_total = new Date(plan_year, plan_month + 1, 0).getDate();
  for (let i = 0; i < first_dow; i++) {
    grid.appendChild(document.createElement('div'));
  }
  for (let d = 1; d <= days_total; d++) {
    const cell = document.createElement('div');
    const dow  = new Date(plan_year, plan_month, d).getDay();
    cell.style.cssText = 'aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:6px;font-family:\'Josefin Sans\',sans-serif;font-size:11px;cursor:pointer;color:rgba(200,220,255,0.55);transition:all 0.2s;';
    if (d === today.getDate() && plan_month === today.getMonth() && plan_year === today.getFullYear()) {
      cell.style.border = '1.5px solid rgba(100,200,255,0.6)';
      cell.style.color  = '#a8d8ff';
    }
    if (d === plan_selected_day) {
      cell.style.background = 'linear-gradient(135deg,#1a5fd4,#2b7fff)';
      cell.style.color      = '#fff';
      cell.style.fontWeight = '600';
    }
    if (plan_highlighted_dow !== null && dow === plan_highlighted_dow) {
      cell.style.background = 'rgba(26,95,212,0.15)';
      cell.style.outline    = '1px solid rgba(74,159,255,0.3)';
      cell.style.outlineOffset = '-1px';
      cell.style.cursor     = 'pointer';
    } else if (plan_highlighted_dow !== null) {
      cell.style.opacity  = '0.35';
      cell.style.cursor   = 'default';
    }
    cell.textContent = d;
    cell.onclick = (function(day) {
      return function() { plan_tap_date(day); };
    })(d);
    grid.appendChild(cell);
  }
}
// -- END: plan_draw_calendar --


// ── HTML builder helpers ──────────────────────────────────────

function plan_popup_shell(title, body_html) {
  return '<div style="background:rgba(4,10,30,0.97);border:1px solid rgba(74,159,255,0.2);border-radius:14px;padding:24px;width:100%;max-width:400px;box-sizing:border-box;margin:auto;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">' +
      '<span style="font-family:\'Josefin Sans\',sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(74,223,176,0.7);">' + title + '</span>' +
      '<button onclick="close_plan_popup()" style="background:transparent;border:none;color:rgba(150,190,255,0.5);font-size:18px;cursor:pointer;padding:0;">✕</button>' +
    '</div>' +
    body_html +
  '</div>';
}

function plan_body_style() {
  return 'font-family:\'Josefin Sans\',sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(150,200,255,0.7);line-height:1.8;margin:0;';
}

function plan_btn(label, onclick_str, primary) {
  const bg     = primary ? 'rgba(26,95,212,0.3)'   : 'transparent';
  const border = primary ? 'rgba(74,159,255,0.5)'  : 'rgba(74,159,255,0.2)';
  const color  = primary ? '#a8c8ff'                : 'rgba(150,190,255,0.5)';
  return '<button onclick="' + onclick_str + '" style="flex:1;padding:11px 10px;background:' + bg + ';border:1px solid ' + border + ';color:' + color + ';font-family:\'Josefin Sans\',sans-serif;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;border-radius:8px;cursor:pointer;">' + label + '</button>';
}

function render_plan_strip() {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let html = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:14px;">';
  days.forEach(function(d, i) {
    html += '<div id="plan_strip_cell_' + i + '" onclick="plan_tap_strip(' + i + ',\'' + PLAN_DAYS[i] + '\')" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 2px;border-radius:8px;cursor:pointer;border:1px solid transparent;transition:background 0.2s;">' +
      '<span style="font-family:\'Josefin Sans\',sans-serif;font-size:8px;letter-spacing:1px;color:rgba(150,190,255,0.45);text-transform:uppercase;">' + d + '</span>' +
      '<div style="width:8px;height:8px;border-radius:50%;background:rgba(74,159,255,0.15);border:1px solid rgba(74,159,255,0.2);"></div>' +
    '</div>';
  });
  html += '</div>';
  return html;
}

function render_plan_calendar() {
  return '<div id="plan_calendar_grid" style="background:rgba(10,20,60,0.5);border:1px solid rgba(74,159,255,0.18);border-radius:10px;padding:14px;margin-top:10px;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
      '<button onclick="plan_prev_month()" style="background:rgba(26,95,212,0.2);border:1px solid rgba(74,159,255,0.25);border-radius:6px;width:28px;height:28px;color:#a8c8ff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;">‹</button>' +
      '<div style="text-align:center;">' +
        '<div id="plan_month_name" style="font-family:\'Cormorant Garamond\',serif;font-size:18px;font-weight:500;color:#e8f0fe;"></div>' +
        '<div id="plan_year_label" style="font-family:\'Josefin Sans\',sans-serif;font-size:8px;letter-spacing:3px;color:rgba(150,190,255,0.4);text-transform:uppercase;margin-top:2px;"></div>' +
      '</div>' +
      '<button onclick="plan_next_month()" style="background:rgba(26,95,212,0.2);border:1px solid rgba(74,159,255,0.25);border-radius:6px;width:28px;height:28px;color:#a8c8ff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;">›</button>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:6px;">' +
      ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(function(d) {
        return '<div style="font-family:\'Josefin Sans\',sans-serif;font-size:8px;letter-spacing:1px;text-transform:uppercase;color:rgba(100,160,255,0.4);text-align:center;padding:4px 0;">' + d + '</div>';
      }).join('') +
    '</div>' +
    '<div id="plan_cal_grid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;"></div>' +
  '</div>';
}

// END § 7


// ================================================================
//  § 8 — INIT
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
  ['beverages','beans_and_legumes','breads_and_grains','desserts','finger_foods','meats','pastas','salads','soups_and_stews','sides','candy','rice','dips_sauces_and_gravies','vegetables'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const modal = document.getElementById('recipe_modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) close_recipe_modal();
    });
  }
});
// END § 8

// ================================================================
//  § 9 — SEARCH
// ================================================================

// -- BEGIN: search_cookbook --
function search_cookbook() {
  const input      = document.getElementById('search_input');
  const results_el = document.getElementById('search_results');
  const q          = input ? input.value.trim().toLowerCase() : '';

  if (results_el) { results_el.innerHTML = ''; results_el.style.display = 'none'; }
  if (q.length < 2) return;

  // ── Find first matching recipe ────────────────────────────
  let found = null;

  Object.keys(cookbook_data).some(function(cat_id) {
    const cat = cookbook_data[cat_id];
    if (!cat) return false;

    return cat.some(function(subcat, sub_idx) {
      return subcat.recipes.some(function(recipe) {
        const name_match = recipe.name.toLowerCase().includes(q);
        const ing_match  = recipe.ingredients && recipe.ingredients.some(function(ing) {
          return ing.toLowerCase().includes(q);
        });
        if (name_match || ing_match) {
          found = { recipe: recipe, subcat: subcat, cat_id: cat_id, sub_idx: sub_idx };
          return true;
        }
        return false;
      });
    });
  });

  // ── Not found ─────────────────────────────────────────────
  if (!found) {
    if (results_el) {
      results_el.innerHTML =
        '<div style="padding:12px 16px;font-family:\'Space Mono\',monospace;font-size:11px;color:rgba(200,169,110,0.6);">No recipe found. Would you like to submit an idea for a new recipe ?"' + input.value.trim() + '".</div>';
      results_el.style.display = 'block';
    }
    return;
  }

  // ── Open the correct category ─────────────────────────────
  if (active_category && active_category !== found.cat_id) {
    const prev_el = document.getElementById(active_category);
    if (prev_el) { prev_el.innerHTML = ''; prev_el.style.display = 'none'; }
    active_category = null;
  }

  if (active_category !== found.cat_id) {
    toggleCategory(found.cat_id);
  }

  // ── Drill into the correct subcategory ────────────────────
  show_recipes(found.cat_id, found.sub_idx);

  // ── Snap page to the category section ────────────────────
  setTimeout(function() {
    window.location.hash = found.cat_id;
  }, 150);

  // ── Highlight the matching recipe li ─────────────────────
  setTimeout(function() {
    const list_el = document.getElementById(found.cat_id);
    if (!list_el) return;

    const lis = list_el.querySelectorAll('li.nested-li');
    lis.forEach(function(li) {
      const label = li.querySelector('.recipe-label');
      if (label && label.textContent.trim().toLowerCase() === found.recipe.name.toLowerCase()) {
        li.style.border       = '4px solid #c8a96e';
        li.style.borderRadius = '8px';
        
      }
    });
  }, 200);
}
// -- END: search_cookbook --

// -- BEGIN: search_on_enter --
function search_on_enter(e) {
  if (e.key === 'Enter') search_cookbook();
}
// -- END: search_on_enter --

// END § 9
