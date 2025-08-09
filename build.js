const p = require("node:path");
const fs = require("node:fs");
const esbuild = require("esbuild");
const { minify } = require("html-minifier-terser");
const sass = require("sass");

const fsp = fs.promises;

async function main() {
  await esbuild.build({
    entryPoints: [p.join("src", "index.ts")],
    bundle: true,
    minify: true,
    sourcemap: true,
    outfile: p.join("dist", "index.bundle.js"),
  });

  const html = await fsp.readFile(p.join("src", "index.html"), "utf-8");
  const compressed = await minify(html, { collapseWhitespace: true });
  await fsp.writeFile(p.join("dist", "index.html"), compressed);

  const { css } = sass.compile(p.join("src", "index.scss"), {
    style: "compressed",
  });
  await fsp.writeFile(p.join("dist", "index.bundle.css"), css);

  for (const icon of await fsp.readdir("icons")) {
    if (!icon.endsWith(".png")) {
      continue;
    }
    await fsp.copyFile(p.join("icons", icon), p.join("dist", icon));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
