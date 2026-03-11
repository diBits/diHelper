export class MenuUI {
    constructor(options = {}) {
        this.onStart = options.onStart ?? (() => { });
        this.onStop = options.onStop ?? (() => { });
        this.onToggleInventory = options.onToggleInventory ?? (() => { });
        this.onToggleCompass = options.onToggleCompass ?? (() => { });
        this.onToggleMinimap = options.onToggleMinimap ?? (() => { });
        this.onZoomIn = options.onZoomIn ?? (() => { });
        this.onZoomOut = options.onZoomOut ?? (() => { });

        this.root = null;
        this.panel = null;
        this.mainButton = null;
        this.startButton = null;
        this.stopButton = null;

        this.invButton = null;
        this.mapButton = null;
        this.mapSubmenu = null;

        this.compassButton = null;
        this.minimapButton = null;

        this.zoomButton = null;
        this.zoomSubmenu = null;
        this.zoomInButton = null;
        this.zoomOutButton = null;
    }

    mount() {
        if (this.root && document.getElementById("dihelper_menu_root")) return;

        const existingRoot = document.getElementById("dihelper_menu_root");
        if (existingRoot) {
            this.root = existingRoot;
            this.panel = document.getElementById("dihelper_menu_panel");
            this.mainButton = document.getElementById("dihelper_menu_btn");
            this.startButton = document.getElementById("dihelper_btn_start");
            this.stopButton = document.getElementById("dihelper_btn_stop");

            this.invButton = document.getElementById("dihelper_btn_inv");
            this.mapButton = document.getElementById("dihelper_btn_map");
            this.mapSubmenu = document.getElementById("dihelper_map_submenu");

            this.compassButton = document.getElementById("dihelper_btn_compass");
            this.minimapButton = document.getElementById("dihelper_btn_minimap");

            this.zoomButton = document.getElementById("dihelper_btn_zoom");
            this.zoomSubmenu = document.getElementById("dihelper_zoom_submenu");
            this.zoomInButton = document.getElementById("dihelper_btn_zoom_in");
            this.zoomOutButton = document.getElementById("dihelper_btn_zoom_out");
            return;
        }

        const root = document.createElement("div");
        root.id = "dihelper_menu_root";
        root.style.cssText = `
            position: fixed;
            left: 12px;
            bottom: 12px;
            z-index: 1000002;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        `;

        const panel = document.createElement("div");
        panel.id = "dihelper_menu_panel";
        panel.style.cssText = `
            display: none;
            position: relative;
            margin-bottom: 8px;
            background: rgba(12,12,12,.82);
            border: 1px solid rgba(55,55,55,.95);
            border-radius: 0;
            padding: 8px;
            width: fit-content;
            min-width: 0;
            box-sizing: border-box;
        `;

        const mainColumn = document.createElement("div");
        mainColumn.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
            position: relative;
        `;

        const btnInv = document.createElement("button");
        btnInv.id = "dihelper_btn_inv";
        btnInv.textContent = "INV+";
        btnInv.style.cssText = `
            width: 170px;
            padding: 8px 10px;
            border-radius: 0;
            border: 1px solid rgba(55,55,55,.95);
            background: rgba(255,255,255,.08);
            color: #fff;
            cursor: pointer;
            text-align: center;
            box-sizing: border-box;
        `;
        btnInv.onclick = () => this.onToggleInventory();

        const btnMap = document.createElement("button");
        btnMap.id = "dihelper_btn_map";
        btnMap.textContent = "MAP";
        btnMap.style.cssText = `
            width: 170px;
            padding: 8px 10px;
            border-radius: 0;
            border: 1px solid rgba(55,55,55,.95);
            background: rgba(255,255,255,.08);
            color: #fff;
            cursor: pointer;
            text-align: center;
            box-sizing: border-box;
        `;
        btnMap.onclick = () => this.toggleMapSubmenu();

        const mapSubmenu = document.createElement("div");
        mapSubmenu.id = "dihelper_map_submenu";
        mapSubmenu.style.cssText = `
            display: none;
            position: absolute;
            left: calc(100% + 15px);
            top: -10px;
            background: rgba(12,12,12,.92);
            border: 1px solid rgba(55,55,55,.95);
            padding: 8px;
            box-sizing: border-box;
            flex-direction: column;
            gap: 8px;
            z-index: 1000003;
        `;

        const btnCompass = document.createElement("button");
        btnCompass.id = "dihelper_btn_compass";
        btnCompass.textContent = "COMPASS";
        btnCompass.style.cssText = `
            width: 170px;
            padding: 8px 10px;
            border-radius: 0;
            border: 1px solid rgba(55,55,55,.95);
            background: rgba(255,255,255,.08);
            color: #fff;
            cursor: pointer;
            text-align: center;
            box-sizing: border-box;
        `;
        btnCompass.onclick = () => this.onToggleCompass();

        const btnMinimap = document.createElement("button");
        btnMinimap.id = "dihelper_btn_minimap";
        btnMinimap.textContent = "MINIMAP";
        btnMinimap.style.cssText = `
            width: 170px;
            padding: 8px 10px;
            border-radius: 0;
            border: 1px solid rgba(55,55,55,.95);
            background: rgba(255,255,255,.08);
            color: #fff;
            cursor: pointer;
            text-align: center;
            box-sizing: border-box;
        `;
        btnMinimap.onclick = () => this.onToggleMinimap();

        const zoomWrapper = document.createElement("div");
        zoomWrapper.style.cssText = `
            position: relative;
        `;

        const btnZoom = document.createElement("button");
        btnZoom.id = "dihelper_btn_zoom";
        btnZoom.textContent = "ZOOM";
        btnZoom.style.cssText = `
            width: 170px;
            padding: 8px 10px;
            border-radius: 0;
            border: 1px solid rgba(55,55,55,.95);
            background: rgba(255,255,255,.08);
            color: #fff;
            cursor: pointer;
            text-align: center;
            box-sizing: border-box;
        `;
        btnZoom.onclick = () => this.toggleZoomSubmenu();

        const zoomSubmenu = document.createElement("div");
        zoomSubmenu.id = "dihelper_zoom_submenu";
        zoomSubmenu.style.cssText = `
            display: none;
            position: absolute;
            left: calc(100% + 15px);
            top: -50px;
            background: rgba(12,12,12,.92);
            border: 1px solid rgba(55,55,55,.95);
            padding: 8px;
            box-sizing: border-box;
            flex-direction: column;
            gap: 8px;
            z-index: 1000004;
        `;

        const btnZoomIn = document.createElement("button");
        btnZoomIn.id = "dihelper_btn_zoom_in";
        btnZoomIn.textContent = "+";
        btnZoomIn.style.cssText = `
            width: 60px;
            padding: 8px 10px;
            border-radius: 0;
            border: 1px solid rgba(55,55,55,.95);
            background: rgba(255,255,255,.08);
            color: #fff;
            cursor: pointer;
            text-align: center;
            box-sizing: border-box;
        `;
        btnZoomIn.onclick = () => this.onZoomIn();

        const btnZoomOut = document.createElement("button");
        btnZoomOut.id = "dihelper_btn_zoom_out";
        btnZoomOut.textContent = "-";
        btnZoomOut.style.cssText = `
            width: 60px;
            padding: 8px 10px;
            border-radius: 0;
            border: 1px solid rgba(55,55,55,.95);
            background: rgba(255,255,255,.08);
            color: #fff;
            cursor: pointer;
            text-align: center;
            box-sizing: border-box;
        `;
        btnZoomOut.onclick = () => this.onZoomOut();

        zoomSubmenu.appendChild(btnZoomIn);
        zoomSubmenu.appendChild(btnZoomOut);

        zoomWrapper.appendChild(btnZoom);
        zoomWrapper.appendChild(zoomSubmenu);

        mapSubmenu.appendChild(btnCompass);
        mapSubmenu.appendChild(btnMinimap);
        mapSubmenu.appendChild(zoomWrapper);

        mainColumn.appendChild(btnInv);
        mainColumn.appendChild(btnMap);
        mainColumn.appendChild(mapSubmenu);

        panel.appendChild(mainColumn);

        const row = document.createElement("div");
        row.style.cssText = `
            display: flex;
            gap: 8px;
            align-items: center;
        `;

        const main = document.createElement("button");
        main.id = "dihelper_menu_btn";
        main.textContent = "diHelper";
        main.title = "diHelper menu";
        main.style.cssText = `
            padding: 8px 12px;
            min-height: 42px;
            border-radius: 0;
            border: 1px solid rgba(55,55,55,.95);
            background: rgba(12,12,12,.82);
            color: #fff;
            cursor: pointer;
            font-weight: bold;
            font-size: 12px;
        `;
        main.onclick = () => this.togglePanel();

        const btnStart = document.createElement("button");
        btnStart.id = "dihelper_btn_start";
        btnStart.textContent = "Start";
        btnStart.title = "Iniciar diHelper";
        btnStart.style.cssText = `
            padding: 8px 10px;
            min-height: 42px;
            border-radius: 0;
            border: 1px solid rgba(55,55,55,.95);
            background: rgba(0,180,0,.45);
            color: #fff;
            cursor: pointer;
            font-weight: bold;
            font-size: 12px;
        `;
        btnStart.onclick = () => this.onStart();

        const btnStop = document.createElement("button");
        btnStop.id = "dihelper_btn_stop";
        btnStop.textContent = "Stop";
        btnStop.title = "Parar diHelper";
        btnStop.style.cssText = `
            padding: 8px 10px;
            min-height: 42px;
            border-radius: 0;
            border: 1px solid rgba(55,55,55,.95);
            background: rgba(200,0,0,.45);
            color: #fff;
            cursor: pointer;
            font-weight: bold;
            font-size: 12px;
        `;
        btnStop.onclick = () => this.onStop();

        row.appendChild(main);
        row.appendChild(btnStart);
        row.appendChild(btnStop);

        root.appendChild(panel);
        root.appendChild(row);

        (document.body || document.documentElement).appendChild(root);

        this.root = root;
        this.panel = panel;
        this.mainButton = main;
        this.startButton = btnStart;
        this.stopButton = btnStop;

        this.invButton = btnInv;
        this.mapButton = btnMap;
        this.mapSubmenu = mapSubmenu;

        this.compassButton = btnCompass;
        this.minimapButton = btnMinimap;

        this.zoomButton = btnZoom;
        this.zoomSubmenu = zoomSubmenu;
        this.zoomInButton = btnZoomIn;
        this.zoomOutButton = btnZoomOut;

        console.log("[DIHELPER] MenuUI montado ✅");
    }

    ensureMounted() {
        this.mount();
    }

    openPanel() {
        if (!this.panel) return;
        this.panel.style.display = "block";
    }

    closePanel() {
        if (!this.panel) return;
        this.panel.style.display = "none";
        this.closeMapSubmenu();
        this.closeZoomSubmenu();
    }

    togglePanel() {
        if (!this.panel) return;

        const isClosed = this.panel.style.display === "none";
        this.panel.style.display = isClosed ? "block" : "none";

        if (!isClosed) {
            this.closeMapSubmenu();
            this.closeZoomSubmenu();
        }
    }

    openMapSubmenu() {
        if (!this.mapSubmenu) return;
        this.mapSubmenu.style.display = "flex";
    }

    closeMapSubmenu() {
        if (!this.mapSubmenu) return;
        this.mapSubmenu.style.display = "none";
        this.closeZoomSubmenu();
    }

    toggleMapSubmenu() {
        if (!this.mapSubmenu) return;

        const isClosed = this.mapSubmenu.style.display === "none";
        this.mapSubmenu.style.display = isClosed ? "flex" : "none";

        if (!isClosed) {
            this.closeZoomSubmenu();
        }
    }

    openZoomSubmenu() {
        if (!this.zoomSubmenu) return;
        this.zoomSubmenu.style.display = "flex";
    }

    closeZoomSubmenu() {
        if (!this.zoomSubmenu) return;
        this.zoomSubmenu.style.display = "none";
    }

    toggleZoomSubmenu() {
        if (!this.zoomSubmenu) return;

        this.zoomSubmenu.style.display =
            this.zoomSubmenu.style.display === "none" ? "flex" : "none";
    }
}