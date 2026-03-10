import { textureById } from "../../game/textureById.js";
import { findStage } from "../../game/findStage.js";

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

function getLocalPoint(panel, event) {
  try {
    return event?.data?.getLocalPosition(panel) ?? { x: 0, y: 0 };
  } catch {
    return { x: 0, y: 0 };
  }
}

function sendSwap(fromSlot, toSlot) {
  if (fromSlot === toSlot) return false;
  if (fromSlot == null || toSlot == null) return false;

  const sender =
    (typeof window.send === "function" && window.send) ||
    (typeof window.jv?.send === "function" && window.jv.send) ||
    null;

  if (!sender) {
    console.warn("[DIHELPER] InventoryOverlay: função send não encontrada");
    return false;
  }

  try {
    sender({ type: "sw", slot: fromSlot, swap: toSlot });
    console.log("[DIHELPER] InventoryOverlay: swap enviado ✅", {
      from: fromSlot,
      to: toSlot,
    });
    return true;
  } catch (e) {
    console.error("[DIHELPER] InventoryOverlay: falha ao enviar swap:", e);
    return false;
  }
}

export function createInvOverlay(opts = {}) {
  const { PIXI } = window;
  if (!PIXI || !window.jv) throw new Error("PIXI/jv não disponíveis ainda");

  const stage = findStage();
  if (!stage) throw new Error("Stage não encontrado");

  const slotsTotal = opts.slots ?? 75;

  const groupSize = 15;
  const groups = Math.ceil(slotsTotal / groupSize);
  const groupCols = 3;
  const groupRows = 5;

  const size = opts.size ?? 22;
  const gap = opts.gap ?? 6;
  const groupGap = opts.groupGap ?? 14;

  const panelX = opts.x ?? 12;
  const panelY = opts.y ?? 60;

  const root = new PIXI.Container();
  root.zIndex = 999999;
  root.sortableChildren = true;

  root.scale.set(1, 1);
  root.x = panelX;
  root.y = panelY;
  stage.addChild(root);

  const panel = new PIXI.Container();
  panel.sortableChildren = true;
  root.addChild(panel);

  const pad = 12;

  const slots = [];
  const slotMeta = [];
  const nameTexts = [];
  const qtyTexts = [];

  const blockW = groupCols * (size + gap) - gap;
  const blockH = groupRows * (size + gap) - gap;

  const extraBottom = 18;
  const w = pad + groups * blockW + (groups - 1) * groupGap + pad;
  const h = pad + blockH + pad + extraBottom;

  const innerAvailableH = h - pad - pad;
  const startX = pad;
  const startY = pad + Math.floor((innerAvailableH - blockH) / 2);

  const bg = new PIXI.Graphics();
  bg.lineStyle(3, 0x3a3a3a, 0.95);
  bg.beginFill(0x111111, 0.72);
  bg.drawRoundedRect(0, 0, w, h, 6);
  bg.endFill();
  panel.addChild(bg);

  const bagBorders = new PIXI.Graphics();
  bagBorders.lineStyle(1, 0x7a7a7a, 1);

  for (let group = 0; group < groups; group++) {
    const bagX = startX + group * (blockW + groupGap);
    const bagY = startY;

    bagBorders.drawRoundedRect(
      bagX - 4,
      bagY - 4,
      blockW + 8,
      blockH + 8,
      4
    );
  }

  panel.addChild(bagBorders);

  const slotHighlights = new PIXI.Graphics();
  panel.addChild(slotHighlights);

  const topTextH = Math.max(8, Math.floor(size * 0.22));
  const iconSize = Math.floor(size * 0.92);

  let dragSprite = null;
  let dragStartSlot = null;

  function restoreDraggedSprite() {
    if (!dragSprite) return;

    const meta = slotMeta[dragStartSlot];
    if (meta) {
      dragSprite.x = meta.spriteX;
      dragSprite.y = meta.spriteY;
    }

    dragSprite.scale.set(1, 1);
    dragSprite.alpha = 1;
    dragSprite.zIndex = 1;

    dragSprite
      .off("mousemove", onDragMove)
      .off("touchmove", onDragMove)
      .off("mouseup", onDragEnd)
      .off("mouseupoutside", onDragEnd)
      .off("touchend", onDragEnd)
      .off("touchendoutside", onDragEnd);

    dragSprite = null;
    dragStartSlot = null;
  }

  function findDropTarget(localX, localY) {
    for (const meta of slotMeta) {
      if (!meta) continue;

      const inside =
        localX >= meta.baseX &&
        localX <= meta.baseX + size &&
        localY >= meta.baseY &&
        localY <= meta.baseY + size;

      if (inside) return meta.slot;
    }

    return null;
  }

  function onDragMove(event) {
    if (!dragSprite) return;

    const point = getLocalPoint(panel, event);
    dragSprite.x = point.x - iconSize / 2;
    dragSprite.y = point.y - iconSize / 2;
  }

  function onDragEnd(event) {
    if (!dragSprite) return;

    const point = getLocalPoint(panel, event);
    const targetSlot = findDropTarget(point.x, point.y);

    if (
      targetSlot !== null &&
      dragStartSlot !== null &&
      targetSlot !== dragStartSlot
    ) {
      sendSwap(dragStartSlot, targetSlot);
    }

    restoreDraggedSprite();
  }

  function onDragStart(event) {
    if (dragSprite) return;

    dragSprite = this;
    dragStartSlot = this.slotIndex;

    dragSprite.scale.set(1.25, 1.25);
    dragSprite.alpha = 0.95;
    dragSprite.zIndex = 1000;

    dragSprite
      .on("mousemove", onDragMove)
      .on("touchmove", onDragMove)
      .on("mouseup", onDragEnd)
      .on("mouseupoutside", onDragEnd)
      .on("touchend", onDragEnd)
      .on("touchendoutside", onDragEnd);

    onDragMove(event);
  }

  for (let i = 0; i < slotsTotal; i++) {
    const group = Math.floor(i / groupSize);
    const idx = i % groupSize;

    const col = idx % groupCols;
    const row = Math.floor(idx / groupCols);

    const baseX = startX + group * (blockW + groupGap) + col * (size + gap);
    const baseY = startY + row * (size + gap);

    if (i >= 0 && i <= 5) {
      slotHighlights.beginFill(0xffd400, 0.3);
      slotHighlights.drawRoundedRect(baseX, baseY, size, size, 5);
      slotHighlights.endFill();
    }

    const spr = new PIXI.Sprite(textureById(791) || PIXI.Texture.WHITE);
    spr.width = iconSize;
    spr.height = iconSize;
    spr.x = baseX + Math.floor((size - iconSize) / 2);
    spr.y = baseY + topTextH + Math.floor((size - topTextH - iconSize) / 2);
    spr.zIndex = 1;
    spr.slotIndex = i;
    spr.interactive = true;
    spr.buttonMode = true;

    spr
      .on("mousedown", onDragStart)
      .on("touchstart", onDragStart);

    panel.addChild(spr);
    slots.push(spr);

    const nm = new PIXI.Text("", {
      fontFamily: "Verdana",
      fontSize: Math.max(8, Math.floor(size * 0.22)),
      fill: 0xffffff,
      fontWeight: "bold",
      stroke: 0x000000,
      strokeThickness: 2,
      dropShadow: true,
      dropShadowDistance: 1,
      dropShadowBlur: 2,
    });
    nm.anchor.set(0.5, 0);
    nm.x = baseX + size / 2;
    nm.y = baseY - 3;
    panel.addChild(nm);
    nameTexts.push(nm);

    slotMeta.push({
      slot: i,
      baseX,
      baseY,
      spriteX: spr.x,
      spriteY: spr.y,
    });

    const qt = new PIXI.Text("", {
      fontFamily: "Verdana",
      fontSize: Math.max(8, Math.floor(size * 0.22)),
      fill: 0xffffff,
      fontWeight: "bold",
      stroke: 0x000000,
      strokeThickness: 2,
      dropShadow: true,
      dropShadowDistance: 1,
      dropShadowBlur: 2,
    });
    qt.anchor.set(0.5, 1);
    qt.x = baseX + size / 2;
    qt.y = baseY + size + 3;
    qt.zIndex = 3;
    panel.addChild(qt);
    qtyTexts.push(qt);
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

      if (!(dragSprite && dragStartSlot === i)) {
        const meta = slotMeta[i];
        if (meta) {
          slots[i].x = meta.spriteX;
          slots[i].y = meta.spriteY;
        }
      }
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
      restoreDraggedSprite();
      root.removeFromParent?.();
      root.destroy({ children: true });
    },
  };
}