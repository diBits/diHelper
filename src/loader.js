// src/loader.js
(() => {
  const src = chrome.runtime.getURL("dist/dihelper.bundle.js");

  const inject = () => {
    // evita duplicar em reload/F5
    if (document.getElementById("dihelper_injected")) return;

    const s = document.createElement("script");
    s.id = "dihelper_injected";
    s.src = src;
    s.type = "text/javascript";
    s.onload = () => s.remove();

    const parent = document.documentElement || document.head || document.body;
    if (!parent) return false;

    parent.appendChild(s);
    console.log("[DIHELPER] loader injected:", src);
    return true;
  };

  if (!inject()) {
    setTimeout(inject, 50);
  }
})();