/* =========================
   MENU DATA (UNCHANGED)
   ========================= */
const MENU = {
  "Meats": {
    "Chicken": ["Breasts","Thighs","Legs","Wings"],
    "Beef": ["Ground Beef","Chuck Steak","Sirloin Steak","Thin Cut","T-Bone","Ribeye Steak"],
    "Pork": ["Ham","Pork Chops","Sausage","Short Ribs","Baby Back Ribs","Spare Ribs"],
    "Turkey": ["Sliced","Whole"],
    "Seafood": ["Salmon","Shrimp","Tilapia","Tuna","Cod","Crawfish"]
  },

  "Vegetables": {
    "Lettuce": ["1 Lb"],
    "Tomato": ["1 Lb"],
    "Cucumber": ["1 Lb"],
    "Peas": ["1 Lb"],
    "Carrots": ["1 Lb"],
    "Onions": ["1 Lb"],
    "Mushrooms": ["1 Lb"],
    "Cabbage": ["1 Lb"],
    "Potatoes": ["1 Lb"],
    "Broccoli": ["1 Lb"]
  },

  "Fruits": {
    "Apples": ["1 Lb"],
    "Oranges": ["1 Lb"],
    "Bananas": ["1 Lb"],
    "Grapes": ["1 Lb"],
    "Strawberries": ["1 Lb"]
  },

  "Snacks": {
    "Chips": ["Doritos","Lays","Ruffles"],
    "Cookies": ["Chocolate Chip","Oatmeal"],
    "Candy Bars": ["Snickers","Twix","Milky Way"]
  }
};

/* =========================
   STATE
   ========================= */
let items = [];
let locked = false;
let itemCounter = 0;

let expandedNodes = new Set();
let previewUsed = false;

/* =========================
   INIT
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  renderList();
});

/* =========================
   GROCERY LIST (UNCHANGED CORE)
   ========================= */
function renderList() {
  const el = document.getElementById('grocery-list');

  if (!items.length) {
    el.innerHTML = '<div class="empty-state">No items yet — use the buttons below to add items.</div>';
    return;
  }

  el.innerHTML =
    `<div class="notepad-list">` +
    items.map(item => `
      <div class="notepad-item" id="row-${item.id}">

        <input class="notepad-checkbox"
               type="checkbox"
               id="chk-${item.id}"
               ${item.checked ? 'checked' : ''}
               onchange="toggleCheck(${item.id})"
               ${locked ? 'disabled' : ''}>

        <label class="notepad-text ${item.checked ? 'crossed' : ''}"
               for="chk-${item.id}">
          ${item.name}
        </label>

        ${!locked ? `
          <button class="notepad-remove"
                  onclick="removeItem(${item.id})"
                  title="Remove">✕</button>
        ` : ''}

      </div>
    `).join('') +
    `</div>`;
}

function addItem(name) {
  items.push({
    id: ++itemCounter,
    name,
    checked: false
  });

  renderList();
}

window.addItem = addItem;

/* =========================
   REMOVE / CHECK ITEMS
   ========================= */
function removeItem(id) {
  items = items.filter(i => i.id !== id);
  renderList();
}
window.removeItem = removeItem;

function toggleCheck(id) {
  const item = items.find(i => i.id === id);
  if (item) item.checked = !item.checked;
  renderList();
}
window.toggleCheck = toggleCheck;

/* =========================
   RENDER TREE FUNCTION
   ========================= */
function renderGroceryMenu() {
  let html = '<ul class="toggle-menu-list">';

  Object.keys(MENU).forEach(key => {
    const id = [key].join("::");
    const open = expandedNodes.has(id);

    html += `
      <li class="toggle-menu-group">
	    <div class="toggle-menu-trigger" onclick="toggleNode('${id}')">
		<span class="grocery-menu-chevron">${open ? "▼" : "›"}</span>
		<span>${key}</span>
		</div>
        ${open ? renderChildren(MENU[key], [key]) : ""}
      </li>`;
  });

  html += '</ul>';
  document.getElementById("grocery-menu-list").innerHTML = html;
}

function renderChildren(node, path) {
  if (Array.isArray(node)) {
    return `
      <ul class="toggle-menu-list">
        ${node.map(item => `
          <li class="toggle-menu-li">
            <span>${item}</span>
            <button class="add-btn" onclick="addItem('${item.replace(/'/g,"\\'")}')">+ Add</button>
          </li>
        `).join("")}
      </ul>`;
  }

  let html = '<ul class="toggle-menu-list">';
  Object.keys(node).forEach(key => {
    const id = [...path, key].join("::");
    const open = expandedNodes.has(id);
    html += `
      <li class="toggle-menu-group">
    	<div class="toggle-menu-trigger" onclick="toggleNode('${id}')">
		<span class="grocery-menu-chevron">${open ? "▼" : "›"}</span>
		<span>${key}</span>
		</div>
        ${open ? renderChildren(node[key], [...path, key]) : ""}
      </li>`;
  });
  html += '</ul>';
  return html;
}

/* =========================
   COLLAPSE SIBLINGS LOGIC
   ========================= */
function toggleNode(id) {

  const parts = id.split("::");
  const level = parts.length;

  if (expandedNodes.has(id)) {
    expandedNodes.delete(id);
  } else {

    [...expandedNodes].forEach(openId => {
      const openParts = openId.split("::");

      if (
        openParts.length === level &&
        openParts.slice(0, level - 1).join("::") === parts.slice(0, level - 1).join("::")
      ) {
        expandedNodes.delete(openId);
      }
    });

    expandedNodes.add(id);
    previewUsed = true;
  }

  renderGroceryMenu();
}

window.toggleNode = toggleNode;

/* =========================
   MENU TOGGLE
   ========================= */
function toggleGroceryMenu() {
  const tree = document.getElementById('grocery-menu-list');
  const btn  = document.getElementById('grocery-menu-toggle-button');

  if (tree.classList.contains('hidden')) {
    tree.classList.remove('hidden');
    btn.textContent = '◆ Close Grocery Menu';
    renderGroceryMenu();
  } else {
    tree.classList.add('hidden');
    btn.textContent = '◆ Open Grocery Menu';
  }
}
window.toggleGroceryMenu = toggleGroceryMenu;

/* =========================
   LOCK
   ========================= */
function toggleLock() {
  locked = !locked;
  document.getElementById("lockBtn").textContent =
    locked ? "🔒 Unlock" : "🔓 Lock";

  renderList();
}
window.toggleLock = toggleLock;

/* =========================
   PLACEHOLDER INPUT
   ========================= */
function addFromInput() {
  const v = document.getElementById("voiceInput").value;
  if (v) addItem(v);
}
window.addFromInput = addFromInput;

function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;
    document.getElementById("voiceInput").value = text;
  };

  recognition.onerror = function () {
    // silent fail (or log if you want)
  };
}

	window.startVoice = startVoice;

/* =========================
   FIREBASE HOOK (REQUIRED)
   ========================= */
window.getCurrentUserStatus = function () {
  return window.cookbook_unlocked ? "full" : "free";
};