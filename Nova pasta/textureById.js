function spr2pos(spr) {
  return { x: spr % 16, y: Math.floor(spr / 16) };
}

export function textureById(id = 0) {
  const PIXI_GLOBAL = window.PIXI_GLOBAL;

  // tenta achar items/tiles em mais lugares
  const items =
    window.items ||
    window.jv?.items ||
    window.jv?.textures?.items;

  const tiles =
    window.tiles ||
    window.jv?.tiles ||
    window.jv?.textures?.tiles;

  // fallback seguro
  const fallback = PIXI_GLOBAL?.Texture?.WHITE ?? null;

  if (!items || !tiles) return fallback;

  if (id === 0) return items?.[0]?.[0] ?? fallback;

  if (id < 0) {
    const pos = spr2pos(Math.abs(id));
    return tiles?.[pos.x]?.[pos.y] ?? fallback;
  }

  const pos = spr2pos(id);
  return items?.[pos.x]?.[pos.y] ?? fallback;
}