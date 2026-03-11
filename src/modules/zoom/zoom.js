export const ZOOM_LEVELS = [1, 0.95, 0.9, 0.85, 0.8];

export function getStage() {
    return window.jv?.stage ?? null;
}

export function getScreen() {
    return window.jv?.renderer?.screen ?? null;
}

export function applyStageZoom(zoom) {
    const stage = getStage();
    const screen = getScreen();

    if (!stage || !screen) {
        console.warn("[DIHELPER] Zoom: stage ou screen não encontrado");
        return false;
    }

    const cx = screen.width / 2;
    const cy = screen.height / 2;

    stage.scale.set(zoom, zoom);
    stage.position.x = cx - (cx * zoom);
    stage.position.y = cy - (cy * zoom);

    return true;
}

export function clampZoomIndex(index) {
    if (index < 0) return 0;
    if (index >= ZOOM_LEVELS.length) return ZOOM_LEVELS.length - 1;
    return index;
}

export function findClosestZoomIndex(currentZoom) {
    let bestIndex = 0;
    let bestDiff = Infinity;

    for (let i = 0; i < ZOOM_LEVELS.length; i++) {
        const diff = Math.abs(ZOOM_LEVELS[i] - currentZoom);
        if (diff < bestDiff) {
            bestDiff = diff;
            bestIndex = i;
        }
    }

    return bestIndex;
}