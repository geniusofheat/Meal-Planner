/* ══════════════════════════════════════
   GROCERY DATA — categories → items
   ══════════════════════════════════════ */
const MENU = {

  
  "Meats": {
    "Chicken": ["Breasts","Thighs","Legs","Wings"],
    "Beef": ["Ground Beef","Chuck Steak","Sirloin Steak","Thin Cut","T-Bone","Ribeye Steak"],
    "Pork": ["Ham","Pork Chops","Sausage","Short Ribs","Baby Back Ribs","Spare Ribs"],
    "Turkey": ["Sliced","Whole"],
    "Seafood": ["Salmon","Shrimp","Tilapia","Tuna","Cod","Crawfish"]},
    
  "Vegetables": {
    "Lettuce":  ["1 Lb"],
    "Tomato": ["1 Lb"],
    "Cucumber":  ["1 Lb"],
    "Peas":  ["1 Lb"],
    "Carrots": ["1 Lb"],
    "Onions":  ["1 Lb"],
    "Mushrooms":  ["1 Lb"],
    "Cabbage":  ["1 Lb"],
    "Potatoes":  ["1 Lb"],
    "Broccoli":  ["1 Lb"],
    "Scallions":  ["1 Lb"],
    "Bell Peppers": ["1 Lb"],
    "Asparagus": ["1 Lb"],
    "Collard Greens":  ["1 Lb"],
    "Cauliflaur":  ["1 Lb"],
    "Brussell Sprouts":  ["1 Lb"],
    "Watermelon":  ["1 Lb"],
    "Cantelope":  ["1 Lb"]},
    
  "Beans": {
    "Red":  ["1 Lb"],
    "Kidney":  ["1 Lb"],
    "Limas": ["1 Lb"],
    "Blackeye Peas":  ["1 Lb"],
    "Green": ["1 Lb"],
    "Black":  ["1 Lb"],
    "Pinto":  ["1 Lb"]},
    
  "Fruits": {
    "Apples":  ["1 Lb"],
    "Oranges":  ["1 Lb"],
    "Bananas": ["1 Lb"],
    "Grapes":  ["1 Lb"],
    "Peaches": ["1 Lb"],
    "Cherries":  ["1 Lb"],
    "Strawberries":  ["1 Lb"],
    "Lemons":  ["1 Lb"],
    "Limes":  ["1 Lb"],
    "Watermelon":  ["1 Lb"],
    "Cantelope":  ["1 Lb"]},
    
  "Dairy Products": {
    "Milk": ["Whole Milk","Chocolate Milk","Buttermilk","Heavy Whipping Cream","Coffee Cream","Yogurt","Sour Cream"],
    "Butter": ["Salted","Unsalted"],
    "Cheese": ["American","Provolone","Mozzarella","Cheddar","Swiss","Cream Cheese"],
    "Eggs": ["Dozen","Half Dozen"]},
  
  "Breads": {
    "White": ["Loaf"],
    "Wheat":  ["Loaf"],
    "Buns": ["Hamburger","Hot Dog","Brioche","Hoagie"],
    "Rolls": ["Kings Hawaiian"],
    "Biscuits": ["Buttermilk"],
    "Muffins":  ["English","Bagels"]},
    
  "Dry Mixes": {
    "Sugar": ["1 Lb","5 Lb","10 Lb","Sourdough"],
    "Flour": ["2 Lb","5 Lb","10 Lb"],
    "Cake":  ["1 Lb"],
    "Pancake":  ["1 Lb"],
    "Baking Powder": ["8 oz"],
    "Baking Soda": ["12 oz"]},
  
  "Pasta & Noodles": {
    "Rice": ["1 Lb","2 Lb"],
    "Pasta": ["Penne","Roman Noodles","Spaghetti"]},
    
  "Sauces": {
    "Barbeque": ["Honey","Hot","Spicy"],
    "Ketchup": ["12 oz bottle"],
    "Mustard":  ["12 oz bottle"],
    "Mayonnaise": ["12 oz bottle"],
    "Cocktail": ["12 oz bottle"],
    "Soy": ["12 oz bottle"],
    "Oyster":  ["12 oz bottle"],
    "Hot":  ["12 oz bottle"],
    "Worchestershire":  ["12 oz bottle"]},
  
  "Beverages": {
    "Fruit Juice": ["Apple","Orange","Cranberry","Peach","Grape"],
    "Soda": ["Coke","Pepsi","Dr Pepper","Mountain Dew","Root Beer"]},
  
  "Snacks": {
    "Potato Chips": ["Frito Lays","Ruffles"],
    "Corn Chips": ["Frito Lays","Doritos","Tortilla"],
    "Cookies":  ["Chocolate Chip","Fudge Graham","Oatmeal","Cream Filled"],
    "Crackers": ["Cheese","Peanut Butter"],
    "Popcorn":  ["White","Caramel"],
    "Ice Cream": ["Vanilla","Chocolate","Strawberry","Butter Pecan","Cookies & Cream"],
    "Candy Bars": ["Snickers","Twix","Milky Way","3 Musketeers"]}
};

