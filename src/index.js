import { createInvOverlay } from "./ui/invOverlay.js";

let inv = null;
let starting = false;

console.log("[DIHELPER] index.js rodando no contexto da página ✅");

// --- MENU HTML (canto inferior esquerdo, abre pra cima) ---
function createMenu() {
  const rootId = "dihelper_menu_root";
  if (document.getElementById(rootId)) return;

  const root = document.createElement("div");
  root.id = rootId;
  root.style.cssText = `
    position:fixed;
    left:12px;
    bottom:12px;
    z-index:999999;
    font-family: Arial, sans-serif;
    display:flex;
    flex-direction:column;
    align-items:flex-start;
  `;

  // painel que abre pra cima
  const panel = document.createElement("div");
  panel.id = "dihelper_menu_panel";
  panel.style.cssText = `
    display:none;
    margin-bottom:8px;
    background:rgba(0,0,0,.75);
    border:1px solid rgba(255,255,255,.15);
    border-radius:10px;
    padding:8px;
    min-width:220px;
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
    // auto-start se ainda não existe overlay
    if (!inv) {
      diStart();
      // tenta abrir depois que iniciar
      setTimeout(() => inv?.toggle?.(), 250);
      return;
    }
    inv.toggle();
  };

  panel.appendChild(btnInv);

  // linha de botões sempre visível (diHelper + start + stop)
  const row = document.createElement("div");
  row.style.cssText = `
    display:flex;
    gap:8px;
    align-items:center;
  `;

  const main = document.createElement("button");
  main.id = "dihelper_menu_btn";
  main.textContent = "diHelper";
  main.title = "diHelper menu";
  main.style.cssText = `
    padding:8px 12px;
    min-height:42px;
    border-radius:12px;
    border:1px solid rgba(255,255,255,.25);
    background:rgba(0,0,0,.65);
    color:#fff;
    cursor:pointer;
    font-weight:bold;
    font-size:12px;
  `;
  main.onclick = () => {
    // auto-start quando clicar no diHelper
    if (!inv) diStart();
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  };

  const btnStart = document.createElement("button");
  btnStart.id = "dihelper_btn_start";
  btnStart.textContent = "Start";
  btnStart.title = "Iniciar diHelper";
  btnStart.style.cssText = `
    padding:8px 10px;
    min-height:42px;
    border-radius:12px;
    border:1px solid rgba(255,255,255,.20);
    background:rgba(0,180,0,.55);
    color:#fff;
    cursor:pointer;
    font-weight:bold;
    font-size:12px;
  `;
  btnStart.onclick = () => diStart();

  const btnStop = document.createElement("button");
  btnStop.id = "dihelper_btn_stop";
  btnStop.textContent = "Stop";
  btnStop.title = "Parar diHelper";
  btnStop.style.cssText = `
    padding:8px 10px;
    min-height:42px;
    border-radius:12px;
    border:1px solid rgba(255,255,255,.20);
    background:rgba(200,0,0,.55);
    color:#fff;
    cursor:pointer;
    font-weight:bold;
    font-size:12px;
  `;
  btnStop.onclick = () => diStop();

  row.appendChild(main);
  row.appendChild(btnStart);
  row.appendChild(btnStop);

  root.appendChild(panel);
  root.appendChild(row);

  (document.body || document.documentElement).appendChild(root);

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
        const created = createInvOverlay({ slots: 75, cols: 15, rows: 5 });
        created.hide(); // não abre sozinho
        inv = created;

        console.log("[DIHELPER] INV overlay criado ✅ (inicia fechado)");
      }
    } catch (e) {
      console.error("[DIHELPER] falha ao iniciar:", e);
    } finally {
      starting = false;
    }
    return;
  }

  if (tries > 600) {
    console.warn("[DIHELPER] timeout esperando PIXI/jv");
    starting = false;
    return;
  }

  setTimeout(() => waitAndStart(tries + 1), 100);
}

function diStart() {
  if (inv) return;          // já iniciou
  if (starting) return;     // já está tentando iniciar
  starting = true;
  waitAndStart(0);
}

function diStop() {
  try {
    inv?.destroy?.();
  } catch {}
  inv = null;

  destroyMenu();
  console.log("[DIHELPER] stop ✅");
}

// comandos globais (debug)
window.diStart = diStart;
window.diStop = diStop;
window.diInvToggle = () => inv?.toggle?.();

// tenta iniciar o menu cedo, mas o overlay só nasce quando PIXI/jv existir
createMenu();