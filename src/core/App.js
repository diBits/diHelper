import { createInvOverlay } from "../ui/invOverlay.js";

export class App {
  constructor() {
    this.inv = null;
    this.starting = false;

    console.log("[DIHELPER] App inicializado ✅");
  }

  createMenu() {
    const rootId = "dihelper_menu_root";
    if (document.getElementById(rootId)) return;

    const root = document.createElement("div");
    root.id = rootId;
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
      background:rgba(0,0,0,.75);
      border:1px solid rgba(255,255,255,.15);
      border-radius:10px;
      padding:8px;
      min-width:220px;
    `;

    const btnInv = document.createElement("button");
    btnInv.textContent = "INV+";
    btnInv.style.cssText = `
      width:100%;
      padding:8px 10px;
      border-radius:8px;
      border:1px solid rgba(255,255,255,.2);
      background:rgba(255,255,255,.08);
      color:#fff;
      cursor:pointer;
      text-align:left;
    `;
    btnInv.onclick = () => this.toggleInventory();

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
      border-radius:12px;
      border:1px solid rgba(255,255,255,.25);
      background:rgba(0,0,0,.65);
      color:#fff;
      cursor:pointer;
      font-weight:bold;
      font-size:12px;
    `;
    main.onclick = () => {
      panel.style.display = panel.style.display === "none" ? "block" : "none";
    };

    const btnStart = document.createElement("button");
    btnStart.id = "dihelper_btn_start";
    btnStart.textContent = "Start";
    btnStart.title = "Iniciar diHelper";
    btnStart.style.cssText = `
      padding:8px 10px;
      min-height:42px;
      border-radius:12px;
      border:1px solid rgba(255,255,255,.20);
      background:rgba(0,180,0,.55);
      color:#fff;
      cursor:pointer;
      font-weight:bold;
      font-size:12px;
    `;
    btnStart.onclick = () => this.start();

    const btnStop = document.createElement("button");
    btnStop.id = "dihelper_btn_stop";
    btnStop.textContent = "Stop";
    btnStop.title = "Parar diHelper";
    btnStop.style.cssText = `
      padding:8px 10px;
      min-height:42px;
      border-radius:12px;
      border:1px solid rgba(255,255,255,.20);
      background:rgba(200,0,0,.55);
      color:#fff;
      cursor:pointer;
      font-weight:bold;
      font-size:12px;
    `;
    btnStop.onclick = () => this.stop();

    row.appendChild(main);
    row.appendChild(btnStart);
    row.appendChild(btnStop);

    root.appendChild(panel);
    root.appendChild(row);

    (document.body || document.documentElement).appendChild(root);

    console.log("[DIHELPER] menu OK ✅ (persistente)");
  }

  ensureMenu() {
    this.createMenu();
  }

  waitAndStart(tries = 0) {
    const ok = window.PIXI && window.jv;

    if (ok) {
      try {
        this.ensureMenu();

        if (!this.inv) {
          const created = createInvOverlay({
            slots: 75,
            cols: 15,
            rows: 5,
            size: 30,
            gap: 6,
            x: 12,
            y: 50,
          });

          created.hide();
          this.inv = created;

          console.log("[DIHELPER] INV overlay criado ✅ (inicia fechado)");
        }
      } catch (e) {
        console.error("[DIHELPER] falha ao iniciar:", e);
      } finally {
        this.starting = false;
      }
      return;
    }

    if (tries > 600) {
      console.warn("[DIHELPER] timeout esperando PIXI/jv");
      this.starting = false;
      return;
    }

    setTimeout(() => this.waitAndStart(tries + 1), 100);
  }

  start() {
    if (this.inv) return;
    if (this.starting) return;

    this.starting = true;
    this.waitAndStart(0);
  }

  stop() {
    try {
      this.inv?.destroy?.();
    } catch {}

    this.inv = null;

    console.log("[DIHELPER] stop ✅ (menu permanece)");
  }

  toggleInventory() {
    if (!this.inv) {
      this.start();
      setTimeout(() => this.inv?.toggle?.(), 250);
      return;
    }

    this.inv.toggle();
  }

  exposeDebug() {
    window.diStart = () => this.start();
    window.diStop = () => this.stop();
    window.diInvToggle = () => this.toggleInventory();
  }

  mount() {
    this.exposeDebug();
    this.ensureMenu();
  }
}