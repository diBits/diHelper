(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/game/textureById.js
  function spr2pos(spr) {
    return { x: spr % 16, y: Math.floor(spr / 16) };
  }
  function textureById(id = 0) {
    const PIXI = window.PIXI;
    const items = window.items || window.jv?.items || window.jv?.textures?.items;
    const tiles = window.tiles || window.jv?.tiles || window.jv?.textures?.tiles;
    const fallback = PIXI?.Texture?.WHITE ?? null;
    if (!items || !tiles) return fallback;
    if (id === 0) return items?.[0]?.[0] ?? fallback;
    if (id < 0) {
      const pos2 = spr2pos(Math.abs(id));
      return tiles?.[pos2.x]?.[pos2.y] ?? fallback;
    }
    const pos = spr2pos(id);
    return items?.[pos.x]?.[pos.y] ?? fallback;
  }
  var init_textureById = __esm({
    "src/game/textureById.js"() {
    }
  });

  // src/game/findStage.js
  function findStage() {
    const jv = window.jv;
    if (!jv) return null;
    if (jv.stage) return jv.stage;
    if (jv.app?.stage) return jv.app.stage;
    if (jv.game?.stage) return jv.game.stage;
    if (jv.root?.stage) return jv.root.stage;
    if (jv.root && typeof jv.root.addChild === "function") return jv.root;
    for (const k of Object.keys(jv)) {
      const v = jv[k];
      if (!v) continue;
      if (typeof v.addChild === "function" && Array.isArray(v.children)) {
        return v;
      }
    }
    return null;
  }
  var init_findStage = __esm({
    "src/game/findStage.js"() {
    }
  });

  // src/ui/invOverlay.js
  function createInvOverlay() {
    const info = new PIXI.Text("overlay OK \u2705", {
      fontFamily: "Verdana",
      fontSize: 12,
      fill: 16777215
    });
    info.x = 10;
    info.y = 26;
    panel.addChild(info);
    const { PIXI, jv } = window;
    if (!PIXI || !jv) throw new Error("PIXI/jv n\xE3o dispon\xEDveis ainda");
    const stage = findStage();
    if (!stage) throw new Error("Stage n\xE3o encontrado");
    const root = new PIXI.Container();
    root.zIndex = 999999;
    root.sortableChildren = true;
    stage.addChild(root);
    const panel = new PIXI.Container();
    panel.x = 12;
    panel.y = 60;
    root.addChild(panel);
    const bg = new PIXI.Graphics();
    bg.beginFill(0, 0.55);
    bg.drawRoundedRect(0, 0, 340, 220, 10);
    bg.endFill();
    panel.addChild(bg);
    const title = new PIXI.Text("INV+", {
      fontFamily: "Verdana",
      fontSize: 16,
      fill: 16777215
    });
    title.x = 10;
    title.y = 8;
    panel.addChild(title);
    const slots = [];
    const startX = 10;
    const startY = 35;
    const size = 32;
    const gap = 4;
    for (let i = 0; i < 25; i++) {
      const spr = new PIXI.Sprite(textureById(791) || PIXI.Texture.WHITE);
      spr.width = size;
      spr.height = size;
      const col = i % 5;
      const row = Math.floor(i / 5);
      spr.x = startX + col * (size + gap);
      spr.y = startY + row * (size + gap);
      panel.addChild(spr);
      slots.push(spr);
    }
    panel.visible = true;
    const btn = new PIXI.Text("INV+", {
      fontFamily: "Verdana",
      fontSize: 14,
      fill: 16777215
    });
    btn.x = 12;
    btn.y = 36;
    btn.interactive = true;
    btn.buttonMode = true;
    btn.zIndex = 999999;
    btn.on("pointerdown", () => {
      panel.visible = !panel.visible;
    });
    root.addChild(btn);
    function update() {
      const data = window.item_data;
      if (!data) return;
      for (let i = 0; i < 25; i++) {
        const item = data[i];
        const tex = item?.spr !== void 0 ? textureById(item.spr) : textureById(791);
        slots[i].texture = tex || PIXI.Texture.WHITE;
      }
    }
    const timer = setInterval(update, 250);
    update();
    return {
      destroy() {
        clearInterval(timer);
        root.removeFromParent?.();
        root.destroy({ children: true });
      }
    };
  }
  var init_invOverlay = __esm({
    "src/ui/invOverlay.js"() {
      init_textureById();
      init_findStage();
    }
  });

  // src/index.js
  var require_index = __commonJS({
    "src/index.js"() {
      init_invOverlay();
      var instance = null;
      console.log("[DIHELPER] index.js rodando no contexto da p\xE1gina \u2705");
      (function badge() {
        const id = "dihelper_badge";
        if (document.getElementById(id)) return;
        const el = document.createElement("div");
        el.id = id;
        el.textContent = "diHelper ON \u2705";
        el.style.cssText = `
    position:fixed;left:10px;top:10px;z-index:999999;
    background:rgba(0,0,0,.75);color:#fff;padding:6px 10px;
    font:12px Arial;border-radius:6px;
  `;
        document.documentElement.appendChild(el);
      })();
      function waitAndStart(tries = 0) {
        const ok = window.PIXI && window.jv;
        if (ok) {
          try {
            instance = createInvOverlay();
            console.log("[DIHELPER] INV overlay ON \u2705");
          } catch (e) {
            console.error("[DIHELPER] falha ao iniciar overlay:", e);
          }
          return;
        }
        if (tries > 600) {
          console.warn("[DIHELPER] timeout esperando PIXI/jv");
          return;
        }
        setTimeout(() => waitAndStart(tries + 1), 100);
      }
      window.diStart = () => waitAndStart(0);
      window.diStop = () => instance?.destroy?.();
      waitAndStart();
    }
  });
  require_index();
})();
