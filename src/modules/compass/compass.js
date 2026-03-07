export const COMPASS_DIRECTIONS = ["North", "East", "South", "West"];

export function getCompassData() {
    const myself = window.myself;
    const jv = window.jv;

    const x = typeof myself?.x === "number" ? myself.x : null;
    const y = typeof myself?.y === "number" ? myself.y : null;
    const dirIndex = typeof myself?.dir === "number" ? myself.dir : null;

    const direction =
        dirIndex !== null && COMPASS_DIRECTIONS[dirIndex]
            ? COMPASS_DIRECTIONS[dirIndex]
            : "Unknown";

    const location =
        typeof jv?.map_title?.text === "string" && jv.map_title.text.trim()
            ? jv.map_title.text.trim()
            : "Unknown";

    return {
        x,
        y,
        direction,
        location,
    };
}