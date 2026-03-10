import { getMinimapData } from "./minimap.js";
import { createMinimapOverlay } from "./MinimapOverlay.js";

export class MinimapModule {
    constructor() {
        this.overlay = null;
        this.timer = null;
        this.starting = false;
    }

    start() {
        if (this.overlay || this.starting) return;

        this.starting = true;

        try {
            this.overlay = createMinimapOverlay();
            this.overlay.hide();

            this.timer = setInterval(() => {
                this.update();
            }, 250);

            this.update();

            console.log("[DIHELPER] MinimapModule: iniciado ✅");
        } catch (e) {
            console.error("[DIHELPER] MinimapModule: falha ao iniciar:", e);
        } finally {
            this.starting = false;
        }
    }

    stop() {
        try {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }

            this.overlay?.destroy?.();
        } catch (e) {
            console.error("[DIHELPER] MinimapModule: erro ao parar:", e);
        }

        this.overlay = null;
        this.starting = false;

        console.log("[DIHELPER] MinimapModule: stop ✅");
    }

    toggle() {
        if (!this.overlay) {
            this.start();
            setTimeout(() => this.overlay?.toggle?.(), 100);
            return;
        }

        this.overlay.toggle();
    }

    update() {
        if (!this.overlay) return;

        const data = getMinimapData();
        this.overlay.update(data);
    }

    isRunning() {
        return !!this.overlay;
    }

    isStarting() {
        return this.starting;
    }
}