import { createInvOverlay } from "./ui/invOverlay.js";

let instance = null;

// prova de vida no contexto da página
console.log("[DIHELPER] index.js rodando no contexto da página ✅");

// badge HTML SEM PIXI_GLOBAL (sempre aparece se o bundle entrou)
(function badge() {
  const id = "dihelper_badge";
  if (document.getElementById(id)) return;

  const el = document.createElement("div");
  el.id = id;
  el.textContent = "diHelper ON ✅";
  el.style.cssText = `
    position:fixed;left:10px;top:10px;z-index:999999;
    background:rgba(0,0,0,.75);color:#fff;padding:6px 10px;
    font:12px Arial;border-radius:6px;
  `;
  document.documentElement.appendChild(el);
})();

function waitAndStart(tries = 0) {
  // NÃO exige item_data/items/tiles aqui
  const ok = window.PIXI_GLOBAL && window.jv;
  if (ok) {
    try {
      instance = createInvOverlay();
      console.log("[DIHELPER] INV overlay ON ✅");
    } catch (e) {
      console.error("[DIHELPER] falha ao iniciar overlay:", e);
    }
    return;
  }

  if (tries > 600) {
    console.warn("[DIHELPER] timeout esperando PIXI_GLOBAL/jv");
    return;
  }
  setTimeout(() => waitAndStart(tries + 1), 100);
}

// comandos simples
window.diStart = () => waitAndStart(0);
window.diStop = () => instance?.destroy?.();

waitAndStart();