const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["src/index.js"],
  bundle: true,
  outfile: "dist/dihelper.bundle.js",
  format: "iife",
  target: ["es2020"],
}).then(() => {
  console.log("Build concluído!");
}).catch(() => process.exit(1));