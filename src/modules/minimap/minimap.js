export function getQuadrant(x, y, mapWidth, mapHeight) {
    if (
        typeof x !== "number" ||
        typeof y !== "number" ||
        typeof mapWidth !== "number" ||
        typeof mapHeight !== "number" ||
        mapWidth <= 0 ||
        mapHeight <= 0
    ) {
        return "Unknown";
    }

    const east = x >= mapWidth / 2;
    const south = y >= mapHeight / 2;

    if (!east && !south) return "NW";
    if (east && !south) return "NE";
    if (!east && south) return "SW";
    return "SE";
}

export function normalizePoint(x, y, mapWidth, mapHeight) {
    if (
        typeof x !== "number" ||
        typeof y !== "number" ||
        typeof mapWidth !== "number" ||
        typeof mapHeight !== "number" ||
        mapWidth <= 0 ||
        mapHeight <= 0
    ) {
        return { x: 0, y: 0 };
    }

    return {
        x: Math.max(0, Math.min(1, x / mapWidth)),
        y: Math.max(0, Math.min(1, y / mapHeight)),
    };
}

export function getMinimapData() {
    const myself = window.myself;
    const mapWidth = window.MAP_WIDTH;
    const mapHeight = window.MAP_HEIGHT;
    const mapName = window.jv?.map_title?.text ?? "Unknown";

    const playerX = typeof myself?.x === "number" ? myself.x : null;
    const playerY = typeof myself?.y === "number" ? myself.y : null;
    const playerId = myself?.id ?? null;

    const quadrant =
        playerX !== null && playerY !== null
            ? getQuadrant(playerX, playerY, mapWidth, mapHeight)
            : "Unknown";

    const entities = (window.mob_ref || [])
        .filter(Boolean)
        .filter((entity) => typeof entity.x === "number" && typeof entity.y === "number")
        .filter((entity) => entity.id !== playerId)
        .map((entity) => ({
            id: entity.id ?? null,
            name: entity.name ?? "Unknown",
            x: entity.x,
            y: entity.y,
            level: entity.level ?? null,
            kind: entity.monster_sprite ? "monster" : "player",
        }));

    return {
        mapName,
        mapWidth: typeof mapWidth === "number" ? mapWidth : null,
        mapHeight: typeof mapHeight === "number" ? mapHeight : null,
        player: {
            id: playerId,
            name: myself?.name ?? "You",
            x: playerX,
            y: playerY,
        },
        quadrant,
        entities,
    };
}