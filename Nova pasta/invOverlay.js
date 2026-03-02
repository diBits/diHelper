import { textureById } from "../game/textureById.js";
import { findStage } from "../game/findStage.js";

export function createInvOverlay() {
  const info = new PIXI_GLOBAL.Text("overlay OK ✅", {
    fontFamily: "Verdana",
    fontSize: 12,
    fill: 0xffffff,
  });
  info.x = 10;
  info.y = 26;
  panel.addChild(info);

  const PIXI_GLOBAL_GLOBAL = window.PIXI_GLOBAL;
  const jv = window.jv;
  if (!PIXI_GLOBAL || !jv) throw new Error("PIXI_GLOBAL/jv não disponíveis ainda");

  const stage = findStage();
  if (!stage) throw new Error("Stage não encontrado");

  // container do overlay
  const root = new PIXI_GLOBAL.Container();
  root.zIndex = 999999;
  root.sortableChildren = true;
  stage.addChild(root);

  // painel (estilo simples, sem depender de jv.Dialog)
  const panel = new PIXI_GLOBAL.Container();
  panel.x = 12;
  panel.y = 60;
  root.addChild(panel);

  // fundo
  const bg = new PIXI_GLOBAL.Graphics();
  bg.beginFill(0x000000, 0.55);
  bg.drawRoundedRect(0, 0, 340, 220, 10);
  bg.endFill();
  panel.addChild(bg);

  // título
  const title = new PIXI_GLOBAL.Text("INV+", {
    fontFamily: "Verdana",
    fontSize: 16,
    fill: 0xffffff,
  });
  title.x = 10;
  title.y = 8;
  panel.addChild(title);

  // grid 5x5 (25 slots) pra começar LEVE
  const slots = [];
  const startX = 10;
  const startY = 35;
  const size = 32;
  const gap = 4;

  for (let i = 0; i < 25; i++) {
    const spr = new PIXI_GLOBAL.Sprite(textureById(791) || PIXI_GLOBAL.Texture.WHITE);
    spr.width = size;
    spr.height = size;

    const col = i % 5;
    const row = Math.floor(i / 5);
    spr.x = startX + col * (size + gap);
    spr.y = startY + row * (size + gap);

    panel.addChild(spr);
    slots.push(spr);
  }

  // toggle visível
  panel.visible = true;

  // botão “INV+”
  const btn = new PIXI_GLOBAL.Text("INV+", {
    fontFamily: "Verdana",
    fontSize: 14,
    fill: 0xffffff,
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
    if (!data) return; // overlay continua vivo, só não preenche itens ainda

    for (let i = 0; i < 25; i++) {
      const item = data[i];
      const tex = item?.spr !== undefined ? textureById(item.spr) : textureById(791);
      slots[i].texture = tex || PIXI_GLOBAL.Texture.WHITE;
    }
  }

  const timer = setInterval(update, 250);
  update();

  return {
    destroy() {
      clearInterval(timer);
      root.removeFromParent?.();
      root.destroy({ children: true });
    },
  };
}