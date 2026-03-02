import { textureById } from "../game/textureById.js";
import { findStage } from "../game/findStage.js";

export function createInvOverlay(opts = {}) {
  const { PIXI } = window;
  if (!PIXI || !window.jv) throw new Error("PIXI/jv não disponíveis ainda");

  const stage = findStage();
  if (!stage) throw new Error("Stage não encontrado");

  const slotsTotal = opts.slots ?? 75;
  const cols = opts.cols ?? 15;
  const rows = opts.rows ?? 5;

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

  const size = 28;
  const gap = 4;
  const startX = 10;
  const startY = 36;

  const w = startX + cols * (size + gap) + 10;
  const h = startY + rows * (size + gap) + 12;

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
  }

  // começa visível? NÃO — o index chama hide()
  panel.visible = true;

  function update() {
    const data = window.item_data || [];

    for (let i = 0; i < slotsTotal; i++) {
      const item = data[i];
      const tex =
        item?.spr !== undefined
          ? textureById(item.spr)
          : textureById(791);

      slots[i].texture = tex || PIXI.Texture.WHITE;
    }
  }

  const timer = setInterval(update, 250);
  update();

  return {
    show() {
      panel.visible = true;
    },
    hide() {
      panel.visible = false;
    },
    toggle() {
      panel.visible = !panel.visible;
    },
    destroy() {
      clearInterval(timer);
      root.removeFromParent?.();
      root.destroy({ children: true });
    },
  };
}