/* ══════════════════════════════════════
   STATE
   ══════════════════════════════════════ */
let items       = [];
let locked      = false;
let itemCounter = 0;
let breadcrumb  = [];

/* ══════════════════════════════════════
   INIT
   ══════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {

  /* modal overlay close on backdrop click */
  document.getElementById('addModal').addEventListener('click', function (e) {
    if (e.target === this) closeModal('addModal');
  });
  document.getElementById('removeModal').addEventListener('click', function (e) {
    if (e.target === this) closeModal('removeModal');
  });
  document.getElementById('menuModal').addEventListener('click', function (e) {
    if (e.target === this) closeMenuModal();
  });

  /* enter key on modal inputs */
  document.getElementById('addInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') confirmAdd();
  });
  document.getElementById('removeInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') confirmRemove();
  });
  document.getElementById('voiceInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addFromInput();
  });

  renderList();
});

/* ══════════════════════════════════════
   LIST — render / mutate
   ══════════════════════════════════════ */
function renderList() {
  const el = document.getElementById('grocery-list');
  if (!items.length) {
    el.innerHTML = '<div class="empty-state">No items yet — use the buttons above to add items.</div>';
    return;
  }
  el.innerHTML = `<div class="notepad-list">` +
    items.map((item, index) => `
      <div class="notepad-item" id="row-${item.id}">

        <input type="checkbox" id="chk-${item.id}"
               ${item.checked ? 'checked' : ''}
               onchange="toggleCheck(${item.id})"
               ${locked ? 'disabled' : ''}>
        <label class="notepad-text ${item.checked ? 'crossed' : ''}"
               for="chk-${item.id}">${item.name}</label>
        ${!locked ? `<button class="notepad-remove" onclick="removeItem(${item.id})" title="Remove">✕</button>` : ''}
      </div>
    `).join('') +
  `</div>`;
}

function toggleCheck(id) {
  const item = items.find(i => i.id === id);
  if (item) item.checked = !item.checked;
  renderList();
}

function removeItem(id) {
  items = items.filter(i => i.id !== id);
  renderList();
}

function addItem(name) {
  const trimmed = name.trim();
  if (!trimmed) return;
  items.push({ id: ++itemCounter, name: trimmed, checked: false });
  renderList();
}

/* ══════════════════════════════════════
   LOCK
   ══════════════════════════════════════ */
function toggleLock() {
  locked = !locked;
  const btn   = document.getElementById('lockBtn');
  const badge = document.getElementById('lockBadge');
  btn.textContent   = locked ? '🔒 Unlock' : '🔓 Lock';
  badge.textContent = locked ? '🔒 Locked' : '🔓 Unlocked';
  badge.className   = 'lock-badge' + (locked ? ' locked' : '');
  renderList();
}

/* ══════════════════════════════════════
   ADD / REMOVE MODALS
   ══════════════════════════════════════ */
function openModal(id) {
  document.getElementById(id).classList.add('open');
  const inputId = id === 'addModal' ? 'addInput' : 'removeInput';
  const input   = document.getElementById(inputId);
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 100);
  }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function confirmAdd() {
  const val = document.getElementById('addInput').value;
  if (val.trim()) addItem(val);
  closeModal('addModal');
}

function confirmRemove() {
  const val = document.getElementById('removeInput').value.trim().toLowerCase();
  items = items.filter(i => i.name.toLowerCase() !== val);
  renderList();
  closeModal('removeModal');
}

