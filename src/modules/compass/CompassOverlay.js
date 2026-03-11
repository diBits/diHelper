function normalizeOverlayPosition(root, storageKey) {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || "null");

        if (
            saved &&
            typeof saved.left === "number" &&
            typeof saved.top === "number"
        ) {
            root.style.left = `${saved.left}px`;
            root.style.top = `${saved.top}px`;
            root.style.right = "auto";
            root.style.bottom = "auto";
            return;
        }
    } catch { }

    const rect = root.getBoundingClientRect();
    root.style.left = `${rect.left}px`;
    root.style.top = `${rect.top}px`;
    root.style.right = "auto";
    root.style.bottom = "auto";
}

function saveOverlayPosition(root, storageKey) {
    const left = parseFloat(root.style.left);
    const top = parseFloat(root.style.top);

    if (Number.isFinite(left) && Number.isFinite(top)) {
        localStorage.setItem(
            storageKey,
            JSON.stringify({ left, top })
        );
    }
}

function makeOverlayDraggable(root, storageKey) {
    if (root.__diDraggable) return;
    root.__diDraggable = true;

    normalizeOverlayPosition(root, storageKey);
    root.style.cursor = "grab";

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const onMouseMove = (e) => {
        if (!dragging) return;

        root.style.left = `${e.clientX - offsetX}px`;
        root.style.top = `${e.clientY - offsetY}px`;
    };

    const onMouseUp = () => {
        if (!dragging) return;
        dragging = false;
        root.style.cursor = "grab";
        saveOverlayPosition(root, storageKey);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    };

    root.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;

        const rect = root.getBoundingClientRect();
        dragging = true;
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        root.style.cursor = "grabbing";

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    });

    const onTouchMove = (e) => {
        if (!dragging) return;
        const touch = e.touches[0];
        if (!touch) return;

        root.style.left = `${touch.clientX - offsetX}px`;
        root.style.top = `${touch.clientY - offsetY}px`;
    };

    const onTouchEnd = () => {
        if (!dragging) return;
        dragging = false;
        root.style.cursor = "grab";
        saveOverlayPosition(root, storageKey);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
    };

    root.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        if (!touch) return;

        const rect = root.getBoundingClientRect();
        dragging = true;
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;

        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", onTouchEnd);
    }, { passive: true });
}

export function createCompassOverlay() {
    const rootId = "dihelper_compass_overlay";
    const storageKey = "dihelper_compass_overlay_pos";

    const existing = document.getElementById(rootId);
    if (existing) {
        makeOverlayDraggable(existing, storageKey);

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
        left:425px;
        bottom:12px;
        z-index:1000000;
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
        user-select:none;
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

    root.appendChild(map);
    root.appendChild(pos);
    root.appendChild(dir);

    (document.body || document.documentElement).appendChild(root);

    makeOverlayDraggable(root, storageKey);

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