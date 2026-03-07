import { createInvOverlay } from "../ui/invOverlay.js";
import { MenuUI } from "../ui/MenuUI.js";

export class App {
  constructor() {
    this.inv = null;
    this.starting = false;

    this.menuUI = new MenuUI({
      onStart: () => this.start(),
      onStop: () => this.stop(),
      onToggleInventory: () => this.toggleInventory(),
    });

    console.log("[DIHELPER] App inicializado ✅");
  }

  ensureMenu() {
    this.menuUI.ensureMounted();
  }

  waitAndStart(tries = 0) {
    const ok = window.PIXI && window.jv;

    if (ok) {
      try {
        this.ensureMenu();

        if (!this.inv) {
          const created = createInvOverlay({
            slots: 75,
            cols: 15,
            rows: 5,
            size: 30,
            gap: 6,
            x: 0,
            y: 50,
          });

          created.hide();
          this.inv = created;

          console.log("[DIHELPER] INV overlay criado ✅ (inicia fechado)");
        }
      } catch (e) {
        console.error("[DIHELPER] falha ao iniciar:", e);
      } finally {
        this.starting = false;
      }
      return;
    }

    if (tries > 600) {
      console.warn("[DIHELPER] timeout esperando PIXI/jv");
      this.starting = false;
      return;
    }

    setTimeout(() => this.waitAndStart(tries + 1), 100);
  }

  start() {
    if (this.inv) return;
    if (this.starting) return;

    this.starting = true;
    this.waitAndStart(0);
  }

  stop() {
    try {
      this.inv?.destroy?.();
    } catch {}

    this.inv = null;
    this.menuUI.closePanel();

    console.log("[DIHELPER] stop ✅ (overlay destruído e painel fechado)");
  }

  toggleInventory() {
    if (!this.inv) {
      this.start();
      setTimeout(() => this.inv?.toggle?.(), 250);
      return;
    }

    this.inv.toggle();
  }

  exposeDebug() {
    window.diStart = () => this.start();
    window.diStop = () => this.stop();
    window.diInvToggle = () => this.toggleInventory();
  }

  mount() {
    this.exposeDebug();
    this.ensureMenu();
  }
}