import { ModuleManager } from "./ModuleManager.js";
import { MenuUI } from "../ui/MenuUI.js";
import { InventoryModule } from "../modules/inventory/InventoryModule.js";
import { CompassModule } from "../modules/compass/CompassModule.js";
import { MinimapModule } from "../modules/minimap/MinimapModule.js";
import { ZoomModule } from "../modules/zoom/ZoomModule.js";

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
        this.modules.register("minimap", new MinimapModule());
        this.modules.register("zoom", new ZoomModule());

        this.menuUI = new MenuUI({
            onStart: () => this.start(),
            onStop: () => this.stop(),
            onToggleInventory: () => this.toggleInventory(),
            onToggleCompass: () => this.toggleCompass(),
            onToggleMinimap: () => this.toggleMinimap(),
            onZoomIn: () => this.zoomIn(),
            onZoomOut: () => this.zoomOut(),
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

    getMinimapModule() {
        return this.modules.get("minimap");
    }

    getZoomModule() {
        return this.modules.get("zoom");
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

    toggleMinimap() {
        this.ensureMenu();
        this.getMinimapModule()?.toggle();
    }

    zoomIn() {
        this.ensureMenu();
        this.getZoomModule()?.zoomIn();
    }

    zoomOut() {
        this.ensureMenu();
        this.getZoomModule()?.zoomOut();
    }

    exposeDebug() {
        window.diStart = () => this.start();
        window.diStop = () => this.stop();
        window.diInvToggle = () => this.toggleInventory();
        window.diCompassToggle = () => this.toggleCompass();
        window.diMinimapToggle = () => this.toggleMinimap();
        window.diZoomIn = () => this.zoomIn();
        window.diZoomOut = () => this.zoomOut();
    }

    mount() {
        this.exposeDebug();
        this.ensureMenu();
    }
}