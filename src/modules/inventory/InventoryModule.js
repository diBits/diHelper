import { createInvOverlay } from "../../ui/invOverlay.js";

export class InventoryModule {
  constructor(options = {}) {
    this.inv = null;
    this.starting = false;

    this.overlayOptions = {
      slots: 75,
      cols: 15,
      rows: 5,
      size: 30,
      gap: 6,
      x: 0,
      y: 50,
      ...options.overlayOptions,
    };
  }

  waitAndStart(tries = 0) {
    const ok = window.PIXI && window.jv;

    if (ok) {
      try {
        if (!this.inv) {
          const created = createInvOverlay(this.overlayOptions);
          created.hide();
          this.inv = created;

          console.log("[DIHELPER] InventoryModule: overlay criado ✅ (inicia fechado)");
        }
      } catch (e) {
        console.error("[DIHELPER] InventoryModule: falha ao iniciar:", e);
      } finally {
        this.starting = false;
      }
      return;
    }

    if (tries > 600) {
      console.warn("[DIHELPER] InventoryModule: timeout esperando PIXI/jv");
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
    this.starting = false;

    console.log("[DIHELPER] InventoryModule: stop ✅");
  }

  toggle() {
    if (!this.inv) {
      this.start();
      setTimeout(() => this.inv?.toggle?.(), 250);
      return;
    }

    this.inv.toggle();
  }

  isRunning() {
    return !!this.inv;
  }

  isStarting() {
    return this.starting;
  }
}