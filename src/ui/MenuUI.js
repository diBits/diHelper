export class MenuUI {
    constructor(options = {}) {
        this.onStart = options.onStart ?? (() => { });
        this.onStop = options.onStop ?? (() => { });
        this.onToggleInventory = options.onToggleInventory ?? (() => { });

        this.root = null;
        this.panel = null;
        this.mainButton = null;
        this.startButton = null;
        this.stopButton = null;
        this.invButton = null;
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
            return;
        }

        const root = document.createElement("div");
        root.id = "dihelper_menu_root";
        root.style.cssText = `
      position:fixed;
      left:12px;
      bottom:12px;
      z-index:999999;
      font-family: Arial, sans-serif;
      display:flex;
      flex-direction:column;
      align-items:flex-start;
    `;

        const panel = document.createElement("div");
        panel.id = "dihelper_menu_panel";
        panel.style.cssText = `
      display:none;
      margin-bottom:8px;
      background:rgba(12,12,12,.82);
      border:1px solid rgba(55,55,55,.95);
      border-radius:0;
      padding:8px;
      width:fit-content;
      min-width:0;
      box-sizing:border-box;
    `;

        const btnInv = document.createElement("button");
        btnInv.id = "dihelper_btn_inv";
        btnInv.textContent = "INV+";
        btnInv.style.cssText = `
      width:170px;
      padding:8px 10px;
      border-radius:0;
      border:1px solid rgba(55,55,55,.95);
      background:rgba(255,255,255,.08);
      color:#fff;
      cursor:pointer;
      text-align:center;
      box-sizing:border-box;
    `;
        btnInv.onclick = () => this.onToggleInventory();

        panel.appendChild(btnInv);

        const row = document.createElement("div");
        row.style.cssText = `
      display:flex;
      gap:8px;
      align-items:center;
    `;

        const main = document.createElement("button");
        main.id = "dihelper_menu_btn";
        main.textContent = "diHelper";
        main.title = "diHelper menu";
        main.style.cssText = `
      padding:8px 12px;
      min-height:42px;
      border-radius:0;
      border:1px solid rgba(55,55,55,.95);
      background:rgba(12,12,12,.82);
      color:#fff;
      cursor:pointer;
      font-weight:bold;
      font-size:12px;
    `;
        main.onclick = () => this.togglePanel();

        const btnStart = document.createElement("button");
        btnStart.id = "dihelper_btn_start";
        btnStart.textContent = "Start";
        btnStart.title = "Iniciar diHelper";
        btnStart.style.cssText = `
      padding:8px 10px;
      min-height:42px;
      border-radius:0;
      border:1px solid rgba(55,55,55,.95);
      background:rgba(0,180,0,.45);
      color:#fff;
      cursor:pointer;
      font-weight:bold;
      font-size:12px;
    `;
        btnStart.onclick = () => this.onStart();

        const btnStop = document.createElement("button");
        btnStop.id = "dihelper_btn_stop";
        btnStop.textContent = "Stop";
        btnStop.title = "Parar diHelper";
        btnStop.style.cssText = `
      padding:8px 10px;
      min-height:42px;
      border-radius:0;
      border:1px solid rgba(55,55,55,.95);
      background:rgba(200,0,0,.45);
      color:#fff;
      cursor:pointer;
      font-weight:bold;
      font-size:12px;
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
    }

    togglePanel() {
        if (!this.panel) return;

        this.panel.style.display =
            this.panel.style.display === "none" ? "block" : "none";
    }
}