import { textureById } from "../game/textureById.js";
import { findStage } from "../game/findStage.js";

function getQty(item) {
  if (!item) return 0;

  // tenta vários nomes comuns (porque o jogo pode chamar diferente)
  const v =
    item.qty ?? item.qtd ?? item.amount ?? item.amt ?? item.count ?? item.num ?? item.n;

  // se vier como string/numero
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  }

  // alguns jogos guardam em array: [spr, qty]
  if (Array.isArray(item) && typeof item[1] === "number") return item[1];

  return 0;
}

export function createInvOverlay(opts = {}) {
  const { PIXI } = window;
  if (!PIXI || !window.jv) throw new Error("PIXI/jv não disponíveis ainda");

  const stage = findStage();
  if (!stage) throw new Error("Stage não encontrado");

  const slotsTotal = opts.slots ?? 75;
  const cols = opts.cols ?? 15;
  const rows = opts.rows ?? 5;

  const size = opts.size ?? 28;
  const gap = opts.gap ?? 6;

  // container root
  const root = new PIXI.Container();
  root.zIndex = 999999;
  root.sortableChildren = true;
  stage.addChild(root);

  // painel
  const panel = new PIXI.Container();
  panel.x = 12;
  panel.y = 60;
  root.addChild(panel);

  const startX = 10;
  const startY = 42; // um pouco mais pra baixo pra caber o header

  const w = startX + cols * (size + gap) + 10;
  const h = startY + rows * (size + gap) + 14;

  const bg = new PIXI.Graphics();
  bg.beginFill(0x000000, 0.55);
  bg.drawRoundedRect(0, 0, w, h, 10);
  bg.endFill();
  panel.addChild(bg);

  const title = new PIXI.Text(`INV+ (${slotsTotal} slots)`, {
    fontFamily: "Verdana",
    fontSize: 14,
    fill: 0xffffff,
  });
  title.x = 10;
  title.y = 8;
  panel.addChild(title);

  const info = new PIXI.Text("overlay OK ✅", {
    fontFamily: "Verdana",
    fontSize: 12,
    fill: 0xffffff,
  });
  info.x = 10;
  info.y = 22;
  panel.addChild(info);

  // grid
  const slots = [];
  const qtyTexts = [];

  for (let i = 0; i < slotsTotal; i++) {
    const spr = new PIXI.Sprite(textureById(791) || PIXI.Texture.WHITE);
    spr.width = size;
    spr.height = size;

    const col = i % cols;
    const row = Math.floor(i / cols);
    spr.x = startX + col * (size + gap);
    spr.y = startY + row * (size + gap);

    panel.addChild(spr);
    slots.push(spr);

    // qty (bem “embaixo” dentro do slot)
    const qt = new PIXI.Text("", {
      fontFamily: "Verdana",
      fontSize: Math.max(10, Math.floor(size * 0.38)),
      fill: 0xffffff,
      dropShadow: true,
      dropShadowDistance: 1,
      dropShadowBlur: 2,
    });
    qt.anchor.set(1, 1);
    qt.x = spr.x + size - 1;
    qt.y = spr.y + size - 1;
    panel.addChild(qt);
    qtyTexts.push(qt);
  }

  // o index chama hide()
  panel.visible = true;

  function update() {
    const data = window.item_data || [];

    for (let i = 0; i < slotsTotal; i++) {
      const item = data[i];

      const tex = item?.spr !== undefined ? textureById(item.spr) : textureById(791);
      slots[i].texture = tex || PIXI.Texture.WHITE;

      const q = getQty(item);
      qtyTexts[i].text = q > 1 ? String(q) : "";
    }
  }

  const timer = setInterval(update, 250);
  update();

  return {
    show() { panel.visible = true; },
    hide() { panel.visible = false; },
    toggle() { panel.visible = !panel.visible; },
    destroy() {
      clearInterval(timer);
      root.removeFromParent?.();
      root.destroy({ children: true });
    },
  };
}