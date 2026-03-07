import { ModuleManager } from "./ModuleManager.js";
import { MenuUI } from "../ui/MenuUI.js";
import { InventoryModule } from "../modules/inventory/InventoryModule.js";

export class App {
  constructor() {
    this.modules = new ModuleManager();

    this.modules.register(
      "inventory",
      new InventoryModule({
        overlayOptions: {
          slots: 75,
          cols: 15,
          rows: 5,
          size: 30,
          gap: 6,
          x: 0,
          y: 50,
        },
      })
    );

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

  getInventoryModule() {
    return this.modules.get("inventory");
  }

  start() {
    this.ensureMenu();
    this.getInventoryModule()?.start();
  }

  stop() {
    this.modules.stopAll();
    this.menuUI.closePanel();

    console.log("[DIHELPER] stop ✅ (módulos parados e painel fechado)");
  }

  toggleInventory() {
    this.ensureMenu();
    this.getInventoryModule()?.toggle();
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