export function createCompassOverlay() {
    const rootId = "dihelper_compass_overlay";

    const existing = document.getElementById(rootId);
    if (existing) {
        return {
            element: existing,
            show() {
                existing.style.display = "block";
            },
            hide() {
                existing.style.display = "none";
            },
            toggle() {
                existing.style.display =
                    existing.style.display === "none" ? "block" : "none";
            },
            update(data) {
                const mapEl = existing.querySelector("[data-role='map']");
                const posEl = existing.querySelector("[data-role='pos']");
                const dirEl = existing.querySelector("[data-role='dir']");

                if (mapEl) mapEl.textContent = `Map: ${data.location}`;
                if (posEl) posEl.textContent = `Pos: ${data.x ?? "?"}, ${data.y ?? "?"}`;
                if (dirEl) dirEl.textContent = `Dir: ${data.direction}`;
            },
            destroy() {
                existing.remove();
            },
        };
    }

    const root = document.createElement("div");
    root.id = rootId;
    root.style.cssText = `
        position:fixed;
        left:210px;
        bottom:12px;
        z-index:999999;
        background:rgba(12,12,12,.82);
        border:1px solid rgba(55,55,55,.95);
        border-radius:0;
        padding:10px;
        width:max-content;
        min-width:0;
        color:#fff;
        font-family:Arial, sans-serif;
        font-size:12px;
        box-sizing:border-box;
`;

    const title = document.createElement("div");
    title.textContent = "Compass";
    title.style.cssText = `
        font-weight:bold;
        margin-bottom:8px;
        text-align:center;
    `;

    const map = document.createElement("div");
    map.setAttribute("data-role", "map");
    map.textContent = "Map: Unknown";
    map.style.cssText = `margin-bottom:4px;`;

    const pos = document.createElement("div");
    pos.setAttribute("data-role", "pos");
    pos.textContent = "Pos: ?, ?";
    pos.style.cssText = `margin-bottom:4px;`;

    const dir = document.createElement("div");
    dir.setAttribute("data-role", "dir");
    dir.textContent = "Dir: Unknown";

    root.appendChild(title);
    root.appendChild(map);
    root.appendChild(pos);
    root.appendChild(dir);

    (document.body || document.documentElement).appendChild(root);

    return {
        element: root,
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
        update(data) {
            map.textContent = `Map: ${data.location}`;
            pos.textContent = `Pos: ${data.x ?? "?"}, ${data.y ?? "?"}`;
            dir.textContent = `Dir: ${data.direction}`;
        },
        destroy() {
            root.remove();
        },
    };
}