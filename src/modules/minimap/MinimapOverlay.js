import { normalizePoint } from "./minimap.js";

export function createMinimapOverlay() {
    const rootId = "dihelper_minimap_overlay";
    const mapSize = 180;

    const existing = document.getElementById(rootId);
    if (existing) {
        return buildApi(existing, mapSize);
    }

    const root = document.createElement("div");
    root.id = rootId;
    root.style.cssText = `
        position: fixed;
        right: 1125px;
        bottom: 12px;
        z-index: 1000000;
        background: rgba(12,12,12,.88);
        border: 1px solid rgba(55,55,55,.95);
        border-radius: 0;
        padding: 8px;
        color: #fff;
        font-family: Arial, sans-serif;
        box-sizing: border-box;
        user-select: none;
    `;
    //Resolvi remover os nomes para diminuir o espaço ocupado no mapa para uma futura versao mobile
    //const title = document.createElement("div");
    //title.setAttribute("data-role", "title");
    //title.textContent = "MINIMAP";
    //title.style.cssText = `
    //    font-weight: bold;
    //    font-size: 12px;
    //    margin-bottom: 6px;
    //    text-align: center;
    //`;

    const mapBox = document.createElement("div");
    mapBox.setAttribute("data-role", "map-box");
    mapBox.style.cssText = `
        position: relative;
        width: ${mapSize}px;
        height: ${mapSize}px;
        border: 1px solid rgba(120,120,120,.95);
        background: rgba(255,255,255,.03);
        box-sizing: border-box;
        overflow: hidden;
    `;

    const crossV = document.createElement("div");
    crossV.style.cssText = `
        position: absolute;
        left: 50%;
        top: 0;
        width: 1px;
        height: 100%;
        background: rgba(180,180,180,.35);
        transform: translateX(-50%);
        pointer-events: none;
    `;

    const crossH = document.createElement("div");
    crossH.style.cssText = `
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 1px;
        background: rgba(180,180,180,.35);
        transform: translateY(-50%);
        pointer-events: none;
    `;

    const quadNW = document.createElement("div");
    quadNW.textContent = "NW";
    quadNW.style.cssText = `
        position: absolute;
        top: 4px;
        left: 6px;
        font-size: 10px;
        color: rgba(255,255,255,.65);
        pointer-events: none;
    `;

    const quadNE = document.createElement("div");
    quadNE.textContent = "NE";
    quadNE.style.cssText = `
        position: absolute;
        top: 4px;
        right: 6px;
        font-size: 10px;
        color: rgba(255,255,255,.65);
        pointer-events: none;
    `;

    const quadSW = document.createElement("div");
    quadSW.textContent = "SW";
    quadSW.style.cssText = `
        position: absolute;
        bottom: 4px;
        left: 6px;
        font-size: 10px;
        color: rgba(255,255,255,.65);
        pointer-events: none;
    `;

    const quadSE = document.createElement("div");
    quadSE.textContent = "SE";
    quadSE.style.cssText = `
        position: absolute;
        bottom: 4px;
        right: 6px;
        font-size: 10px;
        color: rgba(255,255,255,.65);
        pointer-events: none;
    `;

    const dotsLayer = document.createElement("div");
    dotsLayer.setAttribute("data-role", "dots-layer");
    dotsLayer.style.cssText = `
        position: absolute;
        inset: 0;
    `;

    mapBox.appendChild(crossV);
    mapBox.appendChild(crossH);
    mapBox.appendChild(quadNW);
    mapBox.appendChild(quadNE);
    mapBox.appendChild(quadSW);
    mapBox.appendChild(quadSE);
    mapBox.appendChild(dotsLayer);

    //root.appendChild(title); titulo removido
    root.appendChild(mapBox);

    (document.body || document.documentElement).appendChild(root);

    return buildApi(root, mapSize);
}

function buildApi(root, mapSize) {
    return {
        show() {
            root.style.display = "block";
        },

        hide() {
            root.style.display = "none";
        },

        toggle() {
            root.style.display =
                root.style.display === "none" ? "block" : "none";
        },

        destroy() {
            root.remove();
        },

        update(data) {
            const dotsLayer = root.querySelector("[data-role='dots-layer']");
            if (!dotsLayer) return;

            dotsLayer.innerHTML = "";

            if (
                typeof data.mapWidth !== "number" ||
                typeof data.mapHeight !== "number" ||
                typeof data.player.x !== "number" ||
                typeof data.player.y !== "number"
            ) {
                return;
            }

            const playerPoint = normalizePoint(
                data.player.x,
                data.player.y,
                data.mapWidth,
                data.mapHeight
            );

            const playerDot = createDot({
                left: playerPoint.x * mapSize,
                top: playerPoint.y * mapSize,
                color: "#ffd400",
                size: 8,
                title: `${data.player.name} (${data.player.x}, ${data.player.y})`,
            });

            dotsLayer.appendChild(playerDot);

            for (const entity of data.entities) {
                const point = normalizePoint(
                    entity.x,
                    entity.y,
                    data.mapWidth,
                    data.mapHeight
                );

                const dot = createDot({
                    left: point.x * mapSize,
                    top: point.y * mapSize,
                    color: entity.kind === "monster" ? "#ff4d4d" : "#66ccff",
                    size: 6,
                    title:
                        `${entity.name}` +
                        (entity.level !== null ? ` Lv.${entity.level}` : "") +
                        ` (${entity.x}, ${entity.y})`,
                });

                dotsLayer.appendChild(dot);
            }
        },
    };
}

function createDot({ left, top, color, size, title }) {
    const dot = document.createElement("div");
    dot.title = title;
    dot.style.cssText = `
        position: absolute;
        left: ${left}px;
        top: ${top}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        transform: translate(-50%, -50%);
        box-shadow: 0 0 0 1px rgba(0,0,0,.65);
        pointer-events: auto;
    `;
    return dot;
}