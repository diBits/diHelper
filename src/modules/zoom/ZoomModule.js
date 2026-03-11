import {
    ZOOM_LEVELS,
    applyStageZoom,
    clampZoomIndex,
    findClosestZoomIndex,
    getStage,
} from "./zoom.js";

export class ZoomModule {
    constructor() {
        this.zoomIndex = 0;
        this.initialized = false;
    }

    initFromStage() {
        if (this.initialized) return;

        const stage = getStage();
        const currentZoom = stage?.scale?.x ?? 1;

        this.zoomIndex = findClosestZoomIndex(currentZoom);
        this.initialized = true;
    }

    applyCurrentZoom() {
        const zoom = ZOOM_LEVELS[this.zoomIndex];
        const ok = applyStageZoom(zoom);

        if (ok) {
            console.log("[DIHELPER] Zoom aplicado ✅", { zoom });
        }

        return ok;
    }

    zoomIn() {
        this.initFromStage();
        this.zoomIndex = clampZoomIndex(this.zoomIndex - 1);
        return this.applyCurrentZoom();
    }

    zoomOut() {
        this.initFromStage();
        this.zoomIndex = clampZoomIndex(this.zoomIndex + 1);
        return this.applyCurrentZoom();
    }

    stop() {
        this.zoomIndex = 0;
        this.initialized = false;
        applyStageZoom(1);
        console.log("[DIHELPER] Zoom resetado no stop ✅");
    }
}