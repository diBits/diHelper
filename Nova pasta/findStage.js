export function findStage() {
  const jv = window.jv;
  if (!jv) return null;

  // tentativas diretas comuns
  if (jv.stage) return jv.stage;
  if (jv.app?.stage) return jv.app.stage;
  if (jv.game?.stage) return jv.game.stage;
  if (jv.root?.stage) return jv.root.stage;
  if (jv.root && typeof jv.root.addChild === "function") return jv.root;

  // fallback: procurar um Container dentro do jv
  for (const k of Object.keys(jv)) {
    const v = jv[k];
    if (!v) continue;
    if (typeof v.addChild === "function" && Array.isArray(v.children)) {
      return v;
    }
  }

  return null;
}