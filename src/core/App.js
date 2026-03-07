import { ModuleManager } from "./ModuleManager.js";
import { MenuUI } from "../ui/MenuUI.js";
import { InventoryModule } from "../modules/inventory/InventoryModule.js";
import { CompassModule } from "../modules/compass/CompassModule.js";

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

    this.modules.register("compass", new CompassModule());

    this.menuUI = new MenuUI({
      onStart: () => this.start(),
      onStop: () => this.stop(),
      onToggleInventory: () => this.toggleInventory(),
      onToggleCompass: () => this.toggleCompass(),
    });

    console.log("[DIHELPER] App inicializado ✅");
  }

  ensureMenu() {
    this.menuUI.ensureMounted();
  }

  getInventoryModule() {
    return this.modules.get("inventory");
  }

  getCompassModule() {
    return this.modules.get("compass");
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

  toggleCompass() {
    this.ensureMenu();
    this.getCompassModule()?.toggle();
}

  exposeDebug() {
    window.diStart = () => this.start();
    window.diStop = () => this.stop();
    window.diInvToggle = () => this.toggleInventory();
    window.diCompassToggle = () => this.toggleCompass();
  }

  mount() {
    this.exposeDebug();
    this.ensureMenu();
  }
}