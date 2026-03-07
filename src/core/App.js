import { MenuUI } from "../ui/MenuUI.js";
import { InventoryModule } from "../modules/inventory/InventoryModule.js";

export class App {
  constructor() {
    this.inventory = new InventoryModule({
      overlayOptions: {
        slots: 75,
        cols: 15,
        rows: 5,
        size: 30,
        gap: 6,
        x: 0,
        y: 50,
      },
    });

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

  start() {
    this.ensureMenu();
    this.inventory.start();
  }

  stop() {
    this.inventory.stop();
    this.menuUI.closePanel();

    console.log("[DIHELPER] stop ✅ (overlay destruído e painel fechado)");
  }

  toggleInventory() {
    this.ensureMenu();
    this.inventory.toggle();
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