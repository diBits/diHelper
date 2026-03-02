import { textureById } from "../game/textureById.js";
import { findStage } from "../game/findStage.js";

function getQty(item) {
  if (!item) return 0;

  const v = item.qty ?? item.qtd ?? item.amount ?? item.amt ?? item.count ?? item.num;

  if (typeof v === "number") return v;

  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  }

  if (Array.isArray(item) && typeof item[1] === "number") return item[1];

  return 0;
}

function getName(item) {
  if (!item) return "";

  const v =
    item.n ??
    item.name ??
    item.nm ??
    item.title ??
    item.itemName ??
    item.item_name ??
    item.displayName ??
    item.display_name;

  return typeof v === "string" ? v.trim() : "";
}

export function createInvOverlay(opts = {}) {
  const { PIXI } = window;
  if (!PIXI || !window.jv) throw new Error("PIXI/jv não disponíveis ainda");

  const stage = findStage();
  if (!stage) throw new Error("Stage não encontrado");

  // ====== CONFIG ======
  const slotsTotal = opts.slots ?? 75;

  // ✅ 5 blocos de 15 (3x5)
  const groupSize = 15;
  const groups = Math.ceil(slotsTotal / groupSize); // 5
  const groupCols = 3;
  const groupRows = 5;

  const size = opts.size ?? 22;
  const gap = opts.gap ?? 6;

  const groupGap = opts.groupGap ?? 14;

  const panelX = opts.x ?? 12;
  const panelY = opts.y ?? 60;

  // ✅ CORES DAS BORDAS (1 por bloco)
  // ajuste livre: [bag1, bag2, bag3, bag4, bag5]
  const groupBorderColors = opts.groupBorderColors ?? [
    0x2aa7ff, // azul
    0xffd400, // amarelo
    0xffffff, // branco
    0x7cff00, // verde
    0xff4be1, // rosa
  ];

  const borderAlpha = opts.borderAlpha ?? 0.95;
  const borderThickness = opts.borderThickness ?? 1.5;
  const borderRadius = opts.borderRadius ?? 10;

  const root = new PIXI.Container();
  root.zIndex = 999999;
  root.sortableChildren = true;

  root.scale.set(1, 1);
  root.x = panelX;
  root.y = panelY;
  stage.addChild(root);

  const panel = new PIXI.Container();
  root.addChild(panel);

  const pad = 12;
  const startX = pad;
  const startY = pad;

  const slots = [];
  const nameTexts = [];
  const qtyTexts = [];

  // ====== TAMANHO FUNDO ======
  const blockW = groupCols * (size + gap) - gap;
  const blockH = groupRows * (size + gap) - gap;

  const w = pad + groups * blockW + (groups - 1) * groupGap + pad;
  const h = pad + blockH + pad;

  // Fundo geral
  const bg = new PIXI.Graphics();
  bg.beginFill(0x000000, 0.45);
  bg.drawRoundedRect(0, 0, w, h, 12);
  bg.endFill();
  panel.addChild(bg);

  // ✅ BORDAS POR BLOCO (bag)
  // desenha um retângulo por grupo, alinhado ao grid
  const borders = new PIXI.Graphics();
  for (let g = 0; g < groups; g++) {
    const bx = startX + g * (blockW + groupGap) - 6; // margem externa
    const by = startY - 6;
    const bw = blockW + 12;
    const bh = blockH + 12;

    const color = groupBorderColors[g % groupBorderColors.length];

    borders.lineStyle(borderThickness, color, borderAlpha);
    borders.drawRoundedRect(bx, by, bw, bh, borderRadius);
  }
  panel.addChild(borders);

  // Reservas pequenas
  const topTextH = Math.max(8, Math.floor(size * 0.22));
  const iconSize = Math.floor(size * 0.92);

  for (let i = 0; i < slotsTotal; i++) {
    const group = Math.floor(i / groupSize);
    const idx = i % groupSize;

    const col = idx % groupCols;
    const row = Math.floor(idx / groupCols);

    const baseX = startX + group * (blockW + groupGap) + col * (size + gap);
    const baseY = startY + row * (size + gap);

    // Nome
    const nm = new PIXI.Text("", {
      fontFamily: "Verdana",
      fontSize: Math.max(8, Math.floor(size * 0.22)),
      fill: 0xffffff,
      dropShadow: true,
      dropShadowDistance: 1,
      dropShadowBlur: 2,
    });
    nm.anchor.set(0.5, 0);
    nm.x = baseX + size / 2;
    nm.y = baseY + 1;
    panel.addChild(nm);
    nameTexts.push(nm);

    // Ícone
    const spr = new PIXI.Sprite(textureById(791) || PIXI.Texture.WHITE);
    spr.width = iconSize;
    spr.height = iconSize;
    spr.x = baseX + Math.floor((size - iconSize) / 2);
    spr.y = baseY + topTextH + Math.floor((size - topTextH - iconSize) / 2);
    panel.addChild(spr);
    slots.push(spr);

    // ✅ garante nome na frente do ícone
    panel.addChild(nm);

    // Qty
    const qt = new PIXI.Text("", {
      fontFamily: "Verdana",
      fontSize: Math.max(8, Math.floor(size * 0.22)),
      fill: 0xffffff,
      dropShadow: true,
      dropShadowDistance: 1,
      dropShadowBlur: 2,
    });
    qt.anchor.set(0.5, 1);
    qt.x = baseX + size / 2;
    qt.y = baseY + size - 2;
    panel.addChild(qt);
    qtyTexts.push(qt);

    // ✅ nome no topo absoluto (por segurança)
    panel.addChild(nm);
  }

  panel.visible = true;

  function update() {
    const data = window.item_data || [];

    for (let i = 0; i < slotsTotal; i++) {
      const item = data[i];

      const tex = item?.spr !== undefined ? textureById(item.spr) : textureById(791);
      slots[i].texture = tex || PIXI.Texture.WHITE;

      const rawName = getName(item);
      nameTexts[i].text = rawName ? rawName.slice(0, 5) : "";

      const q = getQty(item);
      qtyTexts[i].text = q > 1 ? `x${q}` : "";
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