/* ══════════════════════════════════════
   MENU MODAL
   ══════════════════════════════════════ */
function openMenuModal() {
  breadcrumb = [];
  document.getElementById('menuSearch').value = '';
  document.getElementById('searchResults').innerHTML = '';
  document.getElementById('browser-list').style.display = '';
  document.getElementById('menuModal').classList.add('open');
  renderBrowser();
}

function closeMenuModal() {
  document.getElementById('menuModal').classList.remove('open');
}

function renderBrowser() {
  const backBtn = document.getElementById('backBtn');
  const bcrumb  = document.getElementById('breadcrumb');
  const list    = document.getElementById('browser-list');

  backBtn.style.display = breadcrumb.length ? 'inline-block' : 'none';
  bcrumb.textContent    = breadcrumb.join(' › ');

  let html = '';

  if (breadcrumb.length === 0) {
    Object.keys(MENU).forEach(cat => {
      html += `
        <div class="browser-item" onclick="drillDown('${cat}')">
          <span class="browser-item-name">${cat}</span>
          <span class="browser-item-arrow">›</span>
        </div>`;
    });
  } else if (breadcrumb.length === 1) {
    const subs = MENU[breadcrumb[0]];
    Object.keys(subs).forEach(sub => {
      html += `
        <div class="browser-item" onclick="drillDown('${sub}')">
          <span class="browser-item-name">${sub}</span>
          <span class="browser-item-arrow">›</span>
        </div>`;
    });
  } else {
    const itemList = MENU[breadcrumb[0]][breadcrumb[1]];
    itemList.forEach(item => {
      const safe = item.replace(/'/g, "\\'");
      html += `
        <div class="browser-item">
          <span class="browser-item-name">${item}</span>
          <button class="add-btn"
            onclick="addItem('${safe}'); this.textContent='✓ Added'; this.disabled=true;">
            + Add
          </button>
        </div>`;
    });
  }

  list.innerHTML = html || '<div class="empty-state">Nothing here.</div>';
}

function drillDown(key) {
  breadcrumb.push(key);
  renderBrowser();
}

function goBack() {
  breadcrumb.pop();
  renderBrowser();
}

/* ══════════════════════════════════════
   SEARCH
   ══════════════════════════════════════ */
function menuLiveSearch() {
  const q         = document.getElementById('menuSearch').value.trim().toLowerCase();
  const resultsEl = document.getElementById('searchResults');
  const listEl    = document.getElementById('browser-list');

  if (!q) {
    resultsEl.innerHTML  = '';
    listEl.style.display = '';
    return;
  }

  const matches = [];
  Object.entries(MENU).forEach(([cat, subs]) => {
    Object.entries(subs).forEach(([sub, itemList]) => {
      itemList.forEach(item => {
        if (item.toLowerCase().includes(q)) matches.push({ item, cat, sub });
      });
    });
  });

  listEl.style.display = 'none';

  if (!matches.length) {
    resultsEl.innerHTML = '<div class="empty-state">No items found.</div>';
    return;
  }

  resultsEl.innerHTML = matches.map(m => {
    const safe = m.item.replace(/'/g, "\\'");
    return `
      <div class="browser-item">
        <div>
          <div class="browser-item-name">${m.item}</div>
          <div style="font-family:'Space Mono',monospace;font-size:8px;
                      color:rgba(200,169,110,0.4);letter-spacing:0.1em;margin-top:2px;">
            ${m.cat} › ${m.sub}
          </div>
        </div>
        <button class="add-btn"
          onclick="addItem('${safe}'); this.textContent='✓ Added'; this.disabled=true;">
          + Add
        </button>
      </div>`;
  }).join('');
}

/* ══════════════════════════════════════
   VOICE
   ══════════════════════════════════════ */
function startVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert('Voice input is not supported on this browser.');
    return;
  }
  const rec = new SR();
  rec.lang = 'en-US';
  rec.interimResults = true;
  rec.onresult = function (e) {
    const transcript = Array.from(e.results)
      .map(r => r[0].transcript)
      .join('');
    document.getElementById('voiceInput').value = transcript;
  };
  rec.start();
}

function addFromInput() {
  const val = document.getElementById('voiceInput').value;
  if (val.trim()) {
    addItem(val);
    document.getElementById('voiceInput').value = '';
  }
}
