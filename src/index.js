import { createInvOverlay } from "./ui/invOverlay.js";

let inv = null;
let menu = null;

console.log("[DIHELPER] index.js rodando no contexto da página ✅");

// --- MENU HTML (canto inferior esquerdo, abre pra cima) ---
function createMenu() {
  const rootId = "dihelper_menu_root";
  if (document.getElementById(rootId)) return;

  const root = document.createElement("div");
  root.id = rootId;
  root.style.cssText = `
    position:fixed; left:12px; bottom:12px; z-index:999999;
    font-family: Arial, sans-serif;
  `;

  const panel = document.createElement("div");
  panel.id = "dihelper_menu_panel";
  panel.style.cssText = `
    display:none;
    margin-bottom:8px;
    background:rgba(0,0,0,.75);
    border:1px solid rgba(255,255,255,.15);
    border-radius:10px;
    padding:8px;
    min-width:140px;
  `;

  const btnInv = document.createElement("button");
  btnInv.textContent = "INV+";
  btnInv.style.cssText = `
    width:100%;
    padding:8px 10px;
    border-radius:8px;
    border:1px solid rgba(255,255,255,.2);
    background:rgba(255,255,255,.08);
    color:#fff;
    cursor:pointer;
    text-align:left;
  `;
  btnInv.onclick = () => {
    if (!inv) {
      console.warn("[DIHELPER] INV ainda não foi criado. Rode diStart() primeiro.");
      return;
    }
    inv.toggle();
  };

  panel.appendChild(btnInv);

  const main = document.createElement("button");
  main.id = "dihelper_menu_btn";
  main.textContent = "di";
  main.title = "diHelper menu";
  main.style.cssText = `
    width:42px; height:42px;
    border-radius:12px;
    border:1px solid rgba(255,255,255,.25);
    background:rgba(0,0,0,.65);
    color:#fff;
    cursor:pointer;
    font-weight:bold;
  `;
  main.onclick = () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  };

  root.appendChild(panel);
  root.appendChild(main);
  document.documentElement.appendChild(root);

  console.log("[DIHELPER] menu OK ✅ (canto inferior esquerdo)");
}

function destroyMenu() {
  document.getElementById("dihelper_menu_root")?.remove();
}

// --- START / STOP ---
function waitAndStart(tries = 0) {
  const ok = window.PIXI && window.jv; // PIXI do jogo + jv
  if (ok) {
    try {
      createMenu();

      if (!inv) {
        inv = createInvOverlay({ slots: 75, cols: 15, rows: 5 });
        inv.hide(); // IMPORTANTE: não abre sozinho
        console.log("[DIHELPER] INV overlay criado ✅ (inicia fechado)");
      }
    } catch (e) {
      console.error("[DIHELPER] falha ao iniciar:", e);
    }
    return;
  }

  if (tries > 600) {
    console.warn("[DIHELPER] timeout esperando PIXI/jv");
    return;
  }
  setTimeout(() => waitAndStart(tries + 1), 100);
}

window.diStart = () => waitAndStart(0);

window.diStop = () => {
  try {
    inv?.destroy?.();
  } catch {}
  inv = null;

  destroyMenu();
  console.log("[DIHELPER] stop ✅");
};

window.diInvToggle = () => inv?.toggle?.();

waitAndStart();