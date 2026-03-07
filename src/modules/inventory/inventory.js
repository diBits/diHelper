export const DEFAULT_INVENTORY_OVERLAY_OPTIONS = {
    slots: 75,
    cols: 15,
    rows: 5,
    size: 30,
    gap: 6,
    x: 0,
    y: 50,
};

export function buildInventoryOverlayOptions(customOptions = {}) {
    return {
        ...DEFAULT_INVENTORY_OVERLAY_OPTIONS,
        ...customOptions,
    };